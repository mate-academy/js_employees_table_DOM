'use strict';

const table = document.querySelector('table');
const tBodie = table.tBodies[0];
const headerItems = [...table.rows[0].cells];
const sorter = {};

function toNumber(cellContent) {
  const number = Number(cellContent.split(',').join('').split('$').join(''));

  if (isNaN(number)) {
    return cellContent;
  } else {
    return number;
  }
}

function pushNotification(top, right, title, description, type) {
  const notification = document.createElement('div');

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  notification.style.top = top;
  notification.style.right = right;

  document.body.append(notification);
  notification.classList.add('notification');
  notification.classList.add(type);

  window.setTimeout(() => notification.remove(), 2000);
}

// sorter creation

headerItems.forEach((cell, index) => {
  const content = cell.textContent.toLowerCase();
  const type = typeof toNumber(table.rows[1].cells[index].textContent);

  sorter[content] = {
    order: 'ASC',
    ASC: (a, b) => {
      return type === 'number'
        ? toNumber(a) - toNumber(b)
        : a.localeCompare(b);
    },

    DESC: (a, b) => {
      return type === 'number'
        ? toNumber(b) - toNumber(a)
        : b.localeCompare(a);
    },
  };
});

// table sorting by clicking on the title (this time in two directions)

table.addEventListener('click', event => {
  const target = event.target;
  const index = headerItems.indexOf(target);

  if (index !== -1) {
    const people = [...tBodie.rows];
    const content = headerItems[index].textContent.toLowerCase();
    const callback = function(prev, next) {
      const prevCell = prev.cells[index].textContent;
      const nextCell = next.cells[index].textContent;

      return sorter[content][sorter[content].order](prevCell, nextCell);
    };

    const sortedPeople = people.sort(callback);

    if (sorter[content].order === 'ASC') {
      sorter[content].order = 'DESC';
    } else {
      sorter[content].order = 'ASC';
    }

    tBodie.append(...sortedPeople);
  }
});

// When you click on a row of the table, it should become selected

table.addEventListener('click', event => {
  const rows = [...tBodie.rows];
  const index = rows.indexOf(event.target.closest('tr'));

  rows.forEach(row => {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  });

  if (index !== -1) {
    rows[index].classList.add('active');
  }
});

// add a form to the document, add new employees to the spreadsheet
// Throw notification if form data is invalid

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      type="text"
      required="true"
    >
  </label>

  <label>
    Position:
    <input
      name="position"
      type="text"
      required="true"
    >
  </label>

  <label>
    Office:
    <select required name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>

  <label>
    Age:
    <input
      name="age"
      type="number"
      required="true"
    >
  </label>

  <label>
    Salary:
    <input
      name="salary"
      type="number"
      required="true"
    >
  </label>

  <button>Save to table</button>
`;

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (form.name.value.length < 4) {
    pushNotification(
      '100px',
      '100px',
      'Short name',
      'Should not be less than 4 digits',
      'error'
    );
  } else if (+form.age.value < 18 || +form.age.value > 90) {
    pushNotification(
      '100px',
      '100px',
      'Go rest!',
      'Sorry, you cannot be our employee :(',
      'error'
    );
  } else {
    const newRow = document.createElement('tr');
    const labels = form.querySelectorAll('label');

    newRow.innerHTML = `
      <td>${labels[0].firstElementChild.value}</td>
      <td>${labels[1].firstElementChild.value}</td>
      <td>${labels[2].firstElementChild.value}</td>
      <td>${labels[3].firstElementChild.value}</td>
      <td>
        $${Number(labels[4].firstElementChild.value).toLocaleString('en-En')}
      </td>
    `;

    tBodie.append(newRow);

    pushNotification(
      '100px',
      '100px',
      'Welcome!',
      'We are happy to see you in our team!',
      'success'
    );
  }
});

// editing of table cells by double-clicking on it

tBodie.addEventListener('dblclick', event => {
  event.preventDefault();

  const cell = event.target;
  const text = cell.textContent;

  cell.innerHTML = `
    <input name="change" value="${text}" class="cell-input">
  `;

  document.body.addEventListener('click', e => {
    if (e.target !== cell.children[0]) {
      const input = cell.children[0];
      let inputText = input.value;

      if (inputText === '') {
        inputText = text;
      }

      cell.innerHTML = inputText;
    }
  });

  document.body.addEventListener('keyup', e => {
    if (e.code === 'Enter') {
      const input = cell.children[0];
      let inputText = input.value;

      if (inputText === '') {
        inputText = text;
      }

      cell.innerHTML = inputText;
    }
  });
});
