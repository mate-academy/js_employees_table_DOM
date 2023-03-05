'use strict';

const tbody = document.querySelector('tbody');
let rows = [...document.querySelector('tbody').children];
let cells = [...document.querySelectorAll('td')];
const headers = [...document.querySelector('tr').children];
const table = document.querySelector('table');

let headerClicked = false;
let previouslyActiveRow = null;

const updateRows = () => [...document.querySelector('tbody').children];

const updateCells = () => [...document.querySelectorAll('td')];

const createNotification = (type, title, description) => {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.classList.add(type);
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notification);
};

const pushNotification = createNotificationFunc => {
  createNotificationFunc;

  setTimeout(() => {
    document.body.removeChild(document.querySelector('.notification'));
  }, 2000);
};

const saveCell = cell => {
  const input = cell.querySelector('input');
  const initialValue = selectedCell.dataset.initialValue;

  if (!input.value.length) {
    cell.innerText = initialValue;
  } else {
    // Name configuration
    if (cell.cellIndex === 0) {
      if (input.value.length < 4) {
        pushNotification(
          createNotification(
            'error',
            'Error',
            'Name should have at least 4 letters'
          )
        );

        cell.innerText = initialValue;
      } else {
        cell.innerText = input.value;
      }
      // Age configuration
    } else if (cell.cellIndex === 3) {
      if (input.value < 18 || input.value > 90) {
        pushNotification(
          createNotification(
            'error',
            'Error',
            'Age should be between 18 and 90'
          )
        );

        cell.innerText = initialValue;
      } else if (isNaN(input.value)) {
        pushNotification(
          createNotification(
            'error',
            'Error',
            'Age cannot be string'
          )
        );

        cell.innerText = initialValue;
      } else {
        cell.innerText = input.value;
      }
      // Salary configuration
    } else if (cell.cellIndex === 4) {
      if (isNaN(input.value)) {
        pushNotification(
          createNotification(
            'error',
            'Error',
            'Salary cannot be string'
          )
        );

        cell.innerText = initialValue;
      } else {
        cell.innerText
          = '$' + Math.ceil(input.value).toLocaleString('en-US');
      }
    } else {
      cell.innerText = input.value;
    }
  }

  if (input.parentElement === cell) {
    cell.removeChild(input);
  }

  cell = null;
};

const cellConfig = () => {
  cells.forEach(cell => {
    cell.addEventListener('dblclick', e => {
      selectedCell = e.target;
      selectedCell.dataset.initialValue = selectedCell.innerText.trim();
      selectedCell.innerText = '';

      const input = document.createElement('input');

      input.className = 'cell-input';

      const select = office.cloneNode(true);

      if (cell.cellIndex === 2) {
        selectedCell.append(select);

        select.addEventListener('change', () => {
          input.value = select.value;

          selectedCell.removeChild(select);
          selectedCell.append(input);

          saveCell(selectedCell);
        });
      } else {
        selectedCell.append(input);
      }

      input.focus();
      input.addEventListener('blur', () => saveCell(selectedCell));

      input.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          saveCell(selectedCell);
        }
      });
    });
  });
};

table.addEventListener('click', e => {
  if (e.target.parentElement.parentElement.tagName === 'TFOOT') {
    return;
  }

  if (e.target.tagName === 'TH') {
    const index = headers.indexOf(e.target);

    const sort = (rows, ascending = true) => {
      rows.sort((row1, row2) => {
        const firstColumn = row1.children[index].innerText;
        const secondColumn = row2.children[index].innerText;

        if (ascending) {
          return firstColumn.localeCompare(secondColumn, undefined, {
            numeric: true, sensitivity: 'base',
          });
        } else {
          return secondColumn.localeCompare(firstColumn, undefined, {
            numeric: true, sensitivity: 'base',
          });
        }
      });

      rows.forEach(row => tbody.append(row));
    };

    if (headerClicked) {
      sort(rows, false);
      headerClicked = false;
    } else {
      sort(rows);
      headerClicked = true;
    }
  }

  if (e.target.tagName === 'TD') {
    const row = e.target.closest('TR');

    if (previouslyActiveRow) {
      previouslyActiveRow.classList.remove('active');
    }

    row.classList.add('active');
    previouslyActiveRow = row;
  }
});

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>
      Name: <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
       Position: 
         <input name="position" type="text" data-qa="position" required>
     </label>
    <label>
      Office:
      <select data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age: <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary: 
        <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button>Save to table</button>
  </form>`
);

const nameInput = document.querySelector('[data-qa="name"]');
const positionInput = document.querySelector('[data-qa="position"]');
const office = document.querySelector('[data-qa="office"]');
const age = document.querySelector('[data-qa="age"]');
const salary = document.querySelector('[data-qa="salary"]');
const button = document.querySelector('button');

const form = document.querySelector('.new-employee-form');

button.addEventListener('click', e => {
  e.preventDefault();

  if (positionInput.value === ''
    || age.value === ''
    || salary.value === '') {
    pushNotification(
      createNotification(
        'error',
        'Error',
        'All fields should be filled'
      )
    );

    return;
  } else if (nameInput.value.length < 4) {
    pushNotification(
      createNotification(
        'error',
        'Error',
        'Name should have at least 4 letters'
      )
    );

    return;
  } else if (age.value < 18 || age.value > 90) {
    pushNotification(
      createNotification(
        'error',
        'Error',
        'Age should be between 18 and 90'
      )
    );

    return;
  } else {
    pushNotification(
      createNotification(
        'success',
        'Success',
        'New employee was successfully added'
      )
    );
  }

  const newRow = document.createElement('tr');
  const officeValue = office.value;
  const formattedSalary = Math.ceil(salary.value).toLocaleString('en-US');

  newRow.innerHTML
  = `
  <td>${nameInput.value}</td>
  <td>${positionInput.value}</td>
  <td>${officeValue}</td>
  <td>${age.value}</td>
  <td>$${(formattedSalary)}</td>`;

  tbody.appendChild(newRow);
  rows = updateRows();
  cells = updateCells();
  cellConfig();
  form.reset();
});

let selectedCell = null;

cellConfig();
