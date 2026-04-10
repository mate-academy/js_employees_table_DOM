'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

// -1 потому что мы изначально не делаем никакое действие сортировки
let currentColumn = -1;
// asc - ascending
let currentDirection = 'asc';

thead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const rows = Array.from(tbody.querySelectorAll('tr'));
  const index = Array.from(e.target.parentNode.children).indexOf(e.target);

  if (currentColumn === index) {
    currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentColumn = index;
    currentDirection = 'asc';
  }

  rows.sort((a, b) => {
    let valueA = a.children[index].textContent.trim();
    let valueB = b.children[index].textContent.trim();

    if (index === 3 || index === 4) {
      valueA = Number(valueA.replace(/[$,]/g, ''));
      valueB = Number(valueB.replace(/[$,]/g, ''));
    } else {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }

    if (valueA < valueB) {
      return currentDirection === 'asc' ? -1 : 1;
    }

    if (valueA > valueB) {
      return currentDirection === 'asc' ? 1 : -1;
    }

    return 0;
  });

  tbody.append(...rows);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

// Notification
function showNotification(message, type) {
  const old = document.querySelector('[data-qa="notification"]');

  if (old) {
    old.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification');
  notification.classList.add(type);
  notification.textContent = message;

  document.body.append(notification);
}

// Новое поле
const form = document.createElement('form');

form.classList.add('new-employee-form');

// Name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';

nameLabel.append(nameInput);
form.append(nameLabel);

// Position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';

positionLabel.append(positionInput);
form.append(positionLabel);

// Office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

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

officeLabel.append(officeSelect);
form.append(officeLabel);

// Age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';

ageLabel.append(ageInput);
form.append(ageLabel);

// Salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';

salaryLabel.append(salaryInput);
form.append(salaryLabel);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(submitButton);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmployer = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value;
  const age = Number(ageInput.value);
  const salary = salaryInput.value.trim();

  if (nameEmployer.length < 4) {
    showNotification('Name is too short', 'error');

    return;
  }

  if (!position) {
    showNotification('Position is required', 'error');

    return;
  }

  if (!office) {
    showNotification('Office is required', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age is invalid', 'error');

    return;
  }

  if (!salary) {
    showNotification('Salary is required', 'error');

    return;
  }

  const tr = document.createElement('tr');

  const tdName = document.createElement('td');

  tdName.textContent = nameEmployer;

  const tdPosition = document.createElement('td');

  tdPosition.textContent = position;

  const tdOffice = document.createElement('td');

  tdOffice.textContent = office;

  const tdAge = document.createElement('td');

  tdAge.textContent = age;

  const tdSalary = document.createElement('td');

  tdSalary.textContent = `$${Number(salary).toLocaleString()}`;

  tr.append(tdName, tdPosition, tdOffice, tdAge, tdSalary);
  tbody.append(tr);

  form.reset();
  showNotification('Employee added', 'success');
});

document.body.append(form);
