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
const tbody = table.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
  activeRow = row;
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

function validateName(formName) {
  const nameRegex = /^[A-Za-z\s]+$/;

  if (formName.length < 4 || !nameRegex.test(formName)) {
    pushNotification(
      'Name must be at least 4 characters long and contain only letters.',
      'error',
    );

    return false;
  }

  return true;
}

function validateAge(age) {
  if (age < 18 || age > 90) {
    pushNotification('Age must be between 18 and 90.', 'error');

    return false;
  }

  return true;
}

function validatePosition(position) {
  if (!position.trim()) {
    pushNotification('Position is required.', 'error');

    return false;
  }

  return true;
}

function validateOffice(office) {
  if (!office.trim()) {
    pushNotification('Office is required.', 'error');

    return false;
  }

  return true;
}

function validateSalary(salary) {
  const parsedSalary = parseFloat(salary);

  if (isNaN(parsedSalary) || parsedSalary <= 0) {
    pushNotification('Salary must be a valid positive number.', 'error');

    return false;
  }

  return true;
}

function validateFormData(formData) {
  return (
    validateName(formData.name) &&
    validateAge(formData.age) &&
    validatePosition(formData.position) &&
    validateOffice(formData.office) &&
    validateSalary(formData.salary)
  );
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

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName.toLowerCase() === 'td') {
    const initialValue = cell.innerText;

    input.setAttribute('data-initial', initialValue);
    input.value = initialValue;

    cell.innerText = '';
    cell.appendChild(input);
    input.focus();
  }
});
