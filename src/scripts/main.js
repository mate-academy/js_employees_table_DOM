'use strict';

const employeesBody = document.querySelector('tbody');
const titleSort = document.querySelector('thead');
const titleColumn = titleSort.children[0].children;
const sumString = string => +string.slice(1).split(',').join('');
let sortedCell;

// Sort event
titleSort.addEventListener('click', (e) => {
  const sortRow = e.target.cellIndex;

  if (sortRow !== sortedCell) {
    e.target.setAttribute('sorted', '');
  }
  sortedCell = sortRow;

  const sortList = [...employeesBody.children].sort((a, b) => {
    let cellA = a.children[sortRow].textContent;
    let cellB = b.children[sortRow].textContent;

    if (e.target.getAttribute('sorted') === 'ASC') {
      cellA = b.children[sortRow].textContent;
      cellB = a.children[sortRow].textContent;
    }

    if (cellA[0] === '$') {
      return sumString(cellA) - sumString(cellB);
    }

    return cellA.localeCompare(cellB);
  });

  document.querySelector('tbody').append(...sortList);

  if (e.target.getAttribute('sorted') === 'ASC') {
    e.target.setAttribute('sorted', 'DECS');

    return;
  }

  e.target.setAttribute('sorted', 'ASC');
});

// Select event
document.addEventListener('click', (e) => {
  if (!e.target.matches('TD')) {
    return;
  }

  if (document.querySelector('.active')) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.parentElement.classList.add('active');
});

// Create form
const newForm = document.createElement('form');
const newButton = document.createElement('button');

newButton.textContent = 'Save to table';
newButton.id = 'addEmployees';
newForm.id = 'addForm';
newForm.className = 'new-employee-form';
document.body.children[0].after(newForm);

// Function for creating form elements
const createFormElements = (parentElement, element, child, attributes,) => {
  const newElement = document.createElement('label');
  const newChild = document.createElement(child);

  newElement.textContent = element;

  for (const key in attributes) {
    newChild.setAttribute(key, attributes[key]);
  }

  newElement.append(newChild);
  parentElement.append(newElement);
};

createFormElements(newForm, 'Name:', 'input', {
  name: 'name',
  type: 'text',
  'data-qa': 'name',
  id: 'inputName',
  required: '',
});

createFormElements(newForm, 'Position:', 'input', {
  name: 'position',
  type: 'text',
  'data-qa': 'position',
  id: 'inputPosition',
  required: '',
});

createFormElements(newForm, 'Office:', 'select', {
  name: 'Office',
  type: 'text',
  'data-qa': 'office',
  id: 'inputOffice',
  required: '',
});

const selectCity = document.querySelector('select');

selectCity.innerHTML = `
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
`;

createFormElements(newForm, 'Age:', 'input', {
  name: 'age',
  type: 'number',
  'data-qa': 'age',
  id: 'inputAge',
  required: '',
  min: 18,
  max: 90,
});

createFormElements(newForm, 'Salary:', 'input', {
  name: 'salary',
  type: 'number',
  'data-qa': 'salary',
  id: 'inputSalary',
  required: '',
});

newForm.append(newButton);

// Event submit form
const form = document.querySelector('#addForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEmployee = document.querySelector('#inputName').value;
  const position = document.querySelector('#inputPosition').value;
  const office = document.querySelector('#inputOffice').value;
  const age = document.querySelector('#inputAge').value;
  const salary = document.querySelector('#inputSalary').value;
  const newEmployee = document.createElement('tr');

  if (!validation(nameEmployee, 'Name')) {
    return;
  };

  if (!validation(age, 'Age')) {
    return;
  };

  newEmployee.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${Number(salary).toLocaleString('en-US')}</td>
  `;

  employeesBody.append(newEmployee);

  pushNotification(10, 10, 'Success!!!',
    `${nameEmployee} has been added to the list.\n `
    + 'Keep it up.', 'success');

  form.reset();
});

// Editing of table cells by double-clicking
const newCell = document.createElement('input');
const oldInfo = document.createElement('td');

newCell.classList.add('cell-input');

// Event for double-click
employeesBody.addEventListener('dblclick', (e) => {
  newCell.value = e.target.textContent;
  oldInfo.textContent = e.target.textContent;
  e.target.replaceChildren(newCell);
  newCell.focus();
});

// Event for key Enter
employeesBody.addEventListener('keyup', (e) => {
  if (e.code === 'Enter' || e.code === 'NumpadEnter') {
    save(e);
  }
});

// Event for save and data validation
const save = (e) => {
  const isValid = validation(newCell.value,
    titleColumn[e.target.parentElement.cellIndex].textContent);
  const salaryChange = e.target.parentElement.cellIndex === 4;
  const salaryWithout$ = newCell.value[0] !== '$';

  if (isValid && salaryChange && salaryWithout$) {
    newCell.parentElement.textContent
      = `$${Number(newCell.value).toLocaleString('en-US')}`;

    return;
  }

  if (isValid && salaryChange) {
    newCell.parentElement.textContent
      = `$${Number(sumString(newCell.value)).toLocaleString('en-US')}`;

    return;
  }

  if (isValid) {
    newCell.parentElement.textContent = newCell.value;

    return;
  }

  newCell.parentElement.textContent = oldInfo.textContent;
};

newCell.addEventListener('blur', (save));

// Validation functions
const validation = (inputValue, columnName) => {
  switch (columnName) {
    case 'Name':
      return validateName(inputValue);

    case 'Age':
      return validateAge(inputValue);

    case 'Salary':
      return validateSalary(inputValue);
  };

  return true;
};

const validateName = (value) => {
  if (value.length < 4) {
    pushNotification(150, 10, `${value} is to short!`,
      `You enter ${value.length} characters.\n `
    + 'Please enter more than 4 characters.', 'error');

    return false;
  }

  return true;
};

const validateAge = (value) => {
  if (!isFinite(value)) {
    pushNotification(290, 10, 'Age is not correct!',
      `You enter not a number\n `
      + 'Please enter corect number more 18 and less than 90.', 'error');

    return false;
  }

  if (value < 18 || value > 90) {
    pushNotification(290, 10, 'Age is not correct!',
      `You enter ${value} years.\n `
      + 'Please enter more 18 and less than 90.', 'error');

    return false;
  }

  return true;
};

const validateSalary = (value) => {
  if (value[0] === '$') {
    if (!isFinite(sumString(value))) {
      pushNotification(290, 10, 'Salary is not correct!',
        `You enter not a number\n `
        + 'Please enter corect number', 'error');

      return false;
    }

    return true;
  }

  if (!isFinite(+value.split(',').join(''))) {
    pushNotification(290, 10, 'Salary is not correct!',
      `You enter not a number\n `
      + 'Please enter corect number', 'error');

    return false;
  }

  return true;
};

// Notification
const pushNotification = (posTop, posRight, title, description, type) => {
  const box = document.createElement('div');
  const heading = document.createElement('h2');
  const paragraph = document.createElement('p');

  heading.textContent = title;
  heading.className = 'title';
  paragraph.textContent = description;
  box.classList.add('notification', type);
  box.setAttribute('data-qa', 'notification');

  document.body.append(box);
  box.append(heading);
  box.append(paragraph);

  box.style.top = `${posTop}px`;
  box.style.right = `${posRight}px`;

  setTimeout(() => box.remove(), 5000);
};
