'use strict';

// write code here
document.addEventListener('DOMContentLoaded', function () {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');

  const sortOrders = {}; // Track sorting order for each column

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const isNumeric = !isNaN(
        rows[0].cells[index].textContent.replace(/\$|,/g, ''),
      );

      if (!sortOrders[index]) {
        sortOrders[index] = 'asc';
      } else {
        sortOrders[index] = sortOrders[index] === 'asc' ? 'desc' : 'asc';
      }

      const multiplier = sortOrders[index] === 'asc' ? 1 : -1;

      rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[index].textContent.trim();
        const cellB = rowB.cells[index].textContent.trim();

        return isNumeric
          ? (parseFloat(cellA.replace(/\$|,/g, '')) -
              parseFloat(cellB.replace(/\$|,/g, ''))) *
              multiplier
          : cellA.localeCompare(cellB) * multiplier;
      });

      tbody.innerHTML = ''; // Update table
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // Row selection logic
  table.addEventListener('click', function (e) {
    const row = e.target.closest('tr');

    if (row) {
      table
        .querySelectorAll('tbody tr')
        .forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    }
  });

  // Inject the new employee form
  const formHTML = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name" required></label>
      <label>Position: <input name="position" type="text" data-qa="position" required></label>
      <label>Age: <input name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
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
      <button type="submit">Save to table</button>
    </form>
    <div data-qa="notification"></div>
  `;

  document.body.insertAdjacentHTML('beforeend', formHTML);

  const form = document.querySelector('.new-employee-form');
  const notification = document.querySelector('[data-qa="notification"]');

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value);
    const salary = `$${parseInt(form.salary.value).toLocaleString()}`;

    if (employeeName.length < 4) {
      showNotification('error', 'Name must be at least 4 characters long');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('error', 'Age must be between 18 and 90');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `<td>${employeeName}</td><td>${position}</td><td>${office}</td><td>${age}</td><td>${salary}</td>`;

    tbody.appendChild(newRow);

    showNotification('success', 'Employee added successfully');
    form.reset();
  });

  function showNotification(type, message) {
    notification.className = type;
    notification.textContent = message;
    setTimeout(() => (notification.textContent = ''), 3000);
  }

  // Handle cell editing on double-click
  table.addEventListener('dblclick', function (e) {
    const target = e.target;

    if (target.tagName === 'TD') {
      const initialValue = target.textContent;
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = initialValue;

      target.textContent = '';
      target.appendChild(input);
      input.focus();

      input.addEventListener('blur', () =>
        // eslint-disable-next-line
        saveCellValue(target, input, initialValue),
      );

      input.addEventListener('keypress', (b) => {
        if (b.key === 'Enter') {
          saveCellValue(target, input, initialValue);
        }
      });
    }
  });

  function saveCellValue(target, input, initialValue) {
    const newValue = input.value.trim();

    target.textContent = newValue || initialValue;
  }
});
