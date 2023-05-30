'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const form = document.createElement('form');
const thead = table.querySelector('thead tr');
const tbody = table.querySelector('tbody');
const tableRows = document.querySelectorAll('table tbody tr');

const sortState = {
  column: null,
  order: 'asc',
};
let selectedElement = null;

// Масив, в якому зберігатимуться дані про працівників
let employees = [];

// редагування по подвійному кліці  //!не працює після першого редагування
tbody.addEventListener('dblclick', (even) => {
  const selectedElementDblClick = even.target;

  if (selectedElementDblClick.tagName === 'TD') {
    // Отримати поточне значення комірки
    const currentValue = selectedElementDblClick.textContent;

    // Створити поле введення для редагування
    const input = document.createElement('input');

    input.type = 'text';
    input.value = currentValue;

    // Замінити вміст комірки полем введення
    selectedElementDblClick.textContent = '';
    selectedElementDblClick.appendChild(input);

    // Фокус на полі введення
    input.focus();

    // Обробка події втрати фокусу (при завершенні редагування)
    input.addEventListener('blur', () => {
      // Отримати нове значення з поля введення
      const newValue = input.value;

      // Оновити значення комірки
      selectedElementDblClick.textContent = newValue;

      getEmployeeDataFromRow();
      updateTable();
    });
  }
});

// Сортування
thead.addEventListener('click', even => {
  const targetHeader = even.target;

  const headerIndex = Array.from(thead.children).indexOf(targetHeader);

  // Перевіряємо, чи натиснуто на новий заголовок
  if (sortState.column !== headerIndex) {
    // Якщо натиснуто на новий заголовок, скидаємо напрямок сортування до 'asc'
    sortState.order = 'asc';
  } else {
    // Якщо натиснуто на поточний заголовок, змінюємо напрямок сортування
    sortState.order = sortState.order === 'asc' ? 'desc' : 'asc';
  }

  // Оновлюємо поточний стовпець сортування
  sortState.column = headerIndex;

  const sortRows = Array.from(document.querySelectorAll('table tbody tr'));

  sortRows.sort((a, b) => {
    const aTextContent = a.children[headerIndex].textContent;
    const bTextContent = b.children[headerIndex].textContent;

    if (targetHeader.innerHTML === 'Salary') {
      return (+formatSalary(aTextContent) - +formatSalary(bTextContent))
        * (sortState.order === 'asc' ? 1 : -1);
    }

    return (aTextContent.localeCompare(bTextContent))
      * (sortState.order === 'asc' ? 1 : -1);
  });

  tbody.innerHTML = '';

  sortRows.forEach(row => {
    tbody.appendChild(row);
  });
});

// виділення рядка
tbody.addEventListener('click', (even) => {
  const target = even.target;

  if (selectedElement && selectedElement.classList.contains('active')) {
    selectedElement.classList.remove('active');
  }

  selectedElement = target.closest('tr');
  selectedElement.classList.add('active');
});

// Створюємо форму
(function createForm() {
  form.classList.add('new-employee-form');
  form.setAttribute('action', '#');
  form.setAttribute('method', 'post');

  table.after(form);

  form.insertAdjacentHTML('beforeend',
    `<label>Name:
      <input
        name="name"
        type="text"
        required
        data-qa="name">
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
        required
        data-qa="position"
      >
    </label>
    <label>Office:
      <select
        name="office"
        required
        data-qa="office"
      >
        <option value="" disabled selected></option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input
        name="age"
        type="number"
        required
        data-qa="age"
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        required
        data-qa="salary"
      >
    </label>
  <button type="submit">Save to table</button>`);
})();

// Обробник події submit форми
form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Отримуємо значення полів форми
  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const officeSelect = form.querySelector('select[name="office"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  const nam = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value.trim();
  const age = parseInt(ageInput.value.trim());
  const salary = salaryInput.value.trim();

  // Перевіряємо валідність введених даних
  let isValid = true;
  let errorMessage = '';

  if (!isValidName(nam)) {
    isValid = false;
    errorMessage += '- Name should have at least 4 letters.\n';
  }

  if (!isValidAge(age)) {
    isValid = false;
    errorMessage += '- Age should be between 18 and 90.\n';
  }

  if (!isValidSalary(salary)) {
    isValid = false;
    errorMessage += '- Salary should be a valid number.\n';
  }

  // Виводимо повідомлення про помилки, якщо дані не валідні
  if (!isValid) {
    pushNotification('Error', errorMessage, 'error');

    return;
  }

  // Створюємо об'єкт працівника
  const employee = {
    nam,
    position,
    office,
    age,
    salary,
  };

  // Додаємо працівника до масиву і відображаємо його в таблиці
  employees.push(employee);
  updateTable();

  // Очищаємо значення полів форми
  form.reset();

  // Виводимо повідомлення про успішне додавання працівника
  pushNotification('Success', 'New employee has been added.', 'success');
});

// Проходимося по кожному рядку і отримуємо дані про працівника
function getEmployeeDataFromRow() {
  if (employees.length > 0) {
    employees = [];
  }

  tableRows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    const nam = cells[0].textContent;
    const position = cells[1].textContent;
    const office = cells[2].textContent;
    const age = parseInt(cells[3].textContent);
    const salary = formatSalary(cells[4].textContent);

    // Створюємо об'єкт працівника і додаємо його до масиву
    const employee = {
      nam,
      position,
      office,
      age,
      salary,
    };

    employees.push(employee);
  });
}

getEmployeeDataFromRow();
//!  додаткові функції

// Функція для додавання повідомлення у контейнер
function pushNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};

// Функція для перевірки валідності поля "Name"
function isValidName(nam) {
  return nam.length >= 4;
};

// Функція для перевірки валідності поля "Age"
function isValidAge(age) {
  return age >= 18 && age <= 90;
};

// Функція для перевірки валідності поля "Salary"
function isValidSalary(salary) {
  return !isNaN(salary);
};

// Функція для додавання працівника до таблиці
function addEmployeeToTable(employee) {
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>${formatCurrency(employee.salary)}</td>
  `;
  tbody.appendChild(newRow);
};

// Функція для оновлення відображення таблиці
function updateTable() {
  // Очищаємо поточне вміст таблиці
  tbody.innerHTML = '';

  // Додаємо кожного працівника до таблиці
  employees.forEach((employee) => {
    addEmployeeToTable(employee);
  });
};

// Форматування Salary
function formatSalary(string) {
  return string.replace(/[$,]/g, '');
};

function formatCurrency(numberString) {
  // Перетворення рядка на число
  const number = Number(numberString);

  // Перевірка, чи є число дійсним числом
  if (isNaN(number)) {
    return 'Invalid number';
  }

  // Форматування числа у грошовий формат
  const formattedNumber = number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formattedNumber;
};
