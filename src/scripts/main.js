'use strict';

function updateSortDirection(columnIndex) {
  if (columnIndex === lastSortedColumn) {
    sortDirection = -sortDirection;
  } else {
    sortDirection = 1;
  }

  lastSortedColumn = columnIndex;
}

function getCellValue(row, columnIndex) {
  return currencyToNumber(row.cells[columnIndex].innerText);
}

function currencyToNumber(value) {
  if (value[0] === '$') {
    return +value.slice(1).split(',').join('');
  }

  return isNaN(value) ? value : +value;
}

function sortTable(columnIndex) {
  const rows = [...tbody.querySelectorAll('tr')];

  rows.sort((row1, row2) => {
    const value1 = getCellValue(row1, columnIndex);
    const value2 = getCellValue(row2, columnIndex);

    return typeof value1 === 'number'
      ? (value1 - value2) * sortDirection
      : value1.toString().localeCompare(value2.toString()) * sortDirection;
  });

  table.tBodies[0].append(...rows);
}

function createInputWithLabel(id, text, type = 'text', dataQa = id) {
  const label = document.createElement('label');

  label.innerHTML = `<span>${text}</span><input id="${id}" type="${type}" data-qa="${dataQa}">`;

  return label;
}

function pushNotification(title, description, type) {
  const div = document.createElement('div');

  div.classList.add('notification', type);

  div.innerHTML = `<h2 class="title">${title}</h2><p>${description}</p>`;
  document.body.append(div);

  setTimeout(() => div.remove(), 2000);
}

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
let sortDirection = 1;
let lastSortedColumn = -1;
let editingCell = null;

table.querySelector('thead').addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  const index = [...headers].indexOf(header);

  updateSortDirection(index);

  sortTable(index);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || editingCell) {
    return;
  }

  editingCell = cell;

  const initialValue = cell.innerText;

  cell.innerHTML = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = '';
  cell.appendChild(input);

  input.focus();

  input.addEventListener('blur', () => {
    const newValue = input.value.trim() || initialValue;

    cell.innerText = newValue;
    editingCell = null;
  });

  input.addEventListener('keypress', (event1) => {
    if (event1.key === 'Enter') {
      const newValue = input.value.trim() || initialValue;

      cell.innerText = newValue;
      editingCell = null;
    }
  });
});

const newForm = document.createElement('form');

newForm.className = 'new-employee-form';
table.insertAdjacentElement('afterend', newForm);

const selectLabel = document.createElement('label');
const selectHintText = document.createElement('span');
const select = document.createElement('select');
const selectOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

selectLabel.setAttribute('for', 'office');
selectHintText.textContent = 'Office:';
select.id = 'office';
select.setAttribute('data-qa', 'office');

selectOptions.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  select.appendChild(option);
});

selectLabel.append(selectHintText);
selectLabel.append(select);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';

newForm.append(createInputWithLabel('name', 'Name:'));
newForm.append(createInputWithLabel('position', 'Position:'));
newForm.append(selectLabel);
newForm.append(createInputWithLabel('age', 'Age:', 'number'));
newForm.append(createInputWithLabel('salary', 'Salary:', 'number'));
newForm.append(button);

newForm.addEventListener('submit', (event2) => {
  event2.preventDefault();

  const employeeInfo = {
    name: document.getElementById('name').value.trim(),
    position: document.getElementById('position').value.trim(),
    office: document.getElementById('office').value.trim(),
    age: +document.getElementById('age').value.trim(),
    salary: +document.getElementById('salary').value.trim(),
  };

  if (Object.values(employeeInfo).some((value) => !value)) {
    pushNotification(
      'Warning',
      'All form fields must be filled in!',
      'warning',
    );

    return;
  }

  if (employeeInfo.name.length < 4) {
    pushNotification(
      'Error',
      'Name must be at least 4 characters long',
      'error',
    );

    return;
  }

  if (employeeInfo.age < 18 || employeeInfo.age > 90) {
    pushNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  const formattedSalary = `$${employeeInfo.salary.toLocaleString('en-US')}`;
  const newRow = tbody.insertRow();

  newRow.insertCell().textContent = employeeInfo.name;
  newRow.insertCell().textContent = employeeInfo.position;
  newRow.insertCell().textContent = employeeInfo.office;
  newRow.insertCell().textContent = employeeInfo.age;
  newRow.insertCell().textContent = formattedSalary;

  pushNotification(
    'Success',
    'You have successfully added an employee to the table',
    'success',
  );

  newForm.reset();
});
