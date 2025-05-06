'use strict';

const body = document.querySelector('body');
const headerTitlesToClick = [...document.querySelectorAll('thead th')];
const headerToEventList = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = [...document.querySelectorAll('tbody tr')];

// #region table sorting

const sortDirections = [];

headerTitlesToClick.forEach(() => sortDirections.push('asc'));

headerToEventList.addEventListener('click', (e) => {
  const clickedHeader = e.target;
  const colIndex = headerTitlesToClick.indexOf(clickedHeader);

  rows.sort((r1, r2) => {
    const val1 = r1.children[colIndex].textContent;
    const num1 = +val1.replace('$', '').replace(',', '');
    const val2 = r2.children[colIndex].textContent;
    const num2 = +val2.replace('$', '').replace(',', '');

    if (!isNaN(num1)) {
      return num1 - num2;
    }

    return val1.localeCompare(val2);
  });

  if (sortDirections[colIndex] === 'dec') {
    rows.reverse();
    sortDirections[colIndex] = 'asc';
  } else {
    sortDirections[colIndex] = 'dec';
  }

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
});

// #endregion

// #region click on a row - active
let prevActiveRow = document.querySelector('tr');

tbody.addEventListener('click', (e) => {
  const currentActiveRow = e.target.closest('tr');

  prevActiveRow.classList.remove('active');
  currentActiveRow.classList.add('active');
  prevActiveRow = currentActiveRow;
});
// #endregion

// #region add a form to the document

const form = document.createElement('form');

form.classList.add('new-employee-form');

const labelName = document.createElement('label');
const labelPos = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSal = document.createElement('label');
const button = document.createElement('button');

labelName.textContent = 'Name:';
labelPos.textContent = 'Position:';
labelOffice.textContent = 'Office:';
labelAge.textContent = 'Age:';
labelSal.textContent = 'Salary:';
button.textContent = 'Save to table';

const inputName = document.createElement('input');
const inputPos = document.createElement('input');
const inputOffice = document.createElement('select');
const inputAge = document.createElement('input');
const inputSal = document.createElement('input');

inputName.setAttribute('data-qa', 'name');
inputName.setAttribute('required', '');
inputPos.setAttribute('data-qa', 'position');
inputPos.setAttribute('required', '');
inputOffice.setAttribute('data-qa', 'office');
inputOffice.setAttribute('required', '');
inputAge.setAttribute('data-qa', 'age');
inputAge.setAttribute('type', 'number');
inputAge.setAttribute('required', '');
inputSal.setAttribute('data-qa', 'salary');
inputSal.setAttribute('name', 'salary');
inputSal.setAttribute('type', 'number');
inputSal.setAttribute('required', '');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.textContent = office;
  option.setAttribute('value', office);
  inputOffice.append(option);
});

labelName.appendChild(inputName);
labelPos.appendChild(inputPos);
labelOffice.appendChild(inputOffice);
labelAge.appendChild(inputAge);
labelSal.appendChild(inputSal);

form.append(labelName, labelPos, labelOffice, labelAge, labelSal, button);

body.appendChild(form);

// #endregion

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // #region value validation

  const nameVal = inputName.value;
  const namePattern = /^[A-Za-z]{4,}$/;
  const errName = !namePattern.test(nameVal);
  const ageVal = inputAge.value;
  const errAge = ageVal < 18 || ageVal > 90;
  const position = inputPos.value;
  const positions = [...document.querySelectorAll('td:nth-child(2)')];

  const validPosition = positions.some((pos) => pos.textContent === position);

  if (!validPosition) {
    const warningNotification = document.createElement('div');

    warningNotification.setAttribute('data-qa', 'notification');
    warningNotification.classList.add('notification', 'warning');

    const warningTitle = document.createElement('span');

    warningTitle.classList.add('title');
    warningTitle.textContent = 'Warning';

    const warningMessage = document.createElement('p');

    warningMessage.textContent = 'There is no such position';

    warningNotification.append(warningTitle, warningMessage);
    body.append(warningNotification);

    setTimeout(() => {
      warningNotification.remove();
    }, 2000);

    return;
  }

  if (errAge || errName) {
    const errorNotification = document.createElement('div');

    errorNotification.setAttribute('data-qa', 'notification');
    errorNotification.classList.add('notification', 'error');

    const errorTitle = document.createElement('span');

    errorTitle.classList.add('title');
    errorTitle.textContent = 'Error';

    const errorMessage = document.createElement('p');

    errorMessage.textContent =
      'Name must be at least 4 letters and age must be between 18 and 90';

    errorNotification.append(errorTitle, errorMessage);
    body.append(errorNotification);

    setTimeout(() => {
      errorNotification.remove();
    }, 2000);

    return;
  }

  // #endregion

  // #region new employee add
  const newEmployRow = document.createElement('tr');
  const inputs = [...document.querySelectorAll('input, select')];

  inputs.forEach((input) => {
    const cell = document.createElement('td');

    if (input.name === 'salary') {
      const numberValue = +input.value;
      const normalizedVal = '$' + numberValue.toLocaleString('en-US');

      cell.textContent = normalizedVal;
    } else {
      cell.textContent = input.value;
    }

    input.value = '';

    newEmployRow.append(cell);
  });

  tbody.append(newEmployRow);

  const successNotification = document.createElement('div');

  successNotification.setAttribute('data-qa', 'notification');
  successNotification.classList.add('notification', 'success');

  const successTitle = document.createElement('span');

  successTitle.classList.add('title');
  successTitle.textContent = 'Success';

  const successMessage = document.createElement('p');

  successMessage.textContent = 'New employee successfully added';

  successNotification.append(successTitle, successMessage);
  body.append(successNotification);

  setTimeout(() => {
    successNotification.remove();
  }, 2000);

  // #endregion
});
