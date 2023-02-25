'use strict';

const arrayForCompare = [1, 1, 1, 1, 1];
const asc = ' \u25BC';
const desc = ' \u25B2';

function convert(stringNumber) {
  return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
}

function compareVariables(aa, bb, eventFunc, ascOrDesc) {
  let a = aa.children[eventFunc.target.cellIndex].textContent;
  let b = bb.children[eventFunc.target.cellIndex].textContent;

  if (convert(a) > 0) {
    a = (convert(a));
    b = (convert(b));
  }

  return a < b ? ascOrDesc : ascOrDesc * (-1);
}

function ascDesc(table, cellNumber, eventFunc) {
  for (let i = 0; i < arrayForCompare.length; i++) {
    arrayForCompare[i] = cellNumber === i ? arrayForCompare[i] * (-1) : 1;
  }

  table.querySelectorAll('span')[cellNumber]
    .textContent = arrayForCompare[cellNumber] === 1 ? asc : desc;

  document.querySelector('tbody')
    .append(...[...document.querySelector('tbody').children].sort((a, b) =>
      compareVariables(a, b, eventFunc, arrayForCompare[cellNumber])));
}

function sortingTable(table) {
  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  table.addEventListener('click', (eventFunc) => {
    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    ascDesc(table, eventFunc.target.cellIndex, eventFunc,);
  });
}

const myTable = document.querySelector('thead');

sortingTable(myTable);
