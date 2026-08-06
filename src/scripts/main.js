'use strict';

// const body = document.querySelector('body');
const table = document.querySelector('table');
const header = table.querySelector('thead');
const headerRow = header.rows[0];
const headerCells = headerRow.cells;
const tbody = table.querySelector('tbody');

// SORTING

const currentSort = {
  column: null,
  direction: 'asc',
};

Array.from(headerCells).forEach((element, index) => {
  element.addEventListener('click', (e) => {
    if (currentSort.column === index) {
      currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.column = index;
      currentSort.direction = 'asc';
    }

    const rows = Array.from(tbody.rows);
    const cellNumber = element.cellIndex;

    const sortedRows = Array.from(rows).sort((a, b) => {
      const aText = a.cells[cellNumber].textContent;
      const bText = b.cells[cellNumber].textContent;
      let result;

      if (element.textContent === 'Salary') {
        result =
          parseFloat(aText.replace(/[^0-9.]/g, '')) -
          parseFloat(bText.replace(/[^0-9.]/g, ''));
      } else {
        result = aText.localeCompare(bText);
      }

      return currentSort.direction === 'desc' ? -result : result;
    });

    sortedRows.forEach((row) => tbody.append(row));
  });
});

// SELECT ROW

tbody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');

  if (currentRow) {
    tbody
      .querySelectorAll('tr.active')
      .forEach((r) => r.classList.remove('active'));

    currentRow.classList.add('active');
  }
});

// FORM

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  { label: 'Name:', name: 'name', type: 'text' },
  { label: 'Position:', name: 'position', type: 'text' },
  { label: 'Age:', name: 'age', type: 'number' },
  { label: 'Salary:', name: 'salary', type: 'number' },
];

fields.forEach((field) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = field.label;
  input.name = field.name;
  input.type = field.type;
  input.dataset.qa = field.name;

  label.appendChild(input);
  form.appendChild(label);
});

const labelSelect = document.createElement('label');
const select = document.createElement('select');

labelSelect.textContent = 'Office:';
select.name = 'select';
select.dataset.qa = 'office';

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

  select.appendChild(option);
});

labelSelect.appendChild(select);
form.appendChild(labelSelect);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = form.elements.name.value;
  const ageValue = form.elements.age.value;
  const positionValue = form.elements.position.value;
  const officeValue = form.elements.select.value;
  const salaryValue = form.elements.salary.value;

  if (nameValue.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (!positionValue) {
    showNotification('Position is required', 'error');

    return;
  }

  if (+ageValue < 18 || +ageValue > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  if (!officeValue) {
    showNotification('Office is required', 'error');

    return;
  }

  if (!salaryValue) {
    showNotification('Salary is required', 'error');

    return;
  }

  const newRow = tbody.insertRow();
  const nameCell = newRow.insertCell();
  const positionCell = newRow.insertCell();
  const officeCell = newRow.insertCell();
  const ageCell = newRow.insertCell();
  const salaryCell = newRow.insertCell();

  nameCell.textContent = nameValue;
  positionCell.textContent = positionValue;
  officeCell.textContent = officeValue;
  ageCell.textContent = ageValue;
  salaryCell.textContent = `$${Number(salaryValue).toLocaleString('en-US')}`;

  showNotification('Employee added!', 'success');
});

// NOTIFICATION

function showNotification(message, type) {
  const notification = document.createElement('div');
  const elemTitle = document.createElement('h2');
  const elemDescription = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  elemTitle.classList.add('title');
  elemTitle.textContent = 'Warning!';
  elemDescription.textContent = message;

  notification.appendChild(elemTitle);
  notification.appendChild(elemDescription);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}
