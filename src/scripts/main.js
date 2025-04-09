'use strict';

const tableElement = document.querySelector('table');
const theadElement = document.querySelector('thead');

function determineSortOrder(element) {
  const sortedColumnIndex = element.target.cellIndex;

  if (parseInt(tableElement.dataset.sortIndex) === sortedColumnIndex) {
    if (tableElement.dataset.sortOrder === 'asc') {
      tableElement.dataset.sortOrder = 'desc';
    } else {
      tableElement.dataset.sortOrder = 'asc';
    }
  } else {
    tableElement.dataset.sortIndex = sortedColumnIndex;
    tableElement.dataset.sortOrder = 'asc';
  }

  sortTable();
}

function sortTable() {
  const tbodyElement = document.querySelector('tbody');

  const sortedList = Object.values(tbodyElement.rows).sort(
    (firstEl, secondEl) => {
      const firstValue = cellValueFromRow(firstEl);
      const secondValue = cellValueFromRow(secondEl);

      switch (firstValue.localeCompare(secondValue, 'en', { numeric: true })) {
        case 1:
          return sortByAsc() ? -1 : 1;
        case -1:
          return sortByAsc() ? 1 : -1;
        case 0:
          return 0;
      }
    },
  );

  for (const elem of sortedList) {
    tbodyElement.prepend(elem);
  }
}

const sortByAsc = () => tableElement.dataset.sortOrder !== 'desc';
const sortByRowIndex = () => parseInt(tableElement.dataset.sortIndex) || 0;

const cellValueFromRow = (row) => row.cells[sortByRowIndex()].textContent;

theadElement.addEventListener('click', (element) => {
  determineSortOrder(element);
});
