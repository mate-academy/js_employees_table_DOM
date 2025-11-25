'use strict';

// write code here
const table = document.querySelector('table');

if (!table) {
  throw new Error('Table element is missing in the document.');
}

const headerCells = table.querySelectorAll('thead th');
const body = table.querySelector('tbody');

function sortTable() {
  const sortingState = {
    column: null,
    direction: 'asc',
  };
  const castValue = (value) => {
    const trimmed = value.trim();

    if (trimmed.startsWith('$')) {
      return Number(trimmed.replace(/[$,]/g, ''));
    }

    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }

    return trimmed.toLowerCase();
  };

  const compareValues = (a, b) => {
    if (a === b) {
      return 0;
    }

    return a > b ? 1 : -1;
  };

  const sortRows = () => {
    const rows = Array.from(body.querySelectorAll('tr'));

    rows
      .sort((rowA, rowB) => {
        const cellA = rowA.cells[sortingState.column].textContent;
        const cellB = rowB.cells[sortingState.column].textContent;

        const valueA = castValue(cellA);
        const valueB = castValue(cellB);
        const comparison = compareValues(valueA, valueB);

        return sortingState.direction === 'asc' ? comparison : -comparison;
      })
      .forEach((row) => {
        body.appendChild(row);
      });
  };

  const handleHeaderClick = (columnIndex) => {
    if (sortingState.column === columnIndex) {
      sortingState.direction =
        sortingState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortingState.column = columnIndex;
      sortingState.direction = 'asc';
    }

    sortRows();
  };

  headerCells.forEach((headerCell, index) => {
    headerCell.addEventListener('click', () => handleHeaderClick(index));
  });
}

function selectRow() {
  body.addEventListener('click', (evnt) => {
    const targetRow = evnt.target.closest('tr');

    if (!targetRow) {
      return;
    }

    const rows = Array.from(body.querySelectorAll('tr'));

    rows.forEach((row) => {
      row.classList.remove('active');
    });

    targetRow.classList.add('active');
  });
}

function createForm() {
  const formData = [
    {
      field: 'input',
      name: 'name',
      type: 'text',
    },
    {
      field: 'input',
      name: 'position',
      type: 'text',
    },
    {
      field: 'select',
      name: 'office',
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
      field: 'input',
      name: 'age',
      type: 'number',
    },
    {
      field: 'input',
      name: 'salary',
      type: 'number',
    },
  ];
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  formData.forEach((field) => {
    const labelElement = document.createElement('label');
    const fieldName = field.name;
    const capitalizedName =
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1);

    labelElement.innerText = capitalizedName + ':';

    let inputElement;

    if (field.field === 'input') {
      inputElement = document.createElement('input');
      inputElement.type = field.type;
    }

    if (field.field === 'select') {
      inputElement = document.createElement('select');

      field.options.forEach((optionValue) => {
        const option = document.createElement('option');

        option.value = optionValue;
        option.textContent = optionValue;
        inputElement.appendChild(option);
      });
    }

    inputElement.name = fieldName;
    inputElement.dataset.qa = fieldName;
    inputElement.required = true;
    labelElement.appendChild(inputElement);
    form.appendChild(labelElement);
  });

  const button = document.createElement('button');

  button.type = 'submit';
  button.innerText = 'Save to table';
  form.appendChild(button);

  table.after(form);
}

function validateForm() {
  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(form);
    const errors = validateFormData(formData);
    let row = '';

    if (errors.length) {
      showNotifications('error', errors);

      return;
    }

    for (const [fieldName, value] of formData) {
      if (fieldName === 'salary') {
        row += `<td>$${value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>`;
      } else {
        row += `<td>${value}</td>`;
      }
    }

    const tr = document.createElement('tr');

    tr.innerHTML = row;
    body.appendChild(tr);
    showNotifications('success', [{ message: 'Success' }]);
  });
}

function validateFormData(data) {
  const errors = [];

  for (const [fieldName, rawValue] of data.entries()) {
    const value = String(rawValue).trim();
    const errorMessage = getFieldError(fieldName, value);

    if (errorMessage) {
      errors.push({ fieldName, value, message: errorMessage });
    }
  }

  return errors;
}

function getFieldError(fieldName, value) {
  switch (fieldName) {
    case 'name':
      if (value.length < 4) {
        return 'The name should be more than 3 symbols';
      }
      break;

    case 'age':
      const age = Number(value);

      if (age < 18 || age > 90) {
        return 'Age must be between 18 and 90 years old.';
      }
      break;

    case 'position':
      if (!value || value.length === 0) {
        return 'You should enter position';
      }
      break;

    case 'salary':
      if (!value || value.length === 0) {
        return 'You should enter salary';
      }
      break;
  }

  return null;
}

function showNotifications(type, errors) {
  errors.forEach(({ message }) => {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  });
}

sortTable();
selectRow();
createForm();
validateForm();
