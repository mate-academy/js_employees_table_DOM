'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let trList = tbody.querySelectorAll('tr');
let switched = true;

function sortColumns(e) {
  const col = e.target.cellIndex;

  switched = !switched;

  const table = [];

  for (let i = 0; i < trList.length; i++) {
    table.push(trList[i]);
    trList[i].remove();
  }

  table.sort((a, b) => {
    let first = b.children[col].textContent;
    let second = a.children[col].textContent;

    if (switched !== true) {
      first = a.children[col].textContent;
      second = b.children[col].textContent;
    }

    if (col === 0 || col === 1 || col === 2) {
      return first > second ? 1 : -1;
    }

    if (col === 4) {
      return +first.toString().replace(/\$|,/g, '')
      - +second.toString().replace(/\$|,/g, '');
    }

    if (col === 3) {
      return +first - +second;
    }
  });

  table.forEach(item => tbody.appendChild(item));
}

thead.addEventListener('click', sortColumns);

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" action="post">
    <label>
      Name:
      <input
        type="text"
        name="name"
        data-qa="name"
        min="4"
        required
        id="name"/>
    </label>
    <label>
      Position:
      <input
      type="text"
      name="position"
      data-qa="position"
      required
      id="position"/>
    </label>
    <label>
      Office:
      <select
      name="office"
      data-qa="office"
      id="office"/>
      <option value="Tokyo" selected>Tokyo</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Singapore">Singapore</option>
      <option value="San Francisco">San Francisco</option>
      <option value="Edinburgh">Edinburgh</option>
    </select>
    </label>
    <label>
      Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        min='18'
        max='90'
        required
        id="age"/>
    </label>
    <label>
      Salary:
      <input
      type="number"
      name="salary"
      data-qa="salary"
      required
      id="salary"/>
    </label>
    <button>Save to table</button>
  </form>
`);

for (const item of trList) {
  item.addEventListener('click', (e) =>
    e.currentTarget.classList.add('active'));
}

for (const item of trList) {
  item.addEventListener('dblclick',
    (e) => {
      e.target.classList.add('active');

      e.target.innerHTML('beforeend', '<input type="text">');
    });
}

const btn = document.querySelector('button');
const form = document.querySelector('.new-employee-form');

btn.addEventListener('click', (e) => {
  e.preventDefault();

  if (!form.position.value || !form.name.value || !form.age.value
     || !form.office.value || !form.salary.value) {
    notSubmitError('error');

    return;
  };

  if (form.name.value.length < 4) {
    form.name.classList.add('notification error');
    form.name.setAttribute('data-qa', 'notification');

    notEnoughText('warning',
      'Please, enter more than 4 characters to the field "Name"');

    return;
  }

  if (form.position.value.length < 4) {
    form.position.classList.add('notification');
    form.position.setAttribute('data-qa', 'notification');

    notEnoughText('warning',
      'Please, enter more than 4 characters to the field "Postion"');

    return;
  }

  if (form.age.value < 18 || form.age.value > 90) {
    form.age.classList.add('notification');
    form.age.setAttribute('data-qa', 'notification');

    notEnoughText('warning',
      'Please, enter age more than 18 and less then 90');

    return;
  }

  addLists();
  submitTotal('success');
  form.reset();
});

function addLists() {
  tbody.insertAdjacentHTML('beforeend', `
  <tr>
  <td>${form.name.value}</td>
  <td>${form.position.value}</td>
  <td>${form.office.value}</td>
  <td>${+form.age.value}</td>
  <td>$${(+form.salary.value).toLocaleString('en-US')}</td>
  </tr>
  `);

  trList = tbody.querySelectorAll('tr');
}

function pushNotification(posTop, posRight, title, description, type) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.insertAdjacentHTML('afterbegin',
    `<div data-qa="notification" class="notification ${type}">
      <h1 class="title">${title}</h1>
      <p>${description}</p>
    </div>`);

  body.append(div);

  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;

  setTimeout(() => {
    div.remove();
  }, 3000);

  return div;
};

function submitTotal(titleSubmit) {
  pushNotification(10, 10, titleSubmit, '\n '
  + 'All the information added to the table', 'success');
};

function notSubmitError(notSumbit) {
  pushNotification(150, 10, notSumbit, '\n '
  + 'Please, enter the information in the field and confirm info', 'error');
};

function notEnoughText(notEnough, text) {
  pushNotification(290, 10, notEnough, '\n '
  + text, 'warning');
};
