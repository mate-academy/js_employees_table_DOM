'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table tbody');
  const form = document.querySelector('.new-employee-form');
  const notification = document.querySelector('.notification');
  let currentSortColumn = null;
  let sortDirection = 'asc';

  document.querySelectorAll('thead th').forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(table.querySelectorAll('tr')).slice();
      const isAsc = currentSortColumn === index && sortDirection === 'asc';

      rows.sort((a, b) => {
        const aText = a.children[index].textContent.trim();
        const bText = b.children[index].textContent.trim();

        return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
      });

      currentSortColumn = index;
      sortDirection = isAsc ? 'desc' : 'asc';
      rows.forEach((row) => table.appendChild(row));
    });
  });

  table.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD') {
      table
        .querySelectorAll('tr')
        .forEach((row) => row.classList.remove('active'));
      e.target.parentElement.classList.add('active');
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value).toFixed(3);

    if (nameVal.length < 4) {
      showNotification(
        'Error',
        'Name must be at least 4 letters long.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Error', 'Age must be between 18 and 90.', 'error');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
            <td>${nameVal}</td>
            <td>${position}</td>
            <td>${office}</td>
            <td>${age}</td>
            <td>$${salary.toLocaleString()}</td>
        `;
    table.appendChild(newRow);
    showNotification('Success', 'New employee added successfully!', 'success');

    form.reset();
  });

  table.addEventListener('dblclick', (e) => {
    if (e.target.tagName === 'TD') {
      const cell = e.target;
      const input = document.createElement('input');

      input.value = cell.textContent.trim();
      input.classList.add('cell-input');

      cell.innerHTML = '';
      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => saveEdit(cell, input));

      input.addEventListener('keypress', (evt) => {
        if (evt.key === 'Enter') {
          saveEdit(cell, input);
        }
      });
    }
  });

  function saveEdit(cell, input) {
    const newValue = input.value.trim();

    if (newValue) {
      cell.textContent = newValue;
    } else {
      cell.textContent = input.defaultValue;
    }
  }

  function showNotification(title, message, type) {
    notification.innerHTML = `<div class="${type} title">${title}</div><div>${message}</div>`;
    notification.classList.add(type);

    setTimeout(() => {
      notification.innerHTML = '';
      notification.classList.remove(type);
    }, 3000);
  }
});
