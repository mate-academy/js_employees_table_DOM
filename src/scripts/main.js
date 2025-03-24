'use strict';

const tbody = document.querySelector('tbody');
const body = document.querySelector('body');
const arr = ['Name', 'Position', 'Age', 'Salary'];

const sortDirection = {};

// Функція сортування таблиці
document.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'TH') {
    const columnIndex = ev.target.cellIndex;
    const table = ev.target.closest('table');
    const tBody = table.querySelector('tbody');
    const rows = Array.from(tBody.rows);

    // eslint-disable-next-line max-len
    sortDirection[columnIndex] = !sortDirection[columnIndex];

    rows.sort((a, b) => {
      let cellA = a.cells[columnIndex].textContent.trim();
      let cellB = b.cells[columnIndex].textContent.trim();

      if (columnIndex === 3) {
        cellA = parseFloat(cellA.replace(/[$,]/g, ''));
        cellB = parseFloat(cellB.replace(/[$,]/g, ''));
      }

      if (isNaN(cellA) || isNaN(cellB)) {
        return sortDirection[columnIndex]
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      } else {
        return sortDirection[columnIndex] ? cellA - cellB : cellB - cellA;
      }
    });

    rows.forEach((row) => tBody.appendChild(row));
  }
});

// Виділення рядка
tbody.addEventListener('click', (e) => {
  // eslint-disable-next-line max-len
  document
    .querySelectorAll('tr')
    .forEach((tr) => tr.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});

// Додавання форми
const form = document.createElement('form');

form.classList.add('new-employee-form');
body.appendChild(form);

const label2 = document.createElement('label');
const select = document.createElement('select');

select.setAttribute('data-qa', 'office');
select.setAttribute('required', true);
label2.textContent = 'Office:';
label2.append(select);

arr.forEach((element) => {
  const input = document.createElement('input');
  const label = document.createElement('label');

  label.textContent = `${element}:`;
  input.setAttribute('data-qa', element.toLowerCase());
  input.setAttribute('required', true);

  if (element === 'Age' || element === 'Salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  label.append(input);
  form.append(label);
});

form.append(label2);

const labels = form.querySelectorAll('label');
const lastLabel = labels[labels.length - 1];
const secondLabel = labels[1];

form.insertBefore(lastLabel, secondLabel.nextSibling);

[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((el) => {
  const option = document.createElement('option');

  option.textContent = el;
  option.setAttribute('value', el);
  select.appendChild(option);
});

const button = document.createElement('button');

button.textContent = 'Save to table';
form.appendChild(button);

// Функція створення сповіщень
const pushNotification = (title, description, type) => {
  const element = document.createElement('div');

  element.classList.add('notification', type);
  element.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');

  h2.textContent = title;
  h2.classList.add('title');

  const p = document.createElement('p');

  p.textContent = description;

  element.append(h2, p);
  body.appendChild(element);

  setTimeout(() => {
    element.remove();
  }, 2000);
};

// Відправка форми
button.addEventListener('click', (e) => {
  e.preventDefault();

  const name1 = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const office = select.value;
  const age = parseInt(form.querySelector('[data-qa="age"]').value.trim(), 10);
  const salary1 = form.querySelector('[data-qa="salary"]').value.trim();

  // Валідація полів
  if (name1.length < 4) {
    pushNotification('Error', 'Name must be at least 4 characters.', 'error');

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    pushNotification('Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  if (!name1 || !position || !office || isNaN(salary1)) {
    pushNotification('Error', 'Please fill in all fields.', 'error');

    return;
  }

  // Додавання нового рядка
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${name1}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary1.toLocaleString()}</td>
  `;

  tbody.appendChild(newRow);
  form.reset();

  pushNotification('Success', 'Employee added successfully!', 'success');
});
