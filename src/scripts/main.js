'use strict';

const minNameLength = 4;
const minAge = 18;
const maxAge = 90;

const table = document.querySelector('table');
const ths = table.querySelectorAll('thead th');
let tbody = table.querySelector('tbody');
let rows = Array.from(tbody.querySelectorAll('tr'));

// create a form
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.appendChild(form);

// create an input field for the name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';
form.appendChild(nameLabel);

const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('name', 'name');
nameInput.setAttribute('autocomplete', 'name');
nameInput.setAttribute('required', true);
nameLabel.appendChild(nameInput);

// create an input field for position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';
form.appendChild(positionLabel);

const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('required', true);
positionLabel.appendChild(positionInput);

// create an input field for office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';
form.appendChild(officeLabel);

const officeSelect = document.createElement('select');

officeSelect.setAttribute('required', true);
officeLabel.appendChild(officeSelect);

const cities = [
  'Tokyo', 
  'Singapore', 
  'London',
  'New York',
  'Edinburgh',
  'San Francisco'
];

cities.forEach(function(city) {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.appendChild(option);
});

// create an input field for age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';
form.appendChild(ageLabel);

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('required', true);
ageLabel.appendChild(ageInput);

// create an input field for salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';
form.appendChild(salaryLabel);

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('required', true);
salaryLabel.appendChild(salaryInput);

// create a submit button:
const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.innerText = 'Save to table';
form.appendChild(submitButton);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  // correction of the entered string to capital letters in each word
  function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase()
    + word.slice(1)).join(' ');
  }

  const nameValue = nameInput.value.trim();
  const positionValue = positionInput.value.trim();
  const officeValue = officeSelect.value;
  const ageValue = parseInt(ageInput.value);
  const salaryValue = parseInt(salaryInput.value.trim());

  let isValid = true;

  // Check for validity of each form field
  if (nameValue.length < minNameLength) {
    isValid = false;

    showNotification('error',
      `Name should contain at least ${minNameLength} letters.`);
  }

  if (ageValue < minAge || ageValue > maxAge) {
    isValid = false;
    showNotification('error', `Age should be between ${minAge} and ${maxAge}.`);
  }

  if (salaryValue < 0) {
    isValid = false;
    showNotification('error', 'Заработная плата не может быть отрицательной.');
  }

  if (isValid) {
    // If all fields are valid, add a new employee to the table
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const positionCell = document.createElement('td');
    const officeCell = document.createElement('td');
    const ageCell = document.createElement('td');
    const salaryCell = document.createElement('td');

    nameCell.textContent = capitalizeWords(nameValue);
    positionCell.textContent = capitalizeWords(positionValue);
    officeCell.textContent = officeValue;
    ageCell.textContent = ageValue;

    salaryCell.textContent = '$'
    + parseInt(salaryValue).toLocaleString('en-US');

    row.appendChild(nameCell);
    row.appendChild(positionCell);
    row.appendChild(officeCell);
    row.appendChild(ageCell);
    row.appendChild(salaryCell);

    tbody.appendChild(row);

    row.addEventListener('click', () => {
      makeRowActive(row);
    });

    showNotification('success', 'New employee added to the table.');
    form.reset();
  }
});

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notification.textContent = type + ':' + message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// If we click on a row, the class 'active' is added to it
rows.forEach(row => {
  row.addEventListener('click', () => {
    makeRowActive(row);
  });
});

function makeRowActive(row) {
  rows = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach(rowItem => {
    if (rowItem.classList.contains('active')) {
      rowItem.classList.remove('active');
    }
  });

  if (!row.classList.contains('active')) {
    row.classList.add('active');
  }
}

// sort table
ths.forEach(function(th) {
  th.addEventListener('click', function() {
    tbody = table.querySelector('tbody');
    rows = Array.from(tbody.querySelectorAll('tr'));

    const direction = th.getAttribute('data-sort') === 'asc' ? 'desc' : 'asc';

    // Determine the number of the column by which to sort
    const column = th.cellIndex;

    // Create a function to sort table rows
    const sortFunction = makeSortFunction(column, direction);

    // Sort table rows and add them back to tbody
    const sortedRows = rows.sort(sortFunction);

    tbody.append(...sortedRows);

    // Set the sort direction in the data-sort attribute of the table header
    th.setAttribute('data-sort', direction);
  });
});

function makeSortFunction(column, direction) {
  return function(a, b) {
    const aValue = a.children[column].textContent;
    const bValue = b.children[column].textContent;

    if (aValue === bValue) {
      return 0;
    }

    // Determine which value is bigger and return the corresponding number
    const greater = (aValue > bValue ? 1 : -1);

    return (direction === 'asc' ? greater : -greater);
  };
}
