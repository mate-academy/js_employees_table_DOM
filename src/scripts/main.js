'use strict';

// 1. Implement table sorting by clicking on the title (in two directions).
const table = document.querySelector('table');
let tableData = null;
let sortDirection = true;

const columnParsers = {
  3: (cell) => parseInt(cell),
  4: (cell) => parseFloat(cell.slice(1).replaceAll(',', '')),
};

function defaultParser(cell) {
  return cell;
}

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

function parseCellData(cell, columnIndex) {
  const parser = columnParsers[columnIndex] || defaultParser;

  return parser(cell);
}

function sortTableData(columnIndex, direction) {
  return tableData.sort((rowA, rowB) => {
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

function sortTable(columnIndex) {
  const sortedData = sortTableData(columnIndex, sortDirection);

  renderSortedTable(sortedData);
  toggleSortDirection();
}

function attachSortingListeners() {
  table.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => sortTable(index));
  });
}

function initializeTable() {
  if (!tableData) {
    tableData = getTableData();
  }
  attachSortingListeners();
}

initializeTable();

// 2. When user clicks on a row, it should become selected.
let activeRowIndex = null;
const tbody = table.querySelector('tbody');

function updateActiveRow() {
  tbody.querySelectorAll('tr').forEach((row, index) => {
    if (index === activeRowIndex) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const rowIndex = [...tbody.querySelectorAll('tr')].indexOf(row);

  activeRowIndex = rowIndex;

  updateActiveRow();
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
function createNotification(message, type) {
  const notification = document.createElement('div');
  const titleSpan = document.createElement('span');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  titleSpan.className = 'title';
  titleSpan.textContent = type.toUpperCase();

  notification.appendChild(titleSpan);
  notification.innerHTML += ` <span>${message}</span>`;
  document.body.appendChild(notification);

  return notification;
}

function dismissNotification(notification, delay = 2000) {
  setTimeout(() => {
    notification.remove();
  }, delay);
}

function pushNotification(message, type) {
  const notification = createNotification(message, type);

  dismissNotification(notification);
}

function validateName(formName) {
  const nameRegex = /^[A-Za-z\s]+$/;

  return formName.length >= 4 && nameRegex.test(formName);
}

function validateAge(age) {
  return age >= 18 && age <= 90;
}

function validatePosition(position) {
  return position.trim() !== '';
}

function validateOffice(office) {
  return office.trim() !== '';
}

function validateSalary(salary) {
  const parsedSalary = parseFloat(salary);

  return !isNaN(parsedSalary) && parsedSalary > 0;
}

function handleValidationErrors(formData) {
  if (!validateName(formData.name)) {
    pushNotification(
      'Name must be at least 4 characters long and contain only letters.',
      'error',
    );
  }

  if (!validateAge(formData.age)) {
    pushNotification('Age must be between 18 and 90.', 'error');
  }

  if (!validatePosition(formData.position)) {
    pushNotification('Position is required.', 'error');
  }

  if (!validateOffice(formData.office)) {
    pushNotification('Office is required.', 'error');
  }

  if (!validateSalary(formData.salary)) {
    pushNotification('Salary must be a valid positive number.', 'error');
  }
}

function validateFormData(formData) {
  const isValid =
    validateName(formData.name) &&
    validateAge(formData.age) &&
    validatePosition(formData.position) &&
    validateOffice(formData.office) &&
    validateSalary(formData.salary);

  if (!isValid) {
    handleValidationErrors(formData);
  }

  return isValid;
}

const form = document.querySelector('.new-employee-form');

function getFormData(formData) {
  return [...formData.elements].reduce((acc, formInput) => {
    if (formInput.name) {
      acc[formInput.name] = formInput.value;
    }

    return acc;
  }, {});
}

function createTableRow(formData) {
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${formData.name}</td>
    <td>${formData.position}</td>
    <td>${formData.office}</td>
    <td>${formData.age}</td>
    <td>$${parseInt(formData.salary).toLocaleString('en-US')}</td>`;

  return newRow;
}

function appendRowToTable(row) {
  const tableBody = table.querySelector('tbody');

  tableBody.appendChild(row);
}

function handleFormSubmission() {
  const formData = getFormData(form);

  if (validateFormData(formData)) {
    const newRow = createTableRow(formData);

    appendRowToTable(newRow);
    pushNotification('Employee added successfully!', 'success');
    form.reset();
  }
}

document
  .getElementById('save-button')
  .addEventListener('click', handleFormSubmission);

// 5. Implement editing of table cells by double-clicking on it. (optional)
let editingCell = null;

function saveCellValue(cell, input) {
  cell.innerText = input.value || input.getAttribute('data-initial');
  editingCell = null;
}

function startCellEditing(cell) {
  const input = document.createElement('input');

  input.className = 'cell-input';

  const initialValue = cell.innerText;

  input.setAttribute('data-initial', initialValue);
  input.value = initialValue;

  cell.innerText = '';
  cell.appendChild(input);
  input.focus();

  editingCell = { cell, input };

  input.addEventListener('blur', () => saveCellValue(cell, input));

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveCellValue(cell, input);
    }
  });
}

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName.toLowerCase() === 'td' && editingCell === null) {
    startCellEditing(cell);
  }
});
