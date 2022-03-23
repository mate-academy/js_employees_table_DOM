'use strict';
// sorting table implementation

let clickedColumn;
let clickedColumnName;
let currentClickedColumn;
let toggleClicks = false;

const tableBody = document.querySelector('tbody');

const tableArray = [];

function toNumber(numberAsString) {
  let resultString = numberAsString;

  // regex could be used here but I don't have enough knowledge about it yet
  if (numberAsString[0] === '$') {
    resultString = numberAsString.slice(1);

    if (typeof (parseInt(resultString.split(',').join('')))
    === 'number') {
      resultString = parseInt(resultString.split(',').join(''));
    }
  } else if (parseInt(resultString)) {
    resultString = parseInt(numberAsString);
  }

  return resultString;
}

function sortByColumn(tableToSort, columnNumber) {
  const row = tableBody.querySelectorAll('tr');
  const head = document.querySelector('thead');

  for (let i = 0; i < row.length; i++) {
    tableArray.push(row[i]);
  }

  // switch case with column names could be used here
  // but if any column name would be changed
  // or if other column would be added it wouldn't work anymore

  if (typeof (toNumber(tableArray[0].cells[columnNumber].innerHTML))
  === 'number') {
    if (toggleClicks) {
      tableArray.sort((a, b) => toNumber(a.cells[columnNumber].innerHTML)
      - toNumber(b.cells[columnNumber].innerHTML));
    } else {
      tableArray.sort((a, b) => toNumber(b.cells[columnNumber].innerHTML)
      - toNumber(a.cells[columnNumber].innerHTML));
    }
  } else {
    tableArray.sort(function(a, b) {
      const prev = a.cells[columnNumber].innerHTML;
      const next = b.cells[columnNumber].innerHTML;

      if (toggleClicks) {
        return prev.localeCompare(next);
      } else {
        return next.localeCompare(prev);
      }
    });
  }

  tableToSort.append(head);

  for (let i = 0; i < tableArray.length; i++) {
    tableBody.append(tableArray[i]);
  }
}

document.addEventListener('click', e => {
  if (!e.target.closest('thead')) {
    return false;
  }

  clickedColumnName = e.target;

  if (clickedColumnName === currentClickedColumn) {
    toggleClicks = !toggleClicks;
  } else {
    toggleClicks = true;
  }

  const clickedHeaderCells = e.target.closest('tr').cells;

  for (let i = 0; i < clickedHeaderCells.length; i++) {
    if (clickedHeaderCells[i].innerHTML === e.target.innerHTML) {
      clickedColumn = i;
      break;
    }
  }

  const initialTable = document.querySelector('table');

  sortByColumn(initialTable, clickedColumn);

  currentClickedColumn = clickedColumnName;
});

// highliting clicked row implementation

let clickedRow;
let currentHighlitedRow;

const mainTable = document.querySelector('table');

mainTable.addEventListener('click', e => {
  if (e.target.closest('th')) {
    return;
  }

  clickedRow = e.target.closest('tr');
  currentHighlitedRow = document.querySelector('.active');

  if (currentHighlitedRow) {
    currentHighlitedRow.classList.remove('active');
  }

  if (clickedRow) {
    clickedRow.classList.add('active');
  }
});

// form adding implementation
// could be also implemented using insertAdjacentHTML

const pageBody = document.querySelector('body');

const newForm = document.createElement('form');

pageBody.append(newForm);

newForm.classList.add('new-employee-form');

function createInput(formForAddingTo, inpName, elemType) {
  const labelElem = document.createElement('label');
  const inputElem = document.createElement('input');

  formForAddingTo.append(labelElem);
  labelElem.innerHTML = `${inpName[0].toUpperCase()}${inpName.slice(1)}:`;
  labelElem.append(inputElem);
  inputElem.setAttribute('name', inpName);
  inputElem.setAttribute('type', elemType);
  inputElem.setAttribute('data-qa', inpName);
  inputElem.setAttribute('required', 'required');
}

function createSelect(formForAddingTo, optionsArray, selName) {
  const labelElem = document.createElement('label');
  const selectElem = document.createElement('select');

  labelElem.innerHTML = `${selName[0].toUpperCase()}${selName.slice(1)}:`;
  formForAddingTo.append(labelElem);
  labelElem.append(selectElem);
  selectElem.setAttribute('name', selName);
  selectElem.setAttribute('data-qa', selName);
  selectElem.setAttribute('required', 'required');

  for (const elem of optionsArray) {
    const newOption = document.createElement('option');

    newOption.innerHTML = elem;
    selectElem.append(newOption);
  }
}

function createButton(formForAddingTo, buttonName, buttonType) {
  const buttonElem = document.createElement('button');

  formForAddingTo.append(buttonElem);
  buttonElem.innerHTML = buttonName;
  buttonElem.setAttribute('required', 'required');
  buttonElem.setAttribute('type', buttonType);
}

const offices
= ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

createInput(newForm, 'name', 'text');
createInput(newForm, 'position', 'text');
createSelect(newForm, offices, 'office');
createInput(newForm, 'age', 'number');
createInput(newForm, 'salary', 'number');
createButton(newForm, 'Save to table', 'submit');

// form data handling

const ourForm = document.querySelector('form');

ourForm.addEventListener('submit', handleFormInformation);

function handleFormInformation(e) {
  e.preventDefault();

  const targetForm = e.target.closest('form');
  const data = new FormData(targetForm);
  const userData = Object.fromEntries(data.entries());

  const currentName = document.querySelector('[name="name"]');
  const currentAge = document.querySelector('[name="age"]');
  const currentPosition = document.querySelector('[name="position"]');
  const currentSalary = document.querySelector('[name="salary"]');

  if (userData.name.length < 4) {
    createNotification('error', 'Error!', `Name should contain more letters!`);

    currentName.value = '';

    return;
  }

  if (userData.age < 18) {
    createNotification('error', 'Error!', 'Age cannot be less than 18!');

    currentAge.value = null;

    return;
  }

  if (userData.age > 90) {
    createNotification('error', 'Error!', 'Age cannot be more than 90!');

    currentAge.value = null;

    return;
  }

  createNotification('success', 'Congrats!', 'New employee was added!');
  createNewEmployee(userData);

  // tried to do it using userData object but it didn't affect the form
  currentName.value = '';
  currentAge.value = '';
  currentPosition.value = '';
  currentSalary.value = '';
}

function createNewEmployee(employeeData) {
  tableBody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${employeeData.name}</td>
    <td>${employeeData.position}</td>
    <td>${employeeData.office}</td>
    <td>${employeeData.age}</td>
    <td>${convertSalary(employeeData.salary)}</td>
  </tr>
  `);
}

function convertSalary(receivedNumber) {
  let numberAsString = receivedNumber.toString();

  while (numberAsString[0] === '0') {
    numberAsString = numberAsString.slice(1);
  }

  let result = '';
  let count = 1;
  let resultLength = 1;

  for (let i = numberAsString.length - 1; i >= 0; i--) {
    if (count % 3 === 0 && i !== 0) {
      resultLength++;
      result = result.padStart(resultLength, `,${numberAsString[i]}`);
    } else {
      result = result.padStart(resultLength, `${numberAsString[i]}`);
    }
    count++;
    resultLength++;
  }

  return '$' + result;
}

function createNotification(className, title, description) {
  const notificationBlock = document.createElement('div');

  notificationBlock.classList.add('notification', className);

  notificationBlock.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h2');

  notificationTitle.innerHTML = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.innerHTML = description;

  const pBody = document.querySelector('body');

  pBody.append(notificationBlock);
  notificationBlock.append(notificationTitle, notificationDescription);

  setTimeout(() => {
    notificationBlock.remove();
  },
  5000);
}

// double click action implementation
// in the perfect implementation new values should be checked before changing

let tempContent;

tableBody.addEventListener('dblclick', (e) => {
  const cellClicked = e.target.closest('td');

  createInputInsteadCell(cellClicked);
});

function createInputInsteadCell(targetCell) {
  const inputForReplace = document.createElement('input');

  inputForReplace.classList.add('cell-input');

  tempContent = targetCell.innerHTML;
  targetCell.innerHTML = '';
  targetCell.append(inputForReplace);

  inputForReplace.focus();

  inputForReplace.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
      e.target.blur();
    }
  });

  inputForReplace.addEventListener('blur', e => {
    saveChanges(e.target);
  });
}

function saveChanges(currentInput) {
  if (currentInput.value) {
    currentInput.closest('td').innerHTML = currentInput.value;
    currentInput.remove();
  } else {
    currentInput.closest('td').innerHTML = tempContent;
    currentInput.remove();
  }
};
