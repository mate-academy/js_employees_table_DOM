'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('tbody');
  const headers = document.querySelectorAll('th');
  const sortOrder = {}; // Об'єкт для збереження стану сортування
  let lastSortedIndex = null; // Індекс останнього відсортованого стовпця

  // Сортування таблиці
  headers.forEach((header, index) => {
    sortOrder[index] = true;

    header.addEventListener('click', () => {
      const rowsArray = Array.from(tbody.querySelectorAll('tr'));
      const isNumberColumn = index === 3 || index === 4;

      if (lastSortedIndex !== index) {
        sortOrder[index] = true;
      }

      const sortedRows = rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.cells[index].innerText;
        const cellB = rowB.cells[index].innerText;
        let sortResult;

        if (isNumberColumn) {
          const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
          const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

          sortResult = sortOrder[index] ? numA - numB : numB - numA;
        } else {
          sortResult = sortOrder[index]
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }

        return sortResult;
      });

      lastSortedIndex = index;
      sortOrder[index] = !sortOrder[index];

      tbody.innerHTML = '';

      sortedRows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Виділення рядка
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    row.onclick = function () {
      highlightTableRow(this);
    };
  });

  function highlightTableRow(row) {
    const previouslySelectedRow = document.querySelector('tr.active');

    if (previouslySelectedRow) {
      previouslySelectedRow.classList.remove('active');
    }
    row.classList.add('active');
  }

  // Додавання форми
  const formHTML = `
    <form class="new-employee-form">
      <label>Name:
        <input name="emp-name" type="text" data-qa="name" required></label><br>
      <label>Position:
        <input name="position" type="text" data-qa="position" required></label><br>
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
      </label><br>
      <label>Age:
        <input name="age" type="number" data-qa="age" required></label><br>
      <label>Salary:
        <input name="salary" type="number" data-qa="salary" required></label><br>
      <button type="submit">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', formHTML);

  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameForm = form.querySelector('[data-qa="name"]').value.trim();
    const position = form.querySelector('[data-qa="position"]').value.trim();
    const office = form.querySelector('[data-qa="office"]').value;
    const age = form.querySelector('[data-qa="age"]').value;
    let salary = form.querySelector('[data-qa="salary"]').value;

    if (!nameForm || !position || !office || !age || !salary) {
      alert('All fields are required!');

      return;
    }

    if (nameForm.length < 4) {
      showNotification('Name must contain at least 4 characters.', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    if (!salary || salary <= 0) {
      showNotification('Salary must be a positive number.', 'error');

      return;
    }

    salary = `$${parseFloat(salary).toLocaleString('en-US')}`;

    const newRow = `
      <tr>
        <td>${nameForm}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${salary}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', newRow);

    form.reset();
    showNotification('Employee added successfully!', 'success');
  });

  function showNotification(message, type) {
    const notification = document.createElement('div');

    notification.textContent = message;
    notification.className = type;
    notification.setAttribute('data-qa', 'notification');
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Редагування комірки
  let activeCell = null;

  document.querySelector('tbody').addEventListener('dblclick', (ev) => {
    const cell = ev.target;

    if (cell.tagName === 'TD' && cell !== activeCell) {
      if (activeCell) {
        saveCellContent(activeCell);
      }

      activeCell = cell;
      editCell(cell);
    }
  });

  function editCell(cell) {
    const originalText = cell.textContent.trim();
    const input = document.createElement('input');

    input.type = 'text';
    input.value = originalText;
    input.classList.add('cell-input');
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      saveCellContent(cell);
      activeCell = null;
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveCellContent(cell);
        activeCell = null;
      }
    });
  }

  function saveCellContent(cell) {
    const input = cell.querySelector('input');

    if (input) {
      const newValue = input.value.trim();
      const originalValue = input.defaultValue.trim();

      cell.textContent = newValue === '' ? originalValue : newValue;
      input.remove();
    }
  }
});
