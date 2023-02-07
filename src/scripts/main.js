'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = tbody.querySelectorAll('tr');
const rows = [...tbody.children];
const row = [...tr];

// sort by click

thead.addEventListener('click', e => {
  const header = e.target.closest('th');

  if (header.dataset.sort === 'asc') {
    tbody.append(...sortTableDESC(header));
  } else {
    tbody.append(...sortTableASC(header));
  }
});

function sortTableASC(th) {
  const i = th.cellIndex;

  th.setAttribute('data-sort', 'asc');

  switch (th.textContent) {
    case 'Salary':
      return rows.sort((a, b) => convertToNumber(a.children[i].textContent)
        - convertToNumber(b.children[i].textContent));
    default:
      return rows.sort((a, b) => a.children[i].textContent
        .localeCompare(b.children[i].textContent));
  }
}

function sortTableDESC(th) {
  const i = th.cellIndex;

  th.setAttribute('data-sort', 'desc');

  switch (th.textContent) {
    case 'Salary':
      return rows.sort((a, b) => convertToNumber(b.children[i].textContent)
        - convertToNumber(a.children[i].textContent));
    default:
      return rows.sort((a, b) => b.children[i].textContent
        .localeCompare(a.children[i].textContent));
  }
}

function convertToNumber(str) {
  return +str.slice(1).split(',').join('');
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
      required
    >
  </label>

  <label> Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      required
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
      required
    >
  </label>

  <label> Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      required
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

    return;
  }

  if (!objectForm.position) {
    pushNotification('Warning',
      'Write position, please', 'warning');

    return;
  }

  if (objectForm.age < 18 || objectForm.age > 90) {
    pushNotification('Error message',
      'Age couldn\'t less than 18 and more than 90 ', 'error');

    return;
  }

  if (!objectForm.salary) {
    pushNotification('Warning',
      'Write salary, please', 'warning');

    return;
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

  form.reset();
});

// notification

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
