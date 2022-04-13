'use strict';

function markSelectedRow(e) {
  const selectedRow = e.target.closest('tr');
  const rows = selectedRow.parentElement.children;

  for (const row of rows) {
    if (row === selectedRow) {
      row.classList.add('active');
    } else {
      row.classList.remove('active');
    }
  }
}

module.exports = markSelectedRow;
