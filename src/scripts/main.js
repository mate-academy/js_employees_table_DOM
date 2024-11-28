'use strict';

// write code here
const headers = document.querySelectorAll('th');
const table = document.querySelector('table');
let sortOrder = 'asc';
let currentColumn = null;
const rows = Array.from(table.rows);
const rowsTo = rows.slice(1, rows.length - 1);
const tBody = document.querySelector('tbody');
const rowsToActive = tBody.querySelectorAll('tr');

const sortBy = (columnIndex) => {
  rowsTo.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent;
    const cellB = rowB.cells[columnIndex].textContent;

    if (currentColumn !== columnIndex) {
      sortOrder = 'asc';
    }

    switch (columnIndex) {
      case 0:
        currentColumn = 0;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 1:
        currentColumn = 1;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 2:
        currentColumn = 2;

        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      case 3:
        currentColumn = 3;

        return sortOrder === 'asc' ? +cellA - +cellB : +cellB - +cellA;
      case 4:
        currentColumn = 4;

        return sortOrder === 'asc'
          ? +cellA.slice(1).split(',').join('') -
              +cellB.slice(1).split(',').join('')
          : +cellB.slice(1).split(',').join('') -
              +cellA.slice(1).split(',').join('');
      default:
        return 0;
    }
  });

  rowsTo.forEach((row) => table.appendChild(row));

  sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
};

rowsToActive.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

headers.forEach((header, index) => {
  header.addEventListener('click', () => sortBy(index));
});
