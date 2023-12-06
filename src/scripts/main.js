'use strict';

const HEADERS = {
  Name: 0,
  Position: 1,
  Office: 2,
  Age: 3,
  Salary: 4,
};
const NOTIFICATION_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

const body = document.body;
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const employeeRows = tbody.children;
const form = createNewEmployeeForm();

let descendingOrder = false;
let currentHeader = '';

function stringToNumber(currencyString) {
  const numericString = currencyString.replace(/[^0-9.-]+/g, '');
  const numericValue = parseFloat(numericString);

  return numericValue;
}

function numberToDollarString(input) {
  const number = Number(input);
  const currencyString = number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  return currencyString;
}

function createNewEmployeeForm() {
  const newForm = document.createElement('form');

  newForm.classList = 'new-employee-form';

  newForm.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name"></label>
    <label>
      Position: <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <button>Save to table</button>
  `;

  return newForm;
}

function sortEmployees(header) {
  return [...employeeRows].sort((em1, em2) => {
    let compareResult = em1.children[header].innerText.localeCompare(
      em2.children[header].innerText,
    );

    if (header === 4) {
      compareResult
        = stringToNumber(em1.children[header].innerText)
        - stringToNumber(em2.children[header].innerText);
    }

    return descendingOrder ? -compareResult : compareResult;
  });
}

function printNewTable(newEmployees) {
  tbody.innerHTML = '';
  newEmployees.forEach((emp) => tbody.append(emp));
}

function handleTableHeaderClick(e) {
  descendingOrder
    = currentHeader === e.target.innerText ? !descendingOrder : false;
  currentHeader = e.target.innerText;

  const newEmployees = sortEmployees(HEADERS[currentHeader]);

  printNewTable(newEmployees);
}

function handleFormButtonClick(e) {
  const { target } = e;
  const button = form.querySelector('button');

  if (target !== button) {
    return;
  }

  e.preventDefault();

  const formValues = Array.from(form.elements).reduce((acc, elem) => {
    if (elem.name) {
      acc[elem.name] = elem.value.trim();
    }

    return acc;
  }, {});

  if (!formValues.position || !formValues.office || !formValues.salary) {
    showNotification(
      'Error',
      'All inputs must be filled',
      NOTIFICATION_STATUS.ERROR,
    );

    return;
  }

  if (formValues.name.length < 4) {
    showNotification(
      'Wrong name',
      'Name must contain at least 4 characters',
      NOTIFICATION_STATUS.ERROR,
    );

    return;
  }

  const age = +formValues.age;

  if (isNaN(age) || age < 18 || age > 90) {
    showNotification(
      'Wrong age',
      'Age must be between 18 and 90',
      NOTIFICATION_STATUS.ERROR,
    );

    return;
  }

  showNotification(
    'Success',
    'Employee was created',
    NOTIFICATION_STATUS.SUCCESS,
  );

  addEmployeeToTable(formValues);
  form.reset();
}

function addEmployeeToTable(employee) {
  tbody.insertAdjacentHTML(
    'afterbegin',
    `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.office}</td>
        <td>${employee.age}</td>
        <td>${numberToDollarString(employee.salary)}</td>
      </tr>
    `,
  );
}

function showNotification(title, description, type) {
  const notification = document.createElement('div');
  const titleContext = document.createElement('h2');
  const descriptionContext = document.createElement('p');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  titleContext.classList.add('title');
  titleContext.innerText = title;

  descriptionContext.innerText = description;

  notification.append(titleContext, descriptionContext);
  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function editOnDblclick(e) {
  const target = e.target;

  if (target.tagName === 'TD') {
    const parentRow = target.parentElement;

    const originalText = target.innerText;
    const newInput = document.createElement('INPUT');

    newInput.classList.add('cell-input');
    newInput.value = originalText;

    if (target === parentRow.children[3] || target === parentRow.children[4]) {
      newInput.setAttribute('type', 'number');

      if (target === parentRow.children[4]) {
        newInput.classList.add('salary');
      }
    }

    target.innerText = '';
    target.append(newInput);
    newInput.focus();

    newInput.addEventListener('blur', () => {
      handleInput(newInput, target, originalText);
    });

    newInput.addEventListener('keypress', (press) => {
      if (press.key === 'Enter') {
        handleInput(newInput, target, originalText);
      }
    });
  }
}

function handleInput(input, target, originalText) {
  target.innerText = input.value.trim() || originalText;

  if (input.classList.contains('salary')) {
    target.innerText = numberToDollarString(input.value);
  }
}

body.append(form);

[...employeeRows].forEach((employeeCell) =>
  employeeCell.addEventListener('click', () => {
    [...employeeRows].forEach((elem) => {
      elem.classList = '';
    });
    employeeCell.classList.add('active');
  }),
);

form.addEventListener('click', handleFormButtonClick);
thead.addEventListener('click', handleTableHeaderClick);
tbody.addEventListener('dblclick', editOnDblclick);
