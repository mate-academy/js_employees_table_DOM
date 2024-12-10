'use strict';

// #region sorting Table
const tableNames = document.querySelectorAll('thead th');
let lastSortedIndex = null;
const sortDirections = Array.from({ length: tableNames.length }, () => true);

tableNames.forEach((element, index) => {
  element.addEventListener('click', () => sortTable(index));
});

function sortTable(index) {
  const tableBody = document.querySelector('tbody');
  const headRows = Array.from(tableBody.querySelectorAll('tr'));

  if (lastSortedIndex === index) {
    sortDirections[index] = !sortDirections[index];
  } else {
    sortDirections[index] = true;
  }

  headRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.trim();
    const cellB = rowB.cells[index].textContent.trim();

    const direction = sortDirections[index] ? 1 : -1;

    return compareValues(cellA, cellB, index) * direction;
  });

  tableBody.append(...headRows);
  lastSortedIndex = index;
}

function compareValues(cellA, cellB, index) {
  if (index <= 2) {
    return cellA.localeCompare(cellB);
  }

  if (index === 4) {
    const valueA = parseFloat(cellA.replace(/[$,]/g, '')) || 0;
    const valueB = parseFloat(cellB.replace(/[$,]/g, '')) || 0;

    return valueA - valueB;
  }

  return parseFloat(cellA) - parseFloat(cellB);
}
// #endregion

// #region selected Row
const rows = document.querySelectorAll('tbody tr');
let activeRow = null;

rows.forEach((row, index) => {
  row.addEventListener('click', () => selectRow(row));
});

function selectRow(row) {
  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');

  activeRow = row;
}
// #endregion

// #region form to add new employee
const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    data: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    data: 'position',
  },
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    data: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    data: 'salary',
  },
];

const selectField = {
  label: 'Office:',
  name: 'office',
  options: [
    { value: 'tokyo', text: 'Tokyo' },
    { value: 'singapore', text: 'Singapore' },
    { value: 'london', text: 'London' },
    { value: 'new-York', text: 'New York' },
    { value: 'edinburgh', text: 'Edinburgh' },
    { value: 'san-Francisco', text: 'San Francisco' },
  ],
  data: 'office',
};

fields.forEach((field, index) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  const input = document.createElement('input');

  input.type = field.type;
  input.name = field.name;
  input.setAttribute('data-qa', field.data);
  input.required = true;

  label.appendChild(input);
  form.appendChild(label);

  if (index === 1) {
    const selectLabel = document.createElement('label');
    const select = document.createElement('select');

    selectLabel.textContent = selectField.label;
    select.name = selectField.name;
    select.setAttribute('data-qa', selectField.data);
    // select.required = true;

    selectField.options.forEach((optionData) => {
      const option = document.createElement('option');

      option.value = optionData.value;
      option.textContent = optionData.text;
      select.appendChild(option);
    });

    selectLabel.appendChild(select);
    form.appendChild(selectLabel);
  }
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  if (validation(data)) {
    addNewRow(data);
    pushNotification('Success', 'Row added successfully!', 'success');
  }
});

function addNewRow(data) {
  const tableBody = document.querySelector('tbody');
  const newRow = document.createElement('tr');

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const newCell = document.createElement('td');

      newCell.textContent = capitalizeWords(data[key]);

      if (key === 'position') {
        newCell.textContent = data[key];
      }

      if (key === 'salary') {
        const salary = parseFloat(data[key]);

        newCell.textContent = `$${salary.toLocaleString('en-US')}`;
      }

      newRow.appendChild(newCell);
    }
  }

  tableBody.appendChild(newRow);
}

function capitalizeWords(text) {
  return text
    .toString()
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function validation(info) {
  if (!info.name || !info.position || !info.office || !info.age || !info.salary) {
    pushNotification('Missing Fields', 'All fields are required', 'error');

    return false;
  }

  if (!info.name || info.name.trim().length < 4) {
    pushNotification(
      'Invalid Name',
      'Name must have at least 4 characters.',
      'error',
    );

    return false;
  }

  if (!info.position || info.position.trim() === '') {
    pushNotification('Invalid Position', 'Position is required.', 'error');

    return false;
  }

  if (!info.age || isNaN(info.age) || info.age < 18 || info.age > 90) {
    pushNotification(
      'Invalid Age',
      'You must be older than 17 and younger than 91.',
      'error',
    );

    return false;
  }

  if (!info.salary || isNaN(info.salary) || info.salary <= 0) {
    pushNotification(
      'Invalid Salary',
      'Salary must be a positive number.',
      'error',
    );

    return false;
  }

  return true;
}

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');

  h2.setAttribute('class', 'title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  notification.append(h2, p);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 6000);
};
// #endregion
