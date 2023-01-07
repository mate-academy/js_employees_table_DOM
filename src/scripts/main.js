'use strict';

const headers = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let colIndex = -1;

headers.addEventListener('click', (e) => {
  const target = e.target;
  const index = target.cellIndex;

  sortingTable(index, target.innerText, colIndex === index);

  colIndex = (colIndex === index) ? -1 : index;
});

function sortingTable(index, nameColumn, directSorting) {
  const sortTable = [...tbody.children];

  sortTable.sort((first, second) => {
    const a = first.children[index].innerText;
    const b = second.children[index].innerText;

    switch (nameColumn) {
      case 'Name':
      case 'Position':
      case 'Office':
        return a.localeCompare(b);

      case 'Age':
      case 'Salary':
        return toNormalNumber(a) - toNormalNumber(b);
    }
  });

  if (directSorting) {
    sortTable.reverse();
  }

  tbody.append(...sortTable);
}

function toNormalNumber(string) {
  let res = '';

  string.includes('$')
    ? res = string.slice(1).split(',').join('')
    : res = string;

  return Number(res);
};

tbody.addEventListener('click', (e) => {
  const target = e.target;

  isActiveClass([...tbody.children]);
  target.parentElement.classList.add('active');
});

function isActiveClass(arr) {
  arr.forEach(row =>
    row.classList.contains('active') ? row.classList.remove('active') : 1);
};

document.querySelector('body').insertAdjacentHTML('beforeend', `
  <form class='new-employee-form'>
    <label>
      Name:
      <input name='name' type='text' data-qa='name'>
    </label>
    <label>
      Position:
      <input name='position' type='text' data-qa='position'>
    </label>
    <label>
      Office:
      <select name='office' data-qa='office'>
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
      <input name='age' type='number' data-qa='age'>
    </label>
    <label>
      Salary:
      <input name='salary' type='number' data-qa='salary'>
    </label>
    <button type='submit'>
      Save to table
    </button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newData = new FormData(form);
  const valuesObj = Object.fromEntries(newData.entries());
  const tr = document.createElement('tr');

  for (const key in valuesObj) {
    if (!validForm(key, valuesObj[key])) {
      return;
    }

    tr.insertAdjacentHTML(
      'beforeend',
      `<td>${normalizeValueForm(key, valuesObj[key])}</td>`
    );
  }

  tbody.append(tr);
  pushNotification('Success!', 'success', 'New employee successfully added');
  form.reset();
});

function normalizeValueForm(key, value) {
  return key === 'salary'
    ? `$${Number(value).toLocaleString('en-US')}`
    : value;
}

const maxAge = 90;
const minAge = 18;
const minSalary = 1000;
const maxSalary = 1000000;

function validForm(key, value) {
  if (!value.replace(/ /g, '')) {
    pushNotification('Error', 'error', 'Fill in all fields');

    return false;
  }

  if (value.includes('  ')) {
    pushNotification('Error', 'error',
      'Field should not contains multiple  spaces');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    pushNotification('Error', 'error',
      'Name should contain at least 4 lettters');

    return false;
  }

  if (key === 'age' && (+value > maxAge || +value < minAge)) {
    pushNotification('Error', 'error',
      'Age must be at least 18 and not more 90');

    return false;
  }

  if (key === 'salary' && (+value > maxSalary || +value < minSalary)) {
    pushNotification('Error', 'error',
      'Salary must be at least $1,000 and not more $1,000,000');

    return false;
  }

  return true;
}

function pushNotification(titleNotification, type, description) {
  const divNotification = document.createElement('div');
  const h1Notification = document.createElement('h1');
  const textNotification = document.createElement('p');

  document.body.append(divNotification);
  divNotification.append(h1Notification);
  divNotification.append(textNotification);
  h1Notification.innerText = titleNotification;
  textNotification.innerText = description;
  divNotification.classList.add(type, 'notification');

  setTimeout(() => divNotification.remove(), 5000);
};

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const index = target.cellIndex;
  const prevValue = target.innerHTML;
  const input = form.querySelectorAll('[name]')[index].cloneNode(true);

  target.innerHTML = '';
  input.classList.add('cell-input');
  input.value = prevValue;
  target.append(input);
  input.focus();

  input.addEventListener('keypress', enter => {
    if (enter.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', () => {
    if (!validForm(input.name, input.value)) {
      target.innerHTML = prevValue;

      return;
    }

    target.innerHTML = normalizeValueForm(input.name, input.value);
  });
});
