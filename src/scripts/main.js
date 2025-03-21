'use strict';

// write code here
const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');
const rows = table.querySelectorAll('tbody tr');
let asc = true;

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.appendChild(form);

const fields = [
  { label: 'Name:', name: 'name', type: 'text' },
  { label: 'Position:', name: 'position', type: 'text' },
  {
    label: 'Office:',
    name: 'office',
    type: 'select',
    options: [
      'Tokyo',
      'Signapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  { label: 'Age:', name: 'age', type: 'number' },
  { label: 'Salary:', name: 'salary', type: 'number' },
  { name: 'save', value: 'Save to table', type: 'submit' },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((optionText) => {
      const option = document.createElement('option');

      option.value = optionText;
      option.textContent = optionText;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  if (field.type !== 'select') {
    input.type = field.type;
  }

  if (field.type === 'submit') {
    input.value = field.value;
  }

  input.name = field.name;
  input.setAttribute('data-qa', field.name);

  label.appendChild(input);
  form.appendChild(label);
});

const pushNotification = (posTop, posRight, title, description, type) => {
  // write code here
  const message = document.createElement('div');
  const titleText = document.createElement('h2');
  const descriptionText = document.createElement('p');

  titleText.textContent = title;
  titleText.classList.add('title');

  descriptionText.textContent = description;

  message.style.position = 'absolute';
  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';
  message.classList.add('notification', type);
  message.appendChild(titleText);
  message.appendChild(descriptionText);
  message.setAttribute('data-qa', type);

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 10000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const nameValue = formData.get('name');

  if (nameValue.length < 4) {
    pushNotification(
      10,
      10,
      'Invalid name value',
      'Name must contain at least 4 letters',
      'error',
    );

    return;
  }

  const ageValue = Number(formData.get('age'));

  if (ageValue < 18 || ageValue > 90) {
    pushNotification(
      10,
      10,
      'Invalid age value',
      'Your age must be at least 18 and not more than 90',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');

  fields.forEach((field) => {
    const newCell = document.createElement('td');
    let value = formData.get(field.name);

    if (field.name === 'salary') {
      value = new Intl.NumberFormat().format(value);
      value = `$${value}`;
    }

    newCell.textContent = value;
    newRow.appendChild(newCell);
  });

  newRow.lastElementChild.remove();

  tbody.appendChild(newRow);

  pushNotification(
    10,
    10,
    'Success!',
    'User has been successfully added to the table.',
    'success',
  );
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rowsArray = Array.from(table.querySelectorAll('tbody tr'));

    const isNumeric = index === 3 || index === 4;

    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent;
      const cellB = rowB.cells[index].textContent;

      if (isNumeric) {
        const numA = parseFloat(cellA.replace(/[$,]/g, ''));
        const numB = parseFloat(cellB.replace(/[$,]/g, ''));

        return asc ? numA - numB : numB - numA;
      } else {
        return asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
      }
    });

    asc = !asc;

    tbody.innerHTML = '';
    rowsArray.forEach((row) => tbody.appendChild(row));
  });
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    const activeRows = table.querySelectorAll('tbody tr.active');

    if (activeRows.length > 0 && !row.classList.contains('active')) {
      return;
    }

    row.classList.toggle('active');
  });
});
