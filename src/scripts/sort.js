'use strict';

const checkClick = {
  nameClicked: false,
  positionClicked: false,
  officeClicked: false,
  ageClicked: false,
  salaryClicked: false,
};

function selectTypeToSort(type, arrayTr, conteiner) {
  switch (type) {
    case 'Name' :
      mainSort(arrayTr, 0, checkClick.nameClicked, conteiner);
      checkClick.nameClicked = !checkClick.nameClicked;
      break;
    case 'Position' :
      mainSort(arrayTr, 1, checkClick.positionClicked, conteiner);
      checkClick.positionClicked = !checkClick.positionClicked;
      break;
    case 'Office' :
      mainSort(arrayTr, 2, checkClick.officeClicked, conteiner);
      checkClick.officeClicked = !checkClick.officeClicked;
      break;
    case 'Age' :
      mainSort(arrayTr, 3, checkClick.ageClicked, conteiner);
      checkClick.ageClicked = !checkClick.ageClicked;
      break;
    case 'Salary' :
      mainSort(arrayTr, 4, checkClick.salaryClicked, conteiner, 'salary');
      checkClick.salaryClicked = !checkClick.salaryClicked;
      break;
    default:
      break;
  }
}

function mainSort(arr, index, clicked, conteiner, type) {
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
    conteiner.append(arr[i]);
  }
}

function parseNumber(element) {
  const item = element.slice(1).split(',').join('');

  return Number.parseInt(item);
}

module.exports = selectTypeToSort;
