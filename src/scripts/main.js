'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('table tbody');
const headers = document.querySelectorAll('th');

let lastSortedColumnIndex = null;
let currentSortDirection = 'asc';

function sortByColumn(colIndex, direction) {
  const tRows = Array.from(tbody.querySelectorAll('tr'));

  tRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[colIndex].textContent.trim();
    const cellB = rowB.cells[colIndex].textContent.trim();

    if (direction === 'asc') {
      return cellA.localeCompare(cellB, undefined, { numeric: true });
    } else {
      return cellB.localeCompare(cellA, undefined, { numeric: true });
    }
  });

  tRows.forEach((row) => tbody.append(row));
}

headers.forEach((header, colIndex) => {
  header.addEventListener('click', () => {
    if (lastSortedColumnIndex === colIndex) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortDirection = 'asc';
    }

    lastSortedColumnIndex = colIndex;

    sortByColumn(colIndex, currentSortDirection);
  });
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (clickedRow) {
    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));

    clickedRow.classList.add('active');
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>
    Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
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
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit" data-qa="save-button">Save to table</button>
`;

document.body.appendChild(form);

form.addEventListener('submit', (_event) => {
  _event.preventDefault();

  const newName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = parseInt(form.age.value.trim(), 10);
  const salary = parseFloat(form.salary.value.trim());

  if (newName.length < 4) {
    notificationToShow('Name must have at least 4 letters.', 'error');

    return;
  }

  if (position.length === 0) {
    notificationToShow('Position must have at least one letter.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    notificationToShow('Age must be between 18 and 90.', 'error');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    notificationToShow('Salary must be a valid positive number.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${newName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US').replace(/,/g, ',')}</td>
  `;

  table.querySelector('tbody').appendChild(newRow);

  notificationToShow('Employee added successfully.', 'success');

  form.reset();
});

function notificationToShow(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

table.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.innerText;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      cell.innerText = input.value.trim() || initialValue;
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        cell.innerText = input.value.trim() || initialValue;
      }
    });
  });
});
