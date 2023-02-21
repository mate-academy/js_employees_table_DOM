'use strict';

function numStr(string) {
  return +string.split('$').join('').split(',').join('');
}

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

let ASCsort = null;

function tableSort(column) {
  const sortedRows = Array.from(table.rows)
    .slice(1, table.rows.length - 1);

  if (isNaN(numStr(table.rows[1].children[column].textContent))) {
    sortedRows.sort((rowA, rowB) =>
      rowA.cells[column].innerHTML > rowB.cells[column].innerHTML ? 1 : -1
    );
  } else {
    sortedRows.sort((rowA, rowB) =>
      numStr(rowA.cells[column].innerHTML)
      < numStr(rowB.cells[column].innerHTML)
        ? 1
        : -1
    );
  }

  if (ASCsort === column) {
    table.tBodies[0].append(...sortedRows);
    ASCsort = null;
  } else {
    table.tBodies[0].append(...sortedRows.reverse());
    ASCsort = column;
  }
}

[...table.rows[0].children].forEach((column, index) =>
  column.addEventListener('click', e => {
    tableSort(index);
  }));
// sorting by click

tbody.addEventListener('click', (e) => {
  const item = e.target;

  [...tbody.children].forEach(row => row.classList.remove('active'));

  item.closest('tr').className = 'active';
});
// make row active

const form = document.createElement('form');

form.className = ('new-employee-form');

const labels = ['name', 'position', 'age', 'salary'];

// add inputs
labels.forEach(element => {
  const attribute = element;
  const labelsName = element[0].toUpperCase() + element.slice(1) + ':';

  const label = document.createElement('label');

  label.innerHTML = labelsName;

  const input = document.createElement('input');

  input.setAttribute('data-qa', attribute);
  input.setAttribute('type', 'text');
  input.setAttribute('name', attribute);
  input.id = attribute;
  input.required = true;

  label.append(input);

  return form.append(label);
});

const labelOffice = document.createElement('label');

labelOffice.innerHTML = 'Office:';

const selectOffice = document.createElement('select');

selectOffice.setAttribute('data-qa', 'office');
selectOffice.setAttribute('name', 'office');
selectOffice.required = true;

const officeOptions
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco'];

officeOptions.forEach((variable, index) => {
  const option = document.createElement('option');

  option.innerText = variable;
  option.setAttribute('value', index);

  selectOffice.append(option);
});

labelOffice.append(selectOffice);
form.insertBefore(labelOffice, form.children[2]);

const button = document.createElement('button');

button.innerText = 'Save to table';
button.setAttribute('type', 'submit');

form.append(button);
document.body.append(form);

const inputAge = document.getElementById('age');
const inputSalary = document.getElementById('salary');

inputAge.setAttribute('type', 'number');
inputSalary.setAttribute('type', 'number');

form.addEventListener(
  'submit',
  (e) => {
    const formData = new FormData(form);

    const toAdd = {
      name: formData.get('name'),
      position: formData.get('position'),
      office: formData.get('office'),
      age: formData.get('age'),
      salary: '$' + formData.get('salary'),
    };

    tbody.insertAdjacentHTML('beforeend', `<tr><td> ${toAdd.name} </td></tr>`);
  },
);
