'use strict';

const MIN_AGE = 18;
const MAX_AGE = 90;
const MIN_NAME_LENGTH = 4;
const MIN_POSITION_LENGTH = 4;
const TIMER = 3000;
const CITIES = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

let lastSortedColomn = null;
let sortType = 'asc';

thead.addEventListener('click', sortElements);
tbody.addEventListener('click', selectRow);
document.addEventListener('click', removeActive);
tbody.addEventListener('dblclick', editCell);

// sort rows
function sortElements(elem) {
  if (elem.target.tagName === 'TH') {
    const colomnIndex = elem.target.cellIndex;

    if (colomnIndex === lastSortedColomn) {
      sortType = sortType === 'asc' ? 'desc' : 'asc';
    } else {
      sortType = 'desc';
    }

    lastSortedColomn = colomnIndex;

    const rows = Array.from(tbody.rows);

    const sort = rows.sort((row1, row2) => {
      const cell1 = row1.cells[colomnIndex].textContent.trim();
      const cell2 = row2.cells[colomnIndex].textContent.trim();

      const sortResult = cell2.localeCompare(cell1, 'uk', { numeric: true });

      return sortType === 'asc' ? sortResult : -sortResult;
    });

    tbody.innerHTML = '';
    sort.forEach((row) => tbody.appendChild(row));
  }
}

// activete element
function selectRow(elem) {
  const activeRow = document.querySelector('.active');
  const clickedRow = elem.target.closest('tr');

  if (!clickedRow || !tbody.contains(clickedRow)) {
    return;
  }

  if (activeRow) {
    activeRow.removeAttribute('class');
  }

  clickedRow.classList.add('active');
}

function removeActive(elem) {
  const activeRow = document.querySelector('.active');
  const clickedRow = elem.target.closest('tr');

  if (!clickedRow && activeRow) {
    activeRow.removeAttribute('class');
  }
}

// edit cell
function editCell(elem) {
  const existValue = document.querySelector('.cell-input');

  if (existValue) {
    finishEdit(existValue);
  }

  const cell = elem.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  const originalInfo = cell.textContent.trim();
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalInfo;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => finishEdit(input));

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      finishEdit(input);
    }
  });

  function finishEdit(newInfo) {
    const newValue = newInfo.value.trim();

    cell.innerText = newValue || originalInfo;
  }
}

// notification
const pushNotification = (title, description, type) => {
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');
  div.classList.add('notification', type);

  const h2 = document.createElement('h2');

  h2.textContent = title;
  h2.classList.add('title');

  const p = document.createElement('p');

  p.textContent = description;

  div.appendChild(h2);
  div.appendChild(p);
  document.body.appendChild(div);

  setTimeout(() => div.remove(), TIMER);
};

const buttonExercise = (elemForm) => {
  elemForm.preventDefault();

  const form = document.getElementById('dynamicForm');
  const nameValue = form.elements['name'].value;
  const positionValue = form.elements['position'].value;
  const officeValue = form.elements['city'].value;
  const ageValue = Number(form.elements['age'].value);
  const salaryValue = Number(form.elements['salary'].value);

  if (!form.checkValidity()) {
    pushNotification(
      'Error message',
      'Form cannot be empty.' + 'Please fill in all required fields!',
      'error',
    );

    return;
  }

  if (nameValue.length < MIN_NAME_LENGTH) {
    pushNotification(
      'Error message',
      'Name must be at least 4 characters long!',
      'error',
    );

    return;
  }

  if (positionValue.length < MIN_POSITION_LENGTH) {
    pushNotification(
      'Error message',
      'Position must be at least 4 characters long!' + 'Write right position!',
      'error',
    );

    return;
  }

  if (ageValue < MIN_AGE || ageValue > MAX_AGE) {
    pushNotification(
      'Error message',
      'Age must be between 18 and 90!',
      'error',
    );

    return;
  }

  const newEmployee = CreateEmployee(
    nameValue,
    positionValue,
    officeValue,
    ageValue,
    salaryValue,
  );

  pushNotification('Succes message', 'Form submitted successfully!', 'success');

  tbody.append(newEmployee);

  form.reset();
};

function CreateEmployee(employeName, position, office, age, salary) {
  const tableRow = document.createElement('tr');

  const formatSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const newEmployee = [employeName, position, office, age, formatSalary];

  newEmployee.forEach((info) => {
    const td = document.createElement('td');

    td.textContent = info;
    tableRow.appendChild(td);
  });

  return tableRow;
}

// create Form
function CreateForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.setAttribute('id', 'dynamicForm');
  form.setAttribute('action', '/submit');
  form.setAttribute('method', 'post');

  const officeLable = CreateLabel('Office: ', 'office');
  const officeSelect = CreateSelect(CITIES, 'office', 'city');

  officeLable.append(officeSelect);

  const saveButton = CreateButton('dynamicForm', 'Save to table');

  form.append(CreateElement('Name: ', 'name', 'text'));
  form.append(CreateElement('Position: ', 'position', 'text'));
  form.append(officeLable);
  form.append(CreateElement('Age: ', 'age', 'number'));
  form.append(CreateElement('Salary: ', 'salary', 'number'));
  form.append(saveButton);

  saveButton.addEventListener('click', buttonExercise);

  document.body.append(form);
}

function CreateElement(labelText, elementName, type) {
  const newLable = CreateLabel(labelText, elementName);
  const newInput = CreateInput(elementName, type);

  newLable.append(newInput);

  return newLable;
}

function CreateLabel(text, data) {
  const label = document.createElement('label');

  label.setAttribute('for', data);
  label.textContent = text;

  return label;
}

function CreateInput(inputName, inputType) {
  const input = document.createElement('input');

  input.setAttribute('name', inputName);
  input.setAttribute('data-qa', inputName);
  input.setAttribute('type', inputType);
  input.setAttribute('required', '');

  return input;
}

function CreateSelect(values, dataInput, selectName) {
  const select = document.createElement('select');

  select.setAttribute('name', selectName);
  select.setAttribute('data-qa', dataInput);

  values.forEach((value) => {
    const option = document.createElement('option');

    option.textContent = value;
    option.value = value;
    select.append(option);
  });

  return select;
}

function CreateButton(fromId, text) {
  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.setAttribute('form', fromId);
  button.textContent = text;

  return button;
}

CreateForm();
