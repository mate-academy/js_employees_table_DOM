/* eslint-disable function-paren-newline */
/* eslint-disable no-shadow */
'use strict';

// #region constants
const NOTIFICATION_TIMEOUT = 3000;
const NOTIFICATION_POSITION_X = 10;
const NOTIFICATION_POSITION_Y = 10;
const EMPLOYEE_MIN_AGE = 18;
const EMPLOYEE_MAX_AGE = 90;
const EMPLOYEE_NAME_LENGTH_MIN = 4;
const ROW_ACTIVE_CLASS = 'active';
const FORM_CLASS = 'new-employee-form';
const EDIT_CELL_INPUT_CLASS = 'cell-input';
const SUBMIT_BUTTON_TEXT = 'Save to table';
const OFFICE_OPTIONS = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
// #endregion
// #region validators
const CHECK_EMPLOYEE_AGE = (age) =>
  age >= EMPLOYEE_MIN_AGE && age <= EMPLOYEE_MAX_AGE;
const CHECK_EMPLOYEE_NAME = (name) => name.length >= EMPLOYEE_NAME_LENGTH_MIN;
// #endregion

// #region variables
let reverseOrder = false;
let lastClickedHeading = -1;
let selectedRow = null;
// #endregion

const table = document.querySelector('table');
const tableHeadings = table.querySelectorAll('thead th');
const tableBody = table.querySelector('tbody');

addForm();

// #region table
(function addListenersToInitialMarkup() {
  tableHeadings.forEach((cell, index) => {
    cell.addEventListener('click', () => handleHeadingClick(index));
  });

  tableBody.addEventListener('click', handleSelectTableRow);

  tableBody.addEventListener('dblclick', handleEditCell);
})();

function handleEditCell(ev) {
  const cell = ev.target;

  if (!(cell.tagName === 'TD')) {
    return;
  }

  const initialValue = cell.textContent;
  const input = createHtmlElement('input', {
    type: 'text',
    value: initialValue,
    className: EDIT_CELL_INPUT_CLASS,
  });

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  const save = () => {
    cell.textContent = input.value?.trim() || initialValue;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
}

function handleHeadingClick(index) {
  const actualRows = tableBody.querySelectorAll('tr');
  const rowsCopy = [...actualRows];

  reverseOrder = lastClickedHeading === index ? !reverseOrder : false;
  lastClickedHeading = index;

  rowsCopy.sort((a, b) => {
    const aTextValue = getSanitizedTextContent(a.cells[index]);
    const bTextValue = getSanitizedTextContent(b.cells[index]);

    if (!isNaN(+aTextValue + +bTextValue)) {
      return +aTextValue - +bTextValue;
    }

    return aTextValue.localeCompare(bTextValue);
  });

  if (reverseOrder) {
    rowsCopy.reverse();
  }

  for (const row of rowsCopy) {
    tableBody.appendChild(row);
  }
}

function handleSelectTableRow(ev) {
  const row = ev.target.closest('tr');

  if (selectedRow) {
    selectedRow.classList.remove(ROW_ACTIVE_CLASS);
  }

  selectedRow = row;

  selectedRow.classList.add(ROW_ACTIVE_CLASS);
}

function getSanitizedTextContent(cell) {
  return cell.textContent.replaceAll('$', '').replaceAll(',', '');
}
// #endregion

// #region form
function addForm() {
  const form = createHtmlElement('form', {
    className: FORM_CLASS,
  });
  const nameField = createFormInput(
    { textContent: 'Name: ' },
    {
      name: 'name',
      type: 'text',
    },
  );
  const positionField = createFormInput(
    {
      textContent: 'Position: ',
    },
    {
      name: 'position',
      type: 'text',
    },
  );
  const ageField = createFormInput(
    {
      textContent: 'Age: ',
    },
    {
      name: 'age',
      type: 'number',
    },
  );
  const salaryField = createFormInput(
    {
      textContent: 'Salary: ',
    },
    {
      name: 'salary',
      type: 'number',
    },
  );
  const officeField = createSelectInput(
    { textContent: 'Office: ' },
    {
      name: 'office',
    },
  );
  const submitButton = createHtmlElement('button', {
    type: 'submit',
    textContent: SUBMIT_BUTTON_TEXT,
  });

  appendChildren(form, [
    nameField,
    positionField,
    officeField,
    ageField,
    salaryField,
    submitButton,
  ]);

  form.onsubmit = handleFormSubmit;
  document.body.appendChild(form);
}

function handleFormSubmit(ev) {
  ev.preventDefault();

  const formData = new FormData(ev.target);

  const employee = {
    name: formData.get('name')?.trim(),
    position: formData.get('position').trim(),
    office: formData.get('office').trim(),
    age: formData.get('age').trim(),
    salary: formData.get('salary').trim(),
  };

  if (Object.values(employee).some((field) => !field)) {
    pushNotification('Error!', 'All fields are required');

    return;
  }

  if (!CHECK_EMPLOYEE_NAME(employee.name)) {
    pushNotification(
      'Error!',
      'Employee name length should be 4 symbols or longer!',
    );

    return;
  }

  if (!CHECK_EMPLOYEE_AGE(+employee.age)) {
    pushNotification('Error!', 'Employee age should be between 18 and 90');

    return;
  }

  const newRow = createHtmlElement('tr');

  const employeeToAppend = Object.values({
    ...employee,
    salary: formatSalary(employee.salary),
  });

  const cells = employeeToAppend.map((value) =>
    createHtmlElement('td', {
      textContent: value,
    }),
  );

  appendChildren(newRow, cells);
  newRow.addEventListener('click', handleSelectTableRow);

  tableBody.appendChild(newRow);

  pushNotification('Success!', 'Employee added successfully!', 'success');

  ev.target.reset();
}

function createHtmlElement(tag, props) {
  const element = document.createElement(tag);

  if (props && Object.keys(props).length > 0) {
    for (const [key, value] of Object.entries(props)) {
      element[key] = value;
    }

    if ((tag === 'input' || tag === 'select') && props.name) {
      element.setAttribute('data-qa', props.name);
    }
  }

  return element;
}

function createFormInput(labelProps, inputProps) {
  const label = createHtmlElement('label', labelProps);
  const input = createHtmlElement('input', inputProps);

  label.appendChild(input);

  return label;
}

function createSelectInput(labelProps, selectProps) {
  const label = createHtmlElement('label', labelProps);
  const selectInput = createHtmlElement('select', selectProps);

  appendChildren(
    selectInput,
    OFFICE_OPTIONS.map((option) =>
      createHtmlElement('option', { value: option, textContent: option }),
    ),
  );

  label.appendChild(selectInput);

  return label;
}

function appendChildren(element, children) {
  children.forEach((child) => {
    element.appendChild(child);
  });
}
// #endregion

function pushNotification(title, description, type = 'error') {
  const notificationBlock = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notificationBlock.className = 'notification' + ' ' + type;
  notificationBlock.style.top = NOTIFICATION_POSITION_Y + 'px';
  notificationBlock.style.right = NOTIFICATION_POSITION_X + 'px';

  descriptionElement.textContent = description;
  titleElement.textContent = title;
  titleElement.className = 'title';

  notificationBlock.appendChild(titleElement);
  notificationBlock.appendChild(descriptionElement);
  notificationBlock.setAttribute('data-qa', 'notification');

  document.body.appendChild(notificationBlock);

  setTimeout(() => {
    notificationBlock.style.display = 'none';
  }, NOTIFICATION_TIMEOUT);
}

// #region utility
function formatSalary(salary) {
  return (+salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
// #endregion
