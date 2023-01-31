'use strict';

const body = document.querySelector('body');
const head = document.querySelector('thead');
const titles = [...head.children[0].children];
const tbody = document.querySelector('tbody');

// #region --Sorting table--

function sortTable(index) {
  const table = document.querySelector('tbody');
  let isSwitching = true;
  let countSwitch = 0;
  let dir = 'asc';

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

      if (dir === 'asc') {
        if (isFirstRowNum) {
          if (isFirstRowNum > isSecondRowNum) {
            shouldRowsSwitch = true;
            break;
          }
        } else {
          const isCurrency = firstRowContent.indexOf('$');

          if (isCurrency !== -1) {
            const firstCurrency = +firstRowContent.slice(1).split(',').join('');
            const secCurrency = +secondRowContent.slice(1).split(',').join('');

            if (firstCurrency > secCurrency) {
              shouldRowsSwitch = true;
              break;
            }
          } else {
            const firstRowLowered = firstRowContent.toLowerCase();
            const secondRowLowered = secondRowContent.toLowerCase();

            if (firstRowLowered > secondRowLowered) {
              shouldRowsSwitch = true;
              break;
            }
          }
        }
      }

      if (dir === 'desc') {
        if (isFirstRowNum) {
          if (isFirstRowNum < isSecondRowNum) {
            shouldRowsSwitch = true;
            break;
          }
        } else {
          const isCurrency = firstRowContent.indexOf('$');

          if (isCurrency !== -1) {
            const firstCurrency = +firstRowContent.slice(1).split(',').join('');
            const secCurrency = +secondRowContent.slice(1).split(',').join('');

            if (firstCurrency < secCurrency) {
              shouldRowsSwitch = true;
              break;
            }
          } else {
            const firstRowLowered = firstRowContent.toLowerCase();
            const secondRowLowered = secondRowContent.toLowerCase();

            if (firstRowLowered < secondRowLowered) {
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
      if (countSwitch === 0 && dir === 'asc') {
        dir = 'desc';
        isSwitching = true;
      }
    }
  }
}

for (let i = 0; i < titles.length; i++) {
  titles[i].addEventListener('click', e => {
    sortTable(i);
  });
}

// #endregion

// #region --Select a row--

tbody.addEventListener('click', e => {
  const row = e.target.parentNode;
  const countActiveElements = document.querySelectorAll('.active').length;

  if (row.className !== 'active' && countActiveElements < 1) {
    row.classList.add('active');
  } else if (row.className === 'active') {
    row.classList.remove('active');
  }
});

// #endregion

// #region --Add a form--

const fieldsNames = ['Name', 'Position', 'Age', 'Salary'];
const selectionItems = [
  `Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`,
];

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

const form = createForm(body, 'new-employee-form');

createInputs(form, fieldsNames);
createSelection(form, 'Office', selectionItems);

createSubmitButton(form);

// #endregion

// #region --Create notification

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

function error() {
  const block = notification();

  block.classList.add('error');
  block.children[0].textContent = 'Oops... Something went wrong';
  block.children[1].textContent = `Please, check the data once again :(`;

  return block;
}

function warning() {
  const block = notification();

  block.classList.add('warning');
  block.children[0].textContent = 'Oops... The data is invalid';
  block.children[1].textContent = `Please, check the data once again :(`;

  return block;
}

// #endregion

// #region --Add an employee--

function convertToCurrency(number) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return formatter.format(number);
}

let userInputArr = [];

form.addEventListener('submit', e => {
  e.preventDefault();

  for (let i = 0; i < form.children.length - 1; i++) {
    const label = form.children[i];
    let inputValue = label.children[0].value;

    if (inputValue.length === 0) {
      const warningPopUp = warning();

      setTimeout(() => {
        warningPopUp.style.display = 'none';
      }, 2000);

      userInputArr = [];

      return false;
    }

    // // checking name & age
    if (((i === 0) && (inputValue.length < 4))
      || ((i === 3) && (inputValue < 18 || inputValue >= 90))) {
      const errorPopUp = error();

      setTimeout(() => {
        errorPopUp.style.display = 'none';
      }, 2000);

      userInputArr = [];

      return false;
    }
    //

    // converting number to currency
    if (i === form.children.length - 2) {
      inputValue = convertToCurrency(inputValue);
    }
    //

    userInputArr.push(inputValue);
  }

  // creating new row in table
  const newRow = document.createElement('tr');

  tbody.appendChild(newRow);

  for (let j = 0; j < titles.length; j++) {
    const newCell = document.createElement('td');

    newCell.textContent = userInputArr[j];
    newRow.appendChild(newCell);
  }
  //

  const popUp = success();

  setTimeout(() => {
    popUp.style.display = 'none';
  }, 2000);

  userInputArr = [];
});
// #endregion

// #region --Modify cell--

const cellInput = document.createElement('input');
let countActiveCells = document.querySelectorAll('.modifying').length;
let oldCellValue = '';

cellInput.classList.add('cell-input');

for (const row of tbody.rows) {
  for (const cell of row.cells) {
    cell.addEventListener('dblclick', e => {
      e.target.classList.add('modifying');
      oldCellValue = e.target.textContent;

      if (countActiveCells <= 1) {
        e.target.textContent = '';
        e.target.appendChild(cellInput);
        cellInput.focus();
      }
    });
  }
}

function setNewValue(input, oldValue) {
  let newCellValue = input.value;

  if (oldValue.indexOf('$') !== -1) {
    newCellValue = convertToCurrency(+newCellValue);
  }

  if ((newCellValue.length > 0) && (newCellValue !== '$0')) {
    input.parentNode.textContent = newCellValue;
  } else {
    input.parentNode.textContent = oldValue;
  }

  input.value = '';
  input.remove();
  countActiveCells = 0;
}

cellInput.addEventListener('keypress', inputEvent => {
  if (inputEvent.key === 'Enter') {
    setNewValue(inputEvent.target, oldCellValue);
  }
});

cellInput.addEventListener('blur', inputEvent => {
  setNewValue(inputEvent.target, oldCellValue);
});
// #endregion
