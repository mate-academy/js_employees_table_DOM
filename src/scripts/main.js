'use strict';

const tableBody = document.body.querySelectorAll('TBODY')[0];
const tableHead = document.querySelector('THEAD');

let sortFlow = 1;

function sortAlgorythm(e) {
  const rows = [...tableBody.children];

  let index;

  switch (e.target.textContent) {
    case 'Name':
      index = 0;
      break;

    case 'Position':
      index = 1;
      break;

    case 'Office':
      index = 2;
      break;

    case 'Age':
      index = 3;
      break;

    case 'Salary':
      index = 4;
      break;
  }

  if (
    e.target.parentElement.parentElement.tagName === 'THEAD'
  ) {
    if (e.target.textContent === 'Salary') {
      rows.sort(
        (prev, next) =>
          (
            +prev.children[index].textContent
              .slice(1).split(',').join('')
            > +next.children[index].textContent
              .slice(1).split(',').join('')
          )
            ? sortFlow : -sortFlow
      );
    } else {
      rows.sort(
        (prev, next) =>
          (
            prev.children[index].textContent
            > next.children[index].textContent
          )
            ? sortFlow : -sortFlow
      );
    }

    rows.forEach(el => tableBody.append(el));
  }

  sortFlow *= -1;
}

tableHead.addEventListener('click', sortAlgorythm);

let activeKeeper = null;

function indicateAlgorythm(e) {
  if (e.target.tagName === 'TD') {
    if (activeKeeper) {
      activeKeeper.classList.remove('active');
    }
    activeKeeper = e.target.parentElement;
    activeKeeper.classList.add('active');
  } else {
    if (activeKeeper) {
      activeKeeper.classList.remove('active');
    }
  }
}

document.addEventListener('click', indicateAlgorythm);

document.body.insertAdjacentHTML('beforeend', `
  <form class='new-employee-form'>
    <label>
      Name:
      <input data-qa="name" name="name" type="text" required>
    </label>
    <label>
      Position:
      <input data-qa="position" name="position" type="text" required>
    </label>
    <label>
      Office:
      <select data-qa="office" name="office" type="text" required>
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
      <input data-qa="age" name="age" type="number" required>
    </label>
    <label>
      Salary:
      <input data-qa="salary" name="salary" type="number" required>
    </label>
    <button>Save to table</button>
    </form>
`);

const saveButton = document.querySelector('BUTTON');
const form = document.querySelector('FORM');

const numberFormatting = function(n) {
  const formatted = [];

  if (String(n).length % 3 > 0) {
    formatted.push(String(n).substr(0, String(n).length % 3));
  }

  for (let i = String(n).length % 3; i < String(n).length; i += 3) {
    formatted.push(String(n).substr([i], 3));
  }

  return formatted.join(',');
};

const pushNotification = (title, description, type) => {
  const push = document.createElement('div');

  push.dataset.qa = 'notification';

  push.className = `notification ${type}`;
  document.body.append(push);

  const elTitle = document.createElement('h2');

  elTitle.innerText = title;
  elTitle.className = `title`;
  push.append(elTitle);

  const elDiscription = document.createElement('p');

  elDiscription.innerText = description;
  push.append(elDiscription);

  const currentNotification = document.querySelectorAll('.notification');

  push.style.top = `${10 + (currentNotification.length - 1) * 110}px`;
  push.style.right = `10px`;

  function removing() {
    push.remove();
  }

  setTimeout(removing, 2000);
};

function addPerson(e) {
  e.preventDefault();

  const data = new FormData(form);

  if (
    data.get('name').length >= 4
    && data.get('position') !== ''
    && data.get('office') !== ''
    && +data.get('age') >= 18
    && +data.get('age') <= 90
    && data.get('salary') !== ''
  ) {
    tableBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${data.get('name')}</td>
        <td>${data.get('position')}</td>
        <td>${data.get('office')}</td>
        <td>${data.get('age')}</td>
        <td>$${numberFormatting(data.get('salary'))}</td>
      </tr>
    `);

    pushNotification(
      'COOL!',
      'A person has been added!\n',
      'success'
    );
  }

  if (data.get('name').length < 4) {
    pushNotification(
      'Ops!',
      'The person has to have a name\n',
      'error'
    );
  }

  if (data.get('position') === '') {
    pushNotification(
      'Ops!',
      'The person has to have a position\n',
      'error'
    );
  }

  if (+data.get('age') < 18) {
    pushNotification(
      'Ops!',
      'The person has to be older\n',
      'error'
    );
  }

  if (+data.get('age') > 90) {
    pushNotification(
      'Ops!',
      'The person has to be younger\n',
      'error'
    );
  }
}

saveButton.addEventListener('click', addPerson);
