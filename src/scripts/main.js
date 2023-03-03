'use strict';

// sorting by clicking on the title (in two directions)

const tBody = document.querySelector('tbody');

const data = [...tBody.children];

const titles = document.querySelectorAll('th');

function sortFnAsc(cellIndex) {
  data.sort((a, b) => {
    const contentA = a.cells[cellIndex].innerHTML;
    const contentB = b.cells[cellIndex].innerHTML;

    switch (cellIndex) {
      case 3:
        return contentA - contentB;
      case 4:
        return getNumber(contentA) - getNumber(contentB);
      default:
        return contentA.localeCompare(contentB);
    }
  });
};

function sortFnDesc(cellIndex) {
  data.sort((a, b) => {
    const contentA = a.cells[cellIndex].innerHTML;
    const contentB = b.cells[cellIndex].innerHTML;

    switch (cellIndex) {
      case 3:
        return contentB - contentA;
      case 4:
        return getNumber(contentB) - getNumber(contentA);
      default:
        return contentB.localeCompare(contentA);
    }
  });
};

function getNumber(arg) {
  return Number(arg.replace(',', '').replace('$', ''));
}

let lastClick;
let sortOfType = 'asc';

titles.forEach(th => th.addEventListener('click', (e) => {
  if (lastClick === e.target.cellIndex) {
    if (sortOfType === 'desc') {
      sortFnDesc(e.target.cellIndex);
      sortOfType = 'asc';
    } else {
      sortFnAsc(e.target.cellIndex);
      sortOfType = 'desc';
    }
  } else {
    sortFnAsc(e.target.cellIndex);
    sortOfType = 'desc';
    lastClick = e.target.cellIndex;
  }

  tBody.append(...data);
}));

// after user clicks row become selected.

let statusOfRows = false;
let lastClickOnRow;

for (const row of Array.from(tBody.children)) {
  row.addEventListener('click', (e) => {
    if (statusOfRows === true) {
      if (lastClickOnRow === e.target) {
        row.classList.toggle('active');
        statusOfRows = false;
      } else {
        for (const row2 of Array.from(tBody.children)) {
          row2.classList.remove('active');
        }
        row.classList.toggle('active');
        lastClickOnRow = e.target;
      }
    } else {
      row.classList.toggle('active');
      statusOfRows = true;
      lastClickOnRow = e.target;
    }
  });
}

// Create a form that allows users to add new employees to the spreadsheet.

const form = document.createElement('form');

form.classList.add('new-employee-form');

const body = document.querySelector('body');

body.append(form);

// create inputs, select, button

// name

const inputName = document.createElement('input');

inputName.setAttribute('name', 'name');

inputName.setAttribute('type', 'text');

inputName.setAttribute('minlength', '4');

inputName.setAttribute('required', '');

const labelName = document.createElement('label');

labelName.insertAdjacentText('afterbegin', 'Name:');

labelName.append(inputName);

form.append(labelName);

// position

const inputPosition = document.createElement('input');

inputPosition.setAttribute('required', '');

const labelPosition = document.createElement('label');

labelPosition.insertAdjacentText('afterbegin', 'Position:');

labelPosition.append(inputPosition);

form.append(labelPosition);

// select

const select = document.createElement('select');

const labelSelect = document.createElement('label');

labelSelect.insertAdjacentText('afterbegin', 'Office:');

labelSelect.append(select);

form.append(labelSelect);

// add options to select

for (let i = 0; i < 6; i++) {
  const cities = [
    'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
  ];

  const option = document.createElement('option');

  option.innerHTML = cities[i];

  select.append(option);
}

// age

const inputAge = document.createElement('input');

inputAge.setAttribute('min', '18');

inputAge.setAttribute('max', '90');

inputAge.setAttribute('required', '');

inputAge.setAttribute('type', 'number');

const labelAge = document.createElement('label');

labelAge.insertAdjacentText('afterbegin', 'Age:');

labelAge.append(inputAge);

form.append(labelAge);

// salary

const inputSalary = document.createElement('input');

inputSalary.setAttribute('required', '');

inputSalary.setAttribute('type', 'text');

inputSalary.onchange = function() {
  inputSalary.value = `$${Number(inputSalary.value).toLocaleString('en-US')}`;
};

const labelSalary = document.createElement('label');

labelSalary.insertAdjacentText('afterbegin', 'Salary:');

labelSalary.append(inputSalary);

form.append(labelSalary);

// submit

const submit = document.createElement('button');

submit.setAttribute('type', 'submit');

submit.innerHTML = 'Save to table';

form.append(submit);

// add qa-attributes

const inputs = document.querySelectorAll('input');

const dataAttributes = ['name', 'position', 'age', 'salary'];

for (let i = 0; i < Array.from(inputs).length; i++) {
  Array.from(inputs)[i].dataset.qa = dataAttributes[i];
}

select.dataset.qa = 'office';

// click on button add employee to table

const pushNotification = (posTop, posRight, title, description, type) => {
  const notificationElement = document.createElement('div');

  notificationElement.classList.add('notification');

  notificationElement.dataset.qa = 'notification';

  notificationElement.classList.add(`${type}`);

  const titleOfNotification = document.createElement('h2');

  titleOfNotification.classList.add('title');

  titleOfNotification.append(title);

  notificationElement.append(titleOfNotification);

  const descriptionOfNotification = document.createElement('p');

  descriptionOfNotification.append(description);

  notificationElement.append(descriptionOfNotification);

  notificationElement.style.top = `${posTop}px`;
  notificationElement.style.right = `${posRight}px`;

  body.append(notificationElement);

  setTimeout(() => notificationElement.remove(), 2000);
};

const addEmployee = function(e) {
  e.preventDefault();

  if (body.querySelector('.notification')) {
    return;
  }

  if (
    inputName.value.length < 4
    || inputAge.value < 18
    || inputAge.value > 90
    || inputPosition.value === ''
    || inputSalary.value === '') {
    pushNotification(450, 190, 'Error message', `${
      inputName.value < 4 ? 'Name must be more than 4 characters long'
        : inputAge.value < 18 || inputAge.value > 90 ? `Age must be at least 18`
        + ` and not more than 90`
          : inputPosition.value === '' ? 'Fill in the Position field'
            : inputSalary.value === '' ? 'Complete the Salary field'
              : ''}`, 'error');
  } else {
    pushNotification(450, 190,
      'Success message', 'User successfully added', 'success');

    tBody.insertAdjacentHTML('beforeend',
      `<tr>
        <td>${inputName.value}</td>
        <td>${inputPosition.value}</td>
        <td>${select.value}</td>
        <td>${inputAge.value}</td>
        <td>${inputSalary.value}</td>
    </tr>
    `);
  }
};

submit.addEventListener('click', addEmployee);

// editing of table cells by double-clicking

const cells = document.querySelectorAll('td');

const changeCell = function(e) {
  const inputCell = document.createElement('input');

  inputCell.classList.add('cell-input');

  const saveStartValue = e.target.innerText;

  e.target.innerText = '';

  e.target.append(inputCell);

  inputCell.focus();

  inputCell.onblur = function() {
    const cellValue = inputCell.value;

    inputCell.remove();

    if (!inputCell.value) {
      e.target.innerText = saveStartValue;

      return;
    }

    e.target.innerText = cellValue;
  };

  inputCell.addEventListener('keydown', function(e2) {
    if (e2.code === 'Enter') {
      const cellValue2 = inputCell.value;

      inputCell.remove();

      if (!inputCell.value) {
        e.target.innerText = saveStartValue;

        return;
      }

      e.target.innerText = cellValue2;
    }
  });
};

for (let i = 0; i < Array.from(cells).length; i++) {
  Array.from(cells)[i].setAttribute('tabindex', `${i}`);
  Array.from(cells)[i].addEventListener('dblclick', changeCell);
}
