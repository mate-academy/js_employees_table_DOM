'use strict';

const table = document.querySelector('table');
const titles = table.querySelectorAll('th');
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.noValidate = true;

const select = document.createElement('select');

select.name = 'office';
select.dataset.qa = 'office';
select.required = true;

let ascending = true;
let lastIndex = null;

const fields = [
  ['Name: ', 'name', 'text', 'name'],
  ['Position:', 'position', 'text', 'position'],
];

fields.forEach(([labelText, newName, type, qa]) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = labelText + ' ';
  input.name = newName;
  input.type = type;
  input.dataset.qa = qa;
  input.required = true;

  label.append(input);
  form.append(label);
});

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';
officeLabel.append(select);

form.append(officeLabel);

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

cities.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;

  select.append(option);
});

const otherFields = [
  ['Age:', 'age', 'number', 'age'],
  ['Salary:', 'salary', 'number', 'salary'],
];

otherFields.forEach(([labelText, newName, type, qa]) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = labelText + ' ';
  input.name = newName;
  input.type = type;
  input.dataset.qa = qa;
  input.required = true;

  label.append(input);
  form.append(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.append(button);
document.body.append(form);

form.addEventListener('submit', (newEvent) => {
  newEvent.preventDefault();

  const formData = new FormData(form);

  const employeeName = formData.get('name');
  const position = formData.get('position');
  const ageValue = Number(formData.get('age'));
  const salaryValue = Number(formData.get('salary'));
  const office = formData.get('office');

  if (
    !employeeName.trim() ||
    !position.trim() ||
    !ageValue ||
    !salaryValue ||
    !office
  ) {
    showNotification('error', 'Invalid data', 'All fields are required.');

    return;
  }

  const age = Number(ageValue);
  const salary = Number(salaryValue);

  if (employeeName.length < 4) {
    showNotification(
      'error',
      'Invalid name',
      'Name must contain at least 4 letters.',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Invalid age', 'Age must be between 18 and 90.');

    return;
  }

  const row = table.tBodies[0].insertRow();

  row.insertCell().textContent = employeeName;
  row.insertCell().textContent = position;
  row.insertCell().textContent = office;
  row.insertCell().textContent = age;
  row.insertCell().textContent = `$${salary.toLocaleString('en-US')}`;

  form.reset();

  showNotification(
    'success',
    'Employee added',
    'The new employee was successfully added to the table.',
  );
});

titles.forEach((title) => {
  title.addEventListener('click', () => {
    const columnIndex = title.cellIndex;

    sortRows(columnIndex);
  });
});

table.tBodies[0].addEventListener('click', (activeEvent) => {
  const row = activeEvent.target.closest('tr');

  if (!row) {
    return;
  }

  table.querySelector('.active')?.classList.remove('active');
  row.classList.add('active');
});

table.tBodies[0].addEventListener('dblclick', (editEvent) => {
  const cell = editEvent.target.closest('td');

  if (!cell || table.querySelector('.cell-input')) {
    return;
  }

  const initialValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;

  cell.textContent = '';
  cell.append(input);

  input.focus();

  input.addEventListener('blur', () => {
    saveCell(cell, input, initialValue);
  });

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveCell(cell, input, initialValue);
    }
  });
});

function saveCell(cell, input, initialValue) {
  const newValue = input.value.trim();

  cell.textContent = newValue || initialValue;
}

function showNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add(type);

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notification);
}

function sortRows(index) {
  if (lastIndex === index) {
    ascending = !ascending;
  } else {
    ascending = true;
    lastIndex = index;
  }

  const rows = Array.from(table.tBodies[0].rows);

  rows.sort((rowA, rowB) => {
    let cellA = rowA.cells[index].textContent.trim();
    let cellB = rowB.cells[index].textContent.trim();

    if (cellA.includes('$')) {
      cellA = parseFloat(cellA.replace(/[$,]/g, ''));
      cellB = parseFloat(cellB.replace(/[$,]/g, ''));

      return ascending ? cellA - cellB : cellB - cellA;
    }

    if (!isNaN(cellA) && !isNaN(cellB)) {
      return ascending
        ? parseFloat(cellA) - parseFloat(cellB)
        : parseFloat(cellB) - parseFloat(cellA);
    } else {
      return ascending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });
  rows.forEach((row) => table.tBodies[0].appendChild(row));
}
