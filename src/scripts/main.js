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
  const VALID_AGE = age < 18 || age > 90;

  if (VALID_NAME) {
    pushNotification(
      'Error message -_-',
      'Name must be at least 4 letters long.',
      'error',
    );

    return;
  }

  if (VALID_AGE) {
    pushNotification(
      'Error message -_-',
      'You are not old enough or too old to view this content!',
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
  notification.dataset.qa = 'notification';

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

form.addEventListener('submit', handleSubmit);

// #endregion

// #region editing of table cells

const handleDoubleClick = (event) => {
  const cell = event.target;

  if (document.querySelector('.cell-input')) {
    return;
  }

  const initialValue = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.value = initialValue;
  input.classList.add('cell-input');

  cell.appendChild(input);
  input.focus();

  const saveChanges = () => {
    const newValue = input.value.trim();

    if (newValue === '') {
      cell.textContent = initialValue;
    } else {
      cell.textContent = newValue;

      pushNotification(
        'Success!!!',
        `Success! Your task was completed faster than you can say "supercalifragilisticexpialidocious!"`,
        'success',
      );
    }
    cell.removeChild(input);
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveChanges();
    }
  });
};

const tableCells = document.querySelectorAll('td');

tableCells.forEach((cell) => {
  cell.addEventListener('dblclick', handleDoubleClick);
});

// #endregion
