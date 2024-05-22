'use strict';
import { TAG_SELECT, employeeFields } from './utils';
import { form } from './constants';

export function createForm() {
  form.className = 'new-employee-form';

  for (const field of employeeFields) {
    const { nameValue, tag, type, required, options } = field;
    const label = document.createElement('label');
    const formField = document.createElement(tag);

    label.textContent = nameValue[0].toUpperCase() + nameValue.slice(1) + ': ';

    formField.name = nameValue;
    formField.required = required;
    formField.dataset.qa = nameValue;

    label.appendChild(formField);

    form.appendChild(label);

    if (tag === TAG_SELECT) {
      options.forEach((option) => {
        const optionElement = document.createElement('option');

        const { selected, town } = option;

        if (selected) {
          optionElement.selected = selected;
        }

        optionElement.value = town;
        optionElement.textContent = town;

        formField.append(optionElement);
      });

      continue;
    }

    formField.type = type;
  }

  const submit = document.createElement('button');

  submit.type = 'submit';
  submit.textContent = 'Save to table';

  form.appendChild(submit);

  document.body.insertBefore(form, document.querySelector('script'));
}
