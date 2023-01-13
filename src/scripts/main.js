'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...tbody.children];

// table sorting implementation

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

// row selecting
tbody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const selectedRow = rows.find(el => el.className === 'active');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  row.classList.add('active');
});

// form adding

document.body.insertAdjacentHTML('beforeend', `
  <form class= "new-employee-form">
    <label>Name: 
      <input 
        name="name" 
        type="text"
        data-qa="name"
      >
    </label>

    <label>Position: 
      <input 
        name="position" 
        type="text"
        data-qa="position"
      >
    </label>

    <label>Office: 
      <select name="office" data-qa="office">
        <option value="Tokyo" selected>Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age: 
      <input 
        name="age" 
        type="number"
        data-qa="age"
      >
    </label>

    <label>Salary: 
      <input 
        name="salary" 
        type="number"
        data-qa="salary"
      >
    </label>

    <button type= "submit">
      Save to table
    </button>
  </form>
`);

// add a new employee to the table

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const newEmployee = Object.fromEntries(data.entries());

  if (newEmployee.name.length < 4) {
    pushNotification('Error message',
      'Name couldn\'t be less than 4 letters.', 'error');

    return;
  }

  if (newEmployee.age < 18 || newEmployee.age > 90) {
    pushNotification('Error message',
      'Age couldn\'t be less than 18 or more than 90.', 'error');

    return;
  }

  if (!newEmployee.position) {
    pushNotification('Error message',
      'Position should be indicated.', 'error');

    return;
  }

  if (!newEmployee.salary) {
    pushNotification('Error message',
      'Salary should be indicated.', 'error');

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${newEmployee.name}</td>
      <td>${newEmployee.position}</td>
      <td>${newEmployee.office}</td>
      <td>${newEmployee.age}</td>
      <td>$${Number(newEmployee.salary).toLocaleString('en-US')}</td>
    </tr>
  `);

  pushNotification('Success message',
    'New employee was successfully added to the table.', 'success');

  form.reset();
});

// notification

const pushNotification = (title, description, type) => {
  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.remove();
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
  }, '5000');
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
