'use strict';

// write code here
const body = document.querySelector('body');
let sortOrder = 'asc';
let currentColumn = null;

function addNewEmployee(eName, position, office, age, salary) {
  const tBody = document.querySelector('tbody');
  const rows = tBody.querySelectorAll('tr');

  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${eName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>${salary}</td>`;

  tBody.append(newRow);

  newRow.addEventListener('click', () => {
    rows.forEach((r) => {
      r.classList.remove('active');
    });

    newRow.classList.add('active');
  });

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      newRow.classList.remove('active');
      row.classList.add('active');
    });
  });

  editCell();
}

const sortBy = (columnIndex) => {
  const tBody = document.querySelector('tbody');
  const rows = Array.from(tBody.rows);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;

    if (currentColumn !== columnIndex) {
      sortOrder = 'asc';
    }

    switch (columnIndex) {
      case 0:
        currentColumn = 0;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 1:
        currentColumn = 1;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 2:
        currentColumn = 2;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 3:
        currentColumn = 3;

        return sortOrder === 'asc' ? +cellA - +cellB : +cellB - +cellA;
      case 4:
        currentColumn = 4;

        return sortOrder === 'asc'
          ? +cellA.slice(1).split(',').join('') -
              +cellB.slice(1).split(',').join('')
          : +cellB.slice(1).split(',').join('') -
              +cellA.slice(1).split(',').join('');
      default:
        return 0;
    }
  });

  rows.forEach((row) => tBody.appendChild(row));

  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
};

const pushNotification = (title, description, type) => {
  const notafication = document.createElement('div');
  const titleH2 = document.createElement('h2');
  const descript = document.createElement('p');

  notafication.setAttribute('data-qa', 'notification');
  notafication.classList.add('notification', type);
  descript.innerText = description;
  titleH2.innerText = title;
  titleH2.classList.add('title');

  notafication.append(titleH2);
  notafication.append(descript);

  body.append(notafication);

  setTimeout(() => (notafication.style.visibility = 'hidden'), 2000);
};

function validation(eName, age) {
  let nameError = false;
  let ageError = false;

  if (eName.length < 4) {
    nameError = true;

    pushNotification(
      'Name error',
      'The name must be 4 or more characters long',
      'error',
    );
  } else if (age < 18 || age > 90) {
    ageError = true;

    pushNotification('Age error', 'Age should be 18-90', 'error');
  }

  if (!nameError && !ageError) {
    pushNotification('Success', 'New Employee Added Successfully', 'success');

    return true;
  }

  return false;
}

function saveChanges(cell, input) {
  const newValue = input.value.trim();

  if (newValue.length > 0) {
    cell.textContent = newValue;
  } else {
    cell.textContent = input.defaultValue;
  }
}

function editCell() {
  const tBody = document.querySelector('tbody');
  const cells = tBody.querySelectorAll('td');

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', (e) => {
      e.preventDefault();

      const cellInput = document.createElement('input');
      const inputValue = cell.textContent.trim();

      cellInput.classList.add('cell-input');
      cellInput.setAttribute('type', 'text');
      cellInput.setAttribute('value', inputValue);

      cell.innerHTML = '';
      cell.appendChild(cellInput);

      cellInput.focus();
      cellInput.select();

      cellInput.addEventListener('blur', () => {
        saveChanges(cell, cellInput);
      });

      cellInput.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') {
          saveChanges(cell, cellInput);
        }
      });
    });
  });
}

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `<label>Name: <input name='name' type='text' data-qa='name' required></input></label>
  <label>Position: <input name='position' type='text' data-qa='position' required></input></label>
  <label>Ofice: <select name='office' data-qa='office' required>
  <option value='Tokyo'>Tokyo</option>
  <option value='Singapore'>Singapore</option>
  <option value='London'>London</option>
  <option value='New York'>New York</option>
  <option value='Edinburgh'>Edinburgh</option>
  <option value='San Francisco'>San Francisco</option>
  </select></label>
  <label>Age: <input name='age' type='number' data-qa='age' required></input></label>
  <label>Salary: <input name='salary' type='number' data-qa='salary' required></input></label>
  <button type=submit>Save to table</button>`;

body.appendChild(form);

document.addEventListener('DOMContentLoaded', () => {
  const tBody = document.querySelector('tbody');
  const tHead = document.querySelector('thead');
  const headers = tHead.querySelectorAll('th');
  const rows = tBody.querySelectorAll('tr');

  headers.forEach((header, index) => {
    header.addEventListener('click', () => sortBy(index));
  });

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.elements['name'].value;
    const positionInput = form.elements['position'].value;
    const officeInput = form.elements['office'].value;
    const ageInput = form.elements['age'].value;
    const salaryInput = +form.elements['salary'].value;
    const normSalary = `$${salaryInput.toLocaleString('en-US')}`;

    const validationCheck = validation(nameInput, ageInput);

    if (validationCheck) {
      addNewEmployee(
        nameInput,
        positionInput,
        officeInput,
        ageInput,
        normSalary,
      );

      form.reset();
    }
  });

  editCell();
});
