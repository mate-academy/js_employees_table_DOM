'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const employees = document.querySelector('tbody');
const headers = document.querySelector('thead').children[0].children;
const POS_RIGHT = 10;
const POS_TOP = 10;
const NOTIFICATION_OFFSET = 140;
const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;
const OFFICES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco'];
const FORM_FIELDS = [
  {
    name: 'name',
    type: 'text',
  },
  {
    name: 'position',
    type: 'text',
  },
  {
    name: 'office',
    type: 'select',
    options: OFFICES,
  },
  {
    name: 'age',
    type: 'number',
  },
  {
    name: 'salary',
    type: 'number',
  },
];
let sortingMethod = {};

[...headers].forEach(header => {
  const container = document.createElement('span');

  container.append(header.firstChild);
  header.append(container);
});

function sortTable(e) {
  if (e.target.tagName !== 'SPAN') {
    return;
  }

  const sortBy = e.target.innerText;
  const index = [...headers].findIndex(header => header.innerText === sortBy);
  let callback = null;

  setSortingMethod(sortBy);

  switch (sortBy.toLowerCase()) {
    case 'name':
    case 'position':
    case 'office':
      callback = compareStrings;
      break;
    case 'age':
    case 'salary':
      callback = compareNumbers;
      break;
  }

  const sortedList = [...employees.children].sort((a, b) => {
    return callback(a, b, index);
  });

  for (const employee of sortedList) {
    employees.append(employee);
  }
}

function selectRow(e) {
  [...employees.children].forEach(employee => {
    employee.classList.remove('active');
  });

  e.target.closest('tr').classList.add('active');
}

function submitForm(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formDataObj = Object.fromEntries(formData.entries());
  const errors = validateForm(formDataObj);

  if (Object.keys(errors).length > 0) {
    handleErrors(errors);
  } else {
    const notificationText = `${formDataObj.name} was added to the list!`;

    addEmployee(formDataObj);

    pushNotification(POS_TOP, POS_RIGHT,
      'New employee added', notificationText, 'success');
  }
}

function editCell(e) {
  const initialValue = e.target.innerText;
  const input = document.createElement('input');

  e.target.innerHTML = '';

  input.classList.add('cell-input');
  input.type = 'text';
  input.value = initialValue;
  e.target.append(input);

  function setCellValue(ev) {
    const cell = ev.target.closest('td');
    const newValue = ev.target.value;

    cell.innerText = `${newValue || initialValue}`;
    input.remove();
  }

  input.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter') {
      return;
    }

    input.removeEventListener('blur', setCellValue);
    setCellValue(ev);
  });

  input.addEventListener('blur', setCellValue);
}

function addForm(fields) {
  const form = document.createElement('form');
  const submitButton = document.createElement('button');

  form.classList.add('new-employee-form');
  submitButton.innerText = 'Save to table';
  submitButton.type = 'submit';

  fields.forEach(field => {
    const { name: inputName, type: inputType, options } = field;

    addInput(form, inputName, inputType, options);
  });

  form.append(submitButton);
  body.append(form);
};

function addInput(container, inputName, inputType, options) {
  const label = document.createElement('label');
  const input = document.createElement(`${
    inputType === 'select'
      ? 'select'
      : 'input'}`
  );

  label.innerText = `${capitalize(inputName)}: `;
  input.name = inputName;
  input.dataset.qa = inputName;

  if (inputType === 'select') {
    options.forEach(item => {
      const option = document.createElement('option');

      option.value = item;
      option.innerText = item;
      input.append(option);
    });
  } else {
    input.type = inputType;
  }

  label.append(input);
  container.append(label);
}

function compareStrings(a, b, index) {
  const stringA = a.children[index].innerText;
  const stringB = b.children[index].innerText;

  return sortingMethod.asc
    ? stringA.localeCompare(stringB)
    : stringB.localeCompare(stringA);
}

function compareNumbers(a, b, index) {
  const numA = getNumber(a.children[index].innerText);
  const numB = getNumber(b.children[index].innerText);

  return sortingMethod.asc ? numA - numB : numB - numA;
}

function getNumber(line) {
  return +line.replace('$', '').replace(',', '');
}

function setSortingMethod(sortBy) {
  if (sortingMethod.sortBy === sortBy) {
    sortingMethod.asc = !sortingMethod.asc;
  } else {
    sortingMethod = {
      sortBy,
      asc: true,
    };
  }
}

function capitalize(line) {
  return `${line.charAt(0).toUpperCase()}${line.substring(1)}`;
}

function validateForm(formData) {
  const hasEmptyFields = Object.values(formData).some(value => value === '');
  const errors = {};

  if (hasEmptyFields) {
    errors.filled = {
      'title': 'No empty fields',
      'text': 'Every field is required',
    };

    return errors;
  }

  if (formData.name.length < MIN_NAME_LENGTH) {
    errors.name = {
      'title': 'Invalid Name value',
      'text': 'Name should be at least 4 characters long',
    };
  }

  if (formData.age < MIN_AGE || formData.age > MAX_AGE) {
    errors.age = {
      'title': 'Invalid Age field',
      'text': 'Age should be between 18 and 90 years',
    };
  }

  return errors;
}

function handleErrors(errors) {
  const errorTexts = Object.values(errors);

  for (let i = 0; i < errorTexts.length; i++) {
    const { title, text } = errorTexts[i];

    pushNotification(POS_TOP + NOTIFICATION_OFFSET * i,
      POS_RIGHT, title, text, 'error');
  }
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('block');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.dataset.qa = 'notification';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function addEmployee(info) {
  const employee = document.createElement('tr');
  const { name: employeeName, position, office, age, salary } = info;

  employee.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${stringifySalary(+salary)}</td>
  `;
  employees.append(employee);
}

function stringifySalary(salary) {
  return `$${salary.toLocaleString('en-US')}`;
}

addForm(FORM_FIELDS);
table.addEventListener('click', sortTable);
employees.addEventListener('click', selectRow);
body.addEventListener('submit', submitForm);
employees.addEventListener('dblclick', editCell);
