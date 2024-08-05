'use strict';

// const table = document.querySelector('table');
const theads = document.querySelectorAll('th');
const tbody = document.querySelector('table tbody');

let sortOrder = 1;
let lastColumnIndex = -1;

function sortColumns(index) {
  const trArr = [...tbody.querySelectorAll('tr')];

  if (lastColumnIndex !== index) {
    sortOrder = 1;
  } else {
    sortOrder *= -1;
  }

  trArr.sort((a, b) => {
    const trA = a.cells[index].textContent;
    const trB = b.cells[index].textContent;

    if (!isNaN(trA) && !isNaN(trB)) {
      return sortOrder * (parseFloat(trA) - parseFloat(trB));
    } else {
      return sortOrder * trA.localeCompare(trB, 'en', { numeric: true });
    }
  });

  tbody.innerHTML = '';
  trArr.forEach((tr) => tbody.append(tr));

  lastColumnIndex = index;
}

theads.forEach((thead, index) => {
  thead.addEventListener('click', () => {
    sortColumns(index);
  });
});

tbody.addEventListener('click', (e) => {
  const trRows = document.querySelectorAll('tbody tr');

  trRows.forEach((trRow) => {
    trRow.classList.remove('active');
  });

  const clickRow = e.target.closest('tr');

  if (clickRow) {
    clickRow.classList.add('active');
  }
});

//* Form
const form = document.createElement('form');

form.className = 'new-employee-form';
document.body.append(form);

const fealds = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Office',
    name: ' office',
    type: 'select',
    qa: 'office',
    options: [
      'Select an office',
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fealds.forEach((feald) => {
  const label = document.createElement('label');

  label.textContent = feald.label + ': ';

  let input = document.createElement('input');

  if (feald.type === 'select') {
    input = document.createElement('select');

    feald.options.forEach((option) => {
      const optionElement = document.createElement('option');

      optionElement.value = option;
      optionElement.textContent = option;
      input.appendChild(optionElement);
    });
  } else {
    input = document.createElement('input');
    input.type = feald.type;
  }

  input.name = feald.name;
  input.setAttribute('data-qa', feald.qa);
  input.required = true;
  label.appendChild(input);
  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.append(submitButton);
