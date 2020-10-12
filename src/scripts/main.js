'use strict';

const table = document.querySelector('table');
const tableBody = table.tBodies[0];
const tableRows = tableBody.rows;
const tableHeader = table.tHead.rows[0];

const headerList = [...tableHeader.cells].map(column => column.textContent);

tableHeader.addEventListener('click', event => {
  const formatNumber = number => Number(number.slice(1).replace(',', ''));

  const compareString = (stringA, stringB) => stringA.localeCompare(stringB);
  const compareAge = (AgeA, AgeB) => +AgeA - +AgeB;
  const compareSalary = (salaryA, salaryB) => {
    return formatNumber(salaryA) - formatNumber(salaryB);
  };

  switch (event.target.textContent) {
    case 'Name':
    case 'Position':
    case 'Office':
      rowSort(event.target, compareString);
      break;

    case 'Age':
      rowSort(event.target, compareAge);
      break;

    case 'Salary':
      rowSort(event.target, compareSalary);
      break;
  }
});

function rowSort(columnHead, comparingFunction) {
  const columnIndex = headerList.indexOf(columnHead.textContent);

  const sortedRows = [...tableRows].sort((rowA, rowB) => {
    const columnA = rowA.querySelectorAll('td')[columnIndex].textContent;
    const columnB = rowB.querySelectorAll('td')[columnIndex].textContent;

    return comparingFunction(columnA, columnB);
  });

  if (columnHead.direction) {
    for (const row of sortedRows) {
      table.tBodies[0].prepend(row);
    }
  } else {
    for (const row of sortedRows) {
      table.tBodies[0].append(row);
    }
  }

  for (const header of tableHeader.cells) {
    if (header !== columnHead) {
      header.direction = false;
    }
  }

  columnHead.direction = !columnHead.direction;
}

// ----------------------------------------------- add active

tableBody.addEventListener('click', event => {
  const row = event.target.closest('tr');

  row.classList.add('active');

  for (const bodyRow of tableBody.rows) {
    if (bodyRow !== row) {
      bodyRow.classList.remove('active');
    }
  }
});

// ---------------------------------------------- corection

tableBody.addEventListener('dblclick', event => {
  const cell = event.target;
  const initialValue = cell.textContent;

  switch (cell.cellIndex) {
    case 0:
    case 1:
    case 2:
      cell.innerHTML = `
      <input
        name="cell-input"
        type="text"
        value="${cell.textContent}"
      >
      </input>
      `;
      break;

    case 3:
      cell.innerHTML = `
      <input
        name="cell-input"
        type="number"
        value="${+cell.textContent}"
      >
      </input>
      `;
      break;

    case 4:
      const salaryNumber = cell.textContent.slice(1).replace(',', '');

      cell.innerHTML = `
      $<input
        name="cell-input"
        type="number"
        value="${+salaryNumber}"
      >
      </input>
      `;
      break;
  }

  const cellInput = cell.querySelector('input');

  if (cellInput) {
    cellInput.className = 'cell-input';
    cellInput.focus();

    cellInput.addEventListener('blur', () => {
      if (!cellInput.value.length) {
        cell.innerHTML = `${initialValue}`;

        return;
      }

      if (cell.cellIndex === 4) {
        cell.innerHTML = `$${(+cellInput.value).toLocaleString('en-US')}`;
      } else {
        cell.innerHTML = `${cellInput.value}`;
      }
    });

    cellInput.addEventListener('keydown', e => {
      if (e.code === 'Enter') {
        cellInput.blur();
      }
    });
  }
});

// ----------------------------------------------- add form

const form = document.createElement('form');

const cityList = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const selectOptions = cityList.map(city => `<option>${city}</option>`).join('');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name:
  <input name="name" type="text" required>
</label>

<label>Position:
  <input name="position" type="text" required>
</label>

<label>Office:
   <select name="office" required>${selectOptions}</select>
</label>

<label>Age:
  <input name="age" type="number" required>
</label>

<label>Salary:
  <input name="salary" type="number" required>
</label>

<button type="submit">Save to table</button>
`;

document.body.append(form);

// ------------------------------------ validation data

form.addEventListener('submit', event => {
  const data = form.elements;

  event.preventDefault();

  if (isValidData(data)) {
    addEmployee(data);

    pushNotification(
      450,
      275,
      'Success',
      'New employee successfully added.',
      'success'
    );
  }
});

function isValidData(data) {
  const age = +data[3].value;

  if (data[0].value.length < 4) {
    pushNotification(
      450,
      275,
      'Too short name.',
      'Name shout be at least 4 letters long.',
      'error'
    );

    return false;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      450,
      275,
      age < 18
        ? 'You are too young for that.'
        : 'You are too old for that.',
      'Age shout be between 18 and 90',
      'error'
    );

    return false;
  }

  return true;
}

const pushNotification = (top, right, title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.className = `notification ${type}`;
  message.style.top = `${top}px`;
  message.style.right = `${right}px`;

  messageTitle.className = 'title';
  messageTitle.textContent = title;

  messageDescription.textContent = description;

  message.append(messageTitle);
  message.append(messageDescription);
  document.body.append(message);

  setTimeout(() => message.remove(), 2000);
};

// ---------------------------------- add new employe

function addEmployee(data) {
  const salary = `$${(+data[4].value).toLocaleString('en-US')}`;

  const newRow = `
  <tr>
    <td>${data[0].value}</td>
    <td>${data[1].value}</td>
    <td>${data[2].value}</td>
    <td>${data[3].value}</td>
    <td>${salary}</td>
  </tr>
  `;

  tableBody.insertAdjacentHTML('afterbegin', newRow);
}
