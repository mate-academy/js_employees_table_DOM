'use strict';

const { pushNotification } = require('./pushNotification.js');

let positionNotification = 10;
const errorTitle = `Title of Error message`;
const errorMessage = `Notification should contain title and description.`;
const successTitle = `Title of Success message`;
const successMessage = `Notification should contain title and description.`;

function formHandlerFunc(form, tbody) {
  const nameInput = form.querySelector('#name-input');
  const positionInput = form.querySelector('#position-input');
  const officeInput = form.querySelector('#office-input');
  const ageInput = form.querySelector('#age-input');
  const salaryInput = form.querySelector('#salary-input');

  if (nameInput.value.length < 4
    || ageInput.value < 18
    || ageInput.value > 90
  ) {
    pushNotification(positionNotification, 10, errorTitle,
      errorMessage, 'error');

    positionNotification += 120;

    setTimeout(() => {
      positionNotification = 10;
    }, 2000);

    return;
  }

  const newRowForForm = document.createElement('tr');

  newRowForForm.innerHTML = `
    <td>${nameInput.value}</td>
    <td>${positionInput.value}</td>
    <td>${officeInput.value}</td>
    <td>${ageInput.value}</td>
    <td>${salaryInput.value}</td>
  `;

  tbody.appendChild(newRowForForm);

  nameInput.value = '';
  positionInput.value = '';
  officeInput.value = '';
  ageInput.value = '';
  salaryInput.value = '';

  pushNotification(positionNotification, 10, successTitle,
    successMessage, 'success');
}

module.exports = { formHandlerFunc };
