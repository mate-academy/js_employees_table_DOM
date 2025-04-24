'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');
  let sortDirection = 1;
  let activeColumnIndex = null;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isNumberColumn = index >= 3;
      const keyExtractor = (row) => {
        const cellValue = row.children[index].innerText;

        return isNumberColumn
          ? parseFloat(cellValue.replace(/[$,]/g, ''))
          : cellValue;
      };

      if (activeColumnIndex !== index) {
        sortDirection = 1;
        activeColumnIndex = index;
      } else {
        sortDirection *= -1;
      }

      rows.sort((a, b) => {
        const keyA = keyExtractor(a);
        const keyB = keyExtractor(b);

        return keyA > keyB ? sortDirection : keyA < keyB ? -sortDirection : 0;
      });

      tbody.append(...rows);
    });
  });

  tbody.addEventListener('click', (clickEvent) => {
    const row = clickEvent.target.closest('tr');

    if (row) {
      tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    }
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Ім'я: <input name="name" type="text" data-qa="name"></label>
    <label>Посада: <input name="position" type="text" data-qa="position"></label>
    <label>Офіс:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Вік: <input name="age" type="number" data-qa="age"></label>
    <label>Зарплата: <input name="salary" type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  `;
  document.body.append(form);

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();

    const data = new FormData(form);
    const employeeName = data.get('name');
    const position = data.get('position');
    const office = data.get('office');
    const age = Number(data.get('age'));
    const salary = Number(data.get('salary'));

    const notification = document.createElement('div');

    notification.classList.add('notification');
    notification.setAttribute('data-qa', 'notification');
    document.body.append(notification);

    if (employeeName.length < 4) {
      notification.classList.add('error');
      notification.innerText = "Помилка: Ім'я має бути довшим за 4 символи.";
      setTimeout(() => notification.remove(), 3000);

      return;
    }

    if (position.length < 3) {
      notification.classList.add('error');
      notification.innerText = 'Помилка: Посада має бути довшою за 3 символи.';
      setTimeout(() => notification.remove(), 3000);

      return;
    }

    if (age < 18 || age > 90) {
      notification.classList.add('error');
      notification.innerText = 'Помилка: Вік має бути від 18 до 90 років.';
      setTimeout(() => notification.remove(), 3000);

      return;
    }

    notification.classList.add('success');
    notification.innerText = 'Співробітника успішно додано!';
    setTimeout(() => notification.remove(), 3000);

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${employeeName}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>$${salary.toLocaleString()}</td>
      `;
    tbody.appendChild(newRow);
    form.reset();
  });

  tbody.addEventListener('dblclick', (dblclickEvent) => {
    const cell = dblclickEvent.target;

    if (cell.tagName !== 'TD' || cell.querySelector('input')) {
      return;
    }

    const initialText = cell.innerText;
    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = initialText;
    cell.innerText = '';
    cell.append(input);
    input.focus();

    const saveCell = () => {
      const newValue = input.value.trim() || initialText;

      cell.innerText = newValue;
    };

    input.addEventListener('blur', saveCell);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveCell();
      }
    });
  });
});
