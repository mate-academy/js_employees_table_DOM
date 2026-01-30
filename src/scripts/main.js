'use strict';

const thead = document.querySelector('thead tr');
const btns = thead.children;
const nameBtn = btns[0];
const positionBtn = btns[1];
const officeBtn = btns[2];
const ageBtn = btns[3];
const salaryBtn = btns[4];
const table = document.querySelector('table');

const tbody = document.querySelector('tbody');
const getRows = () => [...tbody.querySelectorAll('tr')];

tbody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');

  if (!currentRow) {
    return;
  }

  [...tbody.rows].forEach((tr) => tr.classList.remove('active'));

  currentRow.classList.add('active');
});

table.insertAdjacentHTML(
  'afterend',
  `<form class="new-employee-form">
  <label>Name: <input name="name" data-qa="name" type="text"></label>
  <label>Position: <input name="position" data-qa="position" type="text"></label>
  <label>Age: <input name="age" data-qa="age" type="number"></label>
  <label>Salary: <input name="salary" data-qa="salary" type="number"></label>
  <label>Office: <select name="office" data-qa="office">
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  </select>
  </label>
  <button type="submit">Save to table</button>
  </form>
   <div data-qa="notification" class="notification">
    <p class="title"></p>
  </div>
  `,
);

const form = document.querySelector('form');
const notification = document.querySelector('.notification');
const titleOfNotification = document.querySelector('.title');

const getNotification = (text, field) => {
  notification.className = 'notification';
  notification.classList.add(field);
  titleOfNotification.textContent = text;
};

const sortState = {
  0: 'asc',
  1: 'asc',
  2: 'asc',
  3: 'asc',
  4: 'asc',
};

let lastSortedColumn = null;

function sortColumn(index, isNumber = false) {
  const rows = getRows();

  let direction = 1;

  if (lastSortedColumn === index) {
    direction = sortState[index] === 'asc' ? -1 : 1;
  } else {
    sortState[index] = 'asc';
    direction = 1;
  }

  rows.sort((a, b) => {
    let valueA = a.children[index].textContent.trim();
    let valueB = b.children[index].textContent.trim();

    if (isNumber) {
      valueA = +valueA.replace(/[^\d]/g, '');
      valueB = +valueB.replace(/[^\d]/g, '');

      return (valueA - valueB) * direction;
    }

    return valueA.localeCompare(valueB) * direction;
  });

  sortState[index] = direction === 1 ? 'asc' : 'desc';
  lastSortedColumn = index;

  tbody.append(...rows);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const nameValue = formData.get('name');
  const positionValue = formData.get('position');
  const ageValue = formData.get('age');
  const salaryValue = formData.get('salary');
  const officeValue = formData.get('office');
  const normalizedSalaryValue = `$${Number(salaryValue).toLocaleString('en-US')}`;

  if (!nameValue) {
    getNotification('Name is required.', 'error');

    return;
  }

  if (nameValue.length < 4) {
    getNotification('The name must be longer than 4 letters.', 'error');

    return;
  }

  if (!positionValue) {
    getNotification('Position is required.', 'error');

    return;
  }

  if (!ageValue) {
    getNotification('Age is required.', 'error');

    return;
  }

  if (+ageValue < 18 || +ageValue > 90) {
    getNotification(
      'Age must be no less than 18 and no more than 90 years.',
      'error',
    );

    return;
  }

  if (!salaryValue) {
    getNotification('Salary is required.', 'error');

    return;
  }

  if (!officeValue) {
    getNotification('Office is required.', 'error');

    return;
  }

  tbody.insertAdjacentHTML(
    'beforeend',
    `<tr>
      <td>${nameValue}</td>
      <td>${positionValue}</td>
      <td>${officeValue}</td>
      <td>${ageValue}</td>
      <td>${normalizedSalaryValue}</td>
    </tr>`,
  );

  getNotification('The employee has been successfully added.', 'success');
});

nameBtn.addEventListener('click', () => {
  sortColumn(0);
});

positionBtn.addEventListener('click', () => {
  sortColumn(1);
});

officeBtn.addEventListener('click', () => {
  sortColumn(2);
});

ageBtn.addEventListener('click', () => {
  sortColumn(3, true);
});

salaryBtn.addEventListener('click', () => {
  sortColumn(4, true);
});
