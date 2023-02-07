'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const tr = tbody.querySelectorAll('tr');
const row = [...tr];

// sort by click

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th || !table.contains(th)) {
    return;
  }

  sortASC(th.cellIndex, th.innerHTML);
});

function sortASC(index, text) {
  switch (text) {
    case 'Name':
    case 'Position':
    case 'Office':
      row.sort((a, b) =>
        a.cells[index].innerHTML.localeCompare(b.cells[index].innerHTML));
      break;

    case 'Age':
      row.sort((a, b) =>
        a.cells[index].innerHTML - b.cells[index].innerHTML);
      break;

    case 'Salary':
      row.sort((a, b) =>
        normalizeNumber(a.cells[index].innerHTML)
          - normalizeNumber(b.cells[index].innerHTML));
      break;

    default:
      return;
  }

  tbody.append(...row);
}

// sort by double click

table.addEventListener('dblclick', (e) => {
  const th = e.target.closest('th');

  if (!th || !table.contains(th)) {
    return;
  }

  sortDESC(th.cellIndex, th.innerHTML);
});

function sortDESC(index, text) {
  switch (text) {
    case 'Name':
    case 'Position':
    case 'Office':
      row.sort((a, b) =>
        b.cells[index].innerHTML.localeCompare(a.cells[index].innerHTML));
      break;

    case 'Age':
      row.sort((a, b) =>
        b.cells[index].innerHTML - a.cells[index].innerHTML);
      break;

    case 'Salary':
      row.sort((a, b) =>
        normalizeNumber(b.cells[index].innerHTML)
          - normalizeNumber(a.cells[index].innerHTML));
      break;

    default:
      return;
  }

  tbody.append(...row);
}

function normalizeNumber(number) {
  return +number.slice(1).split(',').join('');
}

// active row

tbody.addEventListener('click', e => {
  const activeRow = e.target.closest('tr');
  const foundRow = row.find(elem => elem.className === 'active');

  if (foundRow) {
    foundRow.classList.remove('active');
  }

  activeRow.classList.add('active');
});

// create form

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">

  <label> Name:
    <input
      name="name"
      type="text"
      data-qa="name"
    >
  </label>

  <label> Position:
    <input
      name="position"
      type="text"
      data-qa="position"
    >
  </label>

  <label>Office:
    <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label> Age:
    <input
      name="age"
      type="number"
      data-qa="age"
    >
  </label>

  <label> Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
    >
  </label>

  <button type="submit">
    Save to table
  </button>
  </form>
`);

// submit

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const objectForm = Object.fromEntries(data.entries());

  if (objectForm.name.length < 4) {
    pushNotification('Error message',
      'Name value must be more than 4 letters', 'error');
  }

  if (!objectForm.position) {
    pushNotification('Warning',
      'Write position, please', 'warning');
  }

  if (objectForm.age < 18 || objectForm.age > 90) {
    pushNotification('Error message',
      'Age couldn\'t less than 18 and more than 90 ', 'error');
  }

  if (!objectForm.salary) {
    pushNotification('Warning',
      'Write salary, please', 'warning');
  }

  tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${objectForm.name}</td>
    <td>${objectForm.position}</td>
    <td>${objectForm.office}</td>
    <td>${objectForm.age}</td>
    <td>$${Number(objectForm.salary).toLocaleString('en-US')}</td>
  <tr>
  `);

  pushNotification('Success',
    'Great, information add to table', 'success');
});

const pushNotification = (title, description, type) => {
  const lastNotification = document.querySelector('.notification');

  if (lastNotification) {
    lastNotification.remove();
  }

  document.body.insertAdjacentHTML('beforeend', `
    <div data-qa="notification" class="notification ${type}">
      <h2 class="title">${title}</h2>
      <p>${description}</p>
    </div>
  `);

  const notification = document.querySelector('.notification');

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

// cells editing

tbody.addEventListener('dblclick', e => {
  const cell = e.target.closest('td');
  const oldData = cell.textContent;

  cell.innerHTML = `
    <input class="cell-input" name="input" value=${oldData} type="text">
  `;

  const cellInput = document.querySelector('.cell-input');

  if (cell.cellIndex === 3 || cell.cellIndex === 4) {
    cellInput.type = 'number';
  }

  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    setCellData(cell, cellInput, oldData);
  });

  cellInput.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      setCellData(cell, cellInput, oldData);
    }
  });
});

function setCellData(cell, input, oldData) {
  let newData = input.value;

  if (!newData) {
    newData = oldData;
  }

  cell.textContent = `${newData}`;

  if (cell.cellIndex === 4) {
    cell.textContent = `$${Number(newData).toLocaleString('en-US')}`;
  }
}
