'use strict';

// write code here
const tbody = document.querySelector('tbody');
const theadTr = document.querySelectorAll('thead tr');
const form = document.createElement('form');
const body = document.querySelector('body');
let containerName = '';

tbody.addEventListener('dblclick', (elem) => {
  const td = elem.target.closest('td');
  const initialText = td.textContent;

  td.textContent = '';

  const input = document.createElement('input');

  input.setAttribute('class', 'cell-input');
  input.value = initialText;
  td.append(input);
});

form.addEventListener('submit', (elem) => {
  elem.preventDefault();

  const formData = new FormData(form);
  const notification = document.createElement('div');
  const resultCehckForm = checkValidForm(formData);

  if (resultCehckForm[0]) {
    addNewEmployees(formData);

    notification.setAttribute('data-qa', 'notification');
    notification.setAttribute('class', 'success notification');

    notification.textContent = resultCehckForm[1];

    body.append(notification);
  } else {
    notification.setAttribute('data-qa', 'notification');
    notification.setAttribute('class', 'error notification');

    notification.textContent = resultCehckForm[1];

    body.append(notification);
  }

  setTimeout(() => {
    notification.remove();
  }, 2000);
});

tbody.addEventListener('click', (elem) => {
  const row = elem.target.closest('tr');
  const active = document.querySelector('.active');

  if (!row) {
    return;
  }

  if (active !== null) {
    active.classList.remove('active');
  }

  row.classList.add('active');
});

theadTr[0].addEventListener('click', (elem) => {
  const targetName = elem.target.textContent;
  const direction = findDirection(targetName);

  if (
    targetName === 'Name' ||
    targetName === 'Position' ||
    targetName === 'Office'
  ) {
    sortAbc(tbody, targetName, direction);
  } else {
    sort123(tbody, targetName, direction);
  }
});

function sortAbc(elements, nameOrPos, direction) {
  let index = 0;

  if (nameOrPos === 'Name') {
    index = 0;
  } else if (nameOrPos === 'Position') {
    index = 1;
  } else {
    index = 2;
  }

  const elem = elements.children;

  for (let i = 0; i < elem.length; i++) {
    let minItem = elem[i];
    let maxItem = elem[i].children[index].textContent;

    for (let x = i + 1; x < elem.length; x++) {
      if (
        maxItem.localeCompare(elem[x].children[index].textContent) * direction >
        0
      ) {
        maxItem = elem[x].children[index].textContent;
        minItem = elem[x];
      }
    }

    elem[i].before(minItem);
  }
}

function sort123(elements, ageOrSalar, direction) {
  let index = 0;
  const elem = elements.children;

  if (ageOrSalar === 'Age') {
    index = 3;
  } else {
    index = 4;
  }

  for (let i = 0; i < elem.length; i++) {
    let minItem = elem[i];
    let minNumb = elem[i].children[index].textContent;

    for (let x = i + 1; x < elem.length; x++) {
      if (
        parseSalary(minNumb) * direction >
        parseSalary(elem[x].children[index].textContent) * direction
      ) {
        minNumb = elem[x].children[index].textContent;
        minItem = elem[x];
      }
    }

    elem[i].before(minItem);
  }
}

function parseSalary(elements) {
  let result = '';

  for (const elem of elements) {
    if (!Number.isNaN(Number(elem))) {
      result += elem;
    }
  }

  return Number(result);
}

function findDirection(targetName) {
  let result = 1;

  if (targetName === containerName) {
    result = -1;
    containerName = '';
  } else {
    containerName = targetName;
  }

  return result;
}

createForm(form);

function createForm(formElem) {
  const inputs = ['name', 'position', 'office', 'age', 'salary'];
  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  formElem.classList.add('new-employee-form');
  formElem.setAttribute('method', 'post');

  for (const elem of inputs) {
    const label = document.createElement('label');
    let input = document.createElement('input');

    if (elem === 'office') {
      input = document.createElement('select');

      for (const office of offices) {
        const option = document.createElement('option');

        option.setAttribute('value', office);
        option.textContent = office;
        input.append(option);
      }
    }

    if (elem === 'age' || elem === 'salary') {
      input.setAttribute('type', 'number');
    }

    if (elem === 'name' || elem === 'position') {
      input.setAttribute('type', 'text');
    }

    label.textContent = `${elem[0].toUpperCase() + elem.slice(1)}:`;
    input.setAttribute('data-qa', elem);
    input.setAttribute('name', elem);
    input.required = true;

    label.append(input);
    formElem.append(label);
  }

  const submit = document.createElement('button');

  submit.setAttribute('type', 'submit');
  submit.textContent = 'Save to table';

  formElem.append(submit);
  body.append(formElem);

  form.noValidate = true;
}

function addNewEmployees(formData) {
  const tr = document.createElement('tr');

  for (const [key, value] of formData) {
    const td = document.createElement('td');
    let elem = value;

    if (key === 'salary') {
      elem = convertCorrectValue(value);
    }
    td.textContent = elem;
    tr.append(td);
  }

  tbody.append(tr);
}

function convertCorrectValue(value) {
  const numb = String(value).split('').reverse().join('');
  let result = '';
  let counter = 0;

  for (let i = 0; i < numb.length; i++) {
    if (counter === 3) {
      result += ',';
      counter = 0;
    }
    counter++;
    result += numb[i];
  }

  result += '$';

  return result.split('').reverse().join('');
}

function checkValidForm(formData) {
  if (formData.get('name').length < 4) {
    return [false, 'Name must be at least 4 characters'];
  }

  if (formData.get('age') < 18 || formData.get('age') > 90) {
    return [false, 'The age must be between 18 and 90.'];
  }

  if (formData.get('position').length < 4) {
    return [false, 'Fill in the field "Position'];
  }

  return [true, 'Success'];
}
// write code here
