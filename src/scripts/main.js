'use strict';

const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
let orderASC = true;
let lastIndex;

tableHead.addEventListener('click', e => {
  const rows = [...tableBody.rows];
  const index = e.target.closest('th').cellIndex;

  rows.sort((a, b) => {
    const itemA = a.cells[index].innerText.replace(/[$,]/g, '');
    const itemB = b.cells[index].innerText.replace(/[$,]/g, '');

    return isNaN(itemA)
      ? itemA.localeCompare(itemB)
      : itemA - itemB;
  });

  if (orderASC || lastIndex !== index) {
    orderASC = !orderASC;
  } else {
    rows.reverse();
    orderASC = !orderASC;
  }

  lastIndex = index;
  tableBody.append(...rows);
});

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const selectedRow = document.querySelector('.active');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  row.classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
      <input 
        name="name" 
        data-qa="name"
      >
    </label>

    <label>Position:
      <input 
        name="position" 
        data-qa="position"
      >
    </label>

    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input 
        name="age" 
        type="number" 
        data-qa="age"
      >
    </label>

    <label>Salary:
      <input 
        name="salary" 
        type="number" 
        data-qa="salary"
      >
    </label>
    
    <button type="submit" value="Submit">
      Save to table
    </button>
  </form>
`);

const pushNotification = ({ title, description, type }) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;

  message.innerHTML = `
    <h2 class = "title">${title}</h2>
    <p>${description}</p>
  `;

  message.dataset.qa = 'notification';
  body.append(message);
  setTimeout(() => message.remove(), 2000);
};

const wrongNameNotification = {
  title: 'Wrong Name!',
  description: 'The Name should have more than 4 letters!',
  type: 'error',
};

const wrongPositionNameNotification = {
  title: 'Wrong Position Name!',
  description: 'The position name should have more than 2 letters!',
  type: 'error',
};

const wrongOfficeNameNotification = {
  title: 'Wrong Office Name!',
  description: 'The office name should have more than 2 letters!',
  type: 'error',
};

const wrongAgeNotification = {
  title: 'Wrong Age!',
  description: 'The employee should be an adult and younger than 90 years!',
  type: 'error',
};

const wrongSalaryNotification = {
  title: 'Wrong Salary!',
  description: 'The salary should be a positive number!',
  type: 'error',
};

const successNotification = {
  title: 'Success!',
  description: 'A new employee was added to the table!',
  type: 'success',
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  const { position, office, age, salary } = dataObject;
  const formattedSalary = '$' + parseInt(salary).toLocaleString('en-US');

  if (dataObject.name.length < 4) {
    pushNotification(wrongNameNotification);

    return;
  }

  if (position.length < 2) {
    pushNotification(wrongPositionNameNotification);

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(wrongAgeNotification);

    return;
  }

  if (salary < 0 || salary === '') {
    pushNotification(wrongSalaryNotification);

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${dataObject.name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formattedSalary}</td>
    </tr>
  `);

  pushNotification(successNotification);

  form.reset();
});

let initialCellValue;
let inputForEditing;

function editTableCell(e) {
  const cellForEditing = e.target.closest('td');

  if (!e.target.matches('td') || !tableBody.contains(cellForEditing)) {
    return;
  }

  cellForEditing.contenteditable = true;
  initialCellValue = cellForEditing.textContent;

  switch (cellForEditing.cellIndex) {
    case 3:
    case 4:
      cellForEditing.innerHTML = `
        <input 
          class="cell-input"
          name="cell-for-editing" 
          type="number" 
        >
      `;

      break;

    default:
      cellForEditing.innerHTML = `
        <input 
          class="cell-input"
          name="cell-for-editing" 
          type="text" 
        >
      `;
  }

  inputForEditing = document.querySelector('.cell-input');

  inputForEditing.focus();
  cellForEditing.focus();
};

function saveEnteredInfo(e) {
  const cellForEditing = e.target.closest('td');
  const trimmedInputValue = inputForEditing.value.trim();

  const regexForTheNameField = /^([a-z ]{4,})$/gim;
  const regexForPositionNameField = /^([a-z ]{2,})$/gim;
  const regexForOfficeNameField = /^([a-z ]{2,})$/gim;
  const regexForAgeField = /^(1[89]|[2-8][0-9]|90)$/;
  const regexForSalaryField = /^([0-9]{1,})$/;

  switch (cellForEditing.cellIndex) {
    case 0:
      if (!trimmedInputValue.match(regexForTheNameField)) {
        pushNotification(wrongNameNotification);
        cellForEditing.textContent = initialCellValue;
        inputForEditing.remove();

        return;
      }

      break;

    case 1:
      if (!trimmedInputValue.match(regexForPositionNameField)) {
        pushNotification(wrongPositionNameNotification);
        cellForEditing.textContent = initialCellValue;
        inputForEditing.remove();

        return;
      }

      break;

    case 2:
      if (!trimmedInputValue.match(regexForOfficeNameField)) {
        pushNotification(wrongOfficeNameNotification);
        cellForEditing.textContent = initialCellValue;
        inputForEditing.remove();

        return;
      }

      break;

    case 3:
      if (!trimmedInputValue.match(regexForAgeField)) {
        pushNotification(wrongAgeNotification);
        cellForEditing.textContent = initialCellValue;
        inputForEditing.remove();

        return;
      }

      break;

    case 4:
      if (!trimmedInputValue.match(regexForSalaryField)) {
        pushNotification(wrongSalaryNotification);
        cellForEditing.textContent = initialCellValue;
        inputForEditing.remove();

        return;
      } else {
        cellForEditing.textContent
          = '$' + parseInt(trimmedInputValue).toLocaleString('en-US');
        inputForEditing.remove();

        return;
      }
  }

  cellForEditing.textContent = trimmedInputValue;
  inputForEditing.remove();
}

tableBody.addEventListener('dblclick', editTableCell);
tableBody.addEventListener('focusout', saveEnteredInfo);

tableBody.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    saveEnteredInfo(e);
  }
});
