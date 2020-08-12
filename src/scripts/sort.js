'use strict';

const checkClick = {
  nameClicked: false,
  positionClicked: false,
  officeClicked: false,
  ageClicked: false,
  salaryClicked: false,
};

function selectTypeToSort(TABLE_HEADER, arrayTr, container) {
  const indexHeaderCell = TABLE_HEADER.parentNode.cellIndex;

  switch (TABLE_HEADER.name) {
    case 'Name' :
      mainSort(arrayTr, indexHeaderCell, checkClick.nameClicked, container);
      checkClick.nameClicked = !checkClick.nameClicked;
      break;
    case 'Position' :
      mainSort(arrayTr, indexHeaderCell, checkClick.positionClicked, container);
      checkClick.positionClicked = !checkClick.positionClicked;
      break;
    case 'Office' :
      mainSort(arrayTr, indexHeaderCell, checkClick.officeClicked, container);
      checkClick.officeClicked = !checkClick.officeClicked;
      break;
    case 'Age' :
      mainSort(arrayTr, indexHeaderCell, checkClick.ageClicked, container);
      checkClick.ageClicked = !checkClick.ageClicked;
      break;
    case 'Salary' :
      mainSort(arrayTr, indexHeaderCell,
        checkClick.salaryClicked, container, 'salary');
      checkClick.salaryClicked = !checkClick.salaryClicked;
      break;
    default:
      break;
  }
}

function mainSort(arr, index, clicked, container, type) {
  if (type === 'salary') {
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

module.exports = selectTypeToSort;
