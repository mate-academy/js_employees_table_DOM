import { fromUsdToNum } from '../utils/format';

export function initTableSort(headerEl, bodyEl, rows) {
  const columnSorters = {
    0: sortAsText,
    1: sortAsText,
    2: sortAsText,
    3: sortAsNumber,
    4: sortAsCurrency,
  };

  function sortAsText(a, b) {
    return a.trim().localeCompare(b.trim(), 'ru');
  }

  function sortAsNumber(a, b) {
    return parseFloat(a) - parseFloat(b);
  }

  function sortAsCurrency(a, b) {
    return fromUsdToNum(a) - fromUsdToNum(b);
  }

  headerEl.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const rowsArray = [...rows];
    const columnIndex = th.cellIndex;
    const sorter = columnSorters[columnIndex];
    const isAscending = th.dataset.order === 'asc';

    rowsArray.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent;
      const cellB = rowB.cells[columnIndex].textContent;

      const result = sorter(cellA, cellB);

      return isAscending ? -result : result;
    });

    rowsArray.forEach((row) => bodyEl.append(row));

    [...headerEl.rows[0].cells].forEach((cell) => delete cell.dataset.order);

    th.dataset.order = isAscending ? 'desc' : 'asc';
  });
}
