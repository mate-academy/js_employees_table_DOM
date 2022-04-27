'use strict';

const table = document.querySelector('table');
const tBody = document.querySelector('tbody');
const tHead = document.querySelector('thead');
const offices = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];
let sortAsc = true;
let title;

const convertToNumber = number =>
  +(number.split('').filter(num => !isNaN(num)).join(''));

const convertToCorrectFormat = string => {
  const convert = (+string).toFixed(3).split('');

  convert.unshift('$');

  const convertedFormat = convert.join('')
    .split('.').join(',');

  return convertedFormat;
};

const pushNotification = (header, description, type) => {
  const page = document.querySelector('body');
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');
  message.style.top = '3px';
  message.style.minHeight = '0';
  message.style.height = '95px';

  message.innerHTML = `
    <h2>${header}</h2>
    <p>${description}</p>
  `;

  page.children[1].after(message);

  setTimeout(() => message.remove(), 1500);
};

const editorOfCells = (input, cell, initialValue) => {
  if (!input.value) {
    cell.innerText = initialValue;
    input.remove();
  } else {
    cell.innerText = input.value;
    input.remove();
  }

  const index = cell.cellIndex;
  const headCell = tHead.querySelector('tr').cells[index].innerText;

  switch (headCell) {
    case 'Name':
      if (input.value.length < 4) {
        cell.innerText = initialValue;

        pushNotification('Warning!!!',
          'Name should have min 4 letters', 'warning');
      }
      break;

    case 'Age':
      if (isNaN(input.value)) {
        cell.innerText = initialValue;

        pushNotification('Warning!!!',
          'Provide digit value', 'warning');
      }

      if (input.value < 18) {
        cell.innerText = initialValue;

        pushNotification('Warning!!!',
          'Min Age 18', 'warning');
      }

      if (input.value > 90) {
        cell.innerText = initialValue;

        pushNotification('Warning!!!',
          'Max Age 90', 'warning');
      }
      break;

    case 'Office':
      if (!offices.includes(input.value)) {
        cell.innerText = initialValue;

        pushNotification('Warning!!!',
          'Provide correct office location', 'warning');
      }
      break;

    case 'Salary':
      if (isNaN(input.value)) {
        cell.innerText = initialValue;

        pushNotification('Warning!!!',
          'Provide digit value', 'warning');
      } else if (input.value) {
        cell.innerText = convertToCorrectFormat(input.value);
      }
      break;
  }
};

table.addEventListener('click', e => {
  const sortButton = e.target.closest('thead');

  if (!sortButton) {
    return;
  }

  const numberOfCell = e.target.cellIndex;
  const rows = [...tBody.rows];

  if (title !== e.target.innerText) {
    sortAsc = true;
  }

  rows.sort((a, b) => {
    if (e.target.innerText === 'Salary' || e.target.innerText === 'Age') {
      return (sortAsc
        ? (convertToNumber(a.cells[numberOfCell].innerText)
          - convertToNumber(b.cells[numberOfCell].innerText))
        : (convertToNumber(b.cells[numberOfCell].innerText)
          - convertToNumber(a.cells[numberOfCell].innerText)));
    }

    const strA = a.cells[numberOfCell].innerText.toString();
    const strB = b.cells[numberOfCell].innerText.toString();

    return (sortAsc
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA));
  });

  for (const row of rows) {
    row.remove();
    tBody.append(row);
  }

  sortAsc = !sortAsc;
  title = e.target.innerText;
});

table.addEventListener('click', e => {
  if (!e.target.closest('tbody')) {
    return;
  }

  if (e.target.parentElement.className !== 'active') {
    const previousSelected = document.querySelector('.active');

    if (previousSelected) {
      previousSelected.classList.remove('active');
    }
  }
  e.target.parentElement.classList.add('active');
});

table.insertAdjacentHTML('afterend', `
  <form action="/" method="GET" class="new-employee-form">

    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        placeholder="Name"
        required
      >
    </label>

    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        placeholder="Position"
        required
      >
    </label>

    <label>
      Office:
      <select name="office" data-qa="office" required>
        <option selected disabled>Choose location</option>
        <option value="Tokyo">${offices[0]}</option>
        <option value="Singapore">${offices[1]}</option>
        <option value="London">${offices[2]}</option>
        <option value="New York">${offices[3]}</option>
        <option value="Edinburgh">${offices[4]}</option>
        <option value="San Francisco">${offices[5]}</option>
      </select>
    </label>

    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        placeholder="Age"
        required
      >
    </label>

    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        placeholder="in US dollars"
        required
      >
    </label>

    <button type="submit">
      Save to table
    </button>

  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', eve => {
  eve.preventDefault();

  const data = new FormData(form);
  const formValues = Object.fromEntries(data.entries());
  const { position, office, age, salary } = formValues;

  const newPerson = document.createElement('tr');

  newPerson.innerHTML = `
     <tr>
       <td>${formValues.name}</td>
       <td>${position}</td>
       <td>${office}</td>
       <td>${age}</td>
       <td>${convertToCorrectFormat(salary)}</td>
     </tr>
  `;

  if (formValues.name.length < 4) {
    pushNotification('Error!!!',
      'Name should have min 4 letters', 'error');
  } else if (age < 18) {
    pushNotification('Error!!!', 'Min Age 18', 'error');
  } else if (age > 90) {
    pushNotification('Error!!!', 'Max Age 90', 'error');
  } else {
    tBody.append(newPerson);
    form.reset();
    pushNotification('Success!!!', 'New user was added', 'success');
  }
});

tBody.addEventListener('dblclick', eve => {
  const cell = eve.target.closest('td');

  if (!cell) {
    return;
  }

  const initialValue = eve.target.innerText;

  cell.innerText = null;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  input.value = initialValue;

  cell.append(input);
  input.focus();

  input.addEventListener('blur', () =>
    editorOfCells(input, cell, initialValue));

  input.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') {
      return;
    }

    editorOfCells(input, cell, initialValue);
  });
});
