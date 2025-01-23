'use strict';

// Основні елементи таблиці
const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

// Сортування
let currentSortColumn = null;
let currentSortDirection = 'asc';
const rows = [...tbody.rows];

// Функція для сортування таблиці
const sortTable = (index, isNumericColumn) => {
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.trim();
    const cellB = rowB.cells[index].textContent.trim();

    if (isNumericColumn) {
      const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

      return currentSortDirection === 'asc' ? numA - numB : numB - numA;
    }

    return currentSortDirection === 'asc'
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  tbody.append(...rows);
};

// Подія для сортування за заголовками
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const isNumericColumn = index === 3 || index === 4;

    if (currentSortColumn !== index) {
      currentSortColumn = index;
      currentSortDirection = 'asc';
    } else {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    }

    sortTable(index, isNumericColumn);
  });
});

// Виділення рядка по кліку
rows.forEach((row) => {
  row.addEventListener('click', (e) => {
    rows.forEach((r) => r.classList.remove('active'));
    e.currentTarget.classList.add('active');
  });
});

// Створення форми для додавання співробітника
const form = document.createElement('form');

form.id = 'employee-form';
form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office',
    name: 'office',
    type: 'select',
    qa: 'office',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');
  let input;

  label.textContent = `${field.label}: `;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((optionText) => {
      const option = document.createElement('option');

      option.value = optionText;
      option.textContent = optionText;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.name = field.name;
  input.setAttribute('data-qa', field.qa);
  label.appendChild(input);
  form.appendChild(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.appendChild(button);

document.querySelector('body').append(form);

// Нотифікація
const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  messageTitle.textContent = title;
  messageDescription.textContent = description;

  message.classList.add('notification', type);
  message.setAttribute('data-qa', 'notification');
  messageTitle.classList.add('title');

  message.append(messageTitle, messageDescription);
  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

// Обробка форми
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const nameEmployee = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = parseInt(formData.get('age'), 10);
  const salary = parseFloat(formData.get('salary'));

  if (nameEmployee.length < 4) {
    pushNotification(
      'Warning',
      'The name must contain at least 4 letters!',
      'warning',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Warning', 'Age should be between 18 and 90!', 'warning');

    return;
  }

  if (!nameEmployee || !position || !office || isNaN(age) || isNaN(salary)) {
    pushNotification('Error', 'All fields are required!', 'error');

    return;
  }

  const formattedSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();
  pushNotification('Success', 'Employee added successfully!', 'success');
});

// Редагування клітинок
rows.forEach((row) => {
  Array.from(row.cells).forEach((cell, index) => {
    cell.addEventListener('dblclick', () => {
      if (cell.querySelector('.cell-input')) {
        return;
      }

      const initialValue = cell.textContent.trim();
      const input = document.createElement('input');
      const isSalaryCell = index === 4;

      input.type = isSalaryCell || index === 3 ? 'number' : 'text';

      input.value = isSalaryCell
        ? initialValue.replace(/[^0-9.-]+/g, '')
        : initialValue;

      input.classList.add('cell-input');
      cell.textContent = '';
      cell.appendChild(input);
      input.focus();

      const saveCellValue = () => {
        const newValue = input.value.trim();

        if (newValue === '') {
          cell.textContent = initialValue;
        } else if (isSalaryCell) {
          cell.textContent = parseFloat(newValue).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          });
        } else {
          cell.textContent = newValue;
        }
        input.remove();
      };

      input.addEventListener('blur', saveCellValue);

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveCellValue();
        }
      });
    });
  });
});
