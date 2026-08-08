'use strict';

const table = document.querySelector('table');

table.addEventListener('click', (e) => {
  if (e.target.closest('thead')) {
    const ind = e.target.cellIndex;
    const rows = [...table.tBodies[0].rows].sort((rowA, rowB) => {
      const a = rowA.cells[ind].textContent;
      const b = rowB.cells[ind].textContent;

      if (typeof a === 'string') {
        if (a.includes('$')) {
          return (
            +a.replace('$', '').replace(',', '') -
            +b.replace('$', '').replace(',', '')
          );
        }

        return a.localeCompare(b);
      }

      return a - b;
    });

    [...e.target.parentElement.children].forEach((item) => {
      if (item !== e.target) {
        delete item.dataset.sorted;
      }
    });

    if (
      e.target.dataset.sorted === undefined ||
      e.target.dataset.sorted === 'desc'
    ) {
      table.tBodies[0].replaceChildren(...rows);
      e.target.dataset.sorted = 'asc';
    } else if (e.target.dataset.sorted === 'asc') {
      table.tBodies[0].replaceChildren(...rows.reverse());
      e.target.dataset.sorted = 'desc';
    }
  }

  if (e.target.closest('tr') && e.target.closest('tBody')) {
    table.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

    e.target.closest('tr').classList.add('active');
  }
});
