'use strict';

const body = document.body;
const listValue = document.querySelector('tbody');
const newEmployeeForm = document.createElement('form');

const convertCurrencyToNumber = (value) =>
  Number(value.replaceAll('$', '').replaceAll(',', ''));

function pushNotification(posTop, posRight, title, description, type = '') {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.dataset.qa = 'notification';
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

function sortList(index, sortMethod) {
  const list = document.querySelector('tbody');

  const result = [...list.children].sort((a, b) => {
    if (index === 4) {
      const valueA = convertCurrencyToNumber(a.children[index].innerText);
      const valueB = convertCurrencyToNumber(b.children[index].innerText);

      if (sortMethod === 'off') {
        return valueB - valueA;
      }

      return valueA - valueB;
    }

    const value1 = a.children[index].innerText;
    const value2 = b.children[index].innerText;

    if (sortMethod === 'off') {
      return value2.localeCompare(value1);
    }

    return value1.localeCompare(value2);
  });

  list.append(...result);
}

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());

  if (!validateFormData(formData)) {
    return;
  }

  const valueSalary = Number(formData.salary).toLocaleString('en-US');

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${formData.name}</td>
    <td>${formData.position}</td>
    <td>${formData.office}</td>
    <td>${formData.age}</td>
    <td>$${valueSalary}</td>
  `;

  listValue.append(newRow);
  e.target.reset();

  pushNotification(
    500,
    10,
    'Success!',
    'Good!<br>Employee has been added!',
    'success'
  );
});

function validateFormData({ name: formDataName, position, age }) {
  const errorTypes = [];

  if (formDataName.length < 4) {
    errorTypes.push('name');
  }

  if (!position) {
    errorTypes.push('position');
  }

  if (+age < 18 || +age > 90) {
    errorTypes.push('age');
  }

  if (errorTypes.length) {
    pushNotification(500, 10, 'Error!', errorMessages[errorTypes[0]], 'error');

    return false;
  }

  return true;
}

newEmployeeForm.className = 'new-employee-form';
newEmployeeForm.action = '#';
newEmployeeForm.method = 'post';

newEmployeeForm.innerHTML = `
  <label>Name: <input data-qa="name" name="name" type="text"></label>
  <label>Position: <input
    data-qa="position" name="position" type="text"></label>
  <label>Office: <select data-qa="office" name="office">
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input
    data-qa="age" name="age" type="number"></label>
  <label>Salary: <input data-qa="salary" name="salary" type="number"></label>
  <button type="submit">Save to table</button>
`;

body.append(newEmployeeForm);

const errorMessages = ((errorHeading) => ({
  name: `${errorHeading}
  <br>Name field cannot be empty! Or less then 4 letters!`,
  position: `${errorHeading}<br>Position field cannot be empty!`,
  age: `${errorHeading}<br>Age must be more 18 & less 90`,
}))('Something went wrong!');

addEventListener('click', (e) => {
  const tableBody = document.querySelector('tbody');

  if (!tableBody.contains(e.target)) {
    return;
  }

  for (const element of tableBody.children) {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  }

  e.target.parentElement.className = 'active';
});

addEventListener('click', (e) => {
  const tableHeaders = [...document.querySelectorAll('th')];
  const selectedHeader = tableHeaders.find(
    (element) => element.innerText === e.target.innerText);

  if (selectedHeader === undefined) {
    return;
  }

  tableHeaders.forEach((header) => {
    if (header.hasAttribute('data-status') && header !== selectedHeader) {
      header.removeAttribute('data-status');
    }
  });

  if (selectedHeader.dataset.status === 'on') {
    selectedHeader.dataset.status = 'off';
  } else {
    selectedHeader.dataset.status = 'on';
  }

  sortList(selectedHeader.cellIndex, selectedHeader.dataset.status);
});
