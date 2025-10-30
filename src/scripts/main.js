'use strict';

const table = document.querySelector('table');
let sortKey = '';
let countOfClick = 0;
let rows = [...table.tBodies[0].children];
const titles = [...table.tHead.rows[0].cells];
let currentNotificationTop = 10;
const notificationGap = 15;
const offices = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

createForm();

const formPage = document.querySelector('form');

table.addEventListener('click', (e) => {
  const headers = [...document.querySelectorAll('th')];
  const clickedTh = e.target.closest('th');
  const clickedTr = e.target.closest('tbody tr');

  rows = [...table.tBodies[0].children];

  const index = headers.indexOf(clickedTh);

  if (clickedTr) {
    rows.map((row) => row.classList.remove('active'));
    clickedTr.classList = 'active';

    return;
  }

  if (clickedTh.textContent === sortKey) {
    countOfClick++;
  } else {
    sortKey = clickedTh.textContent;
    countOfClick = 0;
  }

  if (countOfClick % 2 === 0) {
    rows.sort((curr, next) => {
      const a = parseFloat(
        curr.cells[index].textContent.trim().replace(/[^0-9.-]+/g, ''),
      );
      const b = parseFloat(
        next.cells[index].textContent.trim().replace(/[^0-9.-]+/g, ''),
      );

      if (Number.isNaN(a) && Number.isNaN(b)) {
        return curr.cells[index].textContent
          .trim()
          .localeCompare(next.cells[index].textContent.trim());
      } else {
        return a - b;
      }
    });
  }

  if (countOfClick % 2 === 1) {
    rows.sort((curr, next) => {
      const a = parseFloat(
        curr.cells[index].textContent.trim().replace(/[^0-9.-]+/g, ''),
      );
      const b = parseFloat(
        next.cells[index].textContent.trim().replace(/[^0-9.-]+/g, ''),
      );

      if (Number.isNaN(a) && Number.isNaN(b)) {
        return next.cells[index].textContent
          .trim()
          .localeCompare(curr.cells[index].textContent.trim());
      } else {
        return b - a;
      }
    });
  }

  rows.forEach((row) => table.tBodies[0].appendChild(row));
});

document.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(formPage);
  const nameForm = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  let validation = false;
  let salary = Number(formData.get('salary'));
  const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/;

  rows = [...table.tBodies[0].children];

  if (nameForm.length < 4) {
    validation = true;

    pushNotification(
      'Short name',
      'Name should be than 4 charachters.\n',
      'error',
    );
  }

  if (!nameRegex.test(nameForm)) {
    validation = true;

    pushNotification(
      'Invalid charachters in name',
      'Enter valid date\n',
      'error',
    );
  }

  if (!nameRegex.test(position)) {
    validation = true;

    pushNotification(
      'Invalid charachters in position',
      'Enter valid data.\n ' + 'Data could contain letters and spaces.',
      'error',
    );
  }

  if (!office) {
    validation = true;

    pushNotification(
      'Wrong choice of office ',
      'Enter valid data.\n ' +
        'You need to choose one of the six existing ones',
      'error',
    );
  }

  if (isNaN(salary) || salary > 1000000 || salary < 100) {
    validation = true;

    pushNotification(
      'Wrong salary ',
      'Enter valid data.\n ' +
        'You need to enter a number between 100 and one million',
      'error',
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

  salary = `$${salary.toLocaleString('en-US')}`;

  [nameForm, position, office, age, salary].forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;
    row.appendChild(cell);
  });

  table.tBodies[0].appendChild(row);

  if (table.tBodies[0]) {
    pushNotification(
      'Title of Success message',
      'Data is valid.\n ' + 'Great job!',
      'success',
    );
  }

  formPage.reset();

  updateSelect(document.querySelector('select[name=office]'));
});

function createForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');

  for (const title of titles) {
    const titleName = title.textContent;
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.name = titleName.toLowerCase();
    input.dataset.qa = titleName.toLowerCase();
    input.for = titleName.toLowerCase();
    label.textContent = `${titleName}:`;

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
  table.insertAdjacentElement('afterend', form);
}

function createSelect(titleEl, parentEl) {
  const select = document.createElement('select');

  select.name = titleEl.textContent.toLowerCase();
  select.dataset.qa = titleEl.textContent.toLowerCase();

  for (const value of offices) {
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
  const div = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  div.style.top = `${currentNotificationTop}px`;
  div.style.right = '15px';

  div.classList = type;
  titleEl.className = 'title';

  titleEl.textContent = title;
  descriptionEl.textContent = description;

  div.dataset.qa = 'notification';

  div.append(titleEl, descriptionEl);
  document.body.appendChild(div);

  const notificationHeight = div.offsetHeight;

  currentNotificationTop += notificationHeight + notificationGap;

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};
