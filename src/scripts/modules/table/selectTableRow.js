'use strict';

let selectedRow = null;

/* eslint-disable-next-line no-shadow */
const selectTableRow = (event) => {
  const tableRow = event.target.closest('tr');

  const table = event.currentTarget;
  const tableBody = table.querySelector('tbody');

  if (!tableRow || !tableBody.contains(tableRow)) {
    return;
  }

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  tableRow.classList.add('active');
  selectedRow = tableRow;
};

module.exports = { selectTableRow };
