'use strict';

'use strict';

function makeNumber(str) {
  return Number(str.replace(/[$,]/g, ''));
}

function detectDataType(value) {
  if (!isNaN(value) || !isNaN(makeNumber(value))) {
    return 'number';
  } else {
    return 'string';
  }
}

const table = document.querySelector('table');
const headers = document.querySelectorAll('th');
const firstRow = table.querySelector('tbody tr');
const tableBody = table.querySelector('tbody');
const tableRows = Array.from(tableBody.rows);

if (firstRow) {
  headers.forEach((header, index) => {
    const firstCell = firstRow.cells[index];

    if (firstCell) {
      const firstCellValue = firstCell.textContent.trim();

      header.dataset.type = detectDataType(firstCellValue);
      header.dataset.sortASC = 'true';

      header.addEventListener('click', () => {
        const isAscending = header.dataset.sortASC === 'true';

        header.dataset.sortASC = isAscending ? 'false' : 'true';

        const sortedRows = tableRows.sort((a, b) => {
          const aContent = a.cells[index].textContent.trim();
          const bContent = b.cells[index].textContent.trim();

          let comparison = 0;

          if (header.dataset.type === 'number') {
            comparison = makeNumber(aContent) - makeNumber(bContent);
          } else {
            comparison = aContent.localeCompare(bContent);
          }

          return isAscending ? comparison : -comparison;
        });

        tableBody.innerHTML = '';

        sortedRows.forEach((row) => {
          tableBody.appendChild(row);
        });
      });
    }
  });
}

let selectedRow = null;

tableRows.forEach((row) => {
  row.addEventListener('click', (e) => {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }

    const currentRow = e.currentTarget;

    currentRow.classList.add('active');

    selectedRow = currentRow;
  });
});
