'use strict';

// write code here
const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;
const NOTIFICATION_LIFETIME = 3000;

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

let sortedColumnIndex = null;
let sortDirection = 'asc';

function getCellValue(row, columnIndex) {
  const text = row.children[columnIndex].textContent.trim();
  const numericText = text.replace(/[^0-9.]/g, '');

  if (numericText !== '' && !Number.isNaN(Number(numericText))) {
    return Number(numericText);
  }

  return text;
}

function sortTableByColumn(columnIndex, direction) {
  const rows = [...tbody.querySelectorAll('tr')];
  const factor = direction === 'asc' ? 1 : -1;

  rows.sort((rowA, rowB) => {
    const valueA = getCellValue(rowA, columnIndex);
    const valueB = getCellValue(rowB, columnIndex);

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return (valueA - valueB) * factor;
    }

    return String(valueA).localeCompare(String(valueB)) * factor;
  });

  tbody.append(...rows);
}

headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    if (sortedColumnIndex === columnIndex) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortedColumnIndex = columnIndex;
      sortDirection = 'asc';
    }

    sortTableByColumn(columnIndex, sortDirection);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const previouslyActive = tbody.querySelector('tr.active');

  if (previouslyActive) {
    previouslyActive.classList.remove('active');
  }

  row.classList.add('active');
});

function pushNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const titleElement = document.createElement('h3');

  titleElement.className = 'title';
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;

  notification.append(titleElement, descriptionElement);
  document.body.append(notification);

  setTimeout(() => notification.remove(), NOTIFICATION_LIFETIME);
}

const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'Edinburgh',
  'New York',
  'San Francisco',
];

function createEmployeeForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.insertAdjacentHTML(
    'beforeend',
    `
    <label>Name: <input name ="name" type="text" data-qa="name"></label>
    <label>Position: <input name="position" type="text" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
        ${OFFICES.map((office) => `<option value="${office}">${office}</option>`).join('')}
        </select>
        </label>
        <label>Age: <input name="age" type="number" data-qa="age"></label>
        <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
        <button type="submit">Save to table</button>
    `,
  );

  document.body.append(form);

  return form;
}

function formatSalary(amount) {
  return `$${Number(amount).toLocaleString('en-US')}`;
}

function validateEmployee({ employeeName, age }) {
  if (employeeName.trim().length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters long.`;
  }

  if (age < MIN_AGE || age > MAX_AGE) {
    return `Age must be between ${MIN_AGE} and ${MAX_AGE}.`;
  }

  return null;
}

const employeeForm = createEmployeeForm();

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(employeeForm);
  const employeeName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');

  if (!employeeName || !position || !office || !age || !salary) {
    pushNotification('Invalid data', 'All fields are required.', 'error');

    return;
  }

  const validationError = validateEmployee({ employeeName, age: Number(age) });

  if (validationError) {
    pushNotification('Invalid data', validationError, 'error');

    return;
  }

  const row = document.createElement('tr');

  [employeeName, position, office, age, formatSalary(salary)].forEach(
    (value) => {
      const cell = document.createElement('td');

      cell.textContent = value;
      row.append(cell);
    },
  );

  tbody.append(row);
  employeeForm.reset();

  pushNotification(
    'Success',
    'New employee was added to the table.',
    'success',
  );
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('.cell-input')) {
    return;
  }

  const activeInput = tbody.querySelector('.cell-input');

  if (activeInput) {
    activeInput.blur();
  }

  const initialValue = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  function saveValue() {
    const newValue = input.value.trim();

    cell.textContent = newValue === '' ? initialValue : newValue;
  }

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});
