'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const tableHead = table.querySelector('thead');

// #region SORT

let isSorted = false;

function sortBy(rows, collection, columnPosition = 0, reversed = false) {
  if (!isSorted) {
    isSorted = true;
  }

  const sortedArray = [...rows];

  sortedArray.sort((firstElement, secondElement) => {
    let firstElementText = firstElement.children[columnPosition].innerText;

    firstElementText = firstElementText.replaceAll('$', '').replaceAll(',', '');

    let secondElementText = secondElement.children[columnPosition].innerText;

    secondElementText = secondElementText
      .replaceAll('$', '')
      .replaceAll(',', '');

    if (isNaN(Number(firstElementText))) {
      return firstElementText.localeCompare(secondElementText);
    }

    return Number(firstElementText) - Number(secondElementText);
  });

  if (reversed) {
    sortedArray.reverse();
  }

  sortedArray.forEach((element) => collection.append(element));
}

let reversedSort = true;
let sortCellIndex = 0;
let currentSortByIndex = -1;

tableHead.addEventListener('click', (e) => {
  if (!e.target.closest('th')) {
    return;
  }

  sortCellIndex = e.target.cellIndex;

  if (currentSortByIndex !== sortCellIndex) {
    reversedSort = false;
    currentSortByIndex = sortCellIndex;
  } else {
    reversedSort = !reversedSort;
  }

  sortBy(
    tableBody.querySelectorAll('tr'),
    tableBody,
    sortCellIndex,
    reversedSort,
  );
});

// #endregion

// #region selected row

tableBody.addEventListener('click', (e) => {
  if (!e.target.closest('td')) {
    return;
  }

  [...tableBody.children].forEach((child) => {
    if (child.classList.contains('active')) {
      child.classList.remove('active');
    }
  });

  e.target.parentNode.classList.add('active');
});

// #endregion

// #region form
const form = document.createElement('form');

form.classList += 'new-employee-form';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';
nameInput.required = true;

const nameInputLabel = document.createElement('label');

nameInputLabel.innerText = 'Name:';
nameInputLabel.append(nameInput);

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
positionInput.required = true;

const positionInputLabel = document.createElement('label');

positionInputLabel.innerText = 'Position:';
positionInputLabel.append(positionInput);

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
ageInput.required = true;

const ageInputLabel = document.createElement('label');

ageInputLabel.innerText = 'Age:';
ageInputLabel.append(ageInput);

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
salaryInput.required = true;

const salaryInputLabel = document.createElement('label');

salaryInputLabel.innerText = 'Salary:';
salaryInputLabel.append(salaryInput);

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';
officeSelect.required = true;

const officeSelectLabel = document.createElement('label');

officeSelectLabel.innerText = 'Office:';
officeSelectLabel.append(officeSelect);

const citiesArray = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const city of citiesArray) {
  const option = document.createElement('option');

  option.innerText = city;

  officeSelect.append(option);
}

const submitButton = document.createElement('button');

submitButton.innerText = 'Save to table';

form.append(nameInputLabel);
form.append(positionInputLabel);
form.append(officeSelectLabel);
form.append(ageInputLabel);
form.append(salaryInputLabel);
form.append(submitButton);

document.body.append(form);
// #endregion

// #region submitting form

const notification = document.createElement('div');

notification.classList = 'notification';
notification.dataset.qa = 'notification';
notification.style.visibility = 'hidden';

const notificationTitle = document.createElement('h2');

notificationTitle.classList = 'title';

const notificationDescription = document.createElement('p');

notification.append(notificationTitle);
notification.append(notificationDescription);

document.body.append(notification);

const MIN_NAME_LENGTH = 4;

function submitCheck(e) {
  e.preventDefault();
  notification.style.visibility = '';

  const nameValue = nameInput.value;
  const positionValue = positionInput.value;
  const ageValue = Number(ageInput.value);
  const officeValue = officeSelect.value;
  const salaryValue = salaryInput.value;

  notification.classList = 'notification error';
  notificationTitle.innerText = `Error`;

  if (nameValue.length < MIN_NAME_LENGTH) {
    notificationDescription.innerText = `Name has to be longer than ${MIN_NAME_LENGTH} letters`;

    return;
  }

  if (positionValue.length <= 0) {
    notificationDescription.innerText = `Position is required`;

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    notificationDescription.innerText = `You're must be older than 18 and younger that 90 years old`;

    return;
  }

  if (officeValue.length <= 0) {
    notificationDescription.innerText = `Please select office`;

    return;
  }

  if (String(salaryValue).length <= 0) {
    notificationDescription.innerText = `Salary is required`;

    return;
  }

  notification.classList = 'notification success';
  notificationTitle.innerText = `Success`;
  notificationDescription.innerText = `New employee added successfully`;

  const newEmployee = document.createElement('tr');

  const nameCell = document.createElement('td');

  nameCell.innerText = nameValue;

  const positionCell = document.createElement('td');

  positionCell.innerText = positionValue;

  const officeCell = document.createElement('td');

  officeCell.innerText = officeValue;

  const ageCell = document.createElement('td');

  ageCell.innerText = String(ageValue);

  const salaryCell = document.createElement('td');

  salaryCell.innerText =
    '$' +
    [...String(salaryValue).split('')]
      .reverse()
      .reduce((previous, current, index) => {
        if ((index + 1) % 3 === 0 && index !== String(salaryValue).length - 1) {
          previous.push(',' + current);
        } else {
          previous.push(current);
        }

        return previous;
      }, [])
      .reverse()
      .join('');

  newEmployee.append(nameCell);
  newEmployee.append(positionCell);
  newEmployee.append(officeCell);
  newEmployee.append(ageCell);
  newEmployee.append(salaryCell);

  tableBody.append(newEmployee);

  if (isSorted) {
    sortBy(
      tableBody.querySelectorAll('tr'),
      tableBody,
      sortCellIndex,
      reversedSort,
    );
  }

  nameInput.value = '';
  positionInput.value = '';
  ageInput.value = '';
  officeSelect.value = '';
  salaryInput.value = '';
}

submitButton.addEventListener('click', (e) => submitCheck(e));
submitButton.addEventListener('submit', (e) => submitCheck(e));

// #endregion

// #region Double clicking
let initialValue = '';

tableBody.addEventListener('dblclick', (e) => {
  if (!e.target.closest('td')) {
    return;
  }

  [...tableBody.children].forEach((child) => {
    [...child.children].forEach((infant) => {
      if (infant.querySelector('input') !== null) {
        infant.innerText = initialValue;
      }
    });
  });

  initialValue = e.target.innerText;

  e.target.innerText = '';

  const valueInput = document.createElement('input');

  valueInput.type = 'text';
  valueInput.classList = 'cell-input';
  valueInput.name = 'cell-input';
  valueInput.value = initialValue;

  e.target.append(valueInput);
  valueInput.focus();

  function inputValueCheck() {
    const inputText = valueInput.value;

    if (inputText.length > 0) {
      e.target.innerText = valueInput.value;
      valueInput.remove();

      if (isSorted) {
        sortBy(
          tableBody.querySelectorAll('tr'),
          tableBody,
          sortCellIndex,
          reversedSort,
        );
      }

      return;
    }

    e.target.innerText = initialValue;
  }

  valueInput.addEventListener('blur', (valueInputEvent) => {
    inputValueCheck();
  });

  valueInput.addEventListener('keypress', (valueInputEvent) => {
    if (valueInputEvent.key === 'Enter') {
      inputValueCheck();
    }
  });
});
// #endregion
