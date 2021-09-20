'use strict';

const tableHeader = document.querySelector('thead');
const columns = tableHeader.rows[0].cells.length;
const tableBody = document.querySelector('tbody');
const sortIndex = [];

for (let i = 0; i < columns; i++) {
  sortIndex[i] = false;
}

tableHeader.addEventListener('click', e => {
  const column = e.target.closest('th').cellIndex;
  const tableRows = [...tableBody.rows];

  if (sortIndex[column]) {
    sortIndex[column] = false;

    tableRows.sort((a, b) => {
      if (!isNaN(+a.cells[column].innerText)) {
        return +b.cells[column].innerText - +a.cells[column].innerText;
      }

      if (a.cells[column].innerText.includes('$')) {
        return b.cells[column].innerText.slice(1).split(',').join('')
          - a.cells[column].innerText.slice(1).split(',').join('');
      }

      return b.cells[column].innerText.localeCompare(a.cells[column].innerText);
    });
  } else {
    tableRows.sort((a, b) => {
      for (let i = 0; i < columns; i++) {
        sortIndex[i] = false;
      }
      sortIndex[column] = true;

      if (!isNaN(+a.cells[column].innerText)) {
        return +a.cells[column].innerText - +b.cells[column].innerText;
      }

      if (a.cells[column].innerText.includes('$')) {
        return a.cells[column].innerText.slice(1).split(',').join('')
          - b.cells[column].innerText.slice(1).split(',').join('');
      }

      return a.cells[column].innerText.localeCompare(b.cells[column].innerText);
    });
  }

  tableBody.append(...tableRows);
});

tableBody.addEventListener('click', e => {
  const row = e.target.closest('tr');
  const activeRow = tableBody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

const nameLabel = document.createElement('label');
const positionLabel = document.createElement('label');
const officeLabel = document.createElement('label');
const ageLabel = document.createElement('label');
const salaryLabel = document.createElement('label');
const saveButonn = document.createElement('button');

form.append(nameLabel, positionLabel, officeLabel, ageLabel,
  salaryLabel, saveButonn);

nameLabel.innerText = 'Name:';
positionLabel.innerText = 'Position:';
officeLabel.innerText = 'Office:';
ageLabel.innerText = 'Age:';
salaryLabel.innerText = 'Salary:';
saveButonn.innerText = 'Save to table';

const nameInput = document.createElement('input');
const positionInput = document.createElement('input');
const officeInput = document.createElement('select');
const ageInput = document.createElement('input');
const salaryInput = document.createElement('input');
const tokyoOption = document.createElement('option');
const singaporeOption = document.createElement('option');
const londonOption = document.createElement('option');
const newYorkOption = document.createElement('option');
const edinburghOption = document.createElement('option');
const sanFranciscoOption = document.createElement('option');

nameLabel.append(nameInput);
nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';
positionLabel.append(positionInput);
positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
officeLabel.append(officeInput);
officeInput.name = 'office';
officeInput.dataset.qa = 'office';
tokyoOption.value = 'Tokyo';
tokyoOption.innerText = 'Tokyo';
singaporeOption.value = 'Singapore';
singaporeOption.innerText = 'Singapore';
londonOption.value = 'London';
londonOption.innerText = 'London';
newYorkOption.value = 'New York';
newYorkOption.innerText = 'New York';
edinburghOption.value = 'Edinburgh';
edinburghOption.innerText = 'Edinburgh';
sanFranciscoOption.value = 'San Francisco';
sanFranciscoOption.innerText = 'San Francisco';

officeInput.append(tokyoOption, singaporeOption, londonOption, newYorkOption,
  edinburghOption, sanFranciscoOption);
ageLabel.append(ageInput);
ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
salaryLabel.append(salaryInput);
salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
saveButonn.type = 'submit';

form.addEventListener('submit', e => {
  e.preventDefault();

  let salary;

  if (+salaryInput.value > 0) {
    salary = +salaryInput.value;

    salary = '$' + salary.toLocaleString('en-US');
  }

  addEmploee(nameInput.value, positionInput.value, officeInput.value,
    ageInput.value, salary);

  form.reset();
});

function addEmploee(employeeName, position, office, age, salary) {
  if (employeeName.length < 4) {
    return pushNotification('Employee Name error',
      'Employee Name should be 4 letters or more', 'error');
  }

  if (age < 18 || age > 90) {
    return pushNotification('Employee Age error',
      'Employee Age should be between 18 and 90', 'error');
  }

  const row = document.createElement('tr');

  for (let i = 0; i < columns; i++) {
    const cell = document.createElement('td');

    if (!arguments[i]) {
      return pushNotification('Invalid input',
        'Invalid input', 'error');
    }
    cell.innerText = arguments[i];
    row.append(cell);
  }

  tableBody.append(row);

  pushNotification('Employee successfully added',
    'New Employee was successfully added to the table', 'success');
}

function pushNotification(title, description, type) {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  messageTitle.classList.add('title');
  message.dataset.qa = 'notification';
  messageTitle.innerText = title;
  messageDescription.innerText = description;
  message.append(messageTitle, messageDescription);
  document.body.append(message);

  setTimeout(function() {
    message.hidden = true;
  }, 3000);
};

tableBody.addEventListener('dblclick', e => {
  const cell = e.target.closest('td');
  const cellInput = document.createElement('input');
  const oldData = cell.innerText;

  cellInput.classList.add('cell-input');
  cell.innerText = '';
  cell.append(cellInput);
  cellInput.focus();
  cellInput.type = 'text';

  if (oldData.includes('$')) {
    cellInput.type = 'number';
  }

  if (!isNaN(+oldData)) {
    cellInput.type = 'number';
    cellInput.min = '18';
    cellInput.max = '90';
  }

  cellInput.addEventListener('blur', () => {
    let newData = cellInput.value;

    if (newData === '') {
      newData = oldData;
    } else {
      if (oldData.includes('$')) {
        newData = +newData;
        newData = '$' + newData.toLocaleString('en-US');
      }
    }

    cellInput.remove();
    cell.innerText = newData;
  });

  cellInput.addEventListener('keydown', enter => {
    if (enter.key === 'Enter') {
      cellInput.blur();
    }
  });
});
