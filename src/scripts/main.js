'use strict';

const cleanSalary = (salaryString) => {
  return Number(salaryString.replaceAll('$', '').replaceAll(',', ''));
};

const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');

let currentSortedColumn = null;
let sortDirection = 'asc';

function sortedHeaders(e) {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  if (th !== currentSortedColumn) {
    sortDirection = 'asc';

    if (currentSortedColumn) {
      currentSortedColumn.classList.remove('sorted');
    }

    currentSortedColumn = th;
  } else {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  }

  th.classList.add('sorted');

  const currentHeaders = Array.from(tableHead.rows[0].cells);
  const currentRows = Array.from(tableBody.rows);
  const index = currentHeaders.indexOf(th);
  const isAsc = sortDirection === 'asc';

  currentRows.sort((row1, row2) => {
    const firstRowContent = row1.cells[index].textContent;
    const secondRowContent = row2.cells[index].textContent;

    if (index === 4) {
      const number1 = cleanSalary(firstRowContent);
      const number2 = cleanSalary(secondRowContent);

      return isAsc ? number1 - number2 : number2 - number1;
    }

    if (index === 3) {
      return isAsc
        ? Number(firstRowContent) - Number(secondRowContent)
        : Number(secondRowContent) - Number(firstRowContent);
    }

    return isAsc
      ? firstRowContent.localeCompare(secondRowContent)
      : secondRowContent.localeCompare(firstRowContent);
  });

  for (const row of currentRows) {
    tableBody.append(row);
  }
}

function activeRow(e) {
  const targetRow = e.target.closest('tr');

  if (!targetRow) {
    return;
  }

  const previousActiveRow = tableBody.querySelector('.active');

  if (previousActiveRow) {
    previousActiveRow.classList.remove('active');
  }

  targetRow.classList.add('active');
}

function createForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  const labelName = document.createElement('label');
  const labelPosition = document.createElement('label');
  const labelAge = document.createElement('label');
  const labelSalary = document.createElement('label');
  const labelOffice = document.createElement('label');

  const inputName = document.createElement('input');
  const inputPosition = document.createElement('input');
  const inputAge = document.createElement('input');
  const inputSalary = document.createElement('input');

  inputName.name = 'name';
  inputPosition.name = 'position';
  inputAge.name = 'age';
  inputSalary.name = 'salary';

  inputPosition.type = 'text';
  inputName.type = 'text';
  inputAge.type = 'number';
  inputSalary.type = 'number';

  inputName.dataset.qa = 'name';
  inputPosition.dataset.qa = 'position';
  inputAge.dataset.qa = 'age';
  inputSalary.dataset.qa = 'salary';

  labelName.append('Name: ', inputName);
  labelPosition.append('Position: ', inputPosition);
  labelAge.append('Age: ', inputAge);
  labelSalary.append('Salary: ', inputSalary);

  const select = document.createElement('select');

  select.dataset.qa = 'office';
  labelOffice.append('Office: ', select);

  const selectOptionsCities = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  for (const city of selectOptionsCities) {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;
    select.append(option);
  }

  // inputName.required = true;
  // inputPosition.required = true;
  // inputAge.required = true;
  // inputSalary.required = true;
  // select.required = true;

  const button = document.createElement('button');

  button.type = 'submit';
  button.textContent = 'Save to table';

  newForm.append(
    labelName,
    labelPosition,
    labelOffice,
    labelAge,
    labelSalary,
    button,
  );
  document.body.append(newForm);
}

function addNewEmployee(e) {
  e.preventDefault();

  const employeeName = document.querySelector('[data-qa="name"]').value;
  const position = document.querySelector('[data-qa="position"]').value;
  const office = document.querySelector('[data-qa="office"]').value;
  const age = document.querySelector('[data-qa="age"]').value;
  const salary = document.querySelector('[data-qa="salary"]').value;

  const isValid = validateForm(employeeName, position, +age);

  if (!isValid) {
    return;
  }

  const newWorkerRow = tableBody.insertRow();
  const cellName = newWorkerRow.insertCell();

  cellName.textContent = employeeName;

  const cellPosition = newWorkerRow.insertCell();

  cellPosition.textContent = position;

  const cellOffice = newWorkerRow.insertCell();

  cellOffice.textContent = office;

  const cellAge = newWorkerRow.insertCell();

  cellAge.textContent = +age;

  const cellSalary = newWorkerRow.insertCell();

  cellSalary.textContent = '$' + (+salary).toLocaleString('en-US');

  showNotification('Success', 'You have added a new employee', 'success');
}

function showNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', type);

  const titleEl = document.createElement('h1');
  const descriptionEl = document.createElement('p');

  titleEl.classList.add('title');
  titleEl.textContent = title;
  descriptionEl.textContent = description;

  notification.append(titleEl, descriptionEl);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function validateForm(nameInput, position, age) {
  if (!position || !position.trim()) {
    showNotification('Error', 'Position is required', 'error');

    return false;
  }

  if (!nameInput || nameInput.length < 4) {
    showNotification(
      'The name is too short',
      'Please, enter correct name',
      'error',
    );

    return false;
  }

  if (age < 18 || age > 90) {
    showNotification(
      'The age is not valid!!!',
      'Please, enter correct age',
      'error',
    );

    return false;
  }

  return true;
}

let activeInput = null;

function editCell(e) {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (activeInput) {
    return;
  }

  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');

  const savedOldValue = cell.textContent;

  newInput.value = savedOldValue;

  cell.textContent = '';
  cell.append(newInput);
  newInput.focus();
  activeInput = newInput;

  function saveChange() {
    if (!newInput.value) {
      cell.textContent = savedOldValue;
    } else {
      cell.textContent = newInput.value;
    }

    newInput.remove();
    activeInput = null;
  }

  function pressedEnter(button) {
    if (button.key === 'Enter') {
      saveChange();
    }
  }

  newInput.addEventListener('blur', saveChange);
  newInput.addEventListener('keydown', pressedEnter);
}

tableHead.addEventListener('click', sortedHeaders);
tableBody.addEventListener('click', activeRow);
createForm();

const tableForm = document.querySelector('form');

tableForm.addEventListener('submit', addNewEmployee);

tableBody.addEventListener('dblclick', editCell);
