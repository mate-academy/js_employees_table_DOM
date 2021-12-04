/* eslint-disable max-len */
/* eslint-disable padding-line-between-statements */
/* eslint-disable no-multiple-empty-lines */
'use strict';

// Table sorting in two directions

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const rows = table.querySelectorAll('tbody tr');
const doc = document.querySelector('body');
const countryArray = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
  `Kyiv`,
];

let clickCount = 1;

const sortTatble = (el) => {
  clickCount++;

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

  if (clickCount % 2 === 0) {
    rowArr.forEach((item) => table.append(item));
  } else {
    rowArr.forEach((item) => table.prepend(item));
  }
};

for (const item of headers) {
  item.addEventListener('click', sortTatble);
}


// When user clicks on a row, it should become selected.

for (const row of rows) {
  row.addEventListener('click', (el) => {
    const target = el.target.parentElement;
    [...rows].forEach(item => {
      item.classList.remove('active');
    });
    target.classList.add('active');
  });
}
