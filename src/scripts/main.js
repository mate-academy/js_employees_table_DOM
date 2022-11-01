'use strict';

const body = document.querySelector('body');

body.insertAdjacentHTML('beforeend', `
  <form 
  action="#"
  method="get"
  class="new-employee-form"
  >
    <label>Name: 
      <input 
        name="name" 
        type="text" 
        data-qa="name"
        required
      >
    </label>

    <label>Position: 
      <input 
        name="position" 
        type="text" 
        data-qa="position"
        required
      >
    </label>

    <label>Office:
      <select 
        name="office" 
        data-qa="office"
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
        name="age" 
        type="number" 
        data-qa="age"
        min=0
        required
      >
    </label>

    <label>Salary: 
      <input 
        name="salary" 
        type="number" 
        data-qa="salry"
        min=0
        required
      >
    </label>

    <button type="submit">
      Save to table
    </button>
  </form>
`);

const pushNotification = (type, title, description) => {
  body.insertAdjacentHTML('beforeend', `
  <div 
    class="notification ${type}"
    data-qa="notification"
  >
    <h1 class="title">
      ${title}
    </h1>
    <p>
      ${description}
    </p>
  </div
`);

  setTimeout(() =>
    body.removeChild(document.querySelector('.notification')), 3000
  );
};

const form = document.querySelector('form');
const tbody = document.querySelector('tbody');

function newSalary(number) {
  const newFormat = new Intl.NumberFormat('en-US');

  return newFormat.format(number).replace('', '$');
};

form.addEventListener('submit', (events) => {
  events.preventDefault();

  const newData = new FormData(form);
  const userName = newData.get('name');
  const userAge = newData.get('age');
  const userSalary = newData.get('salary');

  if (userName.length < 4) {
    pushNotification('error', 'Error', 'Name must have more than 3 letters');
  } else if (userAge < 18) {
    pushNotification('warning', 'Warning', 'Sorry, You are too young !');
  } else if (userAge > 90) {
    pushNotification('warning', 'Warning', `
    Sorry, We are looking for younger specialist !
    `);
  } else {
    tbody.insertAdjacentHTML('afterbegin', `
      <tr>
        <td>${newData.get('name')}</td>
        <td>${newData.get('position')}</td>
        <td>${newData.get('office')}</td>
        <td>${newData.get('age')}</td>
        <td>${newSalary(userSalary)}</td>
      </tr>
    `);
    pushNotification('success', 'Success', 'A new employee has been added !');
    form.reset();
  }
});

tbody.addEventListener('click', (ev) => {
  const selected = ev.target.closest('tr');

  [...tbody.children].forEach((row) => {
    row.classList.remove('active');
  });
  selected.classList.add('active');
});

const headTitle = document.querySelector('thead');
let prevIndex = 0;

headTitle.addEventListener('click', ev => {
  const titleIndex = ev.target.cellIndex;
  const sorted = [...tbody.children].sort((a, b) => {
    let sortA = a.cells[titleIndex].innerText;
    let sortB = b.cells[titleIndex].innerText;

    if (sortA.includes('$')) {
      sortA = sortA.replace(/[$,]/g, '');
      sortB = sortB.replace(/[$,]/g, '');

      return sortA - sortB;
    }

    return sortA.localeCompare(sortB);
  });

  if (prevIndex === titleIndex) {
    tbody.append(...sorted.reverse());
    prevIndex = 10;
  } else {
    tbody.append(...sorted);
    prevIndex = titleIndex;
  }
});

tbody.addEventListener('dblclick', ev => {
  const prevContent = ev.target.innerText;
  let newInput = document.createElement('input');

  newInput.classList.add('cell-input');
  ev.target.innerText = '';
  newInput.type = 'text';
  newInput.value = '';

  if (ev.target.cellIndex === 3) {
    newInput.type = 'number';
    newInput.min = 18;
    newInput.max = 90;
  }

  if (ev.target.cellIndex === 4) {
    newInput.type = 'number';
    newInput.min = 0;
  }

  if (ev.target.cellIndex === 2) {
    const select = document.createElement('select');

    select.style.color = '#808080';
    select.style.outlineColor = '#808080';
    select.dataset.qa = 'office';

    select.insertAdjacentHTML('afterbegin', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
      `);
    newInput = select;
  }

  ev.target.append(newInput);
  newInput.focus();

  newInput.addEventListener('blur', () => {
    if (newInput.value === '') {
      ev.target.innerText = prevContent;

      return;
    }

    if (newInput.value < 18) {
      ev.target.innerText = prevContent;
      pushNotification('warning', 'Warning', 'Sorry, You are too young !');

      return;
    }

    if (newInput.value > 90) {
      ev.target.innerText = prevContent;

      pushNotification('warning', 'Warning', `
      Sorry, We are looking for younger specialist !
      `);

      return;
    }

    if (ev.target.cellIndex === 4) {
      ev.target.innerText = newSalary(newInput.value);

      return;
    }

    ev.target.innerText = newInput.value;
    newInput.remove();
  });

  newInput.addEventListener('keypress', events => {
    if (events.code === 'Enter') {
      newInput.blur();
    }
  });
});
