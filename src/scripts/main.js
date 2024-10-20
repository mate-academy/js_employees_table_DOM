'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('table tbody');
const wrapperForm = document.createElement('div');

wrapperForm.style.cssText = `display: flex; flex-direction: column; row-gap: 20px; position: relative`;

// --------------------SORTING OF TABLE
table.addEventListener('click', (e) => {
  const target = e.target.closest('thead th');

  if (!target) {
    return;
  }

  setAttr(target);

  sort(target);
});

// CHANGE STYLES FOR CURRENT ROW
table.addEventListener('click', (e) => {
  const target = e.target.closest('tbody tr');

  if (!target) {
    return;
  }

  [...tbody.rows].forEach((el) => {
    el.classList.remove('active');
  });

  target.classList.add('active');
});

// ---------------------ATTRIBUTE SETTING TO CONTROL SORTING
function setAttr(elem) {
  let currentAttr = null;

  if (!elem.hasAttribute('data-sort')) {
    currentAttr = 'asc';
  } else {
    currentAttr = elem.dataset.sort === 'asc' ? 'desc' : 'asc';
  }

  const thead = [...table.rows[0].cells];

  thead.forEach((el) => {
    el.removeAttribute('data-sort');
  });

  elem.setAttribute('data-sort', currentAttr);
}

//  -------------------------SORTING ELEMENTS
function sort(elem) {
  // WE FIND THE COLUMN INDEX NUMBER
  const thead = [...table.rows[0].cells];
  const currentPos = thead.indexOf(elem);

  const tableBody = [...table.rows].slice(1, -1).sort((a, b) => {
    let firstValue = a.cells[currentPos].innerHTML;
    let secondValue = b.cells[currentPos].innerHTML;

    // WE CHECK WHETHER THESE ARE NUMBERS
    if (!isNaN(parseFloat(firstValue)) || firstValue.includes('$')) {
      if (firstValue.includes('$')) {
        firstValue = firstValue.slice(1).replace(',', '.');
        secondValue = secondValue.slice(1).replace(',', '.');
      }

      return +firstValue - +secondValue;
    }

    return firstValue > secondValue ? 1 : -1;
  });

  if (elem.dataset.sort === 'desc') {
    table.tBodies[0].append(...tableBody.reverse());
  } else {
    table.tBodies[0].append(...tableBody);
  }
}

function createNewForm() {
  const formEmployee = document.createElement('form');
  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.textContent = 'Save to table';

  formEmployee.classList.add('new-employee-form');
  formEmployee.append(createInput('name', 'text', 'input'));
  formEmployee.append(createInput('position', 'text', 'input'));

  formEmployee.append(
    createInput('office', '', 'select', [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ]),
  );
  formEmployee.append(createInput('age', 'number', 'input'));
  formEmployee.append(createInput('salary', 'number', 'input'));
  formEmployee.append(button);
  wrapperForm.append(formEmployee);
  wrapperForm.style.alignSelf = 'flex-start';
  document.body.append(wrapperForm);
}

createNewForm();

function createInput(value, type, typeInput, array = null) {
  const label = document.createElement('label');
  const input = document.createElement(typeInput);

  input.setAttribute('name', value);
  input.setAttribute('required', '');
  input.setAttribute('data-qa', value);

  if (typeInput === 'select') {
    array.forEach((elem) => {
      const option = document.createElement('option');

      option.setAttribute('value', elem);
      option.textContent = elem;
      input.append(option);
    });
  }

  label.textContent = `${value[0].toUpperCase()}${value.slice(1)}:`;

  label.append(input);

  input.setAttribute('type', type);

  return label;
}

const form = document.querySelector('form');
const fullName = form.querySelector('[data-qa="name"');
const position = form.querySelector('[data-qa="position"');
const office = form.querySelector('[data-qa="office"');
const age = form.querySelector('[data-qa="age"');
const salary = form.querySelector('[data-qa="salary"');

// ADD NEW EMPLOYEE IN THE TABLE
form.addEventListener('submit', addNewEmployeeInTable);

function addNewEmployeeInTable(e) {
  e.preventDefault();

  if (!checkValidate()) {
    return;
  }

  const newRow = document.createElement('tr');

  const salaryChange = `$${salary.value},000`;

  const listInfo = [
    fullName.value,
    position.value,
    office.value,
    age.value,
    salaryChange,
  ];

  listInfo.forEach((elem) => {
    const newCol = document.createElement('td');

    newCol.textContent = elem;
    newRow.append(newCol);
  });

  tbody.append(newRow);

  pushNotification(
    'Success',
    'The employee has been successfully added to the database.',
    ['notification', 'success'],
  );

  form.reset();
}

function checkValidate() {
  if (fullName.value.length < 4) {
    pushNotification(
      'Error of name',
      'The value of "Name" must be at least 4 letters.',
      ['notification', 'error'],
    );

    return false;
  }

  if (age.value < 18 || age.value > 90) {
    pushNotification(
      'Error of age',
      'Unfortunately, there is an age restriction.',
      ['notification', 'error'],
    );

    return false;
  }

  return true;
}

function pushNotification(title, description, arrayClasses) {
  const message = document.createElement('div');
  const titleMessage = document.createElement('h2');
  const textMessage = document.createElement('p');

  arrayClasses.forEach((el) => {
    message.classList.add(el);
  });

  message.setAttribute('data-qa', 'notification');
  titleMessage.classList.add('title');

  titleMessage.textContent = title;
  textMessage.textContent = description;

  message.style.cssText = `position: relative; left: 24px; padding: 1px 24px; color: #f5f5f5;`;

  message.append(titleMessage);
  message.append(textMessage);
  wrapperForm.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}
