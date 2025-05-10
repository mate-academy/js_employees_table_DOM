'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

let previousRow;
let previousClick;

function toNumber(num) {
  return num.slice(1).split(',').join('.');
}

function descSort(el) {
  const rows = tbody.querySelectorAll('tr');

  const header = el.target.parentNode;
  const place = [...header.children].indexOf(el.target);
  let sortCol = [...rows]
    .sort((a, b) => a.children[place]
      .innerHTML > b.children[place].innerHTML ? -1 : 1);

  if (place === 4) {
    sortCol = [...rows]
      .sort((a, b) => toNumber(b.children[place]
        .innerHTML) - toNumber(a.children[place].innerHTML));
  }

  tbody.innerHTML = '';

  for (const tr of sortCol) {
    tbody.append(tr);
  }

  previousClick = '';
}

function ascSort(el) {
  const rows = tbody.querySelectorAll('tr');

  const header = el.target.parentNode;
  const place = [...header.children].indexOf(el.target);
  let sortCol = [...rows]
    .sort((a, b) => a.children[place]
      .innerHTML > b.children[place].innerHTML ? 1 : -1);

  if (place === 4) {
    sortCol = [...rows]
      .sort((a, b) => toNumber(a.children[place]
        .innerHTML) - toNumber(b.children[place].innerHTML));
  }

  tbody.innerHTML = '';

  for (const tr of sortCol) {
    tbody.append(tr);
  }

  previousClick = el.target;
}

thead.addEventListener('click', el => {
  if (previousClick !== el.target) {
    ascSort(el);
  } else {
    descSort(el);
  }
});

tbody.addEventListener('click', el => {
  const row = el.target.parentNode;

  if (row !== previousRow) {
    row.classList.add('active');

    if (previousRow) {
      previousRow.classList.remove('active');
    }
  };

  previousRow = row;
});

body.insertAdjacentHTML('beforeend', `
  <form class='new-employee-form'>
    <label>Name:
      <input name="name" type="text" data-qa="name" >
    </label>

    <label>Position:
      <input name="position" type="text" data-qa="position" >
    </label>

    <label>Office:
      <select name="office" data-qa="office" >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" type="number" data-qa="age" >
    </label>

    <label>Salary:
      <input name="salary" type="number" data-qa="salary" >
    </label>

    <button type='submit'>Save to table
    </button>
  </form>
`);

const form = document.querySelector('form');

const formName = form.elements[0];
const formAge = form.elements[3];

form.addEventListener('submit', ev => {
  ev.preventDefault();

  const valuesArry = [];

  for (const input of form) {
    valuesArry.push(input.value);
  };
  valuesArry[4] = '$' + parseInt(valuesArry[4]).toLocaleString('en-US');

  valuesArry.pop();

  const newEmployee = document.createElement('tr');

  for (const emp of valuesArry) {
    const cell = document.createElement('td');

    cell.textContent = emp;
    newEmployee.append(cell);
  }

  if (formName.value.length < 4) {
    pushNotification(10, 10, 'Error',
      'Name mnust contain more then 4 chr', 'error');

    return;
  }

  if (formAge.value < 18 || formAge.value > 90) {
    pushNotification(10, 10, 'Error',
      'Age must be between 18 and 90', 'error');

    return;
  }

  if (formAge.value < 18 || formAge.value > 90) {
    pushNotification(10, 10, 'Error',
      'Age must be between 18 and 90', 'error');

    return;
  }

  tbody.append(newEmployee);

  pushNotification(10, 10, 'Success ',
    'New employee successfully added', 'success ');
  form.reset();
});

function pushNotification(posTop, posRight, title, description, type) {
  body.insertAdjacentHTML('beforeend', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
  </div>
  `);

  const messange = document.querySelector('.notification');

  messange.style.right = `${posRight}px`;
  messange.style.top = `${posTop}px`;

  setTimeout(() => {
    body.removeChild(document.querySelector('.notification'));
  }, 3000);
}

for (const cell of document.querySelectorAll('td')) {
  cell.addEventListener('dblclick', (click) => {
    click.preventDefault();

    const clickPlace = click.target;
    const prevText = clickPlace.textContent;

    let input = document.createElement('input');

    input.className = 'cell-input';

    clickPlace.textContent = '';
    input.value = prevText;

    if (clickPlace.cellIndex === 2) {
      const select = document.createElement('select');

      select.insertAdjacentHTML('beforeend', `
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      `);

      input = select;
    };

    clickPlace.append(input);
    input.focus();

    input.onblur = function() {
      if (clickPlace.cellIndex === 0 && input.value.length < 4) {
        clickPlace.innerText = prevText;

        pushNotification(10, 10, 'Error',
          'Name mnust contain more then 4 chr', 'error');

        return;
      }

      if (clickPlace.cellIndex === 3) {
        if (isNaN(input.value)) {
          clickPlace.innerText = prevText;

          pushNotification(10, 10, 'Error',
            'Age must be a number', 'error');

          return;
        };

        if (input.value < 18 || input.value > 90) {
          clickPlace.innerText = prevText;

          pushNotification(10, 10, 'Error',
            'Age must be between 18 and 90', 'error');

          return;
        };
      };

      if (clickPlace.cellIndex === 4) {
        if (!isNaN(input.value)) {
          clickPlace.innerText = '$' + parseInt(input.value)
            .toLocaleString('en-US');

          return;
        } else {
          pushNotification(10, 10, 'Error',
            'Please, enter only numbers without symbols', 'error');
          clickPlace.innerText = prevText;

          return;
        }
      }

      if (input.value.length === '') {
        clickPlace.innerText = prevText;
      }

      clickPlace.innerText = input.value;
      input.remove();
    };

    input.addEventListener('keydown', enter => {
      if (enter.code === 'Enter') {
        input.blur();
      };
    });
  });
};
