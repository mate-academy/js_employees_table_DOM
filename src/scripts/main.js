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
        min="18"
        max="90"
      >
    </label>

    <label>
      Salary:

      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
        min="0"
        max="999999"
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

form.addEventListener('submit', (e) => {
  const tableBody = document.querySelector('tbody');

  e.preventDefault();

  const dataFromServer = new FormData(form);

  const data = Object.fromEntries(dataFromServer.entries());

  if (data.name.trim().length < 4 || !isNaN(+data.name)) {
    pushNotification(10, 10,
      'Error',
      'Name should have at least 4 symbols and cannot be a number or empty',
      'error',
    );

    return;
  }

  if (data.position.trim().length < 4 || !isNaN(+data.position)) {
    pushNotification(10, 10,
      'Error',
      'Position should have at least 4 symbols and cannot be a number or empty',
      'error',
    );

    return;
  }

  if (+data.age < 18 || +data.age > 90) {
    pushNotification(10, 10,
      'Error',
      'Age should be less 90 and above 18',
      'error',
    );

    return;
  }

  if (+data.salary <= 0) {
    pushNotification(10, 10,
      'Error',
      'Salary should be above 0$',
      'error',
    );

    return;
  }

  const {
    name: userName,
    position,
    office,
    age,
    salary,
  } = data;

  const convertToDollars = (num) => {
    return `$${(+num).toLocaleString('en-US')}`;
  };

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

  pushNotification(10, 10,
    'Success',
    'User was added successfully',
    'success',
  );

  form.reset();
});
