'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const sortDirections = {};
  let lastSortedIndex = null;

  function parseValue(value, colIndex) {
    if (colIndex === 3) {
      return Number(value) || 0;
    }

    if (colIndex === 4) {
      return Number(value.replace(/[^0-9.]/g, '')) || 0;
    }

    return value.toLowerCase();
  }

  function sortTable(columnIndex, direction) {
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    rowsArray.sort((a, b) => {
      const cellA = parseValue(
        a.children[columnIndex].textContent.trim(),
        columnIndex,
      );
      const cellB = parseValue(
        b.children[columnIndex].textContent.trim(),
        columnIndex,
      );

      if (typeof cellA === 'number' && typeof cellB === 'number') {
        return direction === 'asc' ? cellA - cellB : cellB - cellA;
      }

      return direction === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });
    tbody.innerHTML = '';
    rowsArray.forEach((row) => tbody.appendChild(row));
  }

  table.querySelectorAll('th').forEach((th, index) => {
    sortDirections[index] = 'asc';

    th.addEventListener('click', () => {
      sortDirections[index] =
        lastSortedIndex !== index
          ? 'asc'
          : sortDirections[index] === 'asc'
            ? 'desc'
            : 'asc';
      sortTable(index, sortDirections[index]);
      lastSortedIndex = index;
    });

    th.addEventListener('dblclick', () => {
      sortDirections[index] = 'desc';
      sortTable(index, 'desc');
      lastSortedIndex = index;
    });
  });

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));
    tr.classList.add('active');
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="">Select office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;
  document.body.insertBefore(form, table);

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  document.body.insertBefore(notification, table);

  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = type;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const empName = form.name.value.trim();
    const lettersCount = (empName.match(/[A-Za-z]/g) || []).length;
    const position = form.position.value.trim();
    const office = form.office.value;
    const empAge = Number(form.age.value);
    const empSalary = Number(form.salary.value);

    if (lettersCount < 4) {
      return showNotification('Name must have at least 4 letters', 'error');
    }

    if (
      !position ||
      !office ||
      !Number.isFinite(empAge) ||
      !Number.isFinite(empSalary)
    ) {
      return showNotification(
        'All fields are required and must be valid',
        'error',
      );
    }

    if (empAge < 18 || empAge > 90) {
      return showNotification('Age must be between 18 and 90', 'error');
    }

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${empName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${empAge}</td>
      <td>$${empSalary.toLocaleString('en-US')}</td>
    `;
    tbody.appendChild(tr);
    form.reset();
    showNotification('Employee added successfully', 'success');
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    const existingInput = document.querySelector('.cell-input');

    if (existingInput) {
      existingInput.blur();

      return;
    }

    const originalText = cell.textContent.trim();
    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = originalText;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const value = input.value.trim();

      if (cell.cellIndex === 4) {
        const numVal = Number(value.replace(/[^0-9.]/g, ''));

        if (Number.isFinite(numVal)) {
          cell.textContent = `$${numVal.toLocaleString('en-US')}`;
        } else {
          cell.textContent = originalText;
        }
      } else {
        cell.textContent = value || originalText;
      }
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        input.blur();
      } else if (ev.key === 'Escape') {
        cell.textContent = originalText;
      }
    });
  });
});
