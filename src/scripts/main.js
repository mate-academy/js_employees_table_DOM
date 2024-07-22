'use strict';

const table = document.querySelector('table');
// const form = document.createElement('form');
// const headers = table.querySelectorAll('thead th');
// const tBody = table.querySelector('tbody');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
}

document.addEventListener('DOMContentLoaded', () => {
  const headers = table.querySelectorAll('th');
  const rows = table.querySelectorAll('tbody tr');

  let currentSortedColumn = null;
  let currentSortOrder = 'asc';

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      sortTable(index);
    });
  });

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });

    Array.from(row.cells).forEach((cell) => {
      cell.addEventListener('dblclick', () => {
        editCell(cell);
      });
    });
  });

  function sortTable(columnIndex) {
    const tbody = table.querySelector('tbody');
    const rowsArray = Array.from(tbody.rows);

    let isAscending;

    if (currentSortedColumn === columnIndex) {
      isAscending = currentSortOrder === 'desc';
      currentSortOrder = isAscending ? 'asc' : 'desc';
    } else {
      isAscending = true;
      currentSortOrder = 'asc';
    }
    currentSortedColumn = columnIndex;

    rowsArray.sort((a, b) => {
      const cellA = a.cells[columnIndex].innerText;
      const cellB = b.cells[columnIndex].innerText;

      if (isAscending) {
        return cellA.localeCompare(cellB, undefined, { numeric: true });
      } else {
        return cellB.localeCompare(cellA, undefined, { numeric: true });
      }
    });

    rowsArray.forEach((row) => tbody.appendChild(row));
  }

  // Create the form
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>Office: 
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  `;
  document.body.appendChild(form);

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const n = form.querySelector('input[name="name"]').value;
    const position = form.querySelector('input[name="position"]').value;
    const office = form.querySelector('select[name="office"]').value;
    const age = form.querySelector('input[name="age"]').value;
    const salary = form.querySelector('input[name="salary"]').value;

    const notification = document.createElement('div');

    notification.classList.add('notification');

    notification.setAttribute('data-qa', 'notification');

    if (n.length < 4) {
      notification.classList.add('error');

      notification.innerText =
        'Error: Name must be at least 4 characters long.';
      document.body.appendChild(notification);
    } else if (!position.length) {
      notification.classList.add('error');

      notification.innerText = 'Error:Position should exist.';
      document.body.appendChild(notification);
    } else if (age < 18 || age > 90) {
      notification.classList.add('error');
      notification.innerText = 'Error: Age must be between 18 and 90.';
      document.body.appendChild(notification);
    } else {
      notification.classList.add('success');
      document.body.appendChild(notification);

      const newRow = document.createElement('tr');

      newRow.innerHTML = `
        <td>${n}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${formatCurrency(salary)}</td>
      `;

      newRow.addEventListener('click', () => {
        rows.forEach((r) => r.classList.remove('active'));
        newRow.classList.add('active');
      });

      Array.from(newRow.cells).forEach((cell) => {
        cell.addEventListener('dblclick', () => {
          editCell(cell);
        });
      });

      table.querySelector('tbody').appendChild(newRow);

      form.reset();
    }
  });

  function editCell(cell) {
    if (cell.querySelector('.cell-input')) {
      return;
    }

    const initialValue = cell.innerText;
    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = initialValue;

    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      saveCell(cell, initialValue, input.value);
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveCell(cell, initialValue, input.value);
      }
    });
  }

  function saveCell(cell, initialValue, newValue) {
    if (newValue.trim() === '') {
      cell.innerText = initialValue;
    } else {
      cell.innerText = newValue;
    }
    cell.removeChild(cell.querySelector('.cell-input'));
  }
});
