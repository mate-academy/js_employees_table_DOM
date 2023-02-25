'use strict';

const arrayForCompare = [1, 1, 1, 1, 1];
const asc = ' \u25BC';
const desc = ' \u25B2';

function sortingTable(table) {
  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  table.addEventListener('click', (eventFunc) => {
    const cellNumber = eventFunc.target.cellIndex;

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    for (let i = 0; i < arrayForCompare.length; i++) {
      arrayForCompare[i] = cellNumber === i ? arrayForCompare[i] * (-1) : 1;
    }

    table.querySelectorAll('span')[cellNumber]
      .textContent = arrayForCompare[cellNumber] === 1 ? asc : desc;

    const compareVariables = (aa, bb, ascOrDesc) => {
      const convert = (stringNumber) => {
        return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
      };

      let a = aa.children[cellNumber].textContent;
      let b = bb.children[cellNumber].textContent;

      if (convert(a) > 0) {
        a = (convert(a));
        b = (convert(b));
      }

      return a < b ? ascOrDesc : ascOrDesc * (-1);
    };

    document.querySelector('tbody')
      .append(...[...document.querySelector('tbody').children].sort((a, b) =>
        compareVariables(a, b, arrayForCompare[cellNumber])));
  });
}

const myTable = document.querySelector('thead');

sortingTable(myTable);
