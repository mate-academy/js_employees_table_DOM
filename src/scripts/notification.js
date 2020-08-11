'use strict';

const ERRORS = require('./constants');

function checkValidInfo(event, boxMessage, conteiner) {
  const target = event.target;

  switch (target.name) {
    case 'name':
      if ((target.value === '') || (target.value.length <= 4)) {
        pushNotification(
          ERRORS.WARNING.NAME,
          'Name',
          'warning',
          boxMessage,
          conteiner);
      }
      break;
    case 'position':
      if (target.value === '') {
        pushNotification(
          ERRORS.WARNING.POSITION,
          'Position',
          'warning',
          boxMessage,
          conteiner);
      }
      break;
    case 'office':
      if (target.value === '') {
        pushNotification(
          ERRORS.WARNING.OFFICE,
          'Office',
          'warning',
          boxMessage,
          conteiner);
      }
      break;
    case 'age':
      if ((parseFloat(target.value) < 18) || (parseFloat(target.value) > 90)
          || (target.value === '')) {
        pushNotification(
          ERRORS.WARNING.AGE,
          'Age',
          'warning',
          boxMessage,
          conteiner);
      }
      break;
    case 'salary':
      if (isNaN(parseFloat(target.value)) || target.value === '') {
        pushNotification(
          ERRORS.WARNING.SALARY,
          'Salary',
          'warning',
          boxMessage,
          conteiner);
      }
      break;
    default:
      break;
  }
}

function pushNotification(message, title, type, boxMessage, conteiner) {
  boxMessage.className = 'notification';
  boxMessage.classList.add(type);

  boxMessage.innerHTML = `<h2 class = 'title'> ${title} </h2>
      <p> ${message} </p>
    `;
  conteiner.append(boxMessage);

  setTimeout(() => boxMessage.remove(), 1500);
}

module.exports = {
  checkValidInfo,
  pushNotification,
};
