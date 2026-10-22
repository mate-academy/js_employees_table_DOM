import { showNotification } from './notification';
import { toUpperCaseFirstLetter, toUsd } from '../utils/format';

export function initNewEmployeeForm(tableEl, bodyEl) {
  const formEl = document.createElement('form');

  formEl.classList.add('new-employee-form');

  const fields = [
    { name: 'name', type: 'text', validation: isNameValid },
    { name: 'position', type: 'text', validation: isNameValid },
    {
      name: 'office',
      type: 'select',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    { name: 'age', type: 'number', validation: isAgeValid },
    { name: 'salary', type: 'number' },
  ];

  fields.forEach((field) => {
    const label = document.createElement('label');
    const labelText = toUpperCaseFirstLetter(field.name);

    label.textContent = `${labelText}: `;

    let inputEl;

    if (field.type === 'select') {
      inputEl = document.createElement('select');

      field.options.forEach((option) => {
        const optionEl = document.createElement('option');

        optionEl.value = option;
        optionEl.textContent = option;

        inputEl.appendChild(optionEl);
      });
    } else {
      inputEl = document.createElement('input');
      inputEl.type = field.type;
    }

    inputEl.name = field.name;
    inputEl.dataset.qa = field.name;

    label.appendChild(inputEl);
    formEl.appendChild(label);
  });

  const btn = document.createElement('button');

  btn.type = 'submit';
  btn.textContent = 'Save to table';

  formEl.appendChild(btn);

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(formEl);

    const newTrEntries = [];

    for (const field of fields) {
      let fieldValue = data.get(field.name);

      if (
        !fieldValue.trim() ||
        (field.validation && !field.validation(fieldValue))
      ) {
        showNotification(formEl, 'error');

        return;
      }

      if (field.name === 'salary') {
        fieldValue = toUsd(Number(fieldValue));
      }

      newTrEntries.push(fieldValue);
    }

    const newTr = document.createElement('tr');

    newTrEntries.forEach((newTrEntry) => {
      const td = document.createElement('td');

      td.textContent = newTrEntry;

      newTr.appendChild(td);
    });

    bodyEl.appendChild(newTr);

    showNotification(formEl, 'success');

    formEl.reset();
  });

  tableEl.insertAdjacentElement('afterend', formEl);
}

function isNameValid(str) {
  return str.trim().length >= 4;
}

function isAgeValid(str) {
  return Number(str) >= 18 && Number(str) <= 90;
}
