import { TABLE_HEADS } from './constants';
import { Toastr } from './toastr';
import { formatToCurrency } from './utils';

export class Form {
  static OFFICES = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  static #createSubmit() {
    const button = document.createElement('button');

    button.setAttribute('type', 'submit');
    button.textContent = 'Save to table';

    return button;
  }

  static #createInput(fieldName, options = {}) {
    const input = document.createElement('input');

    input.setAttribute('name', fieldName);
    input.setAttribute('data-qa', fieldName);
    input.setAttribute('required', true);

    Object.entries(options).forEach(([key, value]) => {
      input.setAttribute(key, value);
    });

    return input;
  }

  static #createField(fieldName, label, options) {
    const field = document.createElement('label');

    field.textContent = label;

    const input = Form.#createInput(fieldName, options);

    field.append(input);

    return field;
  }

  static #createOption(value) {
    const option = document.createElement('option');

    option.textContent = value;

    option.setAttribute('value', value);

    return option;
  }

  static #createSelect(fieldName) {
    const select = document.createElement('select');

    select.setAttribute('name', fieldName);
    select.setAttribute('data-qa', fieldName);
    select.style.backgroundColor = '#fff';

    Form.OFFICES.forEach((office) => {
      const option = Form.#createOption(office);

      select.append(option);
    });

    return select;
  }

  static #createSelectField(fieldName, label) {
    const selectField = document.createElement('label');

    selectField.textContent = label;

    const select = Form.#createSelect(fieldName);

    selectField.append(select);

    return selectField;
  }

  static #createNewRow(formData) {
    const tBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');

    for (const [key, value] of formData.entries()) {
      let cellValue = value;
      const newCell = document.createElement('td');

      if (key === TABLE_HEADS.salary) {
        cellValue = formatToCurrency(value);
      }

      newCell.append(cellValue);

      newRow.append(newCell);

      tBody.append(newRow);
    }
  }

  static #validateForm(formData) {
    const toastr = new Toastr();

    for (const [key, value] of formData.entries()) {
      if (!value) {
        toastr.error({
          title: 'Error',
          message: `${key} field is required`,
          options: {
            position: {
              top: 10,
              right: 10,
            },
          },
        });

        return false;
      }

      if (key === TABLE_HEADS.name) {
        if (value.length < 4) {
          toastr.error({
            title: 'Error',
            message: 'Name length should be at least 4 characters.',
            options: {
              position: {
                top: 10,
                right: 10,
              },
            },
          });

          return false;
        }
      }

      if (key === TABLE_HEADS.age) {
        if (value < 18 || value > 90) {
          toastr.error({
            title: 'Error',
            message: 'Age should be at least 18 y.o. and less or equal than 90',
            options: {
              position: {
                top: 10,
                right: 10,
              },
            },
          });

          return false;
        }
      }
    }

    return true;
  }

  static #onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const isValid = Form.#validateForm(formData);

    if (!isValid) {
      return;
    }

    Form.#createNewRow(formData);

    e.target.reset();

    const toastr = new Toastr();

    toastr.success({
      title: 'Success',
      message: 'Employee has been added.',
      options: {
        position: {
          top: 10,
          right: 10,
        },
      },
    });
  }

  static #combineForm(form) {
    const nameField = Form.#createField('name', 'Name:', {
      minLength: 4,
    });
    const positionField = Form.#createField('position', 'Position:');
    const officeSelectField = Form.#createSelectField('office', 'Office:');
    const ageField = Form.#createField('age', 'Age:', {
      type: 'number',
      min: 18,
      max: 90,
    });
    const salaryField = Form.#createField('salary', 'Salary:', {
      type: 'number',
    });
    const submit = Form.#createSubmit();

    form.append(nameField);
    form.append(positionField);
    form.append(officeSelectField);
    form.append(ageField);
    form.append(salaryField);
    form.append(submit);

    return form;
  }

  createForm() {
    const form = document.createElement('form');

    form.classList.add('new-employee-form');
    form.setAttribute('novalidate', true);

    form.addEventListener('submit', Form.#onSubmit);

    const combinedForm = Form.#combineForm(form);

    return combinedForm;
  }
}
