'use strict';

document.addEventListener('DOMContentLoaded', () => {
  setupSorting();
  setupRowSelection();
  insertEmployeeForm();
  setupFormHandler();
  setupCellEditing();
});

function setupSorting() {
  const headers = document.querySelectorAll('thead th');
  const tbody = document.querySelector('tbody');
  let sortDirection = {};

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isNumeric = index >= 3;

      const direction = sortDirection[index] === 'asc' ? 'desc' : 'asc';

      sortDirection = {};
      sortDirection[index] = direction;

      rows.sort((a, b) => {
        const aVal = a.children[index].textContent.trim();
        const bVal = b.children[index].textContent.trim();

        const aParsed = isNumeric
          ? parseFloat(aVal.replace(/[^0-9.]/g, ''))
          : aVal.toLowerCase();
        const bParsed = isNumeric
          ? parseFloat(bVal.replace(/[^0-9.]/g, ''))
          : bVal.toLowerCase();

        return direction === 'asc'
          ? aParsed < bParsed
            ? -1
            : aParsed > bParsed
              ? 1
              : 0
          : aParsed > bParsed
            ? -1
            : aParsed < bParsed
              ? 1
              : 0;
      });

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });
}

function setupRowSelection() {
  const tbody = document.querySelector('tbody');

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }
    tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
}

function insertEmployeeForm() {
  const formHTML = `
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
      <button type="submit">Save to table</button>
    </form>
  `;

  document.querySelector('table').insertAdjacentHTML('afterend', formHTML);
}

function setupFormHandler() {
  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameForm = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (!nameForm || !position || !office || isNaN(age) || isNaN(salary)) {
      return showNotification('error', 'All fields are required.');
    }

    if (nameForm.length < 4) {
      return showNotification('error', 'Name must be at least 4 characters.');
    }

    if (age < 18 || age > 90) {
      return showNotification('error', 'Age must be between 18 and 90.');
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${nameForm}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    `;
    document.querySelector('tbody').appendChild(row);
    showNotification('success', 'Employee added successfully.');
    form.reset();
  });
}

function showNotification(type, message) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const note = document.createElement('div');

  note.className = type;
  note.setAttribute('data-qa', 'notification');
  note.textContent = message;

  document.querySelector('table').insertAdjacentElement('beforebegin', note);
  setTimeout(() => note.remove(), 3000);
}

function setupCellEditing() {
  const tbody = document.querySelector('tbody');
  let editingCell = null;

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || editingCell === cell) {
      return;
    }

    if (editingCell) {
      restoreCell(editingCell);
    }

    const originalText = cell.textContent;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = originalText;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    editingCell = cell;

    input.addEventListener('blur', () => {
      saveCell(cell, input, originalText);
    });

    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        saveCell(cell, input, originalText);
      }
    });
  });

  function saveCell(cell, input, originalText) {
    const newValue = input.value.trim();

    cell.textContent = newValue || originalText;
    editingCell = null;
  }

  function restoreCell(cell) {
    const input = cell.querySelector('input');

    if (input) {
      cell.textContent = input.value || input.defaultValue;
    }
    editingCell = null;
  }
}
