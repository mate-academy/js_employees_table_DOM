'use strict';

const main = document.querySelector('body');
const table = main.querySelector('table');
const tableHead = table.tHead.rows[0];
const headCells = tableHead.cells;
const tableBody = table.tBodies[0];
const bodyRows = tableBody.rows;
let numberOfColumn;
let sortedColumn;

// Sort table column

function sortTableBy() {
  const sortedTable = [...bodyRows].sort((a, b) => {
    const firstValue = a.cells[numberOfColumn].innerHTML;
    const secondValue = b.cells[numberOfColumn].innerHTML;
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
}

// Reverse table column

function reverseTable() {
  const reversedTable = [...bodyRows].reverse();

  for (const row of reversedTable) {
    table.tBodies[0].append(row);
  }
}

// Sort column on click

tableHead.addEventListener('click', event => {
  const point = event.target;

  for (let i = 0; i < headCells.length; i++) {
    if (headCells[i] === point) {
      numberOfColumn = i;
    }
  }

  if (sortedColumn !== point.textContent) {
    sortedColumn = point.textContent;
    sortTableBy();
  } else {
    reverseTable();
  }
});

// Highlight active row

tableBody.addEventListener('click', event => {
  const pointRow = event.target.parentNode;

  [...bodyRows].map(row => row.classList.remove('active'));
  pointRow.classList.add('active');
});

// Create notification

function createMessage(title, description, type) {
  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const descriptionMessage = document.createElement('p');

  message.classList.add('notification', type);
  titleMessage.classList.add('title');
  titleMessage.innerText = title;
  descriptionMessage.innerText = description;
  message.append(titleMessage, descriptionMessage);

  return message;
}

// Push notification

const pushNotification = ({ title, description, type }) => {
  main.append(createMessage(title, description, type));

  const message = document.querySelector('.notification');

  window.setTimeout(function() {
    message.remove();
  }, 2000);
};

// Form of a new value

const form = document.createElement('form');
const offices = {
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  london: 'London',
  newyork: 'New York',
  edinburgh: 'Edinburgh',
  sanfrancisco: 'San Francisco',
};
let officeOption = '';

form.classList.add('new-employee-form');
form.action = '/';
form.method = 'GET';
main.append(form);

for (const office in offices) {
  officeOption += `<option value="${office}">${offices[office]}</option>`;
}

form.innerHTML = `
  <label>Name: <input name="name" type="text" required></label>
  <label>Position: <input name="position" type="text" required></label>
  <label>Office: <select name="office">${officeOption}</select></label>
  <label>Age: <input name="age" type="number" required></label>
  <label>Salary: <input name="salary" type="number" required></label>
  <button type="submit">Save to table</button>
`;

// Notification for new value

const NOTIFICATIONS = {
  shortName: {
    title: 'Wrong  name value',
    description: 'Name value has less than 4 letters',
    type: 'error',
  },
  lowAge: {
    title: 'Wrong age value',
    description: 'Age value is less than 18',
    type: 'error',
  },
  tooOld: {
    title: 'Wrong age value',
    description: 'Age value is bigger than 90',
    type: 'error',
  },
  success: {
    title: 'Succefully added',
    description: 'New employee successfully added to the table',
    type: 'success',
  },
};

// Validate form

function validateForm(formData) {
  const { age, name } = formData;

  if (name.length < 4) {
    pushNotification(NOTIFICATIONS.shortName);

    return false;
  }

  if (age < 18) {
    pushNotification(NOTIFICATIONS.lowAge);

    return false;
  } else if (age > 90) {
    pushNotification(NOTIFICATIONS.tooOld);

    return false;
  }

  return true;
}

// Format salary

function formatSalary(salary) {
  if (salary.length < 4) {
    return `$${salary}`;
  }

  return `$${new Intl.NumberFormat().format(salary)}`;
}

// Create employee row

function createEmployeeRow(employee) {
  const { name, position, office, age, salary } = employee;
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${offices[office]}</td>
    <td>${age}</td>
    <td>${formatSalary(salary)}</td>
  `;

  return newRow;
}

// Submited value and add to the row

function handleSubmit(event) {
  event.preventDefault();

  const data = new FormData(form); // eslint-disable-line
  const employee = Object.fromEntries(data.entries());

  if (validateForm(employee)) {
    tableBody.append(createEmployeeRow(employee));

    pushNotification(NOTIFICATIONS.success);
  }
}

form.addEventListener('submit', handleSubmit);

// Edit cell value

let defaultValue;

function editValue(event) {
  const point = event.target;
  const input = document.createElement('input');

  defaultValue = point.textContent;
  input.classList = 'cell-input';
  input.value = `${point.textContent}`;
  point.textContent = '';
  point.append(input);
}

// Save cell value

function saveValue() {
  const inputItem = tableBody.querySelector('input');

  if (inputItem.value !== '') {
    inputItem.parentElement.textContent = inputItem.value;
  } else {
    inputItem.parentElement.textContent = defaultValue;
  }
  inputItem.remove();
}

// Editing table by double click

tableBody.addEventListener('dblclick', event => {
  if (tableBody.querySelector('input')) {
    saveValue();
  }

  editValue(event);
});

// Save value if click on body

main.addEventListener('click', event => {
  if (event.target.tagName === 'BODY') {
    saveValue();
  }
});

// Save value if press Enter

main.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    saveValue();
  }
});
