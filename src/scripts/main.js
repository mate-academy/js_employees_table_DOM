'use strict';

const headers = document.querySelectorAll('thead tr th');

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const table = document.querySelector('table');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const index = Array.from(header.parentNode.children).indexOf(header);

    headers.forEach((h) => {
      if (h !== header) {
        h.classList.remove('ascending');
      }
    });

    const isAscending = header.classList.toggle('ascending');
    const sortedRows = rows.sort((a, b) => {
      const aText = a.querySelectorAll('td')[index].textContent;
      const bText = b.querySelectorAll('td')[index].textContent;

      if (isAscending) {
        if (!isNaN(Number(aText)) && !isNaN(Number(bText))) {
          return parseFloat(aText) - parseFloat(bText);
        }

        return aText.localeCompare(bText);
      } else {
        if (!isNaN(Number(aText)) && !isNaN(Number(bText))) {
          return parseFloat(bText) - parseFloat(aText);
        }

        return bText.localeCompare(aText);
      }
    });
    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});

const tr = document.querySelectorAll('tbody tr');
let prevSelectedRow = document.querySelector('tbody tr.active');

tr.forEach((row) => {
  row.addEventListener('click', () => {
    if (prevSelectedRow) {
      prevSelectedRow.classList.remove('active');
    }
    row.classList.add('active');
    prevSelectedRow = row;
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.type = 'text';
nameInput.name = 'name';
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('required', 'true');
nameLabel.appendChild(nameInput);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.type = 'text';
positionInput.name = 'position';
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('required', 'true');
positionLabel.appendChild(positionInput);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const officeInput = document.createElement('select');
const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

officeInput.name = 'office';
officeInput.setAttribute('data-qa', 'office');
officeInput.setAttribute('required', 'true');

officeOptions.forEach((option) => {
  const opt = document.createElement('option');

  opt.value = option;
  opt.textContent = option;
  officeInput.appendChild(opt);
});
officeLabel.appendChild(officeInput);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.type = 'number';
ageInput.name = 'age';
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('required', 'true');
ageLabel.appendChild(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';

const salaryInput = document.createElement('input');

salaryInput.type = 'number';
salaryInput.name = 'salary';
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('required', 'true');
salaryLabel.appendChild(salaryInput);

const addButton = document.createElement('button');

addButton.textContent = 'Add Employee';
addButton.type = 'submit';
form.appendChild(nameLabel);
form.appendChild(positionLabel);
form.appendChild(officeLabel);
form.appendChild(ageLabel);
form.appendChild(salaryLabel);
form.appendChild(addButton);
document.body.appendChild(form);

const addEmployee = (e) => {
  e.preventDefault();

  const names = nameInput.value;
  const position = positionInput.value;
  const office = officeInput.value;
  const age = Number(ageInput.value);
  const salary = `$${parseFloat(salaryInput.value).toLocaleString('en-US')}`;

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary}</td>
  `;

  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.setAttribute('data-qa', 'notification');

  if (names.length < 4) {
    notification.textContent = 'Name must be at least 4 characters long';
    notification.classList.add('error');
  } else if (age < 18 || age > 90) {
    notification.textContent = 'Age must be at least 18 and less than 90';
    notification.classList.add('error');
  } else {
    notification.textContent = 'Employee added successfully';
    notification.classList.add('success');
    document.querySelector('tbody').appendChild(newRow);
  }
  notification.style.position = 'fixed';
  notification.style.top = '50%';
  notification.style.right = '50%';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

form.addEventListener('submit', addEmployee);

let doubleClick = false;
let activeRow = null;

const handleKeydown = (e) => {
  if (!activeRow) {
    return;
  }

  const cells = activeRow.querySelectorAll('td');

  if (e.key === 'Enter') {
    cells.forEach((cell, cellIndex) => {
      const input = cell.querySelector('input');
      const inputValue = input ? input.value.trim() : '';

      if (input && inputValue !== '') {
        cell.textContent = inputValue;
      } else {
        cell.textContent = cell.dataset.originalText || '';
      }
    });

    doubleClick = false;
    activeRow.removeEventListener('keydown', handleKeydown);
    activeRow = null;
  }
};

tr.forEach((row) => {
  row.addEventListener('dblclick', () => {
    if (doubleClick) {
      return;
    }

    const cells = row.querySelectorAll('td');

    cells.forEach((cell) => {
      const input = document.createElement('input');

      input.classList.add('cell-input');
      cell.dataset.originalText = cell.textContent;
      input.type = 'text';
      input.value = cell.textContent;
      cell.innerHTML = '';
      cell.appendChild(input);
    });

    doubleClick = true;
    activeRow = row;

    row.addEventListener('keydown', handleKeydown);
  });
});
