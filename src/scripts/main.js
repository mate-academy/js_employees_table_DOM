'use strict';

const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const rows = [...tableBody.rows];
let orderASC = true;
let lastIndex;

tableHead.addEventListener('click', e => {
  const index = e.target.closest('th').cellIndex;

  rows.sort((a, b) => {
    const itemA = a.cells[index].innerText.replace(/[$,]/g, '');
    const itemB = b.cells[index].innerText.replace(/[$,]/g, '');

    return isNaN(itemA)
      ? itemA.localeCompare(itemB)
      : itemA - itemB;
  });

  if (orderASC || lastIndex !== index) {
    orderASC = !orderASC;
  } else {
    rows.reverse();
    orderASC = !orderASC;
  }

  lastIndex = index;
  tableBody.append(...rows);
});

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const selectedRow = document.querySelector('.active');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  row.classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
      <input 
        name="name" 
        data-qa="name">
    </label>

    <label>Position:
      <input 
        name="position" 
        data-qa="position">
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
      <input 
        name="age" 
        type="number" 
        data-qa="age">
    </label>

    <label>Salary:
      <input 
        name="salary" 
        type="number" 
        data-qa="salary">
    </label>
    
    <button type="submit" value="Submit">
      Save to table
    </button>
  </form>
`);

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;

  message.innerHTML = `
    <h2 class = "title">${title}</h2>
    <p>${description}</p>
  `;

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  message.style.boxSizing = 'content-box';
  message.dataset.qa = 'notification';

  body.append(message);

  setTimeout(() => message.remove(), 2000);
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  const { position, office, age, salary } = dataObject;
  const formattedSalary = '$' + parseInt(salary).toLocaleString('en-US');

  if (dataObject.name.length < 4) {
    pushNotification(10, 10, 'Wrong Name!',
      'The Name should have more than 4 letters!', 'error');

    return;
  }

  if (position.length < 2) {
    pushNotification(10, 10, 'Wrong Position!',
      'The position should have more than 2 letters!', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(10, 10, 'Wrong Age!',
      'The employee should be an adult and younger than 90 years!', 'error');

    return;
  }

  if (salary < 0 || salary === '') {
    pushNotification(10, 10, 'Wrong Salary!',
      'The salary should be a positive number!', 'error');

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${dataObject.name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formattedSalary}</td>
    </tr>
  `);

  pushNotification(10, 10, 'Success!',
    'A new employee was added to the table!', 'success');

  form.reset();
});
