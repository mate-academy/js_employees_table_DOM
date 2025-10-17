// tableSort/initTable.js
import { makeRowActiveFactory } from './activeRow.js';
import { sortColumnFactory } from './sorting.js';
import { selectCellFactory } from './selectCell.js';

export function initTableInteractions(table) {
  if (!table) {
    return;
  }

  const tBody = table.querySelector('tbody');
  const tHead = table.querySelector('thead');

  if (!tHead || !tBody) {
    return;
  }

  let lastSortDescending;
  let lastSortColumn;
  let lastActiveRow;
  let activeInput = null;

  const makeRowActive = makeRowActiveFactory({
    get lastActiveRow() {
      return lastActiveRow;
    },
    set lastActiveRow(v) {
      lastActiveRow = v;
    },
  });

  const sortColumn = sortColumnFactory({
    tBody,
    get lastSortDescending() {
      return lastSortDescending;
    },
    set lastSortDescending(v) {
      lastSortDescending = v;
    },
    get lastSortColumn() {
      return lastSortColumn;
    },
    set lastSortColumn(v) {
      lastSortColumn = v;
    },
  });
  const selectCell = selectCellFactory({
    get activeInput() {
      return activeInput;
    },
    set activeInput(v) {
      activeInput = v;
    },
  });

  tHead.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (!th) {
      return;
    }
    sortColumn(th);
  });

  tBody.addEventListener('click', (e) => {
    const td = e.target.closest('td');

    if (!td) {
      return;
    }
    makeRowActive(td.closest('tr'));
  });

  tBody.addEventListener('dblclick', (ev) => {
    if (activeInput) {
      return;
    }

    const cell = ev.target.closest('td');

    if (!cell) {
      return;
    }

    const colIndex = cell.cellIndex;
    const th = table.tHead.rows[0]?.cells[colIndex];
    const type = th?.getAttribute('data-type') || 'string';
    const colName = th?.textContent.toLowerCase() || 'default';

    selectCell(cell, type, colName);
  });
}
