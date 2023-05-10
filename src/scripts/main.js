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

  notification.dataset.qa = 'notification';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.append(elementTitle);
  notification.append(elementDescript);

  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

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

body.insertAdjacentHTML('beforeend', `
  <form action="" metod="get" class="new-employee-form">
    <label>Name:
      <input name="name" data-qa="name" pattern="^[a-zA-Z]+$">
    </label>

    <label>Position:
      <input name="position" data-qa="position"  pattern="^[a-zA-Z]+$">
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

      pushNotification(10, 10, 'Fill in all fields',
        'Necessary to fill all fields', 'error');

      return;

    case (data.get('name').length < 4):

      pushNotification(10, 10, 'Too short Name',
        'Enter a longer Name. Longer 3 characters', 'error');

      return;

    case (age < 18):

      pushNotification(10, 10, 'Too young Age',
        'You are too young for this shit.\n Min Age is 18', 'error');

      return;

    case (age > 90):

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

  form.reset();

  pushNotification(10, 10, 'Person was appended',
    'There are even more of us', 'success');

  updatePageValues();
});

tbody.addEventListener('dblclick', e => {
  const cell = e.target;
  const cells = [...cell.parentElement.children];

  if (!cell.matches('td')) {
    return;
  }

  const initialText = cell.innerText;
  const indexCell = cells.indexOf(cell);

  cell.innerText = '';

  switch (true) {
    case (indexCell === 2):
      cell.insertAdjacentHTML('beforeend', `
      <select name="office" data-qa="office" class="cell-input">
        <option value="${initialText}" disablet>
          ${initialText}
        </option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    `);
      break;

    case (indexCell === 3):
      cell.insertAdjacentHTML('beforeend', `
      <input
        class="cell-input"
        value="${initialText}"
        type="number">
      `);
      break;

    case (indexCell === 4):
      const initialSalary = initialText.slice(1).split(',').join('');

      cell.insertAdjacentHTML('beforeend', `
        <input
          class="cell-input"
          value="${initialSalary}"
          type="number">
      `);
      break;

    default:
      cell.insertAdjacentHTML('beforeend', `
        <input
          class="cell-input"
          value="${initialText}"
          pattern="^[a-zA-Z]+$"
        >
      `);
      break;
  }

  const inputEdit = cell.lastElementChild;

  inputEdit.focus();

  addInputEvents(cell, inputEdit, initialText, indexCell);
  updatePageValues();
});

function addInputEvents(target, input, initial, indexTarget) {
  input.addEventListener('blur', () => {
    updateCellValue(target, input, initial, indexTarget);
  });

  input.addEventListener('keyup', e => {
    if (e.code === 'Enter') {
      updateCellValue(target, input, initial, indexTarget);
    }
  });
};

function updateCellValue(target, input, initialValue, indexTarget) {
  let value;

  if (input.value) {
    value = [...input.value].join('');

    switch (true) {
      case indexTarget === 4:
        value = `$${Number(value).toLocaleString()}`;
        break;

      case indexTarget === 3:
        if (+value < 18 || +value > 90) {
          pushNotification(10, 10, 'Incorrect data',
            'Min Age is 18\n Max Age is 90', 'error');

          value = initialValue;
        }
        break;

      case indexTarget === 0:
        if (value.length < 4) {
          pushNotification(10, 10, 'Too short Name',
            'Enter a longer Name. Longer 3 characters', 'error');

          value = initialValue;
        }
        break;

      default:
        break;
    }
  } else {
    value = initialValue;
  }

  console.log(document.querySelector('.cell-input'));

  input.remove();
  target.innerText = value;
};

function updatePageValues() {
  thead = document.querySelector('thead');
  tbodyTrs = [...document.querySelectorAll('tbody tr')];
  tbody = document.querySelector('tbody');
  body = document.querySelector('body');
};
