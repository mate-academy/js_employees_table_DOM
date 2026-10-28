'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

// --- 1. СТВОРЕННЯ ТА ДОДАВАННЯ ФОРМИ ---
const form = document.createElement('form');

form.className = 'new-employee-form';

// Name
const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.setAttribute('data-qa', 'name');
nameLabel.append(nameInput);

// Position
const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.setAttribute('data-qa', 'position');
positionLabel.append(positionInput);

// Office
const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.append(option);
});
officeLabel.append(officeSelect);

// Age
const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.setAttribute('data-qa', 'age');
ageLabel.append(ageInput);

// Salary
const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.setAttribute('data-qa', 'salary');
salaryLabel.append(salaryInput);

// Submit Button
const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  submitBtn,
);

document.body.append(form);

// --- 2. ФУНКЦІЯ ПОВІДОМЛЕНЬ (NOTIFICATIONS) ---
function showNotification(title, description, type) {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const titleElement = document.createElement('h2');

  titleElement.className = 'title';
  titleElement.textContent = title;

  const descElement = document.createElement('p');

  descElement.textContent = description;

  notification.append(titleElement, descElement);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

// --- 3. ВАЛІДАЦІЯ ТА ДОДАВАННЯ СПІВРОБІТНИКА ---
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const ageStr = form.elements.age.value.trim();
  const salaryStr = form.elements.salary.value.trim();

  // Перевірка імені (мінімум 4 символи)
  if (!employeeName || employeeName.length < 4) {
    showNotification(
      'Error',
      'Name must be at least 4 characters long',
      'error',
    );

    return;
  }

  // Перевірка віку (від 18 до 90)
  const ageNum = Number(ageStr);

  if (!ageStr || ageNum < 18 || ageNum > 90) {
    showNotification('Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  // Перевірка інших обов'язкових полів
  if (!position || !office || !salaryStr) {
    showNotification('Error', 'All fields are required', 'error');

    return;
  }

  const salaryNum = Number(salaryStr);

  if (Number.isNaN(salaryNum) || salaryNum <= 0) {
    showNotification('Error', 'Salary must be a positive number', 'error');

    return;
  }

  // Форматуємо зарплату за стандартом таблиці ($162,700)
  const formattedSalary = `$${salaryNum.toLocaleString('en-US')}`;

  // Створюємо та додаємо новий рядок
  const newRow = document.createElement('tr');
  const rowData = [employeeName, position, office, ageNum, formattedSalary];

  rowData.forEach((val) => {
    const cell = document.createElement('td');

    cell.textContent = val;
    newRow.append(cell);
  });

  tbody.append(newRow);

  showNotification('Success', 'Employee added successfully', 'success');
  form.reset();
});

// --- 4. СОРТУВАННЯ ТАБЛИЦІ (В ОБОХ НАПРЯМКАХ) ---
let currentSortColumn = -1;
let isAscending = true;

function parseCellValue(value) {
  const cleanValue = value.replace(/[$,]/g, '').trim();

  if (cleanValue !== '' && !Number.isNaN(Number(cleanValue))) {
    return Number(cleanValue);
  }

  return value.trim();
}

thead.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header || !thead.contains(header)) {
    return;
  }

  const columnIndex = header.cellIndex;

  if (currentSortColumn === columnIndex) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = columnIndex;
    isAscending = true;
  }

  const rows = [...tbody.rows];

  rows.sort((rowA, rowB) => {
    const valA = parseCellValue(rowA.cells[columnIndex].textContent);
    const valB = parseCellValue(rowB.cells[columnIndex].textContent);

    let comparison = 0;

    if (typeof valA === 'number' && typeof valB === 'number') {
      comparison = valA - valB;
    } else {
      comparison = String(valA).localeCompare(String(valB));
    }

    return isAscending ? comparison : -comparison;
  });

  tbody.append(...rows);
});

// --- 5. ВИБІР РЯДКА (КЛАС 'active') ---
tbody.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell-input')) {
    return;
  }

  const row = e.target.closest('tr');

  if (!row || !tbody.contains(row)) {
    return;
  }

  const activeRow = tbody.querySelector('tr.active');

  if (activeRow && activeRow !== row) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

// --- 6. РЕДАГУВАННЯ КОМІРОК ДВІЙНИМ КЛІКОМ ---
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || !tbody.contains(cell)) {
    return;
  }

  // Одночасно редагується не більше однієї клітинки
  if (tbody.querySelector('.cell-input')) {
    return;
  }

  const originalValue = cell.textContent.trim();

  cell.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  input.value = originalValue;

  cell.append(input);
  input.focus();

  let isSaved = false;

  const saveChanges = () => {
    if (isSaved) {
      return;
    }

    isSaved = true;

    const newValue = input.value.trim();

    cell.textContent = newValue !== '' ? newValue : originalValue;
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveChanges();
    }
  });
});
