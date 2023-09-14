'use strict';

const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';
form.method = 'post';
form.action = '';

form.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
<label>Position: <input data-qa="position" name="position" type="text"></label>
  <label>Office:
    <select data-qa="office" name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="text"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="text"></label>
  <button type="submit">Save to table</button>
`;

body.append(form);

const thead = document.querySelector('thead');
const tH = thead.querySelectorAll('th');

const tbody = document.querySelector('tbody');
const tBodyRows = [...tbody.rows];

function usdNum(str) {
  return Number(str.replace(/\D/g, ''));
}

let sortDirection = 1;

thead.addEventListener('click', (ev) => {
  const sortByIndex = [...tH].indexOf(ev.target);

  tBodyRows.sort((a, b) => {
    const aIn = a.cells[sortByIndex].innerText;
    const bIn = b.cells[sortByIndex].innerText;
    const numA = usdNum(aIn);
    const numB = usdNum(bIn);

    if (numA !== numB) {
      return (numA - numB) * sortDirection;
    } else {
      return aIn.localeCompare(bIn) * sortDirection;
    }
  });

  tbody.innerHTML = '';

  tbody.append(...tBodyRows);

  sortDirection *= -1;
});

tbody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (row) {
    tBodyRows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  }
});

let activeCell = null;

tbody.addEventListener('dblclick', (ev) => {
  const cell = ev.target.closest('td');

  if (cell) {
    if (activeCell) {
      activeCell.innerHTML = cell.querySelector('input').value;
      activeCell.classList.remove('editing');
    }
    activeCell = cell;

    const cellValue = cell.textContent;

    cell.innerHTML = `<input type="text" value="${cellValue}">`;
    cell.classList.add('editing');

    const input = cell.querySelector('input');

    input.focus();

    input.addEventListener('blur', () => {
      cell.innerHTML = input.value;
      cell.classList.remove('editing');
      activeCell = null;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        cell.innerHTML = input.value;
        cell.classList.remove('editing');
        activeCell = null;
      }
    });
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.querySelector('input[name="name"]');
  const positionInput = document.querySelector('input[name="position"]');
  const officeInput = document.querySelector('select[name="office"]');
  const ageInput = document.querySelector('input[name="age"]');
  const salaryInput = document.querySelector('input[name="salary"]');

  if (
    nameInput.value.length < 4
    || isNaN(Number(ageInput.value))
    || isNaN(Number(salaryInput.value))
  ) {
    showNotification('error', 'Invalid data entered');
  } else {
    const newRow = tbody.insertRow();

    const nameCell = newRow.insertCell();

    nameCell.textContent = nameInput.value;

    const positionCell = newRow.insertCell();

    positionCell.textContent = positionInput.value;

    const officeCell = newRow.insertCell();

    officeCell.textContent = officeInput.value;

    const ageCell = newRow.insertCell();

    ageCell.textContent = ageInput.value;

    const salaryCell = newRow.insertCell();

    salaryCell.textContent = salaryInput.value;

    nameInput.value = '';
    positionInput.value = '';
    officeInput.value = 'Tokyo';
    ageInput.value = '';
    salaryInput.value = '';

    showNotification('success', 'Employee added to the table');
  }
});

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
