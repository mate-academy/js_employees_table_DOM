'use strict';

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  row.classList.add('active');
});

let lastIndex = -1;
let isAsc = true;

const thead = document.querySelector('thead');

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const index = th.cellIndex;
  const rows = Array.from(tbody.rows);

  if (index === lastIndex) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
  }

  rows.sort((a, b) => {
    const valA = a.cells[index].textContent;
    const valB = b.cells[index].textContent;
    let result;

    if (index === 0 || index === 1 || index === 2) {
      result = valA.localeCompare(valB);
    } else {
      const numA = parseFloat(valA.replace(/[^\d.-]/g, ''));
      const numB = parseFloat(valB.replace(/[^\d.-]/g, ''));

      result = numA - numB;
    }

    return isAsc ? result : -result;
  });
  tbody.append(...rows);
  lastIndex = index;
});
