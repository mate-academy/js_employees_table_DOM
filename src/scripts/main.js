'use strict';

const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;
const NOTIFICATION_DELAY = 3000;
const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const body = document.querySelector('body');
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const form = document.createElement('form');
const citySelection = OFFICES.map(
  (office) => `<option value="${office}"> ${office} </option>`,
).join('');

/**
 * @param {Number | string} value
 *
 * @returns {string}
 */
function formatSalary(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

/**
 * @param {string} type
 * @param {string} title
 * @param {string} description
 *
 */
function addingNotification(type, title, description) {
  const previousMessage = document.querySelector('[data-qa="notification"]');
  const notification = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const massage = document.createElement('p');

  if (previousMessage) {
    previousMessage.remove();
  }

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  messageTitle.classList.add('title');
  messageTitle.textContent = title;

  massage.textContent = description;

  notification.append(messageTitle, massage);
  document.body.append(notification);

  setTimeout(() => notification.remove(), NOTIFICATION_DELAY);
}

/**
 * @param {Object} employee
 *
 * @returns {string}
 */
function getValidationError(employee) {
  if (employee.fullName.length < MIN_NAME_LENGTH) {
    return `Name should contain at least ${MIN_NAME_LENGTH} letters.`;
  }

  if (!employee.position) {
    return 'Position is required.';
  }

  if (!employee.office) {
    return 'Office is required.';
  }

  if (!employee.age) {
    return 'Age is required.';
  }

  if (Number(employee.age) < MIN_AGE || Number(employee.age) > MAX_AGE) {
    return `Age should be between ${MIN_AGE} and ${MAX_AGE}.`;
  }

  if (!employee.salary) {
    return 'Salary is required.';
  }

  return '';
}

let currentSortColumn = null;
let isAscending = true;

form.action = '/';
form.method = 'POST';
form.dataset.qa = 'new-employee-form';
form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name:
    <input name="name" type="text" data-qa="name" />
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position" />
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      ${citySelection}
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age" />
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" />
  </label>
  <button type="submit">Save to table</button>
`;
body.appendChild(form);

/**
 * @param {number | string} value
 *
 * @returns {number}
 */
function parseValue(value) {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const number = Number(cleaned);

  return cleaned === '' || Number.isNaN(number) ? value : number;
}

// eslint-disable-next-line no-shadow
thead.addEventListener('click', (event) => {
  const tr = [...tbody.querySelectorAll('tr')];
  const sorting = event.target.closest('th');
  const columnIndex = sorting.cellIndex;

  if (currentSortColumn === columnIndex) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = columnIndex;
    isAscending = true;
  }

  if (!sorting) {
    return;
  }

  tr.sort((element1, element2) => {
    const a = parseValue(element1.children[columnIndex].textContent.trim());
    const b = parseValue(element2.children[columnIndex].textContent.trim());

    if (isAscending === true) {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }

      return a.localeCompare(b);
    }

    if (isAscending === false) {
      if (typeof a === 'number' && typeof b === 'number') {
        return b - a;
      }

      return b.localeCompare(a);
    }
  }).forEach((element) => tbody.appendChild(element));
});

// Add highlighting to the selected row
// eslint-disable-next-line no-shadow
tbody.addEventListener('click', (event) => {
  const anotherString = tbody.querySelector('.active');
  const string = event.target.closest('tr');

  if (anotherString) {
    anotherString.classList.toggle('active');
  }
  string.className = 'active';
});

// Add ability to edit row cells
// eslint-disable-next-line no-shadow
tbody.addEventListener('dblclick', (event) => {
  const selectedСell = event.target.closest('td');
  const initialText = selectedСell.textContent;
  const input = document.createElement('input');

  if (!selectedСell || selectedСell.querySelector('.cell-input')) {
    return;
  }

  input.classList.add('cell-input');
  input.value = initialText;

  selectedСell.textContent = '';
  selectedСell.append(input);
  input.focus();

  const save = () => {
    const value = input.value.trim();

    selectedСell.textContent =
      value === ''
        ? initialText
        : String(initialText).includes('$') === false
          ? value
          : formatSalary(Number(value.replace(/[$,]/g, '')));
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});

// eslint-disable-next-line no-shadow
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const employee = {
    fullName: data.get('name').trim(),
    position: data.get('position').trim(),
    office: data.get('office'),
    age: data.get('age').trim(),
    salary: data.get('salary').trim(),
  };

  const error = getValidationError(employee);

  if (error) {
    addingNotification('error', 'Invalid data', error);

    return;
  }

  const tr = document.createElement('tr');
  const dateNewPosition = [
    employee.fullName,
    employee.position,
    employee.office,
    employee.age,
    formatSalary(employee.salary),
  ];

  dateNewPosition.forEach((element) => {
    const td = document.createElement('td');

    td.innerText = element;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  form.reset();

  addingNotification(
    'success',
    'Success',
    `
      ${employee.fullName} ${employee.age} years from ${employee.office}
      as ${employee.position} with $${employee.salary} added to the table.
    `,
  );
});
