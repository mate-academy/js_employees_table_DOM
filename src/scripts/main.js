'use strict';

const body = document.querySelector('body');
const form = document.createElement('form');
const tbody = document.querySelector('tbody');
const tBodyRows = [...tbody.rows];
const thead = document.querySelector('thead');
const tH = thead.querySelectorAll('th');
const magicValue = 4;
let activeCell = null;
let sortDirection = 1;

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

function usdNum(str) {
  return Number(str.replace(/\D/g, ''));
}

function addRowToTable(name, position, office, age, salary) {
  const newRow = tbody.insertRow();

  const nameCell = newRow.insertCell();

  nameCell.textContent = name;

  const positionCell = newRow.insertCell();

  positionCell.textContent = position;

  const officeCell = newRow.insertCell();

  officeCell.textContent = office;

  const ageCell = newRow.insertCell();

  ageCell.textContent = age;

  const salaryCell = newRow.insertCell();

  salaryCell.textContent = salary;
}

function clearInputFields() {
  const nameInput = document.querySelector('input[name="name"]');
  const positionInput = document.querySelector('input[name="position"]');
  const officeInput = document.querySelector('select[name="office"]');
  const ageInput = document.querySelector('input[name="age"]');
  const salaryInput = document.querySelector('input[name="salary"]');

  nameInput.value = '';
  positionInput.value = '';
  officeInput.value = 'Tokyo';
  ageInput.value = '';
  salaryInput.value = '';
}

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

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.querySelector('input[name="name"]');
  const positionInput = document.querySelector('input[name="position"]');
  const officeInput = document.querySelector('select[name="office"]');
  const ageInput = document.querySelector('input[name="age"]');
  const salaryInput = document.querySelector('input[name="salary"]');

  if (
    nameInput.value.length < magicValue
    || isNaN(Number(ageInput.value))
    || isNaN(Number(salaryInput.value))
  ) {
    showNotification('error', 'Invalid data entered');
  } else {
    addRowToTable(
      nameInput.value,
      positionInput.value,
      officeInput.value,
      ageInput.value,
      salaryInput.value
    );

    clearInputFields();

    showNotification('success', 'Employee added to the table');
  }
});

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
