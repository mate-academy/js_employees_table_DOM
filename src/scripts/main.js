'use strict';

document.body.style.alignItems = 'flex-start';

const headList = document.querySelector('thead');
const headName = [...document.querySelectorAll('thead th')]
  .map(columnName => columnName.innerText);

const body = document.querySelector('tbody');
const rows = [...body.querySelectorAll('tr')];
const getCellContent = (row, n) =>
  row.children[n].textContent.replace(/[$,]/g, '');

headList.addEventListener('click', (e) => {
  let sorted;
  const target = e.target.closest('th').innerText;
  const numOfColum = headName.indexOf(target);

  if (numOfColum >= 3) {
    sorted = rows.sort((a, b) =>
      getCellContent(a, numOfColum) - (getCellContent(b, numOfColum)));
  } else {
    sorted = rows.sort((a, b) =>
      getCellContent(a, numOfColum).localeCompare(
        getCellContent(b, numOfColum)));
  };
  sorted.map(i => body.appendChild(i));
});

headList.addEventListener('dblclick', (e) => {
  let sorted;
  const target = e.target.closest('th').innerText;
  const numOfColum = headName.indexOf(target);

  if (numOfColum >= 3) {
    sorted = rows.sort((a, b) =>
      getCellContent(b, numOfColum) - (getCellContent(a, numOfColum)));
  } else {
    sorted = rows.sort((a, b) =>
      getCellContent(b, numOfColum).localeCompare(
        getCellContent(a, numOfColum)));
  };

  sorted.map(i => body.appendChild(i));
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const citiesOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const formInputs = [
  ['Name', 'text'],
  ['Position', 'text'],
  ['Age', 'number'],
  ['Salary', 'number'],
];

function addInput(inputName, inputType) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.innerText = inputName + ': ';
  input.type = inputType;
  input.name = inputName.toLowerCase();
  input.dataset.qa = inputName.toLowerCase();

  label.append(input);

  return label;
};

for (const [input, type] of formInputs) {
  form.append(addInput(input, type));
};

form.querySelector(':nth-child(2)').after((() => {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.innerText = 'Office: ';
  select.name = 'office';
  select.dataset.qa = 'office';

  for (const city of citiesOptions) {
    select.append(new Option(city));
  }

  label.append(select);

  return label;
})());

const button = document.createElement('button');

button.type = 'submit';
button.innerText = 'Save to table';

form.append(button);

function saveDataToTable(data) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>$${Number(data.salary).toLocaleString('en-US')}</td>
  `;

  body.append(tr);
};

const pushNotification = (title, description, type) => {
  const messageConteiner = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  document.body.append(messageConteiner);
  messageConteiner.append(messageTitle);
  messageConteiner.append(messageDescription);
  messageConteiner.classList.add('notification', type);
  messageConteiner.classList.add(`${type}`);
  messageConteiner.dataset.qa = 'notification';
  messageTitle.classList.add('title');
  messageTitle.textContent = title;
  messageDescription.textContent = description;

  setTimeout(() => messageConteiner.remove(), 3000);
};

function checkValidation(data) {
  if (!data.name.match(/^[a-zA-Z ]*$/g)) {
    pushNotification('Invalid data',
      'Only English allowed!',
      'error');

    return false;
  }

  if (data.name.length < 4) {
    pushNotification('Invalid name',
      'Name is too short, enter the correct one!',
      'error');

    return false;
  }

  if (data.age < 18 || data.age > 90) {
    pushNotification('Invalid age',
      'Enter the correct age!',
      'error');

    return false;
  }

  if (data.position === '' || data.salary === '') {
    pushNotification('Missing data',
      'Please, fill all fields!',
      'error');

    return false;
  }

  pushNotification('Great!',
    'New employee successfully added!',
    'success'
  );

  return true;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  if (!checkValidation(data)) {
    return;
  }

  saveDataToTable(data);
  form.reset();
});

body.addEventListener('dblclick', (e) => {
  const target = e.target;
  const input = document.createElement('input');
  const initialValue = target.innerText;

  input.classList.add('cell-input');
  input.type = 'text';
  input.name = 'cellInput';
  target.innerText = '';
  target.append(input);
  input.focus();

  const isString = target.cellIndex === 0
    || target.cellIndex === 1;
  const isName = target.cellIndex === 0;
  const isOffice = target.cellIndex === 2;
  const isAge = target.cellIndex === 3;
  const isSalary = target.cellIndex === 4;

  function changeCellContent(value = initialValue) {
    target.innerText = value;
    input.remove();
  }

  function saveEditedField() {
    if (!input.value) {
      changeCellContent();

      return;
    }

    if ((isAge || isSalary) && !input.value.match(/[0-9]/)) {
      changeCellContent();

      return;
    }

    if (isString && input.value.match(/[0-9]/)) {
      changeCellContent();

      return;
    }

    if (isSalary && input.value.match(/[0-9]/)) {
      changeCellContent('$' + input.value
        .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

      return;
    }

    if (isName && input.value.length < 4) {
      changeCellContent();

      return;
    }

    if (isName && !input.value.match(/^[a-zA-Z ]*$/g)) {
      changeCellContent();

      return;
    }

    if (isAge && (+input.value < 18 || +input.value > 90)) {
      changeCellContent();

      return;
    }

    if (isOffice && !citiesOptions.includes(input.value)) {
      changeCellContent();

      return;
    }

    changeCellContent(input.value);
  }

  input.onblur = () => {
    saveEditedField();
  };

  input.onkeydown = (keyboardEvent) => {
    const isEnter = keyboardEvent.code === 'Enter';

    if (isEnter) {
      saveEditedField();
    }
  };
});
