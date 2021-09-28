'use strict';

const tableHeader = document.querySelector('thead');
const columns = tableHeader.rows[0].cells;
const tableBody = document.querySelector('tbody');
let sortIndex = -1;

tableHeader.addEventListener('click', e => {
  const column = e.target.closest('th').cellIndex;
  const tableRows = [...tableBody.rows];

  tableRows.sort((a, b) => {
    switch (columns[column].innerText) {
      case 'Age':
        return a.cells[column].innerText - b.cells[column].innerText;
      case 'Salary':
        return a.cells[column].innerText.slice(1).split(',').join('')
          - b.cells[column].innerText.slice(1).split(',').join('');
      default:
        return a.cells[column].innerText
          .localeCompare(b.cells[column].innerText);
    }
  });

  if (sortIndex === column) {
    sortIndex = -1;
    tableRows.reverse();
  } else {
    sortIndex = column;
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
const saveButonn = document.createElement('button');

form.classList.add('new-employee-form');
saveButonn.innerText = 'Save to table';
saveButonn.type = 'submit';

for (const cell of columns) {
  const label = document.createElement('label');
  let input;

  label.innerText = cell.innerText + ':';

  switch (cell.innerText) {
    case 'Age':
      input = document.createElement('input');
      input.name = 'age';
      input.type = 'number';
      input.dataset.qa = 'age';
      break;
    case 'Salary':
      input = document.createElement('input');
      input.name = 'salary';
      input.type = 'number';
      input.dataset.qa = 'salary';
      break;
    case 'Office':
      input = document.createElement('select');
      input.name = 'office';

      input.innerHTML = `<option>Tokyo</option><option>Singapore</option>
        <option>London</option><option>New York</option><option>Edinburgh
        </option><option>San Francisco</option>`;
      input.dataset.qa = 'office';
      break;
    default:
      input = document.createElement('input');
      input.name = cell.innerText.toLowerCase();
      input.type = 'text';
      input.dataset.qa = cell.innerText.toLowerCase();
      break;
  }

  label.append(input);
  form.append(label);
}

form.append(saveButonn);
document.body.append(form);

form.addEventListener('submit', e => {
  e.preventDefault();
  addEmploee();
});

function addEmploee() {
  const row = document.createElement('tr');

  for (const cells of columns) {
    const input = form.querySelector(`[name=${cells.innerText.toLowerCase()}]`);
    const cell = document.createElement('td');

    switch (cells.innerText.toLowerCase()) {
      case 'name':
        if (input.value.length < 4) {
          return pushNotification(150, 10, 'Employee Name error',
            'Employee Name should be 4 letters or more', 'error');
        } else {
          cell.innerText = input.value;
        }
        break;
      case 'age':
        if (input.value < 18 || input.value > 90) {
          return pushNotification(250, 10, 'Employee Age error',
            'Employee Age should be between 18 and 90', 'error');
        } else {
          cell.innerText = input.value;
        }
        break;
      case 'salary':
        if (input.value < 1) {
          return pushNotification(350, 10, 'Employee Salary error',
            'Employee Salary should be bigger than 0', 'error');
        } else {
          cell.innerText = '$' + (+input.value).toLocaleString('en-US');
        }
        break;
      default:
        if (input.value === '') {
          return pushNotification(450, 10, 'Invalid input',
            'Input all fields', 'error');
        } else {
          cell.innerText = input.value;
        }
        break;
    }

    row.append(cell);
  }

  tableBody.append(row);

  pushNotification(10, 10, 'Employee successfully added',
    'New Employee was successfully added to the table', 'success');

  form.reset();
}

function pushNotification(posTop, posRight, title, description, type) {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';
  messageTitle.classList.add('title');
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  messageTitle.innerText = title;
  messageDescription.innerText = description;
  message.append(messageTitle, messageDescription);
  document.body.append(message);

  setTimeout(function() {
    message.hidden = true;
  }, 2000);
}

tableBody.addEventListener('dblclick', e => {
  if (e.target.matches('input') || e.target.matches('select')) {
    return;
  }

  const cell = e.target.closest('td');
  const index = cell.cellIndex;
  let cellInput;
  const oldData = cell.innerText;

  switch (columns[index].innerText) {
    case 'Age':
      cellInput = document.createElement('input');
      cellInput.type = 'number';
      cell.innerText = '';
      cellInput.value = oldData;
      break;
    case 'Salary':
      cell.innerText = '';
      cellInput = document.createElement('input');
      cellInput.type = 'number';
      cellInput.value = oldData.slice(1).split(',').join('');
      break;
    case 'Office':
      cell.innerText = '';
      cellInput = document.createElement('select');

      cellInput.innerHTML = `<option>Tokyo</option><option>Singapore</option>
        <option>London</option><option>New York</option><option>Edinburgh
        </option><option>San Francisco</option>`;
      cellInput.value = oldData;
      break;
    default:
      cellInput = document.createElement('input');
      cellInput.type = 'text';
      cell.innerText = '';
      cellInput.value = oldData;
      break;
  }

  cellInput.classList.add('cell-input');
  cell.append(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    const newData = cellInput.value;

    cellInput.remove();

    switch (columns[index].innerText) {
      case 'Name':
        if (newData.length < 4) {
          cell.innerText = oldData;

          return pushNotification(150, 10, 'Employee Name error',
            'Employee Name should be 4 letters or more', 'error');
        } else {
          cell.innerText = newData;
        }
        break;
      case 'Age':
        if (newData < 18 || newData > 90) {
          cell.innerText = oldData;

          return pushNotification(250, 10, 'Employee Age error',
            'Employee Age should be between 18 and 90', 'error');
        } else {
          cell.innerText = newData;
        }
        break;
      case 'Salary':
        if (newData < 1) {
          cell.innerText = oldData;

          return pushNotification(350, 10, 'Employee Salary error',
            'Employee Salary should be bigger than 0', 'error');
        } else {
          cell.innerText = '$' + newData.toLocaleString('en-US');
        }
        break;
      default:
        if (newData === '') {
          cell.innerText = oldData;

          return pushNotification(450, 10, 'Invalid input',
            'Input can\'t be empy', 'error');
        } else {
          cell.innerText = newData;
        }
        break;
    }

    if (newData === oldData) {
      return;
    }

    pushNotification(10, 10, 'Data successfully chenged',
      'Data was successfully chenged', 'success');
  });

  cellInput.addEventListener('keydown', enter => {
    if (enter.key === 'Enter') {
      cellInput.blur();
    }
  });
});
