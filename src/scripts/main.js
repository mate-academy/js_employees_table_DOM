'use strict';

const form = document.createElement('form');

form.className = 'new-employee-form';
document.body.append(form);

const tbody = document.querySelector('tbody');
const buttonText = 'Save to table';

const labels = {
  name: 'Name:',
  position: 'Position:',
  office: 'Office:',
  age: 'Age:',
  salary: 'Salary:',
};

const inputs = ['name', 'position', 'office', 'age', 'salary'];

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// БЛОК СООБЩЕНИЙ

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');

  message.dataset.qa = 'notification';
  message.classList.add('notification', type);
  message.style.zIndex = '1000';

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;
  message.append(h2, p);
  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

function createField() {
  for (const input of inputs) {
    const label = document.createElement('label');
    const select = document.createElement('select');
    const inputfield = document.createElement('input');

    if (input === 'age' || input === 'salary') {
      inputfield.type = 'number';
    } else {
      inputfield.type = 'text';
    }

    if (input !== 'office') {
      inputfield.name = `${input}`;
      inputfield.dataset.qa = `${input}`;
      label.textContent = labels[input];
      label.append(inputfield);
      form.append(label);
    } else {
      label.textContent = `${input[0].toUpperCase() + input.slice(1)}:`;
      select.name = `${input}`;
      select.dataset.qa = `${input}`;

      for (const office of offices) {
        const option = document.createElement('option');

        option.value = office;
        option.textContent = `${office}`;
        select.append(option);
      }
      label.append(select);
      form.append(label);
    }
  }
}

createField();

const button = document.createElement('button');

button.textContent = buttonText;
form.append(button);

const formValues = {};

button.addEventListener('click', (e) => {
  e.preventDefault();
  formValues.name = form.querySelector('[data-qa="name"]').value;
  formValues.position = form.querySelector('[data-qa="position"]').value;
  formValues.office = form.querySelector('[data-qa="office"]').value;
  formValues.age = form.querySelector('[data-qa="age"]').value;
  formValues.salary = form.querySelector('[data-qa="salary"]').value;

  if (Object.values(formValues).includes('')) {
    pushNotification('Error!', 'All fields are required!', 'error');

    return;
  }

  if (formValues.name.length < 4) {
    pushNotification('Error!', 'Name must contain at least 4 letters', 'error');

    return;
  }

  if (formValues.age < 18 || formValues.age > 90) {
    pushNotification('Error!', 'Age must be between 18 and 90!', 'error');

    return;
  }

  const tr = document.createElement('tr');

  for (const key in formValues) {
    const td = document.createElement('td');

    if (key === 'salary') {
      td.textContent = `$${Number(formValues[key]).toLocaleString('en-US')}`;
    } else {
      td.textContent = formValues[key];
    }
    tr.append(td);
  }

  pushNotification('Success!', 'Employee successfully added!', 'success');

  tbody.append(tr);
  form.reset();
});

const headers = document.querySelectorAll('th');
let sortDirection = 'asc';
let currentColumn = null;

function getCellValue(row, index) {
  const value = row.cells[index].textContent;
  const headerText = headers[index].textContent.toLowerCase();

  if (headerText === 'age' || headerText === 'salary') {
    return Number(value.replaceAll('$', '').replaceAll(',', ''));
  }

  return value;
}

for (let i = 0; i < headers.length; i++) {
  const header = headers[i];

  header.addEventListener('click', function () {
    const rows = [...tbody.querySelectorAll('tr')];

    if (currentColumn !== i) {
      sortDirection = 'asc';
      currentColumn = i;
    }

    rows.sort(function (rowA, rowB) {
      const valueA = getCellValue(rowA, i);
      const valueB = getCellValue(rowB, i);

      if (typeof valueA === 'number') {
        return valueA - valueB;
      }

      return valueA.localeCompare(valueB);
    });

    if (sortDirection === 'desc') {
      rows.reverse();
    }

    for (const row of rows) {
      tbody.append(row);
    }

    if (sortDirection === 'asc') {
      sortDirection = 'desc';
    } else {
      sortDirection = 'asc';
    }
  });
}

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  if (tr.classList.contains('active')) {
    tr.classList.remove('active');

    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  tr.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  const initialValue = td.textContent;

  td.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;
  td.append(input);
  input.focus();

  function saveCell() {
    if (input.value === '') {
      td.textContent = initialValue;
    } else {
      td.textContent = input.value;
    }
  }

  input.addEventListener('blur', saveCell);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      saveCell();
    }
  });
});
