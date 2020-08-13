'use strict';

const {
  WARNING_MESSAGE,
  MIN_LENGTH_OF_NAME,
  MIN_AGE,
  MAX_AGE,
  EMPLOYEES_FORM_ELEMENTS,
} = require('./constants');

function checkValidInfo(event, boxMessage, container) {
  const target = event.target;

  switch (target.name) {
    case EMPLOYEES_FORM_ELEMENTS.name.name:
      if ((target.value === '')
        || (target.value.length <= MIN_LENGTH_OF_NAME)) {
        pushNotification(
          WARNING_MESSAGE.NAME,
          'Name',
          'warning',
          boxMessage,
          container);
      }
      break;
    case EMPLOYEES_FORM_ELEMENTS.position.name:
      if (target.value === '') {
        pushNotification(
          WARNING_MESSAGE.POSITION,
          'Position',
          'warning',
          boxMessage,
          container);
      }
      break;
    case EMPLOYEES_FORM_ELEMENTS.office.name:
      if (target.value === '') {
        pushNotification(
          WARNING_MESSAGE.OFFICE,
          'Office',
          'warning',
          boxMessage,
          container);
      }
      break;
    case EMPLOYEES_FORM_ELEMENTS.age.name:
      if ((parseFloat(target.value) < MIN_AGE)
        || (parseFloat(target.value) > MAX_AGE)
          || (target.value === '')) {
        pushNotification(
          WARNING_MESSAGE.AGE,
          'Age',
          'warning',
          boxMessage,
          container);
      }
      break;
    case EMPLOYEES_FORM_ELEMENTS.salary.name:
      if (isNaN(parseFloat(target.value)) || target.value === '') {
        pushNotification(
          WARNING_MESSAGE.SALARY,
          'Salary',
          'warning',
          boxMessage,
          container);
      }
      break;
    default:
      break;
  }
}

function pushNotification(message, title, type, boxMessage, container) {
  boxMessage.className = 'notification';
  boxMessage.classList.add(type);

  boxMessage.innerHTML = `<h2 class = 'title'> ${title} </h2>
      <p> ${message} </p>
    `;
  container.append(boxMessage);

  setTimeout(() => boxMessage.remove(), 1500);
}

module.exports = {
  checkValidInfo,
  pushNotification,
};
