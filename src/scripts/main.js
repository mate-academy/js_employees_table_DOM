'use strict';

const table = document.querySelector('table');
const headers = [...table.tHead.rows[0].cells];
// const thead = document.querySelector('thead');
const tbody = table.tBodies[0];
const tableRows = [...tbody.rows];

// Implement table sorting by clicking on the title (in two directions)

function sortTable(columnIndex, sortOrder) {
  const sortedRows = [...tableRows];

  sortedRows.sort((rowA, rowB) => {
    const cellA = rowA.querySelectorAll('td')[columnIndex].textContent;
    const cellB = rowB.querySelectorAll('td')[columnIndex].textContent;

    // Сравниваем значения ячеек в зависимости от типа данных
    if (sortOrder === 'asc') {
      return cellA.localeCompare(cellB, undefined, { numeric: true });
    } else {
      return cellB.localeCompare(cellA, undefined, { numeric: true });
    }
  });

  tableRows.forEach((row) => {
    tbody.removeChild(row);
  });

  sortedRows.forEach((row) => {
    tbody.appendChild(row);
  });
}

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const currentOrder = header.getAttribute('data-order');
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    header.setAttribute('data-order', newOrder);

    header.classList.toggle('asc', newOrder === 'asc');
    header.classList.toggle('desc', newOrder === 'desc');

    sortTable(index, newOrder);
  });
});

// When user clicks on a row, it should become selected.

tableRows.forEach((row) => {
  row.addEventListener('click', () => {
    tableRows.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

// Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.
// Show notification if form data is invalid

const form = document.createElement('form');

form.classList.add('new-employee-form');

function createLabelElement(label, innerElement) {
  const labelElement = document.createElement('label');

  labelElement.appendChild(document.createTextNode(label));

  labelElement.appendChild(innerElement);

  return labelElement;
}

function createInputElement(inputName, inputType) {
  const inputElement = document.createElement('input');

  inputElement.setAttribute('name', inputName);
  inputElement.setAttribute('type', inputType);
  inputElement.setAttribute('data-qa', inputName);

  return inputElement;
}

function createSelectElement(dataQa, options) {
  const select = document.createElement('select');

  select.setAttribute('data-qa', dataQa);

  options.forEach(option => {
    const optionElement = document.createElement('option');

    optionElement.value = option;
    optionElement.textContent = option;
    select.appendChild(optionElement);
  });

  return select;
}

const officeSelect = createLabelElement('Office:', createSelectElement('office',
  ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco']));
const nameInput = createLabelElement('Name:',
  createInputElement('name', 'text'));
const positionInput = createLabelElement('Position:',
  createInputElement('position', 'text'));
const ageInput = createLabelElement('Age:',
  createInputElement('age', 'number'));
const salaryInput = createLabelElement('Salary:',
  createInputElement('salary', 'number'));

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(nameInput, positionInput,
  officeSelect, ageInput, salaryInput, submitButton);

document.body.appendChild(form);

function showNotification(title, description, className) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification`;
  notification.classList.add(className);

  const notificationTitle = document.createElement('h3');

  notificationTitle.textContent = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function validateData(nameInputValue, ageInputValue, positionInputValue) {
  if (nameInputValue.length < 4) {
    showNotification('Error', 'Name should have at least 4 letters', 'error');

    return false;
  }

  if (ageInputValue < 18 || ageInputValue > 90) {
    showNotification('Error', 'Age should be between 18 and 90', 'error');

    return false;
  }

  if (positionInputValue === '') {
    showNotification('Error', 'Position should not be empty', 'error');

    return false;
  }

  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInputValue = nameInput.querySelector('input').value;
  const ageInputValue = ageInput.querySelector('input').value;
  const positionInputValue = positionInput.querySelector('input').value;

  if (validateData(nameInputValue, ageInputValue, positionInputValue)) {
    const newRow = tbody.insertRow();
    const convertedSalary = '$' + new Intl.NumberFormat('en-US')
      .format(salaryInput.querySelector('input').value);

    newRow.innerHTML = `
      <td>${nameInputValue}</td>
      <td>${positionInput.querySelector('input').value}</td>
      <td>${officeSelect.querySelector('select').value}</td>
      <td>${ageInputValue}</td>
      <td>${convertedSalary}</td>
    `;

    showNotification('Success', 'New employee added to the table', 'success');

    form.reset();
  }
});
