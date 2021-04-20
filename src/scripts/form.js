'use strict';

const locations = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const formValidation = {
  nameValid: false,
  ageValid: false,
  allFieldsNonEmpty: false,
};

const tableBody = document.querySelector('tbody');
const newEmployeeForm = createForm();

document.body.insertAdjacentElement('beforeend', newEmployeeForm);

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  form.addEventListener('submit', submitForm);

  form.insertAdjacentHTML('afterbegin', `
    <label>Name:
      <input
        type="text"
        name="name"
        data-qa="name"
        placeholder="Name"
        required
      >
    </label>
    <label>Position:
      <input
        type="text"
        name="position"
        data-qa="position"
        placeholder="Position"
        required
      >
    </label>
    <label>Office:
      <select
        type="text"
        name="office"
        data-qa="office"
        required
      >
        ${getLocationHTMLOptions()}
      </select>
    </label>
    <label>Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        placeholder="Age"
        required
      >
    </label>
    <label>Salary:
      <input
        type="number"
        name="salary"
        data-qa="salary"
        placeholder="Salary"
        required>
    </label>
    <button type="submit">Save to table</button>
  `);

  return form;
}

function submitForm(e) {
  e.preventDefault();

  let notification;
  const employee = Object.fromEntries(new FormData(newEmployeeForm).entries());

  if (validateInput(employee)) {
    tableBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.office}</td>
        <td>${employee.age}</td>
        <td>${'$' + (+employee.salary).toLocaleString('en-us')}</td>
      </tr>
    `);

    notification = createNotification(
      'success', 'New employee has been added to the table'
    );
  } else {
    notification = createNotification('error', getErrorMessage());
  }

  showNotification(notification);
}

function createNotification(type, text) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';

  notification.insertAdjacentHTML('afterbegin', `
    <h2 class="title">
      ${type.slice(0, 1).toUpperCase() + type.slice(1)}
    </h2>
    <p>
      ${text}
    </p>
  `);

  return notification;
}

function showNotification(notification) {
  newEmployeeForm.insertAdjacentElement('afterend', notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function getLocationHTMLOptions() {
  return locations.map(city => {
    return `<option value="${city}">${city}</option>`;
  }).join('');
}

function validateInput(employee) {
  formValidation.nameValid = checkNameLength(employee.name);
  formValidation.ageValid = checkAge(employee.age);
  formValidation.allFieldsNonEmpty = checkAllFieldsNonEmpty(employee);

  return Object.values(formValidation).every(valid => valid);
}

function checkNameLength(employeeName) {
  const minNameLength = 4;

  return employeeName.length >= minNameLength;
}

function checkAge(age) {
  const minAge = 18;
  const maxAge = 90;

  return +age >= minAge && +age <= maxAge;
}

function checkAllFieldsNonEmpty(employee) {
  return Object.values(employee).every(value => value.length > 0);
}

function getErrorMessage() {
  switch (false) {
    case formValidation.nameValid:
      return 'Name should be at least 4 characters long';
    case formValidation.ageValid:
      return 'Age should be in the range from 18 to 90 years';
    case formValidation.allFieldsNonEmpty:
      return 'All fields are required and shouldn\'t be empty';
  }

  return 'Error';
}
