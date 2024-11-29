'use strict';

// write code here
const headers = document.querySelectorAll('th');
const table = document.querySelector('table');
const body = document.querySelector('body');
let sortOrder = 'asc';
let currentColumn = null;
const rows = Array.from(table.rows);
const rowsTo = rows.slice(1, rows.length - 1);
const tBody = document.querySelector('tbody');
const rowsToActive = tBody.querySelectorAll('tr');

const sortBy = (columnIndex) => {
  rowsTo.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;

    if (currentColumn !== columnIndex) {
      sortOrder = 'asc';
    }

    switch (columnIndex) {
      case 0:
        currentColumn = 0;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 1:
        currentColumn = 1;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 2:
        currentColumn = 2;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 3:
        currentColumn = 3;

        return sortOrder === 'asc' ? +cellA - +cellB : +cellB - +cellA;
      case 4:
        currentColumn = 4;

        return sortOrder === 'asc'
          ? +cellA.slice(1).split(',').join('') -
              +cellB.slice(1).split(',').join('')
          : +cellB.slice(1).split(',').join('') -
              +cellA.slice(1).split(',').join('');
      default:
        return 0;
    }
  });

  rowsTo.forEach((row) => table.appendChild(row));

  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
};

rowsToActive.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => sortBy(index));
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `<label>Name: <input name='name' type='text' data-qa='name' required></input></label>
  <label>Position: <input name='position' type='text' data-qa='position' required></input></label>
  <label>Ofice: <select name='office' data-qa='office' required>
  <option value='Tokyo'>Tokyo</option>
  <option value='Singapore'>Singapore</option>
  <option value='London'>London</option>
  <option value='New York'>New York</option>
  <option value='Edinburgh'>Edinburgh</option>
  <option value='San Francisco'>San Francisco</option>
  </select></label>
  <label>Age: <input name='age' type='number' data-qa='age' required></input></label>
  <label>Salary: <input name='salary' type='number' data-qa='salary' required></input></label>
  <button type=submit>Save to table</button>`;

body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const tr = document.createElement('tr');
  const nameInput = form.elements['name'].value;
  const positionInput = form.elements['position'].value;
  const officeInput = form.elements['office'].value;
  const ageInput = form.elements['age'].value;
  const salaryInput = +form.elements['salary'].value;
  const normSalary = `$${salaryInput.toLocaleString('en-US')}`;

  tr.innerHTML = `<td>${nameInput}</td>
  <td>${positionInput}</td>
  <td>${officeInput}</td>
  <td>${String(ageInput)}</td>
  <td>${normSalary}</td>`;

  tBody.append(tr);
});
