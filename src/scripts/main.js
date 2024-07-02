/* eslint-disable function-paren-newline */
'use strict';

const formDataQA = {
  NAME: 'name',
  POSITION: 'position',
  OFFICE: 'office',
  AGE: 'age',
  SALARY: 'salary',
};

const options = {
  DEFAULT: 'chose your office',
  Tokyo: 'Tokyo',
  Singapore: 'Singapore',
  London: 'London',
  'New York': 'New York',
  Edinburgh: 'Edinburgh',
  'San Francisco': 'San Francisco',
};

window.addEventListener('DOMContentLoaded', app);

function app() {
  const table = document.querySelector('table');

  table.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName === 'TD') {
      cellEdit(cell);
    }
  });

  sortLogic(table);
  selectUser(table);
  addAndValidateForm();
}

function cellEdit(cell) {
  const currentValue = cell.innerText;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = currentValue;
  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveChanges(cell, input.value.length > 0 ? input.value : currentValue);
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveChanges(cell, input.value.length > 0 ? input.value : currentValue);
    }
  });
}

function saveChanges(cell, newValue) {
  cell.innerHTML = newValue;
}

function selectUser(table) {
  const tBody = table.tBodies[0];

  [...tBody.children].forEach((tr) => {
    tr.addEventListener('click', (e) => {
      const currentActive = tBody.querySelector('.active');

      if (currentActive) {
        currentActive.classList.remove('active');
      }

      tr.classList.add('active');
    });
  });
}

function sortLogic(table) {
  const tHead = table.tHead;
  let sortBy = '';
  let sortMethod = 'asc';

  [...tHead.rows[0].cells].forEach((cell, index) =>
    cell.addEventListener('click', () => {
      const currentSortBy = cell.innerText.toLocaleUpperCase().trim();

      if (currentSortBy === sortBy) {
        sortMethod = sortMethod === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = currentSortBy;
        sortMethod = 'asc';
      }

      sortHandler(table, index, sortBy, sortMethod);
    }),
  );
}

function sortHandler(table, index, sortBy, sortMethod) {
  const tBody = table.tBodies[0];

  const sorted = [...tBody.rows].sort((a, b) => {
    const first = a.cells[index].innerHTML;
    const second = b.cells[index].innerHTML;

    switch (sortBy) {
      case 'AGE':
        return sortMethod === 'asc' ? +first - +second : +second - +first;

      case 'SALARY':
        return sortMethod === 'asc'
          ? extractNumber(first) - extractNumber(second)
          : extractNumber(second) - extractNumber(first);

      default:
        return sortMethod === 'asc'
          ? first.localeCompare(second)
          : second.localeCompare(first);
    }
  });

  sorted.forEach((tr) => tBody.appendChild(tr));
}

function addAndValidateForm() {
  const body = document.querySelector('body');
  const form = document.createElement('form');
  const button = document.createElement('button');

  form.classList.add('new-employee-form');
  form.setAttribute('action', '/');
  form.setAttribute('method', 'post');
  button.setAttribute('type', 'submit');
  button.innerText = 'Save to table';

  Object.values(formDataQA).forEach((item) => {
    const label = document.createElement('label');

    const capitalize = `${item[0].toUpperCase()}${item.slice(1)}`;

    label.innerHTML = `${capitalize}: `;

    if (item === 'office') {
      const select = document.createElement('select');

      Object.values(options).forEach((option) => {
        const opt = document.createElement('option');

        if (option === options.DEFAULT) {
          opt.disabled = true;
          opt.selected = true;
          opt.setAttribute('value', '');
        } else {
          opt.setAttribute('value', option);
        }

        opt.innerHTML = option;
        select.appendChild(opt);
      });

      select.setAttribute('defaultValue', options.DEFAULT);
      select.setAttribute('name', item);
      select.setAttribute('data-qa', item);
      select.required = true;
      label.appendChild(select);
    } else {
      const input = document.createElement('input');

      input.setAttribute('name', item);
      input.setAttribute('data-qa', item);

      input.setAttribute(
        'type',
        item === 'age' || item === 'salary' ? 'number' : 'text',
      );

      label.append(input);
    }

    form.appendChild(label);
  });

  form.appendChild(button);
  body.appendChild(form);

  form.addEventListener('submit', addUser);
}

function getInputsValues(form) {
  const data = new FormData(form);
  const nameInput = data.get(formDataQA.NAME);
  const position = data.get(formDataQA.POSITION);
  const office = data.get(formDataQA.OFFICE);
  const age = data.get(formDataQA.AGE);
  const salary = +data.get(formDataQA.SALARY);

  return {
    name: nameInput,
    position,
    office,
    age,
    salary: `$${salary.toLocaleString('en-US')}`,
  };
}

function addUser(e) {
  e.preventDefault();

  const form = document.querySelector('.new-employee-form');
  const user = getInputsValues(form);

  if (!user.position.length) {
    buildNotification(
      'error',
      'Fix your posiition',
      'Posiition field cannot be empty',
    );

    return;
  }

  if (!extractNumber(user.salary)) {
    buildNotification(
      'error',
      'Fix your salary',
      'Salary field cannot be empty',
    );

    return;
  }

  if (user.name.length < 4) {
    buildNotification(
      'error',
      'Fix your name',
      'Value has less than 4 letters',
    );

    return;
  }

  if (+user.age < 18 || +user.age >= 90) {
    buildNotification(
      'error',
      'Fix your age',
      'You to young or to old for work',
    );

    return;
  }

  const tBody = document.querySelector('table').tBodies[0];
  const tr = createRow(user);

  tBody.appendChild(tr);
  form.reset();

  if (tBody.contains(tr)) {
    buildNotification(
      'success',
      'Success add',
      'You to young or to old for work the' +
        'user is successfully added to the table',
    );
  }
}

function createRow(user) {
  const tr = document.createElement('tr');

  Object.values(user).forEach((item) => {
    const td = document.createElement('td');

    td.innerText = item;
    tr.appendChild(td);
  });

  return tr;
}

function buildNotification(messageStatus, title, description) {
  const body = document.querySelector('body');
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const message = document.createElement('p');

  h2.classList.add('title');
  h2.textContent = title;
  message.textContent = description;
  notification.classList.add('notification', messageStatus);
  notification.setAttribute('data-qa', 'notification');
  notification.append(h2, message);
  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function extractNumber(str) {
  return parseFloat(str.replace(/[$,]/g, ''));
}
