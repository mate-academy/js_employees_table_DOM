'use strict';

const { STATIC_INPUT_VALUE } = require('./constants');

function getFormFields(container, object) {
  for (let i = 0; i < STATIC_INPUT_VALUE; i++) {
    object[container[i].name] = container[i];
  }
}

function formatSalary(salary) {
  let array = [];
  const newSalary = [];
  let count = 0;

  array = salary.split('').reverse();

  for (let i = 0; i < array.length; i++) {
    count++;
    newSalary.push(array[i]);

    if ((count === 3) && (i !== array.length - 1)) {
      count = 0;
      newSalary.push(',');
    }
  }

  return '$' + newSalary.reverse().join('');
}

function coverTextOfTheadInSpan(header) {
  const span = document.createElement('span');

  for (const element of [...header]) {
    element.prepend(span.cloneNode(true));

    const wantedSpan = element.querySelector('span');

    wantedSpan.name = element.innerText;
    wantedSpan.append(element.childNodes[1]);
  }
}

module.exports = {
  formatSalary,
  coverTextOfTheadInSpan,
  getFormFields,
};
