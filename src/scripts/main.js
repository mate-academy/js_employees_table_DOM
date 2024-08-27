'use strict';

const table = document.querySelector('table');
const tBodyRows = table.tBodies[0].rows;
const tHeadRows = table.tHead.rows;

const cellSalary = table.rows[0].cells[4];
const cellAge = table.rows[0].cells[3];
const sortOrder = {};
const notification = document.createElement('div');

const labelNames = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const officeLocated = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

addForm(officeLocated, labelNames);

let currentEditCell = null;
const formButton = document.querySelector('button');

formButton.addEventListener('click', (e) => {
  e.preventDefault();

  const formInputs = document.querySelector('form').elements;
  const row = document.createElement('tr');

  notification.innerHTML = '';
  notification.className = '';

  const nameInput = formInputs['name'];
  const ageInput = formInputs['age'];
  const positionInput = formInputs['position'];

  if (nameInput.value.length < 4) {
    showNotification('Error', 'Name must be at least 4 letters long.', 'error');

    return;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    showNotification('Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  if (positionInput.value.length < 4) {
    showNotification(
      'Error',
      'Position must be at least 4 letters long.',
      'error',
    );

    return;
  }

  [...formInputs].forEach((input, i) => {
    if (input.type !== 'button') {
      const cell = document.createElement('td');

      if (i === 4) {
        const numberFormatter = Intl.NumberFormat('en-US');
        const formatted = numberFormatter.format(+input.value);

        cell.innerText = `$${formatted}`;
      } else {
        cell.innerText = input.value;
      }
      row.append(cell);
    }
  });

  table.tBodies[0].appendChild(row);

  showNotification('Success', 'New employee added to the table.', 'success');
});

[...tBodyRows].forEach((row) => {
  row.addEventListener('click', () => {
    [...tBodyRows].forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });

  [...row.cells].forEach((cell) => {
    cell.addEventListener('dblclick', () => {
      if (currentEditCell && currentEditCell !== cell) {
        const previousInput = document.querySelector('.cell-input');

        if (previousInput) {
          previousInput.replaceWith(currentEditCell);
        }
        currentEditCell = null;
      }

      const originalValue = cell.innerText;
      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = cell.innerText;
      cell.innerHTML = '';
      cell.append(input);
      input.focus();

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleCellEditCompletion(input, cell, originalValue);
        }
      });

      input.addEventListener('blur', () => {
        handleCellEditCompletion(input, cell, originalValue);
      });

      currentEditCell = cell;
    });
  });
});

[...tHeadRows[0].cells].forEach((cell) => {
  cell.addEventListener('click', (e) => {
    const switchColumn = e.target.cellIndex;
    const isAsc = sortOrder[switchColumn] === 'asc';

    sortOrder[switchColumn] = isAsc ? 'desc' : 'asc';

    const sortedRows = [...tBodyRows].sort((row1, row2) => {
      const item1 = row1.cells[switchColumn].innerText;
      const item2 = row2.cells[switchColumn].innerText;

      if (e.target === cellAge || e.target === cellSalary) {
        return isAsc
          ? +item2.replace(/[$,]/g, '') - +item1.replace(/[$,]/g, '')
          : +item1.replace(/[$,]/g, '') - +item2.replace(/[$,]/g, '');
      } else {
        return isAsc ? item2.localeCompare(item1) : item1.localeCompare(item2);
      }
    });

    sortedRows.forEach((row) => table.tBodies[0].append(row));

    Object.keys(sortOrder).forEach((key) => {
      if (+key !== +e.target.cellIndex) {
        delete sortOrder[key];
      }
    });
  });
});

function addForm(placeLocate, nameInput) {
  const form = document.createElement('form');
  const select = document.createElement('select');
  const button = document.createElement('button');

  button.innerText = 'Save to table';
  button.type = 'button';

  form.classList.add('new-employee-form');

  nameInput.forEach((labelName, i) => {
    const label = document.createElement('label');

    if (labelName === 'Office') {
      placeLocate.forEach((loc) => {
        const opt = document.createElement('option');

        select.setAttribute('data-qa', labelName.toLowerCase());
        opt.value = loc;
        opt.innerText = loc;
        select.append(opt);
      });
      label.innerText = `${labelName}:`;
      label.append(select);
    } else {
      const input = document.createElement('input');
      const lowerName = labelName.toLowerCase();

      input.setAttribute('data-qa', lowerName);
      input.setAttribute('type', i >= 3 ? 'number' : 'text');
      input.setAttribute('name', lowerName);
      label.innerText = `${labelName}:`;
      label.append(input);
    }

    form.append(label);
  });

  form.append(button);
  document.body.append(form);
}

function showNotification(title, message, type) {
  const nTitle = document.createElement('span');
  const p = document.createElement('p');

  notification.innerHTML = '';
  notification.className = '';
  notification.classList.add('notification', type);

  notification.setAttribute('data-qa', 'notification');

  nTitle.classList.add('title');
  nTitle.innerText = title;

  p.innerText = message;

  notification.append(nTitle);
  notification.append(p);

  document.body.append(notification);
}

function handleCellEditCompletion(input, cell, originalValue) {
  if (input.value.trim().length >= 4) {
    cell.innerText = input.value;
  } else {
    showNotification('Error', 'Name must be at least 4 letters long.', 'error');
    cell.innerText = originalValue;
  }
  input.replaceWith(cell);
  currentEditCell = null;
}
