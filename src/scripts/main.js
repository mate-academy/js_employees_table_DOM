'use strict';

// отримую заголовки -- Array.from(document.querySelector('thead tr').children);
const thead = document.querySelector('thead');
let currentSortIndex = null;
let sortDirection = 'asc';
const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

thead.addEventListener('click', (e) => {
  const tableHeader = e.target.closest('th');

  if (!tableHeader) {
    return;
  }

  // const tbody = document.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const cellIndex = tableHeader.cellIndex;

  // логіка напрямку--
  if (cellIndex === currentSortIndex) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortIndex = cellIndex;
    sortDirection = 'asc';
  }

  rows.sort((rowA, rowB) => {
    let result;

    // текстові колонки
    if (cellIndex === 0 || cellIndex === 1 || cellIndex === 2) {
      const valueA = rowA.children[cellIndex].textContent.trim();
      const valueB = rowB.children[cellIndex].textContent.trim();

      result = valueA.localeCompare(valueB);
    }
    // числові колонки
    else {
      const valueA = Number(
        rowA.children[cellIndex].textContent.replace(/[$,]/g, ''),
      );
      const valueB = Number(
        rowB.children[cellIndex].textContent.replace(/[$,]/g, ''),
      );

      result = valueA - valueB;
    }

    // застосування напрямку
    return sortDirection === 'asc' ? result : -result;
  });

  tbody.append(...rows);
});
