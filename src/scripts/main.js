'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');

// sort
tHead.addEventListener('click', (e) => {
  const currentTh = e.target.closest('th');
  const columnIndex = currentTh.cellIndex;

  if (!currentTh.dataset.order) {
    currentTh.dataset.order = 'asc';
  } else if (currentTh.dataset.order === 'asc') {
    currentTh.dataset.order = 'desc';
  } else {
    currentTh.dataset.order = 'asc';
  }

  for (const th of tHead.rows[0].cells) {
    if (th !== currentTh) {
      delete th.dataset.order;
    }
  }

  const multiplier = currentTh.dataset.order === 'asc' ? 1 : -1;

  const rows = [...tBody.rows];

  const content = rows[0].cells[columnIndex].textContent;

  const clean = (str) => {
    return parseFloat(str.replace(/,/g, '.').replace(/[^\d.]/g, ''));
  };

  const cleaned = clean(content);

  const isNumericColumn = !isNaN(cleaned);

  rows.sort((a, b) => {
    const aContent = a.cells[columnIndex].textContent;
    const bContent = b.cells[columnIndex].textContent;
    let result;

    if (isNumericColumn) {
      result = clean(aContent) - clean(bContent);
    } else {
      result = aContent.localeCompare(bContent);
    }

    return result * multiplier;
  });

  tBody.append(...rows);
});

// select
tBody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  for (const tr of tBody.rows) {
    if (tr !== target) {
      tr.classList.remove('active');
    }
  }

  target.classList.toggle('active');
});

// form
const form = document.createElement('div');

form.classList.add('new-employee-form');

// const formFields = [
//   { label: 'Name', name: 'name', type: 'text' },
//   { label: 'Position', name: 'position', type: 'text' },
//   { label: 'Age', name: 'age', type: 'number' },
//   { label: 'Salary', name: 'salary', type: 'number' },
// ];

document.body.append(form);
