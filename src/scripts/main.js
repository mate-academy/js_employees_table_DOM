'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

let currentSortColumn = null;
let currentSortDirection = 'asc';

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentSortColumn === index) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = index;
      currentSortDirection = 'asc';
    }

    sortTableByColumn(index, currentSortDirection);
  });
});

function sortTableByColumn(columnIndex, direction) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const textA = rowA.children[columnIndex].textContent.trim();
    const textB = rowB.children[columnIndex].textContent.trim();

    const valueA = getCellValue(columnIndex, textA);
    const valueB = getCellValue(columnIndex, textB);

    let result;

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      result = valueA - valueB;
    } else {
      result = String(valueA).localeCompare(String(valueB));
    }

    return direction === 'asc' ? result : -result;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

function getCellValue(columnIndex, text) {
  if (columnIndex === 3) {
    return Number(text);
  }

  if (columnIndex === 4) {
    return Number(text.replace(/[^0-9]/g, ''));
  }

  return text;
}

tbody.addEventListener('click', (events) => {
  const row = events.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');
document.body.append(newForm);

function createField(labelText, type, names) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.type = type;
  input.name = names;
  input.dataset.qa = names;

  label.append(input);

  return label;
}

function createSelectField(labelText, names, options) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const select = document.createElement('select');

  select.name = names;
  select.dataset.qa = names;

  options.forEach((optionText) => {
    const option = document.createElement('option');

    option.value = optionText;
    option.textContent = optionText;
    select.append(option);
  });

  label.append(select);

  return label;
}

const button = document.createElement('button');

button.textContent = 'Save to table';

newForm.append(
  createField('Name:', 'text', 'name'),
  createField('Position:', 'text', 'position'),
  createSelectField('Office:', 'office', [
    'Tokyo',
    'London',
    'San Francisco',
    'Singapore',
    'Edinburgh',
    'New York',
  ]),
  createField('Age:', 'number', 'age'),
  createField('Salary:', 'number', 'salary'),
  button,
);

newForm.addEventListener('submit', (events) => {
  events.preventDefault();

  const data = getFormData(newForm);

  if (!validateEmployee(data)) {
    return;
  }

  addEmployeeToTable(data);

  newForm.reset();
});

function getFormData(form) {
  const data = {};

  const fields = form.querySelectorAll('[data-qa]');

  fields.forEach((field) => {
    data[field.dataset.qa] = field.value.trim();
  });

  return data;
}

const validators = {
  name: [
    {
      check: (v) => v.length >= 4,
      message: 'Name must contain at least 4 letters',
      type: 'error',
    },
    {
      check: (v) => /^[a-zA-Z\s]+$/.test(v),
      message: 'Name must contain only letters',
      type: 'error',
    },
  ],

  position: [
    {
      check: (v) => v.trim() !== '',
      message: 'Please enter position',
      type: 'error',
    },
    {
      check: (v) => /^[a-zA-Z\s]+$/.test(v),
      message: 'Position must contain only letters',
      type: 'error',
    },
  ],

  age: [
    {
      check: (v) => {
        const n = Number(v);

        return !Number.isNaN(n) && n >= 18 && n <= 90;
      },
      message: 'Age must be a number between 18 and 90',
      type: 'error',
    },
  ],

  salary: [
    {
      check: (v) => v.trim() !== '',
      message: 'Salary is required',
      type: 'error',
    },
    {
      check: (v) => /^\d+$/.test(v),
      message: 'Salary must contain only numbers',
      type: 'error',
    },
  ],
};

function validateEmployee(data) {
  for (const field in validators) {
    const value = data[field];

    for (const rule of validators[field]) {
      if (!rule.check(value)) {
        pushNotification('Validation error', rule.message, rule.type);

        return false;
      }
    }
  }

  pushNotification('Success', 'Employee added successfully', 'success');

  return true;
}

function addEmployeeToTable(data) {
  const row = document.createElement('tr');

  const cells = [
    data.name,
    data.position,
    data.office,
    data.age,
    `$${Number(data.salary).toLocaleString()}`,
  ];

  cells.forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    row.append(td);
  });

  tbody.append(row);

  // если таблица уже отсортирована — пересортировать
  if (currentSortColumn !== null) {
    sortTableByColumn(currentSortColumn, currentSortDirection);
  }
}

function pushNotification(title, description, type) {
  // удалить старое уведомление (если есть)
  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', type);

  const heading = document.createElement('h2');

  heading.classList.add('title');
  heading.textContent = title;

  const text = document.createElement('p');

  text.textContent = description;

  notification.dataset.qa = 'notification';
  notification.append(heading, text);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}
