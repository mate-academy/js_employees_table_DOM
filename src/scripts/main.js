'use strict';

const COLUMNS = {
  NAME: 0,
  POSITION: 1,
  OFFICE: 2,
  AGE: 3,
  SALARY: 4,
};

const formatSalary = (salary) => {
  return parseInt(salary.slice(1).replace(/,/g, ''));
};

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const body = document.body;
const tableElement = document.querySelector('table');
const tbody = tableElement.querySelector('tbody');
const rows = Array.from(tbody.rows);
const headers = document.querySelectorAll('thead th');

// #region Sort table
let isDescOrder = false;
let currentSortField = null;

const setSortOrder = (newSortField) => {
  if (currentSortField !== null && currentSortField === newSortField) {
    isDescOrder = !isDescOrder;
  } else {
    isDescOrder = false;
    currentSortField = newSortField;
  }
};

function sortTable(column) {
  setSortOrder(column);

  rows.sort((a, b) => {
    const aValue = a.cells[column].textContent;
    const bValue = b.cells[column].textContent;

    const order = isDescOrder ? -1 : 1;

    switch (column) {
      case COLUMNS.AGE:
        return order * (parseInt(aValue) - parseInt(bValue));

      case COLUMNS.SALARY:
        return order * (formatSalary(aValue) - formatSalary(bValue));

      default:
        return order * aValue.localeCompare(bValue);
    }
  });

  tbody.innerHTML = '';

  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    sortTable(columnIndex);
  });
});
// #endregion

// #region Select table row
let currentSelectedRow = null;

rows.forEach(row => {
  row.addEventListener('click', () => {
    if (currentSelectedRow !== null) {
      currentSelectedRow.classList.remove('active');
    }

    if (currentSelectedRow !== row) {
      row.classList.add('active');
      currentSelectedRow = row;
    } else {
      currentSelectedRow = null;
    }
  });
});
// #endregion

// #region Create form
const formFields = [
  {
    name: 'name',
    type: 'text',
    tagName: 'input',
  },
  {
    name: 'position',
    type: 'text',
    tagName: 'input',
  },
  {
    name: 'office',
    tagName: 'select',
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
    name: 'age',
    type: 'number',
    tagName: 'input',
  },
  {
    name: 'salary',
    type: 'number',
    tagName: 'input',
  },
];

function createFormField(field) {
  const formField = document.createElement('label');

  formField.textContent = capitalize(field.name) + ':';

  const formFieldContent = document.createElement(field.tagName);

  formFieldContent.setAttribute('data-qa', field.name);
  formFieldContent.setAttribute('name', field.name);

  if (field.tagName === 'input') {
    formFieldContent.type = field.type;
  } else {
    for (const option of field.options) {
      const newOptionElement = document.createElement('option');

      newOptionElement.value = option;
      newOptionElement.textContent = option;

      formFieldContent.appendChild(newOptionElement);
    }
  }

  formField.appendChild(formFieldContent);

  return formField;
}

const formElement = document.createElement('form');

formElement.classList.add('new-employee-form');

for (const field of formFields) {
  const formFieldElement = createFormField(field);

  formElement.appendChild(formFieldElement);
}

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

formElement.appendChild(submitButton);

body.appendChild(formElement);
// #endregion
