'use strict';

const table = document.querySelector('table');

// eslint-disable-next-line no-shadow
document.addEventListener('click', event => {
  const item = event.target;
  const head = item.closest('thead');

  if (head) {
    sortTableColumns(item, head);

    return;
  }

  const row = item.closest('tr');

  if (row && !row.closest('tfoot')) {
    selectTableRow(row);
  }
});

// SORTING COLUMNS
function sortTableColumns(item, head) {
  const sortedOrder = item.dataset.sorted;
  const colIndex = item.cellIndex;
  const tBody = table.tBodies[0];
  const rows = [...tBody.rows];

  rows.sort((a, b) => {
    const cellA = !sortedOrder || sortedOrder === 'desc'
      ? a.cells[colIndex].textContent
      : b.cells[colIndex].textContent;
    const cellB = !sortedOrder || sortedOrder === 'desc'
      ? b.cells[colIndex].textContent
      : a.cells[colIndex].textContent;

    item.dataset.sorted = !sortedOrder || sortedOrder === 'desc'
      ? 'asc'
      : 'desc';

    switch (colIndex) {
      case 0:
      case 1:
      case 2:
      default:
        return cellA.localeCompare(cellB);

      case 3:
      case 4:
        const numA = +cellA.replace(/\D/g, '');
        const numB = +cellB.replace(/\D/g, '');

        return numA - numB;
    }
  });

  head.querySelectorAll('[data-sorted]').forEach(title => {
    if (title.cellIndex === colIndex) {
      return;
    }

    delete title.dataset.sorted;
  });

  rows.forEach(row => tBody.appendChild(row));
}

// SELECT ROW
function selectTableRow(row) {
  if (row.classList.contains('active')) {
    return;
  }

  table
    .querySelectorAll('tr.active')
    .forEach(active => active.classList.remove('active'));

  row.classList.add('active');
}
