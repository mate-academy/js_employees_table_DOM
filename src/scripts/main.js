'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = tbody.rows;
const th = thead.querySelectorAll('th');

thead.addEventListener('click', e => {
  if (e.target.getAttribute('data-sorted') === 'ASC') {
    if (e.target.textContent === 'Name') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          b.children[0].textContent < a.children[0].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Position') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          b.children[1].textContent < a.children[1].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Office') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          b.children[2].textContent < a.children[2].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Age') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          b.children[3].textContent < a.children[3].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Salary') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          +b.children[4].textContent.slice(1).split(',').join('')
            - +a.children[4].textContent.slice(1).split(',').join(''));
      };

      tbody.append(...sortNames(tr));
    };

    for (let i = 0; i < th.length; i++) {
      th[i].removeAttribute('data-sorted');
    }

    e.target.setAttribute('data-sorted', 'DESC');
  } else {
    if (e.target.textContent === 'Name') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          a.children[0].textContent < b.children[0].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Position') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          a.children[1].textContent < b.children[1].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Office') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          a.children[2].textContent < b.children[2].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Age') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          a.children[3].textContent < b.children[3].textContent ? -1 : 1);
      };

      tbody.append(...sortNames(tr));
    };

    if (e.target.textContent === 'Salary') {
      const sortNames = function(arr) {
        return [...arr].sort((a, b) =>
          +a.children[4].textContent.slice(1).split(',').join('')
            - +b.children[4].textContent.slice(1).split(',').join(''));
      };

      tbody.append(...sortNames(tr));
    };

    for (let i = 0; i < th.length; i++) {
      th[i].removeAttribute('data-sorted');
    }

    e.target.setAttribute('data-sorted', 'ASC');
  }
});

tbody.addEventListener('click', e => {
  const patentTarget = e.target.parentElement;
  // const active = document.getElementsByClassName('active');
  // console.log(active);



  for (let i = 0; i < tr.length; i++) {
    tr[i].classList.remove('active');
  };

  patentTarget.classList.add('active');

  // console.log(active);
  // console.log(tbody.contains(active[0]));
});

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input
      id="name"
      data-qa="name"
      name="name"
      type="text"
      required
    >
  </label>
  <label>Position:
    <input
      id="position"
      data-qa="position"
      name="position"
      type="text"
      required
    >
  </label>
  <label>Office:
    <select
      id="office"
      data-qa="office"
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
      id="age"
      data-qa="age"
      name="age"
      type="number"
      required
    >
  </label>
  <label>Salary:
    <input
      id="salary"
      data-qa="salary"
      name="salary"
      type="number"
      required
    >
  </label>
  <button>Save to table</button>
`);

const nameInput = form.querySelector('#name');
const positionInput = form.querySelector('#position');
const officeInput = form.querySelector('#office');
const ageInput = form.querySelector('#age');
const salaryInput = form.querySelector('#salary');
const button = form.querySelector('button');

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  document.body.append(div);
  div.append(h2);
  div.append(p);

  div.className = 'notification';
  div.setAttribute('data-qa', 'notification');
  div.classList.add(type);
  h2.className = 'title';
  h2.textContent = title;
  p.textContent = description;

  setTimeout(() => {
    div.remove();
  }, 2000);
};

button.addEventListener('click', e => {
  e.preventDefault();

  if (nameInput.value.length < 4) {
    pushNotification(
      'Erorr',
      'Name should be longer than 4 letters',
      'error'
    );

    return;
  }

  if (positionInput.value.length < 4) {
    pushNotification(
      'Erorr',
      'Position name should be longer than 4 letters',
      'error'
    );

    return;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    pushNotification(
      'Erorr',
      'Age should be between 18-90',
      'error'
    );

    return;
  }

  if (salaryInput.value < 100) {
    pushNotification(
      'Erorr',
      'Salary should be more 100',
      'error'
    );

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${nameInput.value}</td>
      <td>${positionInput.value}</td>
      <td>${officeInput.value}</td>
      <td>${ageInput.value}</td>
      <td>$${Intl.NumberFormat('en-US').format(salaryInput.value)}</td>
    </tr>
  `);

  nameInput.value = null;
  positionInput.value = null;
  officeInput.value = 'Tokyo';
  ageInput.value = null;
  salaryInput.value = null;

  pushNotification(
    'Success',
    'Employee has been added',
    'success'
  );
});
