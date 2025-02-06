'use strict';

let columns = document.querySelectorAll('thead tr th');
let rows = document.querySelectorAll('tbody tr');
let tbody = document.querySelector('tbody');

let users = [];
const directions = {};
const columnIndex = {
  Name: 0,
  Position: 1,
  Office: 2,
  Age: 3,
  Salary: 4,
};
let currentSortColumn = null;

// Create Array from Users

updateTable();

function updateTable() {
  const newUsers = [];

  columns = document.querySelectorAll('thead tr th');
  rows = document.querySelectorAll('tbody tr');
  tbody = document.querySelector('tbody');

  rows.forEach((row) => {
    const person = [];

    [...row.children].forEach((cell) => {
      person.push(cell.textContent);
    });

    newUsers.push(person);
  });
  users = newUsers;

  return users;
}

// Sort table

function sortByText(usersList, index, direction) {
  return usersList.sort((a, b) => a[index].localeCompare(b[index]) * direction);
}

function sortByAge(usersList, direction) {
  return usersList.sort((a, b) => (a[3] - b[3]) * direction);
}

function sortBySalary(usersList, direction) {
  return usersList.sort((a, b) => {
    const salaryA = wordToNumber(a[4]);
    const salaryB = wordToNumber(b[4]);

    const y = (salaryA - salaryB) * direction;

    return y;
  });
}

function wordToNumber(value) {
  if (value.startsWith('$')) {
    return +value.slice(1).replace(/,/g, '');
  }

  return value;
}

function numberToWord(value) {
  const formatter = new Intl.NumberFormat('en-US');

  return `$${formatter.format(value)}`;
}

columns.forEach((column) => {
  const columnName = column.textContent;

  directions[columnName] = 1;

  column.addEventListener('click', () => {
    const index = columnIndex[columnName];

    if (currentSortColumn !== columnName) {
      directions[columnName] = 1;
      currentSortColumn = columnName;
    } else {
      directions[columnName] *= -1;
    }

    if (index === 3) {
      sortByAge(users, directions[columnName]);
    } else if (index === 4) {
      sortBySalary(users, directions[columnName]);
    } else {
      sortByText(users, index, directions[columnName]);
    }

    tbody.innerHTML = '';

    users.forEach((rowUser) => {
      tbody.appendChild(createRow(rowUser));
    });
  });
});

function createRow(user) {
  const row = document.createElement('tr');

  user.forEach((value, cellIndex) => {
    const cell = document.createElement('td');

    if (cellIndex === 4 && !value.startsWith('$')) {
      cell.textContent = numberToWord(value);
    } else {
      cell.textContent = value;
    }

    row.appendChild(cell);
  });

  return row;
}

// Selecting rows

tbody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');

  if (!currentRow) {
    return;
  }

  if (currentRow.classList.contains('active')) {
    currentRow.classList.remove('active');
  } else {
    document
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));
    currentRow.classList.add('active');
  }
});

// Create form

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

const labelName = document.createElement('label');
const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
labelName.textContent = 'Name: ';

labelName.append(inputName);
form.append(labelName);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
labelPosition.textContent = 'Position: ';
labelPosition.append(inputPosition);
form.append(labelPosition);

const labelOffice = document.createElement('label');
const selectOffice = document.createElement('select');

selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');
labelOffice.textContent = 'Office: ';

const cities = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

for (const city of cities) {
  const value = document.createElement('option');

  value.textContent = city;
  selectOffice.append(value);
}

labelOffice.append(selectOffice);
form.append(labelOffice);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.setAttribute('data-qa', 'age');
inputAge.type = 'number';
labelAge.textContent = 'Age: ';
labelAge.append(inputAge);
form.append(labelAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.setAttribute('data-qa', 'salary');
inputSalary.type = 'number';
labelSalary.textContent = 'Salary: ';
labelSalary.append(inputSalary);
form.append(labelSalary);

const submitBtn = document.createElement('button');

submitBtn.name = 'button';
submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.append(submitBtn);

// Save to table

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (isFormValid()) {
    pushNotification(
      'Success',
      'Successfully added new employee to the table',
      'success',
    );

    const newEmployee = [
      inputName.value,
      inputPosition.value,
      selectOffice.value,
      inputAge.value,
      inputSalary.value,
    ];

    tbody.appendChild(createRow(newEmployee));
    updateTable();
    form.reset();
  } else {
  }
});

function isFormValid() {
  const validName = inputName.value.trim().length >= 4;
  const validAge = +inputAge.value >= 18 && +inputAge.value <= 90;

  if (
    !inputName.value ||
    !inputPosition.value ||
    !inputAge.value ||
    !inputSalary.value
  ) {
    pushNotification('Warning', 'Ensure that there no empty fields', 'warning');

    return false;
  }

  if (!validName) {
    pushNotification('Error', 'Name length less than 3', 'error');

    return false;
  }

  if (!validAge) {
    pushNotification('Error', 'Age less than 18 and greater than 90', 'error');

    return false;
  }

  return true;
}

function pushNotification(title, description, type) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification', type);
  div.setAttribute('data-qa', 'notification');
  div.style.whiteSpace = 'pre-line';

  h2.classList.add('title');
  h2.style.whiteSpace = 'nowrap';
  h2.textContent = title;
  p.textContent = description;

  div.append(h2);
  div.append(p);

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 2000);
}
