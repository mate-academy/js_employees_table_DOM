'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const tableHeader = table.querySelector('thead');

// Implementation of table sorting by clicking on the title (in two directions)

tableHeader.addEventListener('click', e => {
  const item = e.target;
  const indexToSort = item.cellIndex;

  item.toggleAttribute('selected');

  const orderASC = item.hasAttribute('selected');

  sortTable(indexToSort, orderASC);
});

function sortTable(index, order) {
  Array.from(tableBody.rows)
    .sort((a, b) => {
      const valueA = a.cells[index].innerText;
      const valueB = b.cells[index].innerText;
      const valueToSortA = toFormat(valueA);
      const valueToSortB = toFormat(valueB);
      const isValueType = typeof valueToSortA === 'string';

      if (order) {
        return (isValueType)
          ? valueToSortA.localeCompare(valueToSortB)
          : valueToSortA - valueToSortB;
      }

      return (isValueType)
        ? valueToSortB.localeCompare(valueToSortA)
        : valueToSortB - valueToSortA;
    })
    .forEach(row => tableBody.append(row));
}

function toFormat(text) {
  const result = parseFloat(text.replace(/[$,]/g, ''));

  return isNaN(result) ? text : result;
}

// Implementation of selection a row onclick

tableBody.addEventListener('click', e => {
  Array.from(tableBody.rows).forEach(row => row.classList.remove('active'));
  e.target.parentElement.classList.add('active');
});

// Script to add a form to the document.
// Form allows users to add new employees to the spreadsheet

const form = document.createElement('form');
const officeOptions = [
  'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
];

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name:
    <input
      type="text"
      name="name"
      data-qa="name"
      pattern="[a-zA-Z0-9]+[a-zA-Z0-9 ]+"
      required
    >
  </label>
  <label>Position:
    <input
      name="position"
      type="text"
      data-qa="position"
      pattern="[a-zA-Z0-9]+[a-zA-Z0-9 ]+"
      required
    >
  </label>
  <label>Office:
    <select name = "office" data-qa="office" required>
      ${officeOptions.map(office => `
        <option>${office}</option>
      `).join('')}
    </select>
  </label>
  <label>Age:
    <input
      name="age"
      type="number"
      data-qa="age"
      required
    >
  </label>
  <label>Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
      required
    >
  </label>
  <button type="submit">Save to table</button>
`;
document.body.append(form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const dataOfForm = new FormData(form);
  const dataOfFormObject = Object.fromEntries(dataOfForm.entries());

  if (validateForm(dataOfFormObject)) {
    const formValuesArr = Object.entries(dataOfFormObject);
    const newEmployee = tableBody.insertRow(-1);

    formValuesArr.forEach(([key, value]) => {
      const employeeField = newEmployee.insertCell();

      employeeField.innerText = (key !== 'salary')
        ? value
        : toCurrencyFormat(value);
    });

    form.reset();

    pushNotification(0, 0, 'Congratulations!',
      'Employee added to the table.', 'success');
  }
});

function toCurrencyFormat(number) {
  return parseInt(number)
    .toLocaleString('en-US', {
      style: 'currency', currency: 'USD',
    }).replace('.00', '');
}

function validateForm({ name: validName, age: validAge }) {
  if (validName.length < 4) {
    pushNotification(
      0, 0, 'Enter correct name',
      'The name should be at least 4 characters long', 'error'
    );

    return false;
  }

  if (validAge < 18 || validAge > 90) {
    pushNotification(
      0, 0, 'Age restrictions',
      'You must be at least 18 and no more than 90 years old', 'error'
    );

    return false;
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(notification);

  setTimeout(() => notification.remove(), 4000);
};

// Implementation of editing of table cells by double-clicking on it

tableBody.addEventListener('dblclick', e => {
  const selectedCell = e.target.closest('td');
  const initValue = selectedCell.innerText;
  const index = selectedCell.cellIndex;

  selectedCell.innerText = '';

  switch (index) {
    case 2:
      selectedCell.innerHTML = `
        <select class="cell-input" value="${initValue}">
          ${officeOptions.map(office => `
            <option value="${office}">${office}</option>
          `).join('')}
        </select>
      `;

      selectedCell.querySelectorAll('option')
        .forEach(option => {
          if (option.innerText === initValue) {
            option.setAttribute('selected', 'selected');
          }
        });
      break;

    case 3:
      selectedCell.innerHTML = `
        <input
          class="cell-input"
          type="number"
          value="${initValue}"
          min="18"
          max="90"
        >
      `;
      break;

    case 4:
      selectedCell.innerHTML = `
        <input
          class="cell-input"
          type="number"
          value="${toFormat(initValue)}"
        >
      `;
      break;

    default:
      selectedCell.innerHTML = `
        <input
          class="cell-input"
          type="text"
          minlength="4"
          pattern="[a-zA-Z0-9]+[a-zA-Z0-9 ]+"
          value="${initValue}"
        >
      `;
      break;
  }

  const inputField = selectedCell.firstElementChild;

  inputField.focus();

  inputField.addEventListener('blur', () =>
    saveChanges(selectedCell, inputField, index));

  inputField.addEventListener('keypress', ev => {
    if (ev.key === 'Enter') {
      saveChanges(selectedCell, inputField, index);
    }
  });
});

function saveChanges(cell, input, index) {
  const startValue = input.getAttribute('value');
  const currentValue = input.value;

  cell.innerHTML = '';

  switch (index) {
    case 0:
      if (currentValue.length >= 4) {
        cell.innerText = currentValue;
      } else {
        pushNotification(
          0, 0, 'Enter correct name',
          'The name should be at least 4 characters long', 'error'
        );
        cell.innerText = startValue;
      }
      break;

    case 3:
      if (currentValue < 18 || currentValue > 90) {
        pushNotification(
          0, 0, 'Age restrictions',
          'You must be at least 18 and no more than 90 years old', 'error'
        );
        cell.innerText = startValue;
      } else {
        cell.innerText = currentValue;
      }
      break;

    default:
      if (currentValue.length > 0) {
        cell.innerText = (index !== 4)
          ? currentValue
          : toCurrencyFormat(currentValue);
      } else {
        pushNotification(
          0, 0, 'Empty line',
          'You cannot save an empty string', 'error'
        );

        cell.innerText = (index !== 4)
          ? startValue
          : toCurrencyFormat(startValue);
      }
      break;
  };
};
