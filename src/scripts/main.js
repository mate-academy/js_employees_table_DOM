'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

let sortDirection = 'ASC';
let previousIndex = null;

const sortTable = (e) => {
  if (e.target.tagName === 'TH') {
    const headerIndex = [...e.target.parentNode.children].indexOf(e.target);

    rows.sort((a, b) => {
      const aData = a.children[headerIndex].textContent;
      const bData = b.children[headerIndex].textContent;

      if (previousIndex === headerIndex) {
        const sortOrder = sortDirection === 'ASC' ? 1 : -1;

        return sortOrder * aData.localeCompare(bData, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      } else {
        return aData.localeCompare(bData, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }
    });

    previousIndex = headerIndex;

    sortDirection === 'ASC'
      ? sortDirection = 'DESC'
      : sortDirection = 'ASC';

    rows.forEach((row) => tbody.appendChild(row));
  }
};

const selectRow = (e) => {
  if (e.target.tagName === 'TD') {
    const targetRow = e.target.parentNode;
    const activeRow = rows.find(row => row.classList.contains('active'));

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    targetRow.classList.add('active');
  }
};

table.addEventListener('click', sortTable);
table.addEventListener('click', selectRow);
