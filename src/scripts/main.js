'use strict';

const list = document.querySelector('tbody');
let sortReverse = false;

const head = document.querySelector('thead').children[0];
const headList = [...head.querySelectorAll('th')];

// -----------------SORT LIST------------------------

head.addEventListener('click', (e) => {
  const item = e.target;
  const indexItem = headList.indexOf(item);
  const person = [...list.querySelectorAll('tr')];

  sortList(person, indexItem);
});

function sortList(arr, i) {
  if (!sortReverse) {
    sortReverse = true;

    arr.sort((a, b) => {
      const itemA = stringOrNumber(a.children[i].textContent);
      const itemB = stringOrNumber(b.children[i].textContent);

      return typeof itemA === 'number'
        ? itemA - itemB
        : itemA.localeCompare(itemB);
    });

    list.append(...arr);
  } else {
    sortReverse = false;

    arr.sort((a, b) => {
      const itemA = stringOrNumber(a.children[i].textContent);
      const itemB = stringOrNumber(b.children[i].textContent);

      return typeof itemA === 'number'
        ? itemB - itemA
        : itemB.localeCompare(itemA);
    });

    list.append(...arr);
  }
}

function stringOrNumber(string) {
  const DIGITS = '0123456789';
  let str = '';
  let num = '';

  string.split('').map(char => {
    DIGITS.includes(char)
      ? num += char
      : str += char;
  });

  return str.length > num.length ? str : +num;
}

// ------------------ACTIVE ROW------------------

list.addEventListener('click', (e) => {
  const active = [...document.querySelectorAll('.active')];

  const item = e.target.closest('tr');

  item.classList.toggle('active');

  if (active.length > 0) {
    active.map((el) => el.classList.remove('active'));
  }
});

// -------------------CREATING FORM-----------------

document.body.insertAdjacentHTML('beforeend', `
  <form action="" class='new-employee-form'>
    <label>
      Name:
      <input name="name" type="text" data-qa="name">
    </label>

    <label>
      Position:
      <input name="position" type="text" data-qa="position">
    </label>

    <label>
      Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input name="age" type="number" data-qa="age" min="0">
    </label>

    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" min="0">
    </label>

    <button type="submit">
      Save to table
    </button>
  </form>
`);

// -------------ADDING A NEW PERSON------------------

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const values = Object.fromEntries(data);

  if (values.name.length < 4) {
    pushNotification('error', 'Short name. Min length 4', 'error');

    return;
  };

  if (+values.age < 18 || +values.age > 90) {
    pushNotification('error', 'Invalid age. Range 18-80', 'error');

    return;
  }

  let isFieldsFilled = false;

  for (const key in values) {
    if (values[key] === '') {
      isFieldsFilled = true;
      break;
    }
  }

  if (isFieldsFilled) {
    pushNotification('error', 'Fill in all the fields', 'error');

    return;
  }

  pushNotification('success', 'New person added', 'success');

  list.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${values.name}</td>
      <td>${values.position}</td>
      <td>${values.office}</td>
      <td>${values.age}</td>
      <td>${getSalary(values.salary)}</td>
    </tr>
  `);

  e.target.reset();
});

function getSalary(salary) {
  return `$${(+salary).toLocaleString('en-US')}`;
}

// ---------------CELL EDITING-------------

list.addEventListener('dblclick', (e) => {
  const item = e.target;
  const itemValue = item.textContent;
  const indexItem = [...item.parentElement.children].indexOf(item);
  const field = form.querySelectorAll('label')[indexItem]
    .firstElementChild.cloneNode(true);

  field.classList.add('cell-input');

  if (field.dataset.qa !== 'office') {
    field.value = '';
  }

  item.innerHTML = '';
  item.append(field);

  field.focus();

  field.addEventListener('blur', () => {
    field.value.length === 0
      ? item.innerHTML = itemValue
      : item.innerHTML = field.value;

    if (field.name === 'name'
      && field.value.length < 4
      && field.value.length > 0) {
      pushNotification('error', 'Short name. Min length 4', 'error');
      item.innerHTML = itemValue;
    };

    if (field.name === 'age'
      && (+field.value < 18 || +field.value > 90)
      && field.value.length > 0) {
      pushNotification('error', 'Invalid age. Range 18-80', 'error');
      item.innerHTML = itemValue;
    }

    if (field.dataset.qa === 'salary' && field.value.length > 0) {
      item.innerHTML = getSalary(field.value);
    }
  });

  field.addEventListener('keydown', (evnt) => {
    if (evnt.code === 'Enter') {
      field.blur();
    }
  });
});

// ----------------NOTIFICATION-----------------

function pushNotification(title, description, type) {
  const messege = document.createElement('div');

  messege.dataset.qa = 'notification';

  messege.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  messege.classList.add('notification', type);

  document.body.append(messege);

  setTimeout(() => messege.remove(), 2000);
};
