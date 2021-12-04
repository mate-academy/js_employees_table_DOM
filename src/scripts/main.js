/* eslint-disable padding-line-between-statements */
/* eslint-disable no-multiple-empty-lines */
'use strict';

// Table sorting in two directions

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const rows = table.querySelectorAll('tbody tr');
let count = 1;

const sortTatble = (el) => {
  count++;

  const headerArr = [...headers];
  const rowArr = [...rows];
  const headerIndex = headerArr.indexOf(el.target);

  rowArr.sort((a, b) => {
    let tdA = a.children[headerIndex].innerHTML;
    let tdB = b.children[headerIndex].innerHTML;

    if (el.target.innerHTML === 'Salary') {
      tdA = +a.children[headerIndex].innerHTML
        .replace('$', '')
        .replace(',', '');

      tdB = +b.children[headerIndex].innerHTML
        .replace('$', '')
        .replace(',', '');
    }

    if (tdA > tdB) {
      return 1;
    } else if (tdA < tdB) {
      return -1;
    } else {
      return 0;
    }
  });

  if (count % 2 === 0) {
    rowArr.forEach((item) => table.append(item));
  } else {
    rowArr.forEach((item) => table.prepend(item));
  }
};

for (const item of headers) {
  item.addEventListener('click', sortTatble);
}

