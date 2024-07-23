'use strict';

const body = document.querySelector('tbody');
// region SORTING
const employees = [...document.querySelectorAll('tbody > tr')];
const header = document.querySelector('thead');
let lastSortedColumn = '';
let isAscending = true;

header.addEventListener('click', (e) => {
  const columnName = e.target.closest('th').textContent.trim().toLowerCase();

  isAscending = lastSortedColumn === columnName ? !isAscending : true;
  lastSortedColumn = columnName;
  body.innerHTML = '';

  employees
    .sort(
      (r1, r2) =>
        compareFunctions.get(columnName)(r1, r2) * (isAscending ? 1 : -1),
    )
    .forEach((row) => body.appendChild(row));
});

const compareFunctions = new Map([
  ['name', (r1, r2) => compareStrings(r1, r2, 0)],
  ['position', (r1, r2) => compareStrings(r1, r2, 1)],
  ['office', (r1, r2) => compareStrings(r1, r2, 2)],
  ['age', (r1, r2) => +r1.cells[3].textContent - +r2.cells[3].textContent],
  [
    'salary',
    (r1, r2) =>
      +r1.cells[4].textContent.replace('$', '').replace(',', '') -
      +r2.cells[4].textContent.replace('$', '').replace(',', ''),
  ],
]);

function compareStrings(row1, row2, cellIndex) {
  return row1.cells[cellIndex].textContent.localeCompare(
    row2.cells[cellIndex].textContent,
  );
}

// endregion

// region SELECT ROW
let selectedRow = null;

body.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  row.classList.add('active');
  selectedRow?.classList.remove('active');
  selectedRow = row;
});
// endregion
