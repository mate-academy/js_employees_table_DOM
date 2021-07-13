'use strict';

const table = document.querySelector('table');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let click;
let direction = true;
let selected;

tableHead.addEventListener('click', e => {
  const tableCeil = e.target;
  const columnforSort = tableCeil.cellIndex;
  let sorted;

  if (click === tableCeil) {
    direction = !direction;
  } else {
    direction = true;
    click = tableCeil;
  }

  function getString(value) {
    return value.children[columnforSort].innerText;
  }

  function getSalary(value) {
    return getString(value).slice(1).split(',').join('');
  }

  function callbackForString(a, b) {
    return direction
      ? a.localeCompare(b)
      : b.localeCompare(a);
  }

  function callbackForNumbers(a, b) {
    return direction
      ? +a - +b
      : +b - +a;
  }

  switch (tableCeil.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      sorted = [...tableBody.rows].sort(
        (a, b) => callbackForString(getString(a), getString(b))
      );
      break;

    case 'Age':
      sorted = [...tableBody.rows].sort(
        (a, b) => callbackForNumbers(getString(a), getString(b))
      );
      break;

    case 'Salary':
      sorted = [...tableBody.rows].sort(
        (a, b) => callbackForNumbers(getSalary(a), getSalary(b))
      );
      break;
  }

  sorted.forEach(item => tableBody.append(item));
});

tableBody.addEventListener('click', e => {
  const item = e.target.closest('tr');

  if (!selected) {
    selected = item;
    selected.classList.add('active');
  } else if (selected !== item) {
    selected.classList.remove('active');
    selected = item;
    selected.classList.add('active');
  } else {
    selected.classList.remove('active');
  }
});

table.insertAdjacentHTML('afterend', `
  <form
    class= "new-employee-form"
    action= "/"
    method= "POST"
  >
    <label>
    Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      >
    </label>

    <label>
    Position:
      <input
        name="position"
        type="text"
        data-qa="position"
      >
    </label>    
    
    <label>
    Office:
      <select
        name="office"
        data-qa="office"
      >
        <option
          value=""
          selected
          disabled
        >Choose:</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>
    Age:
      <input
        name="age"
        type="number"
        data-qa="age"
      >
    </label>

    <label>
    Salary:
      <input
        name="number"
        type="text"
        data-qa="salary"
      >
    </label>
    <button class="sbumit-employee-form" type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');
const employeeNameInput = document.querySelector('[data-qa = "name"]');
const employeePositionInput = document.querySelector('[data-qa = "position"]');
const employeeOfficeInput = document.querySelector('[data-qa = "office"]');
const employeeAgeInput = document.querySelector('[data-qa = "age"]');
const employeeSalaryInput = document.querySelector('[data-qa = "salary"]');

function makeNotification(type, message) {
  const notification = document.createElement('div');
  const title = type[0] + type.slice(1);

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  notification.classList.add(type);

  notification.insertAdjacentHTML('beforeend', `
    <h2>${title}</h2>
    <p>${message}</p>
  `);

  return notification;
};

form.addEventListener('submit', e => {
  e.preventDefault();

  if (employeeNameInput.value.length < 4) {
    document.body.append(
      makeNotification('error', 'Name is less than 4 letters!')
    );
  } else if (employeeAgeInput.value < 18 || employeeAgeInput.value > 90) {
    document.body.append(
      makeNotification('error', 'Age is less than 18 or more than 90!')
    );
  } else if (
    !employeeNameInput.value
    || !employeePositionInput.value
    || !employeeOfficeInput.value
    || !employeeAgeInput.value
    || !employeeSalaryInput.value
  ) {
    document.body.append(
      makeNotification('error', 'You have to fill all fields in the form!')
    );
  } else {
    tableBody.append(
      addToTable(
        employeeNameInput.value,
        employeePositionInput.value,
        employeeOfficeInput.value,
        employeeAgeInput.value,
        employeeSalaryInput.value
      )
    );

    document.body.append(
      makeNotification(
        'success',
        'Information was successfully added to table!'
      )
    );
    employeeNameInput.value = '';
    employeePositionInput.value = '';
    employeeOfficeInput.value = '';
    employeeAgeInput.value = '';
    employeeSalaryInput.value = '';
  }

  setTimeout(() => {
    document.querySelector('.notification').remove();
  }, 2000);
});

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

function addToTable(employeeName, position, office, age, salary) {
  const tableRow = document.createElement('tr');
  const validSalary = `$${numberWithCommas(salary)}`;

  tableRow.insertAdjacentHTML('beforeend', `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${validSalary}</td>
  `);

  return tableRow;
};

const inputCell = document.createElement('input');

inputCell.classList.add('cell-input');

tableBody.addEventListener('dblclick', e => {
  const item = e.target;
  const information = item.innerText;

  inputCell.style.width = window.getComputedStyle(item).width;

  setTimeout(() => {
    inputCell.focus();
  }, 20);

  item.innerText = '';
  item.append(inputCell);
  inputCell.value = information;

  inputCell.addEventListener('blur', () => {
    if (inputCell.value.length > 0) {
      inputCell.remove();
      item.innerText = inputCell.value;
    } else {
      inputCell.remove();
      item.innerText = information;
    }
  });

  inputCell.addEventListener('keydown', ev => {
    if (ev.key === 'Enter') {
      inputCell.blur();
    }
  });
});
