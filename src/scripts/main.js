'use strict';

'use strict';

const table = document.querySelector('table');
const tableHeads = document.querySelectorAll('thead th');
const tableRows = document.querySelectorAll('tbody tr');
// for asc order sortDirections is 1, otherwise will be -1
const sortDirections = Array(tableHeads.length).fill(-1);

addFormToPage();

tableHeads.forEach((head, index) => {
  head.addEventListener('click', (e) => {
    const sortValue = head.textContent;

    sortDirections[index] = setSortDirection(index);
    sortTable(sortValue, index, sortDirections[index]);
  });
});

table.tBodies[0].addEventListener('click', (e) => {
  if (e.target && e.target.nodeName === 'TD') {
    const row = e.target.parentElement;
    const rows = table.tBodies[0].getElementsByTagName('tr');
    const prevActiveRowIndex = [...rows].findIndex((r) => {
      return r.classList.contains('active');
    });

    if (prevActiveRowIndex !== -1) {
      rows[prevActiveRowIndex].classList.remove('active');
    }
    row.classList.add('active');
  }
});

function addFormToPage() {
  const form = createForm();

  const inputsFragment = createInputsFragment();

  const submitBtn = createButton('Save to table');

  form.appendChild(inputsFragment);
  form.appendChild(submitBtn);

  // form.addEventListener('submit', (e) => {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (isFormDataValid(form)) {
      insertDataToTable(form);

      showNotification(
        10,
        10,
        'Success',
        'New employee is successfully added to the table!',
        'success',
      );
      form.reset();
    }
  });

  document.body.appendChild(form);
}

function isFormDataValid(formData) {
  const data = new FormData(formData);
  let isValid = true;
  let message = '';

  for (const [inputName, value] of data) {
    if (inputName === 'name' && value.length < 4) {
      message = 'Name should have more then 3 letters';
      isValid = false;
    }

    if (inputName === 'age' && (+value < 18 || +value > 90)) {
      if (message.length > 0) {
        message = message + ', ' + 'not properly age!';
      } else {
        message = 'Not properly age!';
      }
      isValid = false;
    }

    if (!value.length || value.trim() === '') {
      message = 'Empty field not valid!';
      isValid = false;
    }
  }

  if (!isValid) {
    showNotification(10, 10, 'Error', message, 'error');
  }

  return isValid;
}

function showNotification(posTop, posRight, title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <h2 class = 'title'>${title}</h2>
    <p>${description}</p>
  `;

  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// #region creating Form

function insertDataToTable(form) {
  const formData = new FormData(form);
  const newRow = document.createElement('tr');
  const numberFormatter = new Intl.NumberFormat('en-US');

  tableHeads.forEach((head) => {
    const inputName = head.textContent.toLowerCase();
    const newCell = document.createElement('td');
    let cellValue = formData.get(inputName);

    if (inputName === 'salary') {
      cellValue = `$${numberFormatter.format(cellValue)}`;
    }

    newCell.textContent = cellValue;
    newRow.appendChild(newCell);
  });

  table.tBodies[0].appendChild(newRow);
}

function createInputsFragment() {
  const inputsFragment = document.createDocumentFragment();

  tableHeads.forEach((head, i) => {
    const label = createLabel(head.innerText);
    const inputName = head.innerText.toLowerCase();

    if (inputName === 'office') {
      const select = createSelect(inputName, i);

      label.appendChild(select);
    } else {
      const input = createInput(inputName);

      label.appendChild(input);
    }
    inputsFragment.appendChild(label);
  });

  return inputsFragment;
}

function createButton(text) {
  const submitBtn = document.createElement('button');

  submitBtn.innerText = `${text}`;

  return submitBtn;
}

function createInput(inputName) {
  const input = document.createElement('input');

  input.setAttribute('name', inputName);
  input.setAttribute('data-qa', inputName);
  input.setAttribute('required', true);

  if (inputName === 'salary' || inputName === 'age') {
    input.setAttribute('type', 'number');
  }

  return input;
}

function createSelect(inputName, columnIndex) {
  const select = document.createElement('select');

  select.setAttribute('name', inputName);
  select.setAttribute('data-qa', inputName);
  select.setAttribute('required', true);

  const optionValues = getUniqueValuesFromTableColumn(columnIndex);

  optionValues.forEach((value, index) => {
    const option = document.createElement('option');

    option.setAttribute('value', value);
    option.textContent = value;

    if (index === 0) {
      option.setAttribute('selected', true);
    }

    select.appendChild(option);
  });

  return select;
}

function createLabel(text) {
  const label = document.createElement('label');

  label.innerHTML = `${text}: `;

  return label;
}

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  return form;
}

function getUniqueValuesFromTableColumn(columnIndex) {
  const columnData = [...tableRows].map(
    (row) => row.cells[columnIndex].textContent,
  );

  const uniqueData = [...new Set(columnData)];

  return uniqueData;
}

// #endregion

// #region sorting by clicking
function setSortDirection(index) {
  for (let i = 0; i < sortDirections.length; i++) {
    if (i !== index) {
      sortDirections[i] = -1;
    } else {
      sortDirections[i] *= -1;
    }
  }

  return sortDirections[index];
}

function sortTable(sortValue, columnIndex, sortDirection) {
  const rows = [...table.tBodies[0].children];

  rows.sort((a, b) => sortBy(a, b, sortValue, columnIndex, sortDirection));

  const sortedFragment = document.createDocumentFragment();

  rows.forEach((row) => sortedFragment.appendChild(row));
  table.tBodies[0].appendChild(sortedFragment);
}

function sortBy(a, b, sortValue, columnIndex, sortDirection) {
  const cellA = a.cells[columnIndex].innerText;
  const cellB = b.cells[columnIndex].innerText;

  switch (sortValue) {
    case 'Name':
    case 'Position':
    case 'Office':
      return cellA.localeCompare(cellB) * sortDirection;
    case 'Age':
      return (+cellA - +cellB) * sortDirection;
    case 'Salary':
      return (parseNumber(cellA) - parseNumber(cellB)) * sortDirection;
    default:
      return 0;
  }
}

function parseNumber(str) {
  const strNumbers = str.replace(/,/g, '').slice(1);
  const number = Number(strNumbers);

  return isNaN(number) ? 0 : number;
}

// #endregion
