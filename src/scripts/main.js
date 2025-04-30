'use strict';

const table = document.querySelector('table');
const tableHeaders = table.querySelectorAll('thead th');

for (const header of tableHeaders) {
  header.addEventListener('click', () => {
    switch (header.textContent) {
      case 'Name':
        addLastSortAttribute(header);
        sortTable(0, header.getAttribute('lastSort'));
        break;
      case 'Position':
        addLastSortAttribute(header);
        sortTable(1, header.getAttribute('lastSort'));
        break;
      case 'Office':
        addLastSortAttribute(header);
        sortTable(2, header.getAttribute('lastSort'));
        break;
      case 'Age':
        addLastSortAttribute(header);
        sortTable(3, header.getAttribute('lastSort'), true);
        break;
      case 'Salary':
        addLastSortAttribute(header);
        sortTable(4, header.getAttribute('lastSort'), true);
        break;
    }
  });
}

function sortTable(headerIndex, sortDirection, number = false) {
  const tableRows = table.querySelectorAll('tbody tr');
  const sortedRows = [...tableRows].sort((row1, row2) => {
    const row1Columns = row1.querySelectorAll('td');
    const row2Columns = row2.querySelectorAll('td');

    if (!number) {
      if (sortDirection === 'ASC') {
        return row1Columns[headerIndex].textContent.localeCompare(
          row2Columns[headerIndex].textContent,
        );
      }

      return row2Columns[headerIndex].textContent.localeCompare(
        row1Columns[headerIndex].textContent,
      );
    }

    const num1 = convertToNumber(row1Columns[headerIndex].textContent);
    const num2 = convertToNumber(row2Columns[headerIndex].textContent);

    if (sortDirection === 'ASC') {
      return num1 - num2;
    }

    return num2 - num1;
  });

  const tbody = table.querySelector('tbody');

  for (let i = 0; i < tableRows.length; i++) {
    tbody.append(sortedRows[i]);
  }
}

function addLastSortAttribute(header) {
  if (header.hasAttribute('lastSort')) {
    header.setAttribute(
      'lastSort',
      header.getAttribute('lastSort') === 'ASC' ? 'DESC' : 'ASC',
    );
  } else {
    header.setAttribute('lastSort', 'ASC');
  }
}

function convertToNumber(string) {
  return +string.replace('$', '').replace(',', '');
}

const bodyRows = document.querySelectorAll('tbody tr');
let lastSelectedRow = null;

for (const row of bodyRows) {
  row.addEventListener('click', () => {
    row.classList.add('active');

    if (lastSelectedRow && lastSelectedRow !== row) {
      lastSelectedRow.classList.remove('active');
    }

    lastSelectedRow = row;
  });
}

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

const labelName = document.createElement('label');
const inputName = document.createElement('input');

inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');

labelName.textContent = 'Name: ';

labelName.append(inputName);
form.append(labelName);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');

labelPosition.textContent = 'Position: ';

labelPosition.append(inputPosition);
form.append(labelPosition);

const labelOffice = document.createElement('label');
const selectOffice = document.createElement('select');

selectOffice.name = 'office';

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const city of cities) {
  const option = document.createElement('option');

  option.textContent = city;
  selectOffice.append(option);
}

selectOffice.setAttribute('data-qa', 'office');

labelOffice.textContent = 'Office: ';

labelOffice.append(selectOffice);
form.append(labelOffice);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');

labelAge.textContent = 'Age: ';

labelAge.append(inputAge);
form.append(labelAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');

labelSalary.textContent = 'Salary: ';

labelSalary.append(inputSalary);
form.append(labelSalary);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(submitButton);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (formValidation()) {
    showNotification('success');

    const newRow = document.createElement('tr');
    const newData = [
      inputName,
      inputPosition,
      selectOffice,
      inputAge,
      inputSalary,
    ];

    for (const data of newData) {
      const newTd = document.createElement('td');

      if (data.name === 'salary') {
        newTd.textContent =
          '$' + data.value.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
      } else {
        newTd.textContent = data.value;
      }

      newRow.append(newTd);
    }

    const tbody = table.querySelector('tbody');

    tbody.append(newRow);
  } else {
    showNotification('error');
  }
});

function formValidation() {
  if (
    !inputName.value.trim() ||
    !inputAge.value ||
    !inputPosition.value.trim() ||
    !inputSalary.value
  ) {
    return false;
  }

  if (inputName.value.trim().length < 4) {
    return false;
  }

  return !(+inputAge.value < 18 || +inputAge.value > 90);
}

function showNotification(type) {
  const notification = document.createElement('div');

  notification.classList.add(type, 'notification');
  notification.setAttribute('data-qa', 'notification');

  const notificationH2 = document.createElement('h2');
  const notificationP = document.createElement('p');

  if (type === 'error') {
    notificationP.textContent =
      'Validation error.' +
      'Ensure that there no empty fields,' +
      'name length more than 3, ' +
      'age greater than 18 and less than 90.';
  } else {
    notificationP.textContent = 'Successfully added new employee to the table.';
  }

  notificationH2.textContent = type;
  notification.append(notificationH2, notificationP);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

const cells = table.querySelectorAll('td');

for (const cell of cells) {
  cell.addEventListener('dblclick', () => {
    const prevText = cell.textContent;

    cell.textContent = '';

    const newInput = document.createElement('input');

    newInput.classList.add('cell-input');
    cell.append(newInput);

    newInput.focus();

    newInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        cell.textContent = newInput.value.trim() || prevText;
        newInput.remove();
      }
    });

    newInput.addEventListener('focusout', () => {
      cell.textContent = newInput.value.trim() || prevText;
      newInput.remove();
    });
  });
}
