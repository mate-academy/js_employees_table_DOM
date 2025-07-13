'use strict';

// write code here
const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
const sortState = {
  header: '',
  direction: 'asc',
};

function updateSortState(newHeader) {
  if (sortState.header === newHeader && sortState.direction === 'asc') {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.header = newHeader;
    sortState.direction = 'asc';
  }
}

/* eslint-disable */

function sortByHeader(dataToSort, sortBy, direction) {
  let sorted;

  switch (sortBy) {
    case 'name':
      sorted = [...dataToSort].sort((a, b) =>
        a.value?.toLowerCase().localeCompare(b.value?.toLowerCase()),
      );
      break;

    case 'position':
      sorted = [...dataToSort].sort((a, b) =>
        a.value?.toLowerCase().localeCompare(b.value?.toLowerCase()),
      );
      break;

    case 'office':
      sorted = [...dataToSort].sort((a, b) =>
        a.value?.toLowerCase().localeCompare(b.value?.toLowerCase()),
      );
      break;

    case 'age':
      sorted = [...dataToSort].sort((a, b) => +a.value - +b.value);
      break;

    case 'salary':
      sorted = [...dataToSort]
        .map((n) => ({
          value: Number(String(n.value).replace(/[^0-9.-]+/g, '')),
          row: n.row,
        }))
        .sort((a, b) => a.value - b.value);
      break;

    default:
      sorted = dataToSort;
  }

  return direction === 'asc' ? sorted : sorted.reverse();
}

/* eslint-enable */

function renderSortedRows(sortedData) {
  tbody.innerHTML = '';

  for (const row of sortedData) {
    tbody.append(row.row);
  }
}

Array.from(thead.rows[0].cells).forEach((cell, i) => {
  cell.addEventListener('click', () => {
    const sortedKey = cell.textContent.trim().toLowerCase();
    const dataToSort = [...tbody.rows].map((row) => ({
      value: row.cells[i].textContent,
      row,
    }));

    updateSortState(sortedKey);

    const sorted = sortByHeader(dataToSort, sortedKey, sortState.direction);

    renderSortedRows(sorted);
  });
});

function setRowActive(rowToActive) {
  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  const row = rowToActive.closest('tr');

  if (!row) {
    return;
  }

  row.classList.add('active');
}

tbody.addEventListener('click', (e) => setRowActive(e.target));

function makeInputLabel(newName, type) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const rightTextContent = `${newName[0].toUpperCase() + newName.slice(1, newName.length)}: `;

  label.textContent = rightTextContent;
  input.name = newName;
  input.type = type;
  input.setAttribute('data-qa', newName);
  input.required = true;

  label.append(input);

  return label;
}

function makeSelectLabel(newName, options) {
  const label = document.createElement('label');
  const select = document.createElement('select');
  const rightTextContent = `${newName[0].toUpperCase() + newName.slice(1, newName.length)}: `;

  label.textContent = rightTextContent;
  select.name = newName;
  select.setAttribute('data-qa', newName);

  for (const opt of options) {
    const option = document.createElement('option');

    option.textContent = opt;
    option.value = opt;

    select.append(option);
  }

  label.append(select);

  return label;
}

function createNewCell(newName) {
  const newCell = document.createElement('td');

  newCell.textContent = newName;

  return newCell;
}

function makeRightSalary(newSalary) {
  const str = String(newSalary).split('').reverse();
  const rightSalary = [];

  for (let i = 0; i <= str.length - 1; i++) {
    if (i % 3 === 0 && i !== 0) {
      rightSalary.push(',');
    }

    rightSalary.push(str[i]);
  }

  return `$${rightSalary.reverse().join('')}`;
}

function showNotification(
  titleNotification,
  messageNotification,
  typeOfNotification,
) {
  const notificationContainer = document.createElement('div');
  const title = document.createElement('h2');
  const message = document.createElement('p');

  title.className = 'title';
  title.textContent = titleNotification;
  message.textContent = messageNotification;
  notificationContainer.append(title, message);
  notificationContainer.setAttribute('data-qa', 'notification');

  notificationContainer.className = 'notification';

  if (typeOfNotification) {
    notificationContainer.classList.add(typeOfNotification);
  }

  document.body.append(notificationContainer);

  setTimeout(() => {
    notificationContainer.style.visibility = 'hidden';
  }, 2000);
}

function validateData(typeOfData, dataToCheck) {
  switch (typeOfData) {
    case 'name':
      if (dataToCheck.length < 4) {
        showNotification(
          'Invalid Name',
          'Name must have at least 4 letters',
          'error',
        );

        return false;
      }
      break;

    case 'position':
      if (dataToCheck.length < 4) {
        showNotification(
          'Invalid Position',
          'Position must have at least 4 letters',
          'error',
        );

        return false;
      }
      break;

    case 'age':
      if (+dataToCheck < 18 || +dataToCheck > 90) {
        showNotification(
          'Invalid Age',
          'Age must be between 18 and 90',
          'error',
        );

        return false;
      }
      break;

    default:
      break;
  }

  return true;
}

function addNewEmployee() {
  const form = document.querySelector('.new-employee-form');
  const newRow = document.createElement('tr');
  const nameToAdd = form.elements['name'].value;
  const positionToAdd = form.elements['position'].value;
  const officeToAdd = form.elements['office'].value;
  const ageToAdd = form.elements['age'].value;
  const salaryToAdd = form.elements['salary'].value;

  if (
    !validateData('name', nameToAdd) ||
    !validateData('position', positionToAdd) ||
    !validateData('age', ageToAdd)
  ) {
    return;
  }

  showNotification(
    'Congratulations!!!',
    'Employee is successfully added to the table',
    'success',
  );

  newRow.append(createNewCell(nameToAdd));
  newRow.append(createNewCell(positionToAdd));
  newRow.append(createNewCell(officeToAdd));
  newRow.append(createNewCell(ageToAdd));
  newRow.append(createNewCell(makeRightSalary(salaryToAdd)));

  tbody.append(newRow);
}

function addForm() {
  const form = document.createElement('form');
  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.type = 'submit';

  button.addEventListener('click', (e) => {
    e.preventDefault();
    addNewEmployee();
  });

  const officeOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.append(makeInputLabel('name', 'text'));
  form.append(makeInputLabel('position', 'text'));
  form.append(makeSelectLabel('office', officeOptions));
  form.append(makeInputLabel('age', 'number'));
  form.append(makeInputLabel('salary', 'number'));
  form.append(button);

  form.classList.add('new-employee-form');

  document.body.append(form);
}

addForm();

let currentEditingCell = null;

function enableEditingCell(cellToEdit) {
  if (currentEditingCell) {
    currentEditingCell.blur();

    return;
  }

  const closestCell = cellToEdit.closest('td');

  if (!closestCell) {
    return;
  }

  if (closestCell.querySelector('input')) {
    return;
  }

  const newInput = document.createElement('input');

  newInput.classList.add('cell-input');

  const currentValue = closestCell.textContent;

  newInput.value = currentValue;

  closestCell.textContent = '';
  closestCell.append(newInput);
  newInput.focus();

  currentEditingCell = newInput;

  function endEditingCell(newValue) {
    if (newValue.value === currentValue && newValue.value.trim().length !== 0) {
      return;
    }

    if (newValue.value.trim().length !== 0) {
      closestCell.textContent = newValue.value;
    } else {
      closestCell.textContent = currentValue;
    }

    newInput.remove();
    currentEditingCell = null;
  }

  newInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      endEditingCell(e.target);
    }
  });

  newInput.addEventListener('blur', () => endEditingCell(newInput));
}

tbody.addEventListener('dblclick', (e) => enableEditingCell(e.target));
