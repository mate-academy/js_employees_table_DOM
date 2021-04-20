'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
let sortedByHeader;

const headers = [ 'Name', 'Position', 'Office', 'Age', 'Salary' ];

// sort table handler
table.tHead.addEventListener('click', ev => {
  const targetHeader = ev.target.closest('th');

  if (!targetHeader || !table.tHead.contains(targetHeader)) {
    return;
  }

  const rows = [...tableBody.rows];

  if (sortedByHeader === targetHeader) {
    rows.reverse();
  } else {
    sortedByHeader = targetHeader;
    rows.sort(getSortCallback(targetHeader.textContent, ev.target.cellIndex));
  }

  table.tBodies[0].append(...rows);
});

// select row handler
tableBody.addEventListener('click', ev => {
  const targetRow = ev.target.closest('tr');

  if (!targetRow || !tableBody.contains(targetRow)) {
    return;
  }

  [...table.rows].forEach(row => {
    if (row === targetRow) {
      row.classList.toggle('active');
    } else {
      row.classList.remove('active');
    }
  });
});

// modify table content handler
tableBody.addEventListener('dblclick', ev => {
  const cell = ev.target.closest('td');

  if (!cell || !tableBody.contains(cell)) {
    return;
  }

  const content = cell.textContent;

  cell.innerHTML = `
    <input
      type="${['Age', 'Salary'].includes(headers[cell.cellIndex])
    ? 'number' : 'text'}"
      class="cell-input"
      data-value="${content}"
      >
  `;

  sortedByHeader = null;
  cell.firstElementChild.focus();
  cell.firstElementChild.addEventListener('blur', onBlur);
  cell.firstElementChild.addEventListener('keydown', onEnter);
});

function getSortCallback(sortBy, idx) {
  if (['Age', 'Salary'].includes(sortBy)) {
    return (rowA, rowB) => {
      return +rowA.cells[idx].textContent.replace(/\D/g, '')
        - +rowB.cells[idx].textContent.replace(/\D/g, '');
    };
  }

  return (rowA, rowB) => {
    return rowA.cells[idx].textContent.localeCompare(
      rowB.cells[idx].textContent
    );
  };
}

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

  if (headers[cell.cellIndex] === 'Salary') {
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
