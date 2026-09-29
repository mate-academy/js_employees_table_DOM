'use strict';

const tbody = document.querySelector('tbody');
const headers = document.querySelectorAll('thead th');

// Select a table row when it is clicked.
tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow || clickedRow.parentElement !== tbody) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

// Sort the table by the clicked header.
let previousColumn = -1;
let ascending = true;

headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    if (previousColumn === columnIndex) {
      ascending = !ascending;
    } else {
      previousColumn = columnIndex;
      ascending = true;
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      let valueA = rowA.cells[columnIndex].textContent.trim();
      let valueB = rowB.cells[columnIndex].textContent.trim();
      let result;

      if (columnIndex === 3 || columnIndex === 4) {
        valueA = Number(valueA.replace(/[$,]/g, ''));
        valueB = Number(valueB.replace(/[$,]/g, ''));
        result = valueA - valueB;
      } else {
        result = valueA.localeCompare(valueB);
      }

      if (ascending) {
        return result;
      }

      return -result;
    });

    tbody.append(...rows);
  });
});

// Create the employee form.
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.noValidate = true;

const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameLabel.append('Name: ');
nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';
nameInput.required = true;
nameLabel.append(nameInput);
form.append(nameLabel);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionLabel.append('Position: ');
positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
positionInput.required = true;
positionLabel.append(positionInput);
form.append(positionLabel);

const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');
const officeNames = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

officeLabel.append('Office: ');
officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';
officeSelect.required = true;

officeNames.forEach((officeName) => {
  const option = document.createElement('option');

  option.value = officeName;
  option.textContent = officeName;
  officeSelect.append(option);
});

officeLabel.append(officeSelect);
form.append(officeLabel);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageLabel.append('Age: ');
ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
ageInput.required = true;
ageLabel.append(ageInput);
form.append(ageLabel);

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryLabel.append('Salary: ');
salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
salaryInput.required = true;
salaryInput.min = '0';
salaryInput.step = 'any';
salaryLabel.append(salaryInput);
form.append(salaryLabel);

const saveButton = document.createElement('button');

saveButton.type = 'submit';
saveButton.textContent = 'Save to table';
form.append(saveButton);
document.body.append(form);

// Show a short notification about the result.
function showNotification(type, titleText, messageText) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');
  const title = document.createElement('strong');
  const message = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  title.classList.add('title');
  title.textContent = titleText;
  message.textContent = messageText;
  notification.append(title, message);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Check form values and add a new row.
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = nameInput.value.trim();
  const employeePosition = positionInput.value.trim();
  const employeeOffice = officeSelect.value;
  const employeeAge = Number(ageInput.value);
  const employeeSalary = Number(salaryInput.value);

  if (
    !employeeName ||
    !employeePosition ||
    !employeeOffice ||
    !ageInput.value ||
    !salaryInput.value
  ) {
    showNotification('error', 'Missing information', 'Fill in every field.');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('error', 'Invalid name', 'Name needs at least 4 letters.');

    return;
  }

  if (employeeAge < 18 || employeeAge > 90) {
    showNotification('error', 'Invalid age', 'Age must be from 18 to 90.');

    return;
  }

  if (employeeSalary < 0 || Number.isNaN(employeeSalary)) {
    showNotification('error', 'Invalid salary', 'Enter a valid salary.');

    return;
  }

  const newRow = document.createElement('tr');
  const values = [
    employeeName,
    employeePosition,
    employeeOffice,
    String(employeeAge),
    `$${employeeSalary.toLocaleString('en-US')}`,
  ];

  values.forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;
    newRow.append(cell);
  });

  tbody.append(newRow);
  form.reset();

  showNotification(
    'success',
    'Employee added',
    'The new employee is in the table.',
  );
});
