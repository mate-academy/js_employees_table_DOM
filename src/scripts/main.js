'use strict';

const body = document.querySelector('body');
const head = document.querySelector('thead');
const titles = [...head.children[0].children];
const tbody = document.querySelector('tbody');

function compareCurrency(cur1, cur2) {
  const firstCurrency = +cur1.slice(1).split(',').join('');
  const secCurrency = +cur2.slice(1).split(',').join('');

  if (firstCurrency > secCurrency) {
    return true;
  }

  if (firstCurrency < secCurrency) {
    return false;
  }
}

function compareStrings(str1, str2) {
  const firstRowLowered = str1.toLowerCase();
  const secondRowLowered = str2.toLowerCase();

  if (firstRowLowered > secondRowLowered) {
    return true;
  }

  if (firstRowLowered < secondRowLowered) {
    return false;
  }
}

function sortTable(index) {
  const table = document.querySelector('tbody');
  let isSwitching = true;
  let countSwitch = 0;
  let sortDirection = 'asc';

  while (isSwitching) {
    isSwitching = false;

    const rows = table.rows;
    let shouldRowsSwitch = false;
    let i;

    for (i = 0; i < rows.length - 1; i++) {
      shouldRowsSwitch = false;

      const firstRow = rows[i].getElementsByTagName('TD')[index];
      const secondRow = rows[i + 1].getElementsByTagName('TD')[index];

      const firstRowContent = firstRow.innerHTML;
      const secondRowContent = secondRow.innerHTML;

      const isFirstRowNum = Number(firstRowContent);
      const isSecondRowNum = Number(secondRowContent);

      if (sortDirection === 'asc') {
        if (isFirstRowNum && (isFirstRowNum > isSecondRowNum)) {
          shouldRowsSwitch = true;
          break;
        } else {
          const isCurrency = firstRowContent.indexOf('$');

          if (isCurrency !== -1) {
            if (compareCurrency(firstRowContent, secondRowContent)) {
              shouldRowsSwitch = true;
              break;
            };
          } else {
            if (compareStrings(firstRowContent, secondRowContent)) {
              shouldRowsSwitch = true;
              break;
            }
          }
        }
      }

      if (sortDirection === 'desc') {
        if (isFirstRowNum && (isFirstRowNum < isSecondRowNum)) {
          shouldRowsSwitch = true;
          break;
        } else {
          const isCurrency = firstRowContent.indexOf('$');

          if (isCurrency !== -1) {
            if (compareCurrency(firstRowContent, secondRowContent) === false) {
              shouldRowsSwitch = true;
              break;
            };
          } else {
            if (compareStrings(firstRowContent, secondRowContent) === false) {
              shouldRowsSwitch = true;
              break;
            }
          }
        }
      }
    }

    if (shouldRowsSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      isSwitching = true;
      countSwitch++;
    } else {
      if (countSwitch === 0 && sortDirection === 'asc') {
        sortDirection = 'desc';
        isSwitching = true;
      }
    }
  }
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

    label.textContent = `${fieldsNames[i]}:`;
    input.type = 'text';

    input.type = ((i === 2) || (i === 3))
      ? 'number'
      : 'text';

    input.name = fieldsNames[i].toLowerCase();
    input['data-qa'] = fieldsNames[i].toLowerCase();
    input.id = fieldsNames[i].toLowerCase();
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

function checkLength(inputValue) {
  if (inputValue.trim().length === 0) {
    return true;
  }

  return false;
}

function checkName(inputValue) {
  const emptyInputLength = 0;
  const minInputLength = 4;

  if ((inputValue.length > emptyInputLength)
  && (inputValue.length < minInputLength)) {
    return true;
  }

  return false;
}

function checkAge(inputValue) {
  const emptyInputLength = 0;
  const minAge = 18;
  const maxAge = 89;

  if ((inputValue.length > emptyInputLength)
  && ((inputValue < minAge) || (inputValue > maxAge))) {
    return true;
  }

  return false;
}

function checkSalary(inputValue) {
  const emptyInputLength = 0;
  const minSalary = 1;

  if ((inputValue.length > emptyInputLength) && (inputValue <= minSalary)) {
    return true;
  }

  return false;
}

function notification() {
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

function success() {
  const block = notification();

  block.classList.add('success');
  block.children[0].textContent = 'New employee is added successfully!';
  block.children[1].textContent = `Your team is getting bigger :)`;

  return block;
}

function showSuccess() {
  const popUp = success();

  setTimeout(() => {
    popUp.style.display = 'none';
  }, 2000);
}

function error() {
  const block = notification();

  block.classList.add('error');
  block.children[0].textContent = 'Oops... Something went wrong';
  block.children[1].textContent = `Please, check the data once again :(`;

  return block;
}

function showError() {
  const errorPopUp = error();

  setTimeout(() => {
    errorPopUp.style.display = 'none';
  }, 2000);
}

function warning() {
  const block = notification();

  block.classList.add('warning');
  block.children[0].textContent = 'Oops... The data is invalid';
  block.children[1].textContent = `Please, check the data once again :(`;

  return block;
}

function showWarning() {
  const warningPopUp = warning();

  setTimeout(() => {
    warningPopUp.style.display = 'none';
  }, 2000);
}

function convertToCurrency(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
}

function setNewValue(input, oldValue) {
  let newCellValue = input.value;
  const cell = input.parentNode;
  let incorrectData = false;

  if (checkLength(newCellValue)) {
    incorrectData = true;
  }

  const cellIndex = [...cell.parentNode.children].indexOf(cell);

  switch (cellIndex) {
    case 0:
      if (checkName(newCellValue)) {
        incorrectData = true;
      }
      break;

    case 3:
      if (checkAge(newCellValue)) {
        incorrectData = true;
      }
      break;

    case 4:
      if (checkSalary(newCellValue)) {
        incorrectData = true;
      }
      break;
  }

  if (incorrectData) {
    incorrectData = true;

    showError();
  }

  if (oldValue.indexOf('$') !== -1) {
    newCellValue = convertToCurrency(+newCellValue);
  }

  if ((newCellValue.length > 0) && (newCellValue !== '$0')
  && (incorrectData === false)) {
    cell.textContent = newCellValue;
  } else {
    cell.textContent = oldValue;
  }

  input.value = '';
  input.remove();
  countActiveCells = 0;
}

for (let i = 0; i < titles.length; i++) {
  titles[i].addEventListener('click', e => {
    sortTable(i);
  });
}

tbody.addEventListener('click', e => {
  const row = e.target.parentNode;
  const activeElements = [...document.querySelectorAll('.active')];

  if (!activeElements.length) {
    row.classList.add('active');
  } else if (activeElements.length === 1) {
    row.classList.add('active');
    activeElements[0].classList.remove('active');
  }
});

const fieldsNames = ['Name', 'Position', 'Age', 'Salary'];
const selectionItems = [
  `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`,
];

const form = createForm(body, 'new-employee-form');

createInputs(form, fieldsNames);
createSelection(form, 'Office', selectionItems);

createSubmitButton(form);

let userInputArr = [];

form.addEventListener('submit', e => {
  e.preventDefault();

  let incorrectData = false;

  for (let i = 0; i < form.children.length - 1; i++) {
    const label = form.children[i];
    let inputValue = label.children[0].value;

    inputValue = inputValue.trim();

    if (checkLength(inputValue)) {
      showWarning();
      incorrectData = true;
    }

    switch (i) {
      case 0:
        if (checkName(inputValue)) {
          showError();
          incorrectData = true;
        }

        break;

      case 3:
        if (checkAge(inputValue)) {
          showError();
          incorrectData = true;
        }

        break;

      case (form.children.length - 2):
        if (checkSalary(inputValue)) {
          showError();
          incorrectData = true;
        }
        inputValue = convertToCurrency(inputValue);

        break;
    }

    if (incorrectData) {
      userInputArr = [];

      return false;
    }

    userInputArr.push(inputValue);
  }

  const newRow = document.createElement('tr');

  tbody.appendChild(newRow);

  for (let j = 0; j < titles.length; j++) {
    const newCell = document.createElement('td');

    newCell.textContent = userInputArr[j];
    newRow.appendChild(newCell);
  }

  showSuccess();

  userInputArr = [];
  form.reset();
});

const cellInput = document.createElement('input');
let countActiveCells = document.querySelectorAll('.modifying').length;
let oldCellValue = '';

cellInput.classList.add('cell-input');

for (const row of tbody.rows) {
  for (const cell of row.cells) {
    cell.addEventListener('dblclick', e => {
      e.target.classList.add('modifying');
      oldCellValue = e.target.textContent;
      cellInput.value = oldCellValue;

      if (countActiveCells <= 1) {
        e.target.textContent = '';
        e.target.appendChild(cellInput);
        cellInput.focus();
      }
    });
  }
}

cellInput.addEventListener('keypress', inputEvent => {
  if (inputEvent.key === 'Enter') {
    setNewValue(inputEvent.target, oldCellValue);
  }
});

cellInput.addEventListener('blur', inputEvent => {
  setNewValue(inputEvent.target, oldCellValue);
});
