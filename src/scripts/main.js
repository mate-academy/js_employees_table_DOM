'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];
let currentColumn = null;
let isAscending = true;

thead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;

  if (currentColumn === index) {
    isAscending = !isAscending;
  } else {
    currentColumn = index;
    isAscending = true;
  }

  rows.sort((rowA, rowB) => {
    const valueA = rowA.cells[index].textContent;
    const valueB = rowB.cells[index].textContent;
    const result = valueA.localeCompare(valueB, undefined, { numeric: true });

    return isAscending ? result : -result;
  });
  tbody.append(...rows);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  tbody.querySelectorAll('tr').forEach((currentRow) => {
    currentRow.classList.remove('active');
  });
  row.classList.add('active');
});

const form = document.createElement('form');

form.noValidate = true;

form.classList.add('new-employee-form');

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameInput.dataset.qa = 'name';
nameInput.name = 'name';
nameInput.type = 'text';
nameInput.minLength = 4;
nameInput.required = true;
nameLabel.textContent = 'Name:';
nameLabel.append(nameInput);
form.append(nameLabel);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionInput.dataset.qa = 'position';
positionInput.name = 'position';
positionInput.type = 'text';
positionInput.required = true;
positionLabel.textContent = 'Position:';
positionLabel.append(positionInput);
form.append(positionLabel);

const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeSelect.dataset.qa = 'office';
officeSelect.name = 'office';
officeSelect.required = true;

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  officeSelect.append(option);
});
officeLabel.textContent = 'Office:';
officeLabel.append(officeSelect);
form.append(officeLabel);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageInput.dataset.qa = 'age';
ageInput.name = 'age';
ageInput.type = 'number';
ageInput.min = 18;
ageInput.max = 90;
ageInput.required = true;
ageLabel.textContent = 'Age:';
ageLabel.append(ageInput);
form.append(ageLabel);

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryInput.dataset.qa = 'salary';
salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.required = true;
salaryLabel.textContent = 'Salary:';
salaryLabel.append(salaryInput);
form.append(salaryLabel);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
form.append(button);

body.append(form);

function printNotification(title, description, notificationType) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add(notificationType);

  const title1 = document.createElement('h2');

  title1.textContent = title;

  const paragraph = document.createElement('p');

  paragraph.textContent = description;

  notification.append(title1);
  notification.append(paragraph);
  body.append(notification);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (!data.get('position').trim()) {
    printNotification('Invalid position', 'Position cannot be empty', 'error');

    return;
  }

  if (data.get('name').length < 4) {
    printNotification(
      'Invalid name',
      'Name must contain at least 4 letters',
      'error',
    );

    return;
  }

  if (Number(data.get('age')) < 18 || Number(data.get('age')) > 90) {
    printNotification('Invalid age', 'Age must be between 18 and 90', 'error');

    return;
  }

  const rowNew = document.createElement('tr');
  const values = [
    data.get('name'),
    data.get('position'),
    data.get('office'),
    Number(data.get('age')),
    '$' + Number(data.get('salary')).toLocaleString('en-US'),
  ];

  for (const value of values) {
    const td = document.createElement('td');

    td.textContent = value;
    rowNew.append(td);
  }
  tbody.append(rowNew);

  printNotification('Success', 'New employee has been added', 'success');
  form.reset();
});
