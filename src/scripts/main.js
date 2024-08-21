'use strict';

// write code here
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const sortState = {};

headers.forEach((header, index) => {
  sortState[index] = true;
});

table.addEventListener('click', function (e) {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const th = e.target;
  const colNumIndex = Array.from(th.parentNode.children).indexOf(th);

  sortTable(colNumIndex, sortState[colNumIndex]);
  sortState[colNumIndex] = !sortState[colNumIndex];
});

function sortTable(colIndex, isAscending) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    let cellA = rowA.cells[colIndex].textContent.trim();
    let cellB = rowB.cells[colIndex].textContent.trim();

    if (colIndex === 4) {
      cellA = parseFloat(cellA.replace(/[$,]/g, ''));
      cellB = parseFloat(cellB.replace(/[$,]/g, ''));
    }

    if (!isNaN(cellA) && !isNaN(cellB)) {
      if (isAscending) {
        return cellA - cellB;
      } else {
        return cellB - cellA;
      }
    } else {
      if (isAscending) {
        return cellA.localeCompare(cellB);
      } else {
        return cellB.localeCompare(cellA);
      }
    }
  });

  tbody.append(...rows);
}

table.addEventListener('click', function (e) {
  if (e.target.tagName !== 'TR' && e.target.tagName !== 'TD') {
    return;
  }

  const row = e.target.closest('tr');

  Array.from(table.querySelectorAll('tbody tr')).forEach((tr) => {
    tr.classList.remove('active');
  });

  if (row) {
    row.classList.add('active');
  }
});

const form = document.createElement('form');
const button = document.createElement('button');

button.textContent = 'Save to table';
form.classList.add('new-employee-form');

const fields = [
  { label: 'Name:', qa: 'name', type: 'text' },
  { label: 'Position:', qa: 'position', type: 'text' },
  {
    label: 'Office:',
    qa: 'office',
    type: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  { label: 'Age:', qa: 'age', type: 'number' },
  { label: 'Salary:', qa: 'salary', type: 'number' },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}`;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');
    input.setAttribute('data-qa', field.qa);

    field.options.forEach((optionValue) => {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;
      input.append(option);
    });
  } else {
    input = document.createElement('input');
    input.setAttribute('data-qa', field.qa);
    input.setAttribute('type', field.type);
  }

  label.append(input);

  form.append(label);
});
form.append(button);
document.body.append(form);

button.addEventListener('click', function (e) {
  e.preventDefault();

  const nameInput = form.querySelector(`[data-qa='name']`);
  const ageInput = form.querySelector(`[data-qa='age']`);
  const positionInput = form.querySelector(`[data-qa='position']`);
  const salaryInput = form.querySelector(`[data-qa='salary']`);
  let isValid = true;

  if (nameInput.value.length < 4) {
    showNotification('Error,name must be at least 4 letters long', 'error');
    isValid = false;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    showNotification(
      'Error,age must be more than 18 and less than 90',
      'error',
    );
    isValid = false;
  }

  if (positionInput.value === '') {
    showNotification('Error,position required!', 'error');
    isValid = false;
  }

  if (salaryInput.value === '') {
    showNotification('Error,salary required!', 'error');
    isValid = false;
  } else if (salaryInput.value < 0) {
    showNotification('Error,salary can`t be negative', 'error');
  }

  if (!isValid) {
    return;
  }

  const newRow = document.createElement('tr');

  fields.forEach((field) => {
    const cell = document.createElement('td');
    const input = form.querySelector(`[data-qa='${field.qa}']`);
    let valueHolder;

    if (field.qa === 'salary') {
      valueHolder = `$${(+input.value).toLocaleString('en-US')}`;
    } else {
      valueHolder = input.value;
    }

    cell.textContent = valueHolder;
    newRow.append(cell);
  });

  table.querySelector('tbody').append(newRow);
  form.reset();

  showNotification('Employee added successfully!', 'success');
});

function showNotification(message, type) {
  const existingNotification = document.querySelector(
    `[data-qa='notification']`,
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);
  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

document.querySelectorAll('td').forEach((td) => {
  td.addEventListener('dblclick', () => {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = td.textContent;
    input.defaultValue = td.textContent.trim();
    td.textContent = '';
    td.append(input);
    input.focus();

    input.addEventListener('blur', () => {
      td.textContent = input.value || input.defaultValue;
      input.remove();
    });

    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        td.textContent = input.value || input.defaultValue;
        input.remove();
      }
    });
  });
});
