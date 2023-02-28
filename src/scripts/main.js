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

for (const row of Array.from(tBody.children)) {
  row.addEventListener('click', () => {
    if (statusOfRows === false) {
      row.classList.add('active');
      statusOfRows = true;
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

const labelName = document.createElement('label');

labelName.insertAdjacentText('afterbegin', 'Name:');

labelName.append(inputName);

form.append(labelName);

// position

const inputPosition = document.createElement('input');

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

inputAge.setAttribute('type', 'number');

const labelAge = document.createElement('label');

labelAge.insertAdjacentText('afterbegin', 'Age:');

labelAge.append(inputAge);

form.append(labelAge);

// salary

const inputSalary = document.createElement('input');

inputSalary.setAttribute('type', 'number');

inputSalary.onchange = function() {
  const result = `${Number(inputSalary.value).toLocaleString('en-US')}`;

  inputSalary.value = result;
};

const labelSalary = document.createElement('label');

labelSalary.insertAdjacentText('afterbegin', 'Salary:');

labelSalary.append(inputSalary);

form.append(labelSalary);

// submit

const submit = document.createElement('button');

submit.innerHTML = 'Save to table';

form.append(submit);

// add qa-attributes

const inputs = document.querySelectorAll('input');

const dataAttributes = ['name', 'position', 'age', 'salary'];

for (let i = 0; i < Array.from(inputs).length; i++) {
  Array.from(inputs)[i].dataset.qa = dataAttributes[i];
}

select.dataset.qa = 'office';
