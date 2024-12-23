import { createForm } from './createForm';
import { sortTableBody } from './tableActions';

const sort = sortTableBody();
const table = document.querySelector('table');

[...table.tHead.rows[0].cells].forEach((cell, i) => {
  cell.addEventListener('click', () => {
    sort(table.tBodies[0], i);
  });
});

let lastSelectedRow = null;
let lastSelectedTd = null;

document.body.addEventListener('click', ({ target }) => {
  const td = target.closest('td');
  const row = target.closest('tr');

  if (lastSelectedTd !== null && lastSelectedTd !== td) {
    lastSelectedTd.removeAttribute('contenteditable');
  }

  if (lastSelectedRow !== null) {
    lastSelectedRow.classList.remove('active');
  }

  if (row !== null) {
    if (lastSelectedRow !== null) {
      lastSelectedRow.classList.remove('active');
    }

    lastSelectedRow = row;
    row.classList.add('active');
  }
});

document.body.addEventListener('dblclick', ({ target }) => {
  const td = target.closest('td');

  if (td !== null) {
    if (lastSelectedTd !== null) {
      lastSelectedTd.removeAttribute('contenteditable');
    }

    td.setAttribute('contenteditable', 'true');
    lastSelectedTd = td;
    td.focus();
  }
});

createForm(table);
