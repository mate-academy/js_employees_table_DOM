'use strict';

const mainPage = document.querySelector('body');

let table = document.querySelector('tbody');

const header = document.querySelector('thead').lastElementChild;

let rows = [];

const successTitle = 'Success';
const successMessage = 'New employee record has been added successfully';
const errorTitle = 'Error';
let errorMessage = '';

function sortAsc(i) {
  rows = [...document.querySelector('tbody').children].sort((a, b) =>
    a.children[i].innerHTML
      .localeCompare(b.children[i].innerHTML));

  return rows;
}

function sortDesc(i) {
  rows = [...document.querySelector('tbody').children]
    .sort((a, b) => b.children[i].innerHTML
      .localeCompare(a.children[i].innerHTML));

  return rows;
}

function sortAscAge(i) {
  rows = [...document.querySelector('tbody').children]
    .sort((a, b) =>
      a.children[i].innerHTML - b.children[i].innerHTML);

  return rows;
}

function sortDescAge(i) {
  rows = [...document.querySelector('tbody').children]
    .sort((a, b) =>
      b.children[i].innerHTML - a.children[i].innerHTML);

  return rows;
}

function sortAscSalary(i) {
  rows = [...document.querySelector('tbody').children]
    .sort((a, b) => {
      const prev = a.children[i].innerHTML
        .replace('$', '')
        .replace(',', '');
      const curr = b.children[i].innerHTML
        .replace('$', '')
        .replace(',', '');

      return prev - curr;
    });

  return rows;
}

function sortDescSalary(i) {
  rows = [...document.querySelector('tbody').children]
    .sort((a, b) => {
      const prev = b.children[i].innerHTML
        .replace('$', '')
        .replace(',', '');
      const curr = a.children[i].innerHTML
        .replace('$', '')
        .replace(',', '');

      return prev - curr;
    });

  return rows;
}

function createNotification(title, messageText, result) {
  if (document.querySelector('.notification')) {
    const element = document.querySelector('.notification');

    element.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(result);
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');
  notificationTitle.innerHTML = title;

  const notificationText = document.createElement('p');

  notificationText.innerText = messageText;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);

  return notification;
}

let clickedOn = '';
let prevRow = table.firstElementChild;

header.addEventListener('click', (e) => {
  const index = [...header.children].indexOf(e.target);
  const columnName = header.children[index].innerHTML;

  switch (columnName) {
    case 'Name':
    case 'Position':
    case 'Office':

      if (clickedOn !== columnName) {
        sortAsc(index);
        clickedOn = columnName;
      } else if (clickedOn === columnName) {
        sortDesc(index);
        clickedOn = '';
      }

      break;

    case 'Age':
      if (clickedOn !== columnName) {
        sortAscAge(index);
        clickedOn = columnName;
      } else if (clickedOn === columnName) {
        sortDescAge(index);
        clickedOn = '';
      }

      break;

    case 'Salary':
      if (clickedOn !== columnName) {
        sortAscSalary(index);
        clickedOn = columnName;
      } else if (clickedOn === columnName) {
        sortDescSalary(index);
        clickedOn = '';
      }
  }

  for (const row of rows) {
    table.append(row);
  }
});

table.addEventListener('click', (e) => {
  const row = e.target.parentNode;

  if (prevRow !== row) {
    prevRow.className = '';
    row.classList.toggle('active');
    prevRow = row;
  } else if (prevRow === row) {
    row.classList.toggle('active');
    prevRow = row;
  }
});

const form = document.createElement('form');

form.className = 'new-employee-form';

for (const item of header.children) {
  const input = document.createElement('input');

  input.name = `${item.innerHTML.toLowerCase()}`;

  if (input.name === 'age'
      || input.name === 'salary') {
    input.setAttribute('type', 'number');
    input.setAttribute('data-qa', `${item.innerHTML.toLowerCase()}`);
  } else {
    input.setAttribute('type', 'text');
    input.setAttribute('data-qa', `${item.innerHTML.toLowerCase()}`);
  }

  const label = document.createElement('label');

  label.innerHTML = `${item.innerHTML}: `;

  label.append(input);

  form.append(label);
}

const replaceIndex = [...form.children]
  .findIndex(item => item.lastElementChild.name === 'office');
const replace = form.children[replaceIndex].lastElementChild;

replace.remove();

const select = document.createElement('select');

select.name = 'office';

const menuTitle = document.createElement('option');

menuTitle.innerHTML = 'Choose an office...';
menuTitle.disabled = true;
menuTitle.selected = true;
select.append(menuTitle);

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const office of offices) {
  const option = document.createElement('option');

  option.innerHTML = `${office}`;
  select.append(option);
}

const button = document.createElement('button');

button.type = 'button';
button.innerHTML = 'Save to table';

form.children[replaceIndex].append(select);
form.append(button);

const body = document.querySelector('body');

body.append(form);

button.addEventListener('click', (e) => {
  const newRow = document.createElement('tr');

  const inputData = form.querySelectorAll('label');

  for (const value of [...inputData]) {
    const item = value.lastElementChild;

    if (item.name === 'name'
    && item.value.length <= 4
    && item.value.length > 0) {
      errorMessage = 'The name length is too short.\n'
      + 'Please enter employee\'s full name';

      mainPage.append(createNotification(errorTitle, errorMessage, 'error'));

      return;
    }

    if (item.name === 'age'
    && item.value < 18
    && item.value !== '') {
      errorMessage = 'This age is not allowed.\n'
      + 'We cannot hire people younger than 18 years old, it is illegal.';

      mainPage.append(createNotification(errorTitle, errorMessage, 'error'));

      return;
    }

    if (item.name === 'age'
    && item.value > 90
    && item.value !== '') {
      errorMessage = 'This age is not allowed.\n'
      + 'Please enter employee\'s age between 18 and 90 years old.';

      mainPage.append(createNotification(errorTitle, errorMessage, 'error'));

      return;
    }

    const newCell = document.createElement('td');

    if (value.lastElementChild.name === 'salary') {
      newCell.innerHTML = `$${Number(value.lastElementChild
        .value).toLocaleString()}`;
    } else {
      newCell.innerHTML = value.lastElementChild.value;
    }

    newRow.appendChild(newCell);
  };

  for (const item of newRow.children) {
    if (item.innerHTML === ''
    || item.innerHTML === 'Choose an office...'
    || item.innerHTML === '$0') {
      errorMessage = 'All fields must be entered.\n'
      + 'Please fill in all required information.';
      mainPage.append(createNotification(errorTitle, errorMessage, 'error'));

      return;
    }
  }
  table = document.querySelector('tbody');

  table.append(newRow);

  mainPage.append(createNotification(
    successTitle,
    successMessage,
    'success'
  ));

  for (const field of [...inputData]) {
    if (field.lastElementChild.nodeName === 'SELECT') {
      field.lastElementChild.value = 'Choose an office...';
    } else {
      field.lastElementChild.value = '';
    }
  }
});

table.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');

  input.className = 'cell-edit';

  const item = e.target;

  const prevValue = e.target.innerHTML;

  item.innerHTML = ' ';
  item.append(input);
  input.focus();

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      if (input.value === '') {
        item.innerHTML = prevValue;
      } else {
        item.innerHTML = input.value;
      }
    }
  });

  input.addEventListener('blur', () => {
    if (input.value === '') {
      item.innerHTML = prevValue;
    } else {
      item.innerHTML = input.value;
    }
  });
});
