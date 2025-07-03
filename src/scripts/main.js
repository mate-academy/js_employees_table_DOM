'use strict';

const table = document.querySelector('table');
const tBody = document.querySelector('tbody');

const sortingDirection = {};

table.addEventListener('click', (e) => {
  // Система сортировки
  const targetTh = e.target.closest('th');

  if (targetTh) {
    const tr = tBody.querySelectorAll('tr');
    const rows = Array.from(tr);
    const columnIndex = targetTh.cellIndex;
    let direction;

    if (sortingDirection[columnIndex] === 'ASC') {
      direction = 'DESC';
    } else {
      direction = 'ASC';
    }
    sortingDirection[columnIndex] = direction;

    if (targetTh.textContent === 'Salary') {
      getSalarySort(rows, columnIndex, direction);
    } else {
      getStringSort(rows, columnIndex, direction);
    }

    return;
  }

  // Система подсвечивания строки
  const targetTr = e.target.closest('tbody tr');

  if (targetTr) {
    document.querySelectorAll('tbody tr').forEach((row) => {
      row.classList.remove('active');
    });

    targetTr.classList.add('active');
  }
});
// Сортировка по строкам

function getStringSort(rows, thNumber, direction) {
  rows.sort((elemA, elemB) => {
    const valueA = elemA.children[thNumber].textContent;
    const valueB = elemB.children[thNumber].textContent;

    if (direction === 'ASC') {
      return valueA.localeCompare(valueB);
    } else {
      return valueB.localeCompare(valueA);
    }
  });

  return updateTable(rows);
}
// Сортировка по зп

function getSalarySort(rows, thNumber, direction) {
  rows.sort((value1, value2) => {
    const valueA = +value1.children[thNumber].textContent
      .replace('$', '')
      .replace(',', '');
    const valueB = +value2.children[thNumber].textContent
      .replace('$', '')
      .replace(',', '');

    if (direction === 'ASC') {
      return valueA - valueB;
    } else {
      return valueB - valueA;
    }
  });

  return updateTable(rows);
}

function updateTable(rows) {
  tBody.innerHTML = '';
  rows.forEach((row) => tBody.appendChild(row));
}

// Добавление формы

const form = document.createElement('form');
const nameLabel = document.createElement('label');
const namePosition = document.createElement('label');
const nameAge = document.createElement('label');
const nameSalary = document.createElement('label');
const nameOffice = document.createElement('label');

const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');

const selectOffice = document.createElement('select');
const submitButton = document.createElement('button');
const officeNames = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

form.classList.add('new-employee-form');

nameLabel.textContent = 'Name: ';
namePosition.textContent = 'Position: ';
nameAge.textContent = 'Age: ';
nameSalary.textContent = 'Salary: ';
nameOffice.textContent = 'Office: ';
submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

// Настройка текста
inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('name', 'name');
inputName.setAttribute('type', 'text');

inputPosition.setAttribute('data-qa', 'position');
inputPosition.setAttribute('name', 'position');
inputPosition.setAttribute('type', 'text');

inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('name', 'age');
inputAge.setAttribute('type', 'number');

inputSalary.setAttribute('data-qa', 'salary');
inputSalary.setAttribute('name', 'salary');
inputSalary.setAttribute('type', 'number');

selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('name', 'office');

officeNames.forEach((cityName) => {
  const option = document.createElement('option');

  option.textContent = cityName;
  option.value = cityName;
  selectOffice.appendChild(option);
});

// Вставка
nameLabel.appendChild(inputName);
namePosition.appendChild(inputPosition);
nameAge.appendChild(inputAge);
nameSalary.appendChild(inputSalary);
nameOffice.appendChild(selectOffice);

document.body.append(form);
form.appendChild(nameLabel);
form.appendChild(namePosition);
form.appendChild(nameOffice);
form.appendChild(nameAge);
form.appendChild(nameSalary);
form.appendChild(submitButton);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = inputName.value.trim();
  const position = inputPosition.value.trim();
  const office = selectOffice.value;
  const age = +inputAge.value;
  const salary = +inputSalary.value;

  if (
    !userName ||
    !position ||
    !age ||
    !salary ||
    !office ||
    age === '' ||
    salary === ''
  ) {
    pushNotification('error', 'All fields are required');

    return;
  }

  if (userName.length < 4) {
    pushNotification('error', 'Name length less than 4');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('error', 'Age less 18 or bigger than 90');

    return;
  }

  addEmployeeToTable(userName, position, office, age, salary);
  pushNotification('success', 'New employee succsessfully added');
  form.reset();
});

const pushNotification = (type, description) => {
  // write code here
  const notificationDiv = document.createElement('div');
  const h2 = document.createElement('h2');
  const descriptionP = document.createElement('p');

  notificationDiv.classList.add('notification', type);
  notificationDiv.prepend(h2);
  notificationDiv.append(descriptionP);
  notificationDiv.setAttribute('data-qa', 'notification');
  document.body.append(notificationDiv);

  h2.classList.add('title');
  h2.textContent = type;

  descriptionP.textContent = description;

  setTimeout(() => {
    notificationDiv.remove();
  }, 2000);
};

const addEmployeeToTable = (employeeName, position, office, age, salary) => {
  const newTr = document.createElement('tr');
  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');
  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(salary);

  nameCell.textContent = employeeName;
  positionCell.textContent = position;
  officeCell.textContent = office;
  ageCell.textContent = age;
  salaryCell.textContent = formattedSalary;

  newTr.appendChild(nameCell);
  newTr.appendChild(positionCell);
  newTr.appendChild(officeCell);
  newTr.appendChild(ageCell);
  newTr.appendChild(salaryCell);

  document.querySelector('tbody').appendChild(newTr);
};
