document.addEventListener('DOMContentLoaded', () => {
  const thead = document.querySelector('thead');
  const tbody = document.querySelector('tbody');
  const theadCells = Array.from(thead.rows[0].cells);
  const sortOrders = {};

  theadCells.forEach((cell, index) => {
    sortOrders[index] = 'asc';
  });

  const sortTable = (columnIndex, order) => {
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent.trim();
      const valueB = b.cells[columnIndex].textContent.trim();

      return order === 'asc'
        ? valueA.localeCompare(valueB, 'en', { numeric: true })
        : valueB.localeCompare(valueA, 'en', { numeric: true });
    });

    const fragment = document.createDocumentFragment();

    rows.forEach((row) => fragment.appendChild(row));
    tbody.appendChild(fragment);
  };

  theadCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      const currentOrder = sortOrders[index];

      sortTable(index, currentOrder);

      sortOrders[index] = currentOrder === 'asc' ? 'desc' : 'asc';
    });
  });
});
