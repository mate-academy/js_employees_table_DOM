/* eslint-disable no-shadow */
'use strict';

const ACTIVE_ROW = 'active';

const body = document.body;
const table = body.querySelector('table');
const tableBody = table.querySelector('tbody');
const rows = Array.from(table.querySelectorAll('tbody tr'));

// #region sort
const headers = table.querySelectorAll('th');

headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    const isAscending = header.classList.toggle('asc');
    const dataType =
      columnIndex === 3 || columnIndex === 4 ? 'number' : 'string';

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      if (dataType === 'number') {
        const valueA = parseInt(cellA.replace(/\$/g, '').replace(/,/g, ''), 10);
        const valueB = parseInt(cellB.replace(/\$/g, '').replace(/,/g, ''), 10);

        return isAscending ? valueA - valueB : valueB - valueA;
      } else {
        return isAscending
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    const tbody = table.querySelector('tbody');

    tbody.innerHTML = '';

    sortedRows.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});
// #endregion

// #region selected TR
table.addEventListener('click', (e) => {
  const elem = e.target.closest('tbody tr');

  if (!elem) {
    return;
  }

  if (elem.classList.contains(ACTIVE_ROW)) {
    elem.classList.remove(ACTIVE_ROW);

    return;
  }

  const previouslySelectedRow = table.querySelector('tr.active');

  if (previouslySelectedRow) {
    previouslySelectedRow.classList.remove(ACTIVE_ROW);
  }

  elem.classList.add(ACTIVE_ROW);
});
// #endregion

// #region add a form
const form = document.createElement('form');

form.classList.add('new-employee-form');

const createElement = (type, name, placeholder, dataQa) => {
  const label = document.createElement('label');

  label.innerHTML = `${placeholder}:`;

  if (type === 'select') {
    const select = document.createElement('select');

    select.name = name;
    select.dataset.qa = dataQa;

    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    options.forEach((optionText) => {
      const option = document.createElement('option');

      option.value = optionText.toLowerCase().replace(' ', '-');
      option.textContent = optionText;
      select.appendChild(option);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.dataset.qa = dataQa;
    input.required = true;

    label.appendChild(input);
  }

  form.appendChild(label);
};

createElement('text', 'userName', 'Name', 'name');
createElement('text', 'position', 'Position', 'position');
createElement('select', 'office', 'Office', 'office');
createElement('number', 'age', 'Age', 'age');
createElement('number', 'salary', 'Salary', 'salary');

const buttonSubmit = document.createElement('button');

buttonSubmit.type = 'submit';
buttonSubmit.innerHTML = 'Save to table';
form.appendChild(buttonSubmit);

body.appendChild(form);

// #endregion

// #region add a new employee to the table
const userNameInput = document.querySelector('[name="userName"]');
const positionInput = document.querySelector('[name="position"]');
const officeInput = document.querySelector('[name="office"]');
const ageInput = document.querySelector('[name="age"]');
const salaryInput = document.querySelector('[name="salary"]');

const handleSubmit = (e) => {
  e.preventDefault();

  const name = formatName(userNameInput.value);
  const position = formatName(positionInput.value);
  const office = capitalizeCity(officeInput.value);
  const age = ageInput.value;
  const salary = parseFloat(salaryInput.value);

  const VALID_NAME = name.length < 4;
  const VALID_YOUNG = age < 18;
  const VALID_OLD = age > 90;
  const VALID_SALARY = salary < 0;

  if (VALID_NAME) {
    pushNotification(
      'Error message -_-',
      'Name must be at least 4 letters long.',
      'error',
    );

    return;
  }

  if (VALID_YOUNG) {
    pushNotification(
      'Error message -_-',
      'You are not old enough to view this content!',
      'error',
    );

    return;
  }

  if (VALID_OLD) {
    pushNotification(
      'Error message -_-',
      'You are too old to view this content!',
      'error',
    );

    return;
  }

  if (VALID_SALARY) {
    pushNotification(
      'Error message -_-',
      'You cannot earn a negative amount! Only if you are a slave...',
      'error',
    );

    return;
  }

  const newRow = tableBody.insertRow();

  const cellName = newRow.insertCell(0);
  const cellPosition = newRow.insertCell(1);
  const cellOffice = newRow.insertCell(2);
  const cellAge = newRow.insertCell(3);
  const cellSalary = newRow.insertCell(4);

  cellName.textContent = name;
  cellPosition.textContent = position;
  cellOffice.textContent = office;
  cellAge.textContent = age;

  cellSalary.textContent = `$${formatSalary(salary)}`;

  rows.push(newRow);

  form.reset();

  pushNotification(
    'Success!!!',
    `Success! Your task was completed faster than you can say "supercalifragilisticexpialidocious!"`,
    'success',
  );
};

const formatName = (input) => {
  return input.trim().replace(/\b\w/g, (char) => char.toUpperCase());
};

const capitalizeCity = (city) => {
  return city
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatSalary = (salary) => {
  return parseFloat(salary).toLocaleString('en-US');
};

// #endregion

// #region Show notification
const pushNotification = (title, description, type) => {
  if (!type) {
    return;
  }

  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notification.classList.add('notification', type);
  titleElement.classList.add('title');

  titleElement.innerText = title;
  descriptionElement.innerText = description;
  notification.setAttribute('data-qa', 'notification');

  notification.appendChild(titleElement);
  notification.appendChild(descriptionElement);
  body.appendChild(notification);

  hiddenNotification(notification);
};

const hiddenNotification = (elem) => {
  setTimeout(() => {
    elem.style.visibility = 'hidden';
  }, 3000);
};

pushNotification(
  'Success!!!',
  `Success! Your task was completed faster than you can say "supercalifragilisticexpialidocious!"`,
  'success',
);

pushNotification(
  'Error message -_-',
  'You cannot earn a negative amount! Only if you are a slave...',
  'error',
);

form.addEventListener('submit', handleSubmit);

// #endregion

// #region editing of table cells

let currentInput = null;

table.addEventListener('dblclick', function (event) {
  const target = event.target;

  if (target.tagName === 'TD' && !currentInput) {
    const initialValue = target.textContent.trim();
    const input = document.createElement('input');

    input.type = 'text';
    input.value = initialValue;
    input.classList.add('cell-input');

    target.textContent = '';
    target.appendChild(input);
    input.focus();

    currentInput = input;

    input.addEventListener('blur', function () {
      saveChanges(target, input, initialValue);
    });

    input.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        saveChanges(target, input, initialValue);
      }
    });
  }
});

function saveChanges(target, input, initialValue) {
  const newValue = input.value.trim();
  const columnIndex = target.cellIndex;

  if (validateInput(newValue, columnIndex)) {
    if (columnIndex === 4) {
      target.textContent = saveFormatSalary(newValue);
    } else {
      target.textContent = newValue === '' ? initialValue : newValue;
    }
  } else {
    alert('Invalid input. Please enter a valid value.');
    target.textContent = initialValue;
  }

  currentInput = null;
}

function validateInput(value, columnIndex) {
  switch (columnIndex) {
    case 3:
      return (
        !isNaN(value) && Number.isInteger(parseFloat(value)) && value !== ''
      );
    case 4:
      return /^\$?[\d,]+(\.\d{2})?$/.test(value);
    default:
      return true;
  }
}

function saveFormatSalary(value) {
  const num = value.replace(/[^0-9.-]+/g, '');
  const parts = num.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return '$' + parts.join('.');
}

// #endregion
