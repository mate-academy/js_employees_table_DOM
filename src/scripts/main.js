'use strict';

// write code here
const body = document.querySelector('body');
let counter = 0;
const tbody = document.querySelector('tbody');

const createEmployeeForm = () => {
  const countries = ['Tokyo', 'Singapore',
    'London', 'New York', 'Edinburgh', 'San Francisco'];
  const form = document.createElement('form');

  body.append(form);
  form.className = 'new-employee-form';

  form.insertAdjacentHTML('afterbegin', `
    <label>
      Name: <input id="name" type="text">
    </label>
    <label>
      Position: <input id="position" type="text">
    </label>
    <label>
      Office:
      <select id="office"></select>
    </label>
    <label>
      Age: <input id="age" type="number">
    </label>
    <label>
      Salary: <input id="salary" type="number">
    </label>
    <button type="submit">Save to table</button>
  `);

  const select = document.querySelector('select');
  const inputs = document.querySelectorAll('input');

  for (const input of inputs) {
    input.setAttribute('data-qa', `${input.name}`);
    input.required = true;
  }

  for (let i = 0; i < countries.length; i++) {
    select.insertAdjacentHTML('afterbegin', `
    <option value='${countries[i]}'>${countries[i]}</otion>
    `);
  }
};

createEmployeeForm();

const button = document.querySelector('button');

const createNotification = (text, result) => {
  return `
      <div class="notification ${result}" data-qa="notification">
        <h2 class="title">${result}</h2>
        <p>${text}</p>
      </div>
    `;
};

button.addEventListener('click', (e) => {
  e.preventDefault();

  function salaryString(number) {
    const str = number.toString();
    const endNumbers = str.slice(str.length - 3);
    const startNumbers = str.replace(endNumbers, '');

    return `$${startNumbers},${endNumbers}`;
  }

  if (document.querySelector('#name').value.length < 4) {
    document.body.insertAdjacentHTML('beforeend',
      createNotification('Name should be longer than 4 character.', 'error'));
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#position').value.length === 0) {
    document.body.insertAdjacentHTML('beforeend',
      createNotification('Set position.', 'error'));
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#age').value < 18) {
    document.body.insertAdjacentHTML('beforeend',
      createNotification('Employee too young.', 'error'));
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#age').value > 90) {
    document.body.insertAdjacentHTML('beforeend',
      createNotification('Employee too old.', 'error'));
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else if (+document.querySelector('#salary').value.length < 4) {
    document.body.insertAdjacentHTML('beforeend',
      createNotification('Salary too small', 'error'));
    setTimeout(() => document.querySelector('.error').remove(), 2000);
  } else {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${document.querySelector('#name').value}</td>
        <td>${document.querySelector('#position').value}</td>
        <td>${document.querySelector('#office').value}</td>
        <td>${document.querySelector('#age').value}</td>
        <td>${salaryString(document.querySelector('#salary').value)}</td>
      </tr>
    `);

    body.insertAdjacentHTML('beforeend',
      createNotification('Employee added.', 'success'));
    setTimeout(() => document.querySelector('.success').remove(), 1500);
  }
});

document.querySelector('thead').addEventListener('click', (e) => {
  const array = [...tbody.rows];

  counter++;

  function onlyNumber(string) {
    if (isNaN(string)) {
      return +string.slice(1).replace(/,/g, '');
    } else {
      return string;
    }
  };

  if (counter % 2 === 0) {
    const result = array.sort((a, b) => {
      const first = a.children[e.target.cellIndex].innerText;
      const second = b.children[e.target.cellIndex].innerText;

      if (!isNaN(onlyNumber(first))) {
        return onlyNumber(first) - onlyNumber(second);
      } else {
        return first.localeCompare(second);
      }
    });

    tbody.append(...result);
  } else {
    const result = array.sort((a, b) => {
      const first = a.children[e.target.cellIndex].innerText;
      const second = b.children[e.target.cellIndex].innerText;

      if (!isNaN(onlyNumber(first))) {
        return onlyNumber(second) - onlyNumber(first);
      } else {
        return second.localeCompare(first);
      }
    });

    tbody.append(...result);
  }
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const trAll = document.querySelectorAll('tr');

  for (const i of trAll) {
    i.className = '';
  }

  tr.className = 'active';
});
