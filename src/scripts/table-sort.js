export class TableSort {
  static #extractValue(columnIdx, value) {
    let extractedValue = value.cells[columnIdx].textContent;

    if (columnIdx === 3) {
      extractedValue = +extractedValue;
    }

    if (columnIdx === 4) {
      extractedValue = +extractedValue.replace(/[^0-9]/g, '');
    }

    return extractedValue;
  }

  static #resetSiblingsSortType(columnIdx, tHeadCells) {
    for (let i = 0; i < tHeadCells.length; i++) {
      if (columnIdx !== i) {
        tHeadCells[i].removeAttribute('data-sort');
      }
    }
  }

  static #setSortType(columnIdx, tHeadCells) {
    const currentSortType = tHeadCells[columnIdx].getAttribute('data-sort');
    let newSortType = null;

    TableSort.#resetSiblingsSortType(columnIdx, tHeadCells);

    if (!currentSortType || currentSortType === 'desc') {
      newSortType = 'asc';
    } else {
      newSortType = 'desc';
    }

    tHeadCells[columnIdx].setAttribute('data-sort', newSortType);

    return newSortType;
  }

  onTableSort(tHead, tBody, target) {
    const columnIdx = target.cellIndex;
    const tHeadCells = tHead.rows[0].cells;
    const tBodyRows = tBody.rows;

    const sortType = TableSort.#setSortType(columnIdx, tHeadCells);

    const sortedRows = [...tBodyRows].sort((r1, r2) => {
      const valueA = TableSort.#extractValue(columnIdx, r1);
      const valueB = TableSort.#extractValue(columnIdx, r2);

      if (typeof valueA === 'string') {
        return valueA.localeCompare(valueB);
      }

      return valueA - valueB;
    });

    if (sortType === 'desc') {
      sortedRows.reverse();
    }

    sortedRows.forEach((row) => tBody.append(row));
  }
}
