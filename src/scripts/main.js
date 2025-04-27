'use strict';

const tableHeaders = document.querySelectorAll('thead th');
const tableBody = document.querySelector('table');

tableHeaders.forEach((header, index) => {
  let isAscending = true;

  header.addEventListener('click', () => {
    const rows = Array.from(tableBody.rows);

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent.trim();
      const cellB = rowB.cells[index].textContent.trim();

      if (isAscending) {
        return cellA.localeCompare(cellB, undefined, { numeric: true });
      } else {
        return cellB.localeCompare(cellA, undefined, { numeric: true });
      }
    });

    rows.forEach((row) => tableBody.appendChild(row));
    isAscending = !isAscending;
  });
});

document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="employeeName" type="text" data-qa="name" required></label>
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
`;

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = parseInt(form.age.value, 10);
  const salary = parseFloat(form.salary.value);

  if (!employeeName || !position || !office || isNaN(age) || isNaN(salary)) {
    showNotification('error', 'All fields are required');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('error', 'Name must be at least 4 characters long');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Age must be between 18 and 90');

    return;
  }

  if (isNaN(salary)) {
    showNotification('error', 'Salary must be a valid number');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;
  document.querySelector('tbody').appendChild(row);
  showNotification('success', 'Employee added successfully');
});

function showNotification(type, message) {
  const notification = document.createElement('div');

  if (type === 'error') {
    notification.className = 'error';
  } else {
    notification.className = 'success';
  }

  notification.dataset.qa = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

document.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.textContent.trim();
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    cell.textContent = '';
    cell.appendChild(input);

    input.addEventListener('blur', () => {
      cell.textContent = input.value.trim() || initialValue;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });

    input.focus();
  });
});
