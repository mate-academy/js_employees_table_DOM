'use strict';

let body = document.querySelector('body');
let thead = document.querySelector('thead');
let tbody = document.querySelector('tbody');
let tbodyTrs = [...document.querySelectorAll('tbody tr')];

let globalTargetForThead;
let globalTargetForTbody;
let globalActiveRow;

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const elementTitle = document.createElement('h2');
  const elementDescript = document.createElement('p');

  notification.className = `notification ${type}`;
  elementTitle.className = 'title';

  elementTitle.innerText = title;
  elementDescript.innerText = description;

  notification.dataset.qa = 'notification'; // MA test
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.append(elementTitle);
  notification.append(elementDescript);

  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

// adding sort thead
thead.addEventListener('click', e => {
  const target = e.target;
  const indexColumn = [...thead.firstElementChild.children].indexOf(target);

  const doubleClick = globalTargetForThead === target;

  globalTargetForThead = (doubleClick) ? undefined : target;

  tbodyTrs.sort((trA, trB) => {
    let valueA = [...trA.children][indexColumn].innerText;
    let valueB = [...trB.children][indexColumn].innerText;

    if (target.innerText === 'Salary') {
      valueA = valueA.slice(1).split(',').join('');
      valueB = valueB.slice(1).split(',').join('');

      return (doubleClick)
        ? +valueB - +valueA
        : +valueA - +valueB;
    }

    if (target.innerText === 'Age') {
      return (doubleClick)
        ? +valueB - +valueA
        : +valueA - +valueB;
    }

    return (doubleClick)
      ? valueB.localeCompare(valueA)
      : valueA.localeCompare(valueB);
  });

  tbodyTrs.map(tr => tbody.append(tr));
});

// adding active row
tbody.addEventListener('click', e => {
  const targetTr = e.target.parentElement;

  const doubleClick = globalTargetForTbody === targetTr;

  globalTargetForTbody = (doubleClick) ? undefined : targetTr;

  if (globalActiveRow !== undefined) {
    globalActiveRow.classList.remove('active');
  }

  (doubleClick)
    ? targetTr.classList.remove('active')
    : targetTr.classList.add('active');

  globalActiveRow = targetTr;
});

// adding form
body.insertAdjacentHTML('beforeend', `
  <form action="" metod="get" class="new-employee-form">
    <label>Name:
      <input name="name" data-qa="name">
    </label>

    <label>Position:
      <input name="position" data-qa="position">
    </label>

    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" data-qa="age" type="number">
    </label>

    <label>Salary:
      <input name="salary" data-qa="salary" type="number">
    </label>

    <button>Save to table</button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', e => {
  const data = new FormData(form);

  e.preventDefault();

  const age = +data.get('age');
  const salary = +data.get('salary');

  switch (true) {
    case (!data.get('name')
      || !data.get('position')
      || !data.get('office')
      || !age
      || !salary):
      // e.preventDefault();

      pushNotification(10, 10, 'Fill in all fields',
        'Necessary to fill all fields', 'error');

      return;

    case (data.get('name').length < 4):
      // e.preventDefault();

      pushNotification(10, 10, 'Too short Name',
        'Enter a longer Name. Longer 3 characters', 'error');

      return;

    case (age < 18):
      // e.preventDefault();

      pushNotification(10, 10, 'Too young Age',
        'You are too young for this shit.\n Min Age is 18', 'error');

      return;

    case (age > 90):
      // e.preventDefault();

      pushNotification(10, 10, 'Too old Age',
        'You are too old for this shit.\n Max age is 90', 'error');

      return;

    default:
      break;
  }

  tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${data.get('name')}</td>
    <td>${data.get('position')}</td>
    <td>${data.get('office')}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  </tr>
  `);

  pushNotification(10, 10, 'Person was appended',
    'There are even more of us', 'success');

  updateVariables();
});

//  dblclick on cell
tbody.addEventListener('dblclick', e => {
  const cell = e.target;

  if (!cell.matches('td')) {
    return;
  }

  const initialText = cell.innerText;

  cell.innerText = '';

  cell.insertAdjacentHTML('beforeend', `
    <input class="cell-input" value="${initialText}">
  `);

  const inputForEdit = cell.lastElementChild;

  inputForEdit.focus();

  extraEventsForInput(cell, inputForEdit, initialText);

  updateVariables();
});

function extraEventsForInput(target, input, initialValue) {
  //  blur
  input.addEventListener('blur', () => {
    removeAndAdd(target, input, initialValue);
  });

  //  keyup
  input.addEventListener('keyup', e => {
    if (e.code === 'Enter') {
      removeAndAdd(target, input, initialValue);
    }
  });
};

function removeAndAdd(target, input, initialValue) {
  const value = (input.value) ? input.value : initialValue;
  const inputInside = input;

  if (inputInside) {
    inputInside.remove();
  }

  target.innerText = value;
};

function updateVariables() {
  thead = document.querySelector('thead');
  tbodyTrs = [...document.querySelectorAll('tbody tr')];
  tbody = document.querySelector('tbody');
  body = document.querySelector('body');
};
