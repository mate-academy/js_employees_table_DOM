'use strict';

// Вибір елементів таблиці
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');
const rowtable = table.querySelectorAll('tr');

// індекс поточного відсортування стовпців
let currentSortIndex = -1;
// сортування asc або desc
let currentSortDirection = 'asc';

// Реалізувати сортування таблиці клацанням по заголовку (в двох напрямках)
headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    // перетворюю рядки в масив
    const rows = Array.from(tbody.querySelectorAll('tr'));
    // перевіряю чи є поточні стопці числовими стопцями (3 і 4 є числовим)
    const isNumberColumn = index === 3 || index === 4;

    // Якщо клікаємо на той самий стовпець декілька разів сортування міняється
    if (index === currentSortIndex) {
      // переключаю напрямок сортування
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // якщо натиснути на новий стопчик починати з asc
      currentSortDirection = 'asc';
    }
    // оновлюю індекс стопця який зараз сортується
    currentSortIndex = index;

    // сортування рядків
    rows.sort((a, b) => {
      // отримую текст з вмісту стовпця
      const aText = a.cells[index].textContent.trim();
      const bText = b.cells[index].textContent.trim();

      if (isNumberColumn) {
        // перетворюю на число з плаваючою комою
        const aValue = parseFloat(aText.replace(/[$,]/g, ''));
        const bValue = parseFloat(bText.replace(/[$,]/g, ''));

        // повертає за зростанням або спаданням
        return currentSortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      } else {
        if (aText < bText) {
          return currentSortDirection === 'asc' ? -1 : 1;
        }

        if (aText > bText) {
          return currentSortDirection === 'asc' ? 1 : -1;
        }

        return 0;
      }
    });
    // після сортування повертаю рядки до tbody в правильному порядку
    rows.forEach((row) => tbody.appendChild(row));
  });
});

// Коли користувач клацає рядок, він має стати виділеним
rowtable.forEach((row) => {
  row.addEventListener('click', () => {
    rowtable.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

/* Напишіть сценарій, щоб додати форму до документа */

// створення форми
const form = document.createElement('form');

form.className = 'new-employee-form';

form.action = '/register';
form.method = 'POST';

document.body.appendChild(form);

// поле для Name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.type = 'text';

nameInput.name = 'name';
nameInput.required = true;
nameInput.setAttribute('data-qa', 'name');

nameLabel.appendChild(nameInput);
form.appendChild(nameLabel);

// поле для Position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.type = 'text';

positionInput.name = 'position';
positionInput.required = true;
positionInput.setAttribute('data-qa', 'position');

positionLabel.appendChild(positionInput);
form.appendChild(positionLabel);

// поле для Office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.required = true;

officeSelect.setAttribute('data-qa', 'office');

// створюю масив міст
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// додаю кожен офіс до option
offices.forEach((office) => {
  const option = document.createElement('option');

  option.textContent = office;
  officeSelect.appendChild(option);
});

officeLabel.appendChild(officeSelect);
form.appendChild(officeLabel);

// поле для Age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.type = 'number';

ageInput.name = 'age';
ageInput.required = true;
ageInput.min = 0;
ageInput.setAttribute('data-qa', 'age');

ageLabel.appendChild(ageInput);
form.appendChild(ageLabel);

// поле для Salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';

const salaryInput = document.createElement('input');

salaryInput.type = 'text';

salaryInput.name = 'salary';
salaryInput.required = true;
salaryInput.setAttribute('data-qa', 'salary');

salaryLabel.appendChild(salaryInput);
form.appendChild(salaryLabel);

// обробляю введення зарплати
salaryInput.addEventListener('blur', () => {
  const rawValue = salaryInput.value;
  // видаляю всі символи окрім чисел і розділових крапок
  const numericValue = parseFloat(rawValue.replace(/[^0-9.]/g, ''));

  if (!isNaN(numericValue)) {
    salaryInput.value = numericValue.toLocaleString();
  } else {
    salaryInput.value = '';
  }
});

// кнопка для відправки форми
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);

// обробка натискання кнопки
button.addEventListener('click', (e) => {
  e.preventDefault();

  const namee = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value.trim();
  const age = ageInput.value.trim();
  const salary = salaryInput.value.trim();

  // перевірка валідності
  if (
    !validateForm({
      namee,
      position,
      office,
      age,
      salary,
    })
  ) {
    return;
  }

  // додаю новий рядок до таблиці
  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${namee}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${salary}</td>
  `;

  tbody.appendChild(row);

  // очищую форму
  nameInput.value = '';
  ageInput.value = '';
  positionInput.value = '';
  officeSelect.value = officeSelect.options[0].value;
  salaryInput.value = '';

  pushNotification(
    10,
    10,
    'Title of Success message',
    'Employee added successfully.',
    'success',
  );
});

// функція для валідації форми
function validateForm({ namee, position, office, age, salary }) {
  if (namee.length < 4) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'Name must be at least 4 characters long.',
      'error',
    );

    return false;
  }

  if (!position) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'The position must be entered in the field.',
      'error',
    );

    return false;
  }

  const parsedAge = parseInt(age, 10);

  if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 90) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'Age must be between 18 and 90.',
      'error',
    );
    ageInput.value = '';

    return false;
  }

  const parsedSalary = parseFloat(salary.replace(/[^0-9.]/g, ''));

  if (isNaN(parsedSalary) || parsedSalary < 0) {
    pushNotification(
      10,
      10,
      'Validation Error',
      'Salary must be a valid positive number.',
      'error',
    );
    salaryInput.value = '';

    return false;
  }

  return true;
}

// функція для створення повідомлення
function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  notification.style.cssText = `
    position: absolute;
    top: ${posTop}px;
    right: ${posRight}px;
  `;

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 2000);
}

// редагування комірки

// зберігаю активну комірку для введення
let activeInputCell = null;

tbody.addEventListener('dblclick', (e) => {
  const cellRow = e.target;

  // перевірка чи натиснута комірка
  if (cellRow.tagName !== 'TD' || cellRow.querySelector('input')) {
    return;
  }

  // завершую редагування якщо є активне введення
  if (activeInputCell) {
    saveCellChanges(activeInputCell);
  }

  const origanalText = cellRow.textContent.trim(); // початковий  текст
  const input = document.createElement('input');

  input.type = 'text';
  input.value = origanalText;
  input.className = 'cell-input';

  cellRow.textContent = '';
  cellRow.appendChild(input);
  input.focus(); // ставлю фокус
  activeInputCell = { cellRow, input, origanalText };

  // обробка поля введення
  input.addEventListener('blur', () => {
    saveCellChanges(activeInputCell);
  });

  // натискання enter
  input.addEventListener('keydown', (even) => {
    if (even.key === 'Enter') {
      saveCellChanges(activeInputCell);
    }
  });
});

// функція ля збрерагання змін у комірці
function saveCellChanges({ cellRow, input, origanalText }) {
  const newValue = input.value.trim();

  // якщо значення введене порожнє повертає початкове знаяення
  if (!newValue) {
    cellRow.textContent = origanalText;
  } else {
    cellRow.textContent = newValue;
  }

  // скидаю активний стан
  activeInputCell = null;
}
