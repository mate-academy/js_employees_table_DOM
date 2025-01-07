'use strict';

const table = document.querySelector('table');

const tableHeaders = table.querySelectorAll('th');
const tbody = table.tBodies[0];
const sortDirection = Array.from(tableHeaders).map(() => 'asc');

const getFormattedSalary = (num) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(num);
};

// <-- SORTING -->
const sortTable = (columnIndex) => {
  const rows = Array.from(tbody.rows);

  const currentDirection = sortDirection[columnIndex];
  const nextDirection = currentDirection === 'asc' ? 'desc' : 'asc';

  sortDirection.fill('asc');
  sortDirection[columnIndex] = nextDirection;

  rows.sort((a, b) => {
    const valueA = a.cells[columnIndex].textContent.trim();
    const valueB = b.cells[columnIndex].textContent.trim();

    const numberA = parseFloat(valueA.replace(/[$,]/g, ''));
    const numberB = parseFloat(valueB.replace(/[$,]/g, ''));

    if (!isNaN(numberA) && !isNaN(numberB)) {
      return currentDirection === 'asc' ? numberA - numberB : numberB - numberA;
    }

    return currentDirection === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
};

// <-- ACTIVE CLASS -->
const toggleActiveClass = (row) => {
  const rows = Array.from(tbody.rows);

  rows.forEach((r) => r.classList.remove('active'));
  row.classList.toggle('active');
};

// <-- FORM -->
const form = document.createElement('form');

form.classList.add('new-employee-form');

const formInputs = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'position', label: 'Position', type: 'text' },
  {
    name: 'office',
    label: 'Office',
    type: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  { name: 'age', label: 'Age', type: 'number' },
  { name: 'salary', label: 'Salary', type: 'number' },
];

formInputs.forEach((input) => {
  const label = document.createElement('label');

  label.textContent = `${input.label}: `;

  const inputElement =
    input.type === 'select'
      ? document.createElement('select')
      : document.createElement('input');

  inputElement.name = input.name;
  inputElement.setAttribute('data-qa', input.name);

  if (input.type === 'select') {
    input.options.forEach((optionText) => {
      const option = document.createElement('option');

      option.text = optionText;
      inputElement.add(option);
    });
  } else {
    inputElement.type = input.type;
  }

  label.appendChild(inputElement);
  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.appendChild(form);

// <-- VALIDATION -->
const validateData = (value, fieldName) => {
  switch (fieldName) {
    case 'name':
      if (value.trim().length < 4) {
        return {
          type: 'error',
          message: 'Name must be at least 4 characters long',
        };
      }
      break;
    case 'age':
      if (isNaN(value) || value < 18 || value > 90) {
        return {
          type: 'error',
          message: 'Age must be between 18 and 90',
        };
      }
      break;
    case 'position':
      if (value.trim().length === 0) {
        return {
          type: 'error',
          message: 'Position cannot be empty',
        };
      }
      break;
    case 'salary':
      const salary = value.replace(/[$,]/g, '');

      if (isNaN(salary) || salary < 0) {
        return {
          type: 'error',
          message: 'Salary must be a positive number',
        };
      }
      break;
    default:
      break;
  }
};

// <-- SUBMIT FORM -->
const formSubmitHandler = (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  for (const [key, value] of formData.entries()) {
    const validationError = validateData(value, key);

    if (validationError) {
      showNotification(validationError.type, validationError.message);

      return;
    }
  }

  const salary = formData.get('salary');
  const formattedSalary = getFormattedSalary(salary);

  const newRow = document.createElement('tr');

  formData.forEach((value, key) => {
    const cell = document.createElement('td');

    if (key === 'salary') {
      cell.textContent = formattedSalary;
    } else {
      cell.textContent = value;
    }

    newRow.appendChild(cell);
  });

  tbody.appendChild(newRow);
  form.reset();

  showNotification('success', 'Employee added successfully');
};

// <-- NOTIFICATION -->
const showNotification = (type, message) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const title = document.createElement('h3');

  title.classList.add('title');
  title.textContent = message;
  notification.appendChild(title);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

// <-- EDITING -->
let currentlyEditedCell = null;

const editCell = (cell) => {
  if (currentlyEditedCell) {
    return;
  }

  const currentText = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');

  input.value = currentText;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  currentlyEditedCell = cell;

  input.addEventListener('blur', () => {
    saveCell(input);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveCell(input);
    }
  });
};

const saveCell = (input) => {
  const cell = input.parentElement;
  let newValue = input.value.trim();

  const columnIndex = Array.from(cell.parentElement.cells).indexOf(cell);
  const fieldName = tableHeaders[columnIndex].textContent.trim().toLowerCase();

  const validationError = validateData(newValue, fieldName);

  if (validationError) {
    showNotification(validationError.type, validationError.message);

    input.focus();

    return;
  }

  if (fieldName === 'salary') {
    newValue = newValue.replace(/[$,]/g, '');
    newValue = getFormattedSalary(newValue);
  }

  cell.textContent = newValue;

  currentlyEditedCell = null;
};

// <-- EVENT LISTENERS -->
tableHeaders.forEach((header, index) => {
  header.addEventListener('click', () => sortTable(index));
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  toggleActiveClass(row);
});

form.addEventListener('submit', formSubmitHandler);

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  editCell(cell);
});
