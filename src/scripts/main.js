/* eslint-disable no-fallthrough */
'use strict';

const menu = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const list = tbody.querySelectorAll('tr');
const tds = tbody.querySelectorAll('td');
let flag = true;
let activeRow = '';

menu.addEventListener('click', e => {
  const item = e.target.closest('th');
  const index = e.target.cellIndex;

  if (!item || !menu.contains(item)) {
    return;
  }
  flag = !flag;

  const sortedCells = [...list]
    .sort((a, b) => {
      const aText = a.children[index].innerText;
      const bText = b.children[index].innerText;

      switch (index) {
        case 0:
        case 1:

        case 2:
          if (flag) {
            return aText.localeCompare(bText);
          } else {
            return bText.localeCompare(aText);
          }

        case 3:

        case 4:
          const aNums = +(aText.replace(/\W/g, ''));
          const bNums = +(bText.replace(/\W/g, ''));

          if (flag) {
            return aNums - bNums;
          } else {
            return bNums - aNums;
          }

        default:
          return 0;
      }
    });

  sortedCells.forEach(el => {
    return tbody.append(el);
  });
});

tbody.addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  selectedRow.classList.add('active');
  activeRow = selectedRow;
});

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" method="POST" class="new-employee-form">
    <label>
      Name:
      <input type="text" name="name" data-qa="name">
    </label>

    <label>
      Position:
      <input type="text" name="position" data-qa="position">
    </label>

    <label>
      Office:
      <select type="select" name="office" data-qa="office">
        <option disabled selected>Choose the city</option>
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
      <input type="text" name="age" data-qa="age">
    </label>

    <label>
      Salary:
      <input type="text" name="salary" data-qa="salary">
    </label>

    <button>
      Save to table
    </button>
  </form>
`);

const pushNotification = (posTop, posRight, title, description, type) => {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="notification" style="top:${posTop}px; right:${posRight}px;">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const div = document.querySelector('div');

  div.classList.add(type);

  setTimeout(() => div.remove(), 2000);
};

const form = document.querySelector('form');
const errorPhrase = 'Ooops... something went wrong';
const successPhrase = `You've done it!`;

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const objData = Object.fromEntries(data.entries());

  const { name: personName, position, office, age, salary } = objData;

  for (const key in objData) {
    if (objData[key] === '') {
      pushNotification(10, 10, errorPhrase,
        'please, fill the all forms', 'error');

      return;
    }
  };

  if (personName.length < 4) {
    pushNotification(10, 10, errorPhrase,
      `Name should be more than 4 letters,
      please fill the form with correct values`,
      'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(10, 10, errorPhrase,
      `The age of employee should be more than 18
      or under than 90 years old`, 'error');

    return;
  }

  if (isNaN(+age)) {
    pushNotification(10, 10, errorPhrase,
      'Age should be a number', 'error');

    return;
  }

  if (isNaN(+salary)) {
    pushNotification(10, 10, errorPhrase,
      'Salary should be a number', 'error');

    return;
  }

  pushNotification(10, 10, successPhrase,
    `Your employee has successfully added`, 'success');

  const numFormat = new Intl.NumberFormat('en-US');
  const money = numFormat.format(salary);

  tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${personName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${money}</td>
  </tr>
  `);
});

for (let i = 0; i < tds.length; i++) {
  tds[i].ondblclick = function() {
    if (this.hasAttribute('data-clicked')) {
      return;
    }
    this.setAttribute('data-clicked', 'yes');
    this.setAttribute('data-text', this.innerHTML);

    const input = document.createElement('input');

    input.setAttribute('type', 'text');
    input.value = this.innerHTML;
    input.style.height = this.offsetHeight - (this.clientTop * 2) + 'px';
    input.style.backgroundColor = '#cbcbcb';
    input.style.textAlign = 'inherit';

    input.onblur = function() {
      const td = input.parentElement;
      const origText = input.parentElement.getAttribute('data-text');
      const currentText = this.value;

      if (origText !== currentText) {
        td.removeAttribute('data-clicked');
        td.removeAttribute('data-text');
        td.innerHTML = currentText;
        td.style.cssText = '';
      } else {
        td.removeAttribute('data-clicked');
        td.removeAttribute('data-text');
        td.innerHTML = origText;
      }
    };

    input.onkeypress = function() {
      if (event.keyCode === 13) {
        this.blur();
      }
    };

    this.innerHTML = '';
    this.append(input);
    this.firstElementChild.select();
  };
}
