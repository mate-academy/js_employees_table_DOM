'use strict';

// Constants to handle sorting order, form validation, and cities
const ASCENDING = 'asc'; // Sorting order: ascending
const DESCENDING = 'desc'; // Sorting order: descending
const DATA_STATE = 'state'; // Data attribute for tracking sort state
const MIN_AGE = 18; // Minimum allowed age
const MAX_AGE = 90; // Maximum allowed age
const MIN_NAME_LENGTH = 4; // Minimum name length
const CITIES = [
  // Available cities for employee selection
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// References to the table and table body for row manipulations
const table = document.body.firstElementChild;
const tableBody = table.tBodies[0];

// Event listeners for table sorting, row selection, and cell editing
table.addEventListener('click', handleSort); // Sorting when header clicked
tableBody.addEventListener('click', selectRow); // Selecting a row on click
// Enabling inline editing on cell double click
tableBody.addEventListener('dblclick', editCell);

createForm(); // Call to create the dynamic employee form

// Function to dynamically create the employee form and append it to the page
function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form'); // Add form class
  form.setAttribute('id', 'dynamicForm');
  form.setAttribute('action', '/submit');
  form.setAttribute('method', 'post');

  // Add Name field
  const nameLabel = createLabel('Name: ', 'name');
  const nameInput = createInput('name', 'text');

  nameLabel.append(' ', nameInput);
  form.append(nameLabel);

  // Add Position field
  const positionLabel = createLabel('Position: ', 'position');
  const positionInput = createInput('position', 'text');

  positionLabel.append(' ', positionInput);
  form.append(positionLabel);

  // Add Office (City) field
  const selectLabel = createLabel('Office: ', '');
  const officeSelect = createSelect(CITIES);

  officeSelect.setAttribute('name', 'city');
  officeSelect.setAttribute('data-qa', 'office');
  selectLabel.append(officeSelect);
  form.append(selectLabel);

  // Add Age field
  const ageLabel = createLabel('Age: ', 'age');
  const ageInput = createInput('age', 'number');

  ageLabel.append(ageInput);
  form.append(ageLabel);

  // Add Salary field
  const salaryLabel = createLabel('Salary: ', 'salary');
  const salaryInput = createInput('salary', 'number');

  salaryLabel.append(salaryInput);
  form.append(salaryLabel);

  // Add Save Button
  const saveButton = createSubButton('dynamicForm', 'Save to table');

  saveButton.addEventListener('click', handleFormSubmit);
  form.append(saveButton);

  // Append form to the document body
  document.body.append(form);
}

// Handles the form submission, validates data, and adds a new row to the table
function handleFormSubmit(e) {
  e.preventDefault(); // Prevent form's default behavior (refresh)

  const form = document.getElementById('dynamicForm');
  const nameValue = form.elements['name'].value;
  const positionValue = form.elements['position'].value;
  const selectedOffice = form.elements['city'].value;
  const ageValue = Number(form.elements['age'].value);
  const salaryValue = Number(form.elements['salary'].value);

  // Form validation checks
  if (!form.checkValidity()) {
    showNotification('error', 'Please fill in all required fields.');

    return;
  }

  if (nameValue.length < MIN_NAME_LENGTH) {
    showNotification('error', 'Name must be at least 4 characters long.');

    return;
  }

  if (ageValue < MIN_AGE || ageValue > MAX_AGE) {
    showNotification('error', 'Age must be between 18 and 90.');

    return;
  }

  // Create new employee row and add to table
  const newEmployee = createNewEmployee(
    nameValue,
    positionValue,
    selectedOffice,
    ageValue,
    salaryValue,
  );

  // Notify user of successful form submission
  showNotification('success', 'Form submitted successfully!');
  tableBody.append(newEmployee);

  // Reset the form fields
  form.reset();
}

// Creates a new employee row with the provided data
function createNewEmployee(employeName, position, office, age, salary) {
  const tableRow = document.createElement('tr');

  // Format salary as currency
  const formattedSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Create an array of table data and loop through it
  const tableData = [employeName, position, office, age, formattedSalary];

  tableData.forEach((dataText) => {
    const td = document.createElement('td');

    td.innerText = dataText; // Insert each piece of data into the cell
    tableRow.append(td);
  });

  return tableRow;
}

// Creates a label element with the provided text and data attribute
function createLabel(text, data) {
  const label = document.createElement('label');

  label.setAttribute('data-qa', data);
  label.innerHTML = `${text}&nbsp`; // Add a non-breaking space after the text

  return label;
}

// Creates an input element with the provided name and type
function createInput(inputName, InputType) {
  const input = document.createElement('input');

  input.setAttribute('name', inputName);
  input.setAttribute('type', InputType);
  input.setAttribute('required', ''); // Make the input field required

  return input;
}

// Creates a select element with options
function createSelect(options) {
  const select = document.createElement('select');

  select.setAttribute('required', ''); // Make the select field required

  // Add city options to the select dropdown
  options.forEach((city) => {
    const option = document.createElement('option');

    option.textContent = city;
    option.value = city;
    select.append(option);
  });

  return select;
}

// Creates a submit button for the form
function createSubButton(formId, text) {
  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.setAttribute('form', formId);
  button.innerText = text;

  return button;
}

// Handles sorting of the table when a header is clicked
function handleSort(e) {
  const clickedHeader = e.target;

  if (clickedHeader.tagName !== 'TH') {
    return; // Exit if the clicked element is not a table header
  }

  // Remove any sorting state from other columns
  [...table.querySelectorAll('th')].forEach((header) => {
    if (header !== clickedHeader) {
      delete header.dataset[DATA_STATE];
    }
  });

  const columnIndex = clickedHeader.cellIndex;
  const currentState = clickedHeader.dataset[DATA_STATE] || DESCENDING;
  const newState = currentState === ASCENDING ? DESCENDING : ASCENDING;

  clickedHeader.dataset[DATA_STATE] = newState;

  // Sort the rows based on the column index and new state
  const sortedRows = getSortedRows(columnIndex, newState);

  // Reorder rows in the table body
  tableBody.append(...sortedRows);
}

/**
 * Handles the row selection logic for a table.
 * @param {Event} e - The event object from the click event.
 */
function selectRow(e) {
  const activedRow = document.querySelector('.active');
  const clickedRow = e.target.closest('tr');

  if (!clickedRow || !tableBody.contains(clickedRow)) {
    return;
  }

  // Remove highlight from the previously selected row
  if (activedRow) {
    activedRow.removeAttribute('class');
  }

  // Add highlight to the clicked row
  clickedRow.classList.add('active');
}

/**
 * Sorts table rows based on the given column index and order.
 * @param {number} columnIndex - The index of the column to sort by.
 * @param {string} order - The sorting order ('asc' or 'desc').
 * @returns {HTMLTableRowElement[]} - The sorted rows.
 */
function getSortedRows(columnIndex, order) {
  const rows = Array.from(tableBody.rows);

  return rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].innerText.trim();
    const cellB = rowB.cells[columnIndex].innerText.trim();

    return order === ASCENDING
      ? cellA.localeCompare(cellB, undefined, { numeric: true })
      : cellB.localeCompare(cellA, undefined, { numeric: true });
  });
}

// Function to show notifications on the screen
function showNotification(type, message) {
  const notification = document.createElement('div');
  const span = document.createElement('span');

  notification.setAttribute('data-qa', 'notification');

  span.innerText = type === 'error' ? 'Error!' : 'Success!';
  notification.classList.add('notification', type);
  span.classList.add('title');
  notification.append(span);
  notification.append(message);

  document.body.append(notification);

  // Remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Handles inline editing of table cells when double-clicked
function editCell(e) {
  const existingInput = document.querySelector('.cell-input');

  if (existingInput) {
    finishEditing(existingInput); // Finish any ongoing editing
  }

  const cell = e.target;

  if (cell.tagName !== 'TD') {
    return; // Exit if the clicked element isn't a table cell
  }

  const originalValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalValue;
  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();

  // Save changes when losing focus or pressing Enter
  input.addEventListener('blur', () => finishEditing(input));

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      finishEditing(input);
    }
  });

  // Finalize the editing process
  function finishEditing(currentInput) {
    const newValue = currentInput.value.trim();

    cell.innerText = newValue || originalValue;
  }
}
