'use strict';

const table = document.querySelector('table');
const headers = document.querySelectorAll('thead th');
const tableBody = table.querySelector('tbody');
const rows = table.querySelectorAll('tbody tr');

const sortDirection = {};

headers.forEach((header, i) => {
  if (!sortDirection[i]) {
    sortDirection[i] = 'asc';
  }
});

headers.forEach((header, index) => {
  header.addEventListener('click', function (el) {
    const columnIncludesNum = index === 3 || index === 4;
    const direction = sortDirection[index] === 'desc' ? 'asc' : 'desc';

    sortDirection[index] = direction;

    const sortRows = [...rows].sort((a, b) => {
      const aCell = a.cells[index].textContent;
      const bCell = b.cells[index].textContent;

      if (columnIncludesNum) {
        return sortNumber(aCell, bCell);
      } else {
        if (sortDirection[index] === 'asc') {
          return aCell.localeCompare(bCell);
        } else {
          return bCell.localeCompare(aCell);
        }
      }
    });

    tableBody.innerHTML = '';

    sortRows.forEach((row) => {
      tableBody.appendChild(row);
    });

    function sortNumber(a, b) {
      const numA = parseFloat(a.replace(/[^\d,]/g, ''));
      const numB = parseFloat(b.replace(/[^\d,]/g, ''));

      if (sortDirection[index] === 'asc') {
        return numB - numA;
      } else {
        return numA - numB;
      }
    }
  });
});

tableBody.addEventListener('click', function (el) {
  const clickedRow = el.target.closest('tr');

  document.querySelectorAll('tbody tr').forEach((r) => {
    r.classList.remove('active');
  });
  clickedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const msg = document.createElement('div');

msg.setAttribute('data-qa', 'notification');

msg.classList.add('error');
document.body.appendChild(msg);

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.type = 'text';
nameInput.name = 'name';
nameInput.setAttribute('data-qa', 'name');
nameInput.required = true;

nameLabel.appendChild(nameInput);
form.appendChild(nameLabel);

const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionLabel.textContent = 'Position:';
positionInput.type = 'text';
positionInput.name = 'position';
positionInput.setAttribute('data-qa', 'position');
positionInput.required = true;

positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const officeLabel = document.createElement('label');
const selectOffice = document.createElement('select');

officeLabel.textContent = 'Office:';
selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');
selectOffice.required = true;

cities.forEach((el) => {
  const optionOfficeFirst = document.createElement('option');

  optionOfficeFirst.textContent = el;

  selectOffice.appendChild(optionOfficeFirst);
});

officeLabel.appendChild(selectOffice);
form.appendChild(officeLabel);

const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageLabel.textContent = 'Age:';
ageInput.type = 'number';
ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;
ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryLabel.textContent = 'Salary:';
salaryInput.type = 'number';
salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;

salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

const btn = document.createElement('button');

btn.textContent = 'Save to table';

form.appendChild(btn);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  msg.textContent = '';
  msg.className = '';

  const nam = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value, 10);
  const salary = parseFloat(form.elements.salary.value);

  if (nam.length < 4) {
    alertMessage('name must be at least 4 characters long', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    alertMessage('age must be betwen 18 - 90', 'error');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    alertMessage('Salary must be a positive number.', 'error');

    return;
  }

  if (position.length < 3) {
    alertMessage('position must be at least 3 characters long', 'error');

    return;
  }

  const formattedSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const tbody = document.querySelector('table tbody');
  const row = tbody.insertRow();

  row.insertCell().textContent = nam;
  row.insertCell().textContent = position;
  row.insertCell().textContent = office;
  row.insertCell().textContent = age;
  row.insertCell().textContent = formattedSalary;

  alertMessage('New employee added to the table.', 'success');
  form.reset();
});

function alertMessage(mesage, type) {
  msg.textContent = mesage;
  msg.className = type;
}
