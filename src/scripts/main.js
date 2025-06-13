'use strict';

import { table, tbody } from './variables';
import { sort } from './sort';
import { renderForm } from './renderForm';
import { handleFormSubmission } from './handleFormSubmission';
import { updateCell } from './updateCell';

renderForm();

let currentSortColumn;
let activeRow;
let selectedCell;

table.addEventListener('click', (e) => {
  const target = e.target;

  if (target.closest('thead') && target.tagName === 'TH') {
    const bodyRows = tbody.querySelectorAll('tr');
    const th = target;
    const siblings = Array.from(th.parentNode.children);
    const index = siblings.indexOf(th);

    const sortBy = currentSortColumn === index ? 'desc' : 'asc';

    currentSortColumn = sortBy === 'asc' ? index : -1;

    if (index === 0 || index === 1 || index === 2) {
      sort(tbody, bodyRows, index, 'string', sortBy);
    } else if (index === 3 || index === 4) {
      sort(tbody, bodyRows, index, 'number', sortBy);
    }
  }

  if (target.tagName === 'TD') {
    const td = target;
    const tr = td.closest('tr');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    activeRow = tr;
    tr.classList.add('active');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (selectedCell) {
      const input = document.querySelector('.cell-input');

      input.blur();
    } else {
      handleFormSubmission();
    }
  }
});

tbody.addEventListener('dblclick', (e) => {
  selectedCell = e.target;

  if (!selectedCell) {
    return;
  }

  const tbodyRow = selectedCell.closest('tr');
  const employerName = tbodyRow.children[0].innerText;

  const siblings = Array.from(selectedCell.parentNode.children);
  const column = siblings.indexOf(selectedCell);

  const initText = selectedCell.innerText;
  const cellInput = document.createElement('input');

  cellInput.classList.add('cell-input');
  cellInput.value = initText;

  selectedCell.innerHTML = '';
  selectedCell.append(cellInput);

  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    updateCell(selectedCell, cellInput, initText, column, employerName);
    selectedCell = null;
  });
});
