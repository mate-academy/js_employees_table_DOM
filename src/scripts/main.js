'use strict';

const body = document.querySelector('body');
const form = document.createElement('form');

form.className = 'new-employee-form';

const fields = [
  {
    label: 'Name: ',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position: ',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office: ',
    name: 'office',
    type: 'select',
    qa: 'office',
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
    label: 'Age: ',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary: ',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((option) => {
      const optionElement = document.createElement('option');

      optionElement.value = option.toLowerCase();
      optionElement.textContent = option;
      input.add(optionElement);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.setAttribute('data-qa', field.qa);
  input.required = true;

  label.appendChild(input);

  form.appendChild(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

button.addEventListener('click', (e) => {
  e.preventDefault();

  const formData = {};

  fields.forEach((field) => {
    const input = form.querySelector(`[data-qa="${field.qa}"]`);

    if (input.type === 'select') {
      formData[field.name] = input.value;
    } else {
      formData[field.name] = input.value.trim();
    }
  });

  validateForm(formData);
});

form.appendChild(button);

function showNotification(type, title, message) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;

  const titleElement = document.createElement('h2');

  titleElement.className = 'title';
  titleElement.textContent = title;

  const messageElement = document.createElement('p');

  messageElement.textContent = message;

  notification.appendChild(titleElement);
  notification.appendChild(messageElement);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function validateForm(data) {
  if (
    !data.name ||
    !data.position ||
    !data.office ||
    !data.age ||
    !data.salary ||
    data.name.length < 4 ||
    data.age < 18 ||
    data.age > 90
  ) {
    showNotification('error', 'Error', 'Check data for mistakes');
  } else {
    const newField = document.createElement('tr');

    for (const key in data) {
      const newCol = document.createElement('td');

      newCol.textContent = data[key];
      newField.appendChild(newCol);
    }

    document.querySelector('tbody').appendChild(newField);

    showNotification(
      'success',
      'Success',
      'New employee has been successfully inserted into the table',
    );
  }
}

body.appendChild(form);

document.querySelectorAll('th').forEach((header, index) => {
  let firstEvent = true;

  header.addEventListener('click', () => {
    const tbody = document.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const getCellValue = (row, idx) => {
      const cellText = row.cells[idx].innerText.trim();

      if (idx === 2 || idx === 3) {
        return parseFloat(cellText.replace(/[^0-9.-]+/g, ''));
      }

      return cellText;
    };

    if (firstEvent === true) {
      rows.sort((rowA, rowB) => {
        const valA = getCellValue(rowA, index);
        const valB = getCellValue(rowB, index);

        return valA > valB ? 1 : valA < valB ? -1 : 0;
      });
    } else {
      rows.sort((rowA, rowB) => {
        const valA = getCellValue(rowA, index);
        const valB = getCellValue(rowB, index);

        return valB > valA ? 1 : valB < valA ? -1 : 0;
      });
    }

    firstEvent = !firstEvent;

    rows.forEach((row) => tbody.appendChild(row));
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  let activeInput = null;

  table.addEventListener('dblclick', (e) => {
    const target = e.target;

    if (target.tagName === 'TD' && !activeInput) {
      const initialValue = target.textContent;

      target.textContent = '';

      const input = document.createElement('input');

      input.type = 'text';
      input.className = 'cell-input';
      input.value = initialValue;

      target.textContent = '';
      target.appendChild(input);
      input.focus();
      activeInput = input;

      const saveChanges = () => {
        const newValue = input.value.trim();

        target.textContent = newValue || initialValue;
        activeInput = null;
      };

      input.addEventListener('blur', saveChanges);

      input.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
          saveChanges();
        }
      });
    }
  });
});
