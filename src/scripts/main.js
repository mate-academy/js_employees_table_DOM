'use strict';

// Employee table
const employeeTable = document.querySelector('table');

// Sorting function
function sortBy(table, type) {
  const theadRowElements = [...table.querySelector('thead tr').children];
  const tbody = table.querySelector('tbody');
  const tbodyRows = Array.from(table.querySelectorAll('tbody tr'));
  const typesObj = [];
  const index = theadRowElements.findIndex(
    (th) => th.textContent.trim() === type,
  );

  if (index === -1) {
    throw new Error('wrong type');
  }

  for (const el of tbodyRows) {
    typesObj.push({
      content: el.children[index].textContent,
      el: el,
    });
  }

  const isNumeric = !isNaN(
    parseFloat(typesObj[0].content.replace(/[$,]/g, '')),
  );

  if (isNumeric) {
    typesObj.sort(
      (a, b) =>
        parseFloat(a.content.replace(/[$,]/g, '')) -
        parseFloat(b.content.replace(/[$,]/g, '')),
    );
  } else {
    typesObj.sort((a, b) => a.content.localeCompare(b.content));
  }

  typesObj.forEach((item) => tbody.append(item.el));
}

// Sort table by type
employeeTable.addEventListener('click', function (e) {
  if (e.target.closest('thead th')) {
    const currentType = e.target.closest('thead th').textContent.trim();

    sortBy(employeeTable, currentType);

    if (document.querySelector('.notification')) {
      document.querySelector('.notification').remove();
    }
  }
});

// New employee form elements;
const newEmployeeForm = document.createElement('form');
const newEmployeeInput = document.createElement('input');
const newEmployeeSelect = document.createElement('select');
const newEmployeeLabel = document.createElement('label');
const newEmployeeButton = document.createElement('button');
const countriesForSelect = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// Get all types;
const tableTypes = employeeTable.querySelector('thead tr').children;

// Starting building form
document.body.append(newEmployeeForm);

newEmployeeForm.classList.add('new-employee-form');

for (let i = 0; i < tableTypes.length; i++) {
  const labelClone = newEmployeeLabel.cloneNode();
  const inputClone = newEmployeeInput.cloneNode();

  labelClone.textContent = tableTypes[i].textContent + ':';
  newEmployeeForm.append(labelClone);

  if (tableTypes[i].textContent !== 'Office') {
    labelClone.append(inputClone);
    inputClone.setAttribute('type', 'text');
    inputClone.setAttribute('name', tableTypes[i].textContent);
    inputClone.setAttribute('data-qa', tableTypes[i].textContent.toLowerCase());
  } else {
    labelClone.append(newEmployeeSelect);
    newEmployeeSelect.setAttribute('name', tableTypes[i].textContent);

    newEmployeeSelect.setAttribute(
      'data-qa',
      tableTypes[i].textContent.toLowerCase(),
    );

    for (let n = 0; n < countriesForSelect.length; n++) {
      const selectOption = document.createElement('option');

      selectOption.textContent = countriesForSelect[n];
      selectOption.setAttribute('value', countriesForSelect[n]);
      newEmployeeSelect.append(selectOption);
    }
  }
}

newEmployeeForm.append(newEmployeeButton);
newEmployeeButton.textContent = 'Save to table';

// Add event on 'submit'
newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  clearNotification();

  const inputNameValue =
    newEmployeeForm.querySelector('input[name=Name]').value;
  const inputPositionValue = newEmployeeForm.querySelector(
    'input[name=Position]',
  ).value;
  const selectOfficeValue = newEmployeeForm.querySelector('select').value;
  const inputAgeValue = newEmployeeForm.querySelector('input[name=Age]').value;
  const inputSalaryValue =
    newEmployeeForm.querySelector('input[name=Salary]').value;

  const message = validateForm(
    inputNameValue,
    inputPositionValue,
    inputAgeValue,
    inputSalaryValue,
  );

  if (message !== 'New employee is successfully added to the table') {
    showNotification(message);

    return null;
  }

  showNotification(message);

  addEmployeeToTable(
    inputNameValue,
    inputPositionValue,
    selectOfficeValue,
    inputAgeValue,
    inputSalaryValue,
  );
});

function clearNotification() {
  const existingNotification = document.querySelector('.notification');

  if (existingNotification) {
    existingNotification.remove();
  }
}

function validateForm(nameValue, positionValue, ageValue, salaryValue) {
  if (nameValue.length === 0) {
    return 'Name cannot be empty';
  }

  if (!isNaN(Number(nameValue))) {
    return 'Name cannot be a number';
  }

  if (nameValue.length < 4) {
    return 'Name must have at least 4 letters';
  }

  if (positionValue.length === 0) {
    return 'Position cannot be empty';
  }

  if (!isNaN(Number(positionValue))) {
    return 'Position cannot be a number';
  }

  if (ageValue.length === 0) {
    return 'Age cannot be empty';
  }

  if (isNaN(Number(ageValue))) {
    return 'Age must be a number';
  }

  if (Number(ageValue) < 18 || Number(ageValue) > 90) {
    return 'Age value is less than 18 or more than 90';
  }

  if (salaryValue.length === 0) {
    return 'Salary cannot be empty';
  }

  if (isNaN(Number(salaryValue))) {
    return 'Salary must be a number';
  }

  if (salaryValue[0] === '0') {
    return 'Salary cannot start from 0';
  }

  return 'New employee is successfully added to the table';
}

function formatSalary(salary) {
  return `$${Number(salary).toLocaleString('en-US')}`;
}

function showNotification(message) {
  const formNotification = document.createElement('div');
  const notificationMessage = document.createElement('p');

  formNotification.setAttribute('data-qa', 'notification');
  notificationMessage.classList.add('title');

  if (message !== 'New employee is successfully added to the table') {
    formNotification.classList.add('notification', 'error');
  } else {
    formNotification.classList.add('notification', 'success');
  }

  notificationMessage.textContent = message;
  formNotification.append(notificationMessage);
  document.body.append(formNotification);
}

function addEmployeeToTable(
  nameValue,
  positionValue,
  selectValue,
  ageValue,
  salaryValue,
) {
  const values = [
    nameValue,
    positionValue,
    selectValue,
    ageValue,
    formatSalary(salaryValue),
  ];

  const tbody = employeeTable.querySelector('tbody');
  const newRow = document.createElement('tr');

  values.forEach((value) => {
    const newCell = document.createElement('td');

    newCell.textContent = value;
    newRow.append(newCell);
  });

  tbody.append(newRow);
  newEmployeeForm.reset();
}
