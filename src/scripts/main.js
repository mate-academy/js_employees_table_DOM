'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

let sortColumn = null;
let sortDirection = 1;
let activeInput = null;

init();

function init() {
  initSorting();
  initRowSelection();
  initForm();
  initCellEditing();
}

function initSorting() {
  thead.addEventListener('click', onHeaderClick);
}

function onHeaderClick(e) {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;

  if (sortColumn === index) {
    sortDirection *= -1;
  } else {
    sortColumn = index;
    sortDirection = 1;
  }

  sortTableByColumn(index, sortDirection);
}

function sortTableByColumn(index, direction) {
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    const valueA = getCellValue(a.cells[index]);
    const valueB = getCellValue(b.cells[index]);

    if (valueA === valueB) {
      return 0;
    }

    return valueA > valueB ? direction : -direction;
  });

  tbody.append(...rows);
}

function getCellValue(cell) {
  const text = cell.textContent.trim();
  const number = Number(text.replace(/[$,]/g, ''));

  return isNaN(number) ? text : number;
}

function initRowSelection() {
  tbody.addEventListener('click', onRowClick);
}

function onRowClick(e) {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  removeActiveRow();
  row.classList.add('active');
}

function removeActiveRow() {
  const active = tbody.querySelector('.active');

  if (active) {
    active.classList.remove('active');
  }
}

function initForm() {
  const form = createForm();

  document.body.append(form);

  form.addEventListener('submit', onFormSubmit);
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input data-qa="position" name="position" type="text"></label>
  <label>Office:
    <select data-qa="office" name="office">
      <option value="">Select office</option>
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
  <button type="submit">Save to table</button>`;

  return form;
}

function onFormSubmit(e) {
  e.preventDefault();

  const data = getFormData(e.target);
  const error = validateForm(data);

  if (error) {
    showError(error);

    return;
  }

  addEmployeeToTable(data);
  showSuccess();
  e.target.reset();
}

function getFormData(form) {
  return Object.fromEntries(new FormData(form));
}

function validateForm(data) {
  if (data.name.length < 4) {
    return 'Name must be at least 4 letters';
  }

  if (+data.age < 18 || +data.age > 90) {
    return 'Age must be between 18 and 90';
  }

  if (Object.values(data).some((v) => v === '')) {
    return 'All fields are required';
  }

  return null;
}

function showError(text) {
  showNotification('error', 'Error', text);
}

function showSuccess() {
  showNotification('success', 'Success', 'Employee added');
}

function showNotification(type, title, text) {
  const el = document.createElement('div');

  el.dataset.qa = 'notification';
  el.className = type;
  el.innerHTML = `<strong>${title}</strong><p>${text}</p>`;

  document.body.append(el);
  setTimeout(() => el.remove(), 3000);
}

function initCellEditing() {
  tbody.addEventListener('dblclick', (e) => {
    if (activeInput) {
      return;
    }

    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    startEdit(cell);
  });
}

function addEmployeeToTable(data) {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.position}</td>
    <td>${data.office}</td>
    <td>${data.age}</td>
    <td>$${Number(data.salary).toLocaleString()}</td>
  `;

  tbody.append(row);
}

function startEdit(cell) {
  const oldValue = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.append(input);
  input.focus();

  activeInput = input;

  input.addEventListener('blur', () => finishEdit(cell, input, oldValue));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishEdit(cell, input, oldValue);
    }
  });
}

function finishEdit(cell, input, oldValue) {
  const newValue = input.value.trim();

  cell.textContent = newValue || oldValue;
  activeInput = null;
}
