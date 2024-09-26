'use strict';

const tableBody = document.querySelector('tbody');

// Add 'active' class
let lastActiveTr;

tableBody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  addActiveClass(tr);
});

function addActiveClass(tr) {
  const activeClass = 'active';

  if (lastActiveTr) {
    lastActiveTr.classList.remove(activeClass);
  }

  lastActiveTr = tr;
  lastActiveTr.classList.add(activeClass);
}

// Form
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('action', '#');
form.setAttribute('method', 'post');

document.body.append(form);

// Inputs, labels and select
function createFormElement(
  labelText,
  element,
  elementName,
  elementQa,
  elementType,
  elementValues
) {
  // Label
  const label = document.createElement('label');

  label.innerText = labelText;
  form.append(label);

  // Input || Select
  let unit = document.createElement('input');

  unit.setAttribute('type', elementType);

  if (element === 'select') {
    unit = document.createElement('select');
    unit.removeAttribute('type');

    for (const value of elementValues) {
      const option = document.createElement('option');

      option.innerText = value;
      unit.append(option);
    }
  }

  unit.setAttribute('name', elementName);
  unit.setAttribute('data-qa', elementQa);
  label.append(unit);
}

// Name
createFormElement(
  'Name:',
  'input',
  'name',
  'name',
  'text'
);

// Position
createFormElement(
  'Position',
  'input',
  'position',
  'position',
  'text'
);

// Office
const selectValues = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinbrugh',
  'San Francisco',
];

createFormElement(
  'Office:',
  'select',
  'office',
  'office',
  null,
  selectValues,
);

// Age
createFormElement(
  'Age:',
  'input',
  'age',
  'age',
  'number',
);

// Salary
createFormElement(
  'Salary:',
  'input',
  'salary',
  'salary',
  'number',
);

// Button
const button = document.createElement('button');

button.classList.add('button');
button.innerText = 'Save to table';
button.setAttribute('type', 'submit');

form.append(button);

// Validation
const validateObject = {
  name: false,
  position: false,
  age: false,
  salary: false,
};

const inputs = document.querySelectorAll('input');
const select = document.querySelector('select');

button.addEventListener('click', (e) => {
  e.preventDefault();
  validateInputs(inputs);

  const isCorrectData
    = Object.values(validateObject).every(value => value === true);

  if (isCorrectData) {
    addNewEmployee(inputs, select);
    form.reset();
  }
});

function validateInputs(allInputs) {
  let isValid = true;

  allInputs.forEach(input => {
    if (!isValid) {
      return;
    }

    switch (input.name) {
      case 'name': {
        isValid = validateName(input);
        break;
      }

      case 'position': {
        isValid = validatePosition(input);
        break;
      }

      case 'age': {
        isValid = validateAge(input);
        break;
      }

      case 'salary': {
        isValid = validateSalary(input);
        break;
      }
    }
  });
}

function validateName(input) {
  switch (true) {
    case input.value.length < 4: {
      pushNotification(
        10,
        10,
        'Error!',
        'Name mustn`t be less than 4 characters!',
        'error'
      );

      return false;
    }

    case input.value.length === 0: {
      pushNotification(
        10,
        10,
        'Error!',
        'Please, fill name!',
        'error'
      );

      return false;
    }

    case !isNaN(+input.value): {
      pushNotification(
        10,
        10,
        'Error!',
        'Name can`t a number!',
        'error'
      );

      return false;
    }

    default: {
      validateObject.name = true;

      return true;
    }
  }
}

function validatePosition(input) {
  switch (true) {
    case input.value.length === 0: {
      pushNotification(
        10,
        10,
        'Error!',
        'Please, fill position!',
        'error'
      );

      return false;
    }

    case !isNaN(+input.value): {
      pushNotification(
        10,
        10,
        'Error!',
        'Position can`t a number!',
        'error'
      );

      return false;
    }

    default: {
      validateObject.position = true;

      return true;
    }
  }
}

function validateAge(input) {
  const numberValue = getSimpleNumber(input.value);

  switch (true) {
    case numberValue < 18 || numberValue > 90: {
      pushNotification(
        10,
        10,
        'Error!',
        'Age must be between 18 and 90!',
        'error'
      );

      return false;
    }

    case input.value.length === 0: {
      pushNotification(
        10,
        10,
        'Error!',
        'Please, fill the age!',
        'error'
      );

      return false;
    }

    default: {
      validateObject.age = true;

      return true;
    }
  }
}

function validateSalary(input) {
  switch (true) {
    case input.value.length === 0: {
      pushNotification(
        10,
        10,
        'Error!',
        'Please, fill salary!',
        'error'
      );

      return false;
    }

    default: {
      validateObject.salary = true;

      return true;
    }
  }
}

// Add new Employee
function addNewEmployee(allInputs, selectElement) {
  const tr = document.createElement('tr');
  const index = [...allInputs].findIndex(input => {
    return input.name === 'age';
  });
  const selectTd = document.createElement('td');

  selectTd.innerText = selectElement.value;

  allInputs.forEach(input => {
    const td = document.createElement('td');

    if (input.name === 'salary') {
      td.innerText = `$${(+input.value).toLocaleString('en-US')}`;
    } else {
      td.innerText = input.value;
    }

    tr.append(td);
  });

  tr.insertBefore(selectTd, tr.children[index]);
  tableBody.append(tr);
}

// Help functions
function getSimpleNumber(string) {
  if (string === '' || string.trim() === '') {
    return NaN;
  }

  return +string;
}

function getAdvancedNumber(string) {
  if (string === '' || string.trim() === '') {
    return NaN;
  }

  return +string.slice(1).split(',').join('');
}

function pushNotification(posTop, posRight, title, description, type) {
  const notificationBody = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notificationBody.classList.add('notification', type);
  notificationBody.style.top = `${posTop}px`;
  notificationBody.style.right = `${posRight}px`;

  notificationTitle.classList.add('title');
  notificationTitle.innerText = title;
  notificationBody.append(notificationTitle);

  notificationText.innerText = description;
  notificationBody.append(notificationText);

  document.body.prepend(notificationBody);

  setTimeout(() => {
    notificationBody.remove();
  }, 2000);
};

// Edit table data
tableBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  setInput(td);
});

function setInput(td) {
  const cellInput = document.createElement('input');
  const tdData = td.innerText;

  cellInput.classList.add('cell-input');

  if (
    isNaN(getSimpleNumber(tdData))
    && isNaN(getAdvancedNumber(tdData))
  ) {
    cellInput.setAttribute('type', 'text');
    cellInput.value = tdData;
  } else {
    cellInput.setAttribute('type', 'number');

    if (!isNaN(getSimpleNumber(tdData))) {
      cellInput.value = tdData;
    } else {
      cellInput.value = `${getAdvancedNumber(tdData)}`;
    }
  }

  td.innerText = '';
  td.append(cellInput);

  cellInput.addEventListener('blur', () => {
    if (cellInput.value.length === 0 || cellInput.value === '') {
      td.innerText = tdData;
    } else if (tdData.includes('$')) {
      td.innerText = `$${(+cellInput.value).toLocaleString('en-US')}`;
    } else {
      td.innerText = cellInput.value;
    }
  });
}
