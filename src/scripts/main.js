'use strict';

const table = document.querySelector('table');
const tableRows = table.tBodies[0].rows;
const columnsSortOrder = new Map();
const rowsSorters = new Map();
let rowSelected = null;

columnsSortOrder.set('Name', false);
columnsSortOrder.set('Position', false);
columnsSortOrder.set('Office', false);
columnsSortOrder.set('Age', false);
columnsSortOrder.set('Salary', false);

rowsSorters.set('Name', sortTextCells);
rowsSorters.set('Position', sortTextCells);
rowsSorters.set('Office', sortTextCells);
rowsSorters.set('Age', sortNumberCells);
rowsSorters.set('Salary', sortNumTextCells);

table.tHead.onclick = (e) => {
  const cellIndex = e.target.cellIndex;
  const header = e.target.innerText;
  const sortedRows = [...tableRows];

  sortedRows.sort((left, right) =>
    rowsSorters.get(header)(left, right, cellIndex, header)
  );

  columnsSortOrder.set(header, !columnsSortOrder.get(header));

  table.tBodies[0].append(...sortedRows);
};

function sortTextCells(left, right, cellIndex, header) {
  if (!columnsSortOrder.get(header)) {
    return left.cells[cellIndex].innerText
      .localeCompare(right.cells[cellIndex].innerText);
  } else {
    return right.cells[cellIndex].innerText
      .localeCompare(left.cells[cellIndex].innerText);
  }
}

function sortNumberCells(left, right, cellIndex, header) {
  if (!columnsSortOrder.get(header)) {
    return left.cells[cellIndex].innerText
      - right.cells[cellIndex].innerText;
  } else {
    return right.cells[cellIndex].innerText
      - left.cells[cellIndex].innerText;
  }
}

function sortNumTextCells(left, right, cellIndex, header) {
  if (!columnsSortOrder.get(header)) {
    return convertToNumber(left.cells[cellIndex].innerText)
      - convertToNumber(right.cells[cellIndex].innerText);
  } else {
    return convertToNumber(right.cells[cellIndex].innerText)
      - convertToNumber(left.cells[cellIndex].innerText);
  }
}

function convertToNumber(text) {
  return +text.slice(1).split(',').join('');
}

table.tBodies[0].onclick = (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (!rowSelected) {
    rowSelected = row;
    row.classList.toggle('active');

    return;
  }

  if (row !== rowSelected) {
    rowSelected.classList.toggle('active');
    row.classList.toggle('active');
    rowSelected = row;

    return;
  }

  row.classList.toggle('active');

  if (!row.classList.contains('active')) {
    rowSelected = null;
  }
};

const saveForm = document.createElement('form');
const labelNames = ['Name', 'Position', 'Office', 'Age', 'Salary'];
const inputNames = ['name', 'position', 'office', 'age', 'salary'];
const submit = document.createElement('button');

saveForm.classList.add('new-employee-form');

for (let i = 0; i < labelNames.length; i++) {
  const label = document.createElement('label');
  let input;

  label.appendChild(document.createTextNode(`${labelNames[i]}:`));

  switch (inputNames[i]) {
    case 'office':
      input = document.createElement('select');
      input.innerHTML = getSelectOptions();
      break;
    case 'age':
    case 'salary':
      input = document.createElement('input');
      input.setAttribute('type', 'number');
      break;
    default:
      input = document.createElement('input');
      input.setAttribute('type', 'text');
  }

  input.setAttribute('name', inputNames[i]);
  input.setAttribute('data-qa', inputNames[i]);
  input.required = true;
  label.appendChild(input);

  saveForm.appendChild(label);
}

submit.innerText = 'Save to table';

submit.onclick = (e) => {
  e.preventDefault();

  const newEmployee = new FormData(saveForm);
  const newRow = document.createElement('tr');

  for (const inputName of inputNames) {
    switch (inputName) {
      case 'name': {
        const employeeName = newEmployee.get(inputName);

        if (employeeName.length < 4) {
          pushNotification(450, 10, 'Error', 'Name must be >= 4', 'error');

          return;
        }

        const cell = newRow.insertCell();

        cell.innerText = employeeName;

        break;
      }

      case 'position': {
        const cell = newRow.insertCell();

        cell.innerText = newEmployee.get(inputName);

        if (cell.innerText === '') {
          pushNotification(10, 10, 'Error', 'Empty position', 'error');

          return;
        }

        break;
      }

      case 'office': {
        const cell = newRow.insertCell();

        cell.innerText = newEmployee.get(inputName);

        break;
      }

      case 'age': {
        const age = +newEmployee.get(inputName);

        if ((age < 18) || (age > 90)) {
          pushNotification(
            10,
            10,
            'Error',
            'Age must be between 18 & 90',
            'error'
          );

          return;
        }

        const cell = newRow.insertCell();

        cell.innerText = age;

        break;
      }

      case 'salary': {
        const cell = newRow.insertCell();

        cell.innerText = formatSalary(newEmployee.get('salary'));

        break;
      }
    }
  }

  table.tBodies[0].append(newRow);

  pushNotification(450, 10, 'Success', 'New employee was added', 'success');
};

saveForm.appendChild(submit);
document.body.appendChild(saveForm);

function getSelectOptions() {
  return `<option value="Tokyo" selected>Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>`;
}

function formatSalary(salary) {
  const formated = (+salary).toLocaleString('en-US');

  return '$' + formated;
}

function pushNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationMsg = document.createElement('p');

  notification.className = 'notification ' + type;
  notification.dataset.qa = 'notification';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  notification.style.zIndex = 4;
  notificationTitle.className = 'title';
  notificationTitle.innerHTML = title;
  notificationTitle.style.fontSize = '18px';
  notificationMsg.innerHTML = description;

  notification.append(notificationTitle);
  notification.append(notificationMsg);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

table.tBodies[0].addEventListener('dblclick', e => {
  const cellToEdit = e.target;
  const initialValue = cellToEdit.innerHTML;

  cellToEdit.innerHTML = `
    <input
      name="cell-input"
      class="cell-input"
      type="text"
      value="${initialValue}"
    >
  `;

  const cellInput = document.querySelector('.cell-input');

  cellInput.onblur = function() {
    cellToEdit.innerHTML = cellInput.value || initialValue;
    cellInput.remove();
  };

  cellInput.onkeydown = function(ev) {
    if (ev.code === 'Enter') {
      cellInput.blur();
    }
  };
});
