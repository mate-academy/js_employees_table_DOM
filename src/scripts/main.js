'use strict';

const pageBody = document.querySelector('body');
const tableHeader = document.querySelector('thead');
const tableHeaderCells = tableHeader.querySelector('tr');
const tableBody = document.querySelector('tbody');
let isSecondClick = false;
const toNumber = (string) => {
  if (typeof string === 'string' && string.length !== 0) {
    const clearNum = string.replace(/[$, ]/g, '');

    return parseInt(clearNum, 10);
  }
};
let clickedSortTable;

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
      const elemA = a.children[sortedColumn].innerHTML;
      const elemB = b.children[sortedColumn].innerHTML;

      const aToNum = toNumber(elemA);
      const bToNum = toNumber(elemB);

      if (Number.isNaN(aToNum)) {
        return !isSecondClick
          ? elemA.localeCompare(elemB)
          : elemB.localeCompare(elemA);
      }

      return !isSecondClick ? aToNum - bToNum : bToNum - aToNum;
    });

    tableBody.innerHTML = '';

    columnsSorted.forEach((el) => {
      tableBody.appendChild(el);
    });
  }
});

tableBody.addEventListener('click', (e) => {
  const headerChildren = [...tableBody.children];
  const columnName = e.target.closest('tr');

  headerChildren.forEach((el) => el.removeAttribute('class'));
  columnName.classList.add('active');
});

const formContainer = document.createElement('form');
const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');
const posiitionLabel = document.createElement('label');
const posiitionInput = document.createElement('input');
const officeLabel = document.createElement('label');
const officeChoose = document.createElement('select');
const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');
const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');
const formButton = document.createElement('button');
const cityOptions = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];
const inputs = [nameInput, posiitionInput, officeChoose, ageInput, salaryInput];

const modifyElement = (parentEl, child, cellName, type) => {
  parentEl.innerHTML = `${cellName}:`;
  parentEl.setAttribute('data-qa', cellName.toLowerCase());
  child.required = true;
  child.type = type;
  parentEl.appendChild(child);
};

modifyElement(nameLabel, nameInput, 'Name', 'text');
modifyElement(posiitionLabel, posiitionInput, 'Position', 'text');
modifyElement(ageLabel, ageInput, 'Age', 'number');
modifyElement(salaryLabel, salaryInput, 'Salary', 'number');

formContainer.classList.add('new-employee-form');

officeLabel.innerHTML = 'Office:';
officeLabel.setAttribute('data-qa', 'office');
officeLabel.appendChild(officeChoose);
officeChoose.required = true;
formButton.innerText = 'Save to table';

cityOptions.forEach((el) => {
  const option = document.createElement('option');

  option.value = el;
  option.innerText = el;
  officeChoose.appendChild(option);
});

formContainer.appendChild(nameLabel);
formContainer.appendChild(posiitionLabel);
formContainer.appendChild(officeLabel);
formContainer.appendChild(ageLabel);
formContainer.appendChild(salaryLabel);
formContainer.appendChild(formButton);

pageBody.appendChild(formContainer);

const pushNotification = (title, description, type) => {
  const container = document.createElement('div');
  const containerTitle = document.createElement('h2');
  const containerDescr = document.createElement('p');

  container.classList.add('notification');
  container.setAttribute('data-qa', 'notification');
  containerTitle.classList.add('title');

  if (type === 'success' || type === 'error') {
    container.classList.add('notification', type);
  }
  containerTitle.classList.add('title');
  containerTitle.innerText = title;
  containerDescr.innerText = description;

  container.appendChild(containerTitle);
  container.appendChild(containerDescr);
  pageBody.appendChild(container);

  setTimeout(() => {
    container.style.display = 'none';
  }, 3000);
};

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    nameInput.value === '' ||
    posiitionInput.value === '' ||
    ageInput.value === '' ||
    ageInput.value < 18 ||
    ageInput.value > 100 ||
    salaryInput.value === ''
  ) {
    return pushNotification(
      'Error',
      'Please, fix all the problems in form',
      'error',
    );
  }

  const newEmployee = document.createElement('tr');

  for (let cell = 0; cell < inputs.length; cell++) {
    const newCell = document.createElement('td');

    if (cell === 4) {
      const inputNumber = parseInt(inputs[cell].value);

      newCell.innerHTML = `$${inputNumber.toLocaleString('en-US')}`;
    } else {
      newCell.innerHTML = inputs[cell].value;
    }

    newEmployee.appendChild(newCell);
  }

  inputs.forEach((input, i) => {
    if (i !== 2) {
      input.value = '';
    }
  });

  tableBody.appendChild(newEmployee);

  return pushNotification('Done', 'New employee was added to list', 'success');
});

tableBody.addEventListener('dblclick', (e) => {
  const editedCell = e.target.closest('td');
  const cellRow = e.target.closest('tr');
  const indexOfCell = [...cellRow.children].indexOf(editedCell);
  const cellInitialtName = editedCell.innerText;

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

    editedCell.innerHTML = '';
    editedCell.appendChild(edCellForm);
  }
});

const onSubmitForm = (e) => {
  const formHandle = e.target.closest('form');

  if (formHandle) {
    e.preventDefault();

    const parentElem = formHandle.parentElement;
    const formAttributes = [...formHandle.attributes];
    const formPreviousName = formAttributes.find(
      (el) => el.name === 'previous',
    );
    const formCellType = formAttributes.find((el) => el.name === 'celltype');
    const formCellTypeSalary = formCellType.value === 'Salary';
    const inputElem = formHandle.querySelector('input');

    formHandle.addEventListener('submit', (ev) => {
      ev.preventDefault();

      if (inputElem.value.trim() !== '') {
        parentElem.innerHTML = '';

        if (formCellTypeSalary) {
          const inputNumber = parseInt(inputElem.value);

          parentElem.innerText = `$${inputNumber.toLocaleString('en-US')}`;
        } else {
          parentElem.innerText = inputElem.value;
        }
      } else {
        parentElem.innerHTML = '';
        parentElem.innerText = formPreviousName.value;
      }
    });
  }
};

tableBody.addEventListener('click', onSubmitForm);
