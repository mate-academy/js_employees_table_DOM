'use strict';
// write code here

const body = document.querySelector('body');
const trHeadList = document.querySelectorAll('thead > tr > th');
const tbody = document.querySelector('tbody');
let trListTable = Array.from(tbody.querySelectorAll('tr'));

// Sorting table
const sortOrder = {};

trHeadList.forEach((element) => {
  element.addEventListener('click', () => sortTable(element.cellIndex));
});

function sortTable(columnIndex) {
  trListTable = Array.from(tbody.querySelectorAll('tr'));

  sortOrder[columnIndex] = sortOrder[columnIndex] === 'asc' ? 'desc' : 'asc';

  const sortedRows = [...trListTable].sort((a, b) => {
    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();

    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
      const comparison = aText.localeCompare(bText);

      return sortOrder[columnIndex] === 'asc' ? comparison : -comparison;
    } else if (columnIndex === 3) {
      const comparison = Number(aText) - Number(bText);

      return sortOrder[columnIndex] === 'asc' ? comparison : -comparison;
    } else if (columnIndex === 4) {
      const newA = aText.replace(/[,$()]/g, '');
      const newB = bText.replace(/[,$()]/g, '');

      const comparison = Number(newA) - Number(newB);

      return sortOrder[columnIndex] === 'asc' ? comparison : -comparison;
    }
  });

  tbody.innerHTML = '';
  sortedRows.forEach((row) => tbody.appendChild(row));
}

// Selecting row
trListTable.forEach((element) => {
  element.addEventListener('click', () => {
    trListTable.forEach((row) => {
      if (row.classList.contains('active')) {
        row.classList.remove('active');
      }
    });
    element.classList.toggle('active');
  });
});

// Creating form
const form = document.createElement('form');

form.classList.add('new-employee-form');

trHeadList.forEach((element) => {
  const label = document.createElement('label');

  label.textContent = element.textContent + ':';

  const input = document.createElement('input');

  if (element.textContent === 'Office') {
    const select = document.createElement('select');

    select.setAttribute('name', element.textContent.toLocaleLowerCase);
    select.setAttribute('type', 'select');
    select.setAttribute('data-qa', element.textContent.toLocaleLowerCase);

    const officeTable = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    officeTable.forEach((town) => {
      const option = document.createElement('option');

      option.setAttribute('value', town);
      option.textContent = town;
      select.appendChild(option);
    });

    label.appendChild(select);
  } else if (
    element.textContent === 'Age' ||
    element.textContent === 'Salary'
  ) {
    input.setAttribute('name', element.textContent);
    input.setAttribute('type', 'number');
    input.setAttribute('data-qa', element.textContent);
    label.appendChild(input);
  } else {
    input.setAttribute('name', element.textContent);
    input.setAttribute('type', 'text');
    input.setAttribute('data-qa', element.textContent);
    label.appendChild(input);
  }
  form.appendChild(label);
});

const button = document.createElement('button');

button.setAttribute('type', 'button');
button.textContent = 'Save to table';
form.appendChild(button);
body.appendChild(form);

// Adding new Employee

button.addEventListener('click', () => {
  const inputList = document.querySelectorAll(
    'form > label > input, form > label > select',
  );
  let existingDiv = document.querySelector('div');

  if (existingDiv === null) {
    existingDiv = document.createElement('div');
  } else {
    existingDiv.parentElement.removeChild(existingDiv);
  }

  const tableRow = document.createElement('tr');
  let flagCheck = true;

  existingDiv.setAttribute('data-qa', 'notification');

  inputList.forEach((input) => {
    if (input.name === 'Name') {
      if (input.value.length < 4) {
        flagCheck = false;
        existingDiv.classList.add('error');
        existingDiv.textContent = 'ERROR: To short Name';
        body.appendChild(existingDiv);
      } else {
        const newTd = document.createElement('td');

        newTd.textContent = input.value;
        tableRow.appendChild(newTd);
      }
    } else if (input.name === 'Age') {
      if (parseInt(input.value) < 18 || parseInt(input.value) > 90) {
        flagCheck = false;
        existingDiv.classList.add('error');
        existingDiv.textContent = 'ERROR: Age is not between 18 and 90';
        body.appendChild(existingDiv);
      } else {
        const newTd = document.createElement('td');

        newTd.textContent = input.value;
        tableRow.appendChild(newTd);
      }
    } else if (input.name === 'Salary') {
      const newTd = document.createElement('td');
      const salary = Number(input.value);
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      const formattedSalary = formatter.format(salary);

      newTd.textContent = formattedSalary;
      tableRow.appendChild(newTd);
    } else {
      const newTd = document.createElement('td');

      newTd.textContent = input.value;
      tableRow.appendChild(newTd);
    }
  });

  if (flagCheck === true) {
    tbody.appendChild(tableRow);
    existingDiv.classList.add('success');
    existingDiv.textContent = 'Success adding new Employee';
    body.appendChild(existingDiv);
  }
});
