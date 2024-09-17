'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');

const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');

const TOWNS = {
  tokyo: 'Tokyo',
  singapore: 'Singapore',
  london: 'London',
  newYork: 'New York',
  edinburgh: 'Edinburgh',
  sanFrancisco: 'San Francisco',
};

const NOTIFICATIONS = {
  shortName: {
    title: 'Wrong name value',
    description: 'Name value has less than 4 letters',
    type: 'error',
  },
  lowAge: {
    title: 'Wrong age value',
    description: 'Age value is less than 18',
    type: 'error',
  },
  tooOld: {
    title: 'Wrong age value',
    description: 'Age value is bigger than 90',
    type: 'error',
  },
  success: {
    title: 'Successfully added',
    description: 'New employee successfully added to the table',
    type: 'success',
  },
};

// ----------------------------------------------------------------
// Sort table by column with reverse option
const directions = [...headers].map(header => '');

function sortTableByColumn(index) {
  const makeNumber = number => parseInt((number).replace(/\D+/g, ''));

  const newRows = [...tBody.rows];

  const direction = directions[index] || 'asc';

  const multiplier = (direction === 'asc') ? 1 : -1;

  newRows.sort((a, b) => {
    const colA = a.cells[index].textContent;
    const colB = b.cells[index].textContent;

    if (isNaN(makeNumber(colA)) || isNaN(makeNumber(colB))) {
      return colA > colB ? 1 * multiplier : -1 * multiplier;
    } else {
      return (makeNumber(colA) * multiplier) - (makeNumber(colB) * multiplier);
    }
  });

  directions[index] = direction === 'asc' ? 'desc' : 'asc';

  tBody.append(...newRows);
}

tHead.addEventListener('click', (e) => {
  const point = e.target;

  sortTableByColumn(point.cellIndex);
});

// ----------------------------------------------------------------
// lick on a row become selected.
tBody.addEventListener('click', (e) => {
  const activeRow = e.target.parentNode;

  [...tBody.rows].map(row => {
    row.classList.remove('active');
  });

  activeRow.classList.add('active');
});

// ----------------------------------------------------------------
// Editing table by double click
tBody.addEventListener('click', (e) => {
  e.target.contentEditable = true;

  setTimeout(() => {
    if (document.activeElement !== e.target) {
      e.target.contentEditable = false;
    }
  }, 300);
});

// Save value if press Enter
tBody.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.target.removeAttribute('contenteditable');
  }
});

// ----------------------------------------------------------------
// Input form
function createNewEmployeeForm() {
  let officeOption = '';

  for (const town in TOWNS) {
    officeOption += `<option value="${town}">${TOWNS[town]}</option>`;
  }

  const formInit = `
    <form action="/" method="get" class='new-employee-form'>
      <label>Name: <input name="name" type="text" required></label>
      <label>Position: <input name="position" type="text" required></label>
      <label>Office: <select name="office">${officeOption}</select></label>
      <label>Age: <input name="age" type="number" required></label>
      <label>Salary: <input name="salary" type="number" required></label>
      <button type="submit">Save to table</button>
    </form>
  `;

  body.insertAdjacentHTML('beforeend', formInit);
}

createNewEmployeeForm();

// ----------------------------------------------------------
// Push notification

function pushNotification(data) {
  const { type, title, description } = data;

  const notificationTemplate = `
    <div class="notification ${type}">
      <h2 class='title'>${title}</h2>
      <p>${description}</p>
    </div>
  `;

  body.insertAdjacentHTML('afterbegin', notificationTemplate);

  const notification = document.querySelector('.notification');

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
};
// ----------------------------------------------------------
// Create row

function rowAdder(data) {
  const { name, position, office, age, salary } = data; // eslint-disable-line

  const newRow = `
    <tr>
      <td>${name}</td>
      <td>${position}</td>
      <td>${TOWNS[office]}</td>
      <td>${age}</td>
      <td>$${new Intl.NumberFormat().format(salary)}</td>
    </tr>
  `;

  return tBody.insertAdjacentHTML('beforeend', newRow);
}

// ------------------------------------------------------------
function validateForm(data) {
  const { name, age } = data; // eslint-disable-line

  if (name.length < 4) {
    pushNotification(NOTIFICATIONS.shortName);

    return false;
  }

  if (Number(age) < 18) {
    pushNotification(NOTIFICATIONS.lowAge);

    return false;
  } else if (Number(age) >= 90) {
    pushNotification(NOTIFICATIONS.tooOld);

    return false;
  }

  return true;
}

// add validated row to table
const form = document.querySelector('form');

function handleSubmit(e) {
  e.preventDefault();

  const employee = Object.fromEntries(new FormData(form).entries());

  if (validateForm(employee)) {
    rowAdder(employee);

    pushNotification(NOTIFICATIONS.success);

    form.reset();
  }
}

form.addEventListener('submit', handleSubmit);
