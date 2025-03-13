'use strict';

const tableWrapper = document.querySelector('table');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

const newForm = document.createElement('form');

const NOTIFICATION_TOP = 10;
const NOTIFICATION_RIGHT = 10;
const NOTIFICATION_TIMEOUT = 2000;

const sortStates = {};

// Table sorting functions
function sortTable(columnIndex) {
  const tableRowsArray = Array.from(document.querySelectorAll('tbody tr'));

  if (!Object.hasOwn(sortStates, columnIndex)) {
    sortStates[columnIndex] = false; // false = ascending; true = descending;
  }

  tableRowsArray.sort((firstRow, secondRow) => {
    const firstValue = getCellValue(firstRow, columnIndex);
    const secondValue = getCellValue(secondRow, columnIndex);

    const comparison =
      typeof firstValue === 'string'
        ? firstValue.localeCompare(secondValue)
        : firstValue - secondValue;

    return sortStates[columnIndex] ? -comparison : comparison;
  });

  tableBody.append(...tableRowsArray);

  sortStates[columnIndex] = !sortStates[columnIndex]; // toggle state;
}

function getCellValue(row, columnIndex) {
  const cell = row.cells[columnIndex];
  const content = cell.textContent;
  const isAgeColumn = columnIndex === 3;
  const isSalaryColumn = columnIndex === 4;

  if (isAgeColumn) {
    return Number(content);
  } else if (isSalaryColumn) {
    return parseFloat(content.replace(/[$,]/g, ''));
  } else {
    return content.toLowerCase();
  }
}

// Adding new employee by form - functions
function addNewEmployee(employeeName, position, office, age, salary) {
  const newEmployee = document.createElement('tr');

  newEmployee.insertAdjacentHTML(
    'afterbegin',
    `<td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary}</td>`,
  );

  tableBody.append(newEmployee);
  newForm.reset();
}

function isNewEmployeeValid(employeeName, position, age) {
  const isNameLengthValid = employeeName.length >= 4;
  const isNameContentValid = employeeName.trim().length > 0;
  const isNameValid = isNameLengthValid && isNameContentValid;
  const isPositionContentValid = position.trim().length > 0;
  const isAgeValid = +age >= 18 && +age <= 90;

  return isNameValid && isAgeValid && isPositionContentValid;
}

function pushNotification(posTop, posRight, title, description, type) {
  const newDescription = description.replace(/\n/g, '<br>');
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  notification.insertAdjacentHTML(
    'afterbegin',
    `<h2 class="title">${title}</h2>
    <p>${newDescription}</p>`,
  );

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, NOTIFICATION_TIMEOUT);
}

// Table editing functions
function addNewInput(newInput, cell, cellInitialText) {
  cell.innerHTML = '';

  newInput.classList.add('cell-input');
  newInput.value = cellInitialText;

  cell.append(newInput);

  newInput.focus();
}

function saveCellChanges(newInput, cell, cellInitialText) {
  const newCellText = newInput.value;

  newInput.remove();

  if (newCellText.trim().length) {
    cell.textContent = newCellText;
  } else {
    cell.textContent = cellInitialText;
  }
}

tableHead.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const columnIndex = e.target.cellIndex;

    sortTable(columnIndex);
  }
});

let previousActiveRow = null;

document.addEventListener('click', (e) => {
  const trow = e.target.closest('tr');
  const tbody = e.target.closest('tbody');
  const table = e.target.closest('table');

  if (!table && previousActiveRow) {
    previousActiveRow.classList.remove('active');
    previousActiveRow = null;
  }

  if (trow && tbody) {
    if (previousActiveRow) {
      previousActiveRow.classList.remove('active');
    }

    trow.classList.add('active');

    previousActiveRow = trow;
  }
});

tableWrapper.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    // Additional check that only one cell can be edited at the time
    const existingInput = document.querySelector('.cell-input');

    if (existingInput) {
      return;
    }

    const newInput = document.createElement('input');
    const cell = e.target;
    const cellInitialText = cell.textContent;

    addNewInput(newInput, cell, cellInitialText);

    newInput.addEventListener('blur', () => {
      saveCellChanges(newInput, cell, cellInitialText);
    });

    newInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        saveCellChanges(newInput, cell, cellInitialText);
      }
    });
  }
});

newForm.classList.add('new-employee-form');

newForm.insertAdjacentHTML(
  'afterbegin',
  `<label>Name: <input name="name" type="text" data-qa="name" required /></label>
   <label>Position: <input name="position" type="text" data-qa="position" required /></label>
   <label>Office: <select name="office" data-qa="office" required>
     <option value="Tokyo">Tokyo</option>
     <option value="Singapore">Singapore</option>
     <option value="London">London</option>
     <option value="New York">New York</option>
     <option value="Edinburgh">Edinburgh</option>
     <option value="San Francisco">San Francisco</option>
   </select></label>
   <label>Age: <input name="age" type="number" data-qa="age" required /></label>
   <label>Salary: <input name="salary" type="number" data-qa="salary" required /></label>
   <button type="submit">Save to table</button>`,
);

document.body.append(newForm);

newForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(newForm);

  const employeeName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const ageString = formData.get('age');
  let salary = +formData.get('salary');

  if (salary <= 0) {
    salary = 0;
  }

  const salaryString = '$' + salary.toLocaleString('en-US');

  if (isNewEmployeeValid(employeeName, position, ageString)) {
    addNewEmployee(employeeName, position, office, ageString, salaryString);

    pushNotification(
      NOTIFICATION_TOP,
      NOTIFICATION_RIGHT,
      'Employee succesfully added!',
      'Success!\n ' + `Employee <b>${employeeName}</b> added to the table!`,
      'success',
    );
  } else {
    pushNotification(
      NOTIFICATION_TOP,
      NOTIFICATION_RIGHT,
      "Employee can't be added!",
      'Error!\n ' +
        `Can't add employee <b>${employeeName}</b> to the table! Check employee details carefully and try again!`,
      'error',
    );
  }
});
