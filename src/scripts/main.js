'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');

let isASC = true;
let sortColumnIndex = null;

// SORT

table.addEventListener('click', (e) => {
  if (!e.target.matches('th')) {
    return;
  }

  const targetIndex = e.target.cellIndex;

  const ageNumberCell = 3;
  const salaryNumberCell = 4;

  if (sortColumnIndex === targetIndex) {
    isASC = !isASC;
  } else {
    isASC = true;
    sortColumnIndex = targetIndex;
  }

  const rows = Array.from(tableBody.rows);

  rows.sort((a, b) => {
    const firstCell = getProcessedCellValue(a, sortColumnIndex);
    const secondCell = getProcessedCellValue(b, sortColumnIndex);

    if (sortColumnIndex === ageNumberCell
      || sortColumnIndex === salaryNumberCell) {
      return isASC ? firstCell - secondCell : secondCell - firstCell;
    }

    return isASC
      ? firstCell.localeCompare(secondCell)
      : secondCell.localeCompare(firstCell);
  });

  tableBody.innerHTML = '';
  tableBody.append(...rows);
});

function getProcessedCellValue(row, targetIndex) {
  const cell = row.querySelectorAll('td')[targetIndex];

  return cell.innerText.replace(/[$,]/g, '');
}

// SELECTED ROW

tableBody.addEventListener('click', (e) => {
  const rows = tableBody.querySelectorAll('tr');

  rows.forEach((row) => {
    row.classList.remove('active');
  });
  e.target.parentNode.classList.add('active');
});

// CREATE FORM

table.insertAdjacentHTML(
  'afterend',
  `
  <form
    class="new-employee-form"
    action="/"
    method="get"
  >
    <label>
      Name:
        <input
          name="name"
          type="text"
          required
          data-qa="name"
        >
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        required
        data-qa="position"
      >
    </label>
    <label for="office">
      Office:
      <select
        name="office"
        required
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        name="age"
        type="number"
        required
        data-qa="age"
      >
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        required
        data-qa="salary"
      >
    </label>
    <button type="submit"> Save to table </button>
  </form>
`,
);

// ADDING A NEW EMPLOYEE

const form = document.querySelector('.new-employee-form');
const formName = form.querySelector('[data-qa="name"]');
const formPosition = form.querySelector('[data-qa="position"]');
const formAge = form.querySelector('[data-qa="age"]');
const formOffice = form.querySelector('[data-qa="office"]');
const formSalary = form.querySelector('[data-qa="salary"]');
const formButton = form.querySelector('button');

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (formName.value.length < 4) {
    pushNotification(
      `The name was entered incorrectly.`,
      `Name length should be at least 4 letters`,
      'error',
    );

    return;
  }

  const age = parseInt(formAge.value);

  if (isNaN(age) || age < 18 || age > 90) {
    pushNotification(
      `The age was entered incorrectly!`,
      `The age of the employee must be within 18-90 years.`,
      'error',
    );

    return;
  }

  const salary = parseFloat(formSalary.value);

  if (isNaN(salary) || salary < 100) {
    pushNotification(
      `The employee's salary was entered incorrectly.`,
      `The minimum salary should be $100.`,
      'error',
    );

    return;
  }

  document.querySelector('tbody').insertAdjacentHTML(
    'beforeend',
    `
    <tr>
      <td>${formName.value}</td>
      <td>${formPosition.value}</td>
      <td>${formOffice.value}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    </tr>
  `,
  );

  pushNotification(`Successful!`,
    `New employee is successfully added to the table`,
    'success'
  );

  form.reset();
});

// NOTIFICATION
const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', `${type}`);
  notification.style.top = `5px`;
  notification.style.right = `5px`;

  notification.insertAdjacentHTML(
    'beforeend',
    `
      <h2 class="title">
        ${title}
      </h2>
      <p>
        ${description}
      </p>
    `,
  );

  body.append(notification);

  setTimeout(() => notification.remove(), 5000);
};

//  EDITING BY DOUBLE-CLICK

tableBody.addEventListener('dblclick', (e) => {
  const index = e.target.cellIndex;
  const text = e.target.textContent;

  const NAME_INDEX = 0;
  const POSITION_INDEX = 1;
  const OFFICE_INDEX = 2;
  const AGE_INDEX = 3;
  const SALARY_INDEX = 4;

  e.target.textContent = '';

  let input = document.createElement('input');

  input.classList.add('cell-input');

  if (index === OFFICE_INDEX) {
    const selectCity = document.createElement('select');
    const cities = [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    cities.forEach((option) => {
      const city = document.createElement('option');

      city.textContent = option;
      selectCity.append(city);
    });
    input = selectCity;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    switch (index) {
      case NAME_INDEX:
        if (input.value.length < 4) {
          pushNotification(
            `The name was entered incorrectly.`,
            `Name length should be at least 4 letters`,
            'error',
          );

          e.target.textContent = text;
        } else {
          e.target.textContent = input.value;
        }

        break;

      case POSITION_INDEX:
        if (input.value.length < 4) {
          pushNotification(
            `The position was entered incorrectly.`,
            `Position length should be at least 4 letters`,
            'error',
          );

          e.target.textContent = text;
        } else {
          e.target.textContent = input.value;
        }

        break;

      case OFFICE_INDEX:
        if (input.value) {
          e.target.textContent = input.value;
        } else {
          e.target.textContent = text;
        }

        break;

      case AGE_INDEX:
        if (isNaN(input.value) || input.value < 18 || input.value > 90) {
          pushNotification(
            `The age was entered incorrectly!`,
            `The age of the employee must be within 18-90 years.`,
            'error',
          );

          e.target.textContent = text;
        } else {
          e.target.textContent = input.value;
        }

        break;

      case SALARY_INDEX:
        if (isNaN(input.value) || input.value < 100) {
          pushNotification(
            `The employee's salary was entered incorrectly.`,
            `The minimum salary should be $100.`,
            'error',
          );
          e.target.textContent = text;
        } else {
          e.target.textContent = '$'
            + Number(input.value).toLocaleString('en-US');
        }

        break;
    }

    input.remove();
  });

  input.addEventListener('keydown', (eventEnter) => {
    if (eventEnter.key === 'Enter') {
      input.blur();
    }
  });
});
