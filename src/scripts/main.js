'use strict';

// write code here

const table = document.querySelector('table');
const tBody = document.querySelector('tbody');
const tableHead = table.querySelector('thead');
let clickCounter = 0;
let currentSortColumn = null;
let selectedRow = document.querySelector('tr.active');

tableHead.addEventListener('click', (clickEvent) => {
  if (clickEvent.target.tagName === 'TH') {
    const columnIndex = clickEvent.target.cellIndex;
    const tableRows = Array.from(tBody.rows);

    if (currentSortColumn === clickEvent.target.cellIndex) {
      if (clickCounter === 0) {
        clickCounter++;
      } else {
        clickCounter = 0;
      }
    } else {
      currentSortColumn = clickEvent.target.cellIndex;
      clickCounter = 0;
    }

    tableRows.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent;
      const valueB = b.cells[columnIndex].textContent;
      const checkValueA = valueA.replace(/[^\d.]/g, '');
      const checkValueB = valueB.replace(/[^\d.]/g, '');

      if (checkValueA !== '' && !isNaN(checkValueA)) {
        if (clickCounter === 0) {
          return checkValueA - checkValueB;
        } else {
          return checkValueB - checkValueA;
        }
      } else {
        if (clickCounter === 0) {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      }
    });

    for (const row of tableRows) {
      tBody.append(row);
    }
  }
});

tBody.addEventListener('click', (clickEvent) => {
  if (clickEvent.target.tagName === 'TD') {
    const rowSelect = clickEvent.target.parentElement;

    if (rowSelect !== selectedRow) {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      rowSelect.classList.add('active');
      selectedRow = rowSelect;
    }
  }
});

const form = document.createElement('form');

form.noValidate = true;

form.className = 'new-employee-form';

document.querySelector('body').append(form);

const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');
const inputOffice = document.createElement('select');
const submitButton = document.createElement('button');

inputName.name = 'name';
inputPosition.name = 'position';
inputAge.name = 'age';
inputSalary.name = 'salary';
inputOffice.name = 'office';

inputName.type = 'text';
inputPosition.type = 'text';
inputAge.type = 'number';
inputSalary.type = 'number';

inputName.required = true;
inputPosition.required = true;
inputAge.required = true;
inputSalary.required = true;
inputOffice.required = true;

inputName.dataset.qa = 'name';
inputPosition.dataset.qa = 'position';
inputOffice.dataset.qa = 'office';
inputAge.dataset.qa = 'age';
inputSalary.dataset.qa = 'salary';

const nameLabel = document.createElement('label');
const positionLabel = document.createElement('label');
const ageLabel = document.createElement('label');
const salaryLabel = document.createElement('label');
const officeLabel = document.createElement('label');

nameLabel.appendChild(inputName);
positionLabel.appendChild(inputPosition);
ageLabel.appendChild(inputAge);
salaryLabel.appendChild(inputSalary);
officeLabel.appendChild(inputOffice);

form.append(nameLabel);
form.append(positionLabel);
form.append(ageLabel);
form.append(salaryLabel);
form.append(officeLabel);
form.append(submitButton);

const offices = [
  { text: 'Tokyo', value: 'Tokyo' },
  { text: 'Singapore', value: 'Singapore' },
  { text: 'London', value: 'London' },
  { text: 'New York', value: 'New York' },
  { text: 'Edinburgh', value: 'Edinburgh' },
  { text: 'San Francisco', value: 'San Francisco' },
];

offices.forEach(({ text, value }) => {
  inputOffice.add(new Option(text, value));
});

nameLabel.prepend('Name: ');
positionLabel.prepend('Position: ');
officeLabel.prepend('Office: ');
ageLabel.prepend('Age: ');
salaryLabel.prepend('Salary: ');
submitButton.prepend('Save to table');

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  const newRow = document.createElement('tr');

  if (
    inputName.value.trim().length < 4 ||
    Number(inputAge.value) < 18 ||
    Number(inputAge.value) > 90 ||
    inputPosition.value.trim() === '' ||
    isNaN(Number(inputAge.value)) ||
    isNaN(Number(inputSalary.value)) ||
    inputSalary.value === ''
  ) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.className = 'error';
    error.textContent = 'Unsuccesful registration!';
    document.body.append(error);

    setTimeout(() => {
      error.remove();
    }, 3000);

    return;
  }

  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  newName.textContent = inputName.value.trim();
  newPosition.textContent = inputPosition.value;
  newOffice.textContent = inputOffice.value;
  newAge.textContent = Number(inputAge.value);
  newSalary.textContent = `$${Number(inputSalary.value).toLocaleString('en-US')}`;

  newRow.append(newName);
  newRow.append(newPosition);
  newRow.append(newOffice);
  newRow.append(newAge);
  newRow.append(newSalary);
  tBody.append(newRow);

  const success = document.createElement('div');

  success.dataset.qa = 'notification';
  success.classList.add('success');
  success.textContent = 'Sucessful registration!';
  document.body.append(success);
  form.reset();

  setTimeout(() => {
    success.remove();
  }, 3000);
});

let previousText = '';

tBody.addEventListener('dblclick', (dblClickEvent) => {
  if (tBody.querySelector('.cell-input')) {
    return;
  }

  if (dblClickEvent.target.tagName === 'TD') {
    const cellEdit = dblClickEvent.target;

    previousText = cellEdit.textContent;
    cellEdit.textContent = '';

    const newCellInput = document.createElement('input');

    cellEdit.append(newCellInput);
    newCellInput.className = 'cell-input';
    newCellInput.value = previousText;
    newCellInput.focus();

    newCellInput.addEventListener('blur', (blurEvent) => {
      if (blurEvent.target.className === 'cell-input') {
        if (newCellInput.value.length > 0) {
          cellEdit.textContent = newCellInput.value;
        } else {
          cellEdit.textContent = previousText;
        }
      }
    });

    newCellInput.addEventListener('keydown', (key) => {
      if (key.key === 'Enter') {
        if (newCellInput.value.length > 0) {
          cellEdit.textContent = newCellInput.value;
        } else {
          cellEdit.textContent = previousText;
        }
      }
    });
  }
});
