'use strict';

const table = document.querySelector('table');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const headers = document.querySelectorAll('thead > tr > th');
const isColumnSorted = {};

headers.forEach(a => {
  isColumnSorted[a.innerText] = 1;
});

function cleanState(state) {
  for (const headerState in state) {
    state[headerState] = 1;
  }
};

tableHead.addEventListener('click', (handler) => {
  const rows = [...tableBody.rows];
  const header = handler.target.closest('th').innerText;
  const orderSign = isColumnSorted[header];

  cleanState(isColumnSorted);
  isColumnSorted[header] = -orderSign;

  switch (header) {
    case 'Name':
      rows.sort((a, b) =>
        orderSign * (a.children[0].innerText)
          .localeCompare(b.children[0].innerText));
      break;

    case 'Position':
      rows.sort((a, b) =>
        orderSign * (a.children[1].innerText)
          .localeCompare(b.children[1].innerText));
      break;

    case 'Office':
      rows.sort((a, b) =>
        orderSign * (a.children[2].innerText)
          .localeCompare(b.children[2].innerText));
      break;

    case 'Age':
      rows.sort((a, b) =>
        orderSign * (a.children[3].innerText) - (b.children[3].innerText));
      break;

    case 'Salary':
      rows.sort((a, b) =>
        orderSign * ((+a.children[4].innerText.slice(1).replace(/,/g, ''))
          - (+b.children[4].innerText.slice(1).replace(/,/g, ''))));
      break;
  }
  rows.forEach(item => tableBody.append(item));
});

let previousRow;

tableBody.addEventListener('click', (handler) => {
  if (previousRow) {
    previousRow.classList.remove('active');
  }

  const row = handler.target.closest('tr');

  row.classList.add('active');
  previousRow = row;
});

table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form" action="/" method="get">
    <label>Name:
      <input id="name" name="name" type="text" data-qa="name">
    </label>
    <label>Position:
      <input
        id="position"
        name="position"
        type="text"
        data-qa="position"
      >
    </label>
    <label>Office:
      <select id="office" name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="Tokyo">Tokyo</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input id="age" name="age" type="number" data-qa="age">
    </label>
    <label>Salary:
      <input id="salary" name="salary" type="number" data-qa="age">
    </label>
    <button
      id="save_button" name="button" type="text" data-qa="salary"
    >
      Save to table
    </button>
  </for>
`);

function pushNotification(posTop, posRight, title, description, type) {
  const body = document.querySelector('body');

  body.insertAdjacentHTML('afterend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const notification = document.querySelector('div');

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  setTimeout(() => notification.remove(), 5000);
};

function checkForErrors(employeeName, position, office, age, salary) {
  const errorMessages = [];

  if (employeeName.length > 0 && employeeName.length < 4) {
    errorMessages.push('Name should consist of at least 4 letters.');
  }

  if (age !== '' && (+age < 18 || +age > 90)) {
    errorMessages.push('Age range should be from 18 to 90.');
  }

  if (
    employeeName === ''
    || position === ''
    || office === ''
    || age === ''
    || salary === ''
  ) {
    errorMessages.push('All fields are required.');
  }

  if (salary < 0) {
    errorMessages.push('Salary should be larger than 0.');
  }

  if (Number.isNaN(salary)) {
    errorMessages.push('Salary should be numeric value.');
  }

  return errorMessages;
}

const form = document.forms[0];

form.addEventListener('submit', (handler) => {
  handler.preventDefault();

  const data = new FormData(form);
  const salary = data.get('salary');
  const employeeName = data.get('name').trim();
  const position = data.get('position');
  const office = data.get('office');
  const age = data.get('age');
  const salaryString = `$` + Number(salary).toLocaleString('en-US');
  const errorMessages = checkForErrors(
    employeeName, position, office, age, salary
  );

  if (errorMessages.length) {
    pushNotification(
      10, 10, 'There was an error:', errorMessages.join('\n'), 'error'
    );
  } else {
    pushNotification(
      10, 10, 'Success', 'Employee was saved successfully.', 'success'
    );

    tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salaryString}</td>
    </tr>
    `);

    form.reset();
  }
});

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellIndex = cell.cellIndex;
  const initialValue = cell.innerText;
  const selectedRow = e.target.closest('tr');
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  input.name = 'cell-input';
  input.setAttribute('value', initialValue);
  cell.innerText = '';
  cell.append(input);
  input.focus();

  input.addEventListener('keyup', (handleKeypress) => {
    if (handleKeypress.key === 'Enter') {
      updateCell();
    }
  });

  input.addEventListener('blur', () => {
    updateCell();
  });

  function updateCell() {
    const cellValues = [];

    for (let i = 0; i < 5; i++) {
      if (cellIndex === i) {
        cellValues.push(input.value);
      } else {
        cellValues.push(selectedRow.children[i].innerText);
      }
    }

    cellValues[0] = cellValues[0].trim();

    if (cellValues[4][0] === '$') {
      cellValues[4] = +cellValues[4].slice(1).replace(',', '');
    } else {
      cellValues[4] = +cellValues[4].replace(',', '');
    }

    selectedRow.classList.remove('active');

    const errorMessages = checkForErrors(...cellValues);

    if (errorMessages.length) {
      cell.innerText = initialValue;

      pushNotification(
        10, 10, 'There was an error:', errorMessages.join('\n'), 'error'
      );
    } else {
      if (cellIndex === 4) {
        cell.innerText = `$` + Number(cellValues[4]).toLocaleString('en-US');
      } else {
        cell.innerText = cellValues[cellIndex];
      }

      pushNotification(
        10, 10, 'Success', 'Employee was saved successfully.', 'success'
      );
    }
  }
});
