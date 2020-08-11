'use strict';

const selectedEmployee = require('./selected');
const sortEmployees = require('./sort');
const addEmployee = require('./newEmployee');
const MESSAGE = require('./constants');
const notification = require('./notification');

let prevTdEdit = false;

const sortHandler = (event, conteiner) => {
  const target = event.target;
  const arrayTr = [...conteiner.querySelectorAll('tr')];

  sortEmployees(target.innerText, arrayTr, conteiner);
  selectedEmployee(conteiner.querySelectorAll('tr'));
};

const selectedHandler = (event, conteiner) => {
  const target = event.target.closest('tr');

  if (!target) {
    return;
  }

  selectedEmployee(conteiner.querySelectorAll('tr'));
  target.classList.add('active');
};

function editHandler(event) {
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
      saveEditTdHandler(e, currentElement));

    input.addEventListener('keyup', (e) =>
      saveEditTdHandler(e, currentElement));

    target.innerHTML = '';
    target.append(input);
  }
};

function saveEditTdHandler(event, currentElement) {
  const targetInput = event.target.closest('input');

  if ((event.keyCode === 13) || (event.type === 'blur')) {
    prevTdEdit = false;

    if (targetInput.value !== '') {
      targetInput.parentNode.innerHTML = targetInput.value;
    } else {
      targetInput.parentNode.innerHTML = currentElement.innerHTML;
    }
  }
};

const saveEmployeeHandler = (
  conteiner,
  formValue,
  boxMessage,
  conteinerParent
) => {
  const tr = document.createElement('tr');
  const objectEmployee = {};

  selectedEmployee(conteiner.querySelectorAll('tr'));
  addEmployee.checkAllField(objectEmployee, formValue);

  if (Object.keys(objectEmployee).length < 5) {
    notification.pushNotification(
      MESSAGE.ERROR,
      'Error',
      'error',
      boxMessage,
      conteinerParent);
  } else {
    for (const element in objectEmployee) {
      const td = document.createElement('td');

      td.insertAdjacentHTML('beforeend',
        `${objectEmployee[element]}`);
      tr.append(td);
    }
    conteiner.append(tr);
    addEmployee.resetForm(formValue);

    notification.pushNotification(
      MESSAGE.SUCCESS,
      'Success',
      'success',
      boxMessage,
      conteinerParent);
  }
};

module.exports = {
  sortHandler,
  selectedHandler,
  saveEditTdHandler,
  editHandler,
  saveEmployeeHandler,
};
