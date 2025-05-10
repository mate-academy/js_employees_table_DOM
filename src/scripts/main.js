'use strict';

const tableHeaders = document.querySelectorAll('th');
const tableBody = document.querySelector('table tbody');
const table = document.querySelector('table');

let lastSortedColumnIndex = null;
let sortDirection = 'asc';

function sortTableByColumn(columnIndex, direction) {
  const tableRows = Array.from(tableBody.querySelectorAll('tr'));

  tableRows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    if (direction === 'asc') {
      return cellA.localeCompare(cellB, undefined, { numeric: true });
    } else {
      return cellB.localeCompare(cellA, undefined, { numeric: true });
    }
  });

  tableRows.forEach((row) => tableBody.append(row));
}

tableHeaders.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    if (lastSortedColumnIndex === columnIndex) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortDirection = 'asc';
    }

    lastSortedColumnIndex = columnIndex;

    sortTableByColumn(columnIndex, sortDirection);
  });
});

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (clickedRow) {
    tableBody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));

    clickedRow.classList.add('active');
  }
});

const formElement = document.createElement('form');

formElement.className = 'new-employee-form';

formElement.innerHTML = `
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

document.body.appendChild(formElement);

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const newName = formElement.name.value.trim();
  const position = formElement.position.value.trim();
  const office = formElement.office.value;
  const age = parseInt(formElement.age.value.trim(), 10);
  const salary = parseFloat(formElement.salary.value.trim());

  if (newName.length < 4) {
    showNotification('Name must have at least 4 letters.', 'error');

    return;
  }

  if (position.length === 0) {
    showNotification('Position must have at least one letter.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    showNotification('Salary must be a valid positive number.', 'error');

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

  showNotification('Employee added successfully.', 'success');

  formElement.reset();
});

function showNotification(message, type) {
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
