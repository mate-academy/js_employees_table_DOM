'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');
const rows = tBody.querySelectorAll('tr');

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

  if (names.value.length < 4) {
    getNotification(
      'Too short name',
      'Your name should be more then 4 letters',
      'error');
  } else if (!position.value.length) {
    getNotification(
      'Fill your position',
      'This field should be fill',
      'error');
  } else if (+age.value < 18 || +age.value > 90) {
    getNotification(
      'Error',
      'Your age < 18 or more then 90',
      'error');
  } else if (salary.value.length < 2) {
    getNotification(
      'This salary is too small',
      'Fill salary field',
      'error');
  } else {
    addNewEmployer(names, position, office, age, salary);

    getNotification(
      'Success',
      'New Employee added',
      'success');

    names.value = '';
    position.value = '';
    age.value = '';
    salary.value = '';
  }
});

// function for adding new employer
function addNewEmployer(
  names,
  position,
  office,
  age,
  salary) {
  const newRow = tBody.insertRow(-1);
  let newCell = newRow.insertCell(0);
  const nameForm = document.createTextNode(names.value);

  newCell.appendChild(nameForm);
  newCell = newRow.insertCell(1);

  const positionForm = document.createTextNode(position.value);

  newCell.appendChild(positionForm);
  newCell = newRow.insertCell(2);

  const officeForm = document.createTextNode(office.value);

  newCell.appendChild(officeForm);
  newCell = newRow.insertCell(3);

  const ageForm = document.createTextNode(age.value);

  newCell.appendChild(ageForm);
  newCell = newRow.insertCell(4);

  const salaryForm = document.createTextNode('$'
  + salary.value.replace(/\B(?=(\d{3})+(?!\d))/g, ','));

  newCell.appendChild(salaryForm);
};

// Function for notification
function getNotification(title, description, type) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.dataset.qa = 'notification';

  div.insertAdjacentHTML('afterbegin', `
  <h2>${title}</h2> 
  <p>${description}</p>
  `);

  body.append(div);

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
