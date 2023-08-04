'use strict';

const tableHead = document.querySelector('thead').firstElementChild;
const tableBody = document.querySelector('tbody');

let isDescOrder = false;
let currentSortFieldIdx = null;

const setSortOrder = (newSortFieldIdx) => {
  if (currentSortFieldIdx !== null && currentSortFieldIdx === newSortFieldIdx) {
    isDescOrder = !isDescOrder;
  } else {
    isDescOrder = false;
    currentSortFieldIdx = newSortFieldIdx;
  }
};

const getParsedData = (firstData, secondData) => {
  const firstParsedData = parseFloat(firstData.replace(/[^\d.-]/g, ''));
  const secondParsedData = parseFloat(secondData.replace(/[^\d.-]/g, ''));

  return [firstParsedData, secondParsedData];
};

const getSortedRows = (rows, sortIndex) => {
  const sortedRows = [...rows].sort((row1, row2) => {
    const firstRow = isDescOrder ? row2 : row1;
    const secondRow = isDescOrder ? row1 : row2;

    const firstData = firstRow.children[sortIndex].textContent;
    const secondData = secondRow.children[sortIndex].textContent;

    const [
      firstParsedData,
      secondParsedData,
    ] = getParsedData(firstData, secondData);

    if (firstParsedData && secondParsedData) {
      return firstParsedData - secondParsedData;
    }

    return firstData.localeCompare(secondData);
  });

  return sortedRows;
};

const getSortedRowsByField = (sortField) => {
  const tableTitles = [...tableHead.children].map(th => (
    th.textContent
  ));

  const tableTitleIdx = tableTitles.indexOf(sortField);

  if (tableTitleIdx < 0) {
    return;
  }

  setSortOrder(tableTitleIdx);

  const tableRows = [...tableBody.rows];

  const sortedTableRows = getSortedRows(tableRows, tableTitleIdx);

  return sortedTableRows;
};

/* eslint-disable-next-line no-shadow */
const sortTable = (event) => {
  const targetItem = event.target;
  const isHeader = !!targetItem.closest('thead');

  if (!isHeader) {
    return;
  }

  const tableTitle = targetItem.textContent;

  const sortedRows = getSortedRowsByField(tableTitle);

  if (!sortedRows) {
    return;
  }

  tableBody.append(...sortedRows);
};

module.exports = { sortTable };
