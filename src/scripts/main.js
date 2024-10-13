'use strict';

// TABLE_VARIABLES
const table = document.querySelector('table');
const tHead = table.tHead;
const tBody = table.tBodies[0];

// #region SORTING
// SORTING FUNCTIONS
const valueConversionFunctions = {
  age: parseInt,
  salary: window.convertSalartyToNumber,
};

const findSuitableSortingFunction = (
  index,
  order,
  transformFunc = (x) => x,
) => {
  return (a, b) => {
    const valueA = transformFunc(window.getValueByCellIndex(a, index));
    const valueB = transformFunc(window.getValueByCellIndex(b, index));

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order * valueA.localeCompare(valueB);
    }

    return order * (valueA - valueB);
  };
};

const getSortingFunction = (index, colHeader, ascOrder) => {
  const transformFunc = valueConversionFunctions[colHeader];

  return ascOrder
    ? findSuitableSortingFunction(index, 1, transformFunc)
    : findSuitableSortingFunction(index, -1, transformFunc);
};

// TOGGLE ASC/DESC ORDER LOGIC
const ascDescOrderUtil = {
  element: undefined,
  ascOrder: undefined, // true -> asc, false -> desc

  clickIsMade: (target) => {
    if (target === ascDescOrderUtil.element) {
      ascDescOrderUtil.ascOrder = !ascDescOrderUtil.ascOrder;
    } else {
      ascDescOrderUtil.element = target;
      ascDescOrderUtil.ascOrder = true;
    }
  },
  getValue: () => ascDescOrderUtil.ascOrder,
};

// HANDLING ASC/DESC CLICK EVENT
const handleSortingEvent = (e) => {
  const target = e.target.closest('th');

  if (target) {
    ascDescOrderUtil.clickIsMade(target);

    const index = target.cellIndex;
    const colHeader = target.textContent.toLowerCase();
    const orderDirection = ascDescOrderUtil.getValue();

    Array.from(tBody.rows)
      .sort(getSortingFunction(index, colHeader, orderDirection))
      .forEach((row) => tBody.append(row));
  }
};

tHead.addEventListener('click', handleSortingEvent);
// #endregion

// #region SELECT_ROW
// HANDLING ROW SELECT EVENT
const deselectRows = () => {
  for (const row of table.rows) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }
};

tBody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  if (target) {
    deselectRows();
    target.classList.add('active');
  }
});
// #endregion

// #region FORM_NEW_EMPLOYEE
// DATA FOR TJE FORM
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// CREATING FORM ELEMENTS
const formatLabelText = (inputName) => {
  return `${inputName.charAt(0).toUpperCase()}${inputName.substring(1)}: `;
};

const createInput = (inputName, inputType) => {
  const input = Object.assign(document.createElement('input'), {
    name: inputName,
    type: inputType,
  });
  const label = document.createElement('label');

  input.setAttribute('data-qa', inputName);

  label.textContent = formatLabelText(inputName);
  label.append(input);

  return label;
};

const createSelect = (inputName, options) => {
  const select = Object.assign(document.createElement('select'), {
    name: inputName,
  });

  select.setAttribute('data-qa', inputName);

  Array.from(options)
    .sort()
    .forEach((option) => select.append(new Option(option, option)));

  const label = document.createElement('label');

  label.textContent = formatLabelText(inputName);
  label.append(select);

  return label;
};

const createButton = (btnText, type) => {
  const button = document.createElement('button');

  button.setAttribute('type', type);
  button.textContent = btnText;

  return button;
};

const formElements = [
  createInput('name', 'text'),
  createInput('position', 'text'),
  createSelect('office', offices),
  createInput('age', 'number'),
  createInput('salary', 'number'),
  createButton('Save to table', 'submit'),
];

// CREATE FORM AND ADD ELEMENTS
const form = document.createElement('form');

form.classList.add('new-employee-form');
formElements.forEach((element) => form.append(element));
document.addEventListener('DOMContentLoaded', () => document.body.append(form));

// FORM VALIDATION
const positionValidatorFunction = (value) =>
  !value
    ? { validated: false, message: `Position is a required field!` }
    : { validated: true };

const nameValidatorFunction = (value) =>
  !value || value.length < 4
    ? { validated: false, message: 'Name should be more than 4 chars long' }
    : { validated: true };

const ageValidatorFunction = (value) =>
  value < 18 || value > 90
    ? { validated: false, message: 'Age must be between 18 and 90' }
    : { validated: true };

const getValidatorFunction = (value, key) => {
  const validators = {
    position: positionValidatorFunction,
    name: nameValidatorFunction,
    age: ageValidatorFunction,
  };

  return validators[key]?.(value) || { validated: true };
};

const validateForm = (data) => {
  return Array.from(data)
    .map(([key, value]) => getValidatorFunction(value, key))
    .filter((result) => !result.validated)
    .map((result) => result.message);
};

// NOTIFICATIONS ON SUCESS / ERROR
const displaySuccessNotice = (message) => {
  displayNotification('success', 'Success!', [message]);
};

const displayErrorNotice = (errorArray) => {
  displayNotification('error', 'Error!', errorArray);
};

const displayNotification = (type, titleText, errorMessageArr) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <h3 class="title">${titleText}</h3>
    <p>
      <ul>
        ${errorMessageArr.map((message) => `<li>${message}</li>`).join('')}
      </ul>
    </p>
  `;

  document.body.append(notification);
  setTimeout(() => notification.remove(), 2000);
};

// HANDLE FORM SUBMIT EVENT
const appendTableWithData = (data) => {
  const newRow = tBody.insertRow(-1);

  data.forEach((value, key) => {
    newRow.insertCell(-1).textContent =
      key === 'salary' ? window.convertNumberToSalary(value) : value;
  });
};

const handleSubmitFormEvent = (e) => {
  e.preventDefault();

  const target = e.target.closest('form');
  const formData = new FormData(target);
  const errors = validateForm(formData);

  if (errors.length === 0) {
    const message = 'New employee has been added to the list!';

    appendTableWithData(formData);
    displaySuccessNotice(message);
  } else {
    displayErrorNotice(errors);
  }
};

form.addEventListener('submit', handleSubmitFormEvent);
// #endregion

// #region CELL_EDITTING
// EVENT HANDLERS TO SAVE EDITED DATA
const saveCellInput = (cell, value) => {
  if (cell instanceof HTMLTableCellElement) {
    const index = cell.cellIndex;
    const isSalary = table.rows[0].cells[index].innerHTML === 'Salary';

    cell.innerHTML = isSalary ? window.convertNumberToSalary(value) : value;
  }
};

const handleSaveCellEvent = (e) => {
  const target = e.target;
  const td = e.target.parentNode;

  if (target && td) {
    const value = target.value;

    target.hidden = true;
    saveCellInput(td, value);
  }
};

const handleSaveCellOnEnterEvent = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSaveCellEvent(e);
  }
};

// CREATE CELL INPUT FIELD
const createCellInputField = () => {
  const input = Object.assign(document.createElement('input'), {
    name: 'cellInput',
    type: 'text',
  });

  input.classList.add('cell-input');
  input.addEventListener('blur', handleSaveCellEvent);
  input.addEventListener('keydown', handleSaveCellOnEnterEvent);

  return input;
};

const cellInputField = createCellInputField();

const insertInputIntoCell = (cell) => {
  cell.append(cellInputField);
  cellInputField.focus();
};

// ADDING INPUT FIELD EVENT/HANDLER
const handleDoubleClickEvent = (e) => {
  const target = e.target.closest('td');

  if (target) {
    target.textContent = '';
    insertInputIntoCell(target);
  }
};

tBody.addEventListener('dblclick', handleDoubleClickEvent);
// #endregion
