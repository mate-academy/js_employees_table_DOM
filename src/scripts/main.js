'use strict';

const head = document.querySelectorAll('thead tr th');
const body = document.querySelector('tbody');

let currentColumn = null;
let direction = 'asc';

head.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (currentColumn === index) {
      direction = direction === 'asc' ? 'desc' : 'asc';
    } else {
      currentColumn = index;
      direction = 'asc';
    }

    const multiplier = direction === 'asc' ? 1 : -1;

    const rowsA = Array.from(body.querySelectorAll('tr'));
    const sortedRows = rowsA.sort((a, b) => {
      const aCell = a.querySelectorAll('td')[index];
      const bCell = b.querySelectorAll('td')[index];
      const aValue = aCell.textContent.replace(/[$,]/g, '').trim();
      const bValue = bCell.textContent.replace(/[$,]/g, '').trim();

      if (!isNaN(aValue) && !isNaN(bValue)) {
        return (Number(aValue) - Number(bValue)) * multiplier;
      }

      return aValue.localeCompare(bValue) * multiplier;
    });

    sortedRows.forEach((row) => body.appendChild(row));
  });
});

const rows = document.querySelectorAll('tbody tr');

rows.forEach((row) => {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <h2>Add New Employee</h2>
  <label>Name: <input type="text" name="name" data-qa="name" placeholder="Name"> </label>
  <label>Position: <input type="text" name="position" data-qa="position" placeholder="Position"> </label>
  <label>Office: <select name="office" data-qa="office"></select></label>
  <label>Age: <input type="number" name="age" data-qa="age" placeholder="Age"> </label>
  <label>Salary: <input type="number" name="salary" data-qa="salary" placeholder="Salary"> </label>
  <button type="submit" data-qa="save-btn">Save to table</button>
`;

const select = form.querySelector('select');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  select.appendChild(option);
});

document.body.appendChild(form);

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 5000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmp = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const salary = form.querySelector('[data-qa="salary"]').value.trim();
  const age = form.querySelector('[data-qa="age"]').value.trim();
  const office = form.querySelector('[data-qa="office"]').value.trim();

  if (nameEmp.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  } else if (!position) {
    showNotification('Position is required', 'error');

    return;
  } else if (position.length < 2) {
    showNotification('Position must be at least 2 characters long.', 'error');

    return;
  } else if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  } else if (!salary) {
    showNotification('Salary is required', 'error');

    return;
  }

  if (nameEmp && position && salary && age && office) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${nameEmp}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${Number(salary).toLocaleString('en-US')}</td>
    `;
    body.appendChild(newRow);
    form.reset();
  }

  showNotification('Employee added successfully!', 'success');
});
