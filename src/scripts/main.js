'use strict';

const sortDirection = {};
const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
let currentlyEditingCell = null;
let currentlyEditingCellValue = '';

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }
  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  let direction = sortDirection[index];

  direction = !direction || direction === 'desc' ? 'asc' : 'desc';
  sortDirection[index] = direction;

  rows.sort((a, b) => {
    const cellA = a.querySelectorAll('td')[index].textContent.trim();
    const cellB = b.querySelectorAll('td')[index].textContent.trim();
    let result;
    const numA = Number(cellA.replace(/[^\d]/g, ''));
    const numB = Number(cellB.replace(/[^\d]/g, ''));

    if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA && numB) {
      result = numA - numB;
    } else {
      result = cellA.localeCompare(cellB);
    }

    if (direction === 'desc') {
      result = -result;
    }

    return result;
  });

  rows.forEach((row) => tbody.appendChild(row));
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  if (td.querySelector('input')) {
    return;
  }

  if (currentlyEditingCell) {
    currentlyEditingCell.textContent = currentlyEditingCellValue;
    currentlyEditingCell = null;
  }

  const oldValue = td.textContent.trim();
  const input = document.createElement('input');

  input.type = 'text';
  input.value = oldValue;
  input.classList.add('cell-input');
  td.textContent = '';
  td.appendChild(input);
  input.focus();
  currentlyEditingCell = td;
  currentlyEditingCellValue = oldValue;

  // eslint-disable-next-line no-shadow
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      td.textContent = input.value.trim() || oldValue;
      currentlyEditingCell = null;
    }
  });

  input.addEventListener('blur', () => {
    td.textContent = input.value.trim() || oldValue;
    currentlyEditingCell = null;
  });
});

const form = document.createElement('form');

form.className = 'new-employee-form';

const fields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  { label: 'Office', name: 'office', type: 'select' },
  { label: 'Age', name: 'age', type: 'number' },
  { label: 'Salary', name: 'salary', type: 'number' }
];

const inputs = {};

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}: `;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ].forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.name = field.name;
  input.setAttribute('data-qa', field.name);
  inputs[field.name] = input;
  label.appendChild(input);
  form.appendChild(label);
});

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const age = Number(form.querySelector('[data-qa="age"]').value);
  const salary = Number(form.querySelector('[data-qa="salary"]').value);
  const office = form.querySelector('[data-qa="office"]').value;

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (!position || !/^[a-zA-Z\s]{2,}$/.test(position)) {
    showNotification('Position is invalid', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  if (!salary || salary <= 0) {
    showNotification('Salary is invalid', 'error');

    return;
  }

  const tr = document.createElement('tr');
  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  [employeeName, position, office, age, formattedSalary].forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
  form.reset();
  showNotification('Employee successfully added', 'success');
});

function showNotification(text, type) {
  const div = document.createElement('div');

  div.textContent = text;
  div.className = type;
  div.setAttribute('data-qa', 'notification');
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 2000);
}
