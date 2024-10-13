'use strict';

window.convertNumberToSalary = (num) => {
  return `$${(+num).toLocaleString('en-US')}`;
};

window.convertSalartyToNumber = (a) => {
  return Number(a.substring(1).split(',').join(''));
};

window.getValueByCellIndex = (row, index) => {
  return row.cells[index].textContent;
};
