'use strict';
// import { addForm } from './form';

// addForm();

const table = document.querySelector('table');
const head = table.querySelector('thead');
const bodyTable = table.querySelector('tbody');

head.addEventListener('click', onClick);
bodyTable.addEventListener('click', onRowClick);

function onClick(eve) {
  const clickedHeader = eve.target.closest('th');

  if (!clickedHeader) {
    return;
  }

  const indexTh = clickedHeader.cellIndex;
  const currentOrder = clickedHeader.dataset.order;
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

  clickedHeader.dataset.order = newOrder;

  const rows = bodyTable.querySelectorAll('tr');
  const arrayRow = Array.from(rows);

  arrayRow.sort((a, b) => {
    let valueA = a.cells[indexTh].textContent.trim();

    let valueB = b.cells[indexTh].textContent.trim();

    valueA = valueA.replace(/[$,]/g, '');
    valueB = valueB.replace(/[$,]/g, '');

    const numberA = Number(valueA);
    const numberB = Number(valueB);

    if (!isNaN(numberA) && !isNaN(numberB)) {
      return parseFloat(numberA) - parseFloat(numberB);
    } else {
      return valueA.localeCompare(valueB);
    }
  });

  if (newOrder === 'desc') {
    arrayRow.reverse();
  }

  bodyTable.append(...arrayRow);
}

function onRowClick(eve) {
  const clickRow = eve.target.closest('tr');
  const rows = bodyTable.querySelectorAll('tr');

  if (!clickRow) {
    return;
  }

  rows.forEach((row) => {
    row.classList.remove('active');
  });
  clickRow.classList.add('active');
}
// add form

const form = document.createElement('form');

form.classList.add('new-employee-form');

// add name
const nameLabel = document.createElement('label');

nameLabel.setAttribute('for', 'name');
nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('id', 'name');
nameInput.setAttribute('name', 'name');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('required', '');

nameLabel.appendChild(nameInput);
form.appendChild(nameLabel);

// add position
const positionLabel = document.createElement('label');

positionLabel.setAttribute('for', 'position');
positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('id', 'position');
positionInput.setAttribute('name', 'position');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('required', '');

positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

// add office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const officeOption = document.createElement('select');

officeOption.setAttribute('name', 'office');
officeOption.setAttribute('id', 'office');
officeOption.setAttribute('data-qa', 'office');
officeOption.setAttribute('required', '');

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
  officeOption.appendChild(option);
});
officeLabel.appendChild(officeOption);
form.appendChild(officeLabel);

// age field

const ageLabel = document.createElement('label');

ageLabel.setAttribute('for', 'age');
ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('name', 'age');
ageInput.setAttribute('id', 'age');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('required', '');

ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

// salary field

const salaryLabel = document.createElement('label');

salaryLabel.setAttribute('for', 'salary');
salaryLabel.textContent = 'Salary:';

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('id', 'salary');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('required', '');

salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

// add button

const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.appendChild(form);

// add listener for button submit

form.addEventListener('submit', onSubmit);

function onSubmit(eve) {
  eve.preventDefault();

  const employeeData = {};

  const elements = form.elements;

  for (const element of elements) {
    if (element.name) {
      employeeData[element.name] = element.value;
    }
  }

  if (!validateName(employeeData.name)) {
    return;
  }

  if (!validateAge(employeeData.age)) {
    return;
  }

  const tr = document.createElement('tr');

  for (const key in employeeData) {
    const td = document.createElement('td');

    if (key === 'salary') {
      const salary = Number(employeeData[key]);

      td.textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(salary);
    } else {
      td.textContent = employeeData[key];
    }

    tr.appendChild(td);
  }
  bodyTable.appendChild(tr);
  pushNotification('Success', 'Employee added successfully', 'success');
  form.reset();
}

function validateName(value) {
  if (value.length < 4) {
    pushNotification(
      'Invalid Name',
      'Name must have at least 4 letters',
      'error',
    );

    return false;
  }

  return true;
}

function validateAge(age) {
  const ageNumber = Number(age);

  if (ageNumber >= 18 && ageNumber <= 90) {
    return true;
  } else {
    pushNotification('Invalid Age', 'Age must be between 18 and 90', 'error');

    return false;
  }
}

const pushNotification = (title, description, type) => {
  const element = document.createElement('div');
  const titleElem = document.createElement('h2');
  const descrElem = document.createElement('p');

  element.classList.add('notification', type);
  element.setAttribute('data-qa', 'notification');
  titleElem.classList.add('title');
  titleElem.textContent = title;
  descrElem.textContent = description;

  document.body.appendChild(element);
  element.appendChild(titleElem);
  element.appendChild(descrElem);

  setTimeout(() => {
    element.style.display = 'none';
  }, 2000);
};
