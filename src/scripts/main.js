'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);

  let sortDirection = 1;

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>
      Name:
      <input type="text" name="newName" data-qa="name" required>
    </label>
    <label>
      Position:
      <input type="text" name="newPosition" data-qa="position" required>
    </label>
    <label>
      Office:
      <select name="newOffice" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input type="number" name="newAge" data-qa="age" required>
    </label>
    <label>
      Salary:
      <input type="number" name="newSalary" data-qa="salary" required>
    </label>
    <button type="submit">Save to table</button>
  `;
  document.body.appendChild(form);

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rowsArray = Array.from(table.querySelectorAll('tbody tr'));

      rowsArray.sort((a, b) => {
        const cellA = a.children[index].innerText;
        const cellB = b.children[index].innerText;

        return (
          cellA.localeCompare(cellB, undefined, { numeric: true }) *
          sortDirection
        );
      });
      sortDirection *= -1;
      rowsArray.forEach((row) => table.querySelector('tbody').appendChild(row));
    });
  });

  const allRows = table.querySelectorAll('tbody tr');

  allRows.forEach((row) => {
    row.addEventListener('click', () => {
      table.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  function formatSalary(salary) {
    return '$' + Number(salary).toLocaleString();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const newName = form.querySelector("[name='newName']").value.trim();
    const newPosition = form.querySelector("[name='newPosition']").value.trim();
    const newOffice = form.querySelector("[name='newOffice']").value.trim();
    const newAge = form.querySelector("[name='newAge']").value.trim();
    const newSalary = form.querySelector("[name='newSalary']").value.trim();

    if (newName.length < 4) {
      showNotification('Name must have at least 4 characters', 'error');

      return;
    }

    if (newPosition.length < 1) {
      showNotification('Position is required', 'error');

      return;
    }

    if (newAge < 18 || newAge > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${newName}</td>
      <td>${newPosition}</td>
      <td>${newOffice}</td>
      <td>${newAge}</td>
      <td>${formatSalary(newSalary)}</td>
    `;
    table.querySelector('tbody').appendChild(row);
    form.reset();
    showNotification('Employee added successfully', 'success');

    row.addEventListener('click', () => {
      table.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  table.addEventListener('dblclick', (e) => {
    if (e.target.tagName === 'TD') {
      const cell = e.target;
      const input = document.createElement('input');

      input.value = cell.innerText;
      input.className = 'cell-input';
      cell.innerHTML = '';
      cell.appendChild(input);

      input.addEventListener('blur', () => {
        cell.innerText = input.value;
      });

      input.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') {
          cell.innerText = input.value;
        }
      });
    }
  });

  function showNotification(message, type) {
    notification.className = `notification ${type}`;
    notification.innerText = message;

    setTimeout(() => {
      notification.className = '';
      notification.innerText = '';
    }, 5000);
  }
});
