/* eslint-disable padding-line-between-statements */
/* eslint-disable no-useless-return */
'use strict';

// write code here
const headerParams = document.querySelectorAll('thead th');
const table = document.querySelector('tbody');
let isAsc = true;
let lastSortedIndex = -1;

// TABLE SORTING BY CLICKING ON THE TITLE
headerParams.forEach((param) => {
  param.addEventListener('click', (ev) => {
    const targetIndex = [...headerParams].indexOf(ev.target);

    if (targetIndex !== lastSortedIndex) {
      isAsc = true;
      lastSortedIndex = targetIndex;
    }

    sortTable(ev, isAsc);
    isAsc = !isAsc;
  });
});

function sortTable(ev, asc) {
  const targetIndex = [...headerParams].indexOf(ev.target);
  const tableRows = table.querySelectorAll('tr');

  const sortCells = [...tableRows].sort((a, b) => {
    const aText = a.children[targetIndex].innerText;
    const bText = b.children[targetIndex].innerText;

    const aNum = parseFloat(aText.replace(/[^0-9.-]+/g, ''));
    const bNum = parseFloat(bText.replace(/[^0-9.-]+/g, ''));

    if (isNaN(aNum) || isNaN(bNum)) {
      return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    } else {
      return asc ? aNum - bNum : bNum - aNum;
    }
  });

  table.append(...sortCells);
}

// WHEN THE USER CLICKS ON A ROW, IT SHOULD BECOME SELECTED
table.addEventListener('click', (ev) => {
  const prevSelected = table.querySelector('.active');
  const selected = ev.target.closest('tr');

  if (prevSelected) {
    selected.classList.toggle('active');
    prevSelected.classList.remove('active');
  } else {
    selected.classList.toggle('active');
  }
});

// FORM IMPLEMENTATION
const form = document.createElement('form');

form.classList.add('new-employee-form');

const inputNames = ['name', 'position', 'age', 'salary'];
const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// adding input elements
inputNames.forEach((inputName) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.setAttribute('for', inputName);
  label.textContent = inputName.charAt(0).toUpperCase() + inputName.slice(1);

  input.setAttribute('name', inputName);
  input.setAttribute('type', 'text');
  input.setAttribute('data-qa', inputName);
  input.setAttribute('required', true);

  label.append(input);
  form.append(label);
});

// adding a select element
const select = document.createElement('select');

select.setAttribute('data-qa', 'office');
select.setAttribute('required', true);

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office';
selectLabel.setAttribute('for', 'office');

selectLabel.append(select);

options.forEach((option) => {
  const selectOption = document.createElement('option');

  selectOption.value = option;
  selectOption.textContent = option;

  select.append(selectOption);
});

document.body.append(form);

// select position
const thirdInput = form.querySelectorAll('label')[2];

form.insertBefore(selectLabel, thirdInput);

// adding a button that adds a new employee
const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  const notificationText = document.createElement('p');

  notification.classList.add('notification', type);
  notificationText.classList.add('title');

  notification.setAttribute('data-qa', 'notification');
  notificationText.textContent = message;
  notification.append(notificationText);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

button.addEventListener('click' || 'Enter', (ev) => {
  if (!form.checkValidity()) {
    showNotification('Please fill out all required fields.', 'error');
    return;
  }

  ev.preventDefault();

  const newRow = document.createElement('tr');

  const nameValue = form.querySelector('[data-qa="name"]').value;
  const positionValue = form.querySelector('[data-qa="position"]').value;
  const officeValue = form.querySelector('[data-qa="office"]').value;
  const ageValue = form.querySelector('[data-qa="age"]').value;
  const salaryValue = form.querySelector('[data-qa="salary"]').value;

  const ageNum = parseFloat(ageValue);
  const salaryNum = parseFloat(salaryValue);

  if (isNaN(ageNum)) {
    showNotification('Age must be a number.', 'warning');
    return;
  }

  if (ageNum < 18) {
    showNotification('Age must be at least 18.', 'warning');
    return;
  }

  if (ageNum > 90) {
    showNotification('Age must be less than 90.', 'warning');
    return;
  }

  if (nameValue.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'warning');
    return;
  }

  showNotification('Employee added successfully!', 'success');

  const formattedSalary = `$${salaryNum.toLocaleString('en-US')}`;

  function createCell(value) {
    const newCell = document.createElement('td');

    newCell.textContent = value;

    return newCell;
  }

  newRow.append(
    createCell(nameValue),
    createCell(positionValue),
    createCell(officeValue),
    createCell(ageValue),
    createCell(formattedSalary),
  );
  table.append(newRow);
  form.reset();
});
form.append(button);

// IMPLEMENTING EDITING OF TABLE CELLS BY DOUBLE CLICKING
table.addEventListener('dblclick', (ev) => {
  const targetCell = ev.target.closest('td');

  if (!targetCell || targetCell.querySelector('input')) {
    return;
  }

  const initialValue = targetCell.textContent;

  targetCell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  input.value = initialValue;

  targetCell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveCellValue(targetCell, input, initialValue);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveCellValue(targetCell, input, initialValue);
    }
  });
});

const saveCellValue = (cell, input, initialValue) => {
  const newValue = input.value;

  if (newValue === '') {
    cell.textContent = initialValue;
  } else {
    cell.textContent = newValue.trim();
  }

  input.remove();
};
