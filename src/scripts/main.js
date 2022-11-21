'use strict';
/// /// /// /// /// /// /// ///
// SELECTING ELEMENTS
/// /// /// /// /// /// /// ///

const tableBody = document.querySelector('tbody');

/// /// /// /// /// /// /// ///
//  HELPER FUNCTIONS
/// /// /// /// /// /// /// ///

const getSalaryNumber = (str) =>
  Number(str.trim().split(',').join('').slice(1));

const createInput = (text, attribute, type = 'text') => {
  const label = document.createElement('label');
  const input = document.createElement('input');

  label.textContent = text;
  input.setAttribute('name', attribute);
  input.setAttribute('type', type);
  input.setAttribute('data-qa', attribute);
  label.append(input);
  formElement.append(label);

  return input;
};

const createNotification = (title, description, type = 'error') => {
  const messageElement = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  titleElement.textContent = title;

  descriptionElement.textContent = description;
  titleElement.classList.add('title');
  messageElement.append(titleElement, descriptionElement);

  messageElement.classList.add(type, 'notification');
  messageElement.setAttribute('data-qa', 'notification');

  document.body.append(messageElement);

  setTimeout(() => {
    messageElement.remove();
  }, 3000);
};

const saveChanges = function(editInput, clicked, pereviousValue) {
  const editedValue = editInput.value;

  clicked.innerHTML = '';

  if (editedValue === '') {
    clicked.textContent = pereviousValue;
  } else {
    clicked.textContent = editedValue;
  }
};

/// /// /// /// /// /// /// ///
// TABLE SORTING
/// /// /// /// /// /// /// ///

const sorted = [0, 0, 0, 0, 0];

const sortTable = function(e) {
  const tableData = [...tableBody.children];
  const clicked = e.target;
  const type = clicked.textContent;
  const index = [...clicked.closest('tr').children].indexOf(clicked);

  tableData.sort((a, b) => {
    const firstText = a.children[index].textContent;
    const secondText = b.children[index].textContent;

    if (sorted[index] === 0) {
      switch (type) {
        case 'Position':
        case 'Name':
        case 'Office':
          return firstText.localeCompare(secondText);
        case 'Age':
          return firstText - secondText;
        case 'Salary':
          return getSalaryNumber(firstText) - getSalaryNumber(secondText);
      };
    } else {
      switch (type) {
        case 'Position':
        case 'Name':
        case 'Office':
          return secondText.localeCompare(firstText);
        case 'Age':
          return secondText - firstText;
        case 'Salary':
          return getSalaryNumber(secondText) - getSalaryNumber(firstText);
      }
    }
  });

  sorted.forEach((_, i) => {
    if (i === index) {
      sorted[index] = sorted[index] === 0 ? 1 : 0;
    } else {
      sorted[i] = 0;
    }
  });

  tableBody.innerHTML = '';
  tableData.forEach(el => tableBody.append(el));
};

document.querySelector('thead').addEventListener('click', sortTable);

/// /// /// /// /// /// /// ///
// SELECTED ROW
/// /// /// /// /// /// /// ///

const makeRowSelected = function(e) {
  const clicked = e.target.closest('tr');

  if (!clicked) {
    return;
  }

  [...document.querySelectorAll('tr')].forEach(
    tr => tr.classList.remove('active')
  );
  clicked.classList.add('active');
};

tableBody.addEventListener('click', makeRowSelected);

/// /// /// /// /// /// /// ///
// FORM
/// /// /// /// /// /// /// ///

// 1) creating the form

const formElement = document.createElement('form');

formElement.classList.add('new-employee-form');

const inputName = createInput('Name:', 'name');
const inputPosition = createInput('Position:', 'position');

// 2) Select Office

const lableSelect = document.createElement('label');
const selecetElement = document.createElement('select');
const optionTokyo = document.createElement('option');
const optionSingapore = document.createElement('option');
const optionLondon = document.createElement('option');
const optionYork = document.createElement('option');
const optionEdinburgh = document.createElement('option');
const optionSan = document.createElement('option');

lableSelect.textContent = 'Office:';
selecetElement.setAttribute('name', 'office');
selecetElement.setAttribute('data-qa', 'office');
optionTokyo.setAttribute('value', 'Tokyo');
optionTokyo.textContent = 'Tokyo';
optionSingapore.setAttribute('value', 'Singapore');
optionSingapore.textContent = 'Singapore';
optionLondon.setAttribute('value', 'London');
optionLondon.textContent = 'London';
optionYork.setAttribute('value', 'New York');
optionYork.textContent = 'New York';
optionEdinburgh.setAttribute('value', 'Edinburgh');
optionEdinburgh.textContent = 'Edinburgh';
optionSan.setAttribute('value', 'San Francisco');
optionSan.textContent = 'San Francisco';

selecetElement.append(
  optionTokyo, optionSingapore, optionLondon,
  optionYork, optionEdinburgh, optionSan
);
lableSelect.append(selecetElement);
formElement.append(lableSelect);

// 3) Age, salary inputs

const inputAge = createInput('Age:', 'age', 'number');
const inputSalary = createInput('Salary:', 'salary', 'number');

// 4) button

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

formElement.append(submitButton);

document.body.append(formElement);

// 5) adding the submit listener

const submitForm = function(e) {
  e.preventDefault();

  const customName = inputName.value;
  const customPosition = inputPosition.value;
  const customOffice = selecetElement.value;
  const customAge = inputAge.value;
  const customSalary = inputSalary.value;

  if (customName.length < 4) {
    createNotification('Invalid name',
      'Name should be longer than 4 characters');

    return;
  }

  if (customAge < 18 || customAge > 90) {
    createNotification('Invalid age', 'Age should be between 18 and 90');

    return;
  }

  if (!customPosition || !customSalary) {
    createNotification('Invalid Input', 'All fields are required');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${customName}</td>
    <td>${customPosition}</td>
    <td>${customOffice}</td>
    <td>${customAge}</td>
    <td>$${Number(customSalary).toLocaleString('en-US')}</td>
  `;

  tableBody.append(newRow);
  createNotification('Success!', 'Data saved successfully', 'success');

  inputName.value = inputPosition.value
  = inputAge.value = inputSalary.value = '';
};

formElement.addEventListener('submit', submitForm);

/// /// /// /// /// /// /// ///
//  EDIDITING
/// /// /// /// /// /// /// ///

tableBody.addEventListener('dblclick', function(e) {
  const clicked = e.target.closest('td');

  if (!clicked) {
    return;
  }

  const pereviousValue = clicked.textContent;

  clicked.innerHTML = '';

  const editInput = document.createElement('input');

  editInput.classList.add('cell-input');

  clicked.append(editInput);

  editInput.addEventListener('blur', function() {
    saveChanges(editInput, clicked, pereviousValue);
  });

  editInput.addEventListener('keypress', function(press) {
    if (press.key === 'Enter') {
      saveChanges(editInput, clicked, pereviousValue);
    }
  });

  tableBody.addEventListener('dblclick', function() {
    saveChanges(editInput, clicked, pereviousValue);
  });
});
