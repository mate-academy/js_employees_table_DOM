'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tBody = table.querySelector('tbody');
const rows = Array.from(table.querySelectorAll('tbody tr'));

// sorting

let sortDirections = Array(headers.length).fill(null);

headers.forEach((header, index) => {
  header.addEventListener('click', function () {
    if (sortDirections[index] === null || sortDirections[index] === false) {
      sortDirections = Array(headers.length).fill(null);
      sortDirections[index] = true;
    } else {
      sortDirections[index] = false;
    }

    sortTable(index, sortDirections[index]);
  });
});

function sortTable(index, asc) {
  rows.sort((a, b) => {
    const aText = a.querySelectorAll('td')[index].innerText.trim();
    const bText = b.querySelectorAll('td')[index].innerText.trim();

    if (index === 3 || index === 4) {
      const aNum = numValue(aText);
      const bNum = numValue(bText);

      return asc ? aNum - bNum : bNum - aNum;
    }

    return asc ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });

  tBody.innerHTML = '';
  rows.forEach((row) => tBody.appendChild(row));
}

function numValue(str) {
  let filteredStr = '';

  for (let i = 0; i < str.length; i++) {
    if (str[i] >= '0' || str[i] >= '9') {
      filteredStr += str[i];
    }
  }

  return parseFloat(filteredStr);
}

// selecting

rows.forEach((row) => {
  row.addEventListener('click', function () {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

// form for adding new employee

const addNewPersonForm = document.createElement('form');

addNewPersonForm.className = 'new-employee-form';

const fields = [
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
    label: 'Office',
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
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.innerText = `${field.label}`;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');
    input.name = field.name;
    input.setAttribute('data-qa', field.qa);

    field.options.forEach((optionText) => {
      const option = document.createElement('option');

      option.value = optionText;
      option.innerText = optionText;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');

    input.name = field.name;
    input.type = field.type;
    input.setAttribute('data-qa', field.qa);
  }

  input.required = true;
  label.appendChild(input);
  addNewPersonForm.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.innerText = 'Save to table';
submitButton.setAttribute('data-qa', 'submit-button');
addNewPersonForm.appendChild(submitButton);

document.body.appendChild(addNewPersonForm);

addNewPersonForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameIs = addNewPersonForm.elements['name'].value;
  const position = addNewPersonForm.elements['position'].value;
  const office = addNewPersonForm.elements['office'].value;
  const age = addNewPersonForm.elements['age'].value;
  const salary = addNewPersonForm.elements['salary'].value;

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameIs}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary}</td>
  `;

  tBody.appendChild(newRow);
  rows.push(newRow);

  newRow.addEventListener('click', function () {
    rows.forEach((r) => r.classList.remove('active'));
    newRow.classList.add('active');
  });

  addNewPersonForm.reset();
});
