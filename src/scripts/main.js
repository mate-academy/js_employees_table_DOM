'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');
  let currentSortColumn = -1;
  let isAscending = true;
  let editingCell = null;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      if (currentSortColumn !== index) {
        isAscending = true;
      } else {
        isAscending = !isAscending;
      }

      currentSortColumn = index;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isNumeric = index === 3 || index === 4;

      rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[index].textContent.trim();
        const cellB = rowB.cells[index].textContent.trim();

        if (isNumeric) {
          const numA = parseFloat(cellA.replace(/[^\d.]/g, ''));
          const numB = parseFloat(cellB.replace(/[^\d.]/g, ''));

          return isAscending ? numA - numB : numB - numA;
        } else {
          return isAscending
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // eslint-disable-next-line no-shadow
  tbody.addEventListener('click', (event) => {
    if (event.target.tagName === 'TD') {
      const row = event.target.parentElement;

      tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    }
  });

  // Add new employee form
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" type="text" data-qa="office" required
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

  document.body.appendChild(form);

  const showNotification = (message, type) => {
    const notification = document.createElement('div');

    notification.className = type;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  // eslint-disable-next-line no-shadow
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newName = formData.get('name').trim();
    const position = formData.get('position').trim();
    const office = formData.get('office');
    const age = parseInt(formData.get('age'), 10);
    const salary = `$${parseFloat(formData.get('salary')).toLocaleString()}`;

    if (newName.length < 4) {
      showNotification('Name must have at least 4 characters.', 'error');

      return;
    }

    if (!position.length) {
      showNotification('Position must have at least 5 characters.', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    if (newName && position && office && age && salary) {
      const newRow = document.createElement('tr');

      newRow.innerHTML = `
        <td>${newName}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${salary}</td>
      `;

      tbody.appendChild(newRow);
      form.reset();
      showNotification('New employee added successfully!', 'success');
    }
  });

  // Editing table cells functionality
  // eslint-disable-next-line no-shadow
  table.addEventListener('dblclick', (event) => {
    const cell = event.target;

    if (cell.tagName === 'TD' && (!editingCell || editingCell === cell)) {
      if (editingCell) {
        editingCell.textContent =
          editingCell.querySelector('input').value || editingCell.textContent;
      }

      const initialValue = cell.textContent;
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = initialValue;

      cell.textContent = '';
      cell.appendChild(input);
      input.focus();
      editingCell = cell;

      const saveChanges = () => {
        const newValue = input.value.trim();

        cell.textContent = newValue || initialValue;
        editingCell = null;
      };

      input.addEventListener('blur', saveChanges);

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveChanges();
        }
      });
    }
  });
});
