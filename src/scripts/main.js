'use strict';

// write code here

// Сортування таблиці

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const tableHeader = Array.from(table.querySelectorAll('th'));

const sortDirection = {};

function parseNumber(value) {
  return parseFloat(value.replace(/[^0-9.]/g), '');
}

tableHeader.forEach((header, columIndex) => {
  header.addEventListener('click', () => {
    // Визначення напрямку сортування
    sortDirection[columIndex] = !sortDirection[columIndex];

    // Вибираємо всі рядки tbody
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Сортуємо рядки таблиці
    rows.sort((a, b) => {
      const cellA = a.children[columIndex].textContent;
      const cellB = b.children[columIndex].textContent;

      const numberA = parseNumber(cellA);
      const numberB = parseNumber(cellB);

      // Перевіряємо чи рядок є яислом
      if (!isNaN(numberA) && !isNaN(numberB)) {
        return sortDirection[columIndex]
          ? numberA - numberB
          : numberB - numberA;
      } else {
        return sortDirection[columIndex]
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    tbody.innerHTML = '';
    // Додаємо відсортовані елементи в tbody
    rows.forEach((row) => tbody.appendChild(row));
  });
});

// Active row

tbody.addEventListener('click', (e) => {
  const clikedRow = e.target.closest('tr');

  if (clikedRow) {
    const allRows = tbody.querySelectorAll('tr');

    allRows.forEach((row) => row.classList.remove('active'));

    clikedRow.classList.add('active');
  }
});

const form = document.createElement('form');
const bodyElement = document.querySelector('body');

form.classList.add('new-employee-form');
bodyElement.append(form);

// Додавання інпутів до форми
const city = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const formInputData = [
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

formInputData.forEach((item, index) => {
  const labelEl = document.createElement('label');

  labelEl.textContent = item.label;

  const crateInput = document.createElement('input');

  crateInput.setAttribute('name', item.name);
  crateInput.setAttribute('data-qa', item.qa);
  crateInput.setAttribute('type', item.type);
  crateInput.setAttribute('required', 'true');

  labelEl.appendChild(crateInput);

  form.appendChild(labelEl);

  if (index === 1) {
    const label = document.createElement('label');
    const select = document.createElement('select');

    select.setAttribute('name', 'office');
    select.setAttribute('data-qa', 'office');

    // select.setAttribute('data-qa', 'office');

    label.textContent = 'Office:';
    label.append(select);

    city.forEach((items) => {
      const option = document.createElement('option');

      option.setAttribute('value', items);

      option.textContent = items;
      select.appendChild(option);
    });

    form.appendChild(label);
  }
});

const formButton = document.createElement('button');

formButton.textContent = 'Save to table';
formButton.setAttribute('type', 'submit');

form.appendChild(formButton);

// Створення сповыщень notification

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const names = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  const salary = Number(formData.get('salary'));

  if (names.length < 4) {
    showNotification('Name is too short (min length 4)', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Enter a valid age (between 18 and 90)', 'error');

    return;
  }

  if (salary < 0) {
    showNotification('Enter a valid salary', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();
  showNotification('Employee added successfully!', 'success');
});

function showNotification(message, type) {
  const createNotification = document.createElement('div');
  const notificationTitle = document.createElement('h1');

  createNotification.classList.add('notification', type);
  notificationTitle.textContent = message;
  notificationTitle.classList.add('title');

  createNotification.append(notificationTitle);
  createNotification.setAttribute('data-qa', 'notification');
  bodyElement.append(createNotification);

  setTimeout(() => {
    createNotification.remove();
  }, 3000);
}
