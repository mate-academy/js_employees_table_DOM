'use strict';

const headers = document.querySelectorAll('th');
const tableBody = document.querySelector('table tbody');
const rows = [...tableBody.querySelectorAll('tr')];

const sortOrder = {};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortTable(index);
  });
});

function sortTable(columnIndex) {
  const currentOrder = sortOrder[columnIndex] || 'asc';
  const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

  sortOrder[columnIndex] = newOrder;

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;

    if (newOrder === 'asc') {
      return cellA.localeCompare(cellB, undefined, { numeric: true });
    } else {
      return cellB.localeCompare(cellA, undefined, { numeric: true });
    }
  });
  tableBody.innerHTML = '';
  rows.forEach((row) => tableBody.appendChild(row));
}

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';

inputName.setAttribute('data-qa', 'name');
inputName.required = true;
nameLabel.appendChild(inputName);
form.appendChild(nameLabel);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';

positionInput.setAttribute('data-qa', 'position');
positionInput.required = true;
positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';

officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;

[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.appendChild(option);
});
officeLabel.appendChild(officeSelect);
form.appendChild(officeLabel);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';

ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;
ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';

salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;
salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
form.appendChild(button);
document.body.appendChild(form);

const notificationContainer = document.createElement('div');

notificationContainer.setAttribute('data-qa', 'notification');
document.body.appendChild(notificationContainer);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  notificationContainer.textContent = '';
  notificationContainer.className = '';

  const nam = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value, 10);
  const salary = parseFloat(form.elements.salary.value);

  if (nam.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  const tbody = document.querySelector('table tbody');
  const row = tbody.insertRow();

  row.insertCell().textContent = nam;
  row.insertCell().textContent = position;
  row.insertCell().textContent = office;
  row.insertCell().textContent = age;
  row.insertCell().textContent = salary;

  showNotification('New employee added to the table.', 'success');

  form.reset();
});

function showNotification(message, type) {
  notificationContainer.textContent = message;
  notificationContainer.className = `notification ${type}`;
}
