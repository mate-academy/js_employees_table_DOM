'use strict';

const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;
const NOTIFICATION_LIFETIME = 2000;

const table = document.querySelector('table');
const tableBody = table.tBodies[0];

const toNumber = (text) => Number(text.replace(/[$,\s]/g, ''));

const isNumeric = (text) => text.trim() !== '' && !isNaN(toNumber(text));

const compareCells = (first, second) => {
  if (isNumeric(first) && isNumeric(second)) {
    return toNumber(first) - toNumber(second);
  }

  return first.localeCompare(second);
};

let sortedIndex = -1;
let isAscending = true;

table.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  const index = header.cellIndex;

  isAscending = index === sortedIndex ? !isAscending : true;
  sortedIndex = index;

  const rows = [...tableBody.rows];

  rows.sort((first, second) => {
    const firstValue = first.cells[index].textContent;
    const secondValue = second.cells[index].textContent;
    const result = compareCells(firstValue, secondValue);

    return isAscending ? result : -result;
  });

  tableBody.append(...rows);
});

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  for (const selected of tableBody.querySelectorAll('tr.active')) {
    selected.classList.remove('active');
  }

  row.classList.add('active');
});

const pushNotification = (type, title, description) => {
  const previous = document.querySelector('[data-qa="notification"]');

  if (previous) {
    previous.remove();
  }

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  notificationTitle.className = 'title';
  notificationTitle.textContent = title;
  notificationText.textContent = description;

  notification.append(notificationTitle, notificationText);
  document.body.append(notification);

  setTimeout(() => notification.remove(), NOTIFICATION_LIFETIME);
};

const createInput = (fieldName, type) => {
  const input = document.createElement('input');

  input.name = fieldName;
  input.type = type;
  input.dataset.qa = fieldName;

  return input;
};

const createLabel = (text, field) => {
  const label = document.createElement('label');

  label.textContent = `${text}: `;
  label.append(field);

  return label;
};

const nameInput = createInput('name', 'text');
const positionInput = createInput('position', 'text');
const ageInput = createInput('age', 'number');
const salaryInput = createInput('salary', 'number');

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

for (const office of OFFICES) {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  officeSelect.append(option);
}

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

const form = document.createElement('form');

form.className = 'new-employee-form';

form.append(
  createLabel('Name', nameInput),
  createLabel('Position', positionInput),
  createLabel('Office', officeSelect),
  createLabel('Age', ageInput),
  createLabel('Salary', salaryInput),
  submitButton,
);

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value;
  const age = Number(ageInput.value);
  const salary = Number(salaryInput.value);

  if (
    !employeeName ||
    !position ||
    !office ||
    !ageInput.value ||
    !salaryInput.value
  ) {
    pushNotification(
      'error',
      'Empty field',
      'All the fields have to be filled in.',
    );

    return;
  }

  if (employeeName.length < MIN_NAME_LENGTH) {
    pushNotification(
      'error',
      'Name is too short',
      `Name needs at least ${MIN_NAME_LENGTH} letters.`,
    );

    return;
  }

  if (age < MIN_AGE || age > MAX_AGE) {
    pushNotification(
      'error',
      'Age is out of range',
      `Age has to be between ${MIN_AGE} and ${MAX_AGE}.`,
    );

    return;
  }

  const row = tableBody.insertRow();
  const values = [
    employeeName,
    position,
    office,
    `${age}`,
    `$${salary.toLocaleString('en-US')}`,
  ];

  for (const value of values) {
    row.insertCell().textContent = value;
  }

  pushNotification(
    'success',
    'Employee added',
    `${employeeName} is now in the table.`,
  );

  form.reset();
});

let editedInput = null;

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || editedInput) {
    return;
  }

  const initialText = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialText;

  cell.textContent = '';
  cell.append(input);
  editedInput = input;
  input.focus();

  input.addEventListener('blur', () => {
    const value = input.value.trim();

    cell.textContent = value === '' ? initialText : value;
    editedInput = null;
  });

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});
