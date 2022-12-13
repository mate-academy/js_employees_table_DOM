'use strict';

const head = document.querySelector('thead');
const table = document.querySelector('tbody');
const body = document.querySelector('body');
let column;
let ascending = true;

head.addEventListener('click', (ev) => {
  const item = ev.target.closest('th');
  const itemIndex = item.cellIndex;

  if (column === itemIndex && ascending) {
    return reSortRows([...table.rows], itemIndex).forEach(tr => {
      table.append(tr);
    });
  }

  sortRows([...table.rows], itemIndex).forEach(tr => {
    table.append(tr);
  });
  column = itemIndex;
});

function num(str) {
  return +str.replace(/[,$]/g, '');
}

function sortRows(arr, index) {
  ascending = true;

  return arr.sort((a, b) => {
    if (isNaN(num(a.cells[index].innerText))) {
      return a.cells[index].innerText.localeCompare(b.cells[index].innerText);
    } else {
      return num(a.cells[index].innerText) - num(b.cells[index].innerText);
    }
  });
}

function reSortRows(arr, index) {
  ascending = false;

  return arr.sort((a, b) => {
    if (isNaN(num(a.cells[index].innerText))) {
      return b.cells[index].innerText.localeCompare(a.cells[index].innerText);
    } else {
      return num(b.cells[index].innerText) - num(a.cells[index].innerText);
    }
  });
}

table.addEventListener('click', (ev) => {
  const item = ev.target.closest('tr');

  const activeRow = table.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  item.classList.add('active');
});

const container = document.createElement('container');

container.classList.add('notificationContainer');
body.append(container);

container.insertAdjacentHTML('afterbegin',
  `<form class="new-employee-form">
    <label>Name:
      <input name="name" data-qa="name" type="text" required>
    </label>
    <label>Position:
      <input name="position" data-qa="position" type="text" required>
    </label>
    <label>Office:
      <select name="select-office" data-qa="office" required>
        <option disabled selected value="" hidden></option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="london">London</option>
        <option value="New-York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input name="age"  data-qa="age" type="number" required>
    </label>
    <label>Salary:
      <input name="salary" data-qa="salary" type="number" required>
    </label>
    <button type="submit">Save to table</button>
  </form>`
);

const form = document.querySelector('form');
const buttonSubmit = document.querySelector('button');
const fieldsForm = document.querySelectorAll('input, select');

buttonSubmit.addEventListener('click', (ev) => {
  ev.preventDefault();

  const newRow = document.createElement('tr');
  const salary = document.querySelector('[data-qa*=salary]');

  if (!validateForm(fieldsForm)) {
    return;
  }

  [...fieldsForm].forEach(field => {
    const inputValue = field.value;
    const newCell = document.createElement('td');

    table.append(newRow);

    if (inputValue !== salary.value) {
      newCell.append(`${inputValue[0]
        .toUpperCase()}${inputValue.slice(1, inputValue.length)}`);
    } else {
      newCell.append(`$${parseInt(inputValue).toLocaleString('en-US')}`);
    }
    newRow.append(newCell);
  });
  form.reset();

  pushNotification('Done',
    'A new employee is successfully added to the table.\n', 'success');
});

table.addEventListener('dblclick', (ev) => {
  const activeCell = ev.target.closest('td');
  const activeCellIndex = activeCell.cellIndex;
  const cellText = activeCell.textContent;
  const inputCell = fieldsForm[activeCellIndex].cloneNode(true);

  inputCell.classList.add('cell-input');
  inputCell.style.width = `${parseInt(getComputedStyle(activeCell).width)}px`;

  if (!activeCell.querySelector('input')) {
    activeCell.textContent = '';
    inputCell.value = cellText;
    activeCell.append(inputCell);

    if (inputCell.name === 'salary') {
      inputCell.value = num(cellText);
    }
  }

  inputCell.onblur = function() {
    let inputValue = inputCell.value;
    const td = inputCell.closest('td');

    if (inputCell.name === 'salary') {
      inputValue = `$${parseInt(inputValue).toLocaleString('en-US')}`;
    }

    if (inputValue.length === 0) {
      inputValue = cellText;
    } else if (!validateForm([inputCell])) {
      return;
    }
    td.innerText = inputValue;

    pushNotification('Done',
      `Field was successfully change.\n`, 'success');
  };

  activeCell.addEventListener('keydown', (ev2) => {
    if (ev2.key === 'Enter') {
      ev2.target.blur();
    }
  });
});

function pushNotification(title, description, type) {
  container.insertAdjacentHTML('beforeend', `
  <div class="notification ${type}" data-qa="notification">
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  </div>
  `);

  const notification = document.querySelectorAll('[data-qa*=notification]');

  setTimeout(() => [...notification].forEach(n => n.remove()), 2000);
}

function validateForm(fields) {
  for (const field of fields) {
    if (field.value.trim().length === 0) {
      pushNotification('Warning',
        `Field ${field.name} can not be empty.\n`, 'error');

      return false;
    }

    if ((field.name === 'name' && field.value.trim().length > 0)
      && field.value.trim().length < 4) {
      pushNotification('Error',
        'Name can not be less than 4 letters.\n', 'error');

      return false;
    }

    if (field.name === 'age' && (field.value < 18 || field.value > 90)) {
      pushNotification('Error',
        'The age can not be less then 18 or more than 90.\n', 'error');

      return false;
    }

    if (container.children.length > 4) {
      pushNotification.hidden = true;
    }
  }

  return true;
}
