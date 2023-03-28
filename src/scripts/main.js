'use strict';

const headlines = document.querySelector('thead').rows[0];
const list = document.querySelector('tbody');
const listRows = list.rows;
let previousClickedTitleIndex = -1;
let direction;

// When users clicks on one of the table headers,
// table should be sorted in ASC order,
// the second click sorts it in DESC order.

headlines.addEventListener('click', (e) => {
  const headline = e.target.closest('th');
  const index = headline.cellIndex;

  if (previousClickedTitleIndex !== index) {
    direction = 1;
  } else {
    direction = -1;
  }

  previousClickedTitleIndex = index;

  if (direction === -1) {
    previousClickedTitleIndex = -1;
  }

  [...listRows].sort((a, b) => {
    const row = a.cells[index].textContent;
    const nextRow = b.cells[index].textContent;

    if (/\d/.test(row)) {
      const checkedRow = convertToNumber(row);
      const checkedNextRow = convertToNumber(nextRow);

      return (Number(checkedRow) - Number(checkedNextRow)) * direction;
    }

    return row.localeCompare(nextRow) * direction;
  }).forEach(row => list.appendChild(row));
});

function convertToNumber(string) {
  const number = Number(string.replace(/[$,]/g, ''));

  return `${number}`;
};

// Use 'active' class for table row to indicate it is selected.

[...listRows].forEach((line) => {
  line.tabIndex = 0;

  line.addEventListener('focus', (e) => {
    line.classList.add('active');
  });

  line.addEventListener('blur', (e) => {
    line.classList.remove('active');
  });
});

const commonBody = document.querySelector('body');
const employeForm = document.createElement('form');

employeForm.className = `new-employee-form`;
commonBody.append(employeForm);

// script to add a form to the document

employeForm.innerHTML = `
  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
      required
    >
  </label>

  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      required
    >
  </label>

  <label>
    Office:
    <select
      name="office"
      data-qa="office"
      required
    ></select>
  </label>

  <label>
    Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      required
    >
  </label>

  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      required
    >
  </label>

  <button>Save to Table</button>
`;

const selectButton = document.querySelector('select');
const selectOptions
  = [`Tokyo`, `Singapore`, `London`, `New York`, `Edinburgh`, `San Francisco`];

for (const city of selectOptions) {
  const option = new Option(`${city}`);

  option.value = city.toLowerCase();

  selectButton.append(option);
}

const firstName = document.querySelector('[name="name"]');
const age = document.querySelector('[name="age"]');

const minNameLength = 4;
const youngest = 18;
const oldest = 90;

const form = document.querySelector('form');

function addNewEmploye() {
  const labels = form.querySelectorAll('label');
  const labelsChildren = [];

  [...labels].forEach(label => {
    labelsChildren.push(label.children[0]);
  });

  const newRow = document.createElement('tr');

  [...labelsChildren].forEach(child => {
    const newCell = document.createElement('td');

    if (child.name === 'salary') {
      newCell.textContent = `$${formatNumberToMoney(child)}`;
    } else {
      newCell.textContent = capitalizedFirstWordLetter(child);
    }

    newRow.classList.add('active');

    newRow.appendChild(newCell);
  });

  newRow.tabIndex = 0;

  newRow.addEventListener('focus', (e) => {
    newRow.classList.add('active');
  });

  newRow.addEventListener('blur', (e) => {
    newRow.classList.remove('active');
  });

  return list.appendChild(newRow);
}

const nameValidation = (givenName) => {
  let valid = false;

  nameErrorMessage.hidden = true;

  if (givenName.value.length < minNameLength) {
    nameErrorMessage.hidden = false;
  } else {
    valid = true;
  }

  return valid;
};

const ageValidation = (input) => {
  let valid = false;

  ageErrorMessage.hidden = true;

  if (input.value < youngest || input.value > oldest) {
    ageErrorMessage.hidden = false;

    if (nameErrorMessage.hidden === false) {
      ageErrorMessage.style.top = '170%';
    } else {
      ageErrorMessage.style.top = '110%';
    }
  } else {
    valid = true;
  }

  return valid;
};

employeForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const isNameValid = nameValidation(firstName);

  const isAgeValid = ageValidation(age);
  const isFormValid = isNameValid && isAgeValid;

  if (!isFormValid && messageOfAcception.hidden === false) {
    messageOfAcception.hidden = true;
  }

  if (isFormValid) {
    messageOfAcception.hidden = false;

    setTimeout(() => {
      messageOfAcception.hidden = true;
    }, 3000);
    addNewEmploye();
    employeForm.reset();
  }
});

const ageErrorText
  = 'Employees younger than 18 y.o and older than 90 y.o. are not allowed';
const errorTitle = 'Error';
const nameErrorText
  = 'Employees with name shoter than 4 letters are not allowed';
const nameErrorMessage = createNotification('error', nameErrorText, errorTitle);
const ageErrorMessage = createNotification('error', ageErrorText, errorTitle);
const titleOfAcception = 'Accepted';
const textOfAcception = `New employe is successfully added`;
const messageOfAcception = createNotification(
  'success',
  textOfAcception,
  titleOfAcception);

function createNotification(nameOfClass, text, titleText) {
  employeForm.insertAdjacentHTML('afterbegin', `
    <div class="notification" data-qa="notification"></div>
  `);

  const notification = document.querySelector('[data-qa="notification"]');

  notification.classList.add(`${nameOfClass}`);
  notification.style.top = '110%';
  notification.style.right = '0';
  notification.style.color = 'white';

  const notificationTitle = document.createElement('h1');
  const notificationText = document.createElement('p');

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);
  notification.classList.add('title');
  notificationTitle.textContent = `${titleText}`;
  notificationText.textContent = `${text}`;

  notification.hidden = true;

  return notification;
}

// Implement editing of table cells by double-clicking on it

list.addEventListener('dblclick', (e) => {
  const clickedCell = e.target.closest('td');
  const cellsText = clickedCell.textContent;

  if (!clickedCell) {
    return;
  }

  const clickedCellIndex = list.rows[0].cells[clickedCell.cellIndex].cellIndex;
  const inputInsteadOfCell = document.createElement('input');

  inputInsteadOfCell.classList.add('cell-input');
  clickedCell.textContent = '';
  clickedCell.appendChild(inputInsteadOfCell);
  inputInsteadOfCell.focus();

  inputInsteadOfCell.addEventListener('blur', () => {
    if (
      clickedCellIndex === getCellIndex(columnName1)
      && inputInsteadOfCell.value.length > 0
      && !ageValidation(inputInsteadOfCell)
    ) {
      clickedCell.textContent = cellsText;

      setTimeout(() => {
        ageErrorMessage.hidden = true;
      }, 5000);
    } else if (
      clickedCellIndex === getCellIndex(columnName2)
      && inputInsteadOfCell.value.length > 0
      && !nameValidation(inputInsteadOfCell)
    ) {
      clickedCell.textContent = cellsText;

      setTimeout(() => {
        nameErrorMessage.hidden = true;
      }, 5000);
    } else {
      addNewTextOrSavePreviousOne(clickedCell, inputInsteadOfCell, cellsText);
    };
  });

  inputInsteadOfCell.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Enter') {
      return;
    }

    if (
      clickedCellIndex === getCellIndex(columnName1)
      && inputInsteadOfCell.value.length > 0
      && !ageValidation(inputInsteadOfCell)
    ) {
      clickedCell.textContent = cellsText;

      setTimeout(() => {
        ageErrorMessage.hidden = true;
      }, 5000);
    } else if (
      clickedCellIndex === getCellIndex(columnName2)
      && inputInsteadOfCell.value.length > 0
      && !nameValidation(inputInsteadOfCell)
    ) {
      clickedCell.textContent = cellsText;

      setTimeout(() => {
        nameErrorMessage.hidden = true;
      }, 5000);
    } else {
      addNewTextOrSavePreviousOne(clickedCell, inputInsteadOfCell, cellsText);
    }
  });
});

function addNewTextOrSavePreviousOne(cell, input, text) {
  if (input.value) {
    cell.textContent
    = list.rows[0].cells[cell.cellIndex].cellIndex === getCellIndex(columnName3)
        ? `$${formatNumberToMoney(input)}`
        : capitalizedFirstWordLetter(input);
  } else {
    cell.textContent = text;
  }

  input.remove();
}

const columnName1 = 'age';
const columnName2 = 'name';
const columnName3 = 'salary';

function getCellIndex(columnName) {
  const headTitles = headlines.cells;

  for (const title of headTitles) {
    if (title.textContent.toLowerCase() === columnName.toLocaleLowerCase()) {
      return title.cellIndex;
    }
  }
}

function formatNumberToMoney(input) {
  const number = new Intl.NumberFormat('en-IN').format(input.value);

  return number;
}

function capitalizedFirstWordLetter(input) {
  const word = input.value;

  return word.charAt(0).toUpperCase() + word.slice(1);
}
