'use strict';

const tableHead = document.querySelector('thead');
let lastHeader;

[...tableHead.querySelectorAll('th')].forEach((element) => {
  element.setAttribute('data-type', 'string');
  element.setAttribute('data-order-type', 'ASC');
});
tableHead.querySelector('th:nth-child(4)').setAttribute('data-type', 'number');
tableHead.querySelector('th:nth-child(5)').setAttribute('data-type', 'money');

tableHead.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  sortTable(header);
});

function sortTable(header) {
  const tbodyElements = document.querySelector('tbody');
  const tableRows = [...tbodyElements.rows];

  if (!lastHeader || header !== lastHeader) {
    header.dataset.orderType = 'ASC';
  }

  tableRows.sort((row1, row2) => sortRows(row1, row2, header));

  tableRows.forEach((element) => {
    tbodyElements.append(element);
  });

  header.dataset.orderType =
    header.dataset.orderType === 'ASC' ? 'DESC' : 'ASC';
  lastHeader = header;
}

function sortRows(row1, row2, header) {
  const columnIndex = header.cellIndex;
  const columnType = header.dataset.type;
  const orderType = header.dataset.orderType;
  const value1 = row1.cells[columnIndex].textContent.trim();
  const value2 = row2.cells[columnIndex].textContent.trim();

  if (columnType === 'number') {
    if (orderType === 'ASC') {
      return Number(value1) - Number(value2);
    }

    return Number(value2) - Number(value1);
  }

  if (columnType === 'money') {
    if (orderType === 'ASC') {
      return (
        Number(value1.replaceAll('$', '').replaceAll(',', '')) -
        Number(value2.replaceAll('$', '').replaceAll(',', ''))
      );
    }

    return (
      Number(value2.replaceAll('$', '').replaceAll(',', '')) -
      Number(value1.replaceAll('$', '').replaceAll(',', ''))
    );
  }

  if (orderType === 'ASC') {
    return value1.localeCompare(value2);
  }

  return value2.localeCompare(value1);
}
