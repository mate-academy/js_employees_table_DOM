'use strict';

// write code here

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');

  let currentColumn = null;
  let isAscending = true;

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const columnIndex = header.cellIndex;
      // eslint-disable-next-line no-shadow
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (currentColumn === columnIndex) {
        isAscending = !isAscending;
      } else {
        isAscending = true;
      }

      currentColumn = columnIndex;

      const isNumeric = columnIndex === 3 || columnIndex === 4;

      rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[columnIndex].innerText.trim();
        let cellB = rowB.cells[columnIndex].innerText.trim();

        if (isNumeric) {
          cellA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
          cellB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

          return isAscending ? cellA - cellB : cellB - cellA;
        } else {
          return isAscending
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });

      tbody.innerHTML = '';

      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // tbody.addEventListener('click', (ev) => {
  //   const clickedRow = ev.target.closest('tr');

  //   if (!clickedRow) {
  //     // eslint-disable-next-line no-useless-return
  //     return;
  //   }

  //   tbody
  //     .querySelectorAll('tr')
  //     .forEach((row) => row.classList.remove('active'));
  //   clickedRow.classList.add('active');
  // });

  const rows = document.querySelectorAll('tr');

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));

      row.classList.add('active');
    });
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
  <label>Name: <input name='name' type='text' data-qa='name'></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name='age' type='number' data-qa='age'></label>
    <label>Salary: <input name='salary' type='number' data-qa='salary'></label>
    <button type='submit'>Save to table</button>
    `;

  document.body.appendChild(form);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    // eslint-disable-next-line no-shadow
    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value.trim();
    const age = Number(form.age.value);
    const salary = Number(form.salary.value);

    if (name.length < 4) {
      showNotification('Name must have at least 4 letters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    if (!salary || salary < 0) {
      showNotification('Salary must be a positive number', 'error');

      return;
    }

    addEmployeeToTable(
      name,
      position,
      office,
      age,
      `$${salary.toLocaleString()}`,
    );
    showNotification('Employee added successfully', 'success');
    form.reset();
  });
});

// eslint-disable-next-line no-shadow
function addEmployeeToTable(name, position, office, age, salary) {
  const tbody = document.querySelector('tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
  <td>${name}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${salary}</td>
  `;

  tbody.appendChild(newRow);
}

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<span class='title'>${type === 'error' ? 'error' : 'success'}:</span> ${message}`;

  document.body.appendChild(notification);
}
