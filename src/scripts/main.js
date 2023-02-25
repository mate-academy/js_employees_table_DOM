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
  let ascOrDescName = 1;
  let ascOrDescPosition = 1;
  let ascOrDescOffice = 1;
  let ascOrDescAge = 1;
  let ascOrDescSalary = 1;

  table.querySelectorAll('th').forEach(function(item) {
    item.append(document.createElement('span'));
  });

  table.addEventListener('click', (eventFunc) => {
    const bodyRows = document.querySelector('tbody');

    document.querySelectorAll('span').forEach((element) => {
      element.textContent = '';
    });

    if (eventFunc.target.cellIndex === 0) {
      ascOrDescPosition = 1;
      ascOrDescOffice = 1;
      ascOrDescAge = 1;
      ascOrDescSalary = 1;
      ascOrDescName = ascOrDescName * (-1);

      table.querySelectorAll('span')[eventFunc.target.cellIndex]
        .textContent = ascOrDescName === 1 ? ' \u25BC' : ' \u25B2';

      bodyRows
        .append(...[...bodyRows.children]
          .sort((a, b) => compareVariables(a, b, eventFunc, ascOrDescName)));
    }

    if (eventFunc.target.cellIndex === 1) {
      ascOrDescName = 1;
      ascOrDescOffice = 1;
      ascOrDescAge = 1;
      ascOrDescSalary = 1;
      ascOrDescPosition = ascOrDescPosition * (-1);

      table.querySelectorAll('span')[eventFunc.target.cellIndex]
        .textContent = ascOrDescPosition === 1 ? ' \u25BC' : ' \u25B2';

      bodyRows
        .append(...[...bodyRows.children]
          .sort((a, b) =>
            compareVariables(a, b, eventFunc, ascOrDescPosition)));
    }

    if (eventFunc.target.cellIndex === 2) {
      ascOrDescName = 1;
      ascOrDescPosition = 1;
      ascOrDescAge = 1;
      ascOrDescSalary = 1;
      ascOrDescOffice = ascOrDescOffice * (-1);

      table.querySelectorAll('span')[eventFunc.target.cellIndex]
        .textContent = ascOrDescOffice === 1 ? ' \u25BC' : ' \u25B2';

      bodyRows
        .append(...[...bodyRows.children]
          .sort((a, b) => compareVariables(a, b, eventFunc, ascOrDescOffice)));
    }

    if (eventFunc.target.cellIndex === 3) {
      ascOrDescName = 1;
      ascOrDescPosition = 1;
      ascOrDescOffice = 1;
      ascOrDescSalary = 1;
      ascOrDescAge = ascOrDescAge * (-1);

      table.querySelectorAll('span')[eventFunc.target.cellIndex]
        .textContent = ascOrDescAge === 1 ? ' \u25BC' : ' \u25B2';

      bodyRows
        .append(...[...bodyRows.children]
          .sort((a, b) => compareVariables(a, b, eventFunc, ascOrDescAge)));
    }

    if (eventFunc.target.cellIndex === 4) {
      ascOrDescName = 1;
      ascOrDescPosition = 1;
      ascOrDescOffice = 1;
      ascOrDescAge = 1;
      ascOrDescSalary = ascOrDescSalary * (-1);

      table.querySelectorAll('span')[eventFunc.target.cellIndex]
        .textContent = ascOrDescSalary === 1 ? ' \u25BC' : ' \u25B2';

      bodyRows
        .append(...[...bodyRows.children]
          .sort((a, b) => compareVariables(a, b, eventFunc, ascOrDescSalary)));
    }
  });
}

const myTable = document.querySelector('thead');

ascDesc(myTable);
