'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');
  let selectedRow = null;
  let editingCell = null;
  let notification = document.querySelector('[data-qa="notification"]');

  if (!notification) {
    notification = document.createElement('div');
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('notification');
    document.body.appendChild(notification);
  }

  const formWrapper = document.createElement('div');

  formWrapper.innerHTML = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name" required></label>
      <label>Position: <input name="position" type="text" data-qa="position" required></label>
      <label>Office:
        <select name="office" data-qa="office" required>
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>
      <label>Age: <input name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
      <button type="submit">Save to table</button>
    </form>
  `;
  document.body.insertBefore(formWrapper, table);

  const currentSort = { index: -1, asc: true };

  headers.forEach((header, columnIndex) => {
    header.addEventListener('click', () => {
      if (currentSort.index === columnIndex) {
        currentSort.asc = !currentSort.asc;
      } else {
        currentSort.index = columnIndex;
        currentSort.asc = true;
      }

      const rowsArray = Array.from(tbody.querySelectorAll('tr'));

      rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        const numA = parseFloat(cellA.replace(/[^0-9.]/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.]/g, ''));

        let result;

        if (!isNaN(numA) && !isNaN(numB)) {
          result = numA - numB;
        } else {
          result = cellA.localeCompare(cellB);
        }

        return currentSort.asc ? result : -result;
      });

      rowsArray.forEach((row) => tbody.appendChild(row));
    });
  });

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    if (selectedRow) {
      selectedRow.classList.remove('active');
    }
    selectedRow = tr;
    tr.classList.add('active');
  });

  function showNotification(type, message) {
    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;

    setTimeout(() => {
      notification.textContent = '';
      notification.className = 'notification';
    }, 3000);
  }

  document
    .querySelector('.new-employee-form')
    .addEventListener('submit', (e) => {
      e.preventDefault();

      const form = e.target;
      const employeeName = form.name.value.trim();
      const position = form.position.value.trim();
      const office = form.office.value;
      const age = parseInt(form.age.value);
      const salary = parseFloat(form.salary.value);

      if (
        !employeeName ||
        !position ||
        !office ||
        isNaN(age) ||
        isNaN(salary)
      ) {
        showNotification('error', 'All fields are required.');

        return;
      }

      if (employeeName.length < 4) {
        showNotification('error', 'Name must be at least 4 characters.');

        return;
      }

      if (age < 18 || age > 90) {
        showNotification('error', 'Age must be between 18 and 90.');

        return;
      }

      if (salary <= 0) {
        showNotification('error', 'Salary must be positive.');

        return;
      }

      const row = document.createElement('tr');

      row.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString()}</td>
      `;
      tbody.appendChild(row);
      form.reset();
      showNotification('success', 'Employee successfully added.');
    });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    if (editingCell) {
      return;
    }

    editingCell = cell;

    const originalText = cell.textContent;

    cell.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = originalText;

    cell.appendChild(input);
    input.focus();

    function save() {
      const newValue = input.value.trim();

      if (newValue === '') {
        cell.textContent = originalText;
      } else {
        if (cell.cellIndex === 4) {
          const num = parseFloat(newValue.replace(/[^0-9.]/g, ''));

          if (!isNaN(num)) {
            cell.textContent = `$${num.toLocaleString()}`;
          } else {
            cell.textContent = originalText;
          }
        } else {
          cell.textContent = newValue;
        }
      }
      editingCell = null;
      cleanup();
    }

    function onKeyDown(ev) {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        save();
      } else if (ev.key === 'Escape') {
        cell.textContent = originalText;
        editingCell = null;
        cleanup();
      }
    }

    function cleanup() {
      input.removeEventListener('keydown', onKeyDown);
      input.removeEventListener('blur', save);
    }

    input.addEventListener('keydown', onKeyDown);
    input.addEventListener('blur', save);
  });
});
