'use strict';

const { checkValidInfo } = require('./notification');
const {
  EMPLOYEES_FORM_ELEMENTS,
  OPTIONS,
  TABLE_HEADER,
} = require('./constants');

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const div = document.createElement('div');

function createEmployeesForm(formElements) {
  const form = document.createElement('form');
  const fieldsForm = Object.values(EMPLOYEES_FORM_ELEMENTS);

  form.classList.add('new-employee-form');

  for (const field of fieldsForm) {
    const label = document.createElement('label');

    label.textContent = field.placeholder + ': ';

    if (field.name !== TABLE_HEADER.office.toLowerCase()) {
      const input = document.createElement('input');

      input.name = field.name;
      input.type = field.type;
      input.placeholder = field.placeholder;

      input.addEventListener('blur', (event) =>
        checkValidInfo(event, div, form.parentNode));

      label.append(input);
      form.append(label);

      continue;
    }

    const select = document.createElement('select');

    select.name = field.name;

    for (const optionValue of OPTIONS) {
      const option = document.createElement('option');

      option.value = optionValue;
      option.innerText = optionValue;

      select.append(option);
    }

    select.addEventListener('blur', (event) =>
      checkValidInfo(event, div, form.parentNode));
    label.append(select);
    form.append(label);
  }

  const button = document.createElement('button');

  button.type = 'button';
  button.innerText = 'Save to table';

  form.append(button);

  return form;
}

module.exports = {
  body,
  thead,
  tbody,
  div,
  createEmployeesForm,
};
