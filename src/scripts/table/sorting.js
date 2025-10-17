// tableSort/sorting.js
import { buildComparator } from './compare.js';

export function sortColumnFactory(state) {
  const { tBody } = state;

  return function sortColumn(th) {
    const rowsArray = Array.from(tBody.rows ?? []);

    if (!rowsArray.length) {
      return;
    }

    const columnIndex = th.cellIndex ?? -1;
    const headRow = th.parentElement;

    if (columnIndex < 0 || !headRow || columnIndex >= headRow.cells.length) {
      return;
    }

    const resolvedType = th.dataset.type || 'string';

    if (
      !state.lastSortColumn ||
      state.lastSortColumn !== th.textContent.trim()
    ) {
      state.lastSortDescending = true;
    } else {
      state.lastSortDescending = !state.lastSortDescending;
    }
    state.lastSortColumn = th.textContent.trim();

    const cmp = buildComparator(
      columnIndex,
      resolvedType,
      state.lastSortDescending,
    );

    rowsArray.sort(cmp);
    tBody.append(...rowsArray);
  };
}
