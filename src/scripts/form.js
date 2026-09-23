'use strict';

import { pushNotification } from './notification.js';

function createInput(nameAttibute, typeAttibute, textContent) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = textContent;
  input.setAttribute('name', nameAttibute);
  input.setAttribute('type', typeAttibute);
  input.setAttribute('data-qa', nameAttibute);
  input.setAttribute('required', 'required');
  label.append(input);

  return label;
}

function createSelect(nameAttibute, textContent, options) {
  const label = document.createElement('label');
  const select = document.createElement('select');

  label.textContent = textContent;
  select.setAttribute('name', nameAttibute);
  select.setAttribute('data-qa', nameAttibute);
  select.setAttribute('required', 'required');

  for (const optionValue of options) {
    const option = document.createElement('option');

    option.setAttribute('value', optionValue);
    option.textContent = optionValue;

    select.append(option);
  }

  label.append(select);

  return label;
}

function createForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');

  form.className = 'new-employee-form';
  button.setAttribute('type', 'submit');
  button.textContent = 'Save to table';

  form.append(createInput('name', 'text', 'Name: '));
  form.append(createInput('position', 'text', 'Position: '));

  form.append(
    createSelect('office', 'Office: ', [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ]),
  );
  form.append(createInput('age', 'number', 'Age: '));
  form.append(createInput('salary', 'number', 'Salary: '));
  form.append(button);

  return form;
}

document.querySelector('body').append(createForm());

function formatNumber(number) {
  return `$${Number(number).toLocaleString('en-US')}`;
}

const formElement = document.querySelector('.new-employee-form');
const tbodyElement = document.querySelector('tbody');

formElement.addEventListener(
  'invalid',
  (e) => {
    if (e.target.name !== 'position') {
      return;
    }

    pushNotification(
      10,
      10,
      'Empty position',
      'Position field cannot be empty.',
      'error',
    );
  },
  true,
);

formElement.addEventListener('submit', (e) => {
  e.preventDefault();

  const newPerson = {
    personName: formElement.elements.name.value.trim(),
    position: formElement.elements.position.value,
    office: formElement.elements.office.value,
    age: formElement.elements.age.value,
    salary: formatNumber(formElement.elements.salary.value),
  };

  if (newPerson.personName.length < 4) {
    pushNotification(
      10,
      10,
      'Short Name',
      'Name must contain at least 4 characters.',
      'error',
    );

    return;
  }

  if (newPerson.age < 18 || newPerson.age > 90) {
    pushNotification(
      10,
      10,
      'Wrong age',
      'Ages must be between 18 and 90.',
      'error',
    );

    return;
  }

  const newTableRow = document.createElement('tr');

  for (const key in newPerson) {
    const newCell = document.createElement('td');

    newCell.textContent = newPerson[key];

    newTableRow.append(newCell);
  }

  tbodyElement.append(newTableRow);

  pushNotification(
    10,
    10,
    'Success',
    'A new employee is successfully added',
    'success',
  );

  formElement.reset();
});
