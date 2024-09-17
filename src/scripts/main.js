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
const employeeForm = document.createElement('form');

employeeForm.className = `new-employee-form`;
commonBody.append(employeeForm);

// script to add a form to the document

employeeForm.innerHTML = `
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
const position = document.querySelector('[name="position"]');

const minNameLength = 4;
const youngest = 18;
const oldest = 90;

const form = document.querySelector('form');

function addNewEmployee() {
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

const validInput = (value) => {
  const re = /^[a-zA-Z]+( [a-zA-Z]+){0,}$/;

  return re.test(value);
};

const positionValidation = (place) => {
  let valid = false;
  const value = place.value.trim();

  if (!isValue(value) || !validInput(value)) {
    warningLettersMessage.hidden = false;
  } else {
    warningLettersMessage.hidden = true;
    valid = true;
  }

  return valid;
};

const nameValidation = (givenName) => {
  let valid = false;
  const value = givenName.value.trim();

  if (value.length < minNameLength || !validInput(value)) {
    nameErrorMessage.hidden = false;
  } else {
    nameErrorMessage.hidden = true;
    valid = true;
  }

  return valid;
};

const ageValidation = (input) => {
  let valid = false;

  if (input.value < youngest || input.value > oldest) {
    ageErrorMessage.hidden = false;
  } else {
    valid = true;
    ageErrorMessage.hidden = true;
  }

  return valid;
};

employeeForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const isNameValid = nameValidation(firstName);
  const isAgeValid = ageValidation(age);
  const isPositionValid = positionValidation(position);

  const isFormValid = isNameValid && isAgeValid && isPositionValid;

  if (isFormValid) {
    addNewEmployee();
    createSuccessNotification(firstName);
    employeeForm.reset();
  }
});

const formsCoords = employeeForm.getBoundingClientRect();

const noteContainer = document.createElement('div');

employeeForm.append(noteContainer);

noteContainer.style.position = 'absolute';
noteContainer.style.top = `${formsCoords.height}px`;
noteContainer.style.left = 0;
noteContainer.style.width = 'max-content';

const ageErrorText
  = 'Employees younger than 18 y.o and older than 90 y.o. are not allowed';
const errorTitle = 'Error';
const ageErrorMessage = createNotification('error', ageErrorText, errorTitle);

const nameErrorText
  = 'Field `Name` allows to enter only letters and not less than 4';
const nameErrorMessage = createNotification('error', nameErrorText, errorTitle);

const warningMessageTitle = 'Warning';
const warningMessageText = 'No new data were entered';
const warningMessage
  = createNotification('warning', warningMessageText, warningMessageTitle);

const warningDigitsMessageText
  = 'Only digits are allowed to enter in this cell';
const warningDigitsMessage = createNotification(
  'warning',
  warningDigitsMessageText,
  warningMessageTitle);

const warningLettersMessageText = 'Fill the field please with letters only';
const warningLettersMessage = createNotification(
  'warning',
  warningLettersMessageText,
  warningMessageTitle);

function createNotification(nameOfClass, text, titleText) {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.dataset.qa = 'notification';

  notification.classList.add(`${nameOfClass}`);
  notification.style.position = 'static';
  notification.style.color = 'white';

  const notificationTitle = document.createElement('p');
  const notificationText = document.createElement('p');

  notificationTitle.className = 'title';
  notificationTitle.textContent = `${titleText}`;
  notificationText.textContent = `${text}`;
  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);

  notification.hidden = true;

  noteContainer.appendChild(notification);

  return notification;
}

function createSuccessNotification(employeeName) {
  const newEmployeeName = employeeName.value;
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.dataset.qa = 'notification';

  notification.classList.add('success');
  notification.style.position = 'static';
  notification.style.color = 'white';

  const notificationTitle = document.createElement('p');
  const notificationText = document.createElement('p');

  notificationTitle.className = 'title';
  notificationTitle.textContent = 'Accepted';

  notificationText.textContent
    = `New employe ${newEmployeeName} is successfully added`;
  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);

  noteContainer.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);

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
    defineCasesToRejectNewText(
      clickedCell,
      clickedCellIndex,
      cellsText,
      inputInsteadOfCell);
  });

  inputInsteadOfCell.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Enter') {
      return;
    }

    defineCasesToRejectNewText(
      clickedCell,
      clickedCellIndex,
      cellsText,
      inputInsteadOfCell);
  });
});

function replaceTextToCellAndRemoveInput(cell, input, text) {
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
const columnName4 = 'position';
const columnName5 = 'office';

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
  const word = input.value.trim();

  return word.charAt(0).toUpperCase() + word.slice(1);
}

const isValue = value => value !== '';
const isDigits = (value) => {
  const re = /^[0-9]+$/;

  return re.test(value);
};

function defineCasesToRejectNewText(cell, index, text, input) {
  const value = input.value.trim();

  switch (true) {
    case !isValue(value):
      cell.textContent = text;
      warningMessage.hidden = false;

      setTimeout(() => {
        warningMessage.hidden = true;
      }, 2000);
      break;

    case (index === getCellIndex(columnName3) && !isDigits(value)):
      cell.textContent = text;
      warningDigitsMessage.hidden = false;

      setTimeout(() => {
        warningDigitsMessage.hidden = true;
      }, 4000);
      break;

    case (index === getCellIndex(columnName1) && !isDigits(value)):
      cell.textContent = text;
      warningDigitsMessage.hidden = false;

      setTimeout(() => {
        warningDigitsMessage.hidden = true;
      }, 4000);
      break;

    case (index === getCellIndex(columnName1) && !ageValidation(input)):
      cell.textContent = text;

      setTimeout(() => {
        ageErrorMessage.hidden = true;
      }, 5000);
      break;

    case (index === getCellIndex(columnName2) && !nameValidation(input)):
      cell.textContent = text;

      setTimeout(() => {
        nameErrorMessage.hidden = true;
      }, 5000);
      break;

    case (index === getCellIndex(columnName4) && !validInput(value)):
      cell.textContent = text;
      warningLettersMessage.hidden = false;

      setTimeout(() => {
        warningLettersMessage.hidden = true;
      }, 3000);
      break;

    case (index === getCellIndex(columnName5) && !validInput(value)):
      cell.textContent = text;
      warningLettersMessage.hidden = false;

      setTimeout(() => {
        warningLettersMessage.hidden = true;
      }, 3000);
      break;

    default:
      replaceTextToCellAndRemoveInput(cell, input, text);
  }
};
