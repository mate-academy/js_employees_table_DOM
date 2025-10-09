'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const sortDirections = {};
  let lastSortedIndex = null;

  function parseValue(value, colIndex) {
    if (colIndex === 3 || colIndex === 4) {
      const raw = colIndex === 4 ? value.replace(/[^0-9.]/g, '') : value;
      const num = Number(raw);

      return Number.isFinite(num) ? num : NaN;
    }

    return String(value).toLowerCase();
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
        const aNaN = Number.isNaN(cellA);
        const bNaN = Number.isNaN(cellB);

        if (aNaN && bNaN) {
          return 0;
        }

        if (aNaN) {
          return 1;
        }

        if (bNaN) {
          return -1;
        }

        return direction === 'asc' ? cellA - cellB : cellB - cellA;
      }

      return direction === 'asc'
        ? String(cellA).localeCompare(String(cellB))
        : String(cellB).localeCompare(String(cellA));
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
      showNotification('Name must have at least 4 letters', 'error');

      return;
    }

    if (
      !position ||
      !office ||
      !Number.isFinite(empAge) ||
      !Number.isFinite(empSalary)
    ) {
      showNotification('All fields are required and must be valid', 'error');

      return;
    }

    if (empAge < 18 || empAge > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${empName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${empAge}</td>
      <td>$${Number(empSalary).toLocaleString('en-US')}</td>
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
    }

    const originalText = cell.textContent.trim();
    const input = document.createElement('input');

    input.classList.add('cell-input');

    input.value =
      cell.cellIndex === 4
        ? Number(originalText.replace(/[^0-9.]/g, '')) || originalText
        : originalText;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    function cleanUpAndRestore(text) {
      if (cell.contains(input)) {
        input.remove();
      }
      cell.textContent = text;
    }

    input.addEventListener('blur', () => {
      const value = input.value.trim();

      if (cell.cellIndex === 4) {
        const numVal = Number(value.replace(/[^0-9.]/g, ''));

        cleanUpAndRestore(
          Number.isFinite(numVal)
            ? `$${numVal.toLocaleString('en-US')}`
            : originalText,
        );
      } else {
        cleanUpAndRestore(value || originalText);
      }
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        input.blur();
      }

      if (ev.key === 'Escape') {
        cleanUpAndRestore(originalText);
      }
    });
  });
});
