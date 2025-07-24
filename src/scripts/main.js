'use strict';

const body = document.body;
const table = document.querySelector('table');
const tableBody = table.tBodies;
const tableHead = table.tHead;
const titles = [...tableHead.rows[0].cells];
let rows = [...tableBody[0].children];
let asc = false;

let currentNotificationTop = 10;
const notificationGap = 15;

createForm();

const formPage = document.querySelector('form');

formPage.addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(formPage);
  const nameForm = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  let salary = Number(formData.get('salary'));
  let validation = false;
  const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/;

  if (nameForm.length < 4) {
    validation = true;

    pushNotification(
      'Too short name',
      'Name should be longer than 4 charachters.\n ' + 'Data is required.',
      'error',
    );
  }

  if (!nameRegex.test(nameForm)) {
    validation = true;

    pushNotification(
      'Invalid charachters in name',
      'Enter valid data.\n ' + 'Data could contain letters and spaces.',
      'warning',
    );
  }

  if (!nameRegex.test(position)) {
    validation = true;

    pushNotification(
      'Invalid charachters in position',
      'Enter valid data.\n ' + 'Data could contain letters and spaces.',
      'warning',
    );
  }

  if (isNaN(age) || age > 90 || age < 18) {
    validation = true;

    pushNotification(
      'Wrong age',
      'Enter valid data.\n ' +
        'Age should be a number more than 18 and less than 90.',
      'error',
    );
  }

  if (position.trim().length === 0) {
    validation = true;

    pushNotification(
      'Wrong position',
      'Enter valid data.\n ' + 'Position can not be empty.',
      'error',
    );
  }

  if (isNaN(salary)) {
    validation = true;

    pushNotification(
      'Title of Error message',
      'Enter valid data.\n ' + 'Salary should be a number.',
      'error',
    );
  }

  if (validation) {
    currentNotificationTop = 10;

    return;
  }

  const row = document.createElement('tr');

  salary = salary.toLocaleString('us-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  [nameForm, position, office, age, salary].forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;
    row.appendChild(cell);
  });

  tableBody[0].appendChild(row);

  if (tableBody[0]) {
    pushNotification(
      'Title of Success message',
      'Data is valid.\n ' + 'Great job!',
      'success',
    );
  }

  formPage.reset();

  updateSelect(document.querySelector('select[name=office]'));
});

table.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    e.target.innerHTML = `<input class="cell-input" type="text" value=''>`;

    const cellInput = e.target.querySelector('input');

    cellInput.focus();

    cellInput.addEventListener('keyup', function (ev) {
      if (ev.keyCode === 13) {
        cellInput.blur();
      }
    });
  }
});

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    rows.forEach((tr) => tr.classList.remove('active'));
    e.target.closest('tr').classList.add('active');
  }
});

tableHead.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    asc = !asc;

    const indexCol = titles.findIndex((el) => el === e.target);

    rows = [...tableBody[0].children];

    rows.sort(sortRows(indexCol));

    if (!asc) {
      rows = rows.reverse();
    }

    for (const row of rows) {
      tableBody[0].append(row);
    }
    table.append(tableBody[0]);
  }
});

function sortRows(index) {
  return function (a, b) {
    const aEl = a.children[index].textContent;
    const bEl = b.children[index].textContent;

    if (index === 4 || index === 3) {
      return getNumber(aEl) - getNumber(bEl);
    } else {
      return aEl.localeCompare(bEl);
    }
  };
}

function getNumber(str) {
  return Number(str.replace(/[^\d.-]/g, ''));
}

function createForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');

  for (const title of titles) {
    const titleName = title.textContent;
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.name = titleName.toLowerCase();
    input.dataset.qa = titleName.toLowerCase();
    label.for = titleName.toLowerCase();
    label.textContent = titleName;

    if (title.textContent === 'Age' || title.textContent === 'Salary') {
      input.type = 'number';
    }

    if (title.textContent === 'Office') {
      createSelect(title, label);
    } else {
      label.appendChild(input);
    }

    form.appendChild(label);
  }
  form.classList.add('new-employee-form');
  button.innerText = 'Save to table';
  button.type = 'submit';
  form.appendChild(button);
  body.appendChild(form);
}

function createSelect(titleEl, parentEl) {
  const select = document.createElement('select');

  select.name = titleEl.textContent.toLowerCase();
  select.dataset.qa = titleEl.textContent.toLowerCase();

  const indexCol = titles.findIndex(
    (el) => el.textContent === titleEl.textContent,
  );
  const values = new Set();

  for (const row of rows) {
    values.add(row.children[indexCol].textContent);
  }

  for (const value of values) {
    const option = document.createElement('option');

    option.selected = false;
    option.textContent = value;
    select.appendChild(option);
  }
  select.selectedIndex = -1;
  parentEl.appendChild(select);
}

function updateSelect(el) {
  el.selectedIndex = -1;
}

const pushNotification = (title, description, type) => {
  const element = document.createElement('div');
  const messageTitle = document.createElement('h2');

  messageTitle.classList.add('title');

  const messageText = document.createElement('p');

  element.classList.add('notification');
  element.classList.add(`${type}`);
  messageTitle.innerText = title;
  messageText.innerText = description;

  element.appendChild(messageTitle);
  element.appendChild(messageText);

  element.style.top = `${currentNotificationTop}px`;
  element.style.right = '15px';

  body.appendChild(element);

  const notificationHeight = element.offsetHeight;

  currentNotificationTop += notificationHeight + notificationGap;

  window.setTimeout(function () {
    element.style.visibility = 'hidden';
  }, 5000);
};
