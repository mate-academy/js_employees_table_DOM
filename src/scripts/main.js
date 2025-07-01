'use strict';

const table = document.querySelector('table');
const headers = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');

function getRows() {
  return Array.from(tbody.querySelectorAll('tr'));
}

addRowClickListener();

let sortColumnIndex = null;
let sortDirection = 1; // 1 for ascending, -1 for descending

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (sortColumnIndex === index) {
      sortDirection *= -1;
    } else {
      sortColumnIndex = index;
      sortDirection = 1;
    }

    const rows = getRows();

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      const rawA = cellA.replace(/[^\d.-]/g, '');
      const rawB = cellB.replace(/[^\d.-]/g, '');

      const valueA = rawA === '' ? cellA : parseFloat(rawA);
      const valueB = rawB === '' ? cellB : parseFloat(rawB);

      if (valueA < valueB) {
        return -1 * sortDirection;
      }

      if (valueA > valueB) {
        return 1 * sortDirection;
      }

      return 0;
    });

    tbody.innerHTML = '';

    rows.forEach((row) => {
      tbody.appendChild(row);
    });

    addRowClickListener();
  });
});

function addRowClickListener() {
  getRows().forEach((row) => {
    row.addEventListener('click', () => {
      getRows().forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });
}

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  { label: 'Name', type: 'text', name: 'name' },
  { label: 'Position', type: 'text', name: 'position' },
  { label: 'Age', type: 'number', name: 'age' },
  { label: 'Salary', type: 'number', name: 'salary' },
];

fields.forEach((field) => {
  const wrapper = document.createElement('div');
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = field.label + ':';
  label.setAttribute('for', field.name);

  input.setAttribute('type', field.type);
  input.setAttribute('name', field.name);
  input.setAttribute('id', field.name);

  input.setAttribute('data-qa', field.name);

  wrapper.append(label, input);
  form.appendChild(wrapper);
});

const officeWrapper = document.createElement('div');
const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeLabel.textContent = 'Office:';
officeLabel.setAttribute('for', 'office');

officeSelect.setAttribute('name', 'office');
officeSelect.setAttribute('id', 'office');

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
  officeSelect.appendChild(option);
});

officeWrapper.append(officeLabel, officeSelect);
form.insertBefore(officeWrapper, form.children[2]);

const saveButton = document.createElement('button');

saveButton.type = 'submit';
saveButton.textContent = 'Save to table';
form.appendChild(saveButton);

const parentTable = table.parentElement;

parentTable.insertBefore(form, table.nextSibling);

function showNotification(message, isError = false) {
  let notification = document.querySelector('[data-qa="notification"]');

  if (!notification) {
    notification = document.createElement('div');
    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('notification');
    form.parentElement.insertBefore(notification, form.nextSibling);
  }
  notification.textContent = message;
  notification.classList.remove('error', 'success');
  notification.classList.add(isError ? 'error' : 'success');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameLb = form.elements['name'].value.trim();
  const positionLb = form.elements['position'].value.trim();
  const officeLb = form.elements['office'].value.trim();
  const ageLb = Number(form.elements['age'].value);
  const salaryLb = form.elements['salary'].value.trim();

  if (nameLb.length < 4) {
    showNotification('Помилка: Ім’я має містити щонайменше 4 літери.', true);

    return;
  }

  if (positionLb.length < 2) {
    showNotification('Помилка: Посада має містити щонайменше 2 символи.', true);

    return;
  }

  if (ageLb < 18 || ageLb > 90) {
    showNotification('Помилка: Вік має бути від 18 до 90 років.', true);

    return;
  }

  function formatSalary(salary) {
    const num = Number(salary);

    if (isNaN(num)) {
      return salary;
    }

    return '$' + num.toLocaleString('en-US');
  }

  const newRow = document.createElement('tr');
  const cellsData = [
    nameLb,
    positionLb,
    officeLb,
    ageLb,
    formatSalary(salaryLb),
  ];

  cellsData.forEach((data) => {
    const td = document.createElement('td');

    td.textContent = data;
    newRow.appendChild(td);
  });

  tbody.appendChild(newRow);
  addRowClickListener();

  showNotification('Новий співробітник успішно доданий до таблиці.');
  form.reset();
});

let editingCell = null;
let originalValue = null;

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;

  if (target.tagName !== 'TD') {
    return;
  }

  if (editingCell && editingCell !== target) {
    finishEditing();
  }

  if (editingCell === target) {
    return;
  }

  originalValue = target.textContent;
  editingCell = target;

  const input = document.createElement('input');

  input.type = 'text';
  input.value = originalValue;
  input.className = 'cell-input';

  target.textContent = '';
  target.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    finishEditing();
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      finishEditing();
    }
  });
});

function finishEditing(save = true) {
  if (!editingCell) {
    return;
  }

  const input = editingCell.querySelector('input.cell-input');

  if (!input) {
    return;
  }

  let newValue = input.value.trim();

  if (!save || newValue === '') {
    newValue = originalValue;
  }

  editingCell.textContent = newValue;
  editingCell = null;
  originalValue = null;
}
