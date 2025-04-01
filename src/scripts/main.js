/* eslint-disable padding-line-between-statements */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
'use strict';

const table = document.querySelector('table');
const thead = document.querySelector('thead');
const rowHead = thead.querySelector('tr');
const cellsHead = [...rowHead.children];
const tbody = document.querySelector('tbody');
let rowsBody = [...tbody.querySelectorAll('tr')];

table.prevColumn = null;
table.prevRow = null;

// notificationError
const notificationError = document.createElement('div');
notificationError.classList.add('notification');
notificationError.classList.add('error');
const notificationErrorTitle = document.createElement('div');
notificationErrorTitle.classList.add('title');
const notificationErrorText = document.createElement('span');
notificationError.append(notificationErrorTitle);
notificationError.append(notificationErrorText);
notificationError.style.display = 'none';
notificationError.setAttribute('data-qa', 'notification');
let timeIdError = null;
document.querySelector('body').prepend(notificationError);

// notificationSuccess
const notificationSuccess = document.createElement('div');
notificationSuccess.classList.add('notification');
notificationSuccess.classList.add('success');
const notificationSuccessTitle = document.createElement('div');
notificationSuccessTitle.classList.add('title');
const notificationSuccessText = document.createElement('span');
notificationSuccess.append(notificationSuccessTitle);
notificationSuccess.append(notificationSuccessText);
notificationSuccess.style.display = 'none';
notificationSuccess.setAttribute('data-qa', 'notification');
let timeIdSuccess = null;
document.querySelector('body').prepend(notificationSuccess);

function showNotificationError(type, text) {
  if (timeIdError !== null) {
    clearTimeout(timeIdError);
  }
  notificationSuccess.style.display = 'none';
  notificationError.style.display = 'unset';
  notificationErrorTitle.innerText = type + '!';
  notificationErrorText.innerText = text;

  timeIdError = setTimeout(() => {
    notificationError.style.display = 'none';
  }, 2000);
}

function showNotificationSuccess(type, text) {
  if (timeIdSuccess !== null) {
    clearTimeout(timeIdSuccess);
  }
  notificationError.style.display = 'none';
  notificationSuccess.style.display = 'unset';
  notificationSuccessTitle.innerText = type + '!';
  notificationSuccessText.innerText = text;

  timeIdSuccess = setTimeout(() => {
    notificationSuccess.style.display = 'none';
  }, 2000);
}

function formCreating() {
  const form = document.createElement('form');
  form.classList.add('new-employee-form');

  const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];

  for (const labelName of labels) {
    const label = document.createElement('label');
    label.classList.add('label');
    label.innerText = `${labelName}: `;

    if (labelName === 'Office') {
      const options = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];
      const select = document.createElement('select');
      select.classList.add('select');
      select.setAttribute('data-qa', `${labelName.toLocaleLowerCase()}`);
      select.setAttribute('name', `${labelName.toLocaleLowerCase()}`);
      select.setAttribute('required', true);

      for (const place of options) {
        const option = document.createElement('option');
        option.innerText = place;
        option.setAttribute('value', place);
        select.append(option);
      }

      label.append(select);
    } else {
      const input = document.createElement('input');
      input.classList.add('input');
      input.setAttribute('data-qa', `${labelName.toLocaleLowerCase()}`);
      input.setAttribute('name', `${labelName.toLocaleLowerCase()}`);
      input.setAttribute('id', `${labelName.toLocaleLowerCase()}`);
      input.setAttribute('required', true);
      if (labelName === 'Age' || labelName === 'Salary') {
        input.setAttribute('type', 'number');
      } else {
        input.setAttribute('type', 'text');
      }
      label.append(input);
    }

    form.append(label);
  }

  const formLabel = document.createElement('label');
  formLabel.classList.add('label');

  const formButton = document.createElement('button');
  formButton.classList.add('button');
  formButton.setAttribute('type', 'submit');
  formButton.innerText = 'Save to table';

  form.append(formLabel);
  form.append(formButton);
  document.querySelector('body').append(form);

  function addNewEmployee(data) {
    const newRow = document.createElement('tr');

    function convertNumToSalary(number) {
      return '$' + new Intl.NumberFormat('en').format(number);
    }

    for (const head of cellsHead) {
      const newTd = document.createElement('td');
      const newText = data[head.innerText.toLocaleLowerCase()];
      if (head.innerText === 'Salary') {
        newTd.innerText = convertNumToSalary(newText);
      } else {
        newTd.innerText = newText;
      }
      newRow.append(newTd);
    }

    tbody.append(newRow);
  }

  function formValidation(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    switch (true) {
      case data.name.length < 4:
        form.querySelector('#name').focus();
        showNotificationError('Error', 'Name must have more than 3 letters!');
        return;
      case data.age < 18 || data.age > 90:
        // eslint-disable-next-line max-len, prettier/prettier
        form.querySelector('#age').focus();
        showNotificationError(
          'Error',
          'Age must be more then 18 and less than 90!',
        );
        return;
      default:
        addNewEmployee(data);
        showNotificationSuccess('Success', 'New employee added successfully!');
    }
  }

  form.addEventListener('submit', formValidation);
}

function compare(element1, element2, regime, orderAscending) {
  if (orderAscending) {
    switch (regime) {
      case 'Age':
        return +element1 - +element2;
      case 'Salary':
        const firstFormated = +element1.replaceAll(/[^0-9]+/g, '');
        const secondFormated = +element2.replaceAll(/[^0-9]+/g, '');

        return firstFormated - secondFormated;
      default:
        return element1.localeCompare(element2);
    }
  } else {
    switch (regime) {
      case 'Age':
        return +element2 - +element1;
      case 'Salary':
        const firstFormated = +element1.replaceAll(/[^0-9]+/g, '');
        const secondFormated = +element2.replaceAll(/[^0-9]+/g, '');

        return secondFormated - firstFormated;
      default:
        return element2.localeCompare(element1);
    }
  }
}

function prevCheck(prevElem, curentElem) {
  if (table[prevElem] !== curentElem) {
    if (table[prevElem] !== null) {
      table[prevElem].removeAttribute('class');
    }
    table[prevElem] = curentElem;
  }
}

function tableSort(event) {
  const target = event.target;

  if (!target.matches('th')) {
    return;
  }

  prevCheck('prevColumn', target);

  rowsBody = [...tbody.querySelectorAll('tr')];
  const index = target.cellIndex;

  const orderAscending = !target.classList.toggle(
    'desc',
    !target.classList.toggle('asc'),
  );

  rowsBody.sort((row1, row2) => {
    const firstValue = [...row1.children][index].innerText;
    const secondValue = [...row2.children][index].innerText;
    const regime = target.innerText;

    return compare(firstValue, secondValue, regime, orderAscending);
  });

  rowsBody.forEach((row) => tbody.append(row));
}

function rowSelect(event) {
  const row = event.target.closest('tr');

  if (!row) {
    return;
  }

  prevCheck('prevRow', row);

  row.classList.add('active');
}

formCreating();
rowHead.addEventListener('click', tableSort);
tbody.addEventListener('click', rowSelect);
