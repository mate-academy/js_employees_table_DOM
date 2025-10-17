'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

let sortColumn = null;
let sortDirection = true; // true = ASC, false = DESC
let activeInput = null;

// ===== СОРТУВАННЯ =====
function sortTable(index, direction) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const cellA = a.children[index].textContent.trim().replace(/[^\d.]/g, '');
    const cellB = b.children[index].textContent.trim().replace(/[^\d.]/g, '');

    const isNumber = index === 3 || index === 4;
    let compare;

    if (isNumber) {
      compare = Number(cellA) - Number(cellB);
    } else {
      compare = a.children[index].textContent
        .trim()
        .localeCompare(b.children[index].textContent.trim());
    }

    return direction ? compare : -compare;
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.append(row));
}

thead.addEventListener('click', (ev) => {
  const th = ev.target.closest('th');

  if (!th) {
    return;
  }

  const index = Array.from(thead.querySelectorAll('th')).indexOf(th);

  if (sortColumn === index) {
    sortDirection = !sortDirection;
  } else {
    sortColumn = index;
    sortDirection = true;
  }

  sortTable(sortColumn, sortDirection);
});

// ===== ВИДІЛЕННЯ =====
tbody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }
  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

// ===== ФОРМА =====
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" min="18" max="90" step="1" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" min="1" step="1" required></label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

// ===== НОТИФІКАЦІЯ =====
function showNotification(title, message, type = 'success') {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.innerHTML = `<span class="title">${title}</span><p>${message}</p>`;
  document.body.append(notification);
  setTimeout(() => notification.remove(), 3000);
}

// ===== ФОРМАТУВАННЯ ЗАРПЛАТИ =====
function formatSalary(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// ===== SUBMIT =====
form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  const nameEmp = data.name.trim();
  const position = data.position.trim();
  const office = data.office;
  const age = Number(data.age);
  const salary = Number(data.salary);

  // NAME VALIDATION
  const nameLetters = nameEmp.match(/[A-Za-z]/g) || [];

  if (nameLetters.length < 4) {
    showNotification(
      'Error',
      'The name must contain at least 4 letters',
      'error',
    );

    return;
  }

  // POSITION VALIDATION
  const positionLetters = position.match(/[A-Za-z]/g) || [];

  if (positionLetters.length < 2) {
    showNotification(
      'Error',
      'The position must contain at least 2 letters',
      'error',
    );

    return;
  }

  // AGE VALIDATION
  if (Number.isNaN(age) || age < 18 || age > 90) {
    showNotification(
      'Error',
      'Age must be between 18 and 90 years old',
      'error',
    );

    return;
  }

  // SALARY VALIDATION
  if (Number.isNaN(salary) || salary <= 0) {
    showNotification('Error', 'Salary must be a positive number', 'error');

    return;
  }

  // ADD ROW
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameEmp}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formatSalary(salary)}</td>
  `;
  tbody.append(newRow);
  form.reset();

  showNotification('Success', 'Employee added to table', 'success');

  // Ресортуємо без зміни напрямку
  if (sortColumn !== null) {
    sortTable(sortColumn, sortDirection);
  }
});

// ===== РЕДАГУВАННЯ КЛІТИН =====
tbody.addEventListener('dblclick', (ev) => {
  const cell = ev.target.closest('td');

  if (!cell) {
    return;
  }

  // Закриваємо попередній інпут
  if (activeInput) {
    activeInput.blur();
  }

  const oldValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();
  activeInput = input;

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveCellValue();
    }
  });

  input.addEventListener('blur', saveCellValue);

  function saveCellValue() {
    let newValue = input.value.trim();

    if (!newValue) {
      newValue = oldValue;
    }

    const colIndex = cell.cellIndex;

    if (colIndex === 4) {
      // Salary column
      const num = Number(newValue.replace(/[^\d.]/g, ''));

      cell.textContent = formatSalary(num);
    } else {
      cell.textContent = newValue;
    }

    activeInput = null;
  }
});
