'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('thead th');
  let sortDirection = 1;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      const rowsArray = Array.from(tbody.querySelectorAll('tr'));
      const dataType = header.dataset.type;

      rowsArray.sort((rowA, rowB) => {
        const cellA = rowA.children[index].textContent.trim();
        const cellB = rowB.children[index].textContent.trim();

        if (dataType === 'number') {
          return sortDirection * (parseFloat(cellA) - parseFloat(cellB));
        } else {
          return sortDirection * cellA.localeCompare(cellB);
        }
      });

      rowsArray.forEach((row) => tbody.appendChild(row));
      sortDirection *= -1;
    });
  });

  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      document.querySelectorAll('tbody tr.active').forEach((activeRow) => {
        activeRow.classList.remove('active');
      });
      row.classList.add('active');
    });
  });

  const formHtml = `
    <form class="new-employee-form">
      <label>Name: <input name="employeeName" type="text" data-qa="name"></label>
      <label>Position: <input name="position" type="text" data-qa="position"></label>
      <label>Office: <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select></label>
      <label>Age: <input name="age" type="number" data-qa="age"></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
      <button type="submit">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeName = form.employeeName.value.trim();
    const positionInput = form.position.value.trim();
    const officeSelect = form.office.value;
    const ageInput = parseInt(form.age.value.trim(), 10);
    const salaryInput = parseFloat(form.salary.value.trim());

    if (employeeName.length < 4) {
      showNotification('Name should be at least 4 characters long', 'error');

      return;
    }

    if (ageInput < 18 || ageInput > 90) {
      showNotification('Age should be between 18 and 90', 'error');

      return;
    }

    if (isNaN(salaryInput) || salaryInput <= 0) {
      showNotification('Salary should be a positive number', 'error');

      return;
    }

    const tbody = document.querySelector('table tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${positionInput}</td>
      <td>${officeSelect}</td>
      <td>${ageInput}</td>
      <td>$${salaryInput.toFixed(2)}</td>
    `;
    tbody.appendChild(newRow);

    showNotification('Employee added successfully', 'success');
  });

  document.querySelectorAll('tbody td').forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = cell.textContent.trim();
      cell.textContent = '';
      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        if (input.value.trim() === '') {
          input.value = cell.dataset.original;
        }
        cell.textContent = input.value;
      });

      input.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') {
          input.blur();
        }
      });
    });
  });
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<span class="title">${type === 'error' ? 'Error' : 'Success'}</span><p>${message}</p>`;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}
