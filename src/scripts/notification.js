'use strict';

const {
  WARNING,
  MIN_LENGTH,
  MIN_AGE,
  MAX_AGE,
  FORM_FIELD,
} = require('./constants');

function checkValidInfo(event, boxMessage, container) {
  const target = event.target;

  switch (target) {
    case FORM_FIELD.name:
      if ((target.value === '') || (target.value.length <= MIN_LENGTH)) {
        pushNotification(
          WARNING.NAME,
          'Name',
          'warning',
          boxMessage,
          container);
      }
      break;
    case FORM_FIELD.position:
      if (target.value === '') {
        pushNotification(
          WARNING.POSITION,
          'Position',
          'warning',
          boxMessage,
          container);
      }
      break;
    case FORM_FIELD.office:
      if (target.value === '') {
        pushNotification(
          WARNING.OFFICE,
          'Office',
          'warning',
          boxMessage,
          container);
      }
      break;
    case FORM_FIELD.age:
      if ((parseFloat(target.value) < MIN_AGE)
        || (parseFloat(target.value) > MAX_AGE)
          || (target.value === '')) {
        pushNotification(
          WARNING.AGE,
          'Age',
          'warning',
          boxMessage,
          container);
      }
      break;
    case FORM_FIELD.salary:
      if (isNaN(parseFloat(target.value)) || target.value === '') {
        pushNotification(
          WARNING.SALARY,
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
