'use strict';

const minNameLength = 4;
const minAge = 18;
const maxAge = 90;

const table = document.querySelector('table');
const ths = table.querySelectorAll('thead th');
let tbody = table.querySelector('tbody');
let rows = Array.from(tbody.querySelectorAll('tr'));

// создаем форму
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.appendChild(form);

// создаем поле ввода для имени
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';
form.appendChild(nameLabel);

const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('name', 'name');
nameInput.setAttribute('autocomplete', 'name');
nameInput.setAttribute('required', true);
nameLabel.appendChild(nameInput);

// создаем поле ввода для position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';
form.appendChild(positionLabel);

const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('required', true);
positionLabel.appendChild(positionInput);

// создаем поле ввода для office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';
form.appendChild(officeLabel);

const officeSelect = document.createElement('select');

officeSelect.setAttribute('required', true);
officeLabel.appendChild(officeSelect);

const option1 = document.createElement('option');

option1.value = 'Tokyo';
option1.textContent = 'Tokyo';
officeSelect.appendChild(option1);

const option2 = document.createElement('option');

option2.value = 'Singapore';
option2.textContent = 'Singapore';
officeSelect.appendChild(option2);

const option3 = document.createElement('option');

option3.value = 'London';
option3.textContent = 'London';
officeSelect.appendChild(option3);

const option4 = document.createElement('option');

option4.value = 'New-York';
option4.textContent = 'New York';
officeSelect.appendChild(option4);

const option5 = document.createElement('option');

option5.value = 'Edinburgh';
option5.textContent = 'Edinburgh';
officeSelect.appendChild(option5);

const option6 = document.createElement('option');

option6.value = 'San-Francisco';
option6.textContent = 'San Francisco';
officeSelect.appendChild(option6);

// создаем поле ввода для age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';
form.appendChild(ageLabel);

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('required', true);
ageLabel.appendChild(ageInput);

// создаем поле ввода для salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';
form.appendChild(salaryLabel);

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('required', true);
salaryLabel.appendChild(salaryInput);

// создаем кнопку отправки:
const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.innerText = 'Save to table';
form.appendChild(submitButton);

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  //исправление строки на заглавную
  function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase()
    + word.slice(1)).join(' ');
  }

  const nameValue = nameInput.value.trim();
  const positionValue = positionInput.value.trim();
  const officeValue = officeSelect.value;
  const ageValue = parseInt(ageInput.value);
  const salaryValue = salaryInput.value.trim();

  let isValid = true;

  // Проверяем на валидность каждое поле формы
  if (nameValue.length < minNameLength) {
    isValid = false;

    showNotification('error',
      `Name should contain at least ${minNameLength} letters.`);
  }

  if (ageValue < minAge || ageValue > maxAge) {
    isValid = false;
    showNotification('error', `Age should be between ${minAge} and ${maxAge}.`);
  }

  if (isValid) {
    // Если все поля валидны, добавляем нового сотрудника в таблицу
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    const positionCell = document.createElement('td');
    const officeCell = document.createElement('td');
    const ageCell = document.createElement('td');
    const salaryCell = document.createElement('td');

    nameCell.textContent = capitalizeWords(nameValue);
    positionCell.textContent = capitalizeWords(positionValue);
    officeCell.textContent = officeValue;
    ageCell.textContent = ageValue;

    salaryCell.textContent = '$'
    + parseInt(salaryValue).toLocaleString('en-US');

    row.appendChild(nameCell);
    row.appendChild(positionCell);
    row.appendChild(officeCell);
    row.appendChild(ageCell);
    row.appendChild(salaryCell);

    tbody.appendChild(row);

    row.addEventListener('click', () => {
      makeRowActive(row);
    });

    showNotification('success', 'New employee added to the table.');
    form.reset();
  }
});

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification');
  notification.textContent = type + ':' + message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Если кликаем на ряд, ему добавляется класс 'active';
rows.forEach(row => {
  row.addEventListener('click', () => {
    makeRowActive(row);
  });
});

function makeRowActive(row) {
  rows = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach(rowItem => {
    if (rowItem.classList.contains('active')) {
      rowItem.classList.remove('active');
    }
  });

  if (!row.classList.contains('active')) {
    row.classList.add('active');
  }
}

// сортировка таблицы:
ths.forEach(function(th) {
  th.addEventListener('click', function() {
    tbody = table.querySelector('tbody');
    rows = Array.from(tbody.querySelectorAll('tr'));

    const direction = th.getAttribute('data-sort') === 'asc' ? 'desc' : 'asc';

    // Определяем номер столбца, по которому нужно сортировать
    const column = th.cellIndex;

    // Создаем функцию для сортировки строк таблицы
    const sortFunction = makeSortFunction(column, direction);

    // Сортируем строки таблицы и добавляем их обратно в tbody
    const sortedRows = rows.sort(sortFunction);

    tbody.append(...sortedRows);

    // Задаем направление сортировки в атрибуте data-sort заголовка таблицы
    th.setAttribute('data-sort', direction);
  });
});

function makeSortFunction(column, direction) {
  return function(a, b) {
    const aValue = a.children[column].textContent;
    const bValue = b.children[column].textContent;

    if (aValue === bValue) {
      return 0;
    }

    // Определяем, какое значение больше, и возвращаем соответствующее число
    const greater = (aValue > bValue ? 1 : -1);

    return (direction === 'asc' ? greater : -greater);
  };
}
