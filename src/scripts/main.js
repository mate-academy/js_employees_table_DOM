'use strict';

const body = document.querySelector('body');

let table = document.querySelector('table');
let headers = [...table.querySelectorAll('th')];
let tbody = table.querySelector('tbody');
let rows = [...tbody.querySelectorAll('tr')];

const init = () => {
  table = document.querySelector('table');
  headers = [...table.querySelectorAll('th')];
  tbody = table.querySelector('tbody');
  rows = [...tbody.querySelectorAll('tr')];
};

const currencyFormat = (number) =>
  '$' + new Intl.NumberFormat('en-US').format(number);

// Add active class to row when clicked

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.toggle('active');
  });
});

let ASC = true;
let currentHeader;

// Sort table by column
headers.forEach((header, i) => {
  header.addEventListener('click', (e) => {
    ASC = !ASC;

    if (currentHeader !== i) {
      ASC = true;
    }
    currentHeader = i;

    rows.sort((a, b) => {
      const cellA = a.querySelectorAll('td')[i].textContent;
      const cellB = b.querySelectorAll('td')[i].textContent;

      if (Number(numberFormat(cellA))) {
        return ASC
          ? numberFormat(cellA) - numberFormat(cellB)
          : numberFormat(cellB) - numberFormat(cellA);
      }

      return ASC ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

const formFields = {
  name: {
    label: 'Name',
    name: 'name',
    type: 'text',
    'data-qa': 'name',
    validation: {
      minLength: 4,
    },
  },
  position: {
    label: 'Position',
    name: 'position',
    type: 'text',
    'data-qa': 'position',
  },
  office: {
    label: 'Office',
    name: 'office',
    'data-qa': 'office',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  age: {
    label: 'Age',
    name: 'age',
    type: 'number',
    'data-qa': 'age',
    validation: {
      min: 18,
      max: 90,
    },
  },
  salary: {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    'data-qa': 'salary',
  },
  startDate: '',
};

const numberFormat = (n) => Number(n.replace(/[^0-9.-]+/g, ''));

// Add new employee form

const form = document.createElement('form');

form.classList.add('new-employee-form');

for (const key in formFields) {
  if (formFields[key]) {
    const label = document.createElement('label');

    label.textContent = `${formFields[key].label}: `;

    let field = document.createElement('input');

    if (formFields[key].hasOwnProperty('options')) {
      field = document.createElement('select');

      for (const option of formFields[key].options) {
        const optionEl = document.createElement('option');

        optionEl.value = option;
        optionEl.textContent = option;
        field.appendChild(optionEl);
      }
    }

    label.appendChild(field);

    field.setAttribute('name', formFields[key].name);
    field.setAttribute('type', formFields[key].type);
    field.setAttribute('data-qa', formFields[key]['data-qa']);
    field.setAttribute('min', formFields[key].validation?.min);
    field.setAttribute('max', formFields[key].validation?.max);
    field.setAttribute('minlength', formFields[key].validation?.minLength);
    field.setAttribute('required', true);
    form.appendChild(label);
  }
}

const showNotification = (type, message) => {
  const notification = document.createElement('div');

  notification.innerHTML = `<h2 class='title'>${message}</h2>`;

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
};

const submitHandler = (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    showNotification('error', 'Error: Form is not valid');

    return;
  }

  const formData = new FormData(form);
  const employee = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'salary') {
      employee[key] = currencyFormat(value);
      continue;
    }
    employee[key] = value;
  }

  const row = document.createElement('tr');

  for (const key in employee) {
    const cell = document.createElement('td');

    cell.textContent = employee[key];
    row.appendChild(cell);
  }

  showNotification('success', 'Employee added successfully');

  tbody.appendChild(row);
  init();

  form.reset();
};

const submit = document.createElement('button');

submit.setAttribute('type', 'submit');
submit.setAttribute('form', 'new-employee-form');
submit.addEventListener('click', submitHandler);

submit.textContent = 'Save to table';
form.appendChild(submit);

body.appendChild(form);
