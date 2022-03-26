'use strict';

const table = document.querySelector('table');
const dataRows = document.querySelector('tbody');
let currentColumnIndex = null;
let sortAsc = true;

addForm();

const saveFormButton = document.querySelector('button');

table.addEventListener('dblclick', evt => {
  if (evt.target.tagName === 'TD') {
    const targetElement = evt.target;
    const inputElement = document.createElement('input');
    const initialValue = targetElement.innerText;

    targetElement.innerText = '';
    inputElement.classList.add('cell-input');
    inputElement.value = initialValue;

    inputElement.addEventListener('blur', () => {
      if (!inputElement.value.length) {
        targetElement.innerText = initialValue;
      } else {
        targetElement.innerText = inputElement.value;
      }
    });

    inputElement.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        inputElement.blur();
      }
    });

    targetElement.append(inputElement);
    inputElement.focus();
  }
});

table.addEventListener('click', e => {
  if (e.target.closest('thead')) {
    sortColumn(e.target.cellIndex);

    return;
  }

  if (e.target.closest('tbody')) {
    for (const row of document.querySelector('tbody').children) {
      row.classList.remove('active');
    }
    e.target.closest('tr').classList.add('active');
  }
});

saveFormButton.addEventListener('click', e => {
  e.preventDefault();

  const form = document.querySelector('form');
  const formInputs = [...form.querySelectorAll('input, select')];

  if (!validateFields(form)) {
    return;
  }

  const newRow = document.createElement('tr');

  formInputs.forEach(element => {
    const newCell = document.createElement('td');

    newCell.innerText = element.dataset.qa === 'salary'
      ? convertSalaryToString(+element.value) : element.value;
    newRow.append(newCell);
  });

  dataRows.append(newRow);
  showNotification('Success!', 'Successfully added new employee', 'success');

  form.reset();
});

function sortColumn(columnIndex) {
  const rows = [...dataRows.children];

  if (columnIndex !== currentColumnIndex) {
    sortAsc = true;
  }

  rows.sort((a, b) => {
    const firstValue = a.children[columnIndex].innerText;
    const secondValue = b.children[columnIndex].innerText;

    if (columnIndex === 3) {
      return sortAsc ? +firstValue - +secondValue : +secondValue - +firstValue;
    }

    if (columnIndex === 4) {
      return sortAsc ? parseSalary(firstValue) - parseSalary(secondValue)
        : parseSalary(secondValue) - parseSalary(firstValue);
    }

    return sortAsc ? firstValue.localeCompare(secondValue)
      : secondValue.localeCompare(firstValue);
  }).forEach(row => {
    dataRows.append(row);
  });

  sortAsc = !sortAsc;
  currentColumnIndex = columnIndex;
}

function parseSalary(salaryString) {
  return +salaryString.replaceAll('$', '').replaceAll(',', '');
}

function convertSalaryToString(salaryNumber) {
  return `$${salaryNumber.toLocaleString()}`;
}

function addForm() {
  const form = document.createElement('form');
  const nameInput = document.createElement('input');
  const positionInput = document.createElement('input');
  const officeInput = document.createElement('select');
  const ageInput = document.createElement('input');
  const salaryInput = document.createElement('input');
  const saveButton = document.createElement('button');

  nameInput.setAttribute('data-qa', 'name');
  positionInput.setAttribute('data-qa', 'position');
  officeInput.setAttribute('data-qa', 'office');
  ageInput.setAttribute('data-qa', 'age');
  salaryInput.setAttribute('data-qa', 'salary');
  saveButton.innerText = 'Save to table';
  ageInput.type = 'number';
  salaryInput.type = 'number';

  const inputs = [nameInput, positionInput, officeInput, ageInput, salaryInput];
  const officeOptions = [
    'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
  ];

  for (const option of officeOptions) {
    officeInput.add(new Option(option));
  }

  for (const input of inputs) {
    const formElement = document.createElement('label');

    formElement.innerText = input.dataset.qa.charAt(0).toUpperCase()
      + input.dataset.qa.substring(1);
    input.required = true;
    formElement.appendChild(input);
    form.appendChild(formElement);
  }
  form.appendChild(saveButton);
  form.classList.add('new-employee-form');
  table.after(form);
}

function validateFields(form) {
  const ageField = form.querySelector('[data-qa="age"]');
  const nameField = form.querySelector('[data-qa="name"]');

  if (nameField.value.length < 4) {
    showNotification(
      'Error', 'Name should have more than 4 characters.', 'error');

    return false;
  }

  if (+ageField.value < 18 || +ageField.value > 90) {
    showNotification('Error', 'Age should be between 18 and 90', 'error');

    return false;
  }

  return true;
}

function showNotification(title, message, type) {
  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const description = document.createElement('p');

  notification.classList.add('notification', type);
  titleElement.classList.add('title');
  titleElement.innerText = title;
  description.innerText = message;
  notification.append(titleElement, description);
  document.querySelector('body').appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}
