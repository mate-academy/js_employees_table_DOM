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
    <select data-qa="office" name="office" required readonly>
      <option selected>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: 
    <input data-qa="age" name="age" type="number" required min="1">
  </label>
  <label>Salary: 
    <input data-qa="salary" name="salary" type="number" required min="1">
  </label>
  <button type="submit">Save to table</button>
`;

body.append(form);

function usdNum(str) {
  return Number(str.replace(/\D/g, ''));
}

function addRowToTable(name, position, office, age, salary) {
  const newRow = tbody.insertRow();
  const cells = [];

  for (let i = 0; i < 5; i++) {
    cells.push(newRow.insertCell());
  }

  cells[0].textContent = name;
  cells[1].textContent = position;
  cells[2].textContent = office;
  cells[3].textContent = age;
  cells[4].textContent = '$' + salary;
}

function clearInputFields() {
  const inputs = form.querySelectorAll('input, select');

  inputs.forEach((input) => (input.value = ''));
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  titleElement.className = 'title';
  titleElement.textContent = title;
  descriptionElement.textContent = description;
  notification.className = 'notification';
  notification.classList.add(type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.appendChild(titleElement);
  notification.appendChild(descriptionElement);
  body.appendChild(notification);
  setTimeout(() => notification.remove(), 2000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const officeInput = form.querySelector('select[name="office"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  const nameValue = nameInput.value.trim();
  const positionValue = positionInput.value.trim();
  const ageValue = Number(ageInput.value);
  const salaryValue = Number(salaryInput.value);

  if (nameValue.length < magicValue) {
    pushNotification(
      10, 10, 'Error', 'Name must be at least 4 characters long.', 'error'
    );
  } else if (!/^\S+$/.test(nameValue)) {
    pushNotification(
      10, 10, 'Error', 'Name cannot consist of white spaces only.', 'error'
    );
  } else if (positionValue.length === 0) {
    pushNotification(
      10, 10, 'Error', 'Position cannot be empty.', 'error'
    );
  } else if (isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
    pushNotification(
      10, 10, 'Error', 'Age must be between 18 and 90.', 'error'
    );
  } else if (isNaN(salaryValue) || salaryValue < 1) {
    pushNotification(
      10, 10, 'Error', 'Salary must be a positive number.', 'error'
    );
  } else {
    addRowToTable(
      nameValue,
      positionValue,
      officeInput.value,
      ageValue,
      salaryValue
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
    const aIn = a.cells[sortByIndex].textContent;
    const bIn = b.cells[sortByIndex].textContent;
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
      activeCell.textContent = cell.querySelector('input').value;
      activeCell.classList.remove('editing');
    }
    activeCell = cell;

    const cellValue = cell.textContent;
    const isSalaryCell = cell.cellIndex === 4;
    const isAgeCell = cell.cellIndex === 3;

    cell.innerHTML = `<input type="text" value="${cellValue}">`;
    cell.classList.add('editing');

    const input = cell.querySelector('input');

    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value;

      if (newValue.trim() === '') {
        cell.textContent = cellValue;
      } else if (isSalaryCell) {
        if (!isNaN(newValue) && Number(newValue) >= 0) {
          cell.textContent = '$' + newValue;
        } else {
          pushNotification(
            10,
            10,
            'Error',
            'Salary must be a positive number.',
            'error'
          );
          cell.textContent = cellValue;
        }
      } else if (isAgeCell) {
        if (!isNaN(newValue) && Number(newValue) >= 18 && Number(newValue) <= 90) {
          cell.textContent = newValue;
        } else {
          pushNotification(
            10, 10, 'Error', 'Age must be between 18 and 90.', 'error'
          );
          cell.textContent = cellValue;
        }
      } else {
        cell.textContent = newValue;
      }

      cell.classList.remove('editing');
      activeCell = null;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const newValue = input.value;

        if (newValue.trim() === '') {
          cell.textContent = cellValue;
        } else if (isSalaryCell) {
          if (!isNaN(newValue) && Number(newValue) >= 1) {
            cell.textContent = '$' + newValue;
          } else {
            pushNotification(
              10,
              10,
              'Error',
              'Salary must be a positive number.',
              'error'
            );
            cell.textContent = cellValue;
          }
        } else if (isAgeCell) {
          if (!isNaN(newValue) && Number(newValue) >= 1) {
            cell.textContent = newValue;
          } else {
            pushNotification(
              10,
              10,
              'Error',
              'Age must be a positive number.',
              'error'
            );
            cell.textContent = cellValue;
          }
        } else {
          cell.textContent = newValue;
        }

        cell.classList.remove('editing');
        activeCell = null;
      }
    });
  }
});
