'use strict';

const tableBody = document.querySelector('tbody');
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.insertAdjacentElement('beforeend', form);

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>Office:
    <select name="office" type="text" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburg">Edinburg</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`);

form.addEventListener('submit', ev => {
  ev.preventDefault();

  const employee = Object.fromEntries(new FormData(form).entries());

  if (isFormInputValid(employee)) {
    tableBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.office}</td>
        <td>${employee.age}</td>
        <td>${'$' + (+employee.salary).toLocaleString('en-us')}</td>
      </tr>
    `);

    showNotification(
      createNotification('success', 'New employee has been added to the table')
    );
  } else {
    showNotification(
      createNotification('error', 'Form data is invalid')
    );
  }
});

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
  form.insertAdjacentElement('afterend', notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function isFormInputValid(employee) {
  if (Object.values(employee).some(value => value.length === 0)) {
    return false;
  }

  const minNameLength = 4;
  const minAge = 18;
  const maxAge = 90;

  return employee.name.length >= minNameLength
    && +employee.age >= minAge && +employee.age <= maxAge;
}
