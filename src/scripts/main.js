'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.children];

const form = document.createElement('form');

let isAlreadySorted = false;
let previousElement = null;

function getSalaryAmount(salary) {
  return Number(salary
    .split(/[$,]/)
    .join('')
  );
}

// const tableRows = [...tbody.children];

function getSortedData(column) {
  const position = column.cellIndex;

  switch (column.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      rows.sort((currentRow, nextRow) => {
        return currentRow.children[position].innerText
          .localeCompare(nextRow.children[position].innerText);
      });
      break;

    case 'Age':
      rows.sort((currentRow, nextRow) => {
        return currentRow.children[position].innerText
          - nextRow.children[position].innerText;
      });
      break;

    case 'Salary':
      rows.sort((currentRow, nextRow) => {
        return getSalaryAmount(currentRow.children[position].innerText)
          - getSalaryAmount(nextRow.children[position].innerText);
      });
      break;
  }

  return rows;
}

function activeElementHandler(eventOnCell) {
  if (previousElement !== null) {
    previousElement.parentElement.classList.remove('active');
  }

  const currentElement = eventOnCell.target;

  previousElement = currentElement;

  currentElement.parentElement.classList.add('active');
}

table.addEventListener('click', (clickEvent) => {
  if (table.tHead.contains(clickEvent.target)) {
    getSortedData(clickEvent.target);

    if (!isAlreadySorted) {
      tbody.append(...rows);
    } else {
      tbody.append(...rows.reverse());
    }

    isAlreadySorted = !isAlreadySorted;
  }
});

table.addEventListener('click', activeElementHandler);

form.classList.add('new-employee-form');
form.action = '#';
form.method = 'GET';

form.insertAdjacentHTML('beforeend', `
  <label for="name">
    Name:
    <input
      id="name"
      name="name"
      type="text"
      data-qa="name"
      value=""
      required
    >
  </label>
  <label for="position">
    Position:
    <input
      id="position"
      name="position"
      type="text"
      data-qa="position"
      required
    >
  </label>
  <label for="office">
    Office:
    <select
      id="office"
      name="office"
      data-qa="office"
      required
    >
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label for="age">
    Age:
    <input
      id="age"
      name="age"
      type="text"
      data-qa="age"
      required
    >
  </label>
  <label for="salary">
    Salary:
      <input
        id="salary"
        name="salary"
        type="text"
        data-qa="salary"
        required
      >
  </label>
  <button>
    Save to table
  </button>
`);

document.body.append(form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.classList.add('notification', type);
  notificationTitle.className = 'title';
  notificationTitle.textContent = title;
  notificationDescription.textContent = description;
  notification.dataset.qa = 'notification';

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  notification.append(notificationTitle, notificationDescription);

  document.body.append(notification);

  setTimeout(function() {
    notification.remove();
  }, 5000);
};

const submitButton = form.querySelector('button');
const minLengthOfName = 4;
const minAge = 18;
const maxAge = 90;

function getNewEmployee(clickButton) {
  clickButton.preventDefault();

  const nameInput = form.querySelector('#name').value;
  const positionInput = form.querySelector('#position').value;
  const ageInput = Number(form.querySelector('#age').value);
  const officeSelected = form.querySelector('#office').value;
  const salaryInput = Number(form.querySelector('#salary').value);

  if (nameInput.length < minLengthOfName) {
    pushNotification(
      10, 10, 'Invalid input', 'Name should be longer than 4 letters', 'error'
    );

    return;
  }

  if (!positionInput) {
    pushNotification(
      150, 10, 'Invalid input', 'Position required', 'error'
    );

    return;
  }

  if (!ageInput) {
    pushNotification(
      150, 10, 'Invalid input', 'Age should be a number', 'error'
    );

    return;
  }

  if (ageInput < minAge || ageInput > maxAge) {
    pushNotification(
      150, 10, 'Invalid input', 'Age should be between 18 and 90', 'error'
    );

    return;
  }

  if (!salaryInput) {
    pushNotification(
      300, 10, 'Invalid input', 'Salary should be a number', 'error'
    );

    return;
  }

  pushNotification(
    10, 10, 'New employee added', 'New employee added to the table', 'success'
  );

  tbody.insertAdjacentHTML('beforeend', `
    <td>${nameInput}</td>
    <td>${positionInput}</td>
    <td>${officeSelected}</td>
    <td>${ageInput}</td>
    <td>$${Number(salaryInput).toLocaleString('en')}</td>
  `);
}

submitButton.addEventListener('click', getNewEmployee);
