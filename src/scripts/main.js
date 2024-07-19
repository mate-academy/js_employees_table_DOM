'use strict';

const NOTIFICATIONS = {
  WARNING_NAME_REQUIRED: {
    title: 'Warning',
    message: 'Name field is required.',
    type: 'warning',
  },
  WARNING_AGE_REQUIRED: {
    title: 'Warning',
    message: 'Age field is required.',
    type: 'warning',
  },
  WARNING_POSITION_REQUIRED: {
    title: 'Warning',
    message: 'Position field is required.',
    type: 'error',
  },
  WARNING_SALARY_REQUIRED: {
    title: 'Warning',
    message: 'Salary field is required.',
    type: 'warning',
  },
  WARNING_OFFICE_REQUIRED: {
    title: 'Warning',
    message: 'Office field is required.',
    type: 'warning',
  },
  ERROR_SHORT_NAME: {
    title: 'Short name',
    message: 'Name must be at least 4 letters long.',
    type: 'error',
  },
  ERROR_INCORRECT_AGE: {
    title: 'Incorrect age',
    message: 'Age must be between 18 and 90.',
    type: 'error',
  },
  ERROR_NEGATIVE_SALARY: {
    title: 'Invalid Salary',
    message: 'Salary cannot be negative.',
    type: 'error',
  },
  SUCCESS_NEW_EMPLOYEE: {
    title: 'Success',
    message: 'New employee added successfully.',
    type: 'success',
  },
};

const inputFields = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office:',
    name: 'office',
    type: 'select',
    qa: 'office',
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
    label: 'Age:',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

/**********************
 ****** SORTING *******
 *********************/

const tableBody = document.querySelector('tbody');
const tableHeaders = [...document.querySelectorAll('thead th')].map(
  (th) => th.textContent,
);
const sortState = {};

function getTableBodyRows() {
  return document.querySelectorAll('tbody tr');
}

document.querySelectorAll('thead th').forEach((header) => {
  sortState[header.textContent] = 'ASC';

  header.addEventListener('click', (e) => {
    const tBodyRows = getTableBodyRows();

    const headerText = e.target.textContent;
    const mappedRows = mapData(tBodyRows, tableHeaders);
    const sortedRows = sortData(mappedRows, headerText, sortState[headerText]);

    for (const key in sortState) {
      if (key === headerText) {
        sortState[key] = sortState[key] === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortState[key] = 'ASC';
      }
    }

    tableBody.innerHTML = '';

    insertSortedRows(sortedRows);
    selectRow();
    getTableBodyRows().forEach(makeCellsEditable);
  });
});

function mapData(rows, headers) {
  return [...rows].map((row) => {
    const rowData = {};

    [...row.cells].forEach((cell, index) => {
      const header = headers[index];

      rowData[header] = cell.textContent;
    });

    return rowData;
  });
}

function sortData(data, header, direction) {
  const isSalaryColumn = header === 'Salary';

  return data.sort((rowA, rowB) => {
    let valueA, valueB;

    if (isSalaryColumn) {
      valueA = rowA[header].replace('$', '').replace(',', '');
      valueB = rowB[header].replace('$', '').replace(',', '');
    } else {
      valueA = rowA[header];
      valueB = rowB[header];
    }

    if (direction === 'ASC') {
      return isSalaryColumn ? valueA - valueB : valueA.localeCompare(valueB);
    } else {
      return isSalaryColumn ? valueB - valueA : valueB.localeCompare(valueA);
    }
  });
}

function insertSortedRows(data) {
  for (const row of data) {
    const tr = document.createElement('tr');

    for (const key in row) {
      const td = document.createElement('td');

      td.textContent = row[key];

      tr.appendChild(td);
    }

    tableBody.appendChild(tr);
  }
}

/*********************
 ***** SELECT ROW ****
 ********************/

function selectRow() {
  const tBodyRows = getTableBodyRows();

  tBodyRows.forEach((row) => {
    row.addEventListener('click', () => {
      const isActive = row.classList.contains('active');

      getTableBodyRows().forEach((r) => r.classList.remove('active'));

      if (!isActive) {
        row.classList.add('active');
      }
    });
  });
}

/*******************
 ****** FORM *******
 ******************/

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

inputFields.forEach((field) => {
  const { label: labelText, name: inputName, type, qa } = field;

  const label = document.createElement('label');

  label.textContent = labelText + ' ';

  if (type === 'select') {
    const select = document.createElement('select');

    select.name = inputName;
    select.setAttribute('data-qa', qa);
    select.required = true;

    field.options.forEach((option) => {
      const item = document.createElement('option');

      item.value = option;
      item.textContent = option;
      select.appendChild(item);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.name = inputName;
    input.type = type;
    input.setAttribute('data-qa', qa);
    input.required = true;
    label.appendChild(input);
  }

  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
submitButton.addEventListener('click', addNewEmployee);

form.appendChild(submitButton);

document.body.appendChild(form);

// add new employee to the table
function addNewEmployee(e) {
  e.preventDefault();

  // Validation
  const employeeName = form.querySelector('input[name="name"]').value;
  const age = parseInt(form.querySelector('input[name="age"]').value, 10);
  const position = document.querySelector('input[name="position"]').value;
  const office = document.querySelector('select[name="office"]').value;
  const salaryValue = document.querySelector('input[name="salary"]').value;

  if (!employeeName) {
    const { title, message, type } = NOTIFICATIONS.WARNING_NAME_REQUIRED;

    pushNotification(10, 10, title, message, type);

    return;
  }

  if (!position) {
    const { title, message, type } = NOTIFICATIONS.WARNING_POSITION_REQUIRED;

    pushNotification(10, 10, title, message, type);

    return;
  }

  if (!office) {
    const { title, message, type } = NOTIFICATIONS.WARNING_OFFICE_REQUIRED;

    pushNotification(10, 10, title, message, type);

    return;
  }

  if (!age) {
    const { title, message, type } = NOTIFICATIONS.WARNING_AGE_REQUIRED;

    pushNotification(10, 10, title, message, type);

    return;
  }

  if (!salaryValue) {
    const { title, message, type } = NOTIFICATIONS.WARNING_SALARY_REQUIRED;

    pushNotification(10, 10, title, message, type);

    return;
  }

  if (employeeName.length < 4) {
    const { title, message, type } = NOTIFICATIONS.ERROR_SHORT_NAME;

    pushNotification(10, 10, title, message, type);

    return;
  }

  if (age < 18 || age > 90) {
    const { title, message, type } = NOTIFICATIONS.ERROR_INCORRECT_AGE;

    pushNotification(10, 10, title, message, type);

    return;
  }

  const salary = parseFloat(salaryValue);

  if (salary < 0) {
    const { title, message, type } = NOTIFICATIONS.ERROR_NEGATIVE_SALARY;

    pushNotification(10, 10, title, message, type);

    return;
  }

  const inputs = form.querySelectorAll('input, select');
  const newRow = document.createElement('tr');

  newRow.addEventListener('click', () => {
    const isActive = newRow.classList.contains('active');

    getTableBodyRows().forEach((r) => r.classList.remove('active'));

    if (!isActive) {
      newRow.classList.add('active');
    }
  });

  inputs.forEach((input) => {
    const newCell = document.createElement('td');

    newCell.textContent =
      input.name === 'salary' ? formatSalary(input.value) : input.value;
    newRow.appendChild(newCell);
  });

  tableBody.appendChild(newRow);
  makeCellsEditable(newRow);
  form.reset();

  const {
    title: successTitle,
    message: successMessage,
    type: successType,
  } = NOTIFICATIONS.SUCCESS_NEW_EMPLOYEE;

  pushNotification(10, 10, successTitle, successMessage, successType);
}

function formatSalary(value) {
  return `$${parseInt(value).toLocaleString()}`;
}

// notifications
function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h3');
  const descriptionElement = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  titleElement.className = 'title';
  titleElement.textContent = title;

  descriptionElement.textContent = description;

  notification.appendChild(titleElement);
  notification.appendChild(descriptionElement);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// edit
function makeCellsEditable(row) {
  row.querySelectorAll('td').forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      const initialText = cell.textContent;
      const isSalaryCell = cell.cellIndex === 4;
      const computedStyle = window.getComputedStyle(cell);
      const cellWidth = parseInt(computedStyle.width, 10);

      const input = document.createElement('input');

      cell.textContent = '';
      input.type = 'text';
      input.className = 'cell-input';

      input.value = isSalaryCell
        ? initialText.replace(/[$,]/g, '')
        : initialText;
      input.style.width = `${cellWidth}px`;
      input.style.boxSizing = 'border-box';

      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        return finalizeEdit(cell, initialText, isSalaryCell);
      });

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          finalizeEdit(cell, initialText, isSalaryCell);
        }
      });
    });
  });
}

function finalizeEdit(cell, initialText, isSalaryCell) {
  const activeInput = cell.querySelector('.cell-input');

  if (!activeInput) {
    return;
  }

  let newValue = activeInput.value.trim();

  if (cell.cellIndex === 3 && !isValidAge(activeInput.value)) {
    newValue = initialText;
  } else if (isSalaryCell) {
    const numericValue = parseInt(newValue, 10);

    newValue =
      isNaN(numericValue) || numericValue < 0
        ? initialText
        : `$${numericValue.toLocaleString()}`;
  } else {
    newValue = newValue || initialText;
  }

  cell.textContent = newValue;
}

function isValidAge(age) {
  const ageNumber = parseInt(age, 10);

  return /^[0-9]+$/.test(age) && ageNumber >= 18 && ageNumber <= 90;
}

getTableBodyRows().forEach(makeCellsEditable);
selectRow();
