'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const rowArray = [...tbody.rows];

// sort Table
const getSellValue = (tr, i) => {
  return tr.children[i].innerText;
};

thead.addEventListener('click', (e) => {
  const th = e.target;
  const idx = th.cellIndex;
  const isAscending = !th.classList.contains('asc');

  [...thead.querySelectorAll('th')].forEach((header) => {
    header.classList.remove('asc', 'desc');
  });

  th.classList.toggle('asc', isAscending);
  th.classList.toggle('desc', !isAscending);

  const direction = th.classList.contains('asc') ? 1 : -1;

  rowArray.sort((rowA, rowB) => {
    const cellA = getSellValue(rowA, idx);
    const cellB = getSellValue(rowB, idx);

    const a = isNaN(cellA) ? cellA : parseFloat(cellA.replace(/[^0-9.]/g, ''));

    const b = isNaN(cellB) ? cellB : parseFloat(cellB.replace(/[^0-9.]/g, ''));

    if (!isNaN(a) && !isNaN(b)) {
      return (a - b) * direction;
    } else {
      return cellA.localeCompare(cellB) * direction;
    }
  });

  tbody.append(...rowArray);
});

// selected row
tbody.addEventListener('click', (e) => {
  rowArray.forEach((row) => {
    row.classList.remove('active');
  });
  e.target.parentElement.classList.add('active');
});
