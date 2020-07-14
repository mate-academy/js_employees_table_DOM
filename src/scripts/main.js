'use strict';

const main = document.querySelector('body');
const table = main.querySelector('table');
const tableHead = table.tHead.rows[0];
const headCells = tableHead.cells;
const tableBody = table.tBodies[0];
const bodyRows = tableBody.rows;
let numberOfColumn;

// Sort table column

tableHead.addEventListener('click', event => {
  const point = event.target;

  for (let i = 0; i < headCells.length; i++) {
    if (headCells[i] === point) {
      numberOfColumn = i;
    }
  }

  if (point.dataset.sort === undefined) {
    [...headCells].map(item => delete item.dataset.sort);
    point.dataset.sort = 'ASC';
  } else if (point.dataset.sort === 'ASC') {
    point.dataset.sort = 'DESC';
  } else {
    point.dataset.sort = 'ASC';
  }

  const sortedTable = [...bodyRows].sort((a, b) => {
    const firstValue = point.dataset.sort === 'ASC'
      ? a.cells[numberOfColumn].innerHTML
      : b.cells[numberOfColumn].innerHTML;
    const secondValue = point.dataset.sort === 'ASC'
      ? b.cells[numberOfColumn].innerHTML
      : a.cells[numberOfColumn].innerHTML;
    const firstNumber = parseInt((firstValue).replace(/\D+/g, ''));
    const secondNumber = parseInt((secondValue).replace(/\D+/g, ''));

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
      return firstValue.localeCompare(secondValue);
    } else {
      return firstNumber - secondNumber;
    }
  });

  for (const row of sortedTable) {
    table.tBodies[0].append(row);
  }
});

tableBody.addEventListener('click', event => {
  const pointRow = event.target.parentNode;

  [...bodyRows].map(row => row.classList.remove('active'));
  pointRow.classList.add('active');
});

// Create notification

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  message.classList.add('notification', type);
  titleMessage.classList.add('title');
  titleMessage.innerText = title;
  descriptionMessage.innerText = description;
  message.append(titleMessage, descriptionMessage);
  main.append(message);

  window.setTimeout(function() {
    message.remove(titleMessage, descriptionMessage);
  }, 2000);
};

// Form of a new value

const form = document.createElement('form');
const selectOffice = {
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  london: 'London',
  newyork: 'New York',
  edinburgh: 'Edinburgh',
  sanfrancisco: 'San Francisco',
};

form.classList.add('new-employee-form');
form.action = '/';
form.method = 'GET';
main.append(form);

form.innerHTML = `
  <label>Name: <input name="name" type="text" required></label>
  <label>Position: <input name="position" type="text" required></label>
  <label>Office: <select name="office">
    <option value="tokyo">${selectOffice.tokyo}</option>
    <option value="singapore">${selectOffice.singapore}</option>
    <option value="london">${selectOffice.london}</option>
    <option value="newyork">${selectOffice.newyork}</option>
    <option value="edinburgh">${selectOffice.edinburgh}</option>
    <option value="sanfrancisco">${selectOffice.sanfrancisco}</option>
  </select></label>
  <label>Age: <input name="age" type="number" required></label>
  <label>Sallary: <input name="sallary" type="number" required></label>
  <button type="submit">Save to table</button>
`;

// Submit and notification for new value

form.addEventListener('submit', event => {
  event.preventDefault();

  const data = new FormData(form); // eslint-disable-line
  const dataObject = Object.fromEntries(data.entries());
  const newRow = document.createElement('tr');
  let sallary = '';

  if (dataObject.name.length < 4) {
    return pushNotification('Wrong  name value',
      'Name value has less than 4 letters', 'error');
  }

  if (dataObject.age < 18) {
    return pushNotification('Wrong age value',
      'Age value is less than 18', 'error');
  } else if (dataObject.age > 90) {
    return pushNotification('Wrong age value',
      'Age value is bigger than 90', 'error');
  }

  if (dataObject.sallary.length < 4) {
    sallary = `$${dataObject.sallary}`;
  } else {
    sallary = `$${new Intl.NumberFormat().format(dataObject.sallary)}`;
  }

  newRow.innerHTML = `
    <td>${dataObject.name}</td>
    <td>${dataObject.position}</td>
    <td>${selectOffice[dataObject.office]}</td>
    <td>${dataObject.age}</td>
    <td>${sallary}</td>
  `;

  tableBody.append(newRow);

  pushNotification('Succefully added',
    'New employee successfully added to the table', 'success');
});

// Editing table by double click

function saveValue() {
  const inputItem = tableBody.querySelector('input');

  inputItem.parentElement.textContent = inputItem.value;
  inputItem.remove();
}

tableBody.addEventListener('dblclick', event => {
  if (tableBody.querySelector('input')) {
    saveValue();
  }

  const point = event.target;
  const input = document.createElement('input');

  input.classList = 'cell-input';
  input.value = `${point.textContent}`;
  point.textContent = '';
  point.append(input);
});

main.addEventListener('click', event => {
  if (event.target.tagName === 'BODY') {
    saveValue();
  }
});

main.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    saveValue();
  }
});
