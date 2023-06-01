'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const list = table.querySelector('tbody');
const rows = table.querySelectorAll('tbody tr');
const orders = {};

headers.forEach((element, index) => {
  orders[index] = 'asc';

  element.addEventListener('click', () => {
    const current = `td:nth-child(${index + 1})`;
    const order = orders[index];

    orders[index] = order === 'asc' ? 'desc' : 'asc';

    [...rows].sort((a, b) => {
      const nameA = a.querySelector(current)
        .textContent.replace(/[$,]/g, '');
      const nameB = b.querySelector(current)
        .textContent.replace(/[$,]/g, '');

      if (!isNaN(nameA)) {
        return order === 'asc' ? nameA - nameB : nameB - nameA;
      } else {
        return order === 'asc' ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
    }).forEach(row => list.appendChild(row));
  });
});

list.addEventListener('click', e => {
  const current = e.target.closest('tr');

  if (!current) {
    return;
  };

  rows.forEach(row => {
    if (row === current) {
      row.classList.toggle('active');
    } else {
      row.classList.remove('active');
    }
  });
});

table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form">
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
    ></label>
    <label>Position:
      <input
        name="position"
        type="text"
        data-qa="position"
    ></label>
    <label>Office:
      <select 
        name="position"
        data-qa="office"
      >
        <option selected disabled hidden></option>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input
        name="age"
        type="number"
        data-qa="age"
    ></label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
    ></label>
    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');
const inputs = form.querySelectorAll('input[data-qa]');
const select = form.querySelector('select[data-qa]');

form.addEventListener('submit', e => {
  e.preventDefault();

  const values = {};

  inputs.forEach(input => {
    values[input.getAttribute('data-qa')] = input.value;
  });
  values[select.getAttribute('data-qa')] = select.value;

  const nameEmployee = values['name'];
  const positionEmployee = values['position'];
  const officeEmployee = values['office'];
  const ageEmployee = parseInt(values['age']);
  const salaryEmployee = parseInt(values['salary']);

  if (nameEmployee.length < 4) {
    showNotification('error', 'The name must contain at least 4 letters.');
  } else if (positionEmployee.length === 0) {
    showNotification('error', 'The "Position" is empty.');
  } else if (!officeEmployee) {
    showNotification('error', 'The Office field is not selected.');
  } else if (isNaN(ageEmployee) || ageEmployee < 18 || ageEmployee > 90) {
    showNotification('error',
      'The age must be a valid number between 18 and 90.');
  } else if (isNaN(salaryEmployee)) {
    showNotification('error', 'The "Salary" is empty.');
  } else {
    const newRow = list.insertRow();

    headers.forEach(header => {
      const cell = newRow.insertCell();
      const columnName = header.textContent.toLowerCase();

      if (columnName === 'salary') {
        const salaryValue = '$' + values[columnName]
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        cell.textContent = salaryValue;
      } else {
        cell.textContent = values[columnName];
      }
    });

    showNotification('success',
      'The new employee is successfully added to the table.');

    inputs.forEach(input => {
      input.value = '';
    });
    select.value = '';
  }
});

function showNotification(type, message) {
  const notificationHTML = `
    <div class="notification ${type}" data-qa="notification">
      <h3>${type}</h3>
      <p>${message}</p>
    </div>
  `;

  form.insertAdjacentHTML('afterend', notificationHTML);

  const notification = document.querySelector('[data-qa="notification"]');

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
