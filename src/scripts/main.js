'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');

/**
 * Parses a salary string (e.g. "$123,456") and returns an integer.
 */
function parseSalary(salaryStr) {
  return parseInt(salaryStr.replace(/[$,]/g, '')) || 0;
}

/**
 * Formats an integer as a salary string (e.g. "$123,456").
 */
function formatSalary(salaryInt) {
  return salaryInt.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

/**
 * Extracts table data into an array of rows, where each row is an array.
 * Converts numeric and salary cells appropriately.
 */
function extractTableData(tableEl) {
  const tbody = tableEl.querySelector('tbody');

  return Array.from(tbody.rows).map((row) => {
    return Array.from(row.cells).map((cell, index) => {
      if (index === 3) {
        return parseInt(cell.textContent) || 0;
      } else if (index === 4) {
        return parseSalary(cell.textContent);
      }

      return cell.textContent;
    });
  });
}

const employeesData = extractTableData(table);

/**
 * Sorts an array of rows by the given column index.
 * Uses localeCompare for strings and numerical subtraction for numbers.
 */
function sortDataByColumn(data, columnIndex) {
  if (!data.length) {
    return [];
  }

  const sampleValue = data[0][columnIndex];
  const isNumeric = typeof sampleValue === 'number';

  const comparator = (a, b) => {
    const valA = a[columnIndex];
    const valB = b[columnIndex];

    if (isNumeric) {
      return valA - valB;
    }

    return valA.localeCompare(valB);
  };

  return [...data].sort(comparator);
}

/**
 * Creates a document fragment containing table rows (<tr>) built from data.
 * The salary column (index 4) is formatted as a currency string.
 */
function createTableBodyFragment(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((rowData) => {
    const row = document.createElement('tr');

    rowData.forEach((cellData, index) => {
      const cell = document.createElement('td');

      cell.textContent = index === 4 ? formatSalary(cellData) : cellData;
      row.appendChild(cell);
    });

    fragment.appendChild(row);
  });

  return fragment;
}

/**
 * Updates the table: sorts the employee data by the column corresponding
 * to headerCell, then rebuilds the table body.
 */
function updateTableSorting(headerCell) {
  const columnIndex = Array.from(headerCell.parentNode.children).indexOf(
    headerCell,
  );
  const sortedData = sortDataByColumn(employeesData, columnIndex);

  tableBody.innerHTML = '';
  tableBody.appendChild(createTableBodyFragment(sortedData));
}

/**
 * Handle header cell clicks to sort the table.
 */
table.addEventListener('click', (e) => {
  const headerCell = e.target.closest('th');

  if (!headerCell || !headerCell.closest('thead')) {
    return;
  }

  updateTableSorting(headerCell);
});
