'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

const sortState = {
  columnIndex: null,
  direction: null,
};

// sort table by clicking on column header, toggling asc/desc
headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    const rows = [...tbody.querySelectorAll('tr')];

    // new column is always sorted asc first, same column toggles direction
    if (sortState.columnIndex !== columnIndex) {
      sortState.columnIndex = columnIndex;
      sortState.direction = 'asc';
    } else {
      sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    }

    const direction = sortState.direction;

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      const numA = parseFloat(cellA.replace(/[^0-9.]/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.]/g, ''));

      let result;

      if (!isNaN(numA) && !isNaN(numB)) {
        result = numA - numB;
      } else {
        result = cellA.localeCompare(cellB);
      }

      return direction === 'asc' ? result : -result;
    });

    tbody.append(...sortedRows);
  });
});

// select the row that was clicked by the user (add 'active' class)
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const rows = tbody.querySelectorAll('tr');

  // only one row can be selected at a time
  rows.forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

// show a notification with a title and description
const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  document.body.append(notification);
  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const elTitle = document.createElement('h2');

  notification.append(elTitle);
  elTitle.classList.add('title');
  elTitle.textContent = title;

  const elDescription = document.createElement('p');

  notification.append(elDescription);
  elDescription.textContent = description;

  // remove notification after a short delay
  setTimeout(() => {
    notification.remove();
  }, 2000);
};

// build the form for adding a new employee
const form = document.createElement('form');

form.classList.add('new-employee-form');

// helper to create a <label> wrapping an <input>
const createLabel = (text, fieldName, type) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.name = fieldName;
  input.type = type;
  input.dataset.qa = fieldName;

  label.textContent = `${text}: `;
  label.append(input);

  return { label, input };
};

const employeeNameField = createLabel('Name', 'name', 'text');
const positionField = createLabel('Position', 'position', 'text');
const ageField = createLabel('Age', 'age', 'number');
const salaryField = createLabel('Salary', 'salary', 'number');

// office is a <select>, not a plain input, so build it separately
const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';
officeLabel.textContent = 'Office: ';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.append(option);
});

officeLabel.append(officeSelect);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(
  employeeNameField.label,
  positionField.label,
  officeLabel,
  ageField.label,
  salaryField.label,
  submitButton,
);

// place the form right after the table
table.after(form);

// validate inputs and add a new employee row on submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = employeeNameField.input.value.trim();
  const position = positionField.input.value.trim();
  const office = officeSelect.value;
  const age = ageField.input.value.trim();
  const salary = salaryField.input.value.trim();

  // all fields are required
  if (employeeName === '' || position === '' || age === '' || salary === '') {
    pushNotification(10, 10, 'Error', 'All fields are required.', 'error');

    return;
  }

  // name must be at least 4 letters
  if (employeeName.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Name should have at least 4 letters.',
      'error',
    );

    return;
  }

  const ageNumber = parseFloat(age);

  // age must be between 18 and 90
  if (ageNumber < 18 || ageNumber > 90) {
    pushNotification(
      10,
      10,
      'Error',
      'Age should be between 18 and 90.',
      'error',
    );

    return;
  }

  // format salary the same way as the existing table rows ($X,XXX)
  const salaryNumber = parseFloat(salary);
  const formattedSalary = `$${salaryNumber.toLocaleString('en-US')}`;

  const newRow = document.createElement('tr');
  const values = [employeeName, position, office, ageNumber, formattedSalary];

  values.forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    newRow.append(td);
  });

  tbody.append(newRow);
  form.reset();

  pushNotification(
    10,
    10,
    'Success',
    'New employee added to the table.',
    'success',
  );
});

// edit a table cell by double-clicking on it
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  // ignore clicks outside of a cell, or if it's already being edited
  if (!cell || cell.querySelector('input')) {
    return;
  }

  const initialValue = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  // save the new value (or restore the old one if left empty)
  const save = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue === '' ? initialValue : newValue;
  };

  // save on blur or on Enter key
  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});
