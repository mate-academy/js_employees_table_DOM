'use strict';

const body = document.querySelector('body');

let headers, tbody, rows;

const init = () => {
  headers = [...body.querySelectorAll('th')];
  tbody = body.querySelector('tbody');
  rows = [...tbody.querySelectorAll('tr')];
};

init();

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

      const checkNumberCellA = strToNumber(cellA);
      const checkNumberCellB = strToNumber(cellB);

      if (Number(checkNumberCellA)) {
        return ASC
          ? checkNumberCellA - checkNumberCellB
          : checkNumberCellB - checkNumberCellA;
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

const strToNumber = (n) => Number(n.replace(/[^0-9.-]+/g, ''));

// Add new employee form

const createForm = (fields) => {
  const formEl = document.createElement('form');

  formEl.classList.add('new-employee-form');

  for (const key in fields) {
    if (fields[key]) {
      const label = document.createElement('label');

      label.textContent = `${fields[key].label}: `;

      let field = document.createElement('input');

      if (fields[key].hasOwnProperty('options')) {
        field = document.createElement('select');

        for (const option of fields[key].options) {
          const optionEl = document.createElement('option');

          optionEl.value = option;
          optionEl.textContent = option;
          field.appendChild(optionEl);
        }
      }

      label.appendChild(field);

      field.setAttribute('name', fields[key].name);
      field.setAttribute('type', fields[key].type);
      field.setAttribute('data-qa', fields[key]['data-qa']);
      field.setAttribute('min', fields[key].validation?.min);
      field.setAttribute('max', fields[key].validation?.max);
      field.setAttribute('minlength', fields[key].validation?.minLength);
      field.setAttribute('required', true);
      formEl.appendChild(label);
    }
  }

  return formEl;
};

const showNotification = (type, message) => {
  const notification = document.createElement('div');

  notification.innerHTML = `<h2 class='title'>${message}</h2>`;

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

const createRow = (employee) => {
  const row = document.createElement('tr');

  for (const key in employee) {
    const cell = document.createElement('td');

    cell.textContent = employee[key];
    row.appendChild(cell);
  }

  tbody.appendChild(row);
};

const submitHandler = (e) => {
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

  createRow(employee);

  showNotification('success', 'Employee added successfully');

  init();

  form.reset();
};

const createSubmitButton = () => {
  const submit = document.createElement('button');

  submit.setAttribute('type', 'submit');
  submit.setAttribute('form', 'new-employee-form');
  submit.addEventListener('click', submitHandler);

  submit.textContent = 'Save to table';

  return submit;
};

const form = createForm(formFields);

const submitBtn = createSubmitButton();

form.appendChild(submitBtn);

body.appendChild(form);
