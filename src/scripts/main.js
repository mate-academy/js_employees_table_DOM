'use strict';

// 1. Implement table sorting by clicking on the title (in two directions).
const table = document.querySelector('table');

function getTableRows() {
  return [...table.querySelectorAll('tbody tr')];
}

function mapTableData(rows) {
  return rows.map((row) => {
    return [...row.children].map((cell) => cell.innerText);
  });
}

function getTableData() {
  const rows = getTableRows();

  return mapTableData(rows);
}

let sortDirection = true;

function sortTable(columnIndex) {
  const sortedData = sortTableData(columnIndex, sortDirection);

  renderSortedTable(sortedData);
  toggleSortDirection();
}

function sortTableData(columnIndex, direction) {
  const data = getTableData();

  return data.sort((rowA, rowB) => {
    let cellA = rowA[columnIndex];
    let cellB = rowB[columnIndex];

    cellA = parseCellData(cellA, columnIndex);
    cellB = parseCellData(cellB, columnIndex);

    if (direction) {
      return cellA > cellB ? 1 : -1;
    }

    return cellA > cellB ? -1 : 1;
  });
}

function parseCellData(cell, columnIndex) {
  if (columnIndex === 3) {
    return parseInt(cell);
  }

  if (columnIndex === 4) {
    return parseFloat(cell.slice(1).replace(/,/g, ''));
  }

  return cell;
}

function renderSortedTable(sortedData) {
  const tableBody = table.querySelector('tbody');

  tableBody.innerHTML = '';

  sortedData.forEach((rowData) => {
    const row = document.createElement('tr');

    rowData.forEach((cellData) => {
      const cell = document.createElement('td');

      cell.textContent = cellData;
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

function toggleSortDirection() {
  sortDirection = !sortDirection;
}

function attachSortingListeners() {
  table.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
  });
}

attachSortingListeners();

// 2. When user clicks on a row, it should become selected.
let activeRow = null;

table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    if (activeRow) {
      activeRow.classList.remove('active');
    }

    row.classList.add('active');
    activeRow = row;
  });
});

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
const formHtml = `
  <form class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      />
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
      />
    </label>
    <label>
      Office:
      <select
        name="office"
        data-qa="office"
      >
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
      <input
        name="age"
        type="number"
        data-qa="age"
      />
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      />
    </label>
    <button
      type="button"
      id="save-button"
    >
      Save to table
    </button>
  </form>
  `;

table.insertAdjacentHTML('afterend', formHtml);

// 4. Show notification if form data is invalid
function pushNotification(message, type) {
  const notification = document.createElement('div');
  const titleSpan = document.createElement('span');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  titleSpan.className = 'title';
  titleSpan.textContent = type.toUpperCase();

  notification.appendChild(titleSpan);
  notification.innerHTML += ` <span>${message}</span>`;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function validateFormData(formData) {
  const nameRegex = /^[A-Za-z\s]+$/;

  if (formData.name.length < 4 || !nameRegex.test(formData.name)) {
    pushNotification(
      'Name must be at least 4 characters long and contain only letters.',
      'error',
    );

    return false;
  }

  if (formData.age < 18 || formData.age > 90) {
    pushNotification('Age must be between 18 and 90.', 'error');

    return false;
  }

  if (!formData.position.trim()) {
    pushNotification('Position is required.', 'error');

    return false;
  }

  if (!formData.office.trim()) {
    pushNotification('Office is required.', 'error');

    return false;
  }

  const salary = parseFloat(formData.salary);

  if (isNaN(salary) || salary <= 0) {
    pushNotification('Salary must be a valid positive number.', 'error');

    return false;
  }

  return true;
}

const form = document.querySelector('.new-employee-form');

document.getElementById('save-button').addEventListener('click', () => {
  const formData = [...form.elements].reduce((acc, formInput) => {
    if (formInput.name) {
      acc[formInput.name] = formInput.value;
    }

    return acc;
  }, {});

  if (validateFormData(formData)) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${formData.name}</td>
      <td>${formData.position}</td>
      <td>${formData.office}</td>
      <td>${formData.age}</td>
      <td>$${parseInt(formData.salary).toLocaleString('en-US')}</td>`;

    table.querySelector('tbody').appendChild(newRow);
    pushNotification('Employee added successfully!', 'success');
    form.reset();
  }
});

// 5. Implement editing of table cells by double-clicking on it. (optional)
const input = document.createElement('input');

input.className = 'cell-input';

input.addEventListener('blur', () => {
  const cell = input.parentElement;

  cell.innerText = input.value || input.getAttribute('data-initial');
});

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const cell = input.parentElement;

    cell.innerText = input.value || input.getAttribute('data-initial');
  }
});

document.querySelectorAll('tbody td').forEach((cell) => {
  cell.addEventListener('dblclick', () => {
    const initialValue = cell.innerText;

    input.setAttribute('data-initial', initialValue);
    input.value = initialValue;

    cell.innerText = '';
    cell.appendChild(input);
    input.focus();
  });
});
