'use strict';

// Implement sorting of cells
const tableBody = document.querySelector('tbody');
const allRows = Array.from(tableBody.querySelectorAll('tr'));
let lastSortedColumn = -1;
let sortDirection = 1;

document.addEventListener('click', (eve) => {
  const target = eve.target.closest('th');

  if (!target) {
    return;
  }

  const columnIndex = target.cellIndex;

  // If the same column, reverse sort direction
  if (columnIndex === lastSortedColumn) {
    sortDirection *= -1;
  } else {
    // If a different column is clicked, sort in ascending order by default
    sortDirection = 1;
  }

  lastSortedColumn = columnIndex;
  sortTable(columnIndex);
});

function cleanValue(value) {
  return value.replace(/[$,]/g, '').trim();
}

function sortTable(columnIndex) {
  const isNumeric = columnIndex === 3 || columnIndex === 4;

  allRows.sort((a, b) => {
    const aValue = cleanValue(a.cells[columnIndex].textContent);
    const bValue = cleanValue(b.cells[columnIndex].textContent);

    return isNumeric
      ? parseFloat(aValue) - parseFloat(bValue)
      : aValue.localeCompare(bValue);
  });

  if (sortDirection === -1) {
    allRows.reverse();
  }

  allRows.forEach((row) => tableBody.appendChild(row));
}

// Make row active
let lastActiv;

tableBody.addEventListener('click', (eve) => {
  if (lastActiv !== undefined) {
    lastActiv.classList.remove('active');
  }

  const target = eve.target.closest('tr');

  if (!target) {
    return;
  }

  target.classList.add('active');
  lastActiv = target;
});

// Implement form

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('name', 'name');
nameInput.setAttribute('data-qa', 'name');
nameLabel.appendChild(nameInput);
newForm.appendChild(nameLabel);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('name', 'position');
positionInput.setAttribute('data-qa', 'position');
positionLabel.appendChild(positionInput);
newForm.appendChild(positionLabel);

const officeLable = document.createElement('label');

officeLable.textContent = 'Office: ';

const officeSelest = document.createElement('select');

officeSelest.setAttribute('name', 'office');
officeSelest.setAttribute('data-qa', 'office');

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburg',
  'San Francisco',
];

// Using forEach to quick add options to form
cities.forEach((city) => {
  const option = document.createElement('option');

  option.textContent = city;
  option.setAttribute('value', city);
  officeSelest.appendChild(option);
});
officeLable.appendChild(officeSelest);
newForm.appendChild(officeLable);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('name', 'age');
ageInput.setAttribute('data-qa', 'age');
ageLabel.appendChild(ageInput);
newForm.appendChild(ageLabel);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('data-qa', 'salary');
salaryLabel.appendChild(salaryInput);
newForm.appendChild(salaryLabel);

// Create button save

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');

newForm.addEventListener('submit', (eve) => {
  eve.preventDefault();

  const nameValue = nameInput.value.trim();

  if (nameValue.length < 4) {
    PushNotification('error', 'Name is too small', 'Make it longer!');

    return;
  }

  const positionValue = positionInput.value.trim();
  const officeValue = officeSelest.value;
  const ageValue = ageInput.value;

  if (ageValue < 18 || ageValue > 90) {
    PushNotification('error', 'Incorrect age', 'Please check your age');

    return;
  }

  const salaryValue = parseFloat(salaryInput.value);
  const formattedSalary = `$${salaryValue.toLocaleString('en-US')}`;

  const values = [nameValue, positionValue, officeValue, ageValue, salaryValue];
  const isEmptyField = values.some((value) => !value);

  if (isEmptyField) {
    PushNotification('error', 'Please fill the form!', 'Form is not full.');

    return;
  }

  const tr = document.createElement('tr');
  const rowName = document.createElement('td');

  rowName.textContent = nameValue;
  tr.appendChild(rowName);

  const rowPosition = document.createElement('td');

  rowPosition.textContent = positionValue;
  tr.appendChild(rowPosition);

  const rowOffice = document.createElement('td');

  rowOffice.textContent = officeValue;
  tr.appendChild(rowOffice);

  const rowAge = document.createElement('td');

  rowAge.textContent = ageValue;
  tr.appendChild(rowAge);

  const rowSalary = document.createElement('td');

  rowSalary.textContent = `${formattedSalary}`;
  tr.appendChild(rowSalary);

  PushNotification(
    'success',
    'Your new employee is now in the table. Thanks for adding!',
    'All Done!',
  );
  tableBody.appendChild(tr);
  allRows.push(tr);
});

// Implement Notification function

function PushNotification(type, message, reason) {
  const block = document.createElement('div');

  block.classList.add('notification', type);
  block.setAttribute('data-qa', 'notification');

  const blockTitle = document.createElement('h2');

  blockTitle.classList.add('title');
  blockTitle.textContent = reason;
  block.appendChild(blockTitle);

  const text = document.createElement('p');

  text.textContent = message;
  block.appendChild(text);

  block.style.top = '10px';
  block.style.right = '10px';
  document.body.appendChild(block);

  setTimeout(() => {
    block.style.visibility = 'hidden';
  }, 2000);
}

newForm.appendChild(button);
document.body.appendChild(newForm);

// Implement redaction of row
tableBody.addEventListener('dblclick', (even) => {
  const target = even.target.closest('td');

  if (!target) {
    return;
  }

  if (document.querySelector('.cell-input')) {
    return;
  }

  const initialText = target.textContent;

  target.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialText;
  target.appendChild(input);

  input.addEventListener('blur', () => saveChanges(target, input, initialText));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveChanges(target, input, initialText);
    }
  });
});

function saveChanges(cell, input, initialText) {
  const newValue = input.value.trim();

  if (newValue === '') {
    PushNotification(
      'error',
      'Input cannot be empty.',
      'Please enter some text.',
    );
    cell.textContent = initialText;
  } else {
    PushNotification(
      'success',
      'Changes saved successfully!',
      'The cell content has been updated.',
    );
    cell.textContent = newValue;
  }
}
