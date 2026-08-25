'use strict';

// write code here
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');
let sortedHeader = null;
let sortDirection = 'asc';
let currentEditingCell = null;

// 1. Сортування таблиці
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (sortedHeader === header) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortedHeader = header;
      sortDirection = 'asc';
    }

    rows.sort((rowA, rowB) => {
      let valueA = rowA.children[index].textContent.trim();
      let valueB = rowB.children[index].textContent.trim();

      // Числове сортування для Age (індекс 3) та Salary (індекс 4)
      if (index === 3 || index === 4) {
        valueA = Number(valueA.replace(/[$,]/g, '')) || 0;
        valueB = Number(valueB.replace(/[$,]/g, '')) || 0;

        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const result = valueA.localeCompare(valueB);

      return sortDirection === 'asc' ? result : -result;
    });

    tbody.append(...rows);
  });
});

// 2. Вибір рядка (клас 'active')
tbody.addEventListener('click', (e) => {
  // Якщо клікнули на інпут під час редагування, не змінюємо активний рядок
  if (e.target.closest('.cell-input')) {
    return;
  }

  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((item) => {
    item.classList.remove('active');
  });
  row.classList.add('active');
});

// 3. Створення та додавання форми на сторінку
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

// 4. Функція сповіщень
function showNotification(type, title, description) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add(type);

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// 5. Валідація та додавання нового співробітника
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const ageValue = form.elements.age.value.trim();
  const salaryValue = form.elements.salary.value.trim();

  // Перевірка на заповненість усіх полів
  if (!employeeName || !position || !office || !ageValue || !salaryValue) {
    showNotification('error', 'Invalid data', 'All fields are required');

    return;
  }

  // Перевірка довжини імені
  if (employeeName.length < 4) {
    showNotification(
      'error',
      'Invalid name',
      'Name must contain at least 4 letters',
    );

    return;
  }

  // Перевірка віку
  const age = Number(ageValue);

  if (age < 18 || age > 90) {
    showNotification('error', 'Invalid age', 'Age must be between 18 and 90');

    return;
  }

  const salary = Number(salaryValue);

  // Створення та вставка нового рядка
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.append(row);

  showNotification(
    'success',
    'Success',
    'Employee has been added to the table',
  );
  form.reset();
});

// 6. Редагування клітинок таблиці по подвійному кліку
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || currentEditingCell) {
    return;
  } // Тільки одна клітинка за раз

  currentEditingCell = cell;

  const initialValue = cell.textContent.trim();

  // Визначаємо чисте значення для інпуту (прибираємо $ та коми для Salary)
  const isSalary = cell.cellIndex === 4;
  const cleanValue = isSalary
    ? initialValue.replace(/[$,]/g, '')
    : initialValue;

  const input = document.createElement('input');

  input.type = cell.cellIndex === 3 || isSalary ? 'number' : 'text';
  input.classList.add('cell-input');
  input.value = cleanValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  // Функція збереження змін
  const saveChanges = () => {
    const newValue = input.value.trim();

    if (!newValue) {
      // Якщо інпут порожній, повертаємо початкове значення
      cell.textContent = initialValue;
    } else if (isSalary) {
      // Форматуємо зарплату назад у грошовий вигляд
      const numSalary = Number(newValue) || 0;

      cell.textContent = `$${numSalary.toLocaleString('en-US')}`;
    } else {
      cell.textContent = newValue;
    }

    currentEditingCell = null;
  };

  // Збереження по втраті фокусу
  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur(); // тригерить обробник 'blur'
    }
  });
});
