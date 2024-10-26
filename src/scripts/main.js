'use strict';

// write code here

const heads = [...document.querySelector('thead').firstElementChild.children];
const rows = document.querySelector('tbody').rows;
const tbody = document.querySelector('tbody');
const head = document.querySelector('thead');

let rowsArr = Array.from(rows).map((row) => {
  const person = {};

  for (let j = 0; j < row.children.length; j++) {
    person[heads[j].textContent.trim()] = row.children[j].textContent.trim();
  }

  return person;
});

let sortedRows = rowsArr;
let isAscending = true;
let lastSortedColumn = null;

function sortData(property, isNumeric = false) {
  if (lastSortedColumn !== property) {
    isAscending = true;
    lastSortedColumn = property;
  } else {
    isAscending = !isAscending;
  }

  sortedRows = [...rowsArr].sort((a, b) => {
    const val1 = isNumeric
      ? parseFloat(a[property].replace(/[$,]/g, ''))
      : a[property];
    const val2 = isNumeric
      ? parseFloat(b[property].replace(/[$,]/g, ''))
      : b[property];

    if (isNumeric) {
      return isAscending ? val1 - val2 : val2 - val1;
    }

    return isAscending ? val1.localeCompare(val2) : val2.localeCompare(val1);
  });
}

function createNewTable(finalRows) {
  tbody.replaceChildren();

  finalRows.forEach((row) => {
    const tr = document.createElement('tr');

    for (const value of Object.values(row)) {
      const td = document.createElement('td');

      td.textContent = value;
      tr.append(td);
    }

    tbody.append(tr);
  });
}

head.addEventListener('click', (e) => {
  const column = e.target.closest('th').textContent.trim();

  switch (column) {
    case 'Name':
    case 'Position':
    case 'Office':
      sortData(column);
      break;
    case 'Age':
      sortData(column, true);
      break;
    case 'Salary':
      sortData(column, true);
      break;
  }

  createNewTable(sortedRows);
});

tbody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  [...tbody.children].forEach((tr) => {
    tr.classList.remove('active');
  });

  target.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

function createLabeledInput(labelText, inputType, namePeson, dataQa) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.type = inputType;
  input.name = namePeson;
  input.dataset.qa = dataQa;

  label.append(input);

  return label;
}

const nameInput = createLabeledInput('Name:', 'text', 'name', 'name');
const positionInput = createLabeledInput(
  'Position:',
  'text',
  'position',
  'position',
);
const ageInput = createLabeledInput('Age:', 'number', 'age', 'age');
const salaryInput = createLabeledInput('Salary:', 'number', 'salary', 'salary');

const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeLabel.textContent = 'Office:';
officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';
officeSelect.required = true;

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((office) => {
  const option = document.createElement('option');

  option.value = office;
  option.textContent = office;
  officeSelect.append(option);
});
officeLabel.append(officeSelect);

const saveButton = document.createElement('button');

saveButton.type = 'submit';
saveButton.textContent = 'Save to table';

form.append(nameInput);
form.append(positionInput);
form.append(officeLabel);
form.append(ageInput);
form.append(salaryInput);
form.append(saveButton);

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const newPerson = {
    Name: formData.get('name'),
    Position: formData.get('position'),
    Office: formData.get('office'),
    Age: formData.get('age'),
    Salary: `$${Number(formData.get('salary')).toLocaleString()}`,
  };

  const nameIsValid = newPerson.Name.length >= 4;
  const ageIsValid = newPerson.Age >= 18 && newPerson.Age <= 90;
  const positionIsValid = !!newPerson.Position;

  if (!positionIsValid) {
    const error = document.createElement('div');
    const title = document.createElement('h1');
    const message = document.createElement('p');

    title.classList.add('title');
    error.classList.add('notification', 'error');
    error.setAttribute('data-qa', 'notification');

    title.textContent = 'Position Error!';
    message.textContent = 'Position must be entered.';

    error.append(title);
    error.append(message);
    document.documentElement.append(error);

    setTimeout(() => {
      error.remove();
    }, 2000);

    return;
  }

  if (nameIsValid && ageIsValid) {
    const success = document.createElement('div');
    const title = document.createElement('h1');
    const message = document.createElement('p');

    title.classList.add('title');
    success.classList.add('notification', 'success');
    success.setAttribute('data-qa', 'notification');

    title.textContent = 'Submission Successful!';
    message.textContent = 'Your information has been added successfully.';

    success.append(title);
    success.append(message);
    document.documentElement.append(success);

    sortedRows.push(newPerson);
    createNewTable(sortedRows);
    rowsArr = sortedRows;

    setTimeout(() => {
      success.remove();
    }, 2000);
  }

  if (!nameIsValid) {
    const error = document.createElement('div');
    const title = document.createElement('h1');
    const message = document.createElement('p');

    title.classList.add('title');
    error.classList.add('notification', 'error');
    error.setAttribute('data-qa', 'notification');

    title.textContent = 'Name Error!';
    message.textContent = 'Name must be at least 4 characters long.';

    error.append(title);
    error.append(message);
    document.documentElement.append(error);

    setTimeout(() => {
      error.remove();
    }, 2000);
  }

  if (!ageIsValid) {
    const error = document.createElement('div');
    const title = document.createElement('h1');
    const message = document.createElement('p');

    title.classList.add('title');
    error.classList.add('notification', 'error');
    error.setAttribute('data-qa', 'notification');

    title.textContent = 'Age Error!';
    message.textContent = 'Age must be between 18 and 90.';

    error.append(title);
    error.append(message);
    document.documentElement.append(error);

    setTimeout(() => {
      error.remove();
    }, 2000);
  }
});
