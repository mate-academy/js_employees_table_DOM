'use strict';

const table = document.querySelector('table');
const tableHead = table.tHead;
const tableBody = table.tBodies[0];

const sortingParams = {
  name: '',
  direction: '',
  colIndex: null,
};

const parsers = {
  default: (val) => val.trim().toLowerCase(),
  age: (val) => +val,
  salary: (val) => salaryToNum(val),
};

const sortDirections = {
  ASC: (a, b) => (a > b ? 1 : a < b ? -1 : 0),
  DESC: (a, b) => (b > a ? 1 : b < a ? -1 : 0),
};

tableHead.rows[0].addEventListener('click', (e) => {
  const targetEl = e.target;
  const colIndex = [...targetEl.parentElement.cells].indexOf(targetEl);

  if (targetEl.tagName === 'TH' && colIndex !== -1) {
    const value = targetEl.textContent.toLowerCase();

    sortingParams.direction =
      sortingParams.name !== value ||
      !sortingParams.direction ||
      sortingParams.direction === 'DESC'
        ? 'ASC'
        : 'DESC';
    sortingParams.name = value;
    sortingParams.colIndex = colIndex;

    sortTable(tableBody, ...Object.values(sortingParams));
  }
});

tableBody.addEventListener('click', (e) => {
  const activeRow = e.target.closest('tr');

  if (activeRow) {
    const tableRows = [...tableBody.rows];

    tableRows.forEach((row) => {
      row.classList.remove('active');
    });

    activeRow.classList.add('active');
  }
});

function sortTable(tableBodyParam, sortingVal, sortDirection, colIndex) {
  const tableRows = [...tableBodyParam.rows];
  const parser = parsers[sortingVal] || parsers.default;
  const sortFunc = sortDirections[sortDirection];

  tableRows
    .sort((rowA, rowB) => {
      return sortFunc(
        parser(cellText(rowA, colIndex)),
        parser(cellText(rowB, colIndex)),
      );
    })
    .forEach((row) => tableBodyParam.append(row));
}

function cellText(row, index) {
  return [...row.children][index].textContent.trim();
}

function salaryToNum(salary) {
  return parseInt(salary.replace(/[^\d]/g, ''), 10);
}

const fields = {
  name: {
    type: 'text',
  },

  position: {
    type: 'text',
  },

  office: {
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },

  age: {
    type: 'number',
  },

  salary: {
    type: 'number',
  },
};

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  for (const field in fields) {
    const label = document.createElement('label');

    label.textContent = `${field[0].toUpperCase() + field.slice(1)}: `;

    if (fields[field].type) {
      const input = document.createElement('input');

      input.name = field;
      input.type = fields[field].type;
      input.dataset.qa = field;
      input.required = field !== 'position';

      label.append(input);
    }

    if (fields[field].options) {
      const select = document.createElement('select');

      select.name = field;
      select.dataset.qa = field;
      select.required = true;

      for (const option of fields[field].options) {
        const optionEl = new Option(option, option);

        select.append(optionEl);
      }

      label.append(select);
    }

    form.append(label);
  }

  const saveBtn = document.createElement('button');

  saveBtn.type = 'submit';
  saveBtn.textContent = 'Save to table';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm(form)) {
      const formData = new FormData(form);

      appendTableRow(tableBody, [...formData.entries()]);

      form.reset();

      showNotification('success', 'Success', `Row has been added`);
    }
  });

  form.append(saveBtn);

  document.body.append(form);
}

createForm();

const MIN_NAME_LENGTH = 4;
const MIN_AGE_VALUE = 18;
const MAX_AGE_VALUE = 90;
const MIN_POSITION_LENGTH = 5;

function validateForm(form) {
  const nameValue = form.elements['name'].value;
  const ageValue = form.elements['age'].value;
  const positionValue = form.elements['position'].value;

  if (nameValue.length < MIN_NAME_LENGTH) {
    showNotification(
      'error',
      'Validation Error',
      `Name must contains more than ${MIN_NAME_LENGTH} symbols`,
    );

    return false;
  }

  if (+ageValue < MIN_AGE_VALUE || +ageValue > MAX_AGE_VALUE) {
    showNotification(
      'error',
      'Validation Error',
      `Age must be between ${MIN_AGE_VALUE} and ${MAX_AGE_VALUE}`,
    );

    return false;
  }

  if (positionValue.length < MIN_POSITION_LENGTH) {
    showNotification(
      'error',
      'Validation Error',
      `Position must contains more than ${MIN_POSITION_LENGTH} symbols`,
    );

    return false;
  }

  return true;
}

function showNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  const notificationTitle = document.createElement('h2');

  notificationTitle.textContent = title;
  notificationTitle.className = 'title';

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;

  notification.append(notificationTitle, notificationDescription);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 6000);
}

function numToSalary(num) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

const renderFormat = {
  default: (val) => val,
  salary: (val) => numToSalary(val),
};

function appendTableRow(tableBodyParam, data) {
  const tableRow = document.createElement('tr');

  for (const [key, value] of data) {
    const cell = document.createElement('td');
    const format = renderFormat[key] || renderFormat.default;

    cell.textContent = format(value);
    tableRow.append(cell);
  }

  tableBodyParam.append(tableRow);
}

let activeCell = null;

tableBody.addEventListener('dblclick', (e) => {
  const target = e.target;

  if (target.tagName === 'TD') {
    if (!activeCell || activeCell !== target) {
      activeCell = target;
    }
    activeCell.dataset.previous = target.textContent;

    const cellIndex = [...target.parentElement.cells].indexOf(target);
    const colName = [...tableHead.rows[0].cells][cellIndex].textContent
      .trim()
      .toLowerCase();

    target.innerHTML = `<input type="${fields[colName].type || 'text'}" name="${colName}">`;

    const input = target.querySelector('input');

    input.focus();

    const format = renderFormat[colName] || renderFormat.default;

    input.addEventListener('blur', (ev) => {
      changeCellValue(
        ev.target.value,
        target,
        colName,
        activeCell.dataset.previous,
        format,
      );
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        changeCellValue(
          ev.target.value,
          target,
          colName,
          activeCell.dataset.previous,
          format,
        );
      }
    });
  }
});

const validators = {
  name: {
    isValid: (v) => v.length >= MIN_NAME_LENGTH,
    message: `Name must contain more than ${MIN_NAME_LENGTH} symbols`,
  },
  position: {
    isValid: (v) => v.length >= MIN_POSITION_LENGTH,
    message: `Position must contain more than ${MIN_POSITION_LENGTH} symbols`,
  },
  age: {
    isValid: (v) => +v >= MIN_AGE_VALUE && +v <= MAX_AGE_VALUE,
    message: `Age must be between ${MIN_AGE_VALUE} and ${MAX_AGE_VALUE}`,
  },
};

function changeCellValue(inputValue, cell, colName, prevValue, valueFormater) {
  const validator = validators[colName];

  if (inputValue === '') {
    cell.textContent = prevValue;

    return;
  }

  if (validator && !validator.isValid(inputValue)) {
    showNotification('error', 'Validation error', validator.message);
    cell.textContent = prevValue;

    return;
  }

  cell.textContent = valueFormater(inputValue);
}
