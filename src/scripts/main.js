'use strict';

// Отримуємо заголовки та рядки таблиці
const tHeads = document.querySelectorAll('thead th');
let tRows = document.querySelectorAll('tbody tr');
let lastIndex = null;
let sortAsc = true;

// Додаємо обробники подій на заголовки таблиці
tHeads.forEach((th) => {
  th.addEventListener('click', (e) => {
    const index = Array.from(tHeads).indexOf(e.target);

    if (lastIndex === index) {
      sortAsc = !sortAsc;
    } else {
      sortAsc = true;
    }
    lastIndex = index;
    sortRows(index);
  });
});

// Функція для сортування рядків таблиці
function sortRows(index) {
  tRows = document.querySelectorAll('tbody tr');

  const sortedRows = Array.from(tRows).sort((a, b) => {
    const aValue = a.children[index].textContent;
    const bValue = b.children[index].textContent;

    const aNum = parseFloat(aValue);
    const bNum = parseFloat(bValue);

    let compare;

    if (!isNaN(aNum) && !isNaN(bNum)) {
      compare = aNum - bNum;
    } else {
      compare = aValue.localeCompare(bValue, undefined, { numeric: true });
    }

    return sortAsc ? compare : -compare;
  });

  document.querySelector('tbody').innerHTML = '';

  sortedRows.forEach((row) => {
    document.querySelector('tbody').appendChild(row);
  });
}

// Додаємо обробники подій на рядки таблиці
const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

// Додаємо форму для додавання нового рядка
function addForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.setAttribute('novalidate', ''); // Вимикаємо валідацію браузера
  document.body.appendChild(form);

  // Name
  const labelName = document.createElement('label');
  const inputName = document.createElement('input');

  labelName.textContent = 'Name';
  form.appendChild(labelName);
  inputName.setAttribute('name', 'name');
  inputName.setAttribute('type', 'text');
  inputName.setAttribute('data-qa', 'name');
  inputName.setAttribute('required', 'required');
  inputName.setAttribute('pattern', '[A-Za-z ]+');
  labelName.appendChild(inputName);

  // Position
  const labelPosition = document.createElement('label');
  const inputPosition = document.createElement('input');

  labelPosition.textContent = 'Position';
  form.appendChild(labelPosition);
  inputPosition.setAttribute('name', 'position');
  inputPosition.setAttribute('type', 'text');
  inputPosition.setAttribute('data-qa', 'position');
  inputPosition.setAttribute('required', 'required');
  inputPosition.setAttribute('pattern', '[A-Za-z ]+');
  labelPosition.appendChild(inputPosition);

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

  labelOffice.textContent = 'Office';
  form.appendChild(labelOffice);
  inputOffice.setAttribute('name', 'office');
  inputOffice.setAttribute('data-qa', 'office');
  labelOffice.appendChild(inputOffice);

  options.forEach((optionText) => {
    const option = document.createElement('option');

    option.textContent = optionText;
    option.value = optionText;
    inputOffice.appendChild(option);
  });

  // Age
  const labelAge = document.createElement('label');
  const inputAge = document.createElement('input');

  labelAge.textContent = 'Age';
  form.appendChild(labelAge);
  inputAge.setAttribute('name', 'age');
  inputAge.setAttribute('type', 'number');
  inputAge.setAttribute('data-qa', 'age');
  inputAge.setAttribute('required', 'required');
  inputAge.setAttribute('min', '18');
  inputAge.setAttribute('max', '90');
  inputAge.setAttribute('pattern', '\\d+');
  labelAge.appendChild(inputAge);

  // Salary
  const labelSalary = document.createElement('label');
  const inputSalary = document.createElement('input');

  labelSalary.textContent = 'Salary';
  form.appendChild(labelSalary);
  inputSalary.setAttribute('name', 'salary');
  inputSalary.setAttribute('type', 'number');
  inputSalary.setAttribute('data-qa', 'salary');
  inputSalary.setAttribute('required', 'required');
  inputSalary.setAttribute('pattern', '\\d+');
  labelSalary.appendChild(inputSalary);

  // Submit button
  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';
  submitButton.setAttribute('type', 'submit');
  form.appendChild(submitButton);

  // Submit event
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (checkData()) {
      addNewRow();
    }
  });
}

addForm();

// Перевірка даних форми
function checkData() {
  const form = document.querySelector('.new-employee-form');
  const inputName = form.querySelector('input[name="name"]');
  const inputPosition = form.querySelector('input[name="position"]');
  const inputOffice = form.querySelector('select[name="office"]');
  const inputAge = form.querySelector('input[name="age"]');
  const inputSalary = form.querySelector('input[name="salary"]');

  let message = '';
  const messageClass = 'error';

  if (
    !inputName.value ||
    !inputPosition.value ||
    !inputOffice.value ||
    !inputAge.value ||
    !inputSalary.value
  ) {
    message = 'Error! Please fill in all fields';
  } else if (inputName.value.length < 4) {
    message = 'Error! Name must be at least 4 characters long';
  } else if (inputAge.value < 18 || inputAge.value > 90) {
    message = 'Error! Age must be between 18 and 90';
  }

  if (message) {
    createErrorMessage(message, messageClass);

    return false;
  }

  return true;
}

// Створення повідомлення
function createErrorMessage(message, messageClass) {
  const errorMessage = document.createElement('div');
  const messageTitle = document.createElement('p');

  errorMessage.classList.add('notification', messageClass);
  errorMessage.setAttribute('data-qa', 'notification');
  messageTitle.classList.add('title');
  messageTitle.textContent = message;

  document.body.appendChild(errorMessage);
  errorMessage.appendChild(messageTitle);

  setTimeout(() => {
    errorMessage.remove();
  }, 4000);
}

// Додавання нового рядка
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

  document.querySelector('tbody').appendChild(newRow);
  form.reset();

  createErrorMessage('Employee successfully added to the table!', 'success');

  if (lastIndex !== null) {
    sortRows(lastIndex);
  }
}

// Додаємо обробники подій на клітинки таблиці
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  enableCellEditing(cell);
});

// Функція для увімкнення редагування клітинок
function enableCellEditing(cell) {
  const originalValue = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalValue;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  // Додаємо обробник події для втрати фокусу
  input.addEventListener('blur', () => {
    if (input.value.trim() === '') {
      cell.textContent = originalValue;
    } else {
      cell.textContent = input.value;
    }
    input.remove();
  });

  // Додаємо обробник події для клавіші Enter
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (input.value.trim() === '') {
        cell.textContent = originalValue;
      } else {
        cell.textContent = input.value;
      }
      input.remove();
    }
  });
}
