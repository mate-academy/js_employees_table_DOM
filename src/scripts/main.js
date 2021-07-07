'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');
const rows = table.tBodies[0].rows;
let clicked;
let sort;

// function for cell's 'Salary'(from string to number);
function getSalaryNumber(salary) {
  return +salary.substr(1).split(',').join('');
}

// sort
tHead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const elem = e.target;

  clicked = (clicked === index) ? -1 : index;

  sortable(elem, index, clicked === index);
});

function sortable(elem, index, isClicked) {
  const newRows = Array.from(rows);

  if (elem.textContent === 'Salary') {
    sort = newRows.sort((a, b) =>
      getSalaryNumber(b.children[index].innerText)
      - getSalaryNumber(a.children[index].innerText));
  } else {
    sort = newRows.sort((a, b) =>
      (a.children[index].innerText
      < b.children[index].innerText)
        ? 1
        : -1);
  }

  if (isClicked) {
    sort.reverse();
  }

  for (const row of rows) {
    tBody.removeChild(row);
  }

  for (const newRow of sort) {
    tBody.appendChild(newRow);
  }
};

// changed color for row

table.addEventListener('click', (e) => {
  if (e.target.closest('th')) {
    return;
  }

  const chooseRow = e.target.closest('tr');
  const activeRow = table.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  chooseRow.classList.add('active');
});

// create form

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
  <input name="name" type="text" data-qa="name" required>
  </label>
  <label>Position:
  <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office:
  <select name="office" data-qa="office" required>
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
  </select>
  </label>
  <label>Age:
  <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary:
  <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`);

document.body.append(form);

const btn = form.querySelector('button');
const formData = document.querySelector('.new-employee-form');

// checking the form for filling
btn.addEventListener('click', (e) => {
  e.preventDefault();

  const names = formData.children[0].firstElementChild;
  const position = formData.children[1].firstElementChild;
  const office = formData.children[2].firstElementChild;
  const age = formData.children[3].firstElementChild;
  const salary = formData.children[4].firstElementChild;

  if (names.value.length < 4 || !names.value) {
    return getNotification(10, 30,
      'Too short name',
      'Your name should be more then 4 letters',
      'error');
  }

  if (!position.value.length) {
    return getNotification(110, 30,
      'Fill your position',
      'This field should be fill',
      'error');
  }

  if (+age.value < 18 || +age.value > 90 || !age.value) {
    return getNotification(220, 30,
      'Error',
      'Your age < 18 or more then 90',
      'error');
  }

  if (salary.value.length < 2 || !salary.value) {
    return getNotification(330, 30,
      'This salary is too small',
      'Fill salary field',
      'error');
  }

  addNewEmployer(names, position, office, age, salary);

  getNotification(10, 30,
    'Success',
    'New Employee added',
    'success');

  names.value = '';
  position.value = '';
  age.value = '';
  salary.value = '';
});

// function for adding new employer
function getUpperCaseFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1)
}
function addNewEmployer(
  names,
  position,
  office,
  age,
  salary) {
  const tr = document.createElement('tr');
  const salaryForm = '$'
  + salary.value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  tr.insertAdjacentHTML('beforeend', `
  <td>${getUpperCaseFirstLetter(names.value)}</td>
  <td>${getUpperCaseFirstLetter(position.value)}</td>
  <td>${office.value}</td>
  <td>${age.value}</td>
  <td>${salaryForm}</td> 
  `);

  tBody.appendChild(tr);
};

// Function for notification
function getNotification(positionTop, positionRight, title, description, type) {
  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.classList.add('notification', type);

  div.insertAdjacentHTML('beforeend', `
  <h2 class='title'>${title}</h2>
  <p>${description}</p>
  `);

  div.style.top = positionTop + 'px';
  div.style.right = positionRight + 'px';

  document.body.append(div);
  setTimeout(() => div.remove(), 2000);
};

// change cells
tBody.addEventListener('dblclick', e => {
  const activeCell = e.target;
  const cellValue = activeCell.innerHTML;

  activeCell.innerHTML = '';

  activeCell.insertAdjacentHTML('beforeend', `
    <input class="cell-input">
  `);

  const input = activeCell.querySelector('input');

  input.focus();

  const newCellValue = () => {
    if (input.value === '') {
      activeCell.innerHTML = cellValue;
    } else {
      activeCell.innerHTML = input.value;
    }
  };

  input.addEventListener('focusout', newCellValue);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      newCellValue();
    }
  });
});
