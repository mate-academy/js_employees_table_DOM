'use strict';

const message = require('./notification');

function formatSalary(salary) {
  let item = '';
  const newSalary = [];
  let count = 0;

  item += salary;
  item = item.split('').reverse();

  for (let i = 0; i < item.length; i++) {
    count++;
    newSalary.push(item[i]);

    if ((count === 3) && (i !== item.length - 1)) {
      count = 0;
      newSalary.push(',');
    }
  }

  return '$' + newSalary.reverse().join('');
}

function coverTextOfTheadInSpan(conteiner) {
  const span = document.createElement('span');

  for (const element of [...conteiner]) {
    element.prepend(span.cloneNode(true));

    const wantedSpan = element.querySelector('span');

    wantedSpan.append(element.childNodes[1]);
  }
}

function addEventToForm(formElement, boxMessage, conteiner) {
  formElement.name.addEventListener('blur',
    (event) => message.checkValidInfo(event, boxMessage, conteiner));

  formElement.position.addEventListener('blur',
    (event) => message.checkValidInfo(event, boxMessage, conteiner));

  formElement.office.addEventListener('blur',
    (event) => message.checkValidInfo(event, boxMessage, conteiner));

  formElement.age.addEventListener('blur',
    (event) => message.checkValidInfo(event, boxMessage, conteiner));

  formElement.salary.addEventListener('blur',
    (event) => message.checkValidInfo(event, boxMessage, conteiner));
}

module.exports = {
  formatSalary,
  coverTextOfTheadInSpan,
  addEventToForm,
};
