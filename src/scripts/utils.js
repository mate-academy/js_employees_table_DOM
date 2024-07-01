function extractValue(columnIdx, value) {
  let extractedValue = value.cells[columnIdx].textContent;

  if (columnIdx === 3) {
    extractedValue = +extractedValue;
  }

  if (columnIdx === 4) {
    extractedValue = +extractedValue.replace(/[$,]/g, '');
  }

  return extractedValue;
}

function resetSiblingsSortType(columnIdx, tHeadCells) {
  for (let i = 0; i < tHeadCells.length; i++) {
    if (columnIdx !== i) {
      tHeadCells[i].removeAttribute('data-sort');
    }
  }
}

function setSortType(columnIdx, tHeadCells) {
  const currentSortType = tHeadCells[columnIdx].getAttribute('data-sort');
  let newSortType = null;

  resetSiblingsSortType(columnIdx, tHeadCells);

  if (!currentSortType || currentSortType === 'desc') {
    newSortType = 'asc';
  } else {
    newSortType = 'desc';
  }

  tHeadCells[columnIdx].setAttribute('data-sort', newSortType);

  return newSortType;
}

export function onTableSort(tHead, tBody, target) {
  const columnIdx = target.cellIndex;
  const tHeadCells = tHead.rows[0].cells;
  const tbodyRows = tBody.rows;

  const sortType = setSortType(columnIdx, tHeadCells);

  const sortedRows = [...tbodyRows].sort((a, b) => {
    const valueA = extractValue(columnIdx, a);
    const valueB = extractValue(columnIdx, b);

    if (typeof valueA === 'string') {
      return valueA.localeCompare(valueB);
    }

    return valueA - valueB;
  });

  sortedRows.forEach((el) => {
    if (sortType === 'asc') {
      tBody.append(el);
    } else {
      tBody.prepend(el);
    }
  });
}

export function setActiveRow(target, tBody) {
  [...tBody.rows].forEach((row) => row.classList.remove('active'));
  target.closest('tr').classList.add('active');
}

export function formatToCurrency(value) {
  return `$${Number(value).toLocaleString('en-US')}`;
}

export function capitalizeFirstLetter(string) {
  if (!string) {
    return;
  }

  if (typeof string !== 'string') {
    return string;
  }

  return string.charAt(0).toLocaleUpperCase() + string.slice(1);
}
