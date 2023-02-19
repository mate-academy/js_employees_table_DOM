'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

let counterClick = 0;
let prevSorted = '';

thead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const data = [...tbody.children];

  if (prevSorted === e.target) {
    counterClick++;
  } else {
    counterClick = 0;
  }

  data.sort((a, b) => {
    const contentA = counterClick % 2 === 0
      ? a.cells[index].textContent
      : b.cells[index].textContent;
    const contentB = counterClick % 2 === 0
      ? b.cells[index].textContent
      : a.cells[index].textContent;

    switch (index) {
      case 0 :
      case 1 :
      case 2 : return contentA.localeCompare(contentB);

      case 3 : return contentA - contentB;

      case 4 : return parseInt(contentA.slice(1)) - parseInt(contentB.slice(1));
    }
  });
  tbody.append(...data);

  prevSorted = e.target;
});

tbody.addEventListener('click', (el) => {
  const row = el.target.closest('tr');

  rows.forEach(item => item.classList.remove('active'));

  row.classList.add('active');

});

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" method="POST" class="new-employee-form" id="form">
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
      <select type="select" name="office" data-qa="office" required>
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
      <input type="number" name="age" data-qa="age">
    </label>
    <label>
      Salary:
      <input type="number" name="salary" data-qa="salary" required>
    </label>
    <button>
      Save to table
    </button>
  </form>
`);

const pushNotification = (posTop, posRight, title, description, type) => {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="notification
      ${type}" style="top:${posTop}px;
       right:${posRight}px;">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  setTimeout(() => document.querySelector('div').remove(), 2000);
};

const form = document.querySelector('form');
const errorPhrase = 'Ooops... try again! Enter valid data';
const successPhrase = `New person added`;

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const objData = Object.fromEntries(data.entries());

  const { name: personName, position, office, age, salary } = objData;

  for (const key in objData) {
    if (objData[key] === '') {
      pushNotification(580, 10, errorPhrase,
        'please, fill the all forms', 'error');

      return;
    }
  };

  if (personName.length < 4) {
    pushNotification(580, 10, errorPhrase,
      `Name should be more than 4 letters,
      please fill the form with correct values`,
      'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(580, 10, errorPhrase,
      `The age of employee should be more than 18
      or under than 90 years old`, 'error');

    return;
  }

  if (!office) {
    pushNotification(580, 10, errorPhrase,
      `Choose the office`, 'error');

    return;
  }

  pushNotification(580, 10, successPhrase,
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

  document.getElementById('form').reset();

});
