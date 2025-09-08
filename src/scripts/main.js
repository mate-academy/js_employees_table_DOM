'use strict';

// write code here

function parseSalary(string) {
  const cleaned = string.replace(/[^\d.]/g, '');

  return cleaned === '' ? NaN : Number(cleaned);
}

const table = document.querySelector('table');
const head = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

let currentSortIndex = null;
let currentAsc = true;

const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;

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

    const aNum = parseSalary(aText);
    const bNum = parseSalary(bText);

    let compare;

    if (!isNaN(aNum) && !isNaN(bNum)) {
      compare = aNum - bNum;
    } else {
      compare = aText.localeCompare(bText, undefined, { numeric: true });
    }

    return currentAsc ? compare : -compare;
  });

  arrayRows.forEach((row) => tbody.appendChild(row));
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  // оставляем novalidate, так как все проверки в JS
  form.setAttribute('novalidate', true);
  document.body.appendChild(form);

  const labelName = document.createElement('label');

  labelName.textContent = 'Name: ';

  const inputName = document.createElement('input');

  inputName.name = 'name';
  inputName.type = 'text';
  inputName.setAttribute('data-qa', 'name');
  inputName.setAttribute('required', 'required');
  labelName.appendChild(inputName);
  form.appendChild(labelName);

  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position: ';

  const inputPosition = document.createElement('input');

  inputPosition.name = 'position';
  inputPosition.type = 'text';
  inputPosition.setAttribute('data-qa', 'position');
  inputPosition.setAttribute('required', 'required');
  labelPosition.appendChild(inputPosition);
  form.appendChild(labelPosition);

  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office: ';

  const inputOffice = document.createElement('select');

  inputOffice.name = 'office';
  inputOffice.setAttribute('required', 'required');
  inputOffice.setAttribute('data-qa', 'office');

  const options = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  options.forEach((city) => {
    const option = document.createElement('option');

    option.textContent = city;
    option.value = city;
    inputOffice.appendChild(option);
  });
  labelOffice.appendChild(inputOffice);
  form.appendChild(labelOffice);

  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age: ';

  const inputAge = document.createElement('input');

  inputAge.name = 'age';
  inputAge.type = 'number';
  inputAge.setAttribute('data-qa', 'age');
  inputAge.setAttribute('required', 'required');
  inputAge.setAttribute('min', MIN_AGE);
  inputAge.setAttribute('max', MAX_AGE);
  labelAge.appendChild(inputAge);
  form.appendChild(labelAge);

  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary: ';

  const inputSalary = document.createElement('input');

  inputSalary.name = 'salary';
  inputSalary.type = 'number';
  inputSalary.setAttribute('data-qa', 'salary');
  inputSalary.setAttribute('required', 'required');
  labelSalary.appendChild(inputSalary);
  form.appendChild(labelSalary);

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
  }

  const letters = inputName.value.match(/[A-Za-z]/g) || [];

  if (!message && letters.length < MIN_NAME_LENGTH) {
    message = 'Error! Name must have at least 4 letters';
  }

  if (!message && !/^[A-Za-z ]+$/.test(inputName.value)) {
    message = 'Error! Name must contain only letters and spaces';
  }

  if (
    !message &&
    (Number(inputAge.value) < MIN_AGE || Number(inputAge.value) > MAX_AGE)
  ) {
    message = 'Error! Age must be between 18 and 90';
  }

  if (message) {
    createNotification(message, messageClass);

    return false;
  }

  return true;
}

function createNotification(message, messageClass) {
  // Удаляем старые уведомления
  document
    .querySelectorAll('[data-qa="notification"]')
    .forEach((n) => n.remove());

  const notification = document.createElement('div');

  notification.classList.add('notification', messageClass);
  notification.setAttribute('data-qa', 'notification');

  const title = document.createElement('p');

  title.classList.add('title');
  title.textContent = message;

  const description = document.createElement('p');

  description.classList.add('description');

  description.textContent =
    messageClass === 'success' ? 'Employee added successfully!' : message;

  notification.appendChild(title);
  notification.appendChild(description);
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 4000);
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
  createNotification('Employee added to the table!', 'success');

  if (currentSortIndex !== null) {
    sortRows(currentSortIndex);
  }
}
