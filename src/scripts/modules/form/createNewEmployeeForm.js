'use strict';

const { capitalizeWord } = require('../../utils/');

const formData = [
  {
    name: 'name',
    type: 'text',
    tagName: 'input',
  },
  {
    name: 'position',
    type: 'text',
    tagName: 'input',
  },
  {
    name: 'office',
    tagName: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    name: 'age',
    type: 'number',
    tagName: 'input',
  },
  {
    name: 'salary',
    type: 'number',
    tagName: 'input',
  },
];

const createFieldContent = (data) => {
  /* eslint-disable-next-line no-shadow */
  const { name, type, tagName, options } = data;

  const fieldContent = document.createElement(tagName);

  fieldContent.setAttribute('data-qa', name);
  fieldContent.name = name;

  if (tagName === 'input') {
    fieldContent.type = type;
  } else {
    for (const option of options) {
      const newOption = document.createElement('option');

      newOption.value = option;
      newOption.textContent = option;

      fieldContent.appendChild(newOption);
    }
  }

  return fieldContent;
};

const createFormField = (data) => {
  const formField = document.createElement('label');

  formField.textContent = `${capitalizeWord(data.name)}:`;

  const fieldContent = createFieldContent(data);

  formField.appendChild(fieldContent);

  return formField;
};

const createSubmitButton = () => {
  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';
  submitButton.type = 'submit';

  return submitButton;
};

const createNewEmployeeForm = (domElement) => {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  for (const data of formData) {
    const formField = createFormField(data);

    form.appendChild(formField);
  }

  const submitButton = createSubmitButton();

  form.appendChild(submitButton);

  domElement.appendChild(form);

  return form;
};

module.exports = { createNewEmployeeForm };
