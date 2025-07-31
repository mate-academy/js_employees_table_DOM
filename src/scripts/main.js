'use strict';

const table = document.querySelector('table');
let currentSortColumn = null;
let isAscending = true;

// Сортировка по клику на th
table.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const header = e.target;
  const columnIndex = header.cellIndex;
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.rows);

  // Удаляем классы сортировки со всех th
  table.querySelectorAll('th').forEach((th) => {
    th.classList.remove('sort-asc', 'sort-desc');
  });

  // Проверка: если клик по той же колонке — поменяй порядок
  if (currentSortColumn === columnIndex) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = columnIndex;
    isAscending = true;
  }

  // Добавляем класс сортировки к активному th
  header.classList.add(isAscending ? 'sort-asc' : 'sort-desc');

  rows.sort((rowA, rowB) => {
    const a = rowA.cells[columnIndex].textContent.trim();
    const b = rowB.cells[columnIndex].textContent.trim();

    // Числа сортируем как числа, остальное как строки
    const valA = isNaN(a) ? a : parseFloat(a);
    const valB = isNaN(b) ? b : parseFloat(b);

    if (valA > valB) {
      return isAscending ? 1 : -1;
    }

    if (valA < valB) {
      return isAscending ? -1 : 1;
    }

    return 0;
  });

  // Очищаем тело таблицы и добавляем отсортированные строки
  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
});

// ВЫДЕЛЕНИЕ СТРОКИ (этот обработчик должен быть отдельно, вне сортировки)
table.querySelector('tbody').addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  // Удаляем класс active у всех строк
  table.querySelectorAll('tbody tr').forEach((row) => {
    row.classList.remove('active');
  });
  // Добавляем класс active только к выбранной строке
  clickedRow.classList.add('active');
});

function showNotification(type, title, message) {
  // Удалить старое уведомление, если есть
  document
    .querySelectorAll('[data-qa="notification"]')
    .forEach((n) => n.remove());

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <span class="title">${title}</span>
    <span>${message}</span>
  `;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

function createEmployeeForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="">Select office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeName = form.elements.name.value.trim();
    const position = form.elements.position.value.trim();
    const office = form.elements.office.value;
    const age = Number(form.elements.age.value);
    const salary = Number(form.elements.salary.value);

    // Валидация
    if (!employeeName || !position || !office || !age || !salary) {
      showNotification('error', 'Error', 'All fields are required');

      return;
    }

    if (employeeName.length < 4) {
      showNotification('error', 'Error', 'Name must be at least 4 characters');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('error', 'Error', 'Age must be between 18 and 90');

      return;
    }

    // Добавление в таблицу
    const tbody = table.querySelector('tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salary}</td>
    `;
    tbody.appendChild(row);

    showNotification('success', 'Success', 'Employee added to table');
    form.reset();
  });

  document.body.appendChild(form);
}

// ...existing code...

table.querySelector('tbody').addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  // Если уже есть input — не создавать новый
  if (cell.querySelector('input')) {
    return;
  }

  // Сохраняем старое значение
  const oldValue = cell.textContent;
  const input = document.createElement('input');

  input.type = 'text';
  input.value = oldValue;
  input.className = 'cell-input';

  // Удаляем другие input в таблице (разрешаем редактировать только одну ячейку)
  table.querySelectorAll('td .cell-input').forEach((inp) => {
    const td = inp.closest('td');

    td.textContent = inp.value || inp.dataset.oldValue;
  });

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  // Сохраняем старое значение в data-атрибуте
  input.dataset.oldValue = oldValue;

  function finishEdit(save) {
    let newValue = input.value.trim();

    if (!save || newValue === '') {
      newValue = input.dataset.oldValue;
    }
    cell.textContent = newValue;
  }

  input.addEventListener('blur', () => finishEdit(true));

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      finishEdit(true);
    }

    if (evt.key === 'Escape') {
      finishEdit(false);
    }
  });
});

createEmployeeForm();
