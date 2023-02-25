'use strict';

function convert(stringNumber) {
  return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
}

const array = [0, 0, 0, 0, 0];

function compareVariables(aa, bb, eventFunc, ascOrDesc) {
  let a = aa.children[eventFunc.target.cellIndex].textContent;
  let b = bb.children[eventFunc.target.cellIndex].textContent;

  if (convert(a) > 0) {
    a = (convert(a));
    b = (convert(b));
  }

  return a < b ? ascOrDesc : ascOrDesc * (-1);
}

function ascDesc(table) {
  let ascOrDesc = 1;

  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  table.addEventListener('click', (eventFunc) => {
    const bodyRows = document.querySelector('tbody');

    if (array[eventFunc.target.cellIndex] === 0) {
      ascOrDesc = 1;
      array[eventFunc.target.cellIndex] = 1;
    }

    if (array[eventFunc.target.cellIndex] === 1) {
      ascOrDesc = ascOrDesc * (-1);
      array[eventFunc.target.cellIndex] = 1;
    }

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    table.querySelectorAll('span')[eventFunc.target.cellIndex]
      .textContent = ascOrDesc === 1 ? ' \u2B07' : ' \u2B06';

    bodyRows
      .append(...[...bodyRows.children]
        .sort((a, b) => compareVariables(a, b, eventFunc, ascOrDesc)));
  });
}

const myTable = document.querySelector('thead');

ascDesc(myTable);
