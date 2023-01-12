'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let editableInput = '';
let clickCounter = 0;
let prevSort = '';
let activeRow = '';

thead.addEventListener('click', (ev) => {
  const empoyees = document.querySelector('tbody');
  const staff = document.querySelectorAll('tbody tr');
  const cellNum = ev.target.cellIndex;
  const cellData = staff[0].children[cellNum].textContent;
  const cellDataType = getDataType(cellData);

  if (prevSort === ev.target) {
    clickCounter++;
  } else {
    clickCounter = 0;
  }

  const sortedStaff = [...staff].sort((row1, row2) => {
    let firstCell = row1.children[cellNum].textContent;
    let secondCell = row2.children[cellNum].textContent;

    if (clickCounter % 2 !== 0) {
      firstCell = row2.children[cellNum].textContent;
      secondCell = row1.children[cellNum].textContent;
    }

    switch (cellDataType) {
      case 'num':
        return firstCell - secondCell;
      case 'usd':
        return getNumFromUSD(firstCell) - getNumFromUSD(secondCell);
      default:
        return firstCell.localeCompare(secondCell);
    }
  });

  sortedStaff.forEach(row => {
    empoyees.append(row);
  });

  prevSort = ev.target;
});

tbody.addEventListener('click', (ev) => {
  const clickedRow = ev.target.closest('tr');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
  activeRow = clickedRow;
});

document.addEventListener('click', (ev) => {
  if (ev.target.tagName === 'BODY' && activeRow) {
    activeRow.classList.remove('active');
    activeRow = '';
  }
});

document.body.insertAdjacentHTML('beforeend', `
  <form action="/" class="new-employee-form">
  <label>Name: <input type="text" name="name" data-qa="name"></label>
  <label>
    Position:
    <input type="text" name="position" data-qa="position">
  </label>
  <label>
    Office:
    <select name="office" data-qa="office">
      <option disabled selected hidden value="">Select city</option>
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="london">London</option>
      <option value="new-york">New York</option>
      <option value="edinburgh">Edinburgh</option>
      <option value="san-francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input type="number" name="age" data-qa="age"></label>
  <label>Salary: <input type="number" name="salary" data-qa="salary"></label>
  <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  const errors = validateData(data);
  const validationResult = errors.length > 0 ? 'error' : 'success';
  const notificationMessage = validationResult === 'success'
    ? `Congratulations!<br>New employee was successfully added.`
    : errors.join('<br>');

  if (validationResult === 'error') {
    pushNotification(validationResult, `
      Please correct the following errors:<br><br>
      ${notificationMessage}
    `);

    return;
  }

  addNewEmployee(data);
  pushNotification(validationResult, notificationMessage);
});

const table = document.querySelector('tbody');

table.addEventListener('dblclick', (ev) => {
  if (editableInput) {
    pushNotification('warning', `
      ${editableInput} is not saved!<br>
      Please enter correct data and press 'Enter'.
    `);

    return;
  };

  const targetCell = ev.target.closest('td');
  const cellInitValue = targetCell.textContent;
  const cellIndex = targetCell.cellIndex;
  const cellCategory = thead.children[0].children[cellIndex].textContent;
  const input = generateInput(cellInitValue, cellCategory);

  editableInput = cellCategory;
  targetCell.textContent = '';
  targetCell.append(input);

  input.addEventListener('blur', (e) => {
    saveAndExit(e);
  });

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      saveAndExit(e);
    }
  });

  function saveAndExit(e) {
    const field = targetCell.querySelector('.cell-input');
    const validationResult = validateInputData(field.value, cellCategory);

    if (validationResult === 'error' && e.type === 'blur') {
      pushNotification(validationResult, `
        ${cellCategory} is not valid. Please correct!
      `);
    }

    if (validationResult === 'error') {
      targetCell.textContent = cellInitValue;
      input.remove();
      editableInput = '';

      return;
    }

    const enteredData = normalizeInputData(field.value, cellCategory);

    targetCell.textContent = enteredData;

    if (e.type === 'blur') {
      pushNotification(validationResult, `
        ${cellCategory} is saved.
      `);
    }

    editableInput = '';
    input.remove();
  };
});

function pushNotification(result, description) {
  const notification = `
    <div
      class="notification ${result}"
      data-qa="notification"
    >
      <h2 class="title">${capitalizeText(result)}</h2>
      <p>${description}</p>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', notification);

  const message = document.querySelector(`.${result}`);

  setTimeout(() => {
    message.remove();
  }, 3000);
};

function getDataType(data) {
  if (Number.isInteger(+data)) {
    return 'num';
  } else if (data.startsWith('$')) {
    return 'usd';
  } else {
    return 'str';
  }
};

function getNumFromUSD(usd) {
  return +usd.slice(1).split(',').join('');
};

function getUSDFromNum(num) {
  const usd = +num;

  return '$' + usd.toLocaleString('en-US');
};

function capitalizeText(str) {
  if (!str) {
    return;
  }

  const parts = (str.includes('-')) ? str.split('-') : str.split(' ');

  return parts.map(part => {
    return part.slice(0, 1).toUpperCase() + part.slice(1);
  }).join(' ');
};

function validateData(obj) {
  const validationResults = {
    nameIsValid: obj.name.length >= 4,
    positionIsValid: !!obj.position,
    officeIsValid: !!obj.office,
    ageIsValid: obj.age >= 18 && obj.age <= 90,
    salaryIsValid: obj.salary > 0,
  };

  const inputs = Object.entries(validationResults);
  const invalidEntries = inputs.filter(input => {
    return input[1] === false;
  });
  const invalidFields = [];

  invalidEntries.forEach(entry => {
    const index = entry[0].indexOf('IsValid');

    invalidFields.push(capitalizeText(entry[0].slice(0, index)));
  });

  const errorsList = invalidFields.map(field => {
    switch (field) {
      case 'Name':
        return `- ${field} length is less than 4 letters`;
      case 'Position':
        return `- ${field} is not specified`;
      case 'Office':
        return `- ${field} city is not specified`;
      case 'Age':
        return `- ${field} is not in range from 18 to 90`;
      case 'Salary':
        return `- ${field} is not specified`;
      default:
        return '- Unexpected error';
    }
  });

  return errorsList;
};

function addNewEmployee(data) {
  const newEmployee = document.createElement('tr');

  newEmployee.innerHTML = `
    <td>${capitalizeText(data.name)}</td>
    <td>${capitalizeText(data.position)}</td>
    <td>${capitalizeText(data.office)}</td>
    <td>${data.age}</td>
    <td>${getUSDFromNum(data.salary)}</td>
  `;

  tbody.append(newEmployee);
  form.reset();
};

function generateInput(value, category) {
  const container = document.createElement('div');

  switch (category) {
    case ('Salary'):
      container.innerHTML = `
        <input
          type="number"
          class="cell-input"
          value="${getNumFromUSD(value)}"
          autofocus
        >
      `;
      break;

    case ('Age'):
      container.innerHTML = `
        <input
          type="number"
          class="cell-input"
          value="${value}"
          autofocus
        >
      `;
      break;

    case ('Office'):
      container.innerHTML = `
        <select name="office" class="cell-input">
          <option value="tokyo">Tokyo</option>
          <option value="singapore">Singapore</option>
          <option value="london">London</option>
          <option value="new-york">New York</option>
          <option value="edinburgh">Edinburgh</option>
          <option value="san-francisco">San Francisco</option>
        </select>
      `;

      const options = container.querySelectorAll('option');

      [...options].find(option => {
        return option.textContent === value;
      }).setAttribute('selected', true);
      break;

    default:
      container.innerHTML = `
        <input
          type="text"
          class="cell-input"
          value="${value}"
          autofocus
        >
      `;
  };

  return container.querySelector('.cell-input');
};

function validateInputData(data, category) {
  switch (category) {
    case 'Salary':
      return data > 0 ? 'success' : 'error';
    case 'Age':
      return data >= 18 && data <= 90 ? 'success' : 'error';
    case 'Name':
      return data.length >= 4 ? 'success' : 'error';
    default:
      return data ? 'success' : 'error';
  };
};

function normalizeInputData(data, category) {
  switch (category) {
    case 'Salary':
      return getUSDFromNum(data);
    case 'Age':
      return data;
    default:
      return capitalizeText(data);
  };
};
