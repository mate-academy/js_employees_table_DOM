'use strict';

/* DATA */

let sortedColumn = null;
let isAsc = true;
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const MIN_NAME_LENGTH = 4;
const MIN_AGE = 18;
const MAX_AGE = 90;

createFormUser(document.querySelector('body'));

const tableUsers = document.querySelector('table tbody');
const formAddNewUser = document.querySelector('.new-employee-form');

/* FUNCTIONS */

// fn convert string to number
function toNumber(value) {
  return Number(value.replaceAll('$', '').replaceAll(',', ''));
}

// fn sort table by column
function sortTable(columnIndex, ascending) {
  const arrRows = [...tableUsers.rows];
  const direction = ascending ? 1 : -1;

  arrRows.sort((a, b) => {
    const textA = a.cells[columnIndex].textContent;
    const textB = b.cells[columnIndex].textContent;

    const numA = toNumber(textA);
    const numB = toNumber(textB);

    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return (numA - numB) * direction;
    }

    return textA.localeCompare(textB) * direction;
  });

  tableUsers.append(...arrRows);
}

// fn validate form fields
function validate(data) {
  if (Object.values(data).some((item) => item === '')) {
    return 'All fields are required';
  }

  if (data.name.length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters`;
  }

  const age = Number(data.age);

  if (age < MIN_AGE || age > MAX_AGE) {
    return `Age must be between ${MIN_AGE} and ${MAX_AGE}`;
  }

  return null;
}

// fn create input field
function createInput(title, nameUser, type = 'text') {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = title + ':';
  input.name = nameUser;
  input.type = type;
  input.dataset.qa = nameUser;

  label.append(input);

  return label;
}

// fn create select field
function createSelect(title, nameUser) {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.textContent = title + ':';
  select.name = nameUser;
  select.dataset.qa = nameUser;

  for (const city of offices) {
    const element = document.createElement('option');

    element.value = city;
    element.textContent = city;

    select.append(element);
  }

  label.append(select);

  return label;
}

// fn create add employee form
function createFormUser(elAppend) {
  const formAddUser = document.createElement('form');

  formAddUser.classList.add('new-employee-form');

  const formAddUserBtn = document.createElement('button');

  formAddUserBtn.type = 'submit';
  formAddUserBtn.textContent = 'Save to table';

  formAddUser.append(createInput('Name', 'name'));
  formAddUser.append(createInput('Position', 'position'));
  formAddUser.append(createSelect('Office', 'office'));
  formAddUser.append(createInput('Age', 'age', 'number'));
  formAddUser.append(createInput('Salary', 'salary', 'number'));
  formAddUser.append(formAddUserBtn);
  elAppend.append(formAddUser);
}

// fn show notification
function pushNotification(title, description, type) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  titleElement.classList.add('title');

  titleElement.textContent = title;
  descriptionElement.textContent = description;

  notification.append(titleElement, descriptionElement);

  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

/* EVENTS */

// event: click on header
// sorting
document.querySelector('thead').addEventListener('click', (e) => {
  const cell = e.target.closest('th');

  if (!cell) {
    return;
  }

  const columnIndex = cell.cellIndex;

  if (columnIndex === sortedColumn) {
    isAsc = !isAsc;
  } else {
    sortedColumn = columnIndex;
    isAsc = true;
  }

  sortTable(columnIndex, isAsc);
});

// event: click on row
// row becomes selected
tableUsers.addEventListener('click', (e) => {
  const thisRow = e.target.closest('tr');

  tableUsers.querySelector('.active')?.classList.remove('active');

  if (!thisRow) {
    return;
  }

  thisRow.classList.add('active');
});

// event: add employee to table
formAddNewUser.addEventListener('submit', (e) => {
  e.preventDefault();

  const fields = formAddNewUser.elements;

  const data = {
    name: fields.name.value.trim(),
    position: fields.position.value.trim(),
    office: fields.office.value,
    age: fields.age.value,
    salary: fields.salary.value,
  };

  const error = validate(data);

  if (error) {
    pushNotification('Error', error, 'error');

    return;
  }

  const formattedSalary = '$' + Number(data.salary).toLocaleString('en-US');

  const cellValues = [
    data.name,
    data.position,
    data.office,
    data.age,
    formattedSalary,
  ];

  const row = document.createElement('tr');

  cellValues.forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;

    row.append(cell);
  });

  tableUsers.append(row);

  formAddNewUser.reset();

  pushNotification('Success', 'Employee added to the table', 'success');
});

// event: edit table cell
tableUsers.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (e.target.classList.contains('cell-input')) {
    return;
  }

  const oldContentCell = cell.textContent;
  const input = document.createElement('input');

  cell.textContent = '';
  input.classList.add('cell-input');
  input.type = 'text';
  input.value = oldContentCell;

  cell.append(input);

  input.focus();

  // event: input lost focus
  input.addEventListener('blur', () => {
    let value = input.value.trim();

    if (value === '') {
      value = oldContentCell;
    }

    cell.textContent = value;
  });

  // event: Enter saves, Escape cancels
  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }

    if (keyEvent.key === 'Escape') {
      input.value = oldContentCell;
      input.blur();
    }
  });
});
