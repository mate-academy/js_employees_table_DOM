'use strict';

const table = document.querySelector('table');
const tableHead = table.tHead;
const tableBody = table.tBodies[0];
const columns = [...tableHead.rows[0].cells];
const rows = [...tableBody.rows];

let sortedColumn = null;

function sortByColumn(column) {
  const columnIndex = columns.indexOf(column);

  rows.sort((rowA, rowB) => {
    const { textContent: cellA } = rowA.cells[columnIndex];
    const { textContent: cellB } = rowB.cells[columnIndex];

    switch (column.textContent) {
      case 'Name':
      case 'Position':
      default:
        return cellA.localeCompare(cellB);

      case 'Age':
      case 'Salary':
        return +cellA.replace(/\D/g, '') - +cellB.replace(/\D/g, '');
    }
  });

  return column;
}

columns.forEach((column) => {
  column.addEventListener('click', () => {
    if (sortedColumn === column) {
      rows.reverse();
    } else {
      sortedColumn = sortByColumn(column);
    }

    tableBody.append(...rows);
  });
});

let activeRow = null;

rows.forEach((row) => {
  row.addEventListener('click', () => {
    row.classList.toggle('active');

    if (activeRow && activeRow !== row) {
      activeRow.classList.remove('active');
    }

    activeRow = !activeRow || activeRow !== row ? row : null;
  });
});

const body = document.querySelector('body');
const form = document.createElement('form');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const labelSalary = document.createElement('label');

const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const selectOffice = document.createElement('select');
const selectOfficeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');

const submitButton = document.createElement('button');

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function showNotification(type, message) {
  const div = document.createElement('div');
  const span = document.createElement('span');

  div.classList.add('notification', type);
  div.dataset.qa = 'notification';

  span.classList.add('title');
  span.textContent = message;

  div.append(span);
  body.append(div);

  setTimeout(() => div.remove(), 5000);
}

inputName.name = 'name';
inputName.type = 'text';
inputName.dataset.qa = 'name';

inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.dataset.qa = 'position';

selectOffice.name = 'office';
selectOffice.dataset.qa = 'office';

selectOfficeOptions.forEach((selectOfficeOption) => {
  const option = document.createElement('option');

  option.value = selectOfficeOption;
  option.textContent = selectOfficeOption;

  selectOffice.append(option);
});

inputAge.name = 'age';
inputAge.type = 'number';
inputAge.dataset.qa = 'age';

inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.dataset.qa = 'salary';

submitButton.textContent = 'Save to table';
submitButton.type = 'submit';

labelName.append(capitalize(inputName.name), inputName);
labelPosition.append(capitalize(inputPosition.name), inputPosition);
labelOffice.append(capitalize(selectOffice.name), selectOffice);
labelAge.append(capitalize(inputAge.name), inputAge);
labelSalary.append(capitalize(inputSalary.name), inputSalary);

form.classList.add('new-employee-form');

form.append(
  labelName,
  labelPosition,
  labelOffice,
  labelAge,
  labelSalary,
  submitButton,
);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const notification = body.querySelector('.notification');

  if (notification) {
    notification.remove();
  }

  for (let i = 0; i < form.elements.length - 1; i++) {
    if (!form[i].value) {
      return showNotification(
        'error',
        `${capitalize(form[i].name)} is required`,
      );
    }

    switch (form[i].name) {
      case inputName.name: {
        if (inputName.value.length < 4) {
          return showNotification(
            'error',
            'Name must contain at least 4 letters',
          );
        }

        break;
      }

      case inputAge.name: {
        if (inputAge.value < 18 || inputAge.value > 80) {
          return showNotification(
            'error',
            'Age must be between 18 and 80 inclusively',
          );
        }

        break;
      }

      default:
        break;
    }
  }

  const tableRow = document.createElement('tr');

  for (let i = 0; i < form.elements.length - 1; i++) {
    const tableData = document.createElement('td');

    tableData.textContent = form[i].value;

    if (form[i] === inputSalary) {
      tableData.textContent = tableData.textContent.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ',',
      );
    }

    let textContent = form[i].value;

    if (form[i].name === inputSalary.name) {
      textContent = '$' + form[i].value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    tableData.textContent = textContent;

    tableRow.append(tableData);
  }

  tableBody.append(tableRow);

  return showNotification(
    'success',
    'New employee is successfully added to the table',
  );
});

body.append(form);

tableBody.addEventListener('dblclick', (cellEvent) => {
  cellEvent.preventDefault();

  if (cellEvent.target.tagName === 'TD') {
    const cell = cellEvent.target;
    const input = document.createElement('input');
    const text = cell.childNodes[0];

    input.classList.add('cell-input');
    input.value = cell.textContent;

    input.addEventListener('blur', (blurEvent) => {
      blurEvent.preventDefault();

      if (input.value) {
        text.textContent = input.value;
      }

      cell.replaceChild(text, input);
    });

    input.addEventListener('keypress', (inputEvent) => {
      if (inputEvent.key === 'Enter') {
        inputEvent.preventDefault();

        if (input.value) {
          text.textContent = input.value;
        }

        cell.replaceChild(text, input);
      }
    });

    cell.replaceChild(input, text);
    input.focus();
  }
});
