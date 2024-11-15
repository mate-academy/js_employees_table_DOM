'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead tr');
let sortOrder = 'asc';
let lastSortedColumnIndex = -1;

thead.addEventListener('click', (e) => {
  const clickedTh = e.target.closest('th');

  const columnIndex = clickedTh.cellIndex;
  const rows = Array.from(tbody.querySelectorAll('tr'));

  if (columnIndex !== lastSortedColumnIndex) {
    sortOrder = 'asc';
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[columnIndex].textContent.trim();
    const cellB = rowB.querySelectorAll('td')[columnIndex].textContent.trim();

    const cellAHasDigits = hasDigits(cellA);
    const cellBHasDigits = hasDigits(cellB);

    let comparison = 0;

    if (cellAHasDigits && cellBHasDigits) {
      comparison = convert(cellA) - convert(cellB);
    }

    if (!cellAHasDigits && !cellBHasDigits) {
      comparison = cellA.localeCompare(cellB);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  lastSortedColumnIndex = columnIndex;

  tbody.innerHTML = '';

  sortedRows.forEach((row) => {
    tbody.appendChild(row);
  });
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (clickedRow) {
    tbody.querySelectorAll('tr').forEach((row) => {
      row.classList.remove('active');
    });

    clickedRow.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  document.body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const eeName = form.elements['name'].value.trim();
    const position = form.elements['position'].value.trim();
    const office = form.elements['office'].value;
    const age = form.elements['age'].value;
    const salary = `$${Number(form.elements['salary'].value).toLocaleString('en-US')}`;
    const notification = document.createElement('div');

    notification.setAttribute('data-qa', 'notification');

    let valid = true;
    let errorMessage = '';

    if (eeName.length < 4) {
      valid = false;
      errorMessage += 'Name must be at least 4 characters long. ';
    }

    if (age < 18 || age > 90) {
      valid = false;
      errorMessage += 'Age must be between 18 and 90. ';
    }

    if (position.length < 4) {
      valid = false;
      errorMessage += 'Position must be at least 4 characters long. ';
    }

    if (!valid) {
      showNotification(errorMessage, true);
      form.reset();

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td>${eeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary}</td>
    `;

    tbody.append(newRow);
    form.reset();
    showNotification('Employee successfully added to the table!');
  });
});

tbody.addEventListener('dblclick', (e) => {
  const clickedCell = e.target.closest('td');

  if (!clickedCell) {
    return;
  }

  if (tbody.querySelector('.cell-input')) {
    tbody.querySelector('.cell-input').blur();
  }

  const initialValue = clickedCell.textContent.trim();

  clickedCell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  input.style.width = `${clickedCell.clientWidth - 40}px`;
  input.style.boxSizing = 'border-box';
  input.value = initialValue;
  clickedCell.appendChild(input);
  input.focus();

  const saveChanges = () => {
    const newValue = input.value.trim() || initialValue;

    clickedCell.textContent = newValue;
  };

  input.addEventListener('blur', () => {
    saveChanges();
    input.remove();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      saveChanges();
      input.remove();
    }
  });
});

function convert(value) {
  return Number(value.replace(/[$,]/g, ''));
}

function hasDigits(str) {
  return /\d+/.test(str);
}

function showNotification(message, isError = false) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = isError ? 'error' : 'success';
  notification.classList.add('notification');

  const title = document.createElement('h2');
  const description = document.createElement('p');

  title.classList.add('title');
  title.textContent = isError ? 'Error' : 'Success';
  description.textContent = message;
  notification.append(title, description);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}
