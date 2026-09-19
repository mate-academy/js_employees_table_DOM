'use strict';

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

document.body.append(form);

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameLabel.textContent = 'Name: ';
nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';
nameInput.required = true;

nameLabel.append(nameInput);
form.append(nameLabel);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionLabel.textContent = 'Position: ';
positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
positionInput.required = true;

positionLabel.append(positionInput);
form.append(positionLabel);

const officeSelect = document.createElement('select');
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';
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

  option.textContent = office;
  option.value = office;

  officeSelect.append(option);
});

officeLabel.append(officeSelect);
form.append(officeLabel);

const ageInput = document.createElement('input');
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
ageInput.required = true;

ageLabel.append(ageInput);
form.append(ageLabel);

const salaryInput = document.createElement('input');
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
salaryInput.required = true;

salaryLabel.append(salaryInput);
form.append(salaryLabel);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(submitButton);

form.addEventListener('submit', (clickEvent) => {
  clickEvent.preventDefault();

  const employeeName = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value;
  const age = Number(ageInput.value);
  const salary = Number(salaryInput.value);

  if (employeeName.length < 4) {
    showNotification('error', 'Name must contain at least 4 letters');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Age must be between 18 and 90');

    return;
  }

  if (!position) {
    showNotification('error', 'Position is required',);

    return;
  }

  if (!position || !office || !salary) {
    showNotification('error', 'All fields are required');

    return;
  }

  const row = document.createElement('tr');

  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = employeeName;
  positionCell.textContent = position;
  officeCell.textContent = office;
  ageCell.textContent = age;
  salaryCell.textContent = `$${salary.toLocaleString('en-US')}`;

  row.append(nameCell, positionCell, officeCell, ageCell, salaryCell);

  tbody.append(row);

  showNotification('success', 'Employee added successfully');
});

function showNotification(type, message) {
  const notification = document.createElement('div');
  const title = document.createElement('span');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', type);

  title.className = 'title';
  title.textContent = type === 'error' ? 'Error' : 'Success';

  notification.append(title, message);

  document.body.append(notification);
}

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
let isAscending = true;
let previousIndex = null;

thead.addEventListener('click', (clickEvent) => {
  const header = clickEvent.target.closest('th');

  if (!header) {
    return;
  }

  const index = header.cellIndex;

  if (index !== previousIndex) {
    isAscending = true;
  }

  const rows = [...tbody.querySelectorAll('tr')];

  rows.sort((rowA, rowB) => {
    const valueA = rowA.cells[index].textContent.trim();
    const valueB = rowB.cells[index].textContent.trim();

    if (header.textContent.trim() === 'Salary') {
      const salaryA = Number(valueA.replace('$', '').replaceAll(',', ''));
      const salaryB = Number(valueB.replace('$', '').replaceAll(',', ''));

      return isAscending ? salaryA - salaryB : salaryB - salaryA;
    }

    if (header.textContent.trim() === 'Age') {
      return isAscending
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    return isAscending
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  rows.forEach((row) => {
    tbody.append(row);
  });

  previousIndex = index;
  isAscending = !isAscending;
});

tbody.addEventListener('click', (clickEvent) => {
  const row = clickEvent.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});
