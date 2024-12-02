/* eslint-disable no-shadow */
'use strict';

// 1. Сортировка таблицы по клику на заголовок

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('thead th');
  const tbody = table.querySelector('tbody');

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isAscending = header.dataset.sortOrder !== 'asc';

      header.dataset.sortOrder = isAscending ? 'asc' : 'desc';

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[index].textContent.trim();
        const cellB = rowB.children[index].textContent.trim();

        if (index === 3 || index === 4) {
          const valueA = parseFloat(cellA.replace(/[$,]/g, '')) || 0;
          const valueB = parseFloat(cellB.replace(/[$,]/g, '')) || 0;

          return isAscending ? valueA - valueB : valueB - valueA;
        }

        return isAscending
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      });

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });
});

// 2. Выделение строки при клике

document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.active').forEach((activeRow) => {
        activeRow.classList.remove('active');
      });
      row.classList.add('active');
    });
  });
});

// 3. Добавление формы для новых сотрудников

const createForm = () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input type="text" name="name" data-qa="name"></label>
    <label>Position: <input type="text" name="position" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input type="number" name="age" data-qa="age"></label>
    <label>Salary: <input type="number" name="salary" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  `;

  document.body.appendChild(form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (!name || name.length < 4) {
      showNotification('Name must be at least 4 characters', 'error');

      return;
    }

    if (!position || position.length < 2) {
      showNotification('Position must be at least 2 characters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    addEmployeeToTable(name, position, office, age, salary);
    showNotification('Employee added successfully!', 'success');
    form.reset();
  });
};

const addEmployeeToTable = (name, position, office, age, salary) => {
  const table = document.querySelector('tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;
  table.appendChild(newRow);
};

const showNotification = (message, type) => {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.className = type === 'error' ? 'error' : 'success';
  notification.dataset.qa = 'notification';
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

createForm();

// 4. Редактирование ячеек (дополнительно)

document.addEventListener('DOMContentLoaded', () => {
  const cells = document.querySelectorAll('tbody td');

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = cell.textContent.trim();
      cell.textContent = '';
      cell.appendChild(input);

      input.focus();

      const saveChanges = () => {
        cell.textContent = input.value.trim() || cell.dataset.originalValue;
        input.remove();
      };

      input.addEventListener('blur', saveChanges);

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          saveChanges();
        }

        if (event.key === 'Escape') {
          input.value = cell.dataset.originalValue;
          saveChanges();
        }
      });
    });
  });
});
