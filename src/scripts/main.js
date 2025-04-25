'use strict';

const table = document.querySelector('table');
const thead = document.querySelectorAll('thead th');
const tbody = document.querySelector('table tbody');
const rows = [...tbody.rows];

let sortColumn = -1;
let sortDir = 'asc';
let currentlyEditing = null;

tbody.addEventListener('click', addRowStatus);
tbody.addEventListener('dblclick', cellEdit);

thead.forEach((th, i) => {
  th.addEventListener('click', () => handleHeaderClick(i));
});

const formAddEmployees = addForm();

table.parentNode.appendChild(formAddEmployees);

function handleHeaderClick(index) {
  if (sortColumn === index) {
    sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn = index;
    sortDir = 'asc';
  }

  sortRows(index);
}

function addRowStatus(e) {
  const selectedRow = e.target.closest('tr');

  if (!selectedRow) {
    return;
  }

  rows.forEach((row) => row.classList.remove('active'));

  selectedRow.classList.add('active');
}

function sortRows(index) {
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent;
    const cellB = rowB.cells[index].textContent;

    return sortDir === 'asc'
      ? cellA.localeCompare(cellB, undefined, { numeric: true })
      : cellB.localeCompare(cellA, undefined, { numeric: true });
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.append(row));
}

function createLabeledInput({ labelText, labelName, type, qa }) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = labelText;
  input.type = type;
  input.name = labelName;
  input.setAttribute('data-qa', qa);

  label.appendChild(input);

  return label;
}

function createSelectElement(options, qa = 'office') {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.textContent = 'Office:';
  select.name = 'office';
  select.required = true;
  select.setAttribute('data-qa', 'office');

  options.forEach((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;

    select.appendChild(option);
  });

  label.appendChild(select);

  return label;
}

function createButton(text, type = 'button') {
  const button = document.createElement('button');

  button.type = type;
  button.textContent = text;

  return button;
}

function addForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';
  form.action = '#';
  form.method = 'post';

  const fields = [
    {
      label: 'Name:',
      name: 'name',
      type: 'text',
      qa: 'name',
    },
    {
      label: 'Position:',
      name: 'position',
      type: 'text',
      qa: 'position',
    },
    {
      label: 'Age:',
      name: 'age',
      type: 'number',
      qa: 'age',
    },
    {
      label: 'Salary:',
      name: 'salary',
      type: 'number',
      qa: 'salary',
    },
  ];

  fields.forEach((field) => {
    const label = createLabeledInput({
      labelText: field.label,
      labelName: field.name,
      type: field.type,
      qa: field.qa,
    });

    form.appendChild(label);
  });

  const selectOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];
  const officeLabel = createSelectElement(selectOptions);
  const labels = form.querySelectorAll('label');

  labels.forEach((el) => {
    if (el.textContent === 'Position:') {
      el.insertAdjacentElement('afterend', officeLabel);
    }
  });

  const saveButton = createButton('Save to table', 'submit');

  form.appendChild(saveButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    addRowFromForm(form);
  });

  return form;
}

function validateForm(formData) {
  const requiredFields = ['name', 'position', 'age', 'salary', 'office'];
  const employeeName = formData.get('name').trim();
  const age = formData.get('age');

  for (const field of requiredFields) {
    const value = formData.get(field);

    if (!value || value.trim() === '') {
      return 'Please fill in all required fields.';
    }
  }

  if (employeeName.length < 4) {
    return 'Name must be at least 4 characters long.';
  }

  if (age < 18 || age > 90) {
    return 'Age must be between 18 and 90.';
  }

  return null;
}

function addRowFromForm(form) {
  const newRow = document.createElement('tr');
  const formData = new FormData(form);
  const error = validateForm(formData);

  if (error) {
    pushNotification('error', error);

    return;
  }

  const employeeName = formData.get('name').trim();
  const age = +formData.get('age');
  const rowSalary = +formData.get('salary');

  const formattedSalary = rowSalary.toLocaleString('en-Us', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const cells = [
    employeeName,
    formData.get('position'),
    formData.get('office'),
    age,
    formattedSalary,
  ];

  cells.forEach((text) => {
    const td = document.createElement('td');

    td.textContent = text;
    newRow.appendChild(td);
  });

  tbody.appendChild(newRow);

  form.reset();
  rows.push(newRow);

  pushNotification('success', 'Employee successfully added.');
}

function pushNotification(type, description) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', type);

  notificationTitle.className = 'title';
  notificationTitle.innerHTML = type === 'error' ? 'Error!' : 'Success!';
  notificationText.textContent = description;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);

  document.body.append(notification);

  setTimeout(() => document.body.removeChild(notification), 4000);
}

function cellEdit(e) {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('input')) {
    return;
  }

  if (currentlyEditing) {
    saveCellEdit(currentlyEditing);
  }

  currentlyEditing = cell;

  const originalValue = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalValue;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => saveCellEdit(cell, originalValue));

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();

      saveCellEdit(cell, originalValue);
    }
  });
}

function saveCellEdit(cell, originalValue = '') {
  const input = cell.querySelector('input');

  if (!input) {
    return;
  }

  const newValue = input.value.trim();

  cell.textContent = newValue === '' ? originalValue : newValue;

  currentlyEditing = null;
}
