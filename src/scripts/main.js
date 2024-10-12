'use strict';

// TABLE VARIABLES
const table = document.querySelector('table');
const tHead = table.tHead;
const tBody = table.tBodies[0];

// SORTING FUNCTIONS AND RELATED OBJECTS
const valueByIndex = (row, index) => row.cells[index].textContent;
const salaryToNum = (a) => Number(a.substring(1).split(',').join(''));

const getSortingFunction = (index, order, transformFunc = (x) => x) => {
  return (a, b) => {
    const valueA = transformFunc(valueByIndex(a, index));
    const valueB = transformFunc(valueByIndex(b, index));

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order * valueA.localeCompare(valueB);
    }

    return order * (valueA - valueB);
  };
};

const sortingFunctions = {
  transformFunctions: {
    age: parseInt,
    salary: salaryToNum,
  },

  get: function (index, colHeader, ascOrder) {
    const transformFunc = this.transformFunctions[colHeader];

    return ascOrder
      ? getSortingFunction(index, 1, transformFunc)
      : getSortingFunction(index, -1, transformFunc);
  },
};

// OBJECT TO KEEP TRACK OF ASC/DESC ORDER
const orderByUtil = {
  element: undefined,
  ascOrder: undefined, // true -> asc, false -> desc

  clickIsMade: (target) => {
    if (target === this.element) {
      this.ascOrder = !this.ascOrder;
    } else {
      this.element = target;
      this.ascOrder = true;
    }
  },
  getValue: () => this.ascOrder,
};

// HANDLING ASC/DESC CLICK EVENT
const handleSortingEvent = (e) => {
  const target = e.target.closest('th');

  if (target) {
    orderByUtil.clickIsMade(target);

    const index = target.cellIndex;
    const colHeader = target.textContent.toLowerCase();
    const order = orderByUtil.getValue();

    Array.from(tBody.rows)
      .sort(sortingFunctions.get(index, colHeader, order))
      .forEach((row) => tBody.append(row));
  }
};

tHead.addEventListener('click', handleSortingEvent);

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

// ADDING FORM TO THE DOCUMENT
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

const form = document.createElement('form');
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const formElements = [
  createInput('name', 'text'),
  createInput('position', 'text'),
  createSelect('office', offices),
  createInput('age', 'number'),
  createInput('salary', 'number'),
  createButton('Save to table', 'submit'),
];

form.classList.add('new-employee-form');
formElements.forEach((element) => form.append(element));
document.addEventListener('DOMContentLoaded', () => document.body.append(form));

// FORM VALIDATION
const formValidation = (value, key) => {
  const validators = {
    position: () => (!value ? `Position is a required field!` : 'success'),
    name: () =>
      !value || value.length < 4
        ? 'Name should be at least 4 characters long'
        : 'success',
    age: () =>
      value < 18 || value > 90
        ? 'Age should be between 18 and 90 years old'
        : 'success',
  };

  return validators[key]?.() || 'success';
};

const validateInputData = (data) => {
  return Array.from(data)
    .map(([key, value]) => formValidation(value, key))
    .filter((result) => result !== 'success');
};

// NOTIFICATIONS ON SUCESS / ERROR
const displaySuccessNotice = (message) => {
  displayNotification('success', 'Success!', [message]);
};

const displayErrorNotice = (errorArray) => {
  displayNotification('error', 'Error!', errorArray);
};

const displayNotification = (type, titleText, textArr) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <h3 class="title">${titleText}</h3>
    <p>
      <ul>
        ${textArr.map((message) => `<li>${message}</li>`).join('')}
      </ul>
    </p>
  `;

  document.body.append(notification);
  setTimeout(() => notification.remove(), 2000);
};

// HANDLE SUBMIT EVENT
const numToSalary = (num) => `$${(+num).toLocaleString('en-US')}`;
const appendTableWithData = (data) => {
  const newRow = tBody.insertRow(-1);

  data.forEach((value, key) => {
    newRow.insertCell(-1).textContent =
      key === 'salary' ? numToSalary(value) : value;
  });
};

const handleSubmitFormEvent = (e) => {
  e.preventDefault();

  const target = e.target.closest('form');
  const formData = new FormData(target);
  const errors = validateInputData(formData);

  if (errors.length === 0) {
    const message = 'New employee has been added to the list!';

    appendTableWithData(formData);
    displaySuccessNotice(message);
  } else {
    displayErrorNotice(errors);
  }
};

form.addEventListener('submit', handleSubmitFormEvent);

// CELL EDITING EVENTS AND HANDLERS
const createCellInput = (cell) => {
  const input = Object.assign(document.createElement('input'), {
    name: 'cellInput',
    type: 'text',
  });

  input.classList.add('cell-input');
  cell.append(input);

  input.addEventListener('blur', handleSaveCellEvent);
  input.addEventListener('keydown', handleEnterCellEvent);
  input.focus();
};

const handleDoubleClickEvent = (e) => {
  const target = e.target.closest('td');

  if (target) {
    target.textContent = '';
    createCellInput(target);
  }
};

tBody.addEventListener('dblclick', handleDoubleClickEvent);

const saveCellInput = (cell, value) => {
  if (cell instanceof HTMLTableCellElement) {
    const index = cell.cellIndex;
    const isSalary = table.rows[0].cells[index].innerHTML === 'Salary';

    cell.innerHTML = isSalary ? numToSalary(value) : value;
  }
};

const handleSaveCellEvent = (e) => {
  const target = e.target;
  const td = e.target.parentNode;

  if (target && td) {
    const value = target.value;

    target.remove();
    saveCellInput(td, value);
  }
};

const handleEnterCellEvent = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSaveCellEvent(e);
  }
};
