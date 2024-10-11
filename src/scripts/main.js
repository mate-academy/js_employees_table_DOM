'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const sortDirection = Array(headers.length).fill(true);
let currentHeaderIndex = null;
let currentEditingCell = null;

headers.forEach((header, i) => {
  header.addEventListener('click', () => {
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    if (currentHeaderIndex !== i) {
      sortDirection.fill(true);
      currentHeaderIndex = i;
    }

    rows.sort((a, b) => {
      const cellA = a.cells[i].textContent.trim().replace(/[$,]/g, '');
      const cellB = b.cells[i].textContent.trim().replace(/[$,]/g, '');

      if (isFinite(cellA) && isFinite(cellB)) {
        return sortDirection[i] ? cellA - cellB : cellB - cellA;
      } else {
        return sortDirection[i]
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    sortDirection[i] = !sortDirection[i];
    rows.forEach((row) => table.querySelector('tbody').appendChild(row));
  });
});

table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    table
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office:',
    name: 'office',
    type: 'select',
    qa: 'office',
  },
  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  if (field.type === 'select') {
    const select = document.createElement('select');

    select.setAttribute('name', field.name);
    select.setAttribute('data-qa', field.qa);

    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    options.forEach((option) => {
      const optionElement = document.createElement('option');

      optionElement.textContent = option;
      select.appendChild(optionElement);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.setAttribute('name', field.name);
    input.setAttribute('type', field.type);
    input.setAttribute('data-qa', field.qa);

    label.appendChild(input);
  }

  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';
form.appendChild(submitButton);

document.body.appendChild(form);

const showNotification = (posTop, posRight, title, type) => {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');

  h2.innerText = title;
  h2.classList.add('title');
  notification.classList.add('notification', `${type}`);
  notification.setAttribute('data-qa', 'notification');
  notification.appendChild(h2);

  const page = document.body;

  page.insertAdjacentElement('afterbegin', notification);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  document
    .querySelectorAll(`[data-qa="notification"]`)
    .forEach((el) => el.remove());

  const newRow = document.createElement('tr');
  let isValid = true;

  fields.forEach((field) => {
    const value =
      field.type === 'select'
        ? form.querySelector(`select[name=${field.name}]`).value
        : form.querySelector(`input[name=${field.name}]`).value;

    if ((field.name === 'name' && value.length < 4) || value.trim() === ' ') {
      showNotification(
        20,
        20,
        'Error: Name must be at least 4 characters long.',
        'error',
      );
      isValid = false;
    }

    if (field.name === 'position' && value.trim() === '') {
      showNotification(
        20,
        20,
        'Error: Position cannot be empty or only spaces.',
        'error',
      );
      isValid = false;
    }

    if (!value) {
      showNotification(20, 20, 'Error: All fields must be filled.', 'error');
      isValid = false;
    }

    if (field.name === 'age' && (value < 18 || value > 90)) {
      showNotification(
        20,
        20,
        'Error: Age must be between 18 and 90.',
        'error',
      );
      isValid = false;
    }

    if (isValid) {
      const cell = document.createElement('td');

      if (field.name === 'salary') {
        cell.textContent = `$${parseFloat(value).toLocaleString('en-US')}`;
      } else {
        cell.textContent = value;
      }
      newRow.appendChild(cell);
    }
  });

  if (isValid) {
    table.querySelector('tbody').appendChild(newRow);
    form.reset();

    showNotification(
      20,
      20,
      'Success: Employee added to the table!',
      'success',
    );
  }
});

table.addEventListener('dblclick', (e) => {
  const target = e.target;

  if (target.tagName === 'TD' && currentEditingCell === null) {
    const originalText = target.textContent;
    const input = document.createElement('input');

    target.textContent = '';
    input.value = originalText;
    input.classList.add('cell-input');
    target.appendChild(input);
    input.focus();
    currentEditingCell = target;

    input.addEventListener('blur', () => {
      const newValue = input.value.trim() || originalText;

      target.textContent = newValue;
      currentEditingCell = null;
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        const newValue = input.value.trim() || originalText;

        target.textContent = newValue;
        currentEditingCell = null;
      }
    });
  }
});
