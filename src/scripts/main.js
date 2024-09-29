'use strict';

const tbody = [...document.getElementsByTagName('tr')];
const thead = tbody.shift();
const sort = createSorter();

thead.addEventListener('click', (e) => {
  sort([...tbody], e.target.closest('th'), thead);
});

function createSorter() {
  let prevComparator = '';
  let ascending = true;

  return function sorter(table, comparator, categorys) {
    const i = [...categorys.children] // get array from all 'th' elements
      .map((v) => v.textContent) // get text from each 'th' element
      .findIndex((v) => v === comparator.textContent); // find comparator index

    if (prevComparator === comparator.textContent) {
      ascending = !ascending; // change sort direction
    } else {
      prevComparator = comparator.textContent;
      ascending = true;
    }

    const sorted = table.sort((a, b) => {
      // geting text content from a and b elements
      let cola = [...a.children].map((v) => v.textContent)[i];
      let colb = [...b.children].map((v) => v.textContent)[i];

      if (cola[0] === '$') {
        // parses a str and returns an int of salary
        cola = parseInt(cola.replace(/[$,]/g, ''));
        colb = parseInt(colb.replace(/[$,]/g, ''));
      }

      if (cola < colb) {
        return ascending ? -1 : 1;
      }

      if (cola > colb) {
        return ascending ? 1 : -1;
      }

      return 0;
    });

    sorted.forEach((row) => {
      // updating document
      row.parentNode.appendChild(row);
    });
  };
}
