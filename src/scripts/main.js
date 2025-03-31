/* eslint-disable padding-line-between-statements */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
'use strict';

const table = document.querySelector('table');
const head = document.querySelector('thead');
const rowHead = head.querySelector('tr');
const body = document.querySelector('tbody');
const rowsBody = [...body.querySelectorAll('tr')];

table.prevColumn = null;
table.prevRow = null;

const notification = document.createElement('div');
notification.classList.add('notification');
const notificationTitle = document.createElement('div');
notificationTitle.classList.add('title');
const notificationText = document.createElement('span');
notification.append(notificationTitle);
notification.append(notificationText);
notification.style.display = 'none';
notification.style.zIndex = '1';
notification.style.transition = 'all 3s';
document.querySelector('body').prepend(notification);

function showNotification(type, text) {
  notification.style.display = 'unset';
  notificationTitle.innerText = type + '!';
  notificationText.innerText = text;
  notification.classList.add(type.toLocaleLowerCase());

  setTimeout(() => {
    notification.style.display = 'none';
    notification.classList.remove(type.toLocaleLowerCase());
  }, 3000);
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
      input.setAttribute('required', true);
      if (labelName === 'Age' || labelName === 'Salary') {
        input.setAttribute('type', 'number');
      } else if (labelName === 'Name') {
        input.setAttribute('type', 'name');
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
    return;
  }

  function formValidation(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    switch (true) {
      case data.name.length < 4:
        showNotification('Error', 'Антон даун!');
        return;
      case data.age < 18 || data.age > 90:
        // eslint-disable-next-line max-len, prettier/prettier
        showNotification('Error', 'Age must be more then 18 and less then 90!');
        return;
      default:
        addNewEmployee(data);
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

  rowsBody.forEach((row) => body.append(row));
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
body.addEventListener('click', rowSelect);
