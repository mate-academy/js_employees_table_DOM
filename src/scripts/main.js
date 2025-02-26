'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const tableHead = table.querySelector('thead');
const headers = Array.from(tableHead.querySelectorAll('th'));

// --- Column definitions, converters, form fields constraints ---
const columns = extractColumnNames();
const columnConverters = {
  age: (text) => parseInt(text, 10) || 0,
  salary: parseSalary,
};
const inputTypes = {
  name: 'text',
  position: 'text',
  age: 'number',
  salary: 'number',
};
const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const converter = (key, value) => {
  const converterFunction = columnConverters[key] || ((text) => text);

  return converterFunction(value);
};

const employeesData = extractTableData(table, columns);

// --- Form Initialization and Handler Attaching---
const newEmployeeForm = createNewEmployeeForm(columns);
const formSubmitButton = newEmployeeForm.querySelector('button');

body.appendChild(newEmployeeForm);

formSubmitButton.addEventListener('click', (e) => {
  const form = e.target.closest('form');

  handleSubmitFormClick(e, form);
});

// --- Data Extraction ---

/** Parses table headers to create mapping for object and dataset values. */
function extractColumnNames() {
  return headers.map((cell) => cell.textContent.toLowerCase().trim());
}

/** Parses a salary string (e.g. "$123,456") and returns an integer. */
function parseSalary(salaryStr) {
  return parseInt(salaryStr.replace(/[$,]/g, '')) || 0;
}

/** Formats an integer as a salary string (e.g. "$123,456"). */
function formatSalary(salaryInt) {
  return salaryInt.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

/** Extracts table data into an array of objects using column names as keys. */
function extractTableData(tableEl, columnNames) {
  const tbody = tableEl.querySelector('tbody');

  return Array.from(tbody.rows).map((row) => {
    const cells = Array.from(row.cells);

    return columnNames.reduce((acc, columnName, index) => {
      const key = columnName;
      const value = cells[index].textContent;

      acc[key] = converter(key, value);

      return acc;
    }, {});
  });
}

// --- Form Creation ---

/** Initializes form with a field for each table column. */
function createNewEmployeeForm(columnNames) {
  const form = document.createElement('form');
  const button = document.createElement('button');

  columnNames.forEach((columnName) => {
    form.appendChild(createFormField(columnName));
  });

  form.classList.add('new-employee-form');
  button.textContent = 'Save to table';
  form.appendChild(button);

  return form;
}

/**
 * Creates field element consisting of the required <input>
 * or <select> element wrapped with the <label> tag.
 */
function createFormField(fieldName) {
  const fieldElement = document.createElement('label');
  let inputArea;

  fieldElement.textContent = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}:`;

  if (fieldName === 'office') {
    inputArea = document.createElement('select');

    officeOptions.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      inputArea.appendChild(option);
    });
  } else {
    inputArea = document.createElement('input');
    inputArea.type = inputTypes[fieldName];
    inputArea.placeholder = fieldName;
  }

  inputArea.name = fieldName;
  inputArea.dataset.qa = fieldName;
  inputArea.required = true;

  fieldElement.appendChild(inputArea);

  return fieldElement;
}

// --- Form Handling ---
function handleSubmitFormClick(e, form) {
  e.preventDefault();

  const inputsArray = Array.from(form.querySelectorAll('input'));
  const formErrors = getFormErrors(inputsArray);

  if (Object.values(formErrors).some((errorsGroup) => errorsGroup.length)) {
    addErrorsNotification(formErrors);

    return;
  }

  const fieldsArray = Array.from(form.querySelectorAll('input, select'));

  const newEmployee = addNewEmployee(fieldsArray);

  refreshTable(employeesData);
  form.reset();
  addSuccessNotification(newEmployee);
}

/** Extracts data from the form fields into an object. */
function addNewEmployee(fields) {
  const newEmployee = Array.from(fields).reduce((employee, field) => {
    const { name: fieldName, value } = field;

    employee[fieldName] = converter(fieldName, value);

    return employee;
  }, {});

  employeesData.push(newEmployee);

  return newEmployee;
}

// --- Form validation ---
function getFormErrors(fieldsData) {
  const errors = { emptyFields: [], fieldsWithErrors: [] };
  const validators = {
    name: validateName,
    age: (value) => {
      const ageValue = columnConverters.age(value);

      return validateAge(ageValue);
    },
  };

  fieldsData.forEach((field) => {
    const fieldName = field.name;
    const fieldValue = field.value;

    if (!fieldValue) {
      errors.emptyFields.push(fieldName);
    } else {
      if (fieldName in validators) {
        const fieldError = validators[fieldName](fieldValue);

        if (fieldError) {
          errors.fieldsWithErrors.push({ name: fieldName, error: fieldError });
        }
      }
    }
  });

  return errors;
}

function validateName(value) {
  return value.length < 4 ? 'Must have 4 symbols or more.' : null;
}

function validateAge(value) {
  if (value < 18) {
    return 'Must be 18 or more.';
  } else if (value > 90) {
    return 'Must be less than 90.';
  }

  return null;
}

// --- Notifications ---
function pushNotification(title, descriptionElement, type, timeout) {
  const notificationElement = document.createElement('div');
  const titleElement = document.createElement('h2');

  notificationElement.classList.add('notification', type);
  notificationElement.dataset.qa = `notification`;
  titleElement.classList.add('title');

  titleElement.textContent = title;

  notificationElement.appendChild(titleElement);
  notificationElement.appendChild(descriptionElement);
  body.appendChild(notificationElement);

  setTimeout(() => {
    notificationElement.hidden = true;
  }, timeout);
}

function addSuccessNotification(employeeData) {
  const { name: employeeName, position, office } = employeeData;
  const title = 'New employee added';
  const description = `New employee '${employeeName} (${position}, ${office}) was added to the list.`;
  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;

  pushNotification(title, descriptionElement, 'success', 4500);
}

function addErrorsNotification(errors) {
  const title = 'Form contains errors';
  const descriptionElement = document.createElement('ul');

  function appendErrorsMessage(errorsGroup, description, errorValueConverter) {
    if (errors[errorsGroup].length) {
      const errorGroupElement = document.createElement('li');
      const nestedListElement = document.createElement('ul');

      errorGroupElement.textContent = description;
      errorGroupElement.appendChild(nestedListElement);

      errors[errorsGroup].forEach((error) => {
        const errorElement = document.createElement('li');

        errorElement.textContent = errorValueConverter(error);
        nestedListElement.appendChild(errorElement);
      });

      descriptionElement.appendChild(errorGroupElement);
    }
  }

  appendErrorsMessage(
    'emptyFields',
    'These fields cannot be empty:',
    (value) => value,
  );

  appendErrorsMessage(
    'fieldsWithErrors',
    'Errors:',
    (value) => `${value.name}: ${value.error}`,
  );

  pushNotification(title, descriptionElement, 'error', 7500);
}

// --- Data Sorting and Table Regenerating ---

/**
 * Sorts an array of data objects by the given column name.
 * Uses localeCompare for strings and numerical subtraction for numbers.
 */
function sortDataByColumn(data, columnName, order = 'asc') {
  if (!data.length) {
    return [];
  }

  const factor = order === 'asc' ? 1 : -1;
  const sampleValue = data[0][columnName];
  const isNumeric = typeof sampleValue === 'number';

  const comparator = (a, b) => {
    const valA = a[columnName];
    const valB = b[columnName];

    if (isNumeric) {
      return (valA - valB) * factor;
    }

    return valA.localeCompare(valB) * factor;
  };

  return [...data].sort(comparator);
}

/**
 * Creates a document fragment containing table rows (<tr>) built from data.
 * Uses the columnNames array to preserve the columns ordder.
 * The salary column values are formatted as currency strings.
 */
function createTableBodyFragment(data, columnNames) {
  const fragment = document.createDocumentFragment();

  data.forEach((rowData) => {
    const row = document.createElement('tr');

    columnNames.forEach((columnName) => {
      const cellData = rowData[columnName];
      const cell = document.createElement('td');

      cell.textContent =
        columnName === 'salary' ? formatSalary(cellData) : cellData;
      row.appendChild(cell);
    });

    fragment.appendChild(row);
  });

  return fragment;
}

/**
 * Defines the next sorting order for a target header cell.
 * If no order or descending is set, returns 'asc'; otherwise 'desc'.
 */
function getNextSortOrder(headerCell) {
  const currentOrder = headerCell.dataset.sorting;

  return !currentOrder || currentOrder === 'desc' ? 'asc' : 'desc';
}

/**
 * Clears sorting state from all header cells.
 */
function clearSortingStates() {
  table.querySelectorAll('th[data-sorting]').forEach((th) => {
    th.removeAttribute('data-sorting');
  });
}

/**
 * Rebuilds the table body with the given employee data.
 * If <thead> contains a cell with 'data-sorting' attribute, sorts the given
 * employee data by the corresponding column.
 */
function refreshTable(data) {
  let dataToRender = [...data];
  const sortingHeader = table.querySelector('th[data-sorting]');

  if (sortingHeader) {
    const columnName = sortingHeader.textContent.toLowerCase();
    const order = sortingHeader.dataset.sorting;

    dataToRender = sortDataByColumn(employeesData, columnName, order);
  }

  tableBody.innerHTML = '';
  tableBody.appendChild(createTableBodyFragment(dataToRender, columns));
}

// Handle sorting when a header cell is clicked
function handleHeaderClick(headerCell) {
  const nextOrder = getNextSortOrder(headerCell);

  clearSortingStates();
  headerCell.dataset.sorting = nextOrder;
  refreshTable(employeesData);
}

// Handle making row 'active' when a row in the body is clicked
function handleRowClick(row) {
  document
    .querySelectorAll('.active')
    .forEach((element) => element.classList.remove('active'));
  row.classList.add('active');
}

// --- Table Event Delegation ---
table.addEventListener('click', (e) => {
  const target = e.target;
  const clickedHeaderCell = target.closest('th');
  const clickedRow = target.closest('tr');

  if (clickedHeaderCell && target.closest('thead')) {
    handleHeaderClick(clickedHeaderCell);

    return;
  }

  if (clickedRow && target.closest('tbody')) {
    handleRowClick(clickedRow);
  }
});
