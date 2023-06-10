'use strict';

// Sort table
const tHead = document.querySelector('thead');
const tHeadItems = tHead.querySelectorAll('th');

const tBody = document.querySelector('tbody');
const trsBody = tBody.querySelectorAll('tr');

let lastActiveTrBody;
let sortedTrsBody;
let isClickedFirst = false;

tHeadItems.forEach((tHeadItem, index) => {
  tHeadItem.addEventListener('click', () => {
    isClickedFirst = !isClickedFirst;

    if (isClickedFirst) {
      if (index === 0 || index === 1 || index === 2) {
        sortedTrsBody = [...trsBody].sort((trBody1, trBody2) => {
          const trBody1String = trBody1.children[index].innerText;
          const trBody2String = trBody2.children[index].innerText;

          return trBody1String.localeCompare(trBody2String);
        });
      }

      if (index === 3) {
        sortedTrsBody = [...trsBody].sort((trBody1, trBody2) => {
          const trBody1String = trBody1.children[index].innerText;
          const trBody2String = trBody2.children[index].innerText;

          const trBody1Number = getSimpleNumber(trBody1String);
          const trBody2Number = getSimpleNumber(trBody2String);

          return trBody2Number - trBody1Number;
        });
      }

      if (index === 4) {
        sortedTrsBody = [...trsBody].sort((trBody1, trBody2) => {
          const trBody1String = trBody1.children[index].innerText;
          const trBody2String = trBody2.children[index].innerText;

          const trBody1Number = getAdvancedNumber(trBody1String);
          const trBody2Number = getAdvancedNumber(trBody2String);

          return trBody2Number - trBody1Number;
        });
      }
    } else {
      if (index === 0 || index === 1 || index === 2) {
        sortedTrsBody = [...trsBody].sort((trBody1, trBody2) => {
          const trBody1String = trBody1.children[index].innerText;
          const trBody2String = trBody2.children[index].innerText;

          return trBody2String.localeCompare(trBody1String);
        });
      }

      if (index === 3) {
        sortedTrsBody = [...trsBody].sort((trBody1, trBody2) => {
          const trBody1String = trBody1.children[index].innerText;
          const trBody2String = trBody2.children[index].innerText;

          const trBody1Number = getSimpleNumber(trBody1String);
          const trBody2Number = getSimpleNumber(trBody2String);

          return trBody1Number - trBody2Number;
        });
      }

      if (index === 4) {
        sortedTrsBody = [...trsBody].sort((trBody1, trBody2) => {
          const trBody1String = trBody1.children[index].innerText;
          const trBody2String = trBody2.children[index].innerText;

          const trBody1Number = getAdvancedNumber(trBody1String);
          const trBody2Number = getAdvancedNumber(trBody2String);

          return trBody1Number - trBody2Number;
        });
      }
    }

    sortedTrsBody.forEach(sortedTrBody => {
      tBody.append(sortedTrBody);
    });
  });
});

function getAdvancedNumber(string) {
  return +string.slice(1).split(',').join('');
}

function getSimpleNumber(string) {
  return +string;
}

// Add 'active' class
trsBody.forEach(trBody => {
  trBody.addEventListener('click', () => {
    if (lastActiveTrBody !== undefined && lastActiveTrBody !== null) {
      lastActiveTrBody.classList.remove('active');
    }

    trBody.classList.add('active');
    lastActiveTrBody = trBody;
  });
});

// Form
const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('action', '#');
form.setAttribute('method', 'post');

document.body.append(form);

// Labels, Inputs, Select and Button
for (let index = 1; index <= 5; index++) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  if (index === 3) {
    label.append(select);
  } else {
    label.append(input);
  }

  form.append(label);
}

// Labels
const labels = document.querySelectorAll('label');
const labelTexts = ['Name', 'Position', 'Office', 'Age', 'Salary'];

labels.forEach((label, index) => {
  label.insertAdjacentHTML('afterbegin', `
    ${labelTexts[index]}:
  `);
});

// Inputs
const inputs = document.querySelectorAll('input');
const inputTypes = ['text', 'text', 'number', 'number'];
const inputNames = ['name', 'position', 'age', 'salary'];

inputs.forEach((input, index) => {
  input.setAttribute('type', inputTypes[index]);
  input.setAttribute('name', inputNames[index]);
  input.setAttribute('data-qa', inputNames[index]);
});

// Select
const selectElement = document.querySelector('select');
const selectElementValues
  = ['Tokyo', 'Singapore', 'London', 'New York', 'Edinbrugh', 'San Francisco'];

selectElement.setAttribute('name', 'office');
selectElement.setAttribute('data-qa', 'office');

selectElementValues.forEach(selectElementValue => {
  const option = document.createElement('option');

  option.innerText = selectElementValue;
  selectElement.append(option);
});

// Button
const button = document.createElement('button');

button.classList.add('button');
button.setAttribute('type', 'submit');
button.innerText = 'Save to table';

form.append(button);

button.addEventListener('click', (e) => {
  const inputName = inputs[0];
  const inputPosition = inputs[1];
  const inputAge = inputs[2];
  const inputSalary = inputs[3];

  e.preventDefault();
  validateInputs(inputName, inputPosition, inputAge, inputSalary);

  const allValuesTrue
    = Object.values(validateObject).every(value => value === true);

  if (allValuesTrue) {
    addNewEmployee(inputs, selectElement);

    pushNotification(
      10,
      10,
      'Success!',
      'Data has been added to table!',
      'success'
    );

    form.reset();
  }
});

function addNewEmployee(inputsElements, select) {
  const tr = document.createElement('tr');
  const selectTd = document.createElement('td');

  selectTd.innerText = select.value;

  inputsElements.forEach((input, index) => {
    const td = document.createElement('td');

    if (index === 3) {
      td.innerText = `$${(+input.value).toLocaleString('en-US')}`;
    } else {
      td.innerText = input.value;
    }

    tr.append(td);
  });

  tr.insertBefore(selectTd, tr.children[2]);
  tBody.append(tr);
}

// Notification
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

// Validation
const validateObject = {
  name: false,
  position: false,
  age: false,
  salary: false,
};

function validateInputs(nameInput, positionInput, ageInput, salaryInput) {
  if (nameInput.value.length < 4) {
    return pushNotification(
      10,
      10,
      'Error!',
      'Name must not be less than 4 characters',
      'error'
    );
  } else {
    validateObject.name = true;
  }

  if (positionInput.value.length === 0) {
    return pushNotification(
      10,
      10,
      'Error!',
      'Please, fill the position',
      'error'
    );
  } else {
    validateObject.position = true;
  }

  if (
    parseInt(ageInput.value) < 18
    || parseInt(ageInput.value) > 90
  ) {
    return pushNotification(
      10,
      10,
      'Error!',
      'Age must be between 18 and 90',
      'error'
    );
  } else if (ageInput.value.length === 0) {
    return pushNotification(
      10,
      10,
      'Error!',
      'Please, fill the age',
      'error'
    );
  } else {
    validateObject.age = true;
  }

  if (salaryInput.value.length === 0) {
    return pushNotification(
      10,
      10,
      'Error!',
      'Please, fill the salary',
      'error'
    );
  } else {
    validateObject.salary = true;
  }
}

// Editing table
const allTds = tBody.querySelectorAll('td');

allTds.forEach(td => {
  td.addEventListener('dblclick', () => {
    const tdValue = td.innerText;

    if (isNaN(getSimpleNumber(tdValue)) && isNaN(getAdvancedNumber(tdValue))) {
      td.innerHTML = `
        <input
          class="cell-input"
          type="text"
          value="${tdValue}"
        >
      `;
    } else if (!isNaN(getAdvancedNumber(tdValue))) {
      td.innerHTML = `
        <input
          class="cell-input"
          type="text"
          value="${getAdvancedNumber(tdValue)}"
        >
      `;
    } else {
      td.innerHTML = `
        <input
          class="cell-input"
          type="number"
          value="${tdValue}"
        >
      `;
    }

    const tdInput = td.querySelector('input');

    tdInput.addEventListener('blur', () => {
      if (tdInput.value.length === 0) {
        td.innerHTML = td.innerText;
      } else {
        td.innerHTML = tdInput.value;
      }
    });

    tdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        if (tdInput.value.length === 0) {
          td.innerHTML = td.innerText;
        } else {
          td.innerHTML = tdInput.value;
        }
      }
    });
  });
});
