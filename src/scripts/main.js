/* eslint-disable indent */
'use strict';

const headers = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');
let currentSortColumn = null;
let sortDirection = 'asc';

headers.forEach((header, index) => {
  header.addEventListener('click', (e) => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));

    const sortedRows = rows.map((row) => {
      const value =
        index === 4
          ? row.children[index].textContent
              .trim()
              .replaceAll(',', '')
              .replace('$', '')
          : row.children[index].textContent.trim();

      return {
        element: row,
        value,
      };
    });

    if (currentSortColumn === index) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = index;
      sortDirection = 'asc';
    }

    sortedRows.sort((a, b) => {
      if (!isNaN(Number(a.value))) {
        return sortDirection === 'asc'
          ? Number(a.value) - Number(b.value)
          : Number(b.value) - Number(a.value);
      } else {
        return sortDirection === 'asc'
          ? a.value.localeCompare(b.value)
          : b.value.localeCompare(a.value);
      }
    });

    tbody.innerHTML = '';
    sortedRows.forEach((obj) => tbody.appendChild(obj.element));
  });
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  const allRows = tbody.querySelectorAll('tr');

  allRows.forEach((row) => {
    row.classList.remove('active');
  });

  if (tr) {
    tr.classList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.prepend(form);

// NAME //

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameLabel.textContent = 'Name: ';
nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';

nameLabel.appendChild(nameInput);
form.appendChild(nameLabel);

// POSITION //

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionLabel.textContent = 'Position: ';
positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';

positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

// CITY //

const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');
const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

officeLabel.textContent = 'Office: ';
officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

cities.forEach((city) => {
  const option = document.createElement('option');

  option.textContent = city;
  option.value = city;
  officeSelect.appendChild(option);
});

officeLabel.appendChild(officeSelect);
form.appendChild(officeLabel);

// AGE //

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageLabel.textContent = 'Age: ';
ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';

ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

// SALARY //

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryLabel.textContent = 'Salary: ';
salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';

salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

// BUTTON

const SubmitBTN = document.createElement('button');

SubmitBTN.type = 'submit';
SubmitBTN.textContent = 'Save to table';

form.appendChild(SubmitBTN);

// EVENT //

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmployee = nameInput.value;
  const position = positionInput.value;
  const office = officeSelect.value;
  const age = Number(ageInput.value);
  const salary = salaryInput.value;
  let message = '';

  if (nameEmployee.length < 4) {
    message = 'Name is too short';
  }

  if (age < 18 || age > 90) {
    message = 'Invalid age';
  }

  if (position.length < 2) {
    message = 'Invalid position';
  }

  if (salary <= 0) {
    message = 'Invalid salary';
  }

  if (message !== '') {
    const error = document.createElement('div');

    error.classList.add('notification', 'error');
    error.dataset.qa = 'notification';
    error.textContent = message;

    setTimeout(() => {
      error.remove();
    }, 2000);

    document.body.appendChild(error);

    return;
  }

  const newEmployee = document.createElement('tr');
  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  newName.textContent = nameEmployee;
  newPosition.textContent = position;
  newOffice.textContent = office;
  newAge.textContent = age;
  newSalary.textContent = '$' + Number(salary).toLocaleString();

  newEmployee.appendChild(newName);
  newEmployee.appendChild(newPosition);
  newEmployee.appendChild(newOffice);
  newEmployee.appendChild(newAge);
  newEmployee.appendChild(newSalary);
  tbody.appendChild(newEmployee);

  form.reset();

  const success = document.createElement('div');

  success.classList.add('notification', 'success');
  success.dataset.qa = 'notification';
  success.textContent = 'Employee was added successfully';

  setTimeout(() => {
    success.remove();
  }, 2000);

  document.body.appendChild(success);
});
