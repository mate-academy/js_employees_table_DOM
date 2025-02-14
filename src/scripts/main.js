'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const headers = document.querySelectorAll('th');
  const tbody = document.querySelector('tbody');
  let lastSortedColumn = null;
  let lastSortDirection = 'asc';

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (!rows.length) {
        return;
      }

      const isNumeric = rows.every(
        (row) => !isNaN(row.cells[index].textContent.replace(/[$,]/g, '')),
      );

      // Determine sort direction
      let sortDirection = 'asc';

      if (lastSortedColumn === index) {
        sortDirection = lastSortDirection === 'asc' ? 'desc' : 'asc';
      }

      // Sort rows
      rows.sort((rowA, rowB) => {
        let a = rowA.cells[index].textContent.trim();
        let b = rowB.cells[index].textContent.trim();

        if (isNumeric) {
          a = parseFloat(a.replace(/[$,]/g, ''));
          b = parseFloat(b.replace(/[$,]/g, ''));
        }

        return sortDirection === 'asc' ? (a > b ? 1 : -1) : a < b ? 1 : -1;
      });

      // Update last sorted column and direction
      lastSortedColumn = index;
      lastSortDirection = sortDirection;

      // Reinsert sorted rows into table
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Row selection functionality
  tbody.addEventListener('click', (ev) => {
    const selectedRow = ev.target.closest('tr');

    if (!selectedRow) {
      return;
    }

    const activeRow = tbody.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    selectedRow.classList.add('active');
  });

  // Form creation
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
    <label>Salary: <input name="salary" type="text" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  document.body.insertBefore(form, document.querySelector('table'));

  function showNotification(type, title, text) {
    const notification = document.createElement('div');

    notification.dataset.qa = 'notification';
    notification.classList.add('notification', type);
    notification.innerHTML = `<strong>${title}</strong><p>${text}</p>`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
    }, 5000);
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const nameInput = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value.trim(), 10);
    const salary = parseFloat(form.salary.value.trim());

    if (!nameInput || !position || !office || !age || !salary) {
      showNotification('error', 'Error', 'All fields are required.');

      return;
    }

    if (nameInput.length < 4) {
      showNotification(
        'error',
        'Error',
        'Name must be at least 4 characters long.',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('error', 'Error', 'Age must be between 18 and 90.');

      return;
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${nameInput}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString()}</td>
    `;

    tbody.appendChild(row);
    form.reset();
    showNotification('success', 'Success', 'New employee added to the table.');
  });

  // Inline editing of table cells
  tbody.addEventListener('dblclick', (ev) => {
    const cell = ev.target.closest('td');

    if (!cell) {
      return;
    }

    const currentValue = cell.textContent.trim();
    const inputCell = document.createElement('input');

    inputCell.classList.add('cell-input');
    inputCell.value = currentValue;
    cell.textContent = '';
    cell.appendChild(inputCell);
    inputCell.focus();

    inputCell.addEventListener('blur', () => {
      cell.textContent = inputCell.value.trim() || currentValue;
    });

    inputCell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        inputCell.blur();
      }
    });
  });
});
