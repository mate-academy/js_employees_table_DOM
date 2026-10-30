'use strict';

const table = document.querySelector('table');
const tbody = table.tBodies[0];
const headers = table.tHead.rows[0].cells;

function parseSalary(text) {
  return Number(text.replace(/[^0-9.-]/g, ''));
}

function formatSalary(value) {
  return '$' + Number(value).toLocaleString('en-US');
}

function getCellValue(row, index) {
  const text = row.cells[index].textContent.trim();

  return index >= 3 ? parseSalary(text) : text;
}

let sortedIndex = -1;
let sortDirection = 'asc';

table.tHead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = [...headers].indexOf(th);

  sortDirection =
    index === sortedIndex && sortDirection === 'asc' ? 'desc' : 'asc';
  sortedIndex = index;

  const rows = [...tbody.rows].sort((a, b) => {
    const first = getCellValue(a, index);
    const second = getCellValue(b, index);
    const result =
      typeof first === 'number' ? first - second : first.localeCompare(second);

    return sortDirection === 'asc' ? result : -result;
  });

  tbody.append(...rows);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelector('tr.active')?.classList.remove('active');
  row.classList.add('active');
});

function pushNotification(title, description, type) {
  document.querySelector('.notification')?.remove();

  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const text = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  titleElement.className = 'title';
  titleElement.textContent = title;
  text.textContent = description;

  notification.append(titleElement, text);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
}

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name:
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office:
    <select name="office" data-qa="office" required>
      ${offices.map((office) => `<option>${office}</option>`).join('')}
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

form.noValidate = true;

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const elName = data.get('name').trim();
  const position = data.get('position').trim();
  const office = data.get('office');
  const age = Number(data.get('age'));
  const salary = Number(data.get('salary'));

  if (!elName || !position || !data.get('age') || !data.get('salary')) {
    pushNotification('Error', 'All fields are required.', 'error');

    return;
  }

  if (elName.length < 4) {
    pushNotification(
      'Invalid name',
      'Name must contain at least 4 letters.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Invalid age', 'Age must be between 18 and 90.', 'error');

    return;
  }

  const row = tbody.insertRow();

  [elName, position, office, age, formatSalary(salary)].forEach((value) => {
    row.insertCell().textContent = value;
  });

  form.reset();
  pushNotification('Success', 'New employee added to the table.', 'success');
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || tbody.querySelector('.cell-input')) {
    return;
  }

  const initialValue = cell.textContent;
  const input = document.createElement('input');
  const isSalary = cell.cellIndex === 4;

  input.className = 'cell-input';
  input.type = 'text';
  input.value = initialValue;
  cell.textContent = '';
  cell.append(input);
  input.focus();

  function save() {
    if (!input.isConnected) {
      return;
    }

    let value = input.value.trim();

    if (!value) {
      value = initialValue;
    } else if (isSalary && !Number.isNaN(parseSalary(value))) {
      value = formatSalary(parseSalary(value));
    }

    input.remove();
    cell.textContent = value;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});
