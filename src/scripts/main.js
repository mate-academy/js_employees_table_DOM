'use strict';

const body = document.querySelector('body');
const head = document.querySelector('thead');
const titles = [...head.children[0].children];
const tbody = document.querySelector('tbody');

const fieldsNames = ['Name', 'Position', 'Age', 'Salary'];
const selectionItems = [
  `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`,
];

const form = createForm(body, 'new-employee-form');
const cellInput = document.createElement('input');
let countActiveCells = document.querySelectorAll('.modifying').length;
let oldCellValue = '';

function getColumn(index) {
  const rows = tbody.rows;
  const column = [];

  for (const row of rows) {
    column.push(row.children[index].textContent);
  };

  return column;
}

function sortAscArray(array) {
  if (array.find(el => !isNaN(+el))) {
    return array.sort((a, b) => a - b);
  }

  if (array.find(el => el.indexOf('$') !== -1)) {
    let column = convertCurrencytoNumber(array);

    column = column.sort((a, b) => a - b);

    return column.map(num => convertToCurrency(num));
  }

  return array.sort((a, b) => a.localeCompare(b));
}

function sortDescArray(array) {
  if (array.find(el => !isNaN(+el))) {
    return array.sort((a, b) => b - a);
  }

  if (array.find(el => el.indexOf('$') !== -1)) {
    let column = convertCurrencytoNumber(array);

    column = column.sort((a, b) => b - a);

    return column.map(num => convertToCurrency(num));
  }

  return array.sort((a, b) => b.localeCompare(a));
}

function changeRowOrder(sortedArr) {
  const sortedRows = [];

  sortedArr.forEach(el => {
    for (const row of tbody.rows) {
      if ([...row.children].find(cell => cell.textContent === el)) {
        sortedRows.push(row);
      }
    }
  });

  [...tbody.rows].forEach(el => el.remove());
  sortedRows.forEach(el => tbody.appendChild(el));

  return sortedRows;
}

function sortTableInDirection(index, direction = 'asc') {
  const column = getColumn(index);

  const sortedColumn = (direction !== 'asc')
    ? sortDescArray(column)
    : sortAscArray(column);

  changeRowOrder(sortedColumn);
}

function sortTableOnClick(index, element) {
  let clicksCounter = 0;

  element.addEventListener('click', () => {
    if (clicksCounter % 2 === 0) {
      sortTableInDirection(index, 'asc');
    } else {
      sortTableInDirection(index, 'desc');
    }

    clicksCounter++;
  });
}

function createForm(parentElement, className) {
  const formElement = document.createElement('form');

  formElement.classList.add(className);
  parentElement.appendChild(formElement);

  return formElement;
}

function createInputs(parentElement, fieldsArray) {
  for (let i = 0; i < fieldsArray.length; i++) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    const inputInfo = fieldsNames[i].toLowerCase();

    label.textContent = `${fieldsNames[i]}:`;
    input.type = 'text';

    input.type = ((i === 2) || (i === 3))
      ? 'number'
      : 'text';

    input.name = inputInfo;
    input['data-qa'] = inputInfo;
    input.id = inputInfo;
    input.required = true;

    label.for = input.id;

    label.appendChild(input);
    parentElement.appendChild(label);
  }
}

function createSelection(parentElement, selectionName, optionsArray) {
  const selectionLabel = document.createElement('label');
  const selectionItem = document.createElement('select');

  selectionItem.id = selectionName.toLowerCase();
  selectionItem.name = selectionItem.id;
  selectionItem.required = true;

  selectionLabel.for = selectionItem.id;
  selectionLabel.textContent = `${selectionName}:`;

  selectionLabel.appendChild(selectionItem);
  parentElement.children[1].insertAdjacentElement('afterend', selectionLabel);

  for (const item of optionsArray) {
    const option = document.createElement('option');

    option.value = item;
    option.textContent = item;

    selectionItem.appendChild(option);
  }

  return selectionItem;
}

function createSubmitButton(parentElement) {
  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';

  parentElement.appendChild(submitButton);

  return submitButton;
}

function addForm(formElement, inputNames, selectionTitle, selectionNames) {
  createInputs(formElement, inputNames);
  createSelection(formElement, selectionTitle, selectionNames);
  createSubmitButton(form);
}

function convertCurrencytoNumber(array) {
  return array.map(el => +el.slice(1).split(',').join(''));
}

function convertToCurrency(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
}

function checkLength(inputValue) {
  if (inputValue.trim().length === 0) {
    return true;
  }

  return false;
}

function checkName(inputValue) {
  const minInputLength = 4;

  if ((checkLength(inputValue))
  || ((!checkLength(inputValue)) && (inputValue.length < minInputLength))) {
    return true;
  }

  return false;
}

function checkAge(inputValue) {
  const minAge = 18;
  const maxAge = 89;

  if ((checkLength(inputValue))
  || ((inputValue < minAge) || (inputValue > maxAge))) {
    return true;
  }

  return false;
}

function checkSalary(inputValue) {
  const minSalary = 1;

  if ((checkLength(inputValue)) || (inputValue <= minSalary)) {
    return true;
  }

  return false;
}

function createNotification() {
  const block = document.createElement('div');
  const title = document.createElement('h2');
  const text = document.createElement('p');

  block['qa'] = 'notification';
  block.className = 'notification';

  title.style.color = 'white';
  text.style.color = 'white';

  body.appendChild(block);
  block.appendChild(title);
  block.appendChild(text);

  return block;
}

function displayNotification(notification) {
  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function showSuccess() {
  const block = createNotification();

  block.classList.add('success');
  block.children[0].textContent = 'New employee is added successfully!';
  block.children[1].textContent = `Your team is getting bigger :)`;

  displayNotification(block);
}

function showError() {
  const block = createNotification();

  block.classList.add('error');
  block.children[0].textContent = 'Oops... Something went wrong';
  block.children[1].textContent = `Please, check the data once again :(`;

  displayNotification(block);
}

function showWarning() {
  const block = createNotification();

  block.classList.add('warning');
  block.children[0].textContent = 'Oops... The data is invalid';
  block.children[1].textContent = `Please, check the data once again :(`;

  displayNotification(block);
}

function getInputError(checkingFunction, checkingValue, notification) {
  const incorrectData = checkingFunction(checkingValue);

  if (incorrectData && notification) {
    notification();
  }

  return incorrectData;
}

function selectRow(tableRows) {
  tableRows.addEventListener('click', e => {
    const row = e.target.parentNode;
    const activeElements = [...document.querySelectorAll('.active')];

    if (!activeElements.length) {
      row.classList.add('active');
    } else if (activeElements.length === 1) {
      row.classList.add('active');
      activeElements[0].classList.remove('active');
    }
  });
}

function addNewRow(dataArr, table, rowLength) {
  const newRow = document.createElement('tr');

  table.appendChild(newRow);

  for (let j = 0; j < rowLength; j++) {
    const newCell = document.createElement('td');

    newCell.textContent = dataArr[j];
    newRow.appendChild(newCell);
  }
}

function fillNewRow(formElement, rowLength, table) {
  let userInputArr = [];

  formElement.addEventListener('submit', e => {
    e.preventDefault();

    let incorrectData = false;

    for (let i = 0; i < form.children.length - 1; i++) {
      const label = form.children[i];
      let inputValue = label.children[0].value.trim();

      if (checkLength(inputValue)) {
        showWarning();
        incorrectData = true;
      }

      const inputName = label.children[0].name;

      switch (inputName) {
        case 'name':
          incorrectData = getInputError(checkName, inputValue, showError);

          break;

        case 'age':
          incorrectData = getInputError(checkAge, inputValue, showError);

          break;

        case 'salary':
          incorrectData = getInputError(checkSalary, inputValue, showError);

          if (!incorrectData) {
            inputValue = convertToCurrency(inputValue);
          }

          break;
      }

      if (incorrectData) {
        userInputArr = [];

        return false;
      }

      userInputArr.push(inputValue);
    }

    addNewRow(userInputArr, table, rowLength);

    showSuccess();

    userInputArr = [];
    form.reset();
  });
}

function selectCell(table, input) {
  input.classList.add('cell-input');

  for (const row of table.rows) {
    for (const cell of row.cells) {
      cell.addEventListener('dblclick', e => {
        e.target.classList.add('modifying');
        oldCellValue = e.target.textContent;
        input.value = oldCellValue;

        if (countActiveCells <= 1) {
          e.target.textContent = '';
          e.target.appendChild(input);
          input.focus();
        }
      });
    }
  }
}

function setNewCellValue(input, oldValue) {
  let newCellValue = input.value;
  const cell = input.parentNode;
  let incorrectData = false;

  const cellIndex = [...cell.parentNode.children].indexOf(cell);
  const cellName = titles[cellIndex].textContent.toLowerCase();

  switch (cellName) {
    case 'name':
      incorrectData = getInputError(checkName, newCellValue);

      break;

    case 'age':
      incorrectData = getInputError(checkAge, newCellValue);

      break;

    case 'salary':
      incorrectData = getInputError(checkSalary, newCellValue);

      break;
  }

  if (oldValue.indexOf('$') !== -1) {
    newCellValue = convertToCurrency(+newCellValue);
  }

  if ((!checkLength(newCellValue))
  && (newCellValue !== '$0') && (incorrectData === false)) {
    cell.textContent = newCellValue;
  } else {
    cell.textContent = oldValue;
    showError();
  }

  input.value = '';
  input.remove();
  countActiveCells = 0;
}

for (let i = 0; i < titles.length; i++) {
  sortTableOnClick(i, titles[i]);
}

selectRow(tbody);

addForm(form, fieldsNames, 'Office', selectionItems);

fillNewRow(form, titles.length, tbody);
selectCell(tbody, cellInput);

cellInput.addEventListener('keypress', inputEvent => {
  if (inputEvent.key === 'Enter') {
    setNewCellValue(inputEvent.target, oldCellValue);
  }
});

cellInput.addEventListener('blur', inputEvent => {
  setNewCellValue(inputEvent.target, oldCellValue);
});
