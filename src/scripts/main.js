'use strict';

const sortState = new Map();

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const columnIndex = e.target.cellIndex;
    const table = e.target.closest('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    const isAscending = sortState.get(columnIndex) ?? true;

    rows.sort((rowA, rowB) => {
      let cellA = rowA.cells[columnIndex].textContent.trim();
      let cellB = rowB.cells[columnIndex].textContent.trim();

      if (columnIndex === 4) {
        cellA = parseFloat(cellA.replace(/[$,]/g, ''));
        cellB = parseFloat(cellB.replace(/[$,]/g, ''));
      }

      let comparison;

      if (isNaN(cellA) || isNaN(cellB)) {
        comparison = cellA.localeCompare(cellB);
      } else {
        comparison = Number(cellA) - Number(cellB);
      }

      return isAscending ? comparison : -comparison;
    });

    sortState.set(columnIndex, !isAscending);

    rows.forEach((row) => tbody.appendChild(row));
  }

  if (e.target.tagName === 'TD') {
    const table = e.target.closest('table');
    const rows = table.querySelectorAll('tr');

    rows.forEach((r) => r.classList.remove('active'));

    const row = e.target.closest('TR');

    row.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const newEmployeeForm = document.createElement('form');

  newEmployeeForm.classList.add('new-employee-form');

  newEmployeeForm.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="" disabled selected>Select an office</option>
        <option value="tokyo">Tokyo</option>
        <option value="singapore">Singapore</option>
        <option value="london">London</option>
        <option value="new_york">New York</option>
        <option value="edinburgh">Edinburgh</option>
        <option value="san_francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="button">Save to table</button>
  `;

  document.body.appendChild(newEmployeeForm);

  const button = document.querySelector('button');

  const nameInput = document.querySelector('[name="name"]');
  const ageInput = document.querySelector('[name="age"]');
  const positionInput = document.querySelector('[name="position"]');
  const officeInput = document.querySelector('[name="office"]');
  const salaryInput = document.querySelector('[name="salary"]');

  const notif = document.createElement('div');

  notif.classList.add('notification');
  notif.setAttribute('data-qa', 'notification');

  button.addEventListener('click', () => {
    if (
      nameInput.value.length > 4 &&
      ageInput.value > 18 &&
      ageInput.value < 90 &&
      positionInput.value.length > 0 &&
      officeInput.value.length > 0 &&
      salaryInput.value > 0
    ) {
      const newRow = document.createElement('tr');

      const sal = parseFloat(salaryInput.value);

      const niceName = niceWords(nameInput.value);
      const nicePosition = niceWords(positionInput.value);
      const niceOffice = niceWords(officeInput.value);
      const niceSalary = sal.toLocaleString('en-US');

      newRow.innerHTML = `
        <td>${niceName}</td>
        <td>${nicePosition}</td>
        <td>${niceOffice}</td>
        <td>${ageInput.value}</td>
        <td>$${niceSalary}</td>`;

      const tableBody = document.querySelector('tbody');

      tableBody.appendChild(newRow);

      nameInput.value = '';
      ageInput.value = '';
      positionInput.value = '';
      officeInput.value = '';
      salaryInput.value = '';

      notif.style.display = 'flex';
      notif.style.flexDirection = 'column';

      notif.innerHTML = `
        <p class="title">Success!!!</p>
        <p>Your data is successfully added</p>
      `;

      notif.setAttribute('title', 'hello');

      showNotification(notif, 'success');
    } else {
      notif.innerHTML = `
        <p class="title">ERROOOOOR!!!</p>

        <p>Enter valid data</p>
      `;
      showNotification(notif, `error`);
    }
  });
});

function niceWords(input) {
  const result = input.split(' ');

  result[0] =
    result[0].charAt(0).toUpperCase() + result[0].slice(1).toLowerCase();

  if (result[1]) {
    result[1] =
      result[1].charAt(0).toUpperCase() + result[1].slice(1).toLowerCase();
  }

  const newName = result.join(' ');

  return newName;
}

function showNotification(notification, type) {
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add(`${type}`);
    notification.style.display = 'flex';
    notification.style.flexDirection = 'column';
  }, 0);

  setTimeout(() => {
    notification.classList.remove(type);
    notification.style.display = 'none';
  }, 3500);
}
