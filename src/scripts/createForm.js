import { createElement } from './utils';
import { addRow } from './tableActions';
import { pushNotification } from './createNotification';

export function createForm(table) {
  const form = document.createElement('form');

  const selectorOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.append(
    createInput('Name:', 'name', 'text'),
    createInput('Position:', 'position', 'text'),
    createSelector('Office', 'office', selectorOptions),
    createInput('Age:', 'age', 'number'),
    createInput('Salary:', 'salary', 'number'),
    createSubmitButton(table, form, 'Save to table'),
  );

  form.classList.add('new-employee-form');
  document.body.append(form);
}

function createSelector(labelText, selectorName, selectorOptions) {
  const label = createElement('label', labelText);
  const selector = document.createElement('select');

  selectorOptions.forEach((optionText) => {
    selector.append(createElement('option', optionText));
  });

  selector.name = selectorName;
  selector.dataset.qa = selectorName;

  label.append(selector);

  return label;
}

function createInput(labelText, inputName, inputType = 'text') {
  const input = document.createElement('input');
  const label = createElement('label', labelText);

  input.type = inputType;
  input.name = inputName;
  input.autocomplete = 'off';
  input.dataset.qa = inputName;

  label.append(input);

  return label;
}

function createSubmitButton(table, form, buttonText) {
  const submitButton = createElement('button', buttonText);

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    const data = new FormData(form);

    if (data.get('name').length < 4) {
      return pushNotification(
        10,
        10,
        'Error',
        'The length of the name should be more than 4 symbols.',
        'error',
      );
    }

    if (data.get('position').length < 4) {
      return pushNotification(
        10,
        10,
        'Error',
        'The length of the position should be more than 4 symbols',
        'error',
      );
    }

    if (data.get('age') === '') {
      return pushNotification(10, 10, 'Error', 'The age is required.', 'error');
    }

    if (data.get('age') < 18) {
      return pushNotification(
        10,
        10,
        'Error',
        'The age should be 18 or older.',
        'error',
      );
    }

    if (data.get('age') > 90) {
      return pushNotification(
        10,
        10,
        'Error',
        'The age should be 90 or less.',
        'error',
      );
    }

    if (data.get('salary') === '') {
      return pushNotification(
        10,
        10,
        'Error',
        'The salary is required.',
        'error',
      );
    }

    form.reset();
    addRow(table, data);

    return pushNotification(
      10,
      10,
      'Success',
      'The row has been added.',
      'success',
    );
  });

  return submitButton;
}
