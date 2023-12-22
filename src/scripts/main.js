/* eslint-disable no-unused-vars */
'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

let isReversed = '';

thead.addEventListener('click', (e) => {
  const sortBy = e.target.closest('th');

  if (!sortBy || !thead.contains(sortBy)) {
    return;
  }

  sortTable(sortBy.cellIndex, sortBy.innerHTML);
});

function normalizeSalary(salary) {
  return +salary.slice(1).split(',').join('');
}

function sortTable(cellIndex, sortBy) {
  const tabBody = document.querySelector('tbody');
  const people = [...tabBody.children];

  const whichRow = (person) => {
    return person.cells[cellIndex].innerHTML;
  };

  switch (sortBy) {
    case 'Name':
    case 'Position':
    case 'Office':
      people.sort((a, b) => whichRow(a).localeCompare(whichRow(b)));
      break;

    case 'Age':
      people.sort((a, b) => +whichRow(a) - +whichRow(b));
      break;

    case 'Salary':
      people.sort((a, b) => (+normalizeSalary(whichRow(a)))
        - (+normalizeSalary(whichRow(b))));
      break;
  }

  if (isReversed === sortBy) {
    tabBody.append(...people.reverse());
    isReversed = '';

    return;
  }

  tabBody.append(...people);
  isReversed = sortBy;
}

let lastRow;

tbody.addEventListener('click', (e) => {
  if (lastRow) {
    lastRow.classList.remove('active');
  }

  const row = e.target.closest('tr');

  if (!row || !tbody.contains(row)) {
    return;
  }

  row.className = 'active';
  lastRow = row;
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" onsubmit="handleSubmit(event)">
    <label>
      Name:

      <input name="name" type="text" data-qa="name" required>
    </label>

    <label>
      Position:

      <input name="position" type="text" data-qa="position" required>
    </label>

    <label>
      Office:

      <select name="office" data-qa="office" required>
        <option value="" disabled selected>Select office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New-York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San-Francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age:

      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
    </label>

    <label>
      Salary:

      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>

    <button type="submit">
      Save to table
    </button>
  </form>
`);

const pushNotification = (posTop, posRight, title, description, type) => {
  document.querySelector('body')
    .insertAdjacentHTML('beforeend', `
      <div
        class="notification ${type}"
        style="
          top: ${posTop}px;
          right: ${posRight}px;
        "
        data-qa="notification"
      >
        <h2 class="title">${title}</h2>

        <p>${description}</p>
      </div>
    `);

  setTimeout(() => {
    const notifications = document.querySelectorAll('.notification');

    notifications.forEach(notification => notification.remove());
  }, 2000);
};

const form = document.querySelector('.new-employee-form');

const convertToDollars = (num) => {
  return `$${(+num).toLocaleString('en-US')}`;
};

const nameChecker = (nameOfUser) => {
  if (nameOfUser.trim().length < 4 || !isNaN(+nameOfUser)) {
    pushNotification(10, 10,
      'Error',
      'Name should have at least 4 symbols and cannot be a number or empty',
      'error',
    );

    return true;
  }
};

const positionChecker = (positionOfUser) => {
  if (positionOfUser.trim().length < 4 || !isNaN(+positionOfUser)) {
    pushNotification(10, 10,
      'Error',
      'Position should have at least 4 symbols and cannot be a number or empty',
      'error',
    );

    return true;
  }
};

const ageChecker = (age) => {
  if (+age < 18 || +age > 90) {
    pushNotification(10, 10,
      'Error',
      'Age must be over 18 and under 90',
      'error',
    );

    return true;
  }
};

const salaryChecker = (salary) => {
  if (+salary <= 0 || +salary > 999999) {
    pushNotification(10, 10,
      'Error',
      'Salary must be over $0 and under $999,999',
      'error',
    );

    return true;
  }
};

const successNotification = () => {
  pushNotification(10, 10,
    'Success',
    'User was added successfully',
    'success',
  );
};

const successNotificationUpdate = () => {
  pushNotification(10, 10,
    'Success',
    'User was successfully updated',
    'success',
  );
};

form.addEventListener('submit', (e) => {
  const tableBody = document.querySelector('tbody');

  e.preventDefault();

  const dataFromServer = new FormData(form);

  const data = Object.fromEntries(dataFromServer.entries());

  if (nameChecker(data.name)) {
    return;
  }

  if (positionChecker(data.position)) {
    return;
  }

  if (ageChecker(data.age)) {
    return;
  }

  if (salaryChecker(data.salary)) {
    return;
  }

  const {
    name: userName,
    position,
    office,
    age,
    salary,
  } = data;

  const normSalary = convertToDollars(salary);

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${userName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${+age}</td>
      <td>${normSalary}</td>
    </tr>
  `);

  successNotification();

  form.reset();
});

let input = '';

const handleChange = (e) => {
  if (e.target.type === 'text'
    || e.target.name === 'age'
    || e.target.name === 'office'
  ) {
    input = e.target.value;
  } else if (e.target.name === 'salary') {
    input = convertToDollars(e.target.value);
  }
};

const changesCheckers = (e) => {
  if ((e.target.name === 'name') && (nameChecker(input))) {
    e.target.parentElement.innerHTML = [...target.children][0].defaultValue;
    input = target.innerHTML;

    return true;
  }

  if ((e.target.name === 'position') && (positionChecker(input))) {
    e.target.parentElement.innerHTML = [...target.children][0].defaultValue;
    input = target.innerHTML;

    return true;
  }

  if ((e.target.name === 'age') && (ageChecker(+input))) {
    e.target.parentElement.innerHTML = [...target.children][0].defaultValue;
    input = target.innerHTML;

    return true;
  }

  if ((e.target.name === 'salary') && (salaryChecker(normalizeSalary(input)))
  ) {
    e.target.parentElement.innerHTML = convertToDollars(
      [...target.children][0].defaultValue);
    input = target.innerHTML;

    return true;
  }
};

const handleOnBlur = (e) => {
  if (changesCheckers(e)) {
    return;
  }

  e.target.parentElement.innerHTML = input;
  successNotificationUpdate();
};

const handleKeyUp = (e) => {
  if (e.key === 'Enter') {
    if (changesCheckers(e)) {
      return;
    }

    e.target.parentElement.innerHTML = input;
    successNotificationUpdate();
  } else if (e.key === 'Escape') {
    e.target.parentElement.innerHTML = e.target.value;
  }
};

let target;

tbody.addEventListener('dblclick', (e) => {
  e.preventDefault();

  if (target) {
    target.innerHTML = input;
  }

  const cell = e.target.closest('td');

  if (!cell || !tbody.contains(cell)) {
    return;
  }

  target = cell;

  if (cell.cellIndex === 0) {
    const cellText = cell.innerHTML;

    input = cellText;

    cell.innerHTML = `
      <input
        type="text"
        name="name"
        class="cell-input"
        value="${cellText}"
        onblur="handleOnBlur(event)"
        oninput="handleChange(event)"
        onkeyup="handleKeyUp(event)"
      >
    `;
  }

  if (cell.cellIndex === 1) {
    const cellText = cell.innerHTML;

    input = cellText;

    cell.innerHTML = `
      <input
        type="text"
        name="position"
        class="cell-input"
        value="${cellText}"
        onblur="handleOnBlur(event)"
        oninput="handleChange(event)"
        onkeyup="handleKeyUp(event)"
      >
    `;
  }

  if (cell.cellIndex === 2) {
    const cellText = cell.innerHTML;

    input = cellText;

    cell.innerHTML = `
      <select
        name="office"
        onblur="handleOnBlur(event)"
        oninput="handleChange(event)"
        onkeyup="handleKeyUp(event)"
        class="cell-input"
      >
        <option value="Tokyo" ${cellText === 'Tokyo' ? 'selected' : ''}>
          Tokyo
        </option>

        <option value="Singapore" ${cellText === 'Singapore' ? 'selected' : ''}>
          Singapore
        </option>

        <option value="London" ${cellText === 'London' ? 'selected' : ''}>
          London
        </option>

        <option value="New-York" ${cellText === 'New York' ? 'selected' : ''}>
        New York
        </option>

        <option value="Edinburgh" ${cellText === 'Edinburgh' ? 'selected' : ''}>
          Edinburgh
        </option>

        <option
          value="San-Francisco"
          ${cellText === 'San Francisco' ? 'selected' : ''}
        >
          San Francisco
        </option>
      </select>
    `;
  }

  if (cell.cellIndex === 3) {
    const cellText = cell.innerHTML;

    input = cellText;

    cell.innerHTML = `
      <input
        type="number"
        class="cell-input"
        name="age"
        value="${cellText}"
        onblur="handleOnBlur(event)"
        oninput="handleChange(event)"
        onkeyup="handleKeyUp(event)"
      >
    `;
  }

  if (cell.cellIndex === 4) {
    const cellText = normalizeSalary(cell.innerHTML);

    input = cellText;

    cell.innerHTML = `
      <input
        type="number"
        class="cell-input"
        name="salary"
        value="${cellText}"
        onblur="handleOnBlur(event)"
        oninput="handleChange(event)"
        onkeyup="handleKeyUp(event)"
      >
    `;
  }
});
