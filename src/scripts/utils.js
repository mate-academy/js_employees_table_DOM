import { HEAD_CONFIG, TABLE_HEADS, SORT_TYPES } from './constants';

export function formatToCurrency(value) {
  return '$' + Number(value).toLocaleString('en-US');
}

function extractValue(value, columnIdx) {
  let extractedValue = value.cells[columnIdx].textContent;

  if (HEAD_CONFIG[columnIdx] === TABLE_HEADS.age) {
    extractedValue = Number(extractedValue);
  }

  if (HEAD_CONFIG[columnIdx] === TABLE_HEADS.salary) {
    extractedValue = Number(extractedValue.replace(/[$,]/g, ''));
  }

  return extractedValue;
}

function sort(a, b, type) {
  const condition = type === SORT_TYPES.desc ? a > b : a < b;

  if (condition) {
    return -1;
  }

  return 1;
}

function resetSiblingsSortType(tHeadCells, currentIdx) {
  for (let i = 0; i < tHeadCells.length; i++) {
    if (i !== currentIdx) {
      tHeadCells[i].removeAttribute('data-sort');
    }
  }
}

function setSortType(columnIdx, tHeadCells) {
  const currentSortType = tHeadCells[columnIdx].getAttribute('data-sort');
  let newSortType = null;

  resetSiblingsSortType(tHeadCells, columnIdx);

  if (!currentSortType || currentSortType === SORT_TYPES.desc) {
    newSortType = SORT_TYPES.asc;
  } else {
    newSortType = SORT_TYPES.desc;
  }

  tHeadCells[columnIdx].setAttribute('data-sort', newSortType);

  return newSortType;
}

export function onTableSort(tHead, tBody, target) {
  const tHeadCells = tHead.rows[0].cells;
  const tBodyRows = tBody.rows;

  const columnIdx = [...tHeadCells].indexOf(target);

  const sortType = setSortType(columnIdx, tHeadCells);

  const sortedArray = [...tBodyRows].sort((a, b) => {
    const valueA = extractValue(a, columnIdx);
    const valueB = extractValue(b, columnIdx);

    return sort(valueA, valueB, sortType);
  });

  sortedArray.forEach((el) => {
    tBody.append(el);
  });
}

export function setActiveRow(rows, current) {
  for (let i = 0; i < rows.length; i++) {
    rows[i].classList.remove('active');
  }

  current.classList.add('active');
}

function onCellBlur(e, currentValue, columnType) {
  const { target } = e;
  const { parentNode, value } = target;

  let newValue = value;

  if (columnType === TABLE_HEADS.salary) {
    newValue = value ? formatToCurrency(value) : null;
  }

  target.remove();

  parentNode.textContent = newValue || currentValue;
}

function createInput(columnType) {
  const input = document.createElement('input');

  input.classList.add('cell-input');

  if (columnType === TABLE_HEADS.age || columnType === TABLE_HEADS.salary) {
    input.setAttribute('type', 'number');
  }

  return input;
}

export function editCell(e) {
  const { target } = e;

  const columnIdx = [...target.parentNode.cells].indexOf(target);
  const columnType = HEAD_CONFIG[columnIdx];

  const currentValue = target.textContent;

  const input = createInput(columnType);

  input.setAttribute('placeholder', currentValue);

  target.textContent = null;
  target.append(input);

  input.focus();

  input.addEventListener('keypress', (pressEvent) => {
    if (pressEvent.key === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', (blurEvent) => {
    onCellBlur(blurEvent, currentValue, columnType);
  });
}
