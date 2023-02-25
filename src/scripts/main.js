'use strict';

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

function ascDesc(table) {
  let array = [1, 1, 1, 1, 1];

  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  table.addEventListener('click', (eventFunc) => {
    const bodyRows = document.querySelector('tbody');
    const cellNumber = eventFunc.target.cellIndex;
    const asc = ' \u25BC';
    const desc = ' \u25B2';

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    if (cellNumber === 0) {
      array = [array[cellNumber] * (-1), 1, 1, 1, 1];

      table.querySelectorAll('span')[cellNumber]
        .textContent = array[cellNumber] === 1 ? asc : desc;

      bodyRows
        .append(...[...bodyRows.children].sort((a, b) =>
          compareVariables(a, b, eventFunc, array[cellNumber])));
    }

    if (cellNumber === 1) {
      array = [1, array[cellNumber] * (-1), 1, 1, 1];

      table.querySelectorAll('span')[cellNumber]
        .textContent = array[cellNumber] === 1 ? asc : desc;

      bodyRows
        .append(...[...bodyRows.children].sort((a, b) =>
          compareVariables(a, b, eventFunc, array[cellNumber])));
    }

    if (cellNumber === 2) {
      array = [1, 1, array[cellNumber] * (-1), 1, 1];

      table.querySelectorAll('span')[cellNumber]
        .textContent = array[cellNumber] === 1 ? asc : desc;

      bodyRows
        .append(...[...bodyRows.children].sort((a, b) =>
          compareVariables(a, b, eventFunc, array[cellNumber])));
    }

    if (cellNumber === 3) {
      array = [1, 1, 1, array[cellNumber] * (-1), 1];

      table.querySelectorAll('span')[cellNumber]
        .textContent = array[cellNumber] === 1 ? asc : desc;

      bodyRows
        .append(...[...bodyRows.children].sort((a, b) =>
          compareVariables(a, b, eventFunc, array[cellNumber])));
    }

    if (cellNumber === 4) {
      array = [1, 1, 1, 1, array[cellNumber] * (-1)];

      table.querySelectorAll('span')[cellNumber]
        .textContent = array[cellNumber] === 1 ? asc : desc;

      bodyRows
        .append(...[...bodyRows.children].sort((a, b) =>
          compareVariables(a, b, eventFunc, array[cellNumber])));
    }
  });
}

const myTable = document.querySelector('thead');

ascDesc(myTable);
