'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.new-employee-form');
  const notification = document.querySelector('[data-qa="notification"]');
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const sortDirections = Array(headers.length).fill(true);

  // Додавання обробників подій для сортування
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      sortTable(index, sortDirections[index]);
      sortDirections[index] = !sortDirections[index];
    });
  });

  // Функція сортування таблиці
  function sortTable(columnIndex, ascending) {
    const rows = Array.from(table.querySelectorAll('tr:nth-child(n+2)'));
    const comparator = (a, b) => {
      const aText = a.cells[columnIndex].textContent.trim();
      const bText = b.cells[columnIndex].textContent.trim();

      return ascending
        ? aText.localeCompare(bText, 'uk-UA')
        : bText.localeCompare(aText, 'uk-UA');
    };

    rows.sort(comparator);
    rows.forEach((row) => table.querySelector('tbody').appendChild(row));
  }

  table.addEventListener('click', (ev) => {
    const row = ev.target.closest('tr');

    if (row && row !== table.querySelector('.active')) {
      if (table.querySelector('.active')) {
        table.querySelector('.active').classList.remove('active');
      }
      row.classList.add('active');
    }
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(form);
    const employeeName = formData.get('name').trim();
    const position = formData.get('position').trim();
    const office = formData.get('office');
    const age = parseInt(formData.get('age'), 10);
    const salary = parseFloat(formData.get('salary'));

    if (employeeName.length < 4) {
      showNotification(
        'Error: Name must be at least 4 characters long.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Error: Age must be between 18 and 90.', 'error');

      return;
    }

    const newRow = table.querySelector('tbody').insertRow();

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salary.toFixed(2)}</td>
    `;

    form.reset();

    showNotification('Success: New employee added.', 'success');
  });

  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
  }

  // Редагування комірок таблиці при подвійному кліку
  table.addEventListener('dblclick', (ev) => {
    const cell = ev.target;

    if (cell.tagName === 'TD') {
      const originalValue = cell.textContent;
      const input = document.createElement('input');

      input.value = originalValue;
      input.classList.add('cell-input');
      cell.textContent = '';
      cell.appendChild(input);

      input.addEventListener('blur', () => {
        cell.textContent = input.value.trim() || originalValue;
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    }
  });
});
