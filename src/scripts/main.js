/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Sorting logic
  const sortingDirection = {}; // Track the sort direction for each column

  const tableHeaders = document.querySelectorAll('#employee-table th');

  tableHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const column = header.getAttribute('data-column');
      const rows = Array.from(
        document.querySelectorAll('#employee-table tbody tr'),
      );
      const isAscending = sortingDirection[column] !== 'asc';

      sortingDirection[column] = isAscending ? 'asc' : 'desc';

      rows.sort((rowA, rowB) => {
        const cellA = rowA.querySelector(
          `td:nth-child(${header.cellIndex + 1})`,
        ).innerText;
        const cellB = rowB.querySelector(
          `td:nth-child(${header.cellIndex + 1})`,
        ).innerText;

        const valueA = isNaN(cellA) ? cellA : parseFloat(cellA);
        const valueB = isNaN(cellB) ? cellB : parseFloat(cellB);

        if (valueA < valueB) {
          return isAscending ? -1 : 1;
        }

        if (valueA > valueB) {
          return isAscending ? 1 : -1;
        }

        return 0;
      });

      const tbody = document.querySelector('#employee-table tbody');

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Row selection logic
  const rows = document.querySelectorAll('#employee-table tbody tr');

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  // Form submission and validation
  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = formData.get('name');
    const position = formData.get('position');
    const office = formData.get('office');
    const age = parseInt(formData.get('age'), 10);
    const salary = parseFloat(formData.get('salary'));

    let errorMessage = '';

    if (name.length < 4) {
      errorMessage = 'Name must be at least 4 characters long.';
    } else if (age < 18 || age > 90) {
      errorMessage = 'Age must be between 18 and 90.';
    } else if (isNaN(salary) || salary <= 0) {
      errorMessage = 'Salary must be a positive number.';
    }

    const notification = document.querySelector('#notification');
    const notificationTitle = document.querySelector('#notification-title');
    const notificationMessage = document.querySelector('#notification-message');

    if (errorMessage) {
      notification.classList.remove('hidden');
      notification.classList.add('error');
      notificationTitle.textContent = 'Error';
      notificationMessage.textContent = errorMessage;
    } else {
      // Add new row to the table
      const newRow = document.createElement('tr');

      newRow.innerHTML = `
              <td>${name}</td>
              <td>${position}</td>
              <td>${office}</td>
              <td>${age}</td>
              <td>${salary}</td>
          `;
      document.querySelector('#employee-table tbody').appendChild(newRow);

      notification.classList.remove('hidden');
      notification.classList.add('success');
      notificationTitle.textContent = 'Success';
      notificationMessage.textContent = 'Employee added successfully!';

      form.reset(); // Reset the form
    }
  });

  // Cell editing logic (optional)
  let editingCell = null;

  const cells = document.querySelectorAll('#employee-table td');

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      if (editingCell) {
        return;
      }

      const originalText = cell.innerText;
      const input = document.createElement('input');

      input.value = originalText;
      input.classList.add('cell-input');

      cell.innerHTML = '';
      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        saveCellChanges(cell, input.value, originalText);
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveCellChanges(cell, input.value, originalText);
        }
      });

      editingCell = cell;
    });
  });

  function saveCellChanges(cell, newValue, originalValue) {
    if (newValue.trim() === '') {
      newValue = originalValue;
    }
    cell.innerText = newValue;
    editingCell = null;
  }
});
