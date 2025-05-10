'use strict';

// write code here
document.addEventListener('DOMContentLoaded', function () {
  const employeeTable = document.querySelector('table');
  let currentSort = { column: null, order: 'asc' };
  let selectedRow = null;

  const headers = document.querySelectorAll('th');

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const order =
        currentSort.column === index && currentSort.order === 'asc'
          ? 'desc'
          : 'asc';

      sortTable(employeeTable, index, order);
      currentSort = { column: index, order: order };
    });
  });

  function sortTable(table, columnIndex, order) {
    const rows = Array.from(table.tBodies[0].rows);
    const isNumeric = columnIndex === 3 || columnIndex === 4;

    rows.sort((rowA, rowB) => {
      let a = rowA.cells[columnIndex].innerText.trim();
      let b = rowB.cells[columnIndex].innerText.trim();

      if (isNumeric) {
        a = parseFloat(a.replace(/[^0-9.-]+/g, ''));
        b = parseFloat(b.replace(/[^0-9.-]+/g, ''));
      }

      if (order === 'asc') {
        return isNumeric ? a - b : a.localeCompare(b);
      } else {
        return isNumeric ? b - a : b.localeCompare(a);
      }
    });

    rows.forEach((row) => table.tBodies[0].appendChild(row));
  }

  employeeTable.addEventListener('click', function (e) {
    if (e.target.tagName === 'TD') {
      const row = e.target.parentNode;

      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      selectedRow = row;
      row.classList.add('active');
    }
  });

  const formHtml = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name"></label>
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
      <label>Age: <input name="age" type="number" data-qa="age"></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
      <button type="button" id="save-button">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  const form = document.querySelector('.new-employee-form');
  const saveButton = document.getElementById('save-button');

  saveButton.addEventListener('click', () => {
    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = form.age.value;
    const salary = form.salary.value;

    if (employeeName.length < 4) {
      showNotification(
        'Error',
        'Name must be at least 4 characters long',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Error', 'Age must be between 18 and 90', 'error');

      return;
    }

    if (!employeeName || !position || !office || !age || !salary) {
      showNotification('Error', 'All fields are required', 'error');

      return;
    }

    const formattedSalary = `$${Number(salary).toLocaleString('en-US')}`;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formattedSalary}</td>
    `;
    employeeTable.querySelector('tbody').appendChild(newRow);

    showNotification('Success', 'Employee added to the table', 'success');
    form.reset();
  });

  function showNotification(title, message, type) {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = `
      <span class="title">${title}</span>
      <p>${message}</p>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  employeeTable.addEventListener('dblclick', function (e) {
    const cell = e.target;

    if (cell.tagName === 'TD') {
      const initialText = cell.innerText;
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = initialText;
      cell.innerText = '';
      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        const newValue = input.value.trim();

        cell.innerText = newValue === '' ? initialText : newValue;
      });

      input.addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') {
          input.blur();
        }
      });
    }
  });
});
