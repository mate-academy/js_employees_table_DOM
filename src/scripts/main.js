'use strict';

const MIN_AGE = 18;
const MAX_AGE = 100;
const MIN_SALARY = 50000;
const TIMER_DURATION = 10000; // Milisecond (s = 1000ms)
const pageBody = document.querySelector('body');
const tableHeader = document.querySelector('thead');
const tableHeaderCells = tableHeader.querySelector('tr');
const tableBody = document.querySelector('tbody');
const toNumber = (string) => {
  if (typeof string === 'string' && string) {
    const clearNum = string.replace(/[$, ]/g, '');

    return parseInt(clearNum, 10);
  }

  return NaN;
};
const sortTable = (elemA, elemB) => {
  const aToNum = toNumber(elemA);
  const bToNum = toNumber(elemB);

  if (Number.isNaN(aToNum)) {
    return isSecondClick
      ? elemB.localeCompare(elemA)
      : elemA.localeCompare(elemB);
  }

  return isSecondClick ? bToNum - aToNum : aToNum - bToNum;
};
const cityOptions = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];
let clickedSortTable;
let isSecondClick = false;

const createElement = (cellName, type) => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = `${cellName}:`;
  input.setAttribute('data-qa', cellName.toLowerCase());
  input.required = true;
  input.type = type;
  label.appendChild(input);

  return label;
};

const getElInput = (element) => {
  return element.firstElementChild;
};

const formContainer = document.createElement('form');
const nameElement = createElement('Name', 'text');
const positionElement = createElement('Position', 'text');
const officeLabel = document.createElement('label');
const officeChoose = document.createElement('select');
const ageElement = createElement('Age', 'number');
const salaryElement = createElement('Salary', 'number');
const formButton = document.createElement('button');
const inputs = [
  getElInput(nameElement),
  getElInput(positionElement),
  officeChoose,
  getElInput(ageElement),
  getElInput(salaryElement),
];

formContainer.classList.add('new-employee-form');

officeLabel.textContent = 'Office:';
officeLabel.appendChild(officeChoose);
officeChoose.setAttribute('data-qa', 'office');
officeChoose.required = true;
formButton.type = 'Submit';
formButton.textContent = 'Save to table';

cityOptions.forEach((el) => {
  const option = document.createElement('option');

  option.value = el;
  option.textContent = el;
  officeChoose.appendChild(option);
});

formContainer.appendChild(nameElement);
formContainer.appendChild(positionElement);
formContainer.appendChild(officeLabel);
formContainer.appendChild(ageElement);
formContainer.appendChild(salaryElement);
formContainer.appendChild(formButton);

pageBody.appendChild(formContainer);

const pushNotification = (title, description, type) => {
  const container = document.createElement('div');
  const containerTitle = document.createElement('h2');
  const containerDescr = document.createElement('p');

  container.setAttribute('data-qa', 'notification');
  containerTitle.classList.add('title');

  if (type === 'success' || type === 'error') {
    container.classList.add('notification', type);
  }
  containerTitle.textContent = title;
  containerDescr.textContent = description;

  container.appendChild(containerTitle);
  container.appendChild(containerDescr);
  pageBody.appendChild(container);

  setTimeout(() => {
    container.style.display = 'none';
  }, TIMER_DURATION);
};

const onSubmitForm = (e) => {
  e.preventDefault();

  const formHandle = e.target.closest('form');

  if (!formHandle) {
    return;
  }

  const parentElem = formHandle.parentElement;
  const formAttributes = [...formHandle.attributes];
  const formPreviousName = formAttributes.find((el) => el.name === 'previous');
  const formCellType = formAttributes.find((el) => el.name === 'celltype');
  const formCellTypeSalary = formCellType.value === 'Salary';
  const inputElem = formHandle.querySelector('input');

  if (inputElem.value.trim() !== '') {
    parentElem.textContent = '';

    if (formCellTypeSalary) {
      const inputNumber = parseInt(inputElem.value);

      parentElem.textContent = `$${inputNumber.toLocaleString('en-US')}`;
    } else {
      parentElem.textContent = inputElem.value;
    }
  } else {
    parentElem.textContent = '';
    parentElem.textContent = formPreviousName.value;
  }
};

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  const notification = document.querySelector('.notification');
  let errorToFix = [];

  if (notification) {
    notification.remove();
  }

  if (getElInput(nameElement).value.trim().length < 4) {
    errorToFix = [...errorToFix, 'Name must be longer that 4 symbol'];
  }

  if (getElInput(positionElement).value.trim().length < 4) {
    errorToFix = [...errorToFix, 'Position must be longer that 4 symbol'];
  }

  if (
    getElInput(ageElement).value === '' ||
    getElInput(ageElement).value < MIN_AGE ||
    getElInput(ageElement).value > MAX_AGE
  ) {
    errorToFix = [
      ...errorToFix,
      'Age must be bigger than 18, but less then 100',
    ];
  }

  if (
    getElInput(salaryElement).value === '' ||
    getElInput(salaryElement).value < MIN_SALARY
  ) {
    errorToFix = [
      ...errorToFix,
      'Our workers is not homeless. They earns more that 50000$/year',
    ];
  }

  if (errorToFix.length !== 0) {
    return pushNotification('Error', errorToFix.join('\n'), 'error');
  }

  const newEmployee = document.createElement('tr');

  for (let cell = 0; cell < inputs.length; cell++) {
    const newCell = document.createElement('td');

    if (cell === 4) {
      const inputNumber = parseInt(inputs[cell].value.trim());

      newCell.textContent = `$${inputNumber.toLocaleString('en-US')}`;
    } else {
      newCell.textContent = inputs[cell].value.trim();
    }

    newEmployee.appendChild(newCell);
  }

  inputs.forEach((input, i) => {
    if (i !== 2) {
      input.value = '';
    }
  });

  tableBody.appendChild(newEmployee);

  return pushNotification('Done', 'New employee added to list', 'success');
});

tableBody.addEventListener('dblclick', (e) => {
  const editedCell = e.target.closest('td');
  const cellRow = e.target.closest('tr');
  const indexOfCell = [...cellRow.children].indexOf(editedCell);
  const cellInitialtName = editedCell.textContent;

  if (editedCell.firstChild.tagName !== 'FORM') {
    const edCellForm = document.createElement('form');
    const edCellLabel = document.createElement('label');
    const edCellInput = document.createElement('input');
    const cellInfo = {
      0: 'Name',
      1: 'Position',
      2: 'Office',
      3: 'Age',
      4: 'Salary',
    };

    edCellInput.type = indexOfCell < 3 ? 'text' : 'number';
    edCellInput.value = cellInitialtName;
    edCellLabel.appendChild(edCellInput);
    edCellForm.setAttribute('previous', cellInitialtName);
    edCellForm.setAttribute('cellType', cellInfo[indexOfCell]);
    edCellForm.appendChild(edCellLabel);

    editedCell.textContent = '';
    editedCell.appendChild(edCellForm);
  }
});

tableHeaderCells.addEventListener('click', (e) => {
  const headerChildren = [...tableHeaderCells.children];
  const columnName = e.target.closest('th');

  if (columnName !== null) {
    const sortedColumn = headerChildren.indexOf(columnName);
    const columnsToSort = [...tableBody.children];

    if (clickedSortTable === columnName) {
      isSecondClick = !isSecondClick;
    } else {
      isSecondClick = false;
    }

    clickedSortTable = columnName;

    const columnsSorted = columnsToSort.sort((a, b) => {
      const elemA = a.children[sortedColumn].textContent;
      const elemB = b.children[sortedColumn].textContent;

      return sortTable(elemA, elemB);
    });

    tableBody.textContent = '';

    columnsSorted.forEach((el) => {
      tableBody.appendChild(el);
    });
  }
});

tableBody.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tr');
  const activeRow = tableBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  selectedRow.classList.add('active');
});

tableBody.addEventListener('submit', onSubmitForm);
