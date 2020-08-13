'use strict';

const { selectTypeToSort } = require('./sort');
const { pushNotification } = require('./notification');

const {
  resetForm,
  validateForm,
} = require('./newEmployee');

const {
  ERROR_MESSAGE,
  SUCCESS_MESSAGE,
  NUMBER_OF_ENTERED_INFO,
} = require('./constants');

let prevTdEdit = false;

const sortEmployees = (event, tableBody) => {
  const target = event.target.closest('span');

  if (!target) {
    return;
  }

  const arrayTr = [...tableBody.querySelectorAll('tr')];

  selectTypeToSort(target.parentNode, arrayTr, tableBody);

  [...tableBody.querySelectorAll('tr')].map((row) =>
    row.classList.toggle('active', false));
};

const selectRow = (event, container) => {
  const target = event.target.closest('tr');

  if (!target) {
    return;
  }

  [...container.querySelectorAll('tr')].map((row) =>
    row.classList.toggle('active', false));
  target.classList.add('active');
};

function editCell(event) {
  const target = event.target.closest('td');
  const currentElement = target.cloneNode(true);

  if (!target) {
    return;
  }

  if (prevTdEdit === false) {
    prevTdEdit = true;

    const input = document.createElement('input');

    input.classList.add('cell-inputt');

    input.addEventListener('blur', (e) =>
      saveCellChanges(e, currentElement));

    input.addEventListener('keyup', (e) =>
      saveCellChanges(e, currentElement));

    target.innerHTML = '';
    target.append(input);
  }
};

function saveCellChanges(event, currentElement) {
  const targetInput = event.target.closest('input');

  if ((event.key === 'Enter') || (event.type === 'blur')) {
    prevTdEdit = false;

    if (targetInput.value !== '') {
      targetInput.parentNode.innerHTML = targetInput.value;
    } else {
      targetInput.parentNode.innerHTML = currentElement.innerHTML;
    }
  }
};

const submitEmployee = (
  container,
  formValue,
  boxMessage,
  containerParent
) => {
  const tr = document.createElement('tr');
  const objectEmployee = {};

  validateForm(objectEmployee, formValue);

  if (Object.keys(objectEmployee).length < NUMBER_OF_ENTERED_INFO) {
    pushNotification(
      ERROR_MESSAGE,
      'Error',
      'error',
      boxMessage,
      containerParent);
  } else {
    for (const element in objectEmployee) {
      const td = document.createElement('td');

      td.insertAdjacentHTML('beforeend',
        `${objectEmployee[element]}`);
      tr.append(td);
    }
    container.append(tr);
    resetForm(formValue);

    pushNotification(
      SUCCESS_MESSAGE,
      'Success',
      'success',
      boxMessage,
      containerParent);
  }

  [...container.querySelectorAll('tr')].map((row) =>
    row.classList.toggle('active', false));
};

module.exports = {
  sortEmployees,
  selectRow,
  saveCellChanges,
  editCell,
  submitEmployee,
};
