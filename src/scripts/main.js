'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');

// sort table handler
table.tHead.addEventListener('click', ev => {
  const targetHeader = ev.target.closest('th');

  if (!targetHeader || !table.tHead.contains(targetHeader)) {
    return;
  }

  const header = table.tHead.firstElementChild;

  // the table can be sorted only by one column at a time
  // if it was sorted by 'Name' before and now the 'Age' is pressed
  // it will not be sorted by 'Name' anymore, hence remove the flag
  const previousHeader = [...header.cells].find(cell => {
    return cell.sorted && cell !== ev.target;
  });

  if (previousHeader) {
    previousHeader.sorted = false;
  }

  const rows = [...tableBody.rows];

  if (targetHeader.sorted) {
    rows.reverse();
  } else {
    targetHeader.sorted = true;

    const idx = ev.target.cellIndex;

    if (targetHeader.textContent === 'Age'
      || targetHeader.textContent === 'Salary') {
      rows.sort((rowA, rowB) => {
        return +rowA.cells[idx].textContent.replace(/\D/g, '')
          - +rowB.cells[idx].textContent.replace(/\D/g, '');
      });
    } else {
      rows.sort((rowA, rowB) => {
        return rowA.cells[idx].textContent.localeCompare(
          rowB.cells[idx].textContent
        );
      });
    }
  }

  rows.forEach(row => {
    table.tBodies[0].insertAdjacentElement('beforeend', row);
  });
});

// select row handler
tableBody.addEventListener('click', ev => {
  const targetRow = ev.target.closest('tr');

  if (!targetRow || !tableBody.contains(targetRow)) {
    return;
  }

  const rows = tableBody.querySelectorAll('tr');

  const selectedRow = [...rows].find(row => {
    return row.classList.contains('active') && row !== targetRow;
  });

  if (selectedRow) {
    selectedRow.classList.toggle('active');
  }

  targetRow.classList.toggle('active');
});

// modify table content handler
tableBody.addEventListener('dblclick', ev => {
  const cell = ev.target.closest('td');

  if (!cell || !tableBody.contains(cell)) {
    return;
  }

  const content = cell.textContent;

  cell.innerHTML = '';

  cell.insertAdjacentHTML('afterbegin', `
    <input
      type="${cell.cellIndex >= 3 ? 'number' : 'text'}"
      class="cell-input"
      data-value="${content}"
      >
      `);

  cell.firstElementChild.focus();

  cell.firstElementChild.addEventListener('blur', onBlur);
  cell.firstElementChild.addEventListener('keydown', onEnter);
});

function onBlur(e) {
  const targetCell = e.target.closest('td');

  saveCellInput(targetCell);
}

function onEnter(e) {
  if (e.code !== 'Enter') {
    return;
  }

  const targetCell = e.target.closest('td');

  e.target.removeEventListener('blur', onBlur);
  saveCellInput(targetCell);
}

function saveCellInput(cell) {
  const cellValue = cell.firstElementChild.value
    || cell.firstElementChild.dataset.value;

  cell.firstElementChild.remove();

  if (cell.cellIndex === 4) {
    cell.textContent = formatSalaryInput(cellValue);
  } else {
    cell.textContent = cellValue;
  }
}

function formatSalaryInput(salary) {
  if (isNaN(salary)) {
    return salary;
  }

  return '$' + (+salary).toLocaleString('en-us');
}
