'use strict';

// Sort table part

const headers = Array.from(document.querySelectorAll('thead th'));

headers.forEach((header) => {
  header.addEventListener('mouseover', function() {
    header.classList.add('sorted__column-asc');
  });

  header.addEventListener('click', (events) => {
    const columnNumber = headers.indexOf(events.target);

    if (header.classList.contains('sorted__column-asc')) {
      tableSort(columnNumber, true);

      header.classList.replace('sorted__column-asc', 'sorted__column-desc');
    } else {
      tableSort(columnNumber, false);
      header.classList.replace('sorted__column-desc', 'sorted__column-asc');
    };
  });
});

function tableSort(column, asc = true) {
  const direction = asc ? 1 : -1;

  const tBody = document.querySelector('tbody');
  const rowsArray = Array.from(document.querySelectorAll('tbody tr'));

  const sortedRows = rowsArray.sort((a, b) => {
    let aText = a.querySelector(`td:nth-child(${column + 1})`).textContent;

    let bText = b.querySelector(`td:nth-child(${column + 1})`).textContent;

    if (aText.includes('$') || bText.includes('$')) {
      aText = convertSalary(aText);
      bText = convertSalary(bText);
    }

    return aText > bText ? (1 * direction) : (-1 * direction);
  });

  tBody.append(...sortedRows);
};

function convertSalary(salary) {
  return +salary.split('$').join('').split(',').join('');
};

// Select row part

const rows = document.querySelectorAll('tbody tr');

rows.forEach(row => {
  rowSelect(row);
});

function rowSelect(row) {
  row.addEventListener('click', (events) => {
    rows.forEach((prevRow) => {
      prevRow.classList.remove('active');
    });

    const currentRow = events.target.parentNode;

    currentRow.classList.add('active');
  });
};

// Create employee form part

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');

table.insertAdjacentHTML(
  'afterend',
  `
  <form class='new-employee-form'>
    <label>
      Name:
      <input
      name='name'
      type='text'
      class='name'
      data-qa='name'
      required
      >
    </label>

    <label>
      Position:
      <input
      name='position'
      class='position'
      type='text'
      data-qa='position'
      required
      >
    </label>

    <label>
      Office:

      <select
      data-qa='office'
      id='office'
      name='office'
      class='office'
      >
        <option value='Tokyo'>Tokyo</option>
        <option value='Singapore'>Singapore</option>
        <option value='London'>London</option>
        <option value='New York'>New York</option>
        <option value='Edinburgh'>Edinburgh</option>
        <option value='San Francisco'>San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
      type='number'
      data-qa='age'
      class='age'
      required
      >
    </label>

    <label>
      Salary:
      <input
      type='number'
      data-qa='salary'
      class='salary'
      required
      >
    </label>

    <button type='submit'>Save to table</button>
  </form>
`
);

function showNotification(title, description, type) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  body.append(div);

  div.setAttribute('data-qa', 'notification');
  div.classList = `notification ${type}`;

  div.insertAdjacentHTML(
    'afterbegin',
    `
      <h2 class= 'title'>${title}</h2>
      <p>${description}</p>
      `
  );

  setTimeout(function() {
    div.style.display = 'none';
  }, 2000);
}

const submitButton = document.querySelector('button');

submitButton.addEventListener('click', function(events) {
  const form = document.querySelector('form');
  const labels = form.children;
  const row = document.createElement('tr');

  events.preventDefault();

  for (let i = 0; i < labels.length - 1; i++) {
    const tableData = document.createElement('td');
    const input = labels[i].firstElementChild;
    let inputValue = input.value;

    if (
      input.classList.value === 'name'
    && (inputValue.length < 4
    || inputValue.includes('  ')
    || inputValue.includes('. '))) {
      return showNotification(
        'Error',
        'Name must have more than 3 letters!',
        'error'
      );
    };

    if (
      input.classList.value === 'position'
    && (inputValue.length === 0
    || inputValue.includes('  ')
    || inputValue.includes('. '))) {
      return showNotification(
        'Error',
        'You must specify your position!',
        'error'
      );
    };

    if (input.classList.value === 'age'
      && (+inputValue < 18
      || +inputValue > 90
      || !+inputValue)) {
      return showNotification(
        'Error', 'Age must be in range from 18 to 90 years!', 'error');
    };

    if (input.classList.value === 'salary') {
      if (inputValue.length === 0) {
        return showNotification('Error', 'You must enter the salary!', 'error');
      };

      const salarySize = +inputValue;

      inputValue = '$' + salarySize.toLocaleString('en-US');
    };

    row.append(tableData);
    tableData.innerText = inputValue;
  };

  showNotification('Success', 'The form add into Table', 'success');
  tbody.append(row);

  rowSelect(row);

  row.childNodes.forEach((cell) => {
    addCellEvents(cell);
  });

  form.reset();
});

// Edit cell part

const tableCells = document.querySelectorAll('td');

tableCells.forEach(cell => addCellEvents(cell));

function addCellEvents(cell) {
  cell.addEventListener('dblclick', function() {
    const input = document.createElement('input');
    const cellText = cell.innerText;

    input.classList.add('cell-input');

    cell.replaceChildren(input);
    input.focus();

    const officeCell = cell.parentElement.querySelectorAll('td')[2];
    const ageCell = cell.parentElement.querySelectorAll('td')[3];
    const salaryCell = cell.parentElement.querySelectorAll('td')[4];

    if (cell === ageCell || cell === salaryCell) {
      input.setAttribute('type', 'number');
    };

    if (cell === officeCell) {
      input.remove();

      cell.insertAdjacentHTML('afterbegin', `
      <select
      data-qa='office'
      id='office'
      name='office'
      class='office'
      >
        <option value='Tokyo'>Tokyo</option>
        <option value='Singapore'>Singapore</option>
        <option value='London'>London</option>
        <option value='New York'>New York</option>
        <option value='Edinburgh'>Edinburgh</option>
        <option value='San Francisco'>San Francisco</option>
      </select>
      `);

      const select = document.querySelector('tbody select');

      select.value = cellText;
      select.focus();
    };

    cell.addEventListener('blur', function() {
      if (cell === officeCell) {
        const select = document.querySelector('tbody select');

        return select.replaceWith(select.value);
      };

      if (cell === ageCell
        && input.value.length > 0
        && (input.value < 18 || input.value > 90)) {
        showNotification('Error',
          'Age must be in range from 18 to 90 years!', 'error');

        return input.replaceWith(cellText);
      };

      if (cell === salaryCell && input.value.length > 0) {
        const salarySize = +input.value;

        return input.replaceWith('$' + salarySize.toLocaleString('en-US'));
      };

      input.value
        ? input.replaceWith(input.value)
        : input.replaceWith(cellText);
    }, true);

    cell.addEventListener('keypress', function(events) {
      if (events.code === 'Enter') {
        if (cell === officeCell) {
          const select = document.querySelector('tbody select');

          return select.replaceWith(select.value);
        };

        if (cell === ageCell && (input.value < 18 || input.value > 90)) {
          showNotification('Error',
            'Age must be in range from 18 to 90 years!', 'error');

          return input.replaceWith(cellText);
        };

        input.value
          ? input.replaceWith(input.value)
          : input.replaceWith(cellText);
      };
    }, true);
  });
};
