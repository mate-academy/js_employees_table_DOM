'use strict';

// отримую заголовки -- Array.from(document.querySelector('thead tr').children);
const body = document.querySelector('body'); // body
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const table = body.querySelector('table'); // table
let currentSortIndex = null;
let sortDirection = 'asc';

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

thead.addEventListener('click', (e) => {
  const tableHeader = e.target.closest('th');

  if (!tableHeader) {
    return;
  }

  // const tbody = document.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const cellIndex = tableHeader.cellIndex;

  // логіка напрямку--
  if (cellIndex === currentSortIndex) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortIndex = cellIndex;
    sortDirection = 'asc';
  }

  rows.sort((rowA, rowB) => {
    let result;

    // текстові колонки
    if (cellIndex === 0 || cellIndex === 1 || cellIndex === 2) {
      const valueA = rowA.children[cellIndex].textContent.trim();
      const valueB = rowB.children[cellIndex].textContent.trim();

      result = valueA.localeCompare(valueB);
    } else {
      const valueA = Number(
        rowA.children[cellIndex].textContent.replace(/[$,]/g, ''),
      );
      const valueB = Number(
        rowB.children[cellIndex].textContent.replace(/[$,]/g, ''),
      );

      result = valueA - valueB;
    }

    // застосування напрямку
    return sortDirection === 'asc' ? result : -result;
  });

  tbody.append(...rows);
});

// створюю форму ------------------------------------------
const forma = document.createElement('form');

table.after(forma);

forma.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name:',
    type: 'text',
    name: 'name',
    qa: 'name',
  },
  {
    label: 'Position:',
    type: 'text',
    name: 'position',
    qa: 'position',
  },
  {
    label: 'Office:',
    type: 'select',
    name: 'office',
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
    label: 'Age:',
    type: 'number',
    name: 'age',
    qa: 'age',
  },
  {
    label: 'Salary:',
    type: 'number',
    name: 'salary',
    qa: 'salary',
  },
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

  input.name = field.name;
  input.required = true;
  input.dataset.qa = field.qa;

  label.appendChild(input);
  forma.appendChild(label);
});

// створюю кнопку
const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'submit';
forma.appendChild(button);

console.log(forma);
console.log(forma.elements.name);

// =======================================================================
// віправка форми + валідація

forma.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputName = forma.elements.name.value;

  const inputPosition = forma.elements.position.value;

  const inputOffice = forma.elements.office.value;

  const inputAge = forma.elements.age.value;

  const inputSalary = forma.elements.salary.value;

  const row = document.createElement('tr');

  const tdName = document.createElement('td');

  tdName.textContent = inputName;

  const tdPosition = document.createElement('td');

  tdPosition.textContent = inputPosition;

  const tdOffice = document.createElement('td');

  tdOffice.textContent = inputOffice;

  const tdAge = document.createElement('td');

  tdAge.textContent = Number(inputAge);

  const tdSalary = document.createElement('td');

  const tdSalaryNumber = Number(inputSalary);

  const formattedSalary = new Intl.NumberFormat('en-US').format(tdSalaryNumber);

  tdSalary.textContent = `$${formattedSalary}`;

  row.appendChild(tdName);
  row.appendChild(tdPosition);
  row.appendChild(tdOffice);
  row.appendChild(tdAge);
  row.appendChild(tdSalary);

  tbody.appendChild(row);
});
