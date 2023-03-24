'use strict';

const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

// Task 1. Implement table sorting by clicking on the title.

const toNumber = item => +item.slice(1).replace(',', '');
let count = 0;
let indexMemory;

tableHead.addEventListener('click', e => {
  const index = e.target.cellIndex;

  if (indexMemory !== index) {
    count = 0;
  }

  let sorted = [...tableBody.rows].sort((a, b) => {
    const aText = a.cells[index].innerText;
    const bText = b.cells[index].innerText;

    switch (index) {
      case 0:
      case 1:
      case 2:
        return aText.localeCompare(bText);
      case 3:
        return +aText - +bText;
      case 4:
        return toNumber(aText) - toNumber(bText);
    }
  });

  if (count % 2 !== 0) {
    sorted = sorted.reverse();
  }

  tableBody.append(...sorted);
  count++;
  indexMemory = index;
});

// Task 1. Finished.

// Task 2. Row select.

let rowBefore = tableBody.rows[0];

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');

  row.classList.add('active');

  if (row !== rowBefore) {
    rowBefore.classList.remove('active');
  }

  rowBefore = row;
});

// Task 2. Finished.

// Task 3. Add a form.

body.insertAdjacentHTML('beforeend', `
  <form class='new-employee-form'>
    <label>
      Name:
      <input name="name" type="text" data-qa="name" required>
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label>
      Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>

    <button>Save to table</button>
  </form>
`);

// Task 3. Finished.

// Task 4. Show notification.

const buttonAdd = document.querySelector('button');

buttonAdd.addEventListener('click', e => {
  const nameEmployee = document.querySelector('[data-qa="name"]');
  const position = document.querySelector('[data-qa="position"]');
  const office = document.querySelector('[data-qa="office"]');
  const age = document.querySelector('[data-qa="age"]');
  const salary = document.querySelector('[data-qa="salary"]');

  e.preventDefault();

  if (nameEmployee.value.length < 4) {
    getNotification(
      `Invalid name!`,
      `Name is to short, enter the correct one.`,
      'error'
    );

    return;
  };

  if (position.value.length < 4) {
    getNotification(
      `Invalid position!`,
      `Position is to short, enter the correct one.`,
      'error'
    );

    return;
  };

  if (age.value < 18 || age.value > 90) {
    getNotification(
      `Invalid age!`,
      `Enter the correct age.`,
      'error'
    );

    return;
  }

  if (salary.value < 1) {
    getNotification(
      `Invalid salary!`,
      `Enter the correct salary.`,
      'error'
    );

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
    <tr class="new_employee">
      <td>${nameEmployee.value}</td>
      <td>${position.value}</td>
      <td>${office.value}</td>
      <td>${age.value}</td>
      <td>$${salary.value.toLocaleString('en-US')}</td>
    </tr>
  `);

  getNotification(
    `Completed!`,
    `The employee has been added to the table!`,
    'success'
  );
});

function getNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add(`${type}`);
  notification.dataset.qa = 'notification';
  notification.style.position = 'absolute';
  notification.style.textAlign = 'center';
  notification.style.padding = '0 10px';
  notification.style.top = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = 'purple';
  notification.style.borderRadius = '5px';

  notification.insertAdjacentHTML('beforeend', `
    <h2 class="title">
      ${title}
    </h2>
    <p>
    ${description}
    </p>
  `);

  body.append(notification);

  setTimeout(
    () => notification.remove(),
    3000);
}

// Task 4. Finished.

// Task 5. Editing of table cells by double-clicking on it.\

tableBody.addEventListener('dblclick', e => {
  const cell = e.target.closest('td');

  const defaultCell = cell.innerText;
  let input = document.createElement('input');

  input.classList.add('cell-input');
  input.style.width = getComputedStyle(cell).width;

  switch (cell.cellIndex) {
    case 0:
    case 1:
      input.type = 'text';

      break;
    case 2:
      input = document.createElement('select');

      input.insertAdjacentHTML('afterbegin', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
      `);

      break;
    case 3:
    case 4:
      input.type = 'number';
  }

  if (cell.firstChild) {
    cell.removeChild(cell.firstChild);
  }

  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (cell.cellIndex) {
      case 0:
        if (input.value.length < 4) {
          getNotification(
            `Invalid name!`,
            `Name is to short, enter the correct one.`,
            'error'
          );
          input.value = defaultCell;
        }
        break;
      case 1:
        if (input.value.length < 3) {
          getNotification(
            `Invalid position!`,
            `Position is to short, enter the correct one.`,
            'error'
          );
          input.value = defaultCell;
        }
        break;

      case 2:
        break;

      case 3:
        if (input.value < 18 || input.value > 90) {
          getNotification(
            `Invalid age!`,
            `Enter the correct age.`,
            'error'
          );
          input.value = defaultCell;
        }
        break;

      case 4:
        if (input.value < 1) {
          getNotification(
            `Invalid salary!`,
            `Enter the correct salary.`,
            'error'
          );
          cell.innerText = defaultCell;
        } else {
          cell.innerText = `$${input.value.toLocaleString('en-US')}`;
        }
        break;

      default:
        getNotification(
          `Unknown error!`,
          `Please check the correctness of the entered data.`,
          'error'
        );
    }

    cell.innerText = input.value;
    cell.removeChild(input);
  });

  input.addEventListener('keydown', enter => {
    if (enter.key === 'Enter') {
      input.blur();
    }
  });
});

// Task 5. Finished.
