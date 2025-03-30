'use strict';

const body = document.querySelector('body');
const headers = document.querySelectorAll('thead tr');
const rows = document.querySelectorAll('tbody tr');
const rowsArray = Array.from(rows);
let currentSortColumn = -1;
let ascending = true;
let currentRow = -1;

function addEmployeeForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  const nameLabel = document.createElement('label');

  nameLabel.innerHTML = 'Name: ';

  const nameInput = document.createElement('input');

  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.setAttribute('data-qa', 'name');
  nameInput.required = true;
  nameLabel.appendChild(nameInput);
  form.appendChild(nameLabel);

  const positionLabel = document.createElement('label');

  positionLabel.innerHTML = 'Position: ';

  const positionInput = document.createElement('input');

  positionInput.type = 'text';
  positionInput.name = 'position';
  positionInput.setAttribute('data-qa', 'position');
  positionInput.required = true;
  positionLabel.appendChild(positionInput);
  form.appendChild(positionLabel);

  const officeLabel = document.createElement('label');

  officeLabel.innerHTML = 'Office: ';

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.setAttribute('data-qa', 'office');
  officeSelect.required = true;

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  offices.forEach((office) => {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;
    officeSelect.appendChild(option);
  });

  officeLabel.appendChild(officeSelect);
  form.appendChild(officeLabel);

  const ageLabel = document.createElement('label');

  ageLabel.innerHTML = 'Age: ';

  const ageInput = document.createElement('input');

  ageInput.type = 'number';
  ageInput.name = 'age';
  ageInput.setAttribute('data-qa', 'age');
  ageInput.required = true;
  ageLabel.appendChild(ageInput);
  form.appendChild(ageLabel);

  const salaryLabel = document.createElement('label');

  salaryLabel.innerHTML = 'Salary: ';

  const salaryInput = document.createElement('input');

  salaryInput.type = 'number';
  salaryInput.name = 'salary';
  salaryInput.setAttribute('data-qa', 'salary');
  salaryInput.required = true;
  salaryLabel.appendChild(salaryInput);
  form.appendChild(salaryLabel);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = nameInput.value;
    const position = positionInput.value;
    const office = officeSelect.value;
    const age = parseInt(ageInput.value, 10);
    const salary = parseInt(salaryInput.value, 10);

    const formattedSalary = '$' + salary.toLocaleString();

    const newRow = document.createElement('tr');

    const cells = [name, position, office, age, formattedSalary];

    cells.forEach((cellText) => {
      const cell = document.createElement('td');

      cell.textContent = cellText;
      newRow.appendChild(cell);
    });

    const tbody = document.querySelector('tbody');

    tbody.appendChild(newRow);

    const newIndex = rowsArray.length;

    rowsArray.push(newRow);

    newRow.addEventListener('click', (event) =>
      clickHandlerRow(event, newIndex),
    );
    form.reset();
  });

  document.body.appendChild(form);
}
addEmployeeForm();

for (const header of headers) {
  header.addEventListener('click', clickHandlerHeader);
}

rowsArray.forEach((row, index) => {
  row.addEventListener('click', (event) => clickHandlerRow(event, index));
});

function clickHandlerRow(event, index) {
  const rowIndex = index;

  if (currentRow >= 0) {
    rowsArray[currentRow].classList.remove('active');
  }

  if (currentRow === rowIndex) {
    currentRow = -1;
  } else {
    rowsArray[rowIndex].classList.add('active');
    currentRow = rowIndex;
  }
}

function clickHandlerHeader(event) {
  const columnIndex = event.target.cellIndex;

  if (currentSortColumn === columnIndex) {
    ascending = !ascending;
  } else {
    ascending = true;
    currentSortColumn = columnIndex;
  }

  sortTable(columnIndex, ascending);
}

function sortTable(columnIndex, ascending) {
  rowsArray.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex];
    const cellB = rowB.cells[columnIndex];

    const textA = cellA.textContent.trim();
    const textB = cellB.textContent.trim();

    const numA = Number(textA.replace(/[$,]/g, ''));
    const numB = Number(textB.replace(/[$,]/g, ''));
    // console.log(numA, numB);

    const isNumA = !isNaN(numA);
    const isNumB = !isNaN(numB);

    let result;

    if (isNumA && isNumB) {
      result = numA - numB;
    } else {
      result = textA.localeCompare(textB);
    }

    return ascending ? result : -result;
  });

  rowsArray.forEach((row, index) => {
    row.parentNode.appendChild(row);
    row.removeEventListener('click', (event) => clickHandlerRow(event, index));
    row.addEventListener('click', (event) => clickHandlerRow(event, index));
  });
}
