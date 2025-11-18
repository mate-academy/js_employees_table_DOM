'use strict';

// write code here
const body = document.querySelector('tbody');
const allRows = () => {
  const rows = [...document.querySelectorAll('tbody tr')];

  return rows;
};

body.addEventListener('click', (eve) => {
  const rows = allRows();

  for (const r of rows) {
    if (r.classList.contains('active')) {
      r.classList.remove('active');
    }
  }

  const selectedRow = eve.target.closest('tr');

  if (selectedRow !== null) {
    selectedRow.classList.add('active');
  }
});

function cellValue(row, columnIndex) {
  const value = row.cells[columnIndex].textContent;
  const string = value.replace(/[^0-9.-]/g, '');

  if (string.length !== 0 && !Number.isNaN(Number(string))) {
    return Number(string);
  } else {
    return value.toLowerCase();
  }
}

function rowAppend(rows) {
  for (const r of rows) {
    body.append(r);
  }
}

function sortRows(rows, columnIndex, direction) {
  rows.sort((a, b) => {
    const valA = cellValue(a, columnIndex);
    const valB = cellValue(b, columnIndex);
    let result;

    if (!isNaN(valA) && !isNaN(valB)) {
      result = valA - valB;
    } else {
      result = valA.localeCompare(valB);
    }

    return result * direction;
  });
}

const headers = [...document.querySelectorAll('thead th')];
let clickCount = 0;
let lastIndex = null;

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const rows = allRows();
    const currentIndex = header.cellIndex;

    if (currentIndex !== lastIndex) {
      clickCount = 0;
    }

    clickCount++;

    if (rows.length === 0) {
      return;
    }

    const index = currentIndex;

    if (clickCount === 1) {
      sortRows(rows, index, 1);
      rowAppend(rows);
    }

    if (clickCount === 2) {
      sortRows(rows, index, -1);
      rowAppend(rows);

      clickCount = 0;
    }

    lastIndex = header.cellIndex;
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

function inputGenerator(inputName, type, qaAttr) {
  const input = document.createElement('input');

  input.name = inputName.toLowerCase();
  input.type = type;
  input.setAttribute('data-qa', qaAttr);
  input.required = true;

  const label = document.createElement('label');

  label.textContent = `${inputName}: `;

  label.append(input);

  return label;
}

const formName = inputGenerator('Name', 'text', 'name');
const formPosition = inputGenerator('Position', 'text', 'position');

form.append(formName);
form.append(formPosition);

const office = document.createElement('select');

office.name = 'Office';
office.setAttribute('data-qa', 'office');
office.required = true;

const labelForSelect = document.createElement('label');

labelForSelect.textContent = 'Office:';
labelForSelect.append(office);
form.append(labelForSelect);

const formAge = inputGenerator('Age', 'number', 'age');
const formSalary = inputGenerator('Salary', 'number', 'salary');

form.append(formAge);
form.append(formSalary);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.append(button);

document.body.append(form);

function newOption(text) {
  const option = new Option(text);

  return option;
}

office.add(newOption('Tokyo'));
office.add(newOption('Singapore'));
office.add(newOption('London'));
office.add(newOption('New York'));
office.add(newOption('Edinburgh'));
office.add(newOption('San Francisco'));

function pushNotification(type) {
  const page = document.querySelector('body');
  const message = document.createElement('div');

  message.classList.add('notification');
  message.setAttribute('data-qa', 'notification');
  message.style.top = '500px';

  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  if (type === 'warning') {
    messageTitle.textContent = 'Warning';
    message.classList.add('warning');

    messageDescription.textContent =
      'Please verify the information before finalizing.';
  }

  if (type === 'success') {
    messageTitle.textContent = 'Employee Added Successfully';
    message.classList.add('success');

    messageDescription.textContent =
      'The new employee record has been created and saved to the database.';
  }

  if (type === 'error') {
    messageTitle.textContent = 'Failed to Add Employee';
    message.classList.add('error');

    messageDescription.textContent =
      'Please ensure all required fields are filled correctly.';
  }

  message.append(messageTitle);
  message.append(messageDescription);
  page.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
}

form.addEventListener('submit', (eve) => {
  const inputs = [...document.querySelectorAll('input')];

  for (const input of inputs) {
    if (input.value.length === 0) {
      pushNotification('error');

      return;
    }
  }

  if (office.value.length === 0) {
    pushNotification('error');

    return;
  }


  if (document.querySelector('[data-qa="name"]').value.length < 4) {
    pushNotification('error');

    return;
  }

  const inputAge = document.querySelector('[data-qa="age"]').value;

  if (Number(inputAge) < 18 || Number(inputAge) > 90) {
    pushNotification('error');

    return;
  }

  const newRow = body.insertRow();

  function newCell(content) {
    const newC = newRow.insertCell();

    newC.textContent = content;
  }

  newCell(document.querySelector('[data-qa="name"]').value);
  newCell(document.querySelector('[data-qa="position"]').value);
  newCell(document.querySelector('[data-qa="office"]').value);
  newCell(document.querySelector('[data-qa="age"]').value);

  newCell(
    Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(document.querySelector('[data-qa="salary"]').value),
  );
  pushNotification('success');

  eve.preventDefault();
});
