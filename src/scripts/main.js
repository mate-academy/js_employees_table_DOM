'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rows = [...tbody.querySelectorAll('tr')];

let sortDirection = 'toDown';

table.addEventListener('click', e => {
  if (e.target.tagName === 'TH') {
    const headerIndex = [...e.target.parentNode.children].indexOf(e.target);

    rows.sort((a, b) => {
      const aData = a.children[headerIndex].textContent;
      const bData = b.children[headerIndex].textContent;

      const sortOrder = sortDirection === 'toDown' ? 1 : -1;

      return sortOrder * aData.localeCompare(bData, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

    sortDirection === 'toDown'
      ? sortDirection = 'toUp'
      : sortDirection = 'toDown';

    rows.forEach((row) => tbody.appendChild(row));
  }
});
