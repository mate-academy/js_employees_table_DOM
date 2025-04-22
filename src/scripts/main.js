'use strict';

// write code here
const MIN_AGE = 18;
const MAX_AGE = 90;
const NOTIFICATION_TIMEOUT = 2000;

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const employeeForm = document.createElement('form');
const submitButton = document.createElement('button');
let lastSortedColumnIndex = null;
let activeTableRow = null;

employeeForm.classList.add('new-employee-form');

const formFields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  {
    label: 'office',
    name: 'office',
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

  {
    label: 'Age',
    name: 'age',
    type: 'number',
    min: 1,
  },

  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    min: 0,
  },
];

formFields.forEach((field) => {
  const fieldLabel = document.createElement('label');

  fieldLabel.textContent = `${field.label}: `;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((optionValue) => {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;

      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');

    if (field.min !== undefined) {
      input.setAttribute('min', field.min);
    }
  }

  input.setAttribute('name', field.name);
  input.setAttribute('type', field.type);
  input.setAttribute('data-qa', field.name);

  fieldLabel.appendChild(input);

  employeeForm.appendChild(fieldLabel);
});

submitButton.textContent = 'Save to table';

employeeForm.appendChild(submitButton);

document.body.appendChild(employeeForm);

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = Array.from(e.target.elements).reduce((data, element) => {
    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
      data[element.name] = isNaN(element.value)
        ? element.value
        : parseInt(element.value);
    }

    return data;
  }, {});

  if (!validateForm(formData)) {
    return;
  }

  pushNotification('success', 'Form submitted successfully');

  addRowToTable(formData);
});

function parseCellValue(row, index) {
  const cells = row.querySelectorAll('td');

  if (!cells.length) {
    return '';
  }

  const cleanedCell = cells[index].textContent.trim().replace(/[$,]/g, '');

  return isNaN(cleanedCell) ? cleanedCell : parseInt(cleanedCell);
}

tableHeader.addEventListener('click', (e) => {
  const clickedCell = e.target.closest('th');

  if (!clickedCell) {
    return;
  }

  const columnIndex = clickedCell.cellIndex;
  const tableRows = [...document.querySelectorAll('tbody tr')];
  const tbody = document.querySelector('tbody');

  if (lastSortedColumnIndex !== columnIndex) {
    tableRows.sort((row1, row2) => {
      const value1 = parseCellValue(row1, columnIndex);
      const value2 = parseCellValue(row2, columnIndex);

      if (typeof value1 === 'number' && typeof value2 === 'number') {
        return value1 - value2;
      }

      if (typeof value1 === 'string' && typeof value2 === 'string') {
        return value1.localeCompare(value2);
      }
    });

    lastSortedColumnIndex = columnIndex;
  } else {
    tableRows.reverse();
  }

  tableRows.forEach((rowData) => {
    tbody.appendChild(rowData);
  });
});

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow || activeTableRow === clickedRow) {
    return;
  }

  if (activeTableRow) {
    activeTableRow.classList.remove('active');
  }

  activeTableRow = clickedRow;
  activeTableRow.classList.add('active');
});

function pushNotification(type, message) {
  const notificationBlock = document.createElement('div');
  const title = document.createElement('h1');
  const phrase = document.createElement('p');

  notificationBlock.setAttribute('data-qa', 'notification');
  notificationBlock.className = `notification ${type}`;
  title.textContent = type[0].toUpperCase() + type.slice(1);
  phrase.textContent = message[0].toUpperCase() + message.slice(1);

  notificationBlock.appendChild(title);
  notificationBlock.appendChild(phrase);
  document.body.appendChild(notificationBlock);

  setTimeout(() => {
    notificationBlock.style.visibility = 'hidden';
  }, NOTIFICATION_TIMEOUT);
}

function validateForm(formData) {
  if (
    !formData.name ||
    !formData.position ||
    !formData.age ||
    !formData.salary
  ) {
    pushNotification('error', 'Each field must be filled in');

    return false;
  }

  if (formData.name.length < 4) {
    pushNotification('error', 'Name must be no shorter than 4');

    return false;
  }

  if (formData.age < MIN_AGE || formData.age > MAX_AGE) {
    pushNotification('error', 'Age must be between 18 and 90');

    return false;
  }

  return true;
}

function addRowToTable(data) {
  const newRow = document.createElement('tr');

  Object.entries(data).forEach(([key, value]) => {
    const newCell = document.createElement('td');

    newCell.textContent =
      key === 'salary' ? `$${value.toLocaleString()}` : value;

    newRow.appendChild(newCell);
  });

  tableBody.appendChild(newRow);
}

tableBody.addEventListener('dblclick', (e) => {
  const clickedCell = e.target.closest('td');
  const originalValue = clickedCell.textContent;
  const cellInput = document.createElement('input');

  cellInput.classList.add('cell-input');
  clickedCell.textContent = '';
  cellInput.value = originalValue;
  clickedCell.appendChild(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', (inputEvent) => {
    clickedCell.textContent = cellInput.value;
  });

  cellInput.addEventListener('keypress', (inputEvent) => {
    if (inputEvent.key === 'Enter') {
      cellInput.blur();
    }
  });
});
