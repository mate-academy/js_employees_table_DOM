'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let isAscending = true;
let lastIndex = -1;

// 1. Sorting Table

thead.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const rows = tbody.rows;
  const rowsArr = Array.from(rows);

  if (lastIndex === index) {
    isAscending = false;
    lastIndex = -1;
  } else {
    isAscending = true;
    lastIndex = index;
  }

  const sortedRows = rowsArr.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent;
    const cellB = rowB.cells[index].textContent;

    if (cellA.includes('$')) {
      const numA = parseFloat(cellA.replace('$', '').replace(',', ''));
      const numB = parseFloat(cellB.replace('$', '').replace(',', ''));

      return isAscending ? numA - numB : numB - numA;
    } else {
      return isAscending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => {
    tbody.appendChild(row);
  });
});

// 2. Selecting row

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  [...tbody.rows].forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

// 3.1 Add form to the document

const newForm = document.createElement('form');
const select = document.createElement('select');
const newButton = document.createElement('button');
const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const lbl = ['Name:', 'Position:', 'Office:', 'Age:', 'Salary:'];
const names = ['name', 'position', 'office', 'age', 'salary'];

for (let i = 0; i < options.length; i++) {
  const option = document.createElement('option');

  option.textContent = options[i];
  select.appendChild(option);
}

newForm.classList.add('new-employee-form');

for (let i = 0; i < 6; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  if (i === 2) {
    label.textContent = lbl[i];
    select.name = names[i];
    select.required = true;
    select.dataset.qa = names[i];
    select.id = names[i];
    label.appendChild(select);
    newForm.appendChild(label);
  } else if (i === 5) {
    newButton.textContent = 'Save to table';
    newButton.type = 'submit';
    newForm.appendChild(newButton);
  } else {
    input.name = names[i];

    if (input.name === 'age' || input.name === 'salary') {
      input.type = 'number';
    } else {
      input.type = 'text';
    }
    input.dataset.qa = names[i];
    input.id = names[i];
    input.required = true;
    label.textContent = lbl[i];
    label.appendChild(input);
    newForm.appendChild(label);
  }
}
document.body.append(newForm);

// 3.2 Add new employee / 4. Validate and show notification
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = document.getElementById('name').value;
  const age = document.getElementById('age').value;

  if (nameValue.length < 4 && nameValue.length > 0) {
    createNotification('error', 'Name length should be more that 4 letters');

    return;
  } else if (age < 18 || age > 90) {
    createNotification('error', 'Age should be more that 18 and less than 90');

    return;
  }

  const data = [];
  const newRow = document.createElement('tr');

  for (let i = 0; i < 5; i++) {
    const info = document.getElementById(names[i]);

    data.push(info.value);
  }

  data.forEach((elem, i) => {
    const newCell = document.createElement('td');

    if (i === 4) {
      const formater = new Intl.NumberFormat('en-US');
      const formated = formater.format(elem);

      newCell.textContent = '$' + formated;
    } else {
      newCell.textContent = elem;
    }
    newRow.appendChild(newCell);
  });
  tbody.appendChild(newRow);
  createNotification('success', 'Information successfuly added to the table!');
  form.reset();
});

// show notification when trying to submit with empty field

const button = document.querySelector('button');

button.addEventListener('click', () => {
  const nameValue = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const position = document.getElementById('position').value;
  const salary = document.getElementById('salary').value;

  if (
    nameValue.length === 0 ||
    position.length === 0 ||
    age.length === 0 ||
    salary.length === 0
  ) {
    createNotification('error', 'All fields must be filled up');
  }
});

function createNotification(type, text) {
  const notification = document.createElement('div');
  const header = document.createElement('h1');
  const paragraph = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification');
  notification.classList.add(type);
  header.classList.add('title');
  header.textContent = type === 'success' ? 'Success' : 'Error';
  paragraph.textContent = text;
  notification.appendChild(header);
  notification.appendChild(paragraph);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Implement editing of table cells by double-clicking

tbody.addEventListener('dblclick', (e) => {
  const newInput = document.createElement('input');
  const cell = e.target.closest('td');
  const cellValue = cell.textContent;

  newInput.classList.add('cell-input');
  newInput.type = 'text';
  newInput.value = cell.textContent;
  cell.innerHTML = '';
  cell.appendChild(newInput);

  newInput.addEventListener('blur', (ev) => {
    if (newInput.value === '') {
      cell.textContent = cellValue;
    } else {
      cell.textContent = newInput.value;
    }
    newInput.remove();
  });

  newInput.addEventListener('keypress', (evt) => {
    if (evt.key === 'Enter') {
      newInput.blur();
    }
  });
});
