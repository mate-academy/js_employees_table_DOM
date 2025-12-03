'use strict';

const form = document.createElement('form');

form.classList.add('new-employee-form');

const warningMessage = document.createElement('div');

warningMessage.hidden = true;
warningMessage.dataset.qa = 'notification';
warningMessage.classList.add('notification');

function createLabel(nameOfInput, type = 'text', required = true) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  input.type = type;
  input.name = nameOfInput;
  input.dataset.qa = nameOfInput;
  input.required = required;

  label.textContent =
    nameOfInput.charAt(0).toUpperCase() + nameOfInput.slice(1) + ':';
  label.append(input);

  return label;
}

const nameLabel = createLabel('name');
const positionLabel = createLabel('position', 'text', false);
const ageLabel = createLabel('age', 'number');
const salaryLabel = createLabel('salary', 'number');
const officeLabel = document.createElement('label');
const select = document.createElement('select');

select.dataset.qa = 'office';
select.name = 'office';
select.required = true;

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

cities.forEach((city) => {
  const option = document.createElement('option');

  option.value = city.toLowerCase().replace(/\s+/g, '-'); // value: new-york
  option.textContent = city; // label: New York
  select.appendChild(option);
});

officeLabel.textContent = 'Office:';
officeLabel.append(select);

const button = document.createElement('button');

button.classList.add('button');

button.textContent = 'Save to table';
button.type = 'submit';

form.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  button,
);
document.body.append(warningMessage);

document.body.append(form);

form.addEventListener('submit', saveToTable);

function showNotification(text, type) {
  warningMessage.textContent = text;
  warningMessage.classList.remove('error', 'success', 'warning');
  warningMessage.classList.add(type);
  warningMessage.hidden = false;
}

function saveToTable(ev) {
  ev.preventDefault();
  warningMessage.hidden = true;

  const nameInput = form.querySelector('[name="name"]');
  const positionInput = form.querySelector('[name="position"]');
  const ageInput = form.querySelector('[name="age"]');
  const salaryInput = form.querySelector('[name="salary"]');

  if (nameInput.value.length < 4 || /\d/.test(nameInput.value)) {
    showNotification(
      'Name is invalid: must be 4+ letters, no numbers.',
      'error',
    );

    return;
  }

  if (positionInput.value.length < 4 || /\d/.test(positionInput.value)) {
    showNotification(
      'Position is invalid: must be 4+ letters, no numbers.',
      'error',
    );

    return;
  }

  if (!ageInput.value) {
    showNotification('Age is required.', 'error');

    return;
  }

  const age = Number(ageInput.value);

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  if (!salaryInput.value) {
    showNotification('Salary is required.', 'error');

    return;
  }

  const salary = Number(form.querySelector('[name="salary"]').value);

  if (salary <= 0 || Number.isNaN(salary)) {
    showNotification('Salary must be a positive number.', 'error');

    return;
  }

  const position = form.querySelector('[name="position"]').value;

  const nameOfEmployee = nameInput.value;

  const formattedSalary = '$' + new Intl.NumberFormat('en-US').format(salary);

  const newEmployee = {
    name: capitalize(nameOfEmployee),
    position: capitalize(position),
    office: select.options[select.selectedIndex].text,
    age: ageInput.value,
    salary: formattedSalary,
  };

  addEmployeeToTable(newEmployee);
  showNotification('Employee added successfully!', 'success');
  form.reset();
}

function addEmployeeToTable(employee) {
  const table = document.querySelector('tbody');
  const newRow = document.createElement('tr');

  Object.values(employee).forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;
    newRow.append(cell);
  });
  table.append(newRow);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function convertToNum(currencyStr) {
  return Number(currencyStr.replace('$', '').replace(',', ''));
}

let clicked;
let isASC = true;

function sort(ev) {
  const th = ev.target.closest('th');

  if (!th) {
    return;
  }

  const table = document.querySelector('table');
  const tBody = table.tBodies[0];
  const columnIndex = th.cellIndex;

  const rows = [...tBody.rows];

  if (clicked !== th) {
    clicked = th;
    isASC = true;
  } else {
    isASC = !isASC;
  }

  const sortedRows = SortToASCorder(rows, columnIndex, isASC);

  tBody.innerHTML = '';
  tBody.append(...sortedRows);
}
document.querySelector('thead').addEventListener('click', sort);

function SortToASCorder(rows, thIndex, asc) {
  const sortedRows = rows.sort((a, b) => {
    const aText = a.cells[thIndex].textContent.trim();
    const bText = b.cells[thIndex].textContent.trim();
    const aNum = convertToNum(aText);
    const bNum = convertToNum(bText);
    let compare;

    if (!isNaN(aNum) && !isNaN(bNum)) {
      compare = aNum - bNum;
    } else {
      compare = aText.localeCompare(bText);
    }

    return asc ? compare : -compare;
  });

  return sortedRows;
}
document.querySelector('tbody').addEventListener('click', toSelectedRow);

function toSelectedRow(ev) {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }

  document.querySelectorAll('tbody tr').forEach((tr) => {
    tr.classList.remove('active');
  });

  row.classList.add('active');
}

document.querySelector('tbody').addEventListener('dblclick', changeCell);

let activeCell = null;
let initialValue = '';

function changeCell(ev) {
  const cell = ev.target.closest('td');

  if (!cell) {
    return;
  }

  if (activeCell === cell) {
    return;
  }

  if (activeCell && cell !== activeCell) {
    saveActiveCell(activeCell);
  }

  activeCell = cell;
  initialValue = cell.textContent.trim();

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = initialValue;
  cell.textContent = '';
  cell.append(input);
  input.focus();
  input.addEventListener('keydown', saveNewCell);
  input.addEventListener('blur', handleBlur);

  function handleBlur() {
    saveActiveCell(activeCell);
  }

  function saveNewCell(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveActiveCell(activeCell);
    }
  }
}

function saveActiveCell(cell) {
  const input = cell.querySelector('.cell-input');

  if (!input) {
    return;
  }

  if (input.value.trim() === '') {
    activeCell.textContent = initialValue;
  } else {
    cell.textContent = input.value.trim();
  }
  activeCell = null;
  input.remove();
}
