import {
  LABELS,
  KEYS,
  NUMERIC_VALUES,
  OFFICES,
  VALIDATION_RULES,
  NOTIFICATION_TYPES,
  ORDER_FIELDS,
} from '../../constants';

import { validateEmployeeData } from '../../services/validator';
import { showNotification } from '../notification/notifications';
import { normalizeNumberString } from '../../utils/formatter';

const SCHEMA = [
  { name: KEYS.NAME, label: LABELS.NAME },
  { name: KEYS.POSITION, label: LABELS.POSITION },
  { name: KEYS.OFFICE, label: LABELS.OFFICE },
  { name: KEYS.AGE, label: LABELS.AGE },
  { name: KEYS.SALARY, label: LABELS.SALARY },
];

const normalizeFormData = (cleanedData) => {
  return {
    [KEYS.NAME]: cleanedData[KEYS.NAME].trim(),
    [KEYS.POSITION]: cleanedData[KEYS.POSITION].trim(),
    [KEYS.OFFICE]: cleanedData[KEYS.OFFICE].trim(),
    [KEYS.AGE]: Number(cleanedData[KEYS.AGE]),
    [KEYS.SALARY]: Number(normalizeNumberString(cleanedData[KEYS.SALARY])),
  };
};

const onSubmitForm = (e, addEmployee) => {
  e.preventDefault();

  const FORM_DATA = ORDER_FIELDS.reduce((acc, k) => {
    acc[k] = document.querySelector(`[name="${k}"]`).value.trim();

    return acc;
  }, {});

  const { valid, errors, cleanedData } = validateEmployeeData(FORM_DATA);

  if (!valid) {
    showNotification(
      NOTIFICATION_TYPES.ERROR,
      'Validation ' + NOTIFICATION_TYPES.ERROR,
      Object.values(errors).join('. \n') + '.',
    );

    return;
  }

  if (valid) {
    showNotification(
      NOTIFICATION_TYPES.SUCCESS,
      'Validation ' + NOTIFICATION_TYPES.SUCCESS,
      'New employee saved',
    );

    const employeeData = normalizeFormData(cleanedData);

    addEmployee(employeeData);
  }
};

export const createEmployeeForm = (addEmployee) => {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  SCHEMA.forEach((field) => {
    const label = document.createElement('label');

    form.appendChild(label);
    label.appendChild(document.createTextNode(`${field.label}: `));

    if (field.name === KEYS.OFFICE) {
      const select = document.createElement('select');

      select.dataset.qa = field.name;
      select.required = true;
      select.name = field.name;

      const placeholder = document.createElement('option');

      select.appendChild(placeholder);
      placeholder.value = '';
      placeholder.textContent = 'Select office...';

      Object.values(OFFICES).forEach((office) => {
        const option = document.createElement('option');

        select.appendChild(option);
        option.textContent = office;
        option.value = office;
      });

      label.appendChild(select);

      return;
    }

    const input = document.createElement('input');

    label.appendChild(input);
    input.dataset.qa = field.name;
    input.name = field.name;
    input.required = true;

    switch (field.name) {
      case KEYS.AGE:
        input.min = VALIDATION_RULES.MIN_AGE;
        input.max = VALIDATION_RULES.MAX_AGE;
        break;
      case KEYS.SALARY:
        input.min = VALIDATION_RULES.MIN_SALARY;
        break;
    }

    if (NUMERIC_VALUES.includes(field.name)) {
      input.type = 'number';
    } else {
      input.type = 'text';
    }
  });

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.type = 'submit';

  button.addEventListener('click', function (e) {
    // // html validation
    // if (!form.checkValidity()) {
    //   form.reportValidity();

    //   return;
    // }

    return onSubmitForm(e, addEmployee);
  });

  form.appendChild(button);

  return form;
};
