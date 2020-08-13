'use strict';

const { TABLE_HEADER } = require('./constants');

const checkClick = {
  nameClicked: false,
  positionClicked: false,
  officeClicked: false,
  ageClicked: false,
  salaryClicked: false,
};

function selectTypeToSort(headerCell, arrayTr, container) {
  const indexHeaderCell = headerCell.cellIndex;

  switch (headerCell.firstChild.name) {
    case TABLE_HEADER.name :
      mainSort(arrayTr, indexHeaderCell, checkClick.nameClicked, container);
      checkClick.nameClicked = !checkClick.nameClicked;
      break;
    case TABLE_HEADER.position :
      mainSort(arrayTr, indexHeaderCell, checkClick.positionClicked, container);
      checkClick.positionClicked = !checkClick.positionClicked;
      break;
    case TABLE_HEADER.office :
      mainSort(arrayTr, indexHeaderCell, checkClick.officeClicked, container);
      checkClick.officeClicked = !checkClick.officeClicked;
      break;
    case TABLE_HEADER.age :
      mainSort(arrayTr, indexHeaderCell, checkClick.ageClicked, container);
      checkClick.ageClicked = !checkClick.ageClicked;
      break;
    case TABLE_HEADER.salary :
      mainSort(arrayTr, indexHeaderCell,
        checkClick.salaryClicked, container, TABLE_HEADER.salary);
      checkClick.salaryClicked = !checkClick.salaryClicked;
      break;
    default:
      break;
  }
}

function mainSort(arr, index, clicked, container, type) {
  if (type === 'Salary') {
    arr.sort((a, b) => parseNumber(a.cells[index].innerText)
        - parseNumber(b.cells[index].innerText));
  } else {
    if (!isNaN(parseFloat(arr[0].cells[index].innerText))) {
      arr.sort((a, b) => parseFloat(a.cells[index].innerText)
          - parseFloat(b.cells[index].innerText));
    } else {
      arr.sort((a, b) =>
        a.cells[index].innerText.localeCompare(b.cells[index].innerText));
    }
  }

  if (clicked) {
    arr.reverse();
  }

  for (let i = 0; i < arr.length; i++) {
    container.append(arr[i]);
  }
}

function parseNumber(element) {
  const item = element.slice(1).split(',').join('');

  return Number.parseInt(item);
}

module.exports = {
  selectTypeToSort,
};
