/* eslint-disable prefer-promise-reject-errors */

'use strict';

const tableHead = document.querySelector('thead');
const tableTitles = tableHead.querySelectorAll('th');
const tableBody = document.querySelector('tbody');
const tableRows = tableBody.querySelectorAll('tr');

const rows = [];

const isClicked = {
  0: false, // Name
  1: false, // Position
  2: false, // Office
  3: false, // Age
  4: false, // Salary
};

tableRows.forEach((row) => {
  rows.push(row);
});

for (const row of rows) {
  row.addEventListener('click', () => {
    removeClass();
    row.classList.add('active');
  });
}

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const originalValue = cell.textContent;

  if (document.querySelector('.cell-input')) {
    return;
  }

  const input = document.createElement('input');

  input.value = originalValue;
  input.classList.add('cell-input');

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const save = () => {
    cell.textContent = input.value || originalValue;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }
  });
});

function removeClass() {
  for (const row of rows) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }
}

for (let i = 0; i < tableTitles.length; i++) {
  tableTitles[i].addEventListener('click', () => {
    for (const key in isClicked) {
      if (parseInt(key) !== i) {
        isClicked[key] = false;
      }
    }

    sortTable(i);
    isClicked[i] = !isClicked[i];
  });
}

function deleteSymbols(value) {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

function sortTable(index) {
  const value = deleteSymbols(rows[0].cells[index].textContent);
  const isNumber = !isNaN(Number.parseInt(value));

  const sortedRows = rows.sort((row1, row2) => {
    let value1 = deleteSymbols(row1.cells[index].textContent);
    let value2 = deleteSymbols(row2.cells[index].textContent);

    if (isNumber) {
      value1 = Number.parseInt(value1);
      value2 = Number.parseInt(value2);
    }

    if (isClicked[index]) {
      return isNumber ? value2 - value1 : value2.localeCompare(value1);
    }

    return isNumber ? value1 - value2 : value1.localeCompare(value2);
  });

  for (const row of sortedRows) {
    tableBody.append(row);
  }
}

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.noValidate = true;

function createInput({ type, inputName, qa }) {
  const input = document.createElement('input');

  input.type = type;
  input.name = inputName;
  input.required = true;
  input.setAttribute('data-qa', qa);

  return input;
}

function createSelect({ selectName, options, qa }) {
  const select = document.createElement('select');

  select.name = selectName;
  select.setAttribute('data-qa', qa);
  select.required = true;

  options.forEach(({ value, label }) => {
    const option = document.createElement('option');

    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });

  return select;
}

function createLabel(labelText, element) {
  const label = document.createElement('label');

  label.textContent = labelText;
  label.appendChild(element);

  return label;
}

const countries = [
  { value: 'Tokyo', label: 'Tokyo' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'London', label: 'London' },
  { value: 'New York', label: 'New York' },
  { value: 'Edinburgh', label: 'Edinburgh' },
  { value: 'San Francisco', label: 'San Francisco' },
];

const fields = [
  {
    label: 'Name',
    element: createInput({ type: 'text', inputName: 'name', qa: 'name' }),
  },
  {
    label: 'Position',
    element: createInput({
      type: 'text',
      inputName: 'position',
      qa: 'position',
    }),
  },
  {
    label: 'Office',
    element: createSelect({
      selectName: 'office',
      options: countries,
      qa: 'office',
    }),
  },
  {
    label: 'Age',
    element: createInput({ type: 'number', inputName: 'age', qa: 'age' }),
  },
  {
    label: 'Salary',
    element: createInput({ type: 'number', inputName: 'salary', qa: 'salary' }),
  },
];

fields.forEach(({ label, element }) => {
  form.appendChild(createLabel(label, element));
});

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

document.body.appendChild(form);

function createNotification() {
  const DISPLAY_TIME = 2000;
  const notificationElement = document.createElement('div');
  const title = document.createElement('h3');

  notificationElement.setAttribute('data-qa', 'notification');
  notificationElement.classList.add('notification');
  title.classList.add('title');
  notificationElement.appendChild(title);

  let timeoutId = null;

  return function show(message, statusClass) {
    clearTimeout(timeoutId);
    notificationElement.classList.remove('success');
    notificationElement.classList.remove('error');
    notificationElement.classList.remove('warning');

    if (!document.body.contains(notificationElement)) {
      document.body.appendChild(notificationElement);
    }

    title.textContent = message;
    notificationElement.classList.add(statusClass);
    notificationElement.style.visibility = 'visible';

    timeoutId = setTimeout(() => {
      notificationElement.style.visibility = 'hidden';
    }, DISPLAY_TIME);
  };
}

const notification = createNotification();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputName = fields[0].element.value;
  const position = fields[1].element.value.trim();
  const age = Number(fields[3].element.value);
  const salaryInput = fields[4].element.value.trim();

  if (inputName.length < 4) {
    notification('Name must contain at least 4 letters', 'error');

    return;
  }

  if (position === '') {
    notification('Position cant be empty', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    notification('Age cant be less than 18 and bigger than 90', 'error');

    return;
  }

  if (salaryInput === '') {
    notification('Salary cant be empty', 'error');

    return;
  }

  const salary = Number.parseInt(salaryInput);

  if (isNaN(salary)) {
    notification('Salary must be a number', 'error');

    return;
  }

  const row = document.createElement('tr');

  for (let i = 0; i < tableTitles.length; i++) {
    const td = document.createElement('td');

    if (fields[i].element.name === 'salary') {
      td.textContent = `$${salary.toLocaleString('en-US')}`;
    } else {
      td.textContent = fields[i].element.value;
    }
    row.appendChild(td);
  }

  row.addEventListener('click', () => {
    removeClass();
    row.classList.add('active');
  });
  rows.push(row);
  tableBody.appendChild(row);
  form.reset();

  notification('Person added success', 'success');
});
