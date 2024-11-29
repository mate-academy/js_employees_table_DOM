'use strict';

// select all table pieces
const table = document.querySelector('table');
const rows = document.querySelector('tbody');
const head = document.querySelector('thead');

// prevent selecting text
head.style.userSelect = 'none';
rows.style.userSelect = 'none';

// appending ID column;
let lastId = 0;

for (let i = 0; i < table.rows.length; i++) {
  const row = table.rows[i];
  const idCell = row.insertCell(0);

  lastId = table.rows.length - 1;

  if (i === 0 || i === table.rows.length - 1) {
    const title = document.createElement('th');

    idCell.replaceWith(title);
    title.textContent = 'ID';
  }

  if (i !== table.rows.length - 1 && i !== 0) {
    idCell.textContent = i;
  }
}

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
  } else {
    sortingParameters.sortOrder = 'asc';
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

      case 'id':
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
let currentSelected = null;

document.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (e.target.closest('.modal')) {
    return;
  }

  if (!row || row.parentElement.tagName !== 'TBODY') {
    removeSelect();

    return;
  }

  if (currentSelected !== row) {
    removeSelect();
    currentSelected = row;
    currentSelected.classList.add('active');

    const deleteIcon = document.createElement('span');

    deleteIcon.textContent = '✖️';
    deleteIcon.className = 'delete-button';

    deleteIcon.addEventListener('click', (evnt) => {
      evnt.stopPropagation();

      const modal = document.querySelector('.modal');

      modal.classList.remove('hidden');

      modal.addEventListener('click', (answer) => {
        if (answer.target.textContent === 'Yes') {
          answer.stopPropagation();
          modal.classList.add('hidden');

          deleteIcon.style.zIndex = '-1';
          deleteIcon.classList.remove('active');

          setTimeout(() => {
            row.remove();
            currentSelected = null;
          }, 200);

          setTimeout(() => {
            createNotification('success', 'Succesfully deleted employee!');
          }, 200);
        }

        if (answer.target.textContent === 'No') {
          modal.classList.add('hidden');
        }
      });
    });

    row.appendChild(deleteIcon);

    setTimeout(() => deleteIcon.classList.add('active'), 0);

    setTimeout(() => {
      if (currentSelected === row) {
        deleteIcon.style.zIndex = '1';
      }
    }, 250);
  }
});

// function removing selected
function removeSelect() {
  if (currentSelected) {
    const deleteIcon = currentSelected.querySelector('.delete-button');

    if (deleteIcon) {
      deleteIcon.classList.remove('active');
      deleteIcon.style.zIndex = '-1';
      setTimeout(() => deleteIcon.remove(), 200);

      currentSelected.classList.remove('active');
      currentSelected = null;
    }
  }
}

// creating form
const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.appendChild(form);

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

    if (fieldName === 'id') {
      continue;
    }

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
  return input
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

// creating button
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);

// creating notifications
function createNotification(type, message) {
  const error = document.querySelector('.notification');

  if (error) {
    document.body.removeChild(error);
  }

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
let currentError;

form.addEventListener('submit', (e) => {
  e.preventDefault();

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
      `Failed because ${emptyFields} empty, please enter correct value to inputs!`,
    );

    return;
  }

  for (const [key, value] of formData) {
    currentError = validate(key, value);

    if (currentError) {
      return;
    }
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

// function for validation
function validate(key, value) {
  if (key === 'name' || key === 'position') {
    if (value.length < 4) {
      createNotification(
        'error',
        `${createFirstBigLetter(key)} should be at least 4 letters long!`,
      );

      return true;
    }

    if (value.length > 40) {
      createNotification(
        'error',
        `${createFirstBigLetter(key)} can't be that long!`,
      );

      return true;
    }

    if (!/^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(key)) {
      createNotification(
        'error',
        `${createFirstBigLetter(key)} should contain letters, with only one space between words!`,
      );

      return true;
    }
  }

  if (key === 'age') {
    if (isNaN(Number(value))) {
      createNotification('error', 'Age should contain only numbers!');

      return true;
    }

    if (Number(value) < 18 || Number(value) > 90) {
      createNotification('error', 'Age should be between 18 and 90 years!');

      return true;
    }
  }

  return false;
}

// appending new employee to table
function appendNewEmployee(employee) {
  const newRow = rows.insertRow();

  Object.entries(employee).forEach(([keyName, data]) => {
    const cell = newRow.insertCell();

    if (keyName === 'id') {
      cell.textContent = lastId;
      lastId++;
    }

    if (typeof data === 'string') {
      cell.textContent = createFirstBigLetter(data.trim());
    }

    if (keyName === 'salary') {
      const formatted = makeSalary(data);

      cell.textContent = formatted;
    }
  });
}

// function for making salary
function makeSalary(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

// event for editing cells
let isEditing = false;

rows.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.parentElement !== currentSelected || isEditing) {
    return;
  }

  const cellIndex = cell.cellIndex;
  let headerCell;

  for (const key in columnIndexMap) {
    if (key === 'id') {
      headerCell = columnIndexMap[key];
    }
  }

  if (cellIndex === headerCell) {
    return;
  }

  const currentText = cell.textContent;

  cell.textContent = '';

  const computedStyle = window.getComputedStyle(cell);
  const width = computedStyle.width;
  const height = computedStyle.height;

  let cellName = cell.cellIndex;

  for (const key in columnIndexMap) {
    if (columnIndexMap[key] === cellName) {
      cellName = key;
      break;
    }
  }

  const editInput = makeEditInput(cellName, getFieldType(cellName));

  editInput.className = 'cell-input';
  editInput.style.height = height;
  editInput.style.width = width;
  editInput.value = currentText;

  if (cellName === 'salary') {
    editInput.value = currentText.slice(1).split(',').join('');
  }

  cell.appendChild(editInput);
  isEditing = true;
  editInput.focus();

  editInput.addEventListener('blur', () => {
    isEditing = false;
    cell.innerHTML = '';

    const newValue = editInput.value;

    if (newValue.length <= 0) {
      cell.textContent = currentText;
      createNotification('warning', 'Failed, no data passed.');

      return;
    }

    const validateResult = validate(cellName, newValue);

    if (validateResult) {
      cell.textContent =
        cellName === 'salary' ? makeSalary(newValue) : currentText;

      return;
    }

    if (cellName === 'salary') {
      cell.textContent = makeSalary(newValue);

      return;
    }

    if (getFieldType(cellName) === 'text') {
      cell.textContent = createFirstBigLetter(editInput.value);

      return;
    }

    cell.textContent = editInput.value;
  });

  editInput.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      editInput.blur();
    }
  });
});

// function for making edit inputs
function makeEditInput(inputName, type) {
  const typeCreated = type === 'select' ? 'select' : 'input';

  const formCopy = document.querySelector(
    `${typeCreated}[name="${inputName}"]`,
  );

  const editCell = formCopy.cloneNode(true);

  return editCell;
}
