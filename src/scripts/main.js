'use strict';

/* =========================
   ОТРИМАННЯ DOM-ЕЛЕМЕНТІВ
========================= */

// Основна таблиця
const table = document.querySelector('table');

// Заголовок таблиці (thead)
const thead = table.querySelector('thead');

// Тіло таблиці (tbody)
const tbody = table.querySelector('tbody');

// Всі заголовки колонок
const headers = thead.querySelectorAll('th');

/* =========================
   СОРТУВАННЯ ТАБЛИЦІ
========================= */

// Зберігаємо стан сортування:
// - column: індекс колонки
// - direction: напрямок сортування
const sortState = {
  column: null,
  direction: 'asc',
};

// Додаємо обробник кліку на кожен заголовок
headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    // Якщо клікнули по тій самій колонці —
    // міняємо напрямок сортування
    if (sortState.column === index) {
      sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      // Якщо клік по новій колонці —
      // сортуємо завжди по зростанню
      sortState.column = index;
      sortState.direction = 'asc';
    }

    // Запускаємо сортування
    sortTable(index, sortState.direction);
  });
});

// Функція сортування таблиці
function sortTable(colIndex, direction) {
  // Перетворюємо HTMLCollection рядків у масив
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    let valA = a.cells[colIndex].textContent.trim();
    let valB = b.cells[colIndex].textContent.trim();

    // Сортування за віком (числа)
    if (colIndex === 3) {
      return direction === 'asc'
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    }

    // Сортування за зарплатою (прибираємо $, коми)
    if (colIndex === 4) {
      valA = Number(valA.replace(/[^0-9]/g, ''));
      valB = Number(valB.replace(/[^0-9]/g, ''));

      return direction === 'asc' ? valA - valB : valB - valA;
    }

    // Сортування текстових значень
    return direction === 'asc'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  // Очищаємо tbody та додаємо відсортовані рядки
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

/* =========================
   ВИБІР РЯДКА (ACTIVE)
========================= */

// При кліку на рядок робимо його активним
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  // Знімаємо active з усіх рядків
  [...tbody.rows].forEach((r) => r.classList.remove('active'));

  // Додаємо active тільки обраному рядку
  row.classList.add('active');
});

/* =========================
   СТВОРЕННЯ ФОРМИ
========================= */

// Створюємо форму динамічно
const form = document.createElement('form');

form.className = 'new-employee-form';

// HTML-структура форми
form.innerHTML = `<label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input data-qa="position" name="position" type="text"></label>
  <label>Office:
    <select data-qa="office" name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
  <button type="submit">Save to table</button>
`;

// Додаємо форму після таблиці
table.after(form);

/* =========================
   СПОВІЩЕННЯ (NOTIFICATION)
========================= */

// Функція показу повідомлень
function showNotification(type, title, text) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <span class="title">${title}</span>
    <p>${text}</p>
  `;

  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
}

/* =========================


ВІДПРАВКА ФОРМИ + ВАЛІДАЦІЯ
========================= */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Отримуємо дані з форми
  const data = Object.fromEntries(new FormData(form));

  // Валідація імені
  if (data.name.length < 4) {
    showNotification(
      'error',
      'Invalid name',
      'Name must contain at least 4 letters',
    );

    return;
  }

  // Валідація віку
  const age = Number(data.age);

  if (age < 18 || age > 90) {
    showNotification('error', 'Invalid age', 'Age must be between 18 and 90');

    return;
  }

  // Перевірка обовʼязкових полів
  if (!data.position || !data.salary) {
    showNotification('error', 'Invalid data', 'All fields are required');

    return;
  }

  // Створюємо новий рядок таблиці
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${age}</td>
    <td>$${Number(data.salary).toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(row);
  form.reset();

  // Повідомлення про успіх
  showNotification('success', 'Success', 'Employee added successfully');
});

/* =========================
   РЕДАГУВАННЯ КЛІТИНКИ (OPTIONAL)
========================= */

// Посилання на активний input
let activeInput = null;

// Обробка подвійного кліку по клітинці
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  // Якщо вже є активне редагування — вихід
  if (!cell || activeInput) {
    return;
  }

  const initialValue = cell.textContent;

  cell.textContent = '';

  // Створюємо input для редагування
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;

  cell.appendChild(input);
  input.focus();
  activeInput = input;

  // Функція збереження значення
  function save() {
    cell.textContent = input.value.trim() || initialValue;
    activeInput = null;
  }

  // Зберігаємо по blur
  input.addEventListener('blur', save);

  // Зберігаємо по Enter
  // eslint-disable-next-line no-shadow
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      save();
    }
  });
});
