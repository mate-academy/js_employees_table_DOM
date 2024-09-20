'use strict';

const table = document.querySelector('table');
const tableHeaders = [...table.tHead.rows[0].cells];
const tableBody = table.tBodies[0];

const body = document.querySelector('body');

const fields = ['name', 'position', 'office', 'age', 'salary'];
const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// table sorting by clicking on the title
tableHeaders.forEach((header, index) => {
  let isReversed = false;

  header.addEventListener('click', () => {
    sortTable(tableBody, index, isReversed);
    isReversed = !isReversed;
  });
});

// when user clicks on a row, it should become selected
let selectedRowIndex = -1;

table.addEventListener('click', (clickOnRowEvent) => {
  const row = clickOnRowEvent.target.closest('tr');

  if (row && row.parentNode.tagName === 'TBODY') {
    row.classList.toggle('active');

    if (selectedRowIndex !== -1 && selectedRowIndex !== row.rowIndex - 1) {
      const previousRow = table.querySelector(
        `tbody tr:nth-child(${selectedRowIndex + 1}`,
      );

      previousRow.classList.remove('active');
    }

    selectedRowIndex = row.rowIndex - 1;
  }
});

// form for adding new employees to the spreadsheet
const form = document.createElement('form');
const saveToTableButton = document.createElement('button');

form.className = 'new-employee-form';
body.appendChild(form);

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field[0].toLocaleUpperCase() + field.slice(1) + ': ';

  if (field === 'office') {
    const select = document.createElement('select');

    select.setAttribute('name', field);
    select.dataset.qa = field;
    select.required = true;

    for (const option of options) {
      const opt = document.createElement('option');

      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    }

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.setAttribute('name', field);
    input.dataset.qa = field;
    input.required = true;

    if (field === 'age' || field === 'salary') {
      input.setAttribute('type', 'number');
    } else {
      input.setAttribute('type', 'text');
    }

    label.appendChild(input);
  }

  form.appendChild(label);
});

saveToTableButton.setAttribute('type', 'submit');
saveToTableButton.textContent = 'Save to table';

saveToTableButton.addEventListener('click', (buttonSubmitEvent) => {
  buttonSubmitEvent.preventDefault();

  if (validateForm(form)) {
    addDataFromForm(form, tableBody);
    clearForm(form, options);
  }
});

form.appendChild(saveToTableButton);

// editing of table cells by double-clicking on it
let cellInEdit = false;

table.addEventListener('dblclick', (dbclickOnCell) => {
  const cell = dbclickOnCell.target.closest('td');

  if (cell && !cellInEdit) {
    cellInEdit = true;

    if (!cell.dataset.initialValue) {
      cell.dataset.initialValue = cell.textContent.trim();
    }

    const initialValue = cell.dataset.initialValue;

    const input = document.createElement('input');

    input.className = 'cell-input';
    cell.textContent = '';
    cell.appendChild(input);

    input.onblur = () => {
      cell.textContent = input.value.trim() || initialValue;
      cellInEdit = false;
    };

    input.addEventListener('keypress', (submitChangesEvent) => {
      if (submitChangesEvent.key === 'Enter') {
        cell.textContent = input.value.trim() || initialValue;
        cellInEdit = false;
      }
    });
  }
});

// functions
function convertToNumber(string) {
  return Number(string.replace(/[^0-9]+/g, ''));
}

function sortTable(tbody, columnIndex, isReversed) {
  const rows = [...tbody.rows];

  const sortedRows = rows.sort((row1, row2) => {
    const cell1 = row1.cells[columnIndex].textContent.trim();
    const cell2 = row2.cells[columnIndex].textContent.trim();

    if (convertToNumber(cell1)) {
      return convertToNumber(cell1) - convertToNumber(cell2);
    } else {
      return cell1.localeCompare(cell2);
    }
  });

  if (isReversed) {
    sortedRows.reverse();
  }

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  sortedRows.forEach((row) => tbody.appendChild(row));
}

function validateForm(currentForm) {
  const POS_RIGHT_VALUE = 10;
  const POS_TOP_VALUE = 10;

  const inputs = [...currentForm.querySelectorAll('input')];

  for (const input of inputs) {
    if (input.value === '') {
      pushNotification(
        POS_TOP_VALUE,
        POS_RIGHT_VALUE,
        'Error',
        `${input.getAttribute('name')} is empty`,
        'error',
      );

      return false;
    }

    if (input.getAttribute('name') === 'name' && input.value.length < 4) {
      pushNotification(
        POS_TOP_VALUE,
        POS_RIGHT_VALUE,
        'Error',
        'Name should have at least 4 letters',
        'error',
      );

      return false;
    }

    if (
      input.getAttribute('name') === 'age' &&
      (input.value < 18 || input.value >= 90)
    ) {
      pushNotification(
        POS_TOP_VALUE,
        POS_RIGHT_VALUE,
        'Error',
        'Age should be between 18 and 90',
        'error',
      );

      return false;
    }
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  titleElement.className = 'title';

  notification.append(titleElement, descriptionElement);
  titleElement.textContent = title;
  descriptionElement.textContent = description;

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
}

function clearForm(currentForm, currentOptions) {
  const inputs = [...currentForm.querySelectorAll('input')];

  inputs.forEach((input) => (input.value = ''));

  currentForm.querySelector('select').value = currentOptions[0];
}

function addDataFromForm(currentForm, tbody) {
  const newRow = document.createElement('tr');
  const nameCell = newRow.insertCell(-1);
  const positionCell = newRow.insertCell(-1);
  const officeCell = newRow.insertCell(-1);
  const ageCell = newRow.insertCell(-1);
  const salaryCell = newRow.insertCell(-1);

  nameCell.textContent = currentForm.querySelector('input[name=name]').value;

  positionCell.textContent = currentForm.querySelector(
    'input[name=position]',
  ).value;

  officeCell.textContent = currentForm.querySelector('select').value;
  ageCell.textContent = currentForm.querySelector('input[name=age]').value;

  salaryCell.textContent =
    '$' +
    Number(
      currentForm.querySelector('input[name=salary]').value,
    ).toLocaleString('en-US');

  newRow.appendChild(nameCell);
  newRow.appendChild(positionCell);
  newRow.appendChild(officeCell);
  newRow.appendChild(ageCell);
  newRow.appendChild(salaryCell);
  tbody.appendChild(newRow);
}
