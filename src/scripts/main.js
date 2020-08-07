'use strict';

/**
 * Global variables
 */
const table = document.querySelector('table');
const tHeader = table.tHead.rows[0];
const headerCells = [...tHeader.cells];
const tBody = table.tBodies[0];
let notificationTimer = null;
let sortColumn = null;

/**
 * Dynamically created elements
 */
const form = createEmployeeForm();
const notificationContainer = document.createElement('div');

document.body.append(notificationContainer);

/**
 * Helper functions and handlers
 */
function createEmployeeForm() {
  const newForm = document.createElement('form');

  newForm.noValidate = true;
  newForm.classList.add('new-employee-form');
  document.body.append(newForm);

  newForm.insertAdjacentHTML(
    'beforeend',
    `<label>Name:
      <input name="name" type="text" required minLength="4">
    </label>
    <label>Position:
      <input name="position" type="text" required>
    </label>
    <label>Office:
    <select name="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
    </label>
    <label>Age:
      <input name="age" type="number" required min="18" max="90">
    </label>
    <label>Salary:
      <input name="salary" type="number" required>
    </label>
    <button type="submit">Save to table</button>`
  );

  return newForm;
}

function convertToNumber(string) {
  return parseInt(string.replace(/[^0-9]/g, ''));
}

function formatSalary(salary) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(salary);
}

function createAndShowNotification({ type, title, message }) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationMessage = document.createElement('span');

  notification.classList.add('notification');
  notificationTitle.classList.add('title');
  notification.append(notificationTitle, notificationMessage);

  hideNotification(notification);

  // Add a notification type class
  notification.classList.add(type);
  notificationTitle.innerText = title;
  notificationMessage.innerHTML = message;
  notificationContainer.append(notification);

  clearTimeout(notificationTimer);
  notificationTimer = setTimeout(() => hideNotification(notification), 5000);
}

function hideNotification(notification) {
  notificationContainer.innerHTML = '';
}

function addEmployee({ name, position, office, age, salary }) {
  tBody.insertAdjacentHTML(
    'beforeend',
    ` <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formatSalary(salary)}</td>
    `
  );
}

function saveValue(cell, input, defaultValue) {
  cell.textContent = input.value || defaultValue;
}

function handleTableHeadClick(e) {
  const rows = [...tBody.children];
  const clickedLabel = headerCells.indexOf(e.target);

  if (sortColumn === e.target) {
    rows.reverse();
  } else {
    sortColumn = e.target;

    rows.sort((a, b) => {
      const firstValue = a.cells[clickedLabel].innerText;
      const secondValue = b.cells[clickedLabel].innerText;
      const number1 = convertToNumber(firstValue);
      const number2 = convertToNumber(secondValue);

      if (isNaN(number1) || isNaN(number2)) {
        return firstValue.localeCompare(secondValue);
      }

      return number1 - number2;
    });
  }

  table.tBodies[0].append(...rows);
}

function handleTableRowClick(e) {
  const rows = [...tBody.children];
  const clickedRow = e.target.parentNode;

  rows.forEach((row) => {
    if (row === clickedRow) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  });
}

function validateFormFields(elements) {
  const errors = [];

  elements.forEach((formElement) => {
    if (!['INPUT', 'SELECT'].includes(formElement.tagName)) {
      return;
    }

    const { name, value, required, minLength, min, max } = formElement;

    if (required && !value) {
      errors.push(`${name} is required`);
    } else if (minLength && value.length < minLength) {
      errors.push(`${name} should have at least ${minLength} characters`);
    } else if (parseFloat(min, 10) && value < parseFloat(min, 10)) {
      errors.push(`${name} should not be lower than ${min}`);
    } else if (parseFloat(max, 10) && value > parseFloat(max, 10)) {
      errors.push(`${name} should not be greater than ${max}`);
    }
  });

  return errors;
}

function handleFormSubmit(e) {
  e.preventDefault();

  const elements = [...e.target.elements];
  const errors = validateFormFields(elements);
  const formData = {};

  elements.forEach((formElement) => {
    formData[formElement.name] = formElement.value;
  });

  if (errors.length) {
    createAndShowNotification({
      type: 'error',
      title: 'Validation error',
      message: errors.join('<br />'),
    });
  } else {
    addEmployee(formData);

    createAndShowNotification({
      type: 'success',
      title: 'Success',
      message: 'Employee added successfully',
    });
    form.reset();
  }
}

function handleFinishEdit(e, defaultValue) {
  const input = e.target;
  const cell = input.parentNode;

  if (e.type === 'keyup' && e.key !== 'Enter') {
    return;
  }

  saveValue(cell, input, defaultValue);
}

function handleTableCellDblclick(e) {
  const cell = e.target;
  const input = document.createElement('input');
  const defaultValue = cell.textContent;

  input.classList.add('cell-input');
  input.value = defaultValue;
  cell.textContent = '';
  cell.append(input);
  input.focus();

  input.addEventListener('blur', (inputEvent) =>
    handleFinishEdit(inputEvent, defaultValue)
  );

  input.addEventListener('keyup', (inputEvent) =>
    handleFinishEdit(inputEvent, defaultValue)
  );
}

/**
 * Event listeners
 */
tHeader.addEventListener('click', handleTableHeadClick);
tBody.addEventListener('click', handleTableRowClick);
tBody.addEventListener('dblclick', handleTableCellDblclick);
form.addEventListener('submit', handleFormSubmit);
