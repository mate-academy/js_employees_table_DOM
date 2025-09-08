'use strict';

// write code here
function parseSalary(string) {
  return Number(string.replace(/[^\d.]/g, ''));
}

const table = document.querySelector('table');
const head = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

let currentSortIndex = null;
let currentAsc = true;

const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;

// Сортировка по клику на заголовок
head.forEach((th) => {
  th.addEventListener('click', (e) => {
    const index = Array.from(head).indexOf(e.currentTarget);

    if (currentSortIndex === index) {
      currentAsc = !currentAsc;
    } else {
      currentAsc = true;
    }
    currentSortIndex = index;
    sortRows(currentSortIndex);
  });
});

function sortRows(index) {
  const arrayRows = Array.from(tbody.querySelectorAll('tr'));

  arrayRows.sort((a, b) => {
    const aText = a.cells[index].textContent.trim();
    const bText = b.cells[index].textContent.trim();

    const aNumb = parseSalary(aText);
    const bNumb = parseSalary(bText);

    let compare;

    if (!isNaN(aNumb) && !isNaN(bNumb)) {
      compare = aNumb - bNumb;
    } else {
      compare = aText.localeCompare(bText, undefined, { numeric: true });
    }

    return currentAsc ? compare : -compare;
  });

  arrayRows.forEach((row) => tbody.appendChild(row));
}

// Выделение выбранной строки
tbody.addEventListener('click', (e) => {
  const ourRow = e.target.closest('tr');

  if (!ourRow) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  ourRow.classList.add('active');
});

// Создание формы
function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.setAttribute('novalidate', true);
  document.body.appendChild(form);

  // Name
  const labelName = document.createElement('label');
  const inputName = document.createElement('input');

  labelName.textContent = 'Name:';
  inputName.name = 'name';
  inputName.type = 'text';
  inputName.setAttribute('data-qa', 'name');
  inputName.setAttribute('required', 'required');
  inputName.setAttribute('pattern', '[A-Za-z ]+');
  labelName.appendChild(inputName);
  form.appendChild(labelName);

  // Position
  const labelPosition = document.createElement('label');
  const inputPosition = document.createElement('input');

  labelPosition.textContent = 'Position:';
  inputPosition.name = 'position';
  inputPosition.type = 'text';
  inputPosition.setAttribute('data-qa', 'position');
  inputPosition.setAttribute('required', 'required');
  inputPosition.setAttribute('pattern', '[A-Za-z ]+');
  labelPosition.appendChild(inputPosition);
  form.appendChild(labelPosition);

  // Office
  const labelOffice = document.createElement('label');
  const inputOffice = document.createElement('select');
  const options = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  labelOffice.textContent = 'Office:';
  inputOffice.name = 'office';
  inputOffice.setAttribute('data-qa', 'office');

  options.forEach((city) => {
    const option = document.createElement('option');

    option.textContent = city;
    option.value = city;
    inputOffice.appendChild(option);
  });
  labelOffice.appendChild(inputOffice);
  form.appendChild(labelOffice);

  // Age
  const labelAge = document.createElement('label');
  const inputAge = document.createElement('input');

  labelAge.textContent = 'Age:';
  inputAge.name = 'age';
  inputAge.type = 'number';
  inputAge.setAttribute('data-qa', 'age');
  inputAge.setAttribute('required', 'required');
  inputAge.setAttribute('min', MIN_AGE);
  inputAge.setAttribute('max', MAX_AGE);
  inputAge.setAttribute('pattern', '\\d+');
  labelAge.appendChild(inputAge);
  form.appendChild(labelAge);

  // Salary
  const labelSalary = document.createElement('label');
  const inputSalary = document.createElement('input');

  labelSalary.textContent = 'Salary:';
  inputSalary.name = 'salary';
  inputSalary.type = 'number';
  inputSalary.setAttribute('data-qa', 'salary');
  inputSalary.setAttribute('required', 'required');
  inputSalary.setAttribute('pattern', '\\d+');
  labelSalary.appendChild(inputSalary);
  form.appendChild(labelSalary);

  // Submit button
  const createButton = document.createElement('button');

  createButton.textContent = 'Save to table';
  createButton.type = 'submit';
  form.appendChild(createButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (checkForm()) {
      addNewRow();
    }
  });
}

createForm();

function checkForm() {
  const form = document.querySelector('.new-employee-form');
  const inputName = form.querySelector('input[name="name"]');
  const inputPosition = form.querySelector('input[name="position"]');
  const inputOffice = form.querySelector('select[name="office"]');
  const inputAge = form.querySelector('input[name="age"]');
  const inputSalary = form.querySelector('input[name="salary"]');

  let message = '';
  const messageClass = 'error';

  if (
    !inputName.value.trim() ||
    !inputPosition.value.trim() ||
    !inputOffice.value.trim() ||
    !inputAge.value.trim() ||
    !inputSalary.value.trim()
  ) {
    message = 'Error! Please fill in all fields';
  } else if (inputName.value.trim().length < MIN_NAME_LENGTH) {
    message = 'Error! Name must be at least 4 characters long';
  } else if (
    Number(inputAge.value) < MIN_AGE ||
    Number(inputAge.value) > MAX_AGE
  ) {
    message = 'Error! Age must be between 18 and 90';
  }

  if (message) {
    createErrorMessage(message, messageClass);

    return false;
  }

  return true;
}

function createErrorMessage(message, messageClass) {
  const errorMessage = document.createElement('div');
  const messageTitle = document.createElement('p');

  errorMessage.classList.add('notification', messageClass);
  errorMessage.setAttribute('data-qa', 'notification');
  messageTitle.classList.add('title');
  messageTitle.textContent = message;

  errorMessage.appendChild(messageTitle);
  document.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 4000);
}

function addNewRow() {
  const form = document.querySelector('.new-employee-form');
  const inputName = form.querySelector('input[name="name"]');
  const inputPosition = form.querySelector('input[name="position"]');
  const inputOffice = form.querySelector('select[name="office"]');
  const inputAge = form.querySelector('input[name="age"]');
  const inputSalary = form.querySelector('input[name="salary"]');

  const newRow = document.createElement('tr');

  newRow.setAttribute('data-qa', 'employee-row');

  const formattedSalary = `$${Number(inputSalary.value).toLocaleString('en-US')}`;

  newRow.innerHTML = `
    <td>${inputName.value}</td>
    <td>${inputPosition.value}</td>
    <td>${inputOffice.value}</td>
    <td>${inputAge.value}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();

  createErrorMessage('Employee successfully added to the table!', 'success');

  if (currentSortIndex !== null) {
    sortRows(currentSortIndex);
  }
}
