/* eslint-disable no-shadow */
'use strict';

const head = document.querySelector('thead');
const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const formatter = new Intl.NumberFormat('en-US');

let sortType = 0;
const eventCell = [];

head.addEventListener('click', (event) => {
  const position = event.target.cellIndex;

  const sort = [...tbody.children].sort((a, b) => {
    const sortA = a.cells[position].textContent.replace(',', '')
      .replace('$', '');
    const sortB = b.cells[position].textContent.replace(',', '')
      .replace('$', '');

    if (isNaN(sortA)) {
      return sortA.localeCompare(sortB);
    }

    return sortA - sortB;
  });

  eventCell.push(event.target.cellIndex);

  if (eventCell[1] === undefined) {
    sortType = 1;

    return tbody.append(...sort);
  }

  if (eventCell[eventCell.length - 2] === eventCell[eventCell.length - 1]) {
    if (sortType === 0) {
      sortType = 1;

      return tbody.append(...sort);
    }

    sortType = 0;

    return tbody.append(...sort.reverse());
  }

  if (eventCell[eventCell.length - 2] !== eventCell[eventCell.length - 1]) {
    sortType = 1;

    return tbody.append(...sort);
  }
});

let rowAlreadyActive = 0;
let indexToRemove = 0;

tbody.addEventListener('click', (event) => {
  const tr = tbody.querySelectorAll('tr');
  let index = 0;

  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].querySelectorAll('td');

    if (td[event.target.cellIndex] === event.target) {
      index = i;
    }
  }

  if (rowAlreadyActive === 0) {
    rowAlreadyActive = 1;
    indexToRemove = index;

    return tbody.rows[index].classList.add('active');
  }

  tbody.rows[indexToRemove].classList.remove('active');
  indexToRemove = index;

  return tbody.rows[index].classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form 
    class="new-employee-form"
  >
    <label>Name:
      <input
      data-qa="name"
      name="name"
      type="text"
      required
      >
    </label>

    <label>Position:
      <input
        data-qa="position"
        name="position"
        type="text"
        required
      >
    </label>

    <label>Office:
      <select
        data-qa="office"
        id="office"
        name="office"
        required
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input
        data-qa="age"
        name="age"
        type="number"
        required
      >
    </label>

    <label>Salary:
      <input
        data-qa="salary"
        name="salary"
        type="number"
        required
      >
    </label>

    <button name="button" type="submit">Save to table</button>
  </form>
`);

const pushNotification = (title, description, type) => {
  body.insertAdjacentHTML('beforeend', `
    <div
    style="top: 10px; right: 10px;"
    data-qa="notification"
    class="notification ${type}">
    <h2 class="title">
    ${title}
    </h2>
    <p>
    ${description}
    </p>
    </div>
    `);

  const messages = document.querySelectorAll('.notification');

  setTimeout(() => {
    for (const message of [...messages]) {
      message.remove();
    }
  }, 2000);
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const entries = Object.fromEntries(data.entries());
  const salary = String(formatter.format(entries.salary));

  if (entries.name.length < 4) {
    return pushNotification('Error message',
      'Name has to contain 4 or more letters.',
      'error');
  }

  if (entries.age < 18 || entries.age > 90) {
    return pushNotification('Error message',
      'Age has to be between 18 and 90 years old.',
      'error');
  }

  tbody.insertAdjacentHTML('afterbegin', `
  <tr>
    <td>${entries.name}</td>
    <td>${entries.position}</td>
    <td>${entries.office}</td>
    <td>${entries.age}</td>
    <td>$${salary}</td>
  </tr>
  `);

  pushNotification('Success message',
    'The employee is successfully added to the table.',
    'success');
});
