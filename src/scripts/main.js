'use strict';

const tbody = document.querySelector('tbody');
const headers = document.querySelector('thead tr');
const statuses = {};
const body = document.querySelector('body');

const wordsRegex = /([^a-zA-Z ])/g;
const digitsRegex = /\D/g;
const inputs = ['name', 'position', 'office', 'age', 'salary'];
const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const header of headers.children) {
  statuses[header] = false;
}

// Helpful functions
const pushNotification = (posTop, posRight, title, description, type) => {
  const bodyOfMessage = document.createElement('div');
  const titleOfMessage = document.createElement('h2');
  const infoOfMessage = document.createElement('p');

  bodyOfMessage.setAttribute('data-qa', 'notification');

  titleOfMessage.classList.add('title');
  bodyOfMessage.classList.add('notification');

  titleOfMessage.textContent = title;
  infoOfMessage.textContent = description;

  bodyOfMessage.style.position = 'absolute';
  bodyOfMessage.style.top = `${posTop}px`;
  bodyOfMessage.style.right = `${posRight}px`;

  bodyOfMessage.appendChild(titleOfMessage);
  bodyOfMessage.appendChild(infoOfMessage);
  body.appendChild(bodyOfMessage);

  if (type === 'success') {
    bodyOfMessage.classList.add('success');
  } else if (type === 'warning') {
    bodyOfMessage.classList.add('warning');
  } else {
    bodyOfMessage.classList.add('error');
  }

  setTimeout(() => {
    bodyOfMessage.style.display = 'none';
  }, 2000);
};

function checkInput(index, value) {
  const input = inputs[index];
  const trimmedValue = value.trim();

  if (
    typeof index !== 'number' ||
    (typeof trimmedValue !== 'number' && typeof trimmedValue !== 'string') ||
    typeof input === 'undefined' ||
    input === null
  ) {
    return;
  }

  if (
    trimmedValue === '' ||
    trimmedValue === null ||
    typeof trimmedValue === 'undefined'
  ) {
    pushNotification(
      10,
      10,
      'Invalid input',
      `${input} has invalid value "${trimmedValue}"`,
      'error',
    );

    return false;
  }

  if (
    (wordsRegex.test(trimmedValue) && index < 2) ||
    (digitsRegex.test(trimmedValue) && index > 2)
  ) {
    pushNotification(
      10,
      10,
      'Invalid input',
      `Input of ${input} has invalid value "${trimmedValue}"`,
      'error',
    );

    return false;
  }

  if (trimmedValue.length < 4 && input === 'name') {
    pushNotification(
      10,
      10,
      'Invalid input',
      `Name ${trimmedValue} is too short, minimun amount of characters is 4`,
      'error',
    );

    return false;
  }

  if (input === 'age' && (trimmedValue < 18 || trimmedValue > 90)) {
    let message = '';

    if (trimmedValue < 18) {
      message = 'Minimum age for registration is 18';
    } else if (trimmedValue > 90) {
      message = 'Maximum age for registration is 90';
    }

    pushNotification(10, 10, 'Invalid input', `${message}`, 'error');

    return false;
  }

  return true;
}

function formatInput(identifier, value) {
  let key = '';

  if (typeof identifier === 'number') {
    key = inputs[identifier];
  } else if (typeof identifier === 'string') {
    key = identifier;
  }

  if (key === 'salary') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } else {
    return value.trim();
  }
}

// Sorting part
headers.addEventListener('click', (e) => {
  const bodyRows = document.querySelectorAll('tbody tr');

  const listToSort = [];

  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const aimIndx = th?.cellIndex;

  if (typeof aimIndx !== 'number' || aimIndx === -1) {
    return;
  }

  for (let i = 0; i < bodyRows.length; i++) {
    const row = bodyRows[i];

    if (row.children.length < aimIndx) {
      continue;
    }

    listToSort.push({
      aimCell: row.children[aimIndx],
      row: row,
      originalIndex: i,
    });
  }

  listToSort.sort((elem1, elem2) => {
    let copyElem1 = elem1;
    let copyElem2 = elem2;

    if (
      typeof elem1 === 'undefined' ||
      elem1 === null ||
      typeof elem2 === 'undefined' ||
      elem2 === null
    ) {
      return;
    }

    if (statuses[th] === true) {
      const switchElem = elem1;

      copyElem1 = elem2;
      copyElem2 = switchElem;
    }

    if (aimIndx === 0 || aimIndx === 1 || aimIndx === 2) {
      return copyElem1.aimCell.textContent
        .toLowerCase()
        .localeCompare(copyElem2.aimCell.textContent.toLowerCase());
    } else if (aimIndx === 3) {
      return +copyElem1.aimCell.textContent - +copyElem2.aimCell.textContent;
    } else if (aimIndx === 4) {
      const newElem1 = Number(
        copyElem1.aimCell.textContent.trim().replace(/[^0-9]+/g, ''),
      );
      const newElem2 = Number(
        copyElem2.aimCell.textContent.trim().replace(/[^0-9]+/g, ''),
      );

      if (typeof newElem1 !== 'number' || typeof newElem2 !== 'number') {
        return 0;
      }

      return newElem1 - newElem2;
    }
  });

  for (let i = 0; i < listToSort.length; i++) {
    tbody.appendChild(listToSort[i].row);
  }

  if (statuses[th] === true) {
    statuses[th] = false;
  } else {
    statuses[th] = true;
  }
});

// Changing value by doubleclick
tbody.addEventListener('click', (e) => {
  const activeTr = document.querySelector('tr.active');

  if (e.target.closest('tr') === activeTr) {
    const td = e.target.closest('td');

    if (
      typeof td !== 'undefined' &&
      td !== null &&
      !document.querySelector('tr.active input') &&
      !document.querySelector('tr.active select')
    ) {
      const cellIndex = td.cellIndex;
      const tdPreviousValue = td.textContent;

      td.textContent = '';

      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.setAttribute('type', 'text');
      input.setAttribute('name', 'input-field');

      td.appendChild(input);

      input.focus();

      input.addEventListener('change', () => {
        if (!checkInput(cellIndex, input.value)) {
          td.textContent = tdPreviousValue;
        } else {
          td.textContent = formatInput(cellIndex, input.value);
        }

        input.remove();
      });
    }
  }
});

// logic for selecting
tbody.addEventListener('click', (e) => {
  const bodyRows = document.querySelectorAll('tbody tr');

  if (e.target === null || typeof e.target === 'undefined') {
    return;
  }

  for (const bodyRow of bodyRows) {
    if (
      [...bodyRow.classList].includes('active') &&
      bodyRow !== e.target.closest('tr')
    ) {
      bodyRow.classList.remove('active');
    }
  }

  e.target.closest('tr').classList.add('active');
});

// Form creation
const form = document.createElement('form');

form.setAttribute('class', 'new-employee-form');

for (let i = 0; i < inputs.length; i++) {
  const input = inputs[i];
  const label = document.createElement('label');
  const parts = input.split('');

  parts[0] = parts[0].toUpperCase();

  label.textContent = parts.join('') + ':';

  if (input.toLowerCase() === 'office') {
    const officeElem = document.createElement('select');

    officeElem.setAttribute('name', 'office');
    officeElem.setAttribute('data-qa', 'office');

    const startOption = document.createElement('option');

    startOption.setAttribute('selected', '');
    startOption.setAttribute('disabled', '');
    startOption.textContent = 'Select office';

    officeElem.appendChild(startOption);

    for (const office of offices) {
      const option = document.createElement('option');

      option.textContent = office;
      officeElem.appendChild(option);
    }

    label.appendChild(officeElem);
  } else {
    const inputPole = document.createElement('input');

    inputPole.setAttribute('name', input);
    inputPole.setAttribute('data-qa', input);

    if (i < 2) {
      inputPole.setAttribute('type', 'text');
    } else if (i > 2) {
      inputPole.setAttribute('type', 'number');
    }

    label.appendChild(inputPole);
  }

  form.appendChild(label);
}

const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Save to table';

form.appendChild(submitButton);
body.appendChild(form);

// checking if form is filled with proper values or not
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const value = data.get(input).trim();

    if (!checkInput(i, value)) {
      return;
    }
  }

  const row = document.createElement('tr');

  for (const [key, value] of data.entries()) {
    const cell = document.createElement('td');

    cell.textContent = formatInput(key, value);

    row.appendChild(cell);
  }

  tbody.appendChild(row);

  pushNotification(
    10,
    10,
    'New Employee added successfully',
    `${data.get('name')} successfully added to employee list`,
    'success',
  );
});
