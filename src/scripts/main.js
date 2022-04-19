'use strict';

// write code here
const pageBody = document.querySelector('body');
const table = document.querySelector('table');
const tableBody = table.tBodies[0];
const tableHead = table.tHead;
const tableBodyRows = tableBody.rows;
const ourOffices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

table.style.userSelect = 'none';

function pushNotification(type) {
  const errorBox = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  errorBox.classList.add(`notification`);
  errorBox.classList.add(`${type}`);
  errorBox.dataset.qa = 'notification';
  errorBox.style.userSelect = 'none';

  errorBox.style.top = `10px`;
  errorBox.style.right = `10px`;

  h2.classList.add('title');
  errorBox.prepend(h2);

  errorBox.append(p);

  switch (type) {
    case 'error':
      h2.innerText = 'Error';
      p.innerText = 'Input values should be correct!';
      break;

    case 'success':
      h2.innerText = 'Success';
      p.innerText = 'New employee was added to the table';
      break;

    case 'warning':
      h2.innerText = 'Warning';
      p.innerText = 'Input value is not correct!';
      break;
  }

  pageBody.append(errorBox);

  setTimeout(() => {
    errorBox.remove();
  }, 4000);
};

function sortStrColumns(type, a, z) {
  return type === 'ASC'
    ? a.localeCompare(z)
    : z.localeCompare(a);
}

function sortNumColumns(type, zero, nine) {
  return type === 'ASC'
    ? zero.localeCompare(nine)
    : nine.localeCompare(zero);
}

let prevTitle;

function sortRows(rows, index, sortType) {
  const sorted = rows.sort((x, y) => {
    const first = x.children[index].textContent.replace(/[^a-zA-Z0-9 ]/g, '');
    const second = y.children[index].textContent.replace(/[^a-zA-Z0-9 ]/g, '');

    return isNaN(+first)
      ? sortStrColumns(sortType, first, second)
      : sortNumColumns(sortType, first, second);
  });

  sorted.forEach(x => tableBody.append(x));
}

function toggleSortingTypes(element) {
  element.classList.toggle('DESC');
  element.classList.toggle('ASC');
}

tableHead.addEventListener('click', (ev) => {
  const columnIndex = ev.target.cellIndex;
  const title = ev.target;

  if (prevTitle === title) {
    if (prevTitle.classList.contains('ASC')) {
      toggleSortingTypes(title);

      sortRows([...tableBodyRows], columnIndex, 'DESC');
    } else if (prevTitle.classList.contains('DESC')) {
      toggleSortingTypes(title);

      sortRows([...tableBodyRows], columnIndex, 'ASC');
    }
  } else {
    if (prevTitle !== undefined) {
      prevTitle.removeAttribute('class');
    }

    title.classList.add('ASC');
    sortRows([...tableBodyRows], columnIndex, 'ASC');
  }

  prevTitle = title;
});

function activateRow(row) {
  row.classList.toggle('active');
}

function diactivateRow(row, prev) {
  activateRow(row);
  prevRow.classList.remove('active');
}

let prevRow;

tableBody.addEventListener('click', (ev) => {
  const row = ev.target.parentElement;

  prevRow === undefined || prevRow === row
    ? activateRow(row)
    : diactivateRow(row, prevRow);

  prevRow = row;
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.method = 'get';

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input
      name="name"
      type="text"
      placeholder="Name"
      data-qa="name"
      required
    >
  </label>

  <label>Position:
    <input
      name="position"
      type="text"
      placeholder="Position"
      data-qa="position"
      required
    >
  </label>

  <label>Office:
    <select
      name="office"
      data-qa="office"
      required>
      <option value="" disabled selected>
        Choose your office
      </option>

      <option value="Tokyo">
        Tokyo
      </option>

      <option value="Singapore">
        Singapore
      </option>

      <option value="London">
        London
      </option>

      <option value="New York">
        New York
      </option>

      <option value="Edinburgh">
        Edinburgh
      </option>

      <option value="San Francisco">
        San Francisco
      </option>
    </select>
  </label>

  <label>Age:
    <input
      name="age"
      type="number"
      placeholder="Age"
      data-qa="age"
      required
    >
  </label>

  <label>Salary:
    <input
      name="salary"
      type="number"
      min="0"
      placeholder="Salary in dollars"
      data-qa="salary"
      required
    >
  </label>

  <button type="submit">
    Save to table
  </button>
`);
pageBody.append(form);

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = Object.fromEntries(new FormData(form).entries());

  if (data.name.length > 3 && data.age > 18 && data.age < 90) {
    const salaryNum = +data.salary;

    tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>$${salaryNum.toLocaleString('en-US')}</td>
    </tr>
    `);
    pushNotification('success');

    form.reset();
  } else {
    pushNotification('error');
  }
});

tableBody.addEventListener('dblclick', (ev) => {
  const cell = ev.target;
  const oldValue = cell.innerText.trim();

  cell.innerText = '';

  cell.insertAdjacentHTML('afterbegin', `
      <form method="POST">
        <label>
          <input
          class="cell-input"
          name="newValue"
          type="text">
        </label>
      </form>
    `);

  const cellInput = cell.firstElementChild;

  cellInput.firstElementChild.firstElementChild.focus();

  cellInput.addEventListener('keydown', (e) => {
    const data = new FormData(cellInput);
    const inputValue = data.get('newValue');

    if (e.key === 'Enter') {
      if (inputValue.length === 0) {
        cell.textContent = oldValue;

        pushNotification('warning');

        return;
      }

      if (cell.cellIndex === 0 && inputValue.length < 4) {
        cell.textContent = oldValue;

        pushNotification('warning');

        return;
      }

      if (cell.cellIndex === 2 && !ourOffices.includes(inputValue)) {
        cell.textContent = oldValue;

        pushNotification('warning');

        return;
      }

      if (cell.cellIndex === 3
        && (isNaN(+inputValue) || +inputValue < 18 || +inputValue > 90)) {
        cell.textContent = oldValue;

        pushNotification('warning');

        return;
      }

      if (cell.cellIndex === 4 && isNaN(+inputValue)) {
        cell.textContent = oldValue;

        pushNotification('warning');

        return;
      } else if (cell.cellIndex === 4) {
        const valueToNum = +inputValue;

        cell.textContent = `$${valueToNum.toLocaleString('en-US')}`;

        return;
      }

      cell.textContent = inputValue;
    }
  });

  cellInput.addEventListener('focusout', (e) => {
    const data = new FormData(cellInput);
    const inputValue = data.get('newValue');

    if (inputValue.length === 0) {
      cell.textContent = oldValue;

      pushNotification('warning');

      return;
    }

    if (cell.cellIndex === 0 && inputValue.length < 4) {
      cell.textContent = oldValue;

      pushNotification('warning');

      return;
    }

    if (cell.cellIndex === 2 && !ourOffices.includes(inputValue)) {
      cell.textContent = oldValue;

      pushNotification('warning');

      return;
    }

    if (cell.cellIndex === 3
      && (isNaN(+inputValue) || +inputValue < 18 || +inputValue > 90)) {
      cell.textContent = oldValue;

      pushNotification('warning');

      return;
    }

    if (cell.cellIndex === 4 && isNaN(+inputValue)) {
      cell.textContent = oldValue;

      pushNotification('warning');

      return;
    } else if (cell.cellIndex === 4) {
      const valueToNum = +inputValue;

      cell.textContent = `$${valueToNum.toLocaleString('en-US')}`;

      return;
    }

    cell.textContent = inputValue;
  });
});
