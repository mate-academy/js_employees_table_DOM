'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
let sortColumn = -1;
let isASC = true;
let selectedRow = null;
const form = document.createElement('form');
const inputNames = ['name', 'position', 'age', 'salary', 'office'];

form.className = 'new-employee-form';

for (const inputName of inputNames) {
  const label = document.createElement('label');
  const input =
    inputName === 'office'
      ? document.createElement('select')
      : document.createElement('input');

  input.name = inputName;
  input.required = true;
  input.dataset.qa = inputName;
  label.textContent = inputName[0].toUpperCase() + inputName.slice(1);

  if (inputName === 'salary' || inputName === 'age') {
    input.type = 'number';
  } else if (inputName !== 'office') {
    input.type = 'text';
  }

  if (inputName === 'position') {
    input.required = false;
  }

  if (input.tagName === 'SELECT') {
    input.required = false;

    const officeOptions = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    for (const officeName of officeOptions) {
      const option = document.createElement('option');

      option.textContent = officeName;
      option.value = officeName;
      input.append(option);
    }
  }

  label.append(input);
  form.append(label);
}

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to  table';
form.append(submitButton);

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const elements = form.elements;

  if (elements.name.value.length < 4) {
    pushNotification(
      'Invalid input',
      'Name should have more then 3 letters',
      'error',
    );

    return;
  }

  if (elements.age.value < 18) {
    pushNotification('Invalid input', 'The employee is too young', 'error');

    return;
  }

  if (elements.age.value > 90) {
    pushNotification('Invalid input', 'The employee is too old', 'error');

    return;
  }

  if (!elements.position.value.length) {
    pushNotification('Invalid input', 'The position is required', 'error');

    return;
  }

  addEmployee(
    elements.name.value,
    elements.position.value,
    elements.office.value,
    elements.age.value,
    elements.salary.value,
  );

  pushNotification(
    'Success!',
    'The employee is successfully added to the table',
    'success',
  );
});

table.querySelector('thead').addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName !== 'TH') {
    return;
  }

  for (let i = 0; i < target.parentElement.children.length; i++) {
    if (target.parentElement.children[i] === target) {
      if (i === sortColumn) {
        isASC = !isASC;
      } else {
        isASC = true;
      }
      sortColumn = i;
      break;
    }
  }

  if (sortColumn < 0) {
    return;
  }

  const sorted = [...tableBody.rows].sort((row1, row2) => {
    let row1Column = row1.children[sortColumn].textContent;
    let row2Column = row2.children[sortColumn].textContent;

    if (/^\$/.test(row1Column)) {
      row1Column = +row1Column.replace(/\$|,/g, '');
      row2Column = +row2Column.replace(/\$|,/g, '');
    }

    return compare(row1Column, row2Column);
  });

  tableBody.append(...sorted);

  function compare(elem1, elem2) {
    const first = isASC ? elem1 : elem2;
    const second = isASC ? elem2 : elem1;

    switch (typeof elem1) {
      case 'string':
        return first.localeCompare(second);
      case 'number':
        return first - second;
    }
  }
});

tableBody.addEventListener('click', (e) => {
  let target = e.target;

  while (target.tagName !== 'TR') {
    if (target === null) {
      return;
    }

    target = target.parentElement;
  }

  if (selectedRow !== target && selectedRow !== null) {
    selectedRow.classList.remove('active');
  }
  selectedRow = target;
  target.classList.add('active');
});

const pushNotification = (title, description, type) => {
  const notification = Object.assign(document.createElement('div'), {
    className: `notification ${type}`,
  });

  notification.dataset.qa = 'notification';

  const notificationTitle = Object.assign(document.createElement('h2'), {
    textContent: title,
    className: 'title',
  });
  const notificationDescription = Object.assign(document.createElement('p'), {
    textContent: description,
  });

  notification.append(notificationTitle, notificationDescription);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

function addEmployee(fullname, position, office, age, salary) {
  const employeeRow = document.createElement('tr');
  const employeeData = [fullname, position, office, age, convertSalary(salary)];

  for (const data of employeeData) {
    const cell = document.createElement('td');

    cell.textContent = data;
    employeeRow.append(cell);
  }

  tableBody.append(employeeRow);

  function convertSalary(number) {
    return '$' + (+number).toLocaleString('en-US');
  }
}
