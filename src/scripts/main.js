'use strict';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const th = tHead.querySelectorAll('th');
let clickCounter = 0;
let prevETarget;
const columnNames = getArrayColumnNames(th);
const officeLocations = ['Tokyo', 'Singapore', 'London',
  'New York', 'Edinburgh', 'San Francisco'];

// create form
const body = document.querySelector('body');
const createForm = document.createElement('form');

body.append(createForm);

const form = document.querySelector('form');

form.classList = 'new-employee-form';
form.action = '/';
form.method = 'GET';

//  add fields in form
for (const columnName of columnNames) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  form.append(label);
  label.textContent = `${columnName}:`;

  if (columnName === 'Office') {
    label.append(select);
    select.name = columnName;
    select.dataset.qa = columnName.toLowerCase();

    for (const officeLocation of officeLocations) {
      const option = document.createElement('option');

      select.append(option);

      option.value = officeLocation;
      option.textContent = officeLocation;
    }
  } else {
    label.append(input);
    input.name = columnName;

    if (columnName === 'Name' || columnName === 'Position') {
      input.type = 'text';
    } else {
      input.type = 'number';
    }
    input.dataset.qa = columnName.toLowerCase();
  }
}

// add button
const button = document.createElement('button');

form.append(button);
button.type = 'submit';
button.textContent = 'Save to table';

// sort columns by click
const handler = (e) => {
  const activeRow = tBody.querySelector('.active');
  const item = e.target.textContent;
  const tr = tBody.querySelectorAll('tr');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  if (prevETarget === undefined || item !== prevETarget) {
    clickCounter = 0;
    prevETarget = item;
  }

  if (clickCounter % 2 === 0) {
    sortASC(item, tr);
  } else {
    sortDESC(item, tr);
  }

  clickCounter++;
};

tHead.addEventListener('click', handler, {
  once: false,
});

// highlite row by click
tBody.addEventListener('click', (e) => {
  const item = e.target.parentNode;
  const activeRow = tBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  item.classList = 'active';
});

// save, validate data from field by click, add notifications
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const objectWithData = Object.fromEntries(data.entries());

  const newTr = document.createElement('tr');
  const newDiv = document.createElement('div');

  newDiv.dataset.qa = 'notification';
  newDiv.className = 'notification';

  if ((data.get('Name').length < 4)
    || (data.get('Age') < 18 || data.get('Age') > 90)
    || (data.get('Position').length === 0)) {
    document.body.append(newDiv);
    newDiv.classList.add('error');
    newDiv.textContent = 'Error';
  } else {
    tBody.append(newTr);

    for (const value in objectWithData) {
      const newTd = document.createElement('td');

      newTr.append(newTd);

      if (value === 'Salary') {
        newTd.textContent = formatInputSalary(objectWithData[value]);
      } else {
        newTd.textContent = objectWithData[value];
      }
    }
    document.body.append(newDiv);
    newDiv.classList.add('success');
    newDiv.textContent = 'Success';
  }

  setTimeout(() => {
    newDiv.remove();
  }, 2000);
}, {
  once: false,
});

// doubleclick on the cell
const td = tBody.querySelectorAll('td');

for (const element of td) {
  const input = document.createElement('input');
  const text = element.textContent;

  // dblclick
  element.addEventListener('dblclick', (e) => {
    const item = e.target;

    item.textContent = '';
    item.append(input);
    input.classList = 'cell-input';
    input.value = text;

    if (isNaN(stringToNumber(text))) {
      input.type = 'text';
    } else if (text.includes('$')) {
      input.type = 'number';
      input.value = stringToNumber(text);
    } else {
      input.type = 'number';
    }
  }, {
    once: false,
  });

  // blur
  element.addEventListener('blur', (e) => {
    element.textContent = input.value;
    element.classList.remove();
    input.remove();
  }, true);

  // enter
  element.addEventListener('keypress', (e) => {
    const key = e.key;

    if (key === 'Enter') {
      if (input.value.length === 0) {
        element.textContent = text;
      } else {
        element.textContent = input.value;
      }

      element.classList.remove();
      input.remove();
    }
  },
  {
    once: false,
  });
}

// functions
function getArrayColumnNames(element) {
  const arrayColumnNames = [];

  for (const item of element) {
    arrayColumnNames.push(item.textContent);
  }

  return arrayColumnNames;
}

function getArrayEmployees(element) {
  const arrayEmployees = [];
  const arrayColumnNames = getArrayColumnNames(th);

  for (const employeeData of element) {
    const person = {};

    for (let i = 0; i < employeeData.children.length; i++) {
      person[arrayColumnNames[i]] = employeeData.children[i].textContent;
    }

    arrayEmployees.push(person);
  }

  return arrayEmployees;
}

function sortASC(columnName, element) {
  const arrayEmployees = getArrayEmployees(element);

  if (columnName === 'Name' || columnName === 'Position'
    || columnName === 'Office') {
    arrayEmployees.sort((a, b) => a[columnName].localeCompare(b[columnName]));
  } else {
    arrayEmployees.sort((a, b) => stringToNumber(a[columnName])
      - stringToNumber(b[columnName]));
  }

  for (let i = 0; i < arrayEmployees.length; i++) {
    let counter = 0;

    for (const value in arrayEmployees[i]) {
      tBody.rows[i].cells[counter].textContent = arrayEmployees[i][value];
      counter++;
    }
  }
}

function sortDESC(columnName, element) {
  const arrayEmployees = getArrayEmployees(element);

  if (columnName === 'Name' || columnName === 'Position'
    || columnName === 'Office') {
    arrayEmployees.sort((a, b) => b[columnName].localeCompare(a[columnName]));
  } else {
    arrayEmployees.sort((a, b) => stringToNumber(b[columnName])
      - stringToNumber(a[columnName]));
  }

  for (let i = 0; i < arrayEmployees.length; i++) {
    let counter = 0;

    for (const value in arrayEmployees[i]) {
      tBody.rows[i].cells[counter].textContent = arrayEmployees[i][value];
      counter++;
    }
  }
}

function stringToNumber(string) {
  const resultNumber = string.split(',').join('').replace('$', '');

  return +resultNumber;
}

function formatInputSalary(string) {
  const number = stringToNumber(string);

  return '$' + number.toLocaleString();
}
