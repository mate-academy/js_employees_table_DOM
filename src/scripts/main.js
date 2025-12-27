'use strict';

const NOTIFICATION_DISPLAY_DURATION = 2000;

const table = document.querySelector('table');

if (!table) {
  throw new Error('Table element not found');
}

const tbody = table.querySelector('tbody');

if (!tbody) {
  throw new Error('Table body element not found');
}

// #region Employee Form
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

const cities = {
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  london: 'London',
  'new-york': 'New York',
  edinburgh: 'Edinburgh',
  'san-francisco': 'San Francisco',
};

const employeeFormFields = [
  { name: 'name', elementType: 'input', type: 'text' },
  { name: 'position', elementType: 'input', type: 'text' },
  {
    name: 'office',
    elementType: 'select',
    options: Object.keys(cities),
  },
  { name: 'age', elementType: 'input', type: 'number' },
  { name: 'salary', elementType: 'input', type: 'number' },
];

for (const fieldConfig of employeeFormFields) {
  const label = document.createElement('label');

  label.textContent = `${fieldConfig.name.charAt(0).toUpperCase() + fieldConfig.name.slice(1)}: `;

  if (fieldConfig.elementType === 'input') {
    const input = document.createElement('input');

    input.setAttribute('name', fieldConfig.name);
    input.setAttribute('type', fieldConfig.type);
    // input.setAttribute('required', '');
    input.setAttribute('placeholder', `Enter ${fieldConfig.name}`);
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('data-qa', fieldConfig.name);

    label.appendChild(input);
  } else if (fieldConfig.elementType === 'select') {
    const select = document.createElement('select');

    select.setAttribute('name', fieldConfig.name);
    select.setAttribute('data-qa', fieldConfig.name);

    for (const optionKey of fieldConfig.options) {
      const option = document.createElement('option');

      option.setAttribute('value', optionKey);
      option.textContent = cities[optionKey];
      select.appendChild(option);
    }

    label.appendChild(select);
  }

  employeeForm.appendChild(label);
}

const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Save to table';

employeeForm.appendChild(submitButton);

employeeForm.addEventListener('submit', (formSubmitEvent) => {
  formSubmitEvent.preventDefault();

  const formData = new FormData(employeeForm);
  const employeeData = {};

  for (const [key, value] of formData.entries()) {
    employeeData[key] = value;
  }

  const newRow = document.createElement('tr');

  const validateValue = (key, value) => {
    if (!value) {
      return [
        false,
        `${key.charAt(0).toUpperCase() + key.slice(1)} is required!`,
      ];
    }

    if (key === 'name' && value.length < 4) {
      return [false, 'Name must be at least 4 characters long'];
    }

    if (key === 'age' && (value < 18 || value > 90)) {
      return [false, 'Age must be between 18 and 90'];
    }

    return [true, null];
  };

  const transformValue = (key, value) => {
    switch (key) {
      case 'salary':
        return `$${Number(value).toLocaleString('en-US')}`;
      case 'office':
        return cities[value];
      default:
        return value;
    }
  };

  for (const fieldConfig of employeeFormFields) {
    const [, error] = validateValue(
      fieldConfig.name,
      employeeData[fieldConfig.name],
    );

    if (error) {
      createNotification('Validation Error', error, 'error');

      return;
    }

    const cell = document.createElement('td');

    cell.textContent = transformValue(
      fieldConfig.name,
      employeeData[fieldConfig.name],
    );

    newRow.appendChild(cell);
  }

  table.querySelector('tbody').appendChild(newRow);

  createNotification('Success', 'New employee added successfully', 'success');

  employeeForm.reset();
});

/**
 * Creates and displays a notification message.
 * @param {string} title The notification title.
 * @param {string} description The notification message.
 * @param {'success' | 'error'} type The type of notification.
 */
function createNotification(title, description, type = 'success') {
  const alertBox = document.createElement('div');

  alertBox.classList.add('notification', `${type}`);
  alertBox.setAttribute('data-qa', 'notification');

  const alertTitle = document.createElement('h2');

  alertTitle.classList.add('title');
  alertTitle.textContent = title;

  const alertDescription = document.createElement('p');

  alertDescription.textContent = description;

  alertBox.appendChild(alertTitle);
  alertBox.appendChild(alertDescription);

  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.style.visibility = 'hidden';
  }, NOTIFICATION_DISPLAY_DURATION);
}

document.body.append(employeeForm);

// #endregion Employee Form

// #region Sorting Table
const headers = table.querySelectorAll('th');

let currentSortState = { columnIndex: null, isAscending: true };

headers.forEach((header, index) => {
  header.style.cursor = 'pointer';

  header.addEventListener('click', () => {
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    if (currentSortState.columnIndex === index) {
      currentSortState.isAscending = !currentSortState.isAscending;
    } else {
      currentSortState = { columnIndex: index, isAscending: true };
    }

    rowsArray.sort((rowA, rowB) => {
      const cellsA = rowA.querySelectorAll('td');
      const cellsB = rowB.querySelectorAll('td');
      const cellA = cellsA[index]?.textContent.trim() ?? '';
      const cellB = cellsB[index]?.textContent.trim() ?? '';

      const parseValue = (value) => {
        const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));

        return isNaN(numericValue) ? value : numericValue;
      };

      const parsedA = parseValue(cellA);
      const parsedB = parseValue(cellB);

      if (typeof parsedA === 'number' && typeof parsedB === 'number') {
        return currentSortState.isAscending
          ? parsedA - parsedB
          : parsedB - parsedA;
      }

      return currentSortState.isAscending
        ? parsedA.toString().localeCompare(parsedB.toString())
        : parsedB.toString().localeCompare(parsedA.toString());
    });

    tbody.innerHTML = '';

    rowsArray.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});

// #endregion Sorting Table

// #region Select row

table.addEventListener('click', (clickEvent) => {
  const clickedRow = clickEvent.target.closest('tr');

  if (!clickedRow || !tbody.contains(clickedRow)) {
    return;
  }

  const previouslySelectedRow = tbody.querySelector('tr.active');

  if (previouslySelectedRow) {
    previouslySelectedRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

// #endregion Select row

// #region Cell Editing

let activeInputField = null;

table.addEventListener('dblclick', (dblClickEvent) => {
  const clickedCell = dblClickEvent.target.closest('td');

  if (!clickedCell || activeInputField) {
    return;
  }

  const originalValue = clickedCell.textContent;
  const inputField = document.createElement('input');

  inputField.type = 'text';
  inputField.value = originalValue;
  inputField.classList.add('cell-input');

  clickedCell.textContent = '';
  clickedCell.appendChild(inputField);
  inputField.focus();

  activeInputField = inputField;

  const saveChanges = () => {
    const newValue = inputField.value.trim();

    if (newValue) {
      clickedCell.textContent = newValue;
      createNotification('Success', 'Cell updated successfully', 'success');
    } else {
      clickedCell.textContent = originalValue;
      createNotification('Error', 'Cell value cannot be empty', 'error');
    }

    activeInputField = null;
  };

  inputField.addEventListener('blur', saveChanges);

  inputField.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveChanges();
    } else if (keyEvent.key === 'Escape') {
      inputField.removeEventListener('blur', saveChanges);

      clickedCell.textContent = originalValue;
      activeInputField = null;
    }
  });
});

// #endregion Cell Editing
