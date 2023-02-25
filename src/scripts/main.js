'use strict';

const arrCompare = [1, 1, 1, 1, 1];

function sortingTable(table) {
  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  const asc = ' \u25BC';
  const desc = ' \u25B2';

  table.addEventListener('click', (eventFunc) => {
    const cellNumber = eventFunc.target.cellIndex;

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    for (let i = 0; i < arrCompare.length; i++) {
      arrCompare[i] = cellNumber === i ? arrCompare[i] * (-1) : 1;
    }

    table.querySelectorAll('span')[cellNumber]
      .textContent = arrCompare[cellNumber] === 1 ? asc : desc;

    const compareVariables = (aa, bb) => {
      const convert = (stringNumber) => {
        return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
      };

      let a = aa.children[cellNumber].textContent;
      let b = bb.children[cellNumber].textContent;

      if (convert(a) > 0) {
        a = (convert(a));
        b = (convert(b));
      }

      return a < b ? arrCompare[cellNumber] : arrCompare[cellNumber] * (-1);
    };

    document.querySelector('tbody')
      .append(...[...document.querySelector('tbody').children].sort((a, b) =>
        compareVariables(a, b)));
  });
}

const myTable = document.querySelector('thead');

sortingTable(myTable);
