/* eslint-disable padding-line-between-statements */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
'use strict';

const head = document.querySelector('thead');
const rowHead = head.querySelector('tr');
const body = document.querySelector('tbody');
const rowsBody = [...body.querySelectorAll('tr')];

// const labelInput = document.createElement('input');
// labelInput.classList.add('input');

// const labelSelect = document.createElement('span');
// labelSelect.classList.add('select');

const formLabel = document.createElement('label');
formLabel.classList.add('label');
// formLabel.append(labelInput);
// formLabel.append(labelSelect);

const formButton = document.createElement('button');
formButton.classList.add('button');

const form = document.createElement('form');
form.classList.add('new-employee-form');
form.append(formLabel);
form.append(formButton);
document.querySelector('body').append(form);

document.prevColumn = null;
document.prevRow = null;

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
  if (document[prevElem] !== curentElem) {
    if (document[prevElem] !== null) {
      document[prevElem].removeAttribute('class');
    }
    document[prevElem] = curentElem;
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

rowHead.addEventListener('click', tableSort);
body.addEventListener('click', rowSelect);
