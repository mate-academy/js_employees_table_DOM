'use strict';

const COLUMNS = {
  NAME: 0,
  POSITION: 1,
  OFFICE: 2,
  AGE: 3,
  SALARY: 4,
};

const formatSalary = (salary) => {
  return parseInt(salary.slice(1).replace(/,/g, ''));
};

let isDescOrder = false;
let currentSortField = null;

const setSortOrder = (newSortField) => {
  if (currentSortField !== null && currentSortField === newSortField) {
    isDescOrder = !isDescOrder;
  } else {
    isDescOrder = false;
    currentSortField = newSortField;
  }
};

function sortTable(column) {
  setSortOrder(column);

  rows.sort((a, b) => {
    const aValue = a.cells[column].textContent;
    const bValue = b.cells[column].textContent;

    const order = isDescOrder ? -1 : 1;

    switch (column) {
      case COLUMNS.AGE:
        return order * (parseInt(aValue) - parseInt(bValue));

      case COLUMNS.SALARY:
        return order * (formatSalary(aValue) - formatSalary(bValue));

      default:
        return order * aValue.localeCompare(bValue);
    }
  });

  tbody.innerHTML = '';

  rows.forEach(row => {
    tbody.appendChild(row);
  });
}

const tableElement = document.querySelector('table');
const tbody = tableElement.querySelector('tbody');
const rows = Array.from(tbody.rows);
const headers = document.querySelectorAll('thead th');

headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    sortTable(columnIndex);
  });
});
