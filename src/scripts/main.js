'use strict';

const table = document.querySelector('table');
// form
const form = document.createElement('form');

form.className = 'new-employee-form';

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name:';

const nameInput = document.createElement('input');

nameInput.setAttribute('type', 'text');
nameInput.setAttribute('data-qa', 'name');
nameInput.setAttribute('name', 'name');
// nameInput.setAttribute('required', 'true');
nameLabel.appendChild(nameInput);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position:';

const positionInput = document.createElement('input');

positionInput.setAttribute('type', 'text');
positionInput.setAttribute('data-qa', 'position');
positionInput.setAttribute('name', 'position');
// positionInput.setAttribute('required', 'true');
positionLabel.appendChild(positionInput);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age:';

const ageInput = document.createElement('input');

ageInput.setAttribute('type', 'number');
ageInput.setAttribute('data-qa', 'age');
ageInput.setAttribute('name', 'age');
// ageInput.setAttribute('required', 'true');
ageLabel.appendChild(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary:';

const salaryInput = document.createElement('input');

salaryInput.setAttribute('type', 'number');
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.setAttribute('name', 'salary');
// salaryInput.setAttribute('required', 'true');
salaryLabel.appendChild(salaryInput);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const officeSelect = document.createElement('select');

officeSelect.setAttribute('data-qa', 'office');
officeSelect.setAttribute('name', 'office');
// officeSelect.setAttribute('required', 'true');

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const officeName of offices) {
  const option = document.createElement('option');

  option.textContent = officeName;
  officeSelect.appendChild(option);
}
officeLabel.appendChild(officeSelect);

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

const formElements = [
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  button,
];

for (const el of formElements) {
  form.appendChild(el);
}

table.insertAdjacentElement('afterend', form);

// function form
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fd = new FormData(form);
  const formDataObj = Object.fromEntries(fd);
  const salary = formDataObj.salary;
  let isValid = true;

  if (formDataObj.name.length < 4) {
    pushNotification(
      160,
      10,
      'Incorrectly entered employee name!',
      'Make sure your name is more than four characters long.',
      'error',
    );
    isValid = false;
  }

  if (formDataObj.position.length === 0) {
    pushNotification(
      310,
      10,
      'Incorrectly entered employee position!',
      'Make sure your position is more than four characters long.',
      'error',
    );
    isValid = false;
  }

  if (formDataObj.salary.length === 0) {
    pushNotification(
      610,
      10,
      'Incorrectly entered employee salary!',
      'Make sure your salary is not empty.',
      'error',
    );
    isValid = false;
  }

  if (
    formDataObj.age.length === 0 ||
    parseInt(formDataObj.age) < 18 ||
    parseInt(formDataObj.age) > 90
  ) {
    pushNotification(
      460,
      10,
      "The employee's age was entered incorrectly!",
      'Check that your employee is between 18 and 90 years old.',
      'error',
    );
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  formDataObj.salary = convertSalary(salary);
  addToTable(formDataObj, table);

  pushNotification(
    10,
    10,
    'The employee has been added successfully!',
    'You can find the new employee in the table.',
    'success',
  );
});

// functions
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const collumNumber = e.target.cellIndex;

    if (e.target.classList.contains('sorted')) {
      resortTableByColumn(table, collumNumber);
      e.target.classList.remove('sorted');
    } else {
      const headerRow = table.rows[0];

      for (let i = 0; i < headerRow.cells.length; i++) {
        headerRow.cells[i].classList.remove('sorted');
      }
      sortTableByColumn(table, collumNumber);
      e.target.classList.add('sorted');
    }
  }

  if (e.target.tagName === 'TD') {
    const row = e.target.closest('tr');
    const active = [...table.querySelectorAll('tr.active')];

    if (active.length > 0) {
      active.forEach((el) => el.classList.remove('active'));
    }
    row.classList.add('active');
  }
});

function sortTableByColumn(tab, columnIndex) {
  const tbody = tab.tBodies[0];
  const rowsArray = Array.from(tbody.rows);

  if (columnIndex === 3) {
    rowsArray.sort(
      (a, b) =>
        parseFloat(a.cells[columnIndex].textContent) -
        parseFloat(b.cells[columnIndex].textContent),
    );
  } else if (columnIndex === 4) {
    rowsArray.sort(
      (a, b) =>
        toNumber(a.cells[columnIndex].textContent) -
        toNumber(b.cells[columnIndex].textContent),
    );
  } else if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    rowsArray.sort((a, b) => {
      return a.cells[columnIndex].textContent.localeCompare(
        b.cells[columnIndex].textContent,
      );
    });
  }

  rowsArray.forEach((row) => {
    tbody.appendChild(row);
  });
}

function resortTableByColumn(tab, columnIndex) {
  const tbody = tab.tBodies[0];
  const rowsArray = Array.from(tbody.rows);

  if (columnIndex === 3) {
    rowsArray.sort(
      (a, b) =>
        parseFloat(b.cells[columnIndex].textContent) -
        parseFloat(a.cells[columnIndex].textContent),
    );
  } else if (columnIndex === 4) {
    rowsArray.sort(
      (a, b) =>
        toNumber(b.cells[columnIndex].textContent) -
        toNumber(a.cells[columnIndex].textContent),
    );
  } else if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
    rowsArray.sort((a, b) => {
      return b.cells[columnIndex].textContent.localeCompare(
        a.cells[columnIndex].textContent,
      );
    });
  }

  rowsArray.forEach((row) => {
    tbody.appendChild(row);
  });
}

function toNumber(string) {
  const num = string.slice(1);

  return Number(num.replaceAll(',', ''));
}

function convertSalary(n) {
  const num = parseInt(n);

  return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function addToTable(data, tab) {
  const tbody = tab.tBodies[0];
  const newRow = document.createElement('tr');

  for (const key in data) {
    const td = document.createElement('td');

    td.textContent = data[key];
    newRow.append(td);
  }

  tbody.append(newRow);
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  const titleElement = document.createElement('h2');

  titleElement.className = 'title';
  titleElement.textContent = title;

  const descriptionElement = document.createElement('p');

  descriptionElement.textContent = description;

  notification.appendChild(titleElement);
  notification.appendChild(descriptionElement);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};
