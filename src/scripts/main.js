'use strict';

// --- DOM Elements ---
const table = document.querySelector('table');
const tableHead = table ? table.querySelector('thead') : null;
const tableBody = table ? table.querySelector('tbody') : null;

// --- State Variables ---
let sortColumnIndex = -1;
let sortDirection = 'ASC';
let selectedRow = null;

// --- Notification Function (Simple Example) ---
function showNotification(message, type) {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notificationDiv = document.createElement('div');

  notificationDiv.className = `notification ${type}`;
  notificationDiv.dataset.qa = 'notification';
  notificationDiv.textContent = message;
  // Basic styles for visibility
  notificationDiv.style.position = 'fixed';
  notificationDiv.style.top = '10px';
  notificationDiv.style.right = '10px';
  notificationDiv.style.padding = '15px';
  notificationDiv.style.border = '1px solid black';
  notificationDiv.style.borderRadius = '5px';
  notificationDiv.style.zIndex = '1000';

  notificationDiv.style.backgroundColor =
    type === 'success' ? '#d4edda' : '#f8d7da';
  notificationDiv.style.color = type === 'success' ? '#155724' : '#721c24';

  notificationDiv.style.borderColor =
    type === 'success' ? '#c3e6cb' : '#f5c6cb';
  document.body.appendChild(notificationDiv);

  setTimeout(() => {
    if (notificationDiv.parentNode) {
      notificationDiv.remove();
    }
  }, 3000);
}

// --- Form Creation ---
function createEmployeeForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const fields = [
    { label: 'Name:', name: 'name', type: 'text' },
    { label: 'Position:', name: 'position', type: 'text' },
    { label: 'Age:', name: 'age', type: 'number' },
    { label: 'Salary:', name: 'salary', type: 'number' },
  ];

  const officeOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  fields.forEach((fieldData) => {
    const label = document.createElement('label');

    label.textContent = fieldData.label + ' ';

    const input = document.createElement('input');

    input.type = fieldData.type;
    input.name = fieldData.name;
    input.dataset.qa = fieldData.name;

    if (fieldData.type === 'number') {
      input.min = '0';

      if (fieldData.name === 'age') {
        input.min = '18';
        input.max = '90';
      }
    }
    label.appendChild(input);
    form.appendChild(label);
  });

  const officeLabel = document.createElement('label');

  officeLabel.textContent = 'Office: ';

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.dataset.qa = 'office';

  officeOptions.forEach((optionText) => {
    const option = document.createElement('option');

    option.value = optionText;
    option.textContent = optionText;
    officeSelect.appendChild(option);
  });

  officeLabel.appendChild(officeSelect);
  form.appendChild(officeLabel);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  form.addEventListener('submit', handleFormSubmit);

  // Append form next to the table if possible, otherwise to body
  if (table && table.parentNode) {
    table.parentNode.insertBefore(form, table.nextSibling);
  } else {
    document.body.appendChild(form);
  }
}

// --- Add Row to Table ---
function addEmployeeToTable(employeeData) {
  if (!tableBody) {
    return;
  }

  const newRow = document.createElement('tr');
  const cellOrder = ['name', 'position', 'office', 'age', 'salary'];

  cellOrder.forEach((key) => {
    const cell = document.createElement('td');
    let value = employeeData[key];

    if (key === 'salary') {
      const salaryNumber = Number(value);

      if (!isNaN(salaryNumber)) {
        value = `$${salaryNumber.toLocaleString('en-US')}`;
      } else {
        // Attempt to format even if input wasn't strictly a number initially
        value =
          '$' +
          String(value)
            .replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    }
    cell.textContent = value;
    newRow.appendChild(cell);
  });

  newRow.addEventListener('click', handleRowClick);
  tableBody.appendChild(newRow);
}

// --- Form Submit Handler (with whitespace validation fix) ---
function handleFormSubmit(evt) {
  evt.preventDefault();

  const form = evt.target;
  const formData = new FormData(form);
  const employee = {};
  let isValid = true;
  let errorMessage = '';

  // Collect and validate required fields (trimming strings first)
  for (const [key, value] of formData.entries()) {
    const processedValue = typeof value === 'string' ? value.trim() : value;

    // Check for empty required fields using the processed value
    if (!processedValue && processedValue !== 0) {
      // Allow 0 as valid numeric input
      isValid = false;

      const fieldName = key.charAt(0).toUpperCase() + key.slice(1);

      errorMessage = `${fieldName} field is required.`;
      break; // Stop validation on first empty required field
    }
    // Assign the processed (and potentially trimmed) value
    employee[key] = processedValue;
  }

  // Proceed with further validation only if required fields are filled
  if (isValid) {
    // Name validation
    if (employee.name.length < 4) {
      isValid = false;
      errorMessage = 'Name must be at least 4 characters long.';
    }

    // Age validation (only if still valid)
    if (isValid) {
      const ageNumber = Number(employee.age);

      if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 90) {
        isValid = false;
        errorMessage = 'Age must be a number between 18 and 90.';
      }
    }

    // Salary validation (only if still valid)
    if (isValid) {
      const salaryNumber = Number(employee.salary);

      if (isNaN(salaryNumber) || salaryNumber < 0) {
        isValid = false;
        errorMessage = 'Salary must be a positive number.';
      } else {
        // Store the numeric salary for the object passed to addEmployeeToTable
        employee.salary = salaryNumber;
      }
    }
  }

  // Show notification or add data
  if (isValid) {
    addEmployeeToTable(employee);
    showNotification('Employee added successfully!', 'success');
    form.reset();
  } else {
    // Ensure an error message exists if validation failed
    if (!errorMessage) {
      errorMessage = 'Please fill all required fields correctly.';
    }
    showNotification(errorMessage, 'error');
  }
}

// --- Row Selection Handler ---
function handleRowClick(evt) {
  const clickedRow = evt.currentTarget;

  if (selectedRow && selectedRow !== clickedRow) {
    selectedRow.classList.remove('active');
  }

  clickedRow.classList.toggle('active');

  if (clickedRow.classList.contains('active')) {
    selectedRow = clickedRow;
  } else {
    selectedRow = null;
  }
}

// --- Sorting Handler ---
function handleSortClick(evt) {
  const clickedHeader = evt.target;

  // Ensure the click is on a TH within the THEAD
  if (
    clickedHeader.tagName !== 'TH' ||
    !tableBody ||
    !tableHead ||
    !tableHead.contains(clickedHeader)
  ) {
    return;
  }

  const columnIndex = clickedHeader.cellIndex;
  let newDirection = 'ASC';

  // Update sort direction logic
  if (columnIndex === sortColumnIndex) {
    newDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
  } else {
    newDirection = 'ASC'; // Default to ASC for a new column
  }

  // Update state
  sortColumnIndex = columnIndex;
  sortDirection = newDirection;

  // Perform the sort
  sortTable(columnIndex, sortDirection);
}

// --- Sorting Function ---
function sortTable(columnIndex, direction) {
  if (!tableBody) {
    return;
  }

  const rowsArray = Array.from(tableBody.rows);

  const compareRows = (rowA, rowB) => {
    const cellA = rowA.cells[columnIndex]?.textContent.trim() || '';
    const cellB = rowB.cells[columnIndex]?.textContent.trim() || '';
    let valA = cellA;
    let valB = cellB;
    const isNumericColumn = columnIndex === 3 || columnIndex === 4;

    if (isNumericColumn) {
      const cleanValA = cellA.replace(/[$,]/g, ''); // remove $ and ,
      const cleanValB = cellB.replace(/[$,]/g, '');

      valA = parseFloat(cleanValA);
      valB = parseFloat(cleanValB);

      // Handle NaN comparison gracefully for sorting
      if (isNaN(valA)) {
        valA = direction === 'ASC' ? Infinity : -Infinity;
      }

      if (isNaN(valB)) {
        valB = direction === 'ASC' ? Infinity : -Infinity;
      }
    }

    // Comparison logic
    if (valA < valB) {
      return direction === 'ASC' ? -1 : 1;
    }

    if (valA > valB) {
      return direction === 'ASC' ? 1 : -1;
    }

    return 0; // equal
  };

  rowsArray.sort(compareRows);

  // Re-append rows to tbody in sorted order
  rowsArray.forEach((row) => tableBody.appendChild(row));
}

// --- Initial Setup ---
// Create the form when the script runs
createEmployeeForm();

// Add event listeners if the table exists
if (table) {
  if (tableHead) {
    tableHead.addEventListener('click', handleSortClick);
  }

  if (tableBody) {
    // Add listener to existing rows
    Array.from(tableBody.rows).forEach((row) => {
      row.addEventListener('click', handleRowClick);
    });
    // Note: New rows added via the form get their listener
    // attached in addEmployeeToTable function.
    // Alternatively, could use event delegation on tableBody.
  }
}
