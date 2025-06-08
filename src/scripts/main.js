'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('.employees-table');
  const tbody = table.querySelector('tbody');
  const sortDirection = {};

  // Sorting logic
  table.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => {
      sortDirection[index] = sortDirection[index] === 'asc' ? 'desc' : 'asc';

      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const cellA = a.cells[index].textContent.trim();
        const cellB = b.cells[index].textContent.trim();

        return sortDirection[index] === 'asc'
          ? cellA.localeCompare(cellB, undefined, { numeric: true })
          : cellB.localeCompare(cellA, undefined, { numeric: true });
      });
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Row selection on click
  tbody.addEventListener('click', (e) => {
    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));

    const clickedRow = e.target.closest('tr');

    if (clickedRow) {
      clickedRow.classList.add('active');
    }
  });

  // Inline editing on double-click
  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (!cell.matches('td') || cell.querySelector('input')) {
      return;
    }

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = cell.textContent.trim();
    input.dataset.originalValue = input.value;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const save = () => {
      cell.textContent = input.value.trim() || input.dataset.originalValue;
    };

    input.addEventListener('blur', save);
    input.addEventListener('keypress', (ev) => ev.key === 'Enter' && save());
  });

  // Add employee form
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" required data-qa="name" /></label>
    <label>Position: <input name="position" required data-qa="position" /></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option><option>Singapore</option><option>London</option>
        <option>New York</option><option>Edinburgh</option><option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" required data-qa="age" /></label>
    <label>Salary: <input name="salary" type="number" required data-qa="salary" /></label>
    <button type="submit">Save to table</button>
  `;
  document.body.appendChild(form);

  form.addEventListener('submit', (currentevent) => {
    currentevent.preventDefault();

    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const employeeAge = parseInt(form.age.value, 10);
    const employeeSalary = parseFloat(form.salary.value);

    if (employeeName.length < 4) {
      return showNotification('error', 'Name must be at least 4 characters');
    }

    if (employeeAge < 18 || employeeAge > 90) {
      return showNotification('error', 'Age must be between 18 and 90');
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${employeeName}</td>
      <td>${position.value.trim()}</td>
      <td>${office.value}</td>
      <td>${employeeAge}</td>
      <td>${employeeSalary.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
    showNotification('success', 'Employee added successfully!');
    form.reset();
  });

  // Notification helper
  function showNotification(type, message) {
    const note = document.createElement('div');

    note.className = `notification ${type}`;
    note.dataset.qa = 'notification';
    note.textContent = message;
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
  }
});
