'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const headers = thead.querySelectorAll('th');
const body = document.querySelector('body');
const offices = ['Tokyo', 'Singapore',
  'London', 'New York', 'Edinburgh', 'San Francisco'];

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  message.style.top = `3px`;
  message.style.right = `10px`;
  message.style.minHeight = '0px';
  message.style.height = '90px';

  body.insertBefore(message, body.lastElementChild);

  setTimeout(() => message.remove(), 2000);
};

const convertToNumber = (string) => {
  return +string.split('$').join('').split(',').join('');
};

for (const header of headers) {
  header.className = 'header';
}

let ascOrder = true;
let currentTitle;

table.addEventListener('click', (e) => {
  const header = e.target.closest('.header');

  if (!header) {
    return;
  }

  const rows = [...tbody.rows];
  const index = header.cellIndex;

  if (currentTitle !== header.innerText) {
    ascOrder = true;
  }

  currentTitle = header.innerText;

  if (ascOrder) {
    rows.sort((a, b) => header.innerText === 'Salary'
      ? convertToNumber(a.cells[index].innerText)
        - convertToNumber(b.cells[index].innerText)
      : a.cells[index].innerText.localeCompare(b.cells[index].innerText));

    ascOrder = !ascOrder;
  } else {
    rows.sort((a, b) => header.innerText === 'Salary'
      ? convertToNumber(b.cells[index].innerText)
        - convertToNumber(a.cells[index].innerText)
      : b.cells[index].innerText.localeCompare(a.cells[index].innerText));

    ascOrder = !ascOrder;
  }

  tbody.innerHTML = '';
  rows.forEach(row => tbody.append(row));
});

let currentRow;

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (currentRow !== row && currentRow !== undefined) {
    currentRow.classList.remove('active');
  }

  row.className = 'active';
  currentRow = row;
});

const form = document.createElement('form');

form.className = 'new-employee-form';
form.action = '/';
form.method = 'GET';

form.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
      placeholder="Name"
      required>
  </label>
  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      placeholder="Position"
      required>
  </label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
      <option selected disabled>Choose location</option>
      <option value="Tokyo">${offices[0]}</option>
      <option value="Singapore">${offices[1]}</option>
      <option value="London">${offices[2]}</option>
      <option value="New York">${offices[3]}</option>
      <option value="Edinburgh">${offices[4]}</option>
      <option value="San Francisco">${offices[5]}</option>
    </select>
  </label>
  <label>
    Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      placeholder="Age"
      required>
  </label>
  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      placeholder="in US dollar"
      required>
  </label>

  <button type="submit">Save to table</button>
`;

body.insertBefore(form, body.lastElementChild);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const entries = Object.fromEntries(data.entries());
  const { position, office, age, salary } = entries;

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${entries.name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US').split('.').join(',')}</td>
  `;

  if (entries.name.length < 4) {
    pushNotification('Error!!!', 'Name should contain min 4 letter', 'error');
  } else if (age < 18) {
    pushNotification('Error!!!', 'Min age is 18', 'error');
  } else if (age > 90) {
    pushNotification('Error!!!', 'Max age is 90', 'error');
  } else if (office === undefined) {
    pushNotification('Error!!!', 'Choose office location', 'error');
  } else if (+salary === 0) {
    pushNotification('Error!!!', 'Provide correct salary', 'error');
  } else {
    pushNotification('Success!!!', 'New user successfully added', 'success');
    tbody.append(row);
    form.reset();
  }
});

const editorOfCell = (cell, input, initialValue) => {
  if (!input.value.length) {
    cell.innerText = initialValue;
    input.remove();
  } else if (input.value[0] === ' ') {
    pushNotification('Warning!!!', 'Provide correct data', 'warning');
    cell.innerText = initialValue;
    input.remove();
  } else {
    cell.innerText = input.value;
    input.remove();
  }

  switch (headers[cell.cellIndex].innerText) {
    case 'Name':
      if (input.value.length < 4 && !input.value.includes(' ')) {
        pushNotification('Warning!!!',
          'Name should contain min 4 letter', 'warning');

        cell.innerText = initialValue;
      }
      break;

    case 'Age':
      if ((isNaN(input.value) && !input.value.includes(' ')) || !input.value) {
        pushNotification('Warning!!!', 'Provide correct age', 'warning');
        cell.innerText = initialValue;
      } else if (input.value < 18 && !input.value.includes(' ')) {
        pushNotification('Warning!!!', 'Min age is 18', 'warning');
        cell.innerText = initialValue;
      } else if (input.value > 90 && !input.value.includes(' ')) {
        pushNotification('Warning!!!', 'Max age is 90', 'warning');
        cell.innerText = initialValue;
      }
      break;

    case 'Office':
      if (!offices.includes(input.value) && !input.value.includes(' ')) {
        pushNotification('Warning!!!', 'Provide correct location', 'warning');
        cell.innerText = initialValue;
      }
      break;

    case 'Salary':
      if (((isNaN(input.value) && !input.value.includes(' '))
        || input.value === '0')) {
        pushNotification('Warning!!!', 'Provide correct salary', 'warning');
        cell.innerText = initialValue;
      } else if (input.value.includes(' ')) {
        break;
      } else {
        cell.innerText = `$${(+input.value).toFixed(3).split('.').join(',')}`;
      }
      break;
  }
};

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const initialValue = cell.innerText;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  input.value = initialValue;
  cell.innerText = '';
  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    editorOfCell(cell, input, initialValue);
  });

  input.addEventListener('keydown', (eve) => {
    if (eve.key !== 'Enter') {
      return;
    }

    editorOfCell(cell, input, initialValue);
  });
});
