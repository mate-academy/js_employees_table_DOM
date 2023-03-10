'use strict';

const titlesRow = document.querySelector('thead');
const table = document.querySelector('tbody');

// Sorting by clicking on the title (in two directions)

function normalizeSalary(str) {
  return str.replace(/[$,]/g, '');
}

function sortTable(tableToSort, i, secondSort) {
  return tableToSort.sort((a, b) => {
    const aValue = a.cells[i].innerText;
    const bValue = b.cells[i].innerText;

    switch (i) {
      case 3:
        return secondSort
          ? bValue - aValue
          : aValue - bValue;
      case 4:
        return secondSort
          ? normalizeSalary(bValue) - normalizeSalary(aValue)
          : normalizeSalary(aValue) - normalizeSalary(bValue);
      default:
        return secondSort
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
    }
  });
}

const row = titlesRow.children[0].children;

titlesRow.addEventListener('click', e => {
  const index = e.target.cellIndex;
  const asc = e.target.classList.value;
  let sortedTable;

  if (asc) {
    sortedTable = sortTable([...table.children], index, asc);
    e.target.classList.toggle('ASC');
  } else {
    sortedTable = sortTable([...table.children], index, asc);

    for (const cell of row) {
      cell.classList.remove('ASC');
    }
    e.target.classList.add('ASC');
  }

  sortedTable.forEach(item => table.append(item));
});

// Select a row

table.addEventListener('click', e => {
  const selectedRow = e.target.closest('tr');
  const alreadySelected = selectedRow.classList.value;

  alreadySelected
    ? selectedRow.classList.remove('active')
    : [...table.children].forEach(el => {
      el.classList.remove('active');
      selectedRow.classList.add('active');
    });
});

// Add form

const form = document.createElement('form');
const inputNames = ['name', 'position', 'office', 'age', 'salary'];
const offices = [`Tokyo`, `Singapore`, `London`,
  `New York`, `Edinburgh`, `San Francisco`];

form.className = 'new-employee-form';

function createSelect(value) {
  const select = document.createElement('select');

  for (const office of offices) {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;
    select.append(option);
  }

  select.setAttribute('data-qa', value);
  select.required = true;

  return select;
}

for (const inputName of inputNames) {
  const label = document.createElement('label');

  label.textContent = `
    ${inputName.slice(0, 1).toUpperCase()}${inputName.slice(1)}:
  `;

  if (inputName === 'office') {
    label.append(createSelect(inputName));
    form.append(label);
    continue;
  }

  const input = document.createElement('input');

  inputName === 'age' || inputName === 'salary'
    ? input.type = 'number'
    : input.type = 'text';

  input.name = inputName;
  input.setAttribute('data-qa', inputName);
  input.required = true;
  label.append(input);
  form.append(label);
}

// Notification

const notification = (title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');

  message.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(message);

  setTimeout(() => message.remove(), 3000);
};

function notificationCheck(text, i) {
  if (!text) {
    return notification(
      'Warning',
      'Fill all the fields',
      'warning'
    );
  }

  if (i === 0 && text.length < 4) {
    return notification(
      'Error',
      'The name must be at least 4 letters long',
      'error'
    );
  }

  if (i === 3 && (text < 18 || text > 90 || isNaN(text))) {
    return notification(
      'Error',
      'Age must be between 18 and 90 years',
      'error'
    );
  }

  if (i === 4 && isNaN(normalizeSalary(text))) {
    return notification(
      'Error',
      'Is not a number',
      'error'
    );
  }

  return true;
}

// Button on submit

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

const inputsList = [...form.children]
  .filter(el => el !== button)
  .map(el => el.lastChild);

button.addEventListener('click', e => {
  e.preventDefault();

  const tr = document.createElement('tr');

  for (let i = 0; i < inputsList.length; i++) {
    const input = inputsList[i];
    let text = input.value;

    if (notificationCheck(text, i) !== true) {
      return;
    }

    const td = document.createElement('td');

    if (input.name === 'salary') {
      text = `$${Number(text).toLocaleString('en-US')}`;
    }

    td.textContent = text;
    tr.append(td);
  }

  table.append(tr);

  notification(
    'Success',
    'New employee is successfully added',
    'success'
  );
});

document.body.append(form);

// Editing of table cells by double-clicking

table.addEventListener('dblclick', select => {
  const selectedCell = select.target;
  let inpuntCell = document.createElement('input');
  const tableText = selectedCell.innerText;

  if (selectedCell.cellIndex === 2) {
    inpuntCell = createSelect('office');
  }

  inpuntCell.className = 'cell-input';
  inpuntCell.value = tableText;
  inpuntCell.style.width = selectedCell.clientWidth - 36 + 'px';
  selectedCell.innerText = '';
  selectedCell.append(inpuntCell);

  inpuntCell.focus();

  inpuntCell.addEventListener('blur', () => {
    let value = inpuntCell.value;

    if (notificationCheck(value, selectedCell.cellIndex) !== true) {
      value = tableText;
    }

    if (selectedCell.cellIndex === 4) {
      value = '$' + Number(normalizeSalary(value)).toLocaleString('en-US');
    }

    selectedCell.innerText = value;
    inpuntCell.remove();
  });

  inpuntCell.addEventListener('keypress', (push) => {
    if (push.key === 'Enter') {
      selectedCell.innerText = inpuntCell.value;

      if (inpuntCell.value === '') {
        selectedCell.innerText = tableText;
      }
      inpuntCell.remove();
    }
  });
});
