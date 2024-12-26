'use strict';

let sortBy = null;
const mainTable = document.querySelector('table');
const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

const submitButton = document.createElement('button');

submitButton.innerText = 'Save to table';

const countryForSelect = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const allInputsForForm = [
  createInput('text', 'Name'),
  createInput('text', 'Position'),
  createSelect(countryForSelect, 'Office'),
  createInput('number', 'Age'),
  createInput('number', 'Salary'),
  submitButton,
];

newForm.append(...allInputsForForm);
mainTable.after(newForm);

function createInput(typeInput, nameInput) {
  const newLabel = document.createElement('label');
  const newInput = document.createElement('input');

  newLabel.append(`${nameInput}:`);
  newInput.name = nameInput.toLowerCase();
  newInput.type = typeInput.toLowerCase();
  newInput.dataset.qa = nameInput.toLowerCase();
  newInput.required = true;
  newLabel.append(newInput);

  return newLabel;
}

function createSelect(array, nameForm) {
  const newSelect = document.createElement('select');
  const newLabel = document.createElement('label');

  newLabel.append(`${nameForm}:`);

  array.forEach((value) => {
    const newOption = document.createElement('option');

    newOption.value = value;
    newOption.innerText = value;
    newSelect.append(newOption);
  });

  newSelect.name = nameForm.toLowerCase();
  newSelect.dataset.qa = nameForm.toLowerCase();
  newLabel.append(newSelect);

  return newLabel;
}

function sortForTable(sortTable, column) {
  const tbody = sortTable.querySelector('tbody');

  return Array.from(tbody.children).sort((row1, row2) => {
    const value1 = row1.children[column].textContent;
    const value2 = row2.children[column].textContent;

    if (!/[0-9]/.test(value1)) {
      return value1.localeCompare(value2);
    } else if (/[0-9]/.test(value1)) {
      return value1.replace(/\D/g, '') - value2.replace(/\D/g, '');
    }
  });
}

function createMessage(typeNotification, info) {
  const notification = document.createElement('div');
  const titleNotification = document.createElement('h2');
  const textNotification = document.createElement('p');
  const oldMessage = document.querySelector('.notification');

  if (oldMessage) {
    oldMessage.remove();
  }

  notification.dataset.qa = 'notification';
  titleNotification.classList.add('title');

  if (typeNotification === 'error') {
    notification.classList.add('notification', 'error');
    titleNotification.innerText = 'Incorrect data entered.';

    if (info === 'age') {
      textNotification.innerText = `Please check the ${info}. Minimum age 18, maximum 90.`;
    } else {
      textNotification.innerText = `Please check the ${info} and make corrections.`;
    }
  } else if (typeNotification === 'success') {
    notification.classList.add('notification', 'success');
    titleNotification.innerText = 'Success!';
    textNotification.innerText = 'Data added successfully';
  }

  notification.append(titleNotification, textNotification);
  document.body.append(notification);

  window.setTimeout(() => notification.remove(), 3000);
}

function validationSalary(value) {
  const clearNum = value.replace(/\D/g, '');
  const formatedValue = parseFloat(clearNum).toLocaleString('en-US');

  return '$' + formatedValue;
}

mainTable.tHead.addEventListener('click', function (eventData) {
  if (eventData.target.tagName !== 'TH') {
    return false;
  }

  const sortedElement = sortForTable(
    this.parentElement,
    eventData.target.cellIndex,
  );

  if (sortBy !== eventData.target.textContent) {
    sortBy = eventData.target.textContent;
    this.nextElementSibling.append(...sortedElement);
  } else if (sortBy === eventData.target.textContent) {
    this.nextElementSibling.append(...sortedElement.reverse());
    sortBy = null;
  }
});

mainTable.tBodies[0].addEventListener('click', function (eventData) {
  const row = eventData.target.closest('tr');
  const activeRow = this.querySelector('tr.active');

  if (activeRow && activeRow !== row) {
    activeRow.classList.remove('active');
  }

  if (row) {
    row.classList.toggle('active');
  }
});

newForm.addEventListener('submit', (eventData) => {
  eventData.preventDefault();

  const inputName = eventData.target.elements.name;
  const inputPosition = eventData.target.elements.position;
  const inputOffice = eventData.target.elements.office;
  const inputAge = eventData.target.elements.age;
  const inputSalary = eventData.target.elements.salary;
  const testForTextInput = /^[A-Z][a-z]+-?\s?[A-Z]?[a-z]+$/;

  if (!testForTextInput.test(inputName.value) || inputName.value.length < 4) {
    createMessage('error', 'name');

    return false;
  }

  if (inputAge.value < 18 || inputAge.value > 90) {
    createMessage('error', 'age');

    return false;
  }

  const newRow = mainTable.tBodies[0].insertRow();

  newRow.insertCell().textContent = inputName.value;
  newRow.insertCell().textContent = inputPosition.value;
  newRow.insertCell().textContent = inputOffice.value;
  newRow.insertCell().textContent = inputAge.value;
  newRow.insertCell().textContent = validationSalary(inputSalary.value);

  createMessage('success');
  eventData.target.reset();
});
