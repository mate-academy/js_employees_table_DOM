'use strict';

const table = document.querySelector('table');
const theader = [...table.querySelectorAll('th')];
const tbody = table.querySelector('tbody');

const sortDir = {};

theader.forEach((th, i) => {
  th.addEventListener('click', () => {
    const rows = [...tbody.querySelectorAll('tr')]; /* додавання рядків */

    sortDir[i] = !sortDir[i]; /* напрямок сортування */

    rows.sort((a, b) => {
      const direction = sortDir[i] ? 1 : -1; /* perevirka(true1/false-1) */
      const cellA =
        a.querySelectorAll('td')[i].textContent; /* distaemo tekst */
      const cellB = b.querySelectorAll('td')[i].textContent;
      const rawA = cellA.trim().replace(/[^0-9.-]/g, '');
      const numA = parseFloat(rawA); /* дістає число з рядка */
      const rawB = cellB.trim().replace(/[^0-9.-]/g, '');
      const numB = parseFloat(rawB);

      if (Number.isFinite(numA) && Number.isFinite(numB)) {
        return (numA - numB) * direction;
      }

      return (
        cellA.localeCompare(cellB) * direction
      ); /* sort by name ASC snd desc */
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr || !tbody.contains(tr)) {
    return;
  }

  const prev = tbody.querySelector('tr.active');

  if (prev && prev !== tr) {
    prev.classList.remove('active');
  }
  tr.classList.add('active');
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

  if (position.length < 3) {
    showNotification('Position must be at least 3 characters long.', 'error');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    showNotification('Salary must be a positive number.', 'error');

    return;
  }

  if (nam.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  const formattedSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // const tbody = document.querySelector('table tbody');
  const row = tbody.insertRow();

  row.insertCell().textContent = nam;
  row.insertCell().textContent = position;
  row.insertCell().textContent = office;
  row.insertCell().textContent = age;
  row.insertCell().textContent = formattedSalary;

  showNotification('New employee added to the table.', 'success');
  form.reset();
});

function showNotification(message, type) {
  notificationContainer.textContent = message;
  notificationContainer.className = type;
}
