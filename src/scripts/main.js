'use strict';

const table = document.querySelector('table');
const headers = table.querySelector('thead');
const tbody = table.querySelector('tbody');
let colIndex = -1;

headers.addEventListener('click', (eventOnClick) => {
  const target = eventOnClick.target;
  const index = target.cellIndex;

  sortingTable(index, target.innerHTML, colIndex === index);

  colIndex = (colIndex === index) ? -1 : index;
});

function sortingTable(index, nameColumn, directSorting) {
  const sortTable = [...tbody.children];

  sortTable.sort((first, second) => {
    const a = first.children[index].innerHTML;
    const b = second.children[index].innerHTML;

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

  return +res;
}

tbody.addEventListener('click', (eventOnClick) => {
  const targetRow = eventOnClick.target.closest('tr');

  targetRow.classList.contains('active')
    ? targetRow.classList.remove('active')
    : singleSelectRow(targetRow, 'active', tbody);
});

function singleSelectRow(target, nameClass, tableBody) {
  const rows = tableBody.querySelectorAll('tr');

  for (const row of rows) {
    row.classList.remove(nameClass);
  }

  return target.classList.toggle(nameClass);
}

document.querySelector('table').insertAdjacentHTML(
  'afterend', `
  <form class="new-employee-form">
  <label>Name:
    <input
      name="name"
      type="text"
      data-qa="name"
      value = ''
    >
  </label>
  <label>Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      value = ''
    >
  </label>
  <label>Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      value = ''
    >
  </label>
  <label>Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      value = ''
    >
  </label>
  <button type="submit">Save to table</button>
</form>`
);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formValue = new FormData(form);
  const values = Object.fromEntries(formValue.entries());
  const tr = document.createElement('tr');

  for (const key in values) {
    if (!validForm(key, values[key])) {
      return;
    }

    tr.insertAdjacentHTML(
      'beforeend',
      `<td>${normalizeValueForm(key, values[key])}</td>`
    );
  }

  tbody.append(tr);
  pushNotification('Success!', 'success', 'New employee successfully added');
  form.reset();
});

function validForm(key, value) {
  if (!value) {
    pushNotification('Error', 'error', 'Fill in all fields');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    pushNotification('Error', 'error', 'Name must contain at least 4 letters');

    return false;
  }

  if (key === 'age' && (+value < 18 || +value > 90)) {
    pushNotification('Error', 'error',
      'Age must be at least 18 and not more than 90');

    return false;
  }

  return true;
}

function normalizeValueForm(key, value) {
  return key === 'salary'
    ? `$${parseInt(value).toLocaleString('en-US')}`
    : value;
}

function pushNotification(title, type, description) {
  const divNot = document.createElement('div');
  const titleNot = document.createElement('h2');
  const textNot = document.createElement('p');

  document.body.append(divNot);
  divNot.append(titleNot);
  divNot.append(textNot);
  divNot.classList.add('notification', type);
  titleNot.classList.add('title');
  titleNot.innerHTML = title;
  textNot.innerHTML = description;

  setTimeout(() => divNot.remove(), 2000);
};

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const prevValue = target.innerHTML;
  const index = target.cellIndex;
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
