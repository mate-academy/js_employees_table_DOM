'use strict';

function convert(stringNumber) {
  return Number(stringNumber.toLocaleString().replace(/\D/g, ''));
}

function compareVariables(aa, bb, events, upOrDown) {
  let a = aa.children[events.target.cellIndex].textContent;
  let b = bb.children[events.target.cellIndex].textContent;

  if (convert(a) > 0) {
    a = (convert(a));
    b = (convert(b));
  }

  return a < b ? upOrDown : upOrDown * (-1);
}

function ascDesc(table) {
  let ascOrDesc = 1;

  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  table.addEventListener('click', (eventFunc) => {
    const bodyRows = document.querySelector('tbody');

    ascOrDesc = ascOrDesc * (-1);

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    table.querySelectorAll('span')[eventFunc.target.cellIndex]
      .textContent = ascOrDesc === 1 ? ' \u2B06' : ' \u2B07';

    bodyRows
      .append(...[...bodyRows.children]
        .sort((a, b) => compareVariables(a, b, eventFunc, ascOrDesc)));
  });
}

const myTable = document.querySelector('thead');

ascDesc(myTable);
