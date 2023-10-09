'use strict';

const table = document.querySelector('table');
const head = table.tHead;
const body = table.tBodies[0];
const rows = body.rows;
let currentSortingField = '';
let activeRow;
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
    <label>Name:
      <input data-qa="name" name="name" type="text" required>
    </label>
    <label>Position:
      <input data-qa="position" name="position" type="text" required>
    </label>
    <label>Office:
      <select data-qa="office" name="office" required>
        ${offices.map(office => `<option value="${office}">${office}</option>`)}
      </select>
    </label>
    <label>Age:
      <input data-qa="age" name="age" type="number" required>
    </label>
    <label>Salary:
      <input data-qa="salary" name="salary" type="number" required>
    </label>

    <button type="submit">Save to table</button>`;

document.body.append(form);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const personName = form.querySelector('[name="name"]').value;
  const position = form.querySelector('[name="position"]').value;
  const office = form.querySelector('[name="office"]').value;
  const age = +form.querySelector('[name="age"]').value;
  const salary = +form.querySelector('[name="salary"]').value;
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
  <td>${personName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${stringifySalary(salary)}</td>
  `;

  if (personName.length < 4) {
    pushNotification(10, 10, 'Error',
      'Name should contain more than 4 letters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(10, 10, 'Error',
      'Age should be greater than 18 and less than 90', 'error');

    return;
  }

  body.append(newRow);

  pushNotification(10, 10, 'Success',
    'Person successfully added', 'success');

  form.reset();
});

head.addEventListener('click', (event) => {
  const sortingField = event.target.textContent;
  const rowsCopy = [...rows];

  if (currentSortingField === sortingField) {
    rowsCopy.reverse();
  } else {
    rowsCopy.sort((a, b) => {
      switch (sortingField) {
        case 'Name':
          return a.children[0].textContent
            .localeCompare(b.children[0].textContent);

        case 'Position':
          return a.children[1].textContent
            .localeCompare(b.children[1].textContent);

        case 'Office':
          return a.children[2].textContent
            .localeCompare(b.children[2].textContent);

        case 'Age':
          return +a.children[3].textContent
            - +b.children[3].textContent;

        case 'Salary':
          return parseSalary(a.children[4].textContent)
            - parseSalary(b.children[4].textContent);

        default:
          return 0;
      }
    });

    currentSortingField = sortingField;
  }

  rowsCopy.forEach(row => body.append(row));
});

body.addEventListener('click', (event) => {
  const row = event.target.parentElement;

  if (activeRow && activeRow !== row) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
  activeRow = row;
});

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = notification;
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

function parseSalary(salary) {
  return +salary.slice(1).replace(',', '');
}

function stringifySalary(salary) {
  return '$' + salary.toLocaleString('en-US');
}
