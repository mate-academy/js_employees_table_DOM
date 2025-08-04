'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  let sortDirection = {};

  // Table Sorting
  table.querySelectorAll('th').forEach((th, index) => {
    th.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const key = th.textContent.trim();
      const direction = sortDirection[key] === 'asc' ? 'desc' : 'asc';

      sortDirection = { [key]: direction };

      rows.sort((a, b) => {
        const aText = a.children[index].textContent.trim();
        const bText = b.children[index].textContent.trim();

        const isSalaryColumn =
          table
            .querySelectorAll('th')
            [index].textContent.trim()
            .toLowerCase() === 'salary';

        const aValue = isSalaryColumn
          ? parseFloat(aText.replace(/[$, ]/g, ''))
          : aText;
        const bValue = isSalaryColumn
          ? parseFloat(bText.replace(/[$, ]/g, ''))
          : bText;

        const isNumeric = !isNaN(aValue) && !isNaN(bValue);

        return direction === 'asc'
          ? isNumeric
            ? aValue - bValue
            : aValue.localeCompare(bValue)
          : isNumeric
            ? bValue - aValue
            : bValue.localeCompare(aValue);
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Row Selection
  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });

  // Add Form
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
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
  `;
  document.body.appendChild(form);

  // Notification
  function showNotification(message, type = 'error') {
    const notification = document.createElement('div');

    notification.className = type;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Add to Table
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const personName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value);
    const salary = parseFloat(form.salary.value);

    if (
      !personName ||
      !position ||
      !office ||
      !form.age.value ||
      !form.salary.value
    ) {
      showNotification('All fields are required.', 'error');

      return;
    }

    if (personName.length < 4) {
      showNotification('Name must be at least 4 characters.', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${personName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    `;
    tbody.appendChild(newRow);
    form.reset();
    showNotification('Employee added successfully!', 'success');
  });

  // Cell Editing
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

    function save() {
      const newValue = input.value.trim();

      cell.textContent = newValue || originalText;
      editingCell = null;
    }

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        save();
      }
    });
  });

  function restoreCell(cell) {
    const input = cell.querySelector('input');

    if (input) {
      cell.textContent = input.value || input.defaultValue;
    }
    editingCell = null;
  }
});
