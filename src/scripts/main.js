'use strict';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

let asc = true;
let checkColumn;

function ascSort(rowCollection, targetIndex) {
  asc = true;

  return Array.from(rowCollection).sort((a, b) => {
    const cellA = a.cells[targetIndex].innerText;
    const cellB = b.cells[targetIndex].innerText;

    return isNaN(normalize(cellA))
      ? cellA.localeCompare(cellB)
      : normalize(cellA) - normalize(cellB);
  });
}

function descSort(rowCollection, targetIndex) {
  asc = false;

  return Array.from(rowCollection).sort((a, b) => {
    const cellA = a.cells[targetIndex].innerText;
    const cellB = b.cells[targetIndex].innerText;

    return isNaN(normalize(cellA))
      ? cellB.localeCompare(cellA)
      : normalize(cellB) - normalize(cellA);
  });
}

function normalize(str) {
  return +str.replace(/[,$]/g, '');
}

function appendElement(table, el) {
  table.append(el);
}

// Sort table
tHead.addEventListener('click', (evt) => {
  const title = evt.target;
  const idx = title.cellIndex;

  if (checkColumn === idx && asc) {
    return descSort(tBody.rows, idx).forEach(rowEl => {
      appendElement(tBody, rowEl);
    });
  }

  return ascSort(tBody.rows, idx).forEach(rowEl => {
    appendElement(tBody, rowEl);
    checkColumn = idx;
  });
});

// Add class active to rows
tBody.addEventListener('click', (evt) => {
  const targetEl = evt.target;

  Array.from(tBody.rows).forEach(row => row.classList.contains('active')
    ? row.classList.remove('active')
    : targetEl.parentNode.classList.add('active'));
});

// Add Form on page
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('method', 'get');

form.insertAdjacentHTML('afterbegin', `
    <label for="name">
      Name:
      <input
        id="name"
        type="text"
        name="name"
        data-qa="name"
      >
    </label>

    <label for="position">
      Position:
      <input
        id="position"
        name="position"
        type="text"
        data-qa="position"
      >
    </label>

    <label for="office">
      Office:
      <select
        id="office"
        name="office"
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label for="age">
      Age:
      <input
        id="age"
        type="number"
        name="age"
        data-qa="age"
      >
    </label>

    <label for="salary">
      Salary:
      <input
        id="salary"
        type="number"
        name="salary"
        data-qa="salary"
      >
    </label>

    <button id="submit" type="submit">Save to table</button>
`);
document.body.append(form);

// Add data from form in table
function onAddRow(e) {
  e.preventDefault();

  const data = new FormData(form);
  const nameInput = data.get('name');
  const positionInput = data.get('position');
  const officeInput = data.get('office');
  const ageInput = data.get('age');
  const salaryInput = data.get('salary');
  const newSalary = '$' + Number(salaryInput).toLocaleString('en-US');

  if (nameInput.length < 4) {
    return pushNotification('Error',
      'Please, enter at least 4 characters', 'error');
  } else if (positionInput.length <= 0) {
    return pushNotification('Error',
      'Please, enter position', 'error');
  } else if (ageInput < 18 || ageInput > 90) {
    return pushNotification(
      'Error', 'Please, enter a valid age', 'error');
  } else {
    const row = document.createElement('tr');

    row.insertAdjacentHTML('afterbegin', `
        <td>${nameInput}</td>
        <td>${positionInput}</td>
        <td>${officeInput}</td>
        <td>${ageInput}</td>
        <td>${newSalary}</td>
    `);

    tBody.append(row);

    pushNotification('Success',
      'Employee was added to the table', 'success');

    form.reset();
  }
}

form.addEventListener('submit', onAddRow);

// Notification
const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.insertAdjacentHTML('afterbegin', `
    <div class="notification ${type}" data-qa="notification">
      <h2 class="title">${title}</h2>

      <p>${description}</p>
    </div>
  `);

  document.body.after(notification);

  setTimeout(() => notification.remove(), 3000);
};

// Edit cell on dblclick
const cells = document.querySelector('tbody');

cells.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellPrevValue = cell.textContent;
  const input = document.createElement('input');

  input.style.width = `${parseInt(getComputedStyle(cell).width)}px`;
  input.classList.add('cell-input');
  input.value = cell.textContent;
  cell.textContent = '';
  cell.append(input);

  input.onblur = function() {
    if (input.value.length <= 0) {
      cell.textContent = cellPrevValue;
    } else {
      cell.textContent = input.value;
      input.remove();
    }
  };

  cell.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      if (input.value.length <= 0) {
        cell.textContent = cellPrevValue;
      } else {
        cell.textContent = input.value;
      }
    }
  });
});
