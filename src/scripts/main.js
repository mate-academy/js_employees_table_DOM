'use strict';

const table = document.getElementById('employee-table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');
const form = document.getElementById('employee-form');
const notification = document.getElementById('notification');

let sortState = { key: null, asc: true };
let selectedRow = null;
let editingCell = null;

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const key = header.dataset.key;

    if (sortState.key === key) {
      sortState.asc = !sortState.asc;
    } else {
      sortState = { key, asc: true };
    }
    sortTable(key, sortState.asc);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }
    row.classList.add('active');
    selectedRow = row;
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employeeName = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = parseInt(formData.get('age'));
  const salary = parseFloat(formData.get('salary'));

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters.', 'error');

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  if (!position || !office || isNaN(salary)) {
    showNotification('All fields are required.', 'error');

    return;
  }

  const row = document.createElement('tr');

  [employeeName, position, office, age, `$${salary.toLocaleString()}`].forEach(
    (text) => {
      const td = document.createElement('td');

      td.textContent = text;
      td.addEventListener('dblclick', makeEditable);
      row.appendChild(td);
    },
  );
  tbody.appendChild(row);
  form.reset();
  showNotification('Employee added successfully!', 'success');
});

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = type;
}

function sortTable(key, asc = true) {
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const idx = Array.from(headers).findIndex((h) => h.dataset.key === key);

  rows.sort((a, b) => {
    let v1 = a.children[idx].textContent;
    let v2 = b.children[idx].textContent;

    const isNum = !isNaN(parseFloat(v1)) && !isNaN(parseFloat(v2));

    if (isNum) {
      v1 = parseFloat(v1.replace(/[^0-9.]/g, ''));
      v2 = parseFloat(v2.replace(/[^0-9.]/g, ''));
    }

    return asc ? (v1 > v2 ? 1 : -1) : v1 < v2 ? 1 : -1;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

function makeEditable(e) {
  if (editingCell) {
    return;
  }

  const td = e.target;
  const originalText = td.textContent;

  td.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalText;
  td.appendChild(input);
  input.focus();
  editingCell = td;

  function save() {
    const value = input.value.trim() || originalText;

    td.textContent = value;
    editingCell = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (el) => {
    if (el.key === 'Enter') {
      save();
    }
  });
}
