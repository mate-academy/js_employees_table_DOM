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

headers.forEach((header, index) => {
  const firstCellValue = firstRow.cells[index].textContent;

  header.dataset.type = detectDataType(firstCellValue);

  header.dataset.sortASC = 'true';

  header.addEventListener('click', () => {
    const isAscending = header.dataset.sortASC === 'true';

    header.dataset.sortASC = isAscending ? 'false' : 'true';

    const tableBody = table.querySelector('tbody');
    const tableRows = Array.from(tableBody.querySelectorAll('tr'));

    const sortedRows = tableRows.sort((a, b) => {
      const aContent = a.cells[index].textContent;
      const bContent = b.cells[index].textContent;

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
});
