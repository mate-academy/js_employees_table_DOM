'use strict';

const table = document.querySelector('table');
const th = table.querySelectorAll('th');
const sortDirections = {};
const tbody = table.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

th.forEach((column, index) => {
  column.addEventListener('click', () => {
    sortDirections[index] = !sortDirections[index];

    sortColumn(index, sortDirections[index]);
  });
});

function sortColumn(columnIndex, ascending = true) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  const parseCellValue = (cell) => {
    const text = cell.textContent.replace('$', '').replace(',', '');

    return isNaN(text) ? text : parseFloat(text);
  };

  const compare = (a, b) => {
    const valueA = parseCellValue(a.cells[columnIndex]);
    const valueB = parseCellValue(b.cells[columnIndex]);

    if (typeof valueA === 'string' || typeof valueB === 'string') {
      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return ascending ? valueA - valueB : valueB - valueA;
  };

  rows.sort(compare);
  tbody.append(...rows);
}

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.querySelector('body').appendChild(form);

// Name field
const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameLabel.textContent = 'Name: ';
nameLabel.setAttribute('for', 'name');
nameInput.setAttribute('name', 'name');
nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('id', 'name');
nameInput.setAttribute('required', '');

// Position field
const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionLabel.textContent = 'Position: ';
positionLabel.setAttribute('for', 'position');
positionInput.setAttribute('name', 'position');
positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('id', 'position');
positionInput.setAttribute('required', '');

// Office field
const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeLabel.textContent = 'Office: ';
officeLabel.setAttribute('for', 'office');
officeSelect.setAttribute('name', 'office');
officeSelect.setAttribute('data-qa', 'office');
officeSelect.setAttribute('id', 'office');
officeSelect.setAttribute('required', '');

const cities = ['London', 'New York', 'San Francisco', 'Sidney', 'Tokyo'];

cities.forEach((city) => {
  const option = document.createElement('option');

  option.setAttribute('value', city);
  option.textContent = city;
  officeSelect.appendChild(option);
});

// Age field
const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageLabel.textContent = 'Age: ';
ageLabel.setAttribute('for', 'age');
ageInput.setAttribute('name', 'age');
ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('id', 'age');
ageInput.setAttribute('required', '');

// Salary field
const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryLabel.textContent = 'Salary: ';
salaryLabel.setAttribute('for', 'salary');
salaryInput.setAttribute('name', 'salary');
salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('id', 'salary');
salaryInput.setAttribute('required', '');

// Save button
const saveButton = document.createElement('button');

saveButton.textContent = 'Save to table';
saveButton.setAttribute('type', 'submit');
saveButton.setAttribute('data-qa', 'save');

// Append fields

form.appendChild(nameLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salaryLabel);
form.appendChild(saveButton);
nameLabel.appendChild(nameInput);
positionLabel.appendChild(positionInput);
officeLabel.appendChild(officeSelect);
ageLabel.appendChild(ageInput);
salaryLabel.appendChild(salaryInput);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fullName = nameInput.value;
  const position = positionInput.value;
  const city = officeSelect.value;
  const age = +ageInput.value;
  const salary = +salaryInput.value;

  fillNewEmployeeForm(fullName, position, city, age, salary);
});

function fillNewEmployeeForm(fullName, position, city, age, salary) {
  if (fullName.length < 4) {
    showNotification('error', 'Error', 'Name value has fewer than 4 letters');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Error', 'Age value should be between 18 and 90');

    return;
  }

  const tr = document.createElement('tr');
  const tdName = document.createElement('td');
  const tdPosition = document.createElement('td');
  const tdOffice = document.createElement('td');
  const tdAge = document.createElement('td');
  const tdSalary = document.createElement('td');

  tdName.textContent = fullName;
  tdPosition.textContent = position;
  tdOffice.textContent = city;
  tdAge.textContent = age;
  tdSalary.textContent = salary;
  tr.appendChild(tdName);
  tr.appendChild(tdPosition);
  tr.appendChild(tdOffice);
  tr.appendChild(tdAge);
  tr.appendChild(tdSalary);
  tbody.appendChild(tr);

  nameInput.value = '';
  positionInput.value = '';
  officeSelect.value = 'London';
  ageInput.value = '';
  salaryInput.value = '';

  showNotification('success', 'Success', 'New employee added');
}

function showNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<h2>${title}</h2><p>${description}</p>`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
