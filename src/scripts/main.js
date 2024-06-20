'use strict';

const tableHeaders = document.querySelectorAll('thead tr th');
const sortOrders = {};

const sortField = (header, sortIndex) => {
  const tableBody = document.querySelector('tbody');
  const tableRows = Array.from(tableBody.querySelectorAll('tr'));

  let sortOrder = sortOrders[sortIndex] || 'desc';

  if (header !== sortOrders.lastHeaderClicked) {
    sortOrder = 'asc';
  } else {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  }

  sortOrders[sortIndex] = sortOrder;
  sortOrders.lastHeaderClicked = header;

  header.setAttribute('data-sort', sortOrder);

  const isNumeric = tableRows.every((row) => {
    const cellText = row.children[sortIndex].innerText;

    return !isNaN(parseFloat(cellText)) && isFinite(cellText);
  });

  tableRows.sort((a, b) => {
    let cellA = a.children[sortIndex].innerText;
    let cellB = b.children[sortIndex].innerText;

    if (isNumeric) {
      cellA = parseNumber(cellA);
      cellB = parseNumber(cellB);

      return sortOrder === 'asc' ? cellA - cellB : cellB - cellA;
    } else {
      cellA = cellA.toLowerCase();
      cellB = cellB.toLowerCase();

      return sortOrder === 'desc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });

  tableRows.forEach((row) => tableBody.appendChild(row));
};

const parseNumber = (number) => {
  return parseFloat(number.replace(/[$,]+/g, ''));
};

tableHeaders.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortField(header, index);
  });
});
