'use strict';

const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;
const NOTIFICATION_DELAY = 3000;

const table = document.querySelector('table');
const tbody = table.tBodies[0];

const toComparable = (text) => {
  const normalized = text.replace(/[$,]/g, '').trim();

  return normalized !== '' && !isNaN(normalized) ? Number(normalized) : text;
};

const formatSalary = (value) => `$${Number(value).toLocaleString('en-US')}`;

const pushNotification = (title, description, type) => {
  const previous = document.querySelector('[data-qa="notification"]');

  if (previous) {
    previous.remove();
  }

  const box = document.createElement('div');
  const heading = document.createElement('h2');
  const text = document.createElement('p');

  box.classList.add('notification', type);
  box.dataset.qa = 'notification';

  heading.classList.add('title');
  heading.textContent = title;
  text.textContent = description;

  box.append(heading, text);
  document.body.append(box);

  setTimeout(() => box.remove(), NOTIFICATION_DELAY);
};

let sortedIndex = -1;
let isAscending = true;

const sortRows = (index) => {
  const rows = [...tbody.rows];

  rows.sort((rowA, rowB) => {
    const a = toComparable(rowA.cells[index].textContent);
    const b = toComparable(rowB.cells[index].textContent);

    const result =
      typeof a === 'number' && typeof b === 'number'
        ? a - b
        : String(a).localeCompare(String(b));

    return isAscending ? result : -result;
  });

  tbody.append(...rows);
};

table.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  if (header.cellIndex === sortedIndex) {
    isAscending = !isAscending;
  } else {
    sortedIndex = header.cellIndex;
    isAscending = true;
  }

  sortRows(sortedIndex);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const selected = tbody.querySelector('tr.active');

  if (selected) {
    selected.classList.remove('active');
  }

  row.classList.add('active');
});

const optionsMarkup = OFFICES.map(
  (office) => `<option value="${office}">${office}</option>`,
).join('');

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>
    Position: <input name="position" type="text" data-qa="position">
  </label>
  <label>
    Office:
    <select name="office" data-qa="office">${optionsMarkup}</select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

const getValidationError = (employee) => {
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
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

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
    pushNotification('Invalid data', error, 'error');

    return;
  }

  const row = tbody.insertRow();

  const values = [
    employee.fullName,
    employee.position,
    employee.office,
    employee.age,
    formatSalary(employee.salary),
  ];

  values.forEach((value) => {
    row.insertCell().textContent = value;
  });

  form.reset();

  pushNotification(
    'Success',
    `${employee.fullName} has been added to the table.`,
    'success',
  );
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('.cell-input')) {
    return;
  }

  const initialText = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialText;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  const save = () => {
    const value = input.value.trim();

    cell.textContent = value === '' ? initialText : value;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});
