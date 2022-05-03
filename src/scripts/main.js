'use strict';

const table = document.querySelector('table');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const tableRows = [...tableBody.rows];
let checkIndex;
let count = 0;

tableHead.addEventListener('click', e => {
  const i = e.target.cellIndex;

  if (checkIndex === e.target.cellIndex) {
    count++;
  } else {
    count = 0;
  }

  tableRows.sort((a, b) => {
    let first = a.cells[i].innerText;
    let second = b.cells[i].innerText;

    if (i === 4) {
      first = +first.slice(1).replace(',', '');
      second = +second.slice(1).replace(',', '');

      return count % 2 === 0
        ? first - second
        : second - first;
    }

    return count % 2 === 0
      ? first.localeCompare(second)
      : second.localeCompare(first);
  });

  tableBody.append(...tableRows);

  checkIndex = i;
});

tableBody.addEventListener('click', e => {
  const targetRow = e.target.closest('tr');

  for (const row of tableBody.rows) {
    row.classList.remove('active');
  }

  targetRow.className = 'active';
});

const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');

  body.insertAdjacentHTML('beforeend', `
    <div class="${type} notification" data-qa="notification">
      <h1 class="title">${title}</h1>
      <p>${description}</p>
    </div>
  `);

  setTimeout(() => document.querySelector('div').remove(), 3000);
};

table.insertAdjacentHTML('afterend', `
  <form class='new-employee-form'>
    <label>Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button>Save to table</buttom>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (data.name.length < 4) {
    pushNotification('Error message', 'Incorrect name', 'error');
  } else if (+data.age < 18 || +data.age > 90) {
    pushNotification('Error message', 'Incorrect age', 'error');
  } else {
    tableBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${data.name}</th>
        <td>${data.position}</th>
        <td>${data.office}</th>
        <td>${data.age}</th>
        <td>$${parseInt(data.salary).toLocaleString('en-US')}</th>
      </tr>
    `);

    pushNotification(
      'Success message',
      'A new employee is successfully added to the table',
      'success'
    );
  }

  form.reset();
});

tableBody.addEventListener('dblclick', e => {
  const cell = e.target;
  const oldValue = cell.textContent;

  cell.textContent = '';

  cell.insertAdjacentHTML('afterbegin', `
      <label>
        <input class="cell-input" name="text" type="text">
      </label>
    `);

  const input = cell.firstElementChild.firstElementChild;

  input.focus();

  function errorInputCase(description) {
    cell.textContent = oldValue;
    pushNotification('Error message', `${description}`, 'error');
  }

  function successInputCase(value, description) {
    cell.textContent = value;
    pushNotification('Success message', `${description}`, 'success');
  }

  function handler() {
    if (input.value.length === 0) {
      errorInputCase('Empty value');

      return;
    }

    if (cell.cellIndex === 0) {
      if (input.value.length < 4) {
        errorInputCase('Incorrect name');
      } else {
        successInputCase(input.value, 'Name added');
      }

      return;
    }

    if (cell.cellIndex === 3) {
      if (isNaN(+input.value) || +input.value < 18 || +input.value > 90) {
        errorInputCase('Incorrect age');
      } else {
        successInputCase(input.value, 'Age added');
      }

      return;
    }

    if (cell.cellIndex === 4) {
      if (isNaN(+input.value)) {
        errorInputCase('Incorrect salary');
      } else {
        const salary = `$${parseInt(input.value).toLocaleString('en-US')}`;

        successInputCase(salary, 'Salary added');
      }

      return;
    }

    successInputCase(input.value, 'Value added');
  };

  input.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      handler();
    }
  });

  input.addEventListener('blur', () => {
    handler();
  });
});
