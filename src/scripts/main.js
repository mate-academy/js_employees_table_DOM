'use strict';

// write code here
const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

// це пустий об'єкт, ключ це індех колонки, а значення це напрям
const sortDirections = {};

function parseSalary(str) {
  return Number(str.replace(/[^\d.-]/g, ''));
}

function formatSalary(value) {
  // Перетворюємо рядок на число
  const number =
    typeof value === 'string' ? Number(value.replace(/[^\d.-]/g, '')) : value;

  // Форматуємо число з комами і додаємо $
  return '$' + number.toLocaleString('en-US');
}

function sort(table, target) {
  const rows = Array.from(table.rows);
  const ths = Array.from(thead.querySelectorAll('th'));
  const indexOfColumn = ths.indexOf(target);

  // це перемикач коли викликаємо ф-цію, якщо було true стане false і навпаки
  sortDirections[indexOfColumn] = !sortDirections[indexOfColumn];

  // це напрям сортування, якщо true - за зростання, якщо false - за спаданням
  const ascending = sortDirections[indexOfColumn];

  const sortedRows = rows.sort((row1, row2) => {
    const a = row1.cells[indexOfColumn].textContent.trim();
    const b = row2.cells[indexOfColumn].textContent.trim();

    let compare = 0;

    if (indexOfColumn === 3) {
      // числове порівняння для "Age"
      compare = Number(a) - Number(b);
    } else if (indexOfColumn === 4) {
      // числове порівняння для "Salary"
      compare = parseSalary(a) - parseSalary(b);
    } else {
      // текстове порівняння
      compare = a.localeCompare(b);
    }

    return ascending ? compare : -compare;
  });

  table.innerHTML = '';
  sortedRows.forEach((row) => table.append(row));
}

function showNotification(type, title, description) {
  // Якщо є попереднє повідомлення — видаляємо
  const oldMessage = document.querySelector('[data-qa="notification"]');

  if (oldMessage) {
    oldMessage.remove();
  }

  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  const messageTitle = document.createElement('h2');

  messageTitle.classList.add('title');
  messageTitle.textContent = title;

  const messageDescription = document.createElement('p');

  messageDescription.textContent = description;

  message.append(messageTitle, messageDescription);
  body.append(message);

  setTimeout(() => message.remove(), 2000);
}

thead.addEventListener('click', (e) => {
  const myTarget = e.target.closest('th');

  if (!myTarget) {
    return;
  }

  sort(tbody, myTarget);
});

tbody.addEventListener('click', (e) => {
  const rows = Array.from(tbody.rows);
  const beforeSelected = rows.find((tr) => tr.classList.contains('active'));

  if (beforeSelected) {
    beforeSelected.classList.remove('active');
  }

  const selectedRow = e.target.closest('tr');

  if (!selectedRow) {
    return;
  }

  selectedRow.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const headers = Array.from(thead.querySelectorAll('th'));

// Опції для select полів (можна розширювати)
const selectOptions = {
  Office: [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ],
};

headers.forEach((header) => {
  const fieldName = header.textContent.trim();
  let fieldElement;

  if (selectOptions[fieldName]) {
    fieldElement = document.createElement('select');

    selectOptions[fieldName].forEach((optionValue) => {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;
      fieldElement.append(option);
    });
  } else {
    fieldElement = document.createElement('input');
    fieldElement.name = fieldName.toLocaleLowerCase();

    if (fieldElement.name === 'age' || fieldElement.name === 'salary') {
      fieldElement.type = 'number';
    } else {
      fieldElement.type = 'text';
    }
  }

  fieldElement.required = true;

  const label = document.createElement('label');

  label.textContent = `${fieldName}:`;
  fieldElement.dataset.qa = fieldName.toLowerCase();

  label.append(fieldElement);
  form.append(label);
});

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

body.append(form);

form.addEventListener('submit', (e) => {
  const checkArray = [];

  e.preventDefault();

  const newTr = document.createElement('tr');

  headers.forEach((header) => {
    const fieldName = header.textContent.trim().toLowerCase();
    const field = form.querySelector(`[data-qa="${fieldName}"]`);

    let checkBoolien = true;
    let value;

    if (fieldName === 'age') {
      value = Number(field.value);

      if (value < 18 || value > 90 || !isFinite(value)) {
        checkBoolien = false;
      }
    } else if (fieldName === 'salary') {
      if (!isFinite(field.value)) {
        checkBoolien = false;
      }
      value = formatSalary(field.value);
    }
    else {
      value = field.value.trim();

      // Для текстових полів перевіряємо, що не пусте
      if (!value) {
          checkBoolien = false;
      }

      // Додаткова перевірка мін. довжини тільки для Name
      if (fieldName === 'name' && value.length < 4) {
          checkBoolien = false;
      }
    }

    if (!checkBoolien) {
      checkArray.push(checkBoolien);
    }

    const td = document.createElement('td');

    td.textContent = value;
    newTr.append(td);
  });

  const message = document.createElement('div');

  message.classList.add('notification');
  message.dataset.qa = 'notification';

  const messageTitle = document.createElement('h2');

  messageTitle.classList.add('title');

  const messageDesription = document.createElement('p');

  messageDesription.style.whiteSpace = 'pre-line';

  if (checkArray.length > 0) {
    showNotification(
      'error',
      'Error',
      'Please enter valid values, then try again.',
    );

    return;
  }

  showNotification(
    'success',
    'Success',
    'Your data successfully added to the table.',
  );
  tbody.append(newTr);
});

// блокуємо будь-яке виділення тексту в tbody
tbody.addEventListener('selectstart', (e) => {
  e.preventDefault();
});

tbody.addEventListener('dblclick', (e) => {
  const currentCell = e.target.closest('td');

  if (!currentCell) {
    return;
  }

  // Якщо вже є активне поле вводу — не дозволяємо створювати ще одне
  const existingInput = tbody.querySelector('input.cell-input');

  if (existingInput) {
    return;
  }

  // Зберігаємо старе значення
  const oldValue = currentCell.textContent.trim();

  const input = document.createElement('input');

  input.classList.add('cell-input');

  currentCell.textContent = '';
  currentCell.append(input);
  input.focus();

  const saveValue = () => {
    const newValue = input.value.trim();

    // якщо нічого не вводили буде старе
    currentCell.textContent = newValue || oldValue;
  };

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (evnt) => {
    if (evnt.key === 'Enter') {
      saveValue();
    }
  });
});
