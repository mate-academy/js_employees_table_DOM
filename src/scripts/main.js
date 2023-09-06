'use strict';

const table = document.querySelector('table');
const tHead = table.tHead;
const tBody = table.tBodies[0];
let sortState = '';
let activeRow = '';
const minNameLength = 4;
const minAgeValue = 18;
const maxAgeValue = 90;
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const textErrorName = 'Name can\'t be less than 4 symbols';
const textErrorPosition = 'Position should be more than 1 symbol';
const textErrorAge = 'Age should be less than 18 and more than 90';
const textErrorOffice = `Office must be one of the followed values:
  ${offices.join(' ')}`;
const textErrorSalary = 'Salary should be more than 10000';

function pushNotification(field, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.classList.add('title');
  h2.textContent = `Error in the "${field}" field`;
  p.textContent = description;

  notification.append(h2, p);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

function pushErrorNameNotification() {
  pushNotification('NAME', textErrorName, 'error');
}

function pushErrorPositionNotification() {
  pushNotification('POSITION', textErrorPosition, 'error');
}

function pushErrorAgeNotification() {
  pushNotification('AGE', textErrorAge, 'error');
}

function pushErrorOfficeNotification() {
  pushNotification('OFFICE', textErrorOffice, 'error');
}

function pushErrorSalaryNotification() {
  pushNotification('SALARY', textErrorSalary, 'error');
}

function handleTextInput(input) {
  const words = input.trim().split(' ').map(word => {
    const result = word.trim();

    return result.slice(0, 1).toUpperCase() + result.slice(1);
  });

  return words.join(' ');
}

function checkIsNameValid(nameStr) {
  return nameStr.trim().length >= minNameLength;
}

function checkIsPositionValid(position) {
  return position.trim().length >= 2;
}

function checkIsAgeValid(age) {
  return age >= minAgeValue && age <= maxAgeValue;
}

function checkIsOfficeValid(office) {
  return offices.includes(office);
}

function checkIsSalaryValid(salary) {
  return salary > 10000;
}

function getNumFromString(str) {
  return +str.replaceAll(/\D/gmi, '');
}

function makeSalaryString(salary) {
  const str = salary.toString();
  let result = '';

  for (let i = 0; i < str.length; i++) {
    if (i % 3 === 0 && i !== str.length - 1 && i !== 0) {
      result = ',' + result;
    }

    result = str[str.length - 1 - i] + result;
  }

  return '$' + result;
}

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: 
      <input data-qa="name" name="name" type="text" required>
    </label>

    <label>Position:
      <input data-qa="position" name="position" type="text" required>
    </label>

    <label>Office: 
      <select data-qa="office" name="office" required>
        ${offices.map(office => `<option value="${office}">${office}</option>`)}
      </select>
    </label>

    <label>Age:
      <input data-qa="age" name="age" type="number" required>
    </label>

    <label>Salary:
      <input data-qa="salary" name="salary" type="number" required>
    </label>
    
    <button type="submit">Save to table</button>`;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="name"]');
    const positionInput = form.querySelector('[name="position"]');
    const officeInput = form.querySelector('[name="office"]');
    const ageInput = form.querySelector('[name="age"]');
    const salaryInput = form.querySelector('[name="salary"]');

    const nameValue = handleTextInput(nameInput.value);
    const positionValue = handleTextInput(positionInput.value);
    const officeValue = officeInput.value;
    const ageValue = +ageInput.value;
    const salaryValue = +salaryInput.value;

    if (!checkIsNameValid(nameValue)) {
      pushErrorNameNotification();

      return;
    }

    if (!checkIsPositionValid(positionValue)) {
      pushErrorPositionNotification();

      return;
    }

    if (!checkIsAgeValid(ageValue)) {
      pushErrorAgeNotification();

      return;
    }

    if (!checkIsSalaryValid(salaryValue)) {
      pushErrorSalaryNotification();

      return;
    }

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${nameValue.trim()}</td>
      <td>${positionValue.trim()}</td>
      <td>${officeValue}</td>
      <td>${ageValue}</td>
      <td>${makeSalaryString(salaryValue)}</td>
    `;

    tBody.append(tr);

    nameInput.value = '';
    positionInput.value = '';
    officeInput.value = '';
    ageInput.value = '';
    salaryInput.value = '';

    pushNotification(
      'Success',
      'Your data was added to table',
      'success'
    );
  });

  return form;
}

function handleSortEvent(e) {
  if (e.target.tagName === 'TH') {
    const sortValue = e.target.textContent;
    const rows = [...tBody.querySelectorAll('tr')];

    if (sortState === sortValue) {
      tBody.append(...rows.reverse());

      return;
    }

    sortState = sortValue;

    const index = [...e.target.parentElement.children].indexOf(e.target);

    const sortedRows = rows.sort((row1, row2) => {
      const row1Value = row1.children[index].textContent;
      const row2Value = row2.children[index].textContent;

      switch (sortValue) {
        case 'Name':
        case 'Position':
        case 'Office':
          return row1Value.localeCompare(row2Value);

        case 'Age':
        case 'Salary':
          return getNumFromString(row1Value) - getNumFromString(row2Value);
      }
    });

    tBody.append(...sortedRows);
  }
}

function toggleActiveRow(e) {
  const row = e.target.closest('tr');

  if (activeRow === row) {
    row.classList.toggle('active');

    return;
  }

  row.classList.add('active');

  if (activeRow !== '') {
    activeRow.classList.remove('active');
  }

  activeRow = row;
}

function changeContentInCell(e) {
  const cell = e.target;
  const input = document.createElement('input');

  input.classList.add('cell-input');

  if ([...cell.parentElement.children].indexOf(cell) === 4) {
    input.setAttribute('value', getNumFromString(cell.textContent));
  } else {
    input.setAttribute('value', cell.textContent);
  }

  function handleChangeEvent(changeEvent) {
    if (changeEvent.type === 'blur' || changeEvent.key === 'Enter') {
      const row = [...cell.parentElement.children];
      const cellIndex = row.indexOf(cell);
      const initialValue = changeEvent.target.getAttribute('value');
      let newValue = changeEvent.target.value;
      let hasErrors = false;

      switch (cellIndex) {
        case 0:
          if (!checkIsNameValid(handleTextInput(newValue))) {
            pushErrorPositionNotification();

            newValue = initialValue;
            hasErrors = true;
          }

          break;

        case 1:
          if (!checkIsPositionValid(handleTextInput(newValue))) {
            pushErrorPositionNotification();

            newValue = initialValue;
            hasErrors = true;
          }

          break;

        case 2:
          if (!checkIsOfficeValid(newValue)) {
            pushErrorOfficeNotification();

            newValue = initialValue;
            hasErrors = true;
          }

          break;

        case 3:
          if (!checkIsAgeValid(+newValue)) {
            pushErrorAgeNotification();

            newValue = initialValue;
            hasErrors = true;
          }

          break;

        case 4:
          if (!checkIsSalaryValid(newValue)) {
            pushErrorSalaryNotification();

            newValue = makeSalaryString(initialValue);
            hasErrors = true;
          } else {
            newValue = makeSalaryString(newValue);
          }
      }

      cell.classList.remove('cell-input');
      cell.textContent = newValue;

      if (!hasErrors) {
        pushNotification('Success', 'Your data was changed', 'success');
      }
    }
  }

  input.addEventListener('blur', handleChangeEvent);
  input.addEventListener('keypress', handleChangeEvent);

  cell.innerHTML = '';
  cell.append(input);
  input.focus();
}

document.body.append(createForm());
tHead.addEventListener('click', handleSortEvent);
tBody.addEventListener('click', toggleActiveRow);
tBody.addEventListener('dblclick', changeContentInCell);
