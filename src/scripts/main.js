'use strict';

const tableBody = document.querySelector('tbody');
const tableHeadRow = document.querySelector('thead tr');
const form = document.createElement('form');

// ---------------Sorting function---------------------------

const sortDirections = {};

tableHeadRow.addEventListener('click', (e) => {
  let target = e.target;

  while (target && target.nodeName !== 'TH') {
    target = target.parentElement;
  }

  if (!target) {
    return;
  }

  const headers = Array.from(tableHeadRow.children);
  const index = headers.indexOf(target);
  const bodyArr = Array.from(tableBody.children);

  const ascending = !sortDirections[index];

  sortDirections[index] = ascending;

  bodyArr.sort((row1, row2) => {
    const cell1 = row1.children[index];
    const cell2 = row2.children[index];

    const text1 = cell1.textContent.replace(/[$,]/g, '');
    const text2 = cell2.textContent.replace(/[$,]/g, '');

    const value1 = isNaN(text1) ? text1 : parseFloat(text1);
    const value2 = isNaN(text2) ? text2 : parseFloat(text2);

    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return ascending ? value1 - value2 : value2 - value1;
    } else {
      return ascending
        ? value1.localeCompare(value2)
        : value2.localeCompare(value1);
    }
  });

  bodyArr.forEach((row) => tableBody.appendChild(row));
});

// -------------------------------------------------------------

// ------------------Selecting function-----------------------------

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  Array.from(tableBody.children).forEach((row) => {
    row.classList.remove('active');
  });

  clickedRow.classList.add('active');
});

// --------------------Form adding-----------------------------
const createForm = () => {
  form.classList.add('new-employee-form');

  const labelNames = ['name', 'position', 'office', 'age', 'salary'];
  const selectFieldName = 'office';
  const selectOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.noValidate = true;

  // ---Add labels---
  labelNames.forEach((labelName) => {
    const label = document.createElement('label');

    label.textContent =
      labelName.charAt(0).toUpperCase() + labelName.slice(1) + ':';

    // ---Add input fields---
    if (labelName === selectFieldName) {
      const inputField = document.createElement('select');

      inputField.name = labelName;
      inputField.setAttribute('data-qa', labelName);
      inputField.required = true;

      selectOptions.forEach((selectOption) => {
        const option = document.createElement('option');

        option.textContent = selectOption;
        option.value = selectOption;

        inputField.appendChild(option);
      });

      label.appendChild(inputField);
    } else {
      const inputField = document.createElement('input');

      inputField.type = 'text';
      inputField.name = labelName;
      inputField.setAttribute('data-qa', labelName);
      inputField.required = true;
      inputField.placeholder = `Your ${labelName}`;

      label.appendChild(inputField);
    }
    // --------------------

    form.appendChild(label);
  });

  // --- Add button ---
  const submitButton = document.createElement('button');

  submitButton.classList.add('button');
  submitButton.innerText = 'Save to table';
  submitButton.type = 'submit';

  form.appendChild(submitButton);
  document.body.append(form);
};

createForm();

// ------------------------------------------------------------

// ----------------Form submiting---------------------------

form.addEventListener('submit', submitFunction);

function submitFunction(e) {
  e.preventDefault();

  const target = e.target;

  // ----- Creating new row---------
  const newTableRow = document.createElement('tr');

  const parentForm = target.closest('form');
  const formElements = parentForm.elements;

  let hasError = false;

  Array.from(formElements).forEach((element) => {
    if (element.tagName === 'BUTTON') {
      return;
    }

    const value = element.value.trim();

    // -------Check empty field---------
    if (!value) {
      showNotification('error', 'All fields are required');

      hasError = true;
    }

    // -------Check if age and salary fields are numeric---------

    if (['age', 'salary'].includes(element.name)) {
      if (isNaN(Number(value))) {
        showNotification('error', `${element.name} must be a number`);

        hasError = true;
      }
    }

    // -------Check if age is from 18 to 90--------
    if (element.name === 'age') {
      const age = Number(element.value);

      if (age < 18 || age > 90) {
        showNotification('error', 'Age must be from 18 to 90');
        hasError = true;
      }
    }

    // -------Check if name is longer than 4--------

    if (element.name === 'name') {
      if (element.value.trim().length < 4) {
        showNotification('error', 'Name must have more than 4 letters');
        hasError = true;
      }
    }

    const fieldValue = element.value;
    const newCell = document.createElement('td');

    if (element.name === 'salary') {
      const formattedSal = new Intl.NumberFormat('en-US').format(element.value);

      newCell.innerText = `$${formattedSal}`;
    } else {
      newCell.innerText = fieldValue;
    }

    newTableRow.appendChild(newCell);
  });

  if (hasError) {
    return;
  }

  showNotification('success', 'Employee added.');
  tableBody.appendChild(newTableRow);
}
// ------------------------------------------------------------

// --------------Create notification-------------------------

function showNotification(type, message) {
  document.querySelectorAll('.notification').forEach((n) => n.remove());

  const notificationBody = document.createElement('div');
  const notificationTitle = document.createElement('p');

  notificationTitle.className = 'title';

  notificationBody.setAttribute('data-qa', 'notification');
  notificationBody.className = `notification ${type}`;

  notificationBody.append(notificationTitle);

  notificationTitle.innerText = message;

  document.body.appendChild(notificationBody);
  setTimeout(() => notificationBody.remove(), 15000);
}
