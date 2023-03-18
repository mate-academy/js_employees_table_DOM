'use strict';
// PART ONE. SORTING

const table = document.querySelector('table');

const sortTableASC = function(index, type) {
  const tbody = table.querySelector('tbody');

  const compare = function(rowA, rowB) {
    const rowADate = rowA.cells[index].innerHTML;
    const rowBDate = rowB.cells[index].innerHTML;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (rowADate < rowBDate) {
          return -1;
        } else if (rowADate > rowBDate) {
          return 1;
        }

        return 0;
      case 'Age':
        return rowADate - rowBDate;
      case 'Salary':
        const dateA = rowADate.split('$').join('').split(',').join('');
        const dateB = rowBDate.split('$').join('').split(',').join('');

        return dateA - dateB;
    }
  };

  const rows = [].slice.call(tbody.rows);

  rows.sort(compare);

  table.removeChild(tbody);

  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }

  table.appendChild(tbody);
};

const sortTableDESC = function(index, type) {
  const tbody = table.querySelector('tbody');

  const compare = function(rowA, rowB) {
    const rowADate = rowA.cells[index].innerHTML;
    const rowBDate = rowB.cells[index].innerHTML;

    switch (type) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (rowADate < rowBDate) {
          return 1;
        } else if (rowADate > rowBDate) {
          return -1;
        }

        return 0;
      case 'Age':
        return rowBDate - rowADate;
      case 'Salary':
        const dateA = rowADate.split('$').join('').split(',').join('');
        const dateB = rowBDate.split('$').join('').split(',').join('');

        return dateB - dateA;
    }
  };

  const rows = [].slice.call(tbody.rows);

  rows.sort(compare);

  table.removeChild(tbody);

  for (let i = 0; i < rows.length; i++) {
    tbody.appendChild(rows[i]);
  }

  table.appendChild(tbody);
};

let nameCount = 0;
let positionCount = 0;
let officeCount = 0;
let ageCount = 0;
let salaryCount = 0;

table.addEventListener('click', (e) => {
  const el = e.target;

  if (el.nodeName !== 'TH') {
    return;
  }

  const index = el.cellIndex;
  const type = el.innerText;

  sortTableASC(index, type);

  switch (type) {
    case 'Name':
      nameCount++;
      break;
    case 'Position':
      positionCount++;
      break;
    case 'Office':
      officeCount++;
      break;
    case 'Age':
      ageCount++;
      break;
    case 'Salary':
      salaryCount++;
      break;
  }

  if (nameCount === 2) {
    sortTableDESC(index, type);
    nameCount = 0;
  }

  if (positionCount === 2) {
    sortTableDESC(index, type);
    positionCount = 0;
  }

  if (officeCount === 2) {
    sortTableDESC(index, type);
    officeCount = 0;
  }

  if (ageCount === 2) {
    sortTableDESC(index, type);
    ageCount = 0;
  }

  if (salaryCount === 2) {
    sortTableDESC(index, type);
    salaryCount = 0;
  }
});
