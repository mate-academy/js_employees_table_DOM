'use strict';

const table = document.querySelector('table');
const tBody = table.tBodies[0];
const tRows = [...tBody.rows];
const tHead = table.tHead;

const sortStates = {};
let lastSorted = null;

tBody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (row) {
    tRows.forEach((tRow) => tRow.classList.remove('active'));
  }

  row.classList.add('active');
});

tHead.addEventListener('click', (ev) => {
  const colIndex = ev.target.cellIndex;

  if (lastSorted !== colIndex) {
    sortStates[colIndex] = true;
    lastSorted = colIndex;
  }

  const sortDirection = sortStates[colIndex];

  tRows.sort((a, b) => {
    let firstRow = a.cells[colIndex].textContent.trim();
    let secondRow = b.cells[colIndex].textContent.trim();

    if (colIndex === 4) {
      firstRow = Number(firstRow.replace(/[$,]/g, ''));
      secondRow = Number(secondRow.replace(/[$,]/g, ''));
    }

    if (isNaN(firstRow) && isNaN(secondRow)) {
      return sortDirection
        ? firstRow.localeCompare(secondRow)
        : secondRow.localeCompare(firstRow);
    } else {
      return sortDirection
        ? Number(firstRow) - Number(secondRow)
        : Number(secondRow) - Number(firstRow);
    }
  });

  sortStates[colIndex] = !sortDirection;
  tRows.forEach((row) => table.appendChild(row));
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input type="text" name="name" data-qa="name"></label>
  <label>Position: <input type="text" name="position" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</opti on>
    </select>
  </label>
  <label>Age: <input type="number" name="age" data-qa="age"></label>
  <label>Salary <input type="number" name="salary" data-qa="salary"></label>
  <button type="button">Save to table</button>
`;

document.body.append(form);

const showNotification = (type, message) => {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.textContent = message;
  notification.classList.add(type);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

form.querySelector('button').addEventListener('click', () => {
  const nameInput = form.querySelector('[data-qa="name"]').value.trim();
  const positionInput = form.querySelector('[data-qa="position"]').value.trim();
  const officeInput = form.querySelector('[data-qa="office"]').value.trim();
  const ageInput = Number(form.querySelector('[data-qa="age"]').value);
  const salaryInput = Number(form.querySelector('[data-qa="salary"]').value);

  if (nameInput.length < 4) {
    showNotification('error', 'Name must be at least 4 characters');

    return;
  }

  if (ageInput < 18 || ageInput > 90) {
    showNotification('error', 'Age should be above 18 and below 90');

    return;
  }

  if (!positionInput || !salaryInput) {
    showNotification('error', 'All fields are required');

    return;
  }

  const row = tBody.insertRow();

  [
    nameInput,
    positionInput,
    officeInput,
    ageInput,
    `$${salaryInput.toLocaleString('en-US')}`,
  ].forEach((text) => {
    const cell = row.insertCell();

    cell.textContent = text;
  });

  showNotification('success', 'Employee added');
});

tBody.addEventListener('dblclick', (ev) => {
  const target = ev.target;

  if (target.tagName !== 'TD' || target.querySelector('input')) {
    return;
  }

  const initialValue = target.textContent;

  target.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = initialValue;
  target.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    const newValue = input.value.trim();

    target.textContent = newValue || initialValue;
  });

  input.addEventListener('keydown', (e) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});
