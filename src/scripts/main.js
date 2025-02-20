'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const tableHead = table.querySelector('thead');
const headers = Array.from(tableHead.querySelectorAll('th'));

// --- Column definitions, converters ---
const columns = extractColumnNames();
const columnConverters = {
  age: (text) => parseInt(text, 10) || 0,
  salary: parseSalary,
};
const employeesData = extractTableData(table, columns);

// --- Data Extraction ---

/** Parses table headers to create mapping for object and dataset values. */
function extractColumnNames() {
  return headers.map((cell) => cell.textContent.toLowerCase().trim());
}

/** Parses a salary string (e.g. "$123,456") and returns an integer. */
function parseSalary(salaryStr) {
  return parseInt(salaryStr.replace(/[$,]/g, '')) || 0;
}

/** Formats an integer as a salary string (e.g. "$123,456"). */
function formatSalary(salaryInt) {
  return salaryInt.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

/** Extracts table data into an array of objects using column names as keys. */
function extractTableData(tableEl, columnNames) {
  const tbody = tableEl.querySelector('tbody');

  return Array.from(tbody.rows).map((row) => {
    const cells = Array.from(row.cells);

    return columnNames.reduce((acc, columnName, index) => {
      const converter = columnConverters[columnName] || ((text) => text);

      acc[columnName] = converter(cells[index].textContent);

      return acc;
    }, {});
  });
}

// --- Data Sorting and Table Regenerating ---

/**
 * Sorts an array of data objects by the given column name.
 * Uses localeCompare for strings and numerical subtraction for numbers.
 */
function sortDataByColumn(data, columnName, order = 'asc') {
  if (!data.length) {
    return [];
  }

  const factor = order === 'asc' ? 1 : -1;
  const sampleValue = data[0][columnName];
  const isNumeric = typeof sampleValue === 'number';

  const comparator = (a, b) => {
    const valA = a[columnName];
    const valB = b[columnName];

    if (isNumeric) {
      return (valA - valB) * factor;
    }

    return valA.localeCompare(valB) * factor;
  };

  return [...data].sort(comparator);
}

/**
 * Creates a document fragment containing table rows (<tr>) built from data.
 * Uses the columnNames array to preserve the columns ordder.
 * The salary column values are formatted as currency strings.
 */
function createTableBodyFragment(data, columnNames) {
  const fragment = document.createDocumentFragment();

  data.forEach((rowData) => {
    const row = document.createElement('tr');

    columnNames.forEach((columnName) => {
      const cellData = rowData[columnName];
      const cell = document.createElement('td');

      cell.textContent =
        columnName === 'salary' ? formatSalary(cellData) : cellData;
      row.appendChild(cell);
    });

    fragment.appendChild(row);
  });

  return fragment;
}

/**
 * Defines the next sorting order for a target header cell.
 * If no order or descending is set, returns 'asc'; otherwise 'desc'.
 */
function getNextSortOrder(headerCell) {
  const currentOrder = headerCell.dataset.sorting;

  return !currentOrder || currentOrder === 'desc' ? 'asc' : 'desc';
}

/**
 * Clears sorting state from all header cells.
 */
function clearSortingStates() {
  table.querySelectorAll('th[data-sorting]').forEach((th) => {
    th.removeAttribute('data-sorting');
  });
}

/**
 * Updates the table: sorts the employee data by the column corresponding
 * to headerCell, then rebuilds the table body.
 */
function updateTableSorting(headerCell, order, columnNames) {
  const columnIndex = Array.from(headerCell.parentNode.children).indexOf(
    headerCell,
  );
  const columnName = columnNames[columnIndex];
  const sortedData = sortDataByColumn(employeesData, columnName, order);

  tableBody.innerHTML = '';
  tableBody.appendChild(createTableBodyFragment(sortedData, columns));
}

// Handle sorting when a header cell is clicked
function handleHeaderClick(headerCell) {
  const nextOrder = getNextSortOrder(headerCell);

  clearSortingStates();
  headerCell.dataset.sorting = nextOrder;
  updateTableSorting(headerCell, nextOrder, columns);
}

// Handle making row 'active' when a row in the body is clicked
function handleRowClick(row) {
  document
    .querySelectorAll('.active')
    .forEach((element) => element.classList.remove('active'));
  row.classList.add('active');
}

// --- Table Event Delegation ---
table.addEventListener('click', (e) => {
  const target = e.target;
  const clickedHeaderCell = target.closest('th');
  const clickedRow = target.closest('tr');

  if (clickedHeaderCell && target.closest('thead')) {
    handleHeaderClick(clickedHeaderCell);

    return;
  }

  if (clickedRow && target.closest('tbody')) {
    handleRowClick(clickedRow);
  }
});
