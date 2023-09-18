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
  <label>Name: <input data-qa="name" name="name" type="text" required></label>
  <label>Position: 
    <input data-qa="position" name="position" type="text" required>
  </label>
  <label>Office:
    <select data-qa="office" name="office">
      <option selected>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input data-qa="age" name="age" type="number" required></label>
  <label>Salary: 
    <input data-qa="salary" name="salary" type="number" required>
  </label>
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
  const inputs = form.querySelectorAll('input, select');

  inputs.forEach((input) => (input.value = ''));
}

function pushNotification(posTop, posRight, title, description, type) {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.className = 'title';
  h2.textContent = title;
  p.textContent = description;
  div.className = 'notification';
  div.classList.add(`${type}`);
  div.style.top = `${posTop}px`;
  div.style.right = `${posRight}px`;
  div.append(h2);
  div.append(p);
  body.append(div);
  setTimeout(() => div.remove(), 2000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.querySelector('input[name="name"]');
  const positionInput = document.querySelector('input[name="position"]');
  const officeInput = document.querySelector('select[name="office"]');
  const ageInput = document.querySelector('input[name="age"]');
  const salaryInput = document.querySelector('input[name="salary"]');

  if (nameInput.value.length < magicValue) {
    pushNotification(
      10, 10, 'Error', 'Name must be at least 4 characters long.', 'error'
    );
  } else if (isNaN(Number(ageInput.value)) || Number(ageInput.value) < 1) {
    pushNotification(
      10, 10, 'Error', 'Age must be a positive number.', 'error'
    );
  } else if (
    isNaN(Number(salaryInput.value)) || Number(salaryInput.value) < 1) {
    pushNotification(
      10, 10, 'Error', 'Salary must be a positive number.', 'error'
    );
  } else {
    const formattedSalary = `$${salaryInput.value}`;

    addRowToTable(
      nameInput.value,
      positionInput.value,
      officeInput.value,
      ageInput.value,
      formattedSalary
    );

    clearInputFields();

    pushNotification(
      10, 10, 'Success', 'Employee added to the table successfully.', 'success'
    );

    tBodyRows.push(tbody.lastElementChild);
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

  if (activeCell) {
    activeCell = tbody.querySelector('.editing');
  }

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
      const inputValue = cell.querySelector('input').value.trim();
      const isValidNumber = /^[0-9]+(\.\d{1,2})?$/.test(inputValue);

      if (!isValidNumber) {
        pushNotification(
          10, 10, 'Error', 'Please enter a valid number.', 'error'
        );

        return;
      }

      if (activeCell.classList.contains('salary')) {
        const inputValue = input.value.trim();
        const formattedSalary = `$${inputValue}`;

        cell.innerHTML = formattedSalary; 
      } else {
        const inputValue = input.value.trim();

        cell.innerHTML = inputValue;
      }

      activeCell.classList.remove('editing');
    }
    activeCell = cell;

    const cellValue = cell.textContent;

    if (cell.classList.contains('salary')) {
      const cellInputValue = cellValue.replace('$', '');

      cell.innerHTML = `<input type="text" value="$${cellInputValue}">`;
    } else {
      cell.innerHTML = `<input type="text" value="${cellValue}">`;
    }

    cell.classList.add('editing');

    const input = cell.querySelector('input');

    input.focus();

    input.addEventListener('blur', () => {
      const inputValue = input.value.trim();
      const isValidNumber = /^[0-9]+(\.\d{1,2})?$/.test(inputValue);

      if (!isValidNumber) {
        pushNotification(
          10, 10, 'Error', 'Please enter a valid number.', 'error'
        );

        return;
      }

      if (cell.classList.contains('salary')) {
        const formattedSalary = `$${inputValue}`;

        cell.innerHTML = formattedSalary;
      } else {
        cell.innerHTML = inputValue;
      }

      cell.classList.remove('editing');
      activeCell = null;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const inputValue = input.value.trim();
        const isValidNumber = /^[0-9]+(\.\d{1,2})?$/.test(inputValue);

        if (!isValidNumber) {
          pushNotification(
            10, 10, 'Error', 'Please enter a valid number.', 'error'
          );

          return;
        }

        if (cell.classList.contains('salary')) {
          const formattedSalary = `$${inputValue}`;

          cell.innerHTML = formattedSalary;
        } else {
          cell.innerHTML = inputValue;
        }

        cell.classList.remove('editing');
        activeCell = null;
      }
    });
  }
});
