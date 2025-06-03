'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const MIN_AGE = 18;
const MAX_AGE = 90;
const MIN_NAME_LENGTH = 4;

table.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const th = e.target;

    sortColumns(th.cellIndex, th.innerHTML);
  }

  if (e.target.tagName === 'TD') {
    const td = e.target;
    const row = td.parentElement;
    const activeRow = table.querySelector('tbody tr.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    row.classList.add('active');
  }
});

const currentSortOrder = {};

function sortColumns(colNum, title) {
  const body = table.querySelector('tbody');
  const rowsArray = Array.from(body.rows);

  currentSortOrder[colNum] =
    currentSortOrder[colNum] === 'asc' ? 'desc' : 'asc';

  const sortOrder = currentSortOrder[colNum];

  let compare;

  switch (title) {
    case 'Name':
    case 'Position':
    case 'Office':
      compare = function (rowA, rowB) {
        const a = rowA.cells[colNum].innerHTML.toLowerCase();
        const b = rowB.cells[colNum].innerHTML.toLowerCase();

        return sortOrder === 'asc' ? (a > b ? 1 : -1) : a < b ? 1 : -1;
      };
      break;

    case 'Age':
      compare = function (rowA, rowB) {
        const a = parseInt(rowA.cells[colNum].innerHTML);
        const b = parseInt(rowB.cells[colNum].innerHTML);

        return sortOrder === 'asc' ? a - b : b - a;
      };
      break;

    case 'Salary':
      compare = function (rowA, rowB) {
        const a = parseFloat(rowA.cells[colNum].innerHTML.replace(/[$,]/g, ''));
        const b = parseFloat(rowB.cells[colNum].innerHTML.replace(/[$,]/g, ''));

        return sortOrder === 'asc' ? a - b : b - a;
      };
      break;
  }

  rowsArray.sort(compare);
  body.append(...rowsArray);
}

table.insertAdjacentHTML(
  'afterend',
  `<form action="#" method="post" class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>

    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>

    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="Tokyo" selected>Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" type="number" data-qa="age">
    </label>

    <label>Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button type="submit">Save to table</button>
  </form>`,
);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const error = getError(data);
  const warning = getWarning(data);

  if (error) {
    showNotification('error', error);

    return;
  }

  if (warning) {
    showNotification('warning', warning);

    return;
  }

  addTableRow(data);
});

function addTableRow(formObject) {
  const newRow = table.insertRow();

  for (const key in formObject) {
    const newCell = newRow.insertCell();

    if (key === 'salary') {
      newCell.innerHTML = parseFloat(formObject[key]).toLocaleString('en-Us', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      });
    } else {
      newCell.innerHTML = formObject[key];
    }
  }
  tableBody.append(newRow);
  form.reset();
  showNotification('success', 'New employee added.');
}

function getError(fData) {
  for (const key in fData) {
    if (!fData[key] || fData[key].trim() === '') {
      return `All fields are required.`;
    }
  }

  if (fData.name.length < MIN_NAME_LENGTH) {
    return `Name must be at least ${MIN_NAME_LENGTH} characters long.`;
  }

  if (parseInt(fData.age) < MIN_AGE || parseInt(fData.age) > MAX_AGE) {
    return `Age must be between ${MIN_AGE} and ${MAX_AGE}.`;
  }

  return null;
}

function getWarning(dataForm) {
  const positionPattern = /^([A-Z][a-zA-Z]+)(\s[A-Z][a-z]+)*$/;
  const namePattern = /^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/;

  if (!namePattern.test(dataForm.name)) {
    return `All words must start from the uppercase letter.`;
  }

  if (!positionPattern.test(dataForm.position)) {
    return `All words must start from the uppercase letter.`;
  }

  return null;
}

let currentNotification;

function showNotification(type, message) {
  if (currentNotification) {
    currentNotification.remove();
  }

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h3');
  const notificationText = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  notificationTitle.className = 'title';
  notificationTitle.innerHTML = `${type.charAt(0).toUpperCase() + type.slice(1)}!`;
  notificationText.textContent = message;
  notification.append(notificationTitle, notificationText);

  currentNotification = notification;
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
}

let editingTd;

tableBody.addEventListener('dblclick', (e) => {
  e.preventDefault();

  const td = e.target.closest('td');

  if (editingTd) {
    return;
  }

  editingTd = td;

  const originalTdValue = td.innerHTML;
  const textArea = document.createElement('textarea');

  textArea.style.width = td.clientWidth + 'px';
  textArea.style.height = td.clientHeight + 'px';

  textArea.classList.add('cell-input');
  textArea.value = originalTdValue;
  td.innerHTML = '';
  td.append(textArea);
  textArea.focus();

  textArea.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      saveChanges(td, originalTdValue);
    }
  });

  textArea.addEventListener('blur', () => {
    saveChanges(td, originalTdValue);
  });
});

function saveChanges(cell, value) {
  const tArea = cell.querySelector('.cell-input');

  if (!cell || !tArea) {
    return;
  }

  const newValue = tArea.value.trim();

  cell.innerHTML = newValue === '' ? value : newValue;

  editingTd = null;
}
