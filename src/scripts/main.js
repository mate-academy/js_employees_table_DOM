'use strict';

const table = document.querySelector('table');
const tableHead = table ? table.querySelector('thead') : null;
const tableBody = table ? table.querySelector('tbody') : null;
const container = document.body;

let currentSortColumn = -1;
let sortDirection = 'asc';

const dataTypes = {
  0: 'string',
  1: 'string',
  2: 'string',
  3: 'number',
  4: 'currency',
};

/**
 * @param {string} type
 * @param {string} title
 * @param {string} description
 */
function showNotification(type, title, description) {
  const notificationContainer =
    document.querySelector('.notification-container') || container;

  let notification = document.querySelector('[data-qa="notification"]');

  if (!notification) {
    notification = document.createElement('div');
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('notification');
    notificationContainer.appendChild(notification);
  }

  notification.className = `notification ${type}`;

  notification.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;

  setTimeout(() => {
    notification.classList.remove('success', 'error');
    notification.innerHTML = '';
  }, 3000);
}

/**
 * Нормалізація значення для коректного порівняння.
 */
function normalizeValue(value, type) {
  if (type === 'number' || type === 'currency') {
    const cleaned = value.replace(/[^0-9.]/g, '');

    return parseFloat(cleaned) || 0;
  }

  return value.toLowerCase();
}

/**

 * @param {number} columnIndex
 * @param {string} direction
 */
function sortTable(columnIndex, direction) {
  if (!tableBody) {
    return;
  }

  const dataType = dataTypes[columnIndex];
  const rows = Array.from(tableBody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const cellA = rowA.children[columnIndex].textContent;
    const cellB = rowB.children[columnIndex].textContent;

    const valA = normalizeValue(cellA, dataType);
    const valB = normalizeValue(cellB, dataType);

    let comparison = 0;

    if (valA < valB) {
      comparison = -1;
    } else if (valA > valB) {
      comparison = 1;
    }

    return direction === 'asc' ? comparison : comparison * -1;
  });

  const fragment = document.createDocumentFragment();

  rows.forEach((row) => fragment.appendChild(row));
  tableBody.appendChild(fragment);
}

if (tableHead) {
  tableHead.addEventListener('click', (e) => {
    const header = e.target.closest('th');

    if (!header) {
      return;
    }

    const allHeaders = Array.from(tableHead.querySelectorAll('th'));
    const columnIndex = allHeaders.indexOf(header);

    let newDirection = 'asc';

    if (columnIndex === currentSortColumn) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    currentSortColumn = columnIndex;
    sortDirection = newDirection;

    sortTable(columnIndex, sortDirection);
  });
}

if (tableBody) {
  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    tableBody.querySelectorAll('tr').forEach((tr) => {
      tr.classList.remove('active');
    });

    row.classList.add('active');
  });
}

function createNewEmployeeForm() {
  const formHtml = `
        <form class="new-employee-form">
            <h2>New employee</h2>
            <label>Name: <input name="name" type="text" data-qa="name"></label>
            <label>Position: <input name="position" type="text" data-qa="position"></label>
            <label>Office:
                <select name="office" data-qa="office">
                    <option value="Tokyo">Tokyo</option>
                    <option value="Singapore">Singapore</option>
                    <option value="London">London</option>
                    <option value="New York">New York</option>
                    <option value="Edinburgh">Edinburgh</option>
                    <option value="San Francisco">San Francisco</option>
                </select>
            </label>
            <label>Age: <input name="age" type="number" data-qa="age"></label>
            <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
            <button type="submit">Save to table</button>
        </form>
    `;

  const formWrapper = document.createElement('div');

  formWrapper.innerHTML = formHtml;

  const form = formWrapper.firstElementChild;

  table.after(form);

  form.addEventListener('submit', handleFormSubmit);
}

/**

 */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (data.name.length < 4) {
    showNotification(
      'error',
      'Validation Error',
      'Name must have at least 4 letters.',
    );

    return;
  }

  const age = parseInt(data.age, 10);

  if (age < 18 || age > 90) {
    showNotification(
      'error',
      'Validation Error',
      'Age must be between 18 and 90.',
    );

    return;
  }

  for (const key in data) {
    if (!data[key].trim()) {
      showNotification(
        'error',
        'Validation Error',
        `The field "${key}" is required.`,
      );

      return;
    }
  }

  addNewEmployeeRow(data);
  showNotification('success', 'Success', `${data.name} successfully added.`);
  form.reset();
}

/**

 */
function addNewEmployeeRow(data) {
  if (!tableBody) {
    return;
  }

  const newRow = document.createElement('tr');

  const formattedSalary = `$${Number(data.salary).toLocaleString('en-US')}`;

  newRow.innerHTML = `
        <td>${data.name}</td>
        <td>${data.position}</td>
        <td>${data.office}</td>
        <td>${data.age}</td>
        <td>${formattedSalary}</td>
    `;

  tableBody.appendChild(newRow);
}

if (tableBody) {
  let currentEditCell = null;

  tableBody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || currentEditCell) {
      return;
    }

    currentEditCell = cell;

    const initialValue = cell.textContent.trim();

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    input.type = cell.cellIndex >= 3 ? 'number' : 'text';

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const saveChanges = () => {
      if (!currentEditCell) {
        return;
      }

      const newValue = input.value.trim();

      const finalValue = newValue === '' ? initialValue : newValue;

      currentEditCell.textContent = finalValue;
      currentEditCell = null;
    };

    input.addEventListener('blur', saveChanges, { once: true });

    input.addEventListener('keypress', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        keyEvent.preventDefault();
        saveChanges();
      }
    });
  });
}

createNewEmployeeForm();
