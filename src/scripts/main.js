'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead > tr > th');
const tbody = table.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

function sortTable(arr, count, header, index) {
  return arr.sort((rowA, rowB) => {
    let cellA = rowA.children[index].textContent;
    let cellB = rowB.children[index].textContent;

    if (count % 2 === 0) {
      cellA = rowB.children[index].textContent;
      cellB = rowA.children[index].textContent;
    }

    if (header.textContent === 'Salary') {
      const parseSalary = (salary) => parseFloat(salary.replace(/[$,]/g, ''));

      return parseSalary(cellA) - parseSalary(cellB);
    }

    if (header.textContent === 'Age') {
      return parseInt(cellA) - parseInt(cellB);
    }

    return cellA.localeCompare(cellB);
  });
}

headers.forEach((header, index) => {
  let count = 0;

  header.addEventListener('click', () => {
    count++;

    const rowsArray = Array.from(rows);

    const sortedRows = sortTable(rowsArray, count, header, index);

    tbody.append(...sortedRows);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  // console.log(row);
});
