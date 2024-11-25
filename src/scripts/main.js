'use strict';

// select all table pieces
const table = document.querySelector('table');
const rows = document.querySelector('tbody');
const head = document.querySelector('thead');

// prevent selecting for headers
head.style.userSelect = 'none';

// sorting parameters
const sortingParameters = {
  lastClickedCell: null,
  sortOrder: 'asc',

  get sortingName() {
    return this.lastClickedCell;
  },

  set sortingName(value) {
    return (this.lastClickedCell = value.textContent.toLowerCase());
  },
};

// column types
const columnIndexMap = {};

head.querySelectorAll('th').forEach((cell, index) => {
  const columnName = cell.textContent.trim().toLowerCase();

  columnIndexMap[columnName] = index;
});

// event for sorting
table.addEventListener('click', (e) => {
  if (e.target.nodeName !== 'TH' || e.target.closest('thead') === null) {
    return;
  }

  const sortBy = e.target.textContent.toLowerCase();

  if (sortBy === sortingParameters.lastClickedCell) {
    sortingParameters.sortOrder =
      sortingParameters.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  sortingTable(rows, sortBy, sortingParameters.sortOrder);

  sortingParameters.sortingName = e.target;
});

// function for sorting
function sortingTable(item, sortBy, order) {
  const columnIndex = columnIndexMap[sortBy];
  const sortedArray = [...item.rows].sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;

    let comparison;

    switch (sortBy) {
      case 'age':
        comparison = cellA - cellB;
        break;

      case 'salary':
        comparison = formattedSalary(cellA) - formattedSalary(cellB);
        break;

      default:
        comparison = cellA.localeCompare(cellB);
        break;
    }

    return order === 'asc' ? comparison : -comparison;
  });

  item.replaceChildren(...sortedArray);
}

// function for replacing salary
function formattedSalary(salary) {
  return Number(salary.replace(/[,$]/g, ''));
}

// event for selecting
let currentSelected;

rows.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (currentSelected) {
    currentSelected.classList.remove('active');
  }

  currentSelected = row;
  currentSelected.classList.add('active');
});

// creating form
const form = document.createElement('form');

form.classList.add('new-employee-form');

table.insertAdjacentElement('afterend', form);

// select options
const availableOffices = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

// function for creating form
function createForm() {
  for (const fieldName in columnIndexMap) {
    const fieldType = getFieldType(fieldName);

    if (fieldType === 'select') {
      createFormSelect(fieldName, availableOffices);
      continue;
    }

    createFormInput(fieldName, fieldType);
  }
}

createForm();

// getting form type
function getFieldType(field) {
  if (field === 'age' || field === 'salary') {
    return 'number';
  }

  if (field === 'office') {
    return 'select';
  }

  return 'text';
}

// function for creating select
function createFormSelect(inputName, offices) {
  const select = document.createElement('select');
  const label = document.createElement('label');

  label.textContent = createFirstBigLetter(inputName) + ':';

  select.name = inputName;
  select.dataset.qa = inputName;

  offices.forEach((office) => {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;

    select.appendChild(option);
  });

  label.appendChild(select);
  form.appendChild(label);
}

// function for creating inputs
function createFormInput(inputName, type) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = createFirstBigLetter(inputName) + ':';

  input.type = type;
  input.name = inputName;
  input.dataset.qa = inputName;

  label.appendChild(input);
  form.appendChild(label);
}

// function for creating labels
function createFirstBigLetter(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

// creating button
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);

// creating notifications
function createNotification(type, message) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification');

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  notificationDescription.textContent = message;

  notificationTitle.textContent = `${createFirstBigLetter(type)} message:`;
  notification.classList.add(type);

  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification);
    }
  }, 5000);
}

// formatting error
function formatString(input) {
  const items = input.split(' ');

  if (items.length === 1) {
    return `${items[0]} is`;
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]} are`;
  }

  const allButLast = items.slice(0, -1).join(', ');
  const last = items[items.length - 1];

  return `${allButLast} and ${last} are`;
}

// creating errors
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const error = document.querySelector('.notification');

  if (error) {
    document.body.removeChild(error);
  }

  const formData = new FormData(form);

  let isEmptyField = false;
  let whichEmptyField = '';

  for (const [key, value] of formData) {
    if (!value.trim()) {
      isEmptyField = true;
      whichEmptyField += `${key} `;
    }
  }

  if (isEmptyField) {
    const emptyFields = formatString(whichEmptyField.trim());

    createNotification(
      'error',
      `Failed because ${emptyFields} empty, please enter correct value!`,
    );

    return;
  }

  if (Number(formData.get('name').length) < 4) {
    createNotification('error', 'Name should be greater than 4 letters!');

    return;
  }

  if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(formData.get('name'))) {
    createNotification(
      'error',
      'Name should contain letters, with only one space between words!',
    );

    return;
  }

  if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(formData.get('position'))) {
    createNotification(
      'error',
      'Position should contain letters, with only one space between words!',
    );

    return;
  }

  if (Number(formData.get('age')) < 18 || Number(formData.get('age')) > 90) {
    createNotification('error', 'Age should be between 18 and 90 years!');

    return;
  }

  createNotification('success', 'New employee has been added to the table!');

  // creating employee object for adding row
  const employeeData = {};

  for (const field in columnIndexMap) {
    employeeData[field] = formData.get(field);
  }

  appendNewEmployee(employeeData);

  if (sortingParameters.lastClickedCell) {
    sortingTable(
      rows,
      sortingParameters.lastClickedCell,
      sortingParameters.sortOrder,
    );
  }

  form.reset();
});

// appending new employee to table
function appendNewEmployee(employee) {
  const newRow = rows.insertRow();

  Object.entries(employee).forEach(([keyName, data]) => {
    const cell = newRow.insertCell();

    cell.textContent = data.trim();

    if (keyName === 'salary') {
      const formatted = `$${Number(data).toLocaleString('en-US')}`;

      cell.textContent = formatted;
    }
  });
}
