'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

let sortDirection = 'ASC';
let previousIndex = null;

table.addEventListener('click', e => {
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
});
