'use strict';

const checkClick = {
  name: false,
  position: false,
  office: false,
  age: false,
  salary: false,
};

function selectTypeToSort(type, arrayTr, tbody) {
  switch (type) {
    case 'Name' :
      checkClick.name === false
        ? mainSort(arrayTr, 0, false, tbody)
        : mainSort(arrayTr, 0, true, tbody);
      checkClick.name = !checkClick.name;
      break;
    case 'Position' :
      checkClick.position === false
        ? mainSort(arrayTr, 1, false, tbody)
        : mainSort(arrayTr, 1, true, tbody);
      checkClick.position = !checkClick.position;
      break;
    case 'Office' :
      checkClick.office === false
        ? mainSort(arrayTr, 2, false, tbody)
        : mainSort(arrayTr, 2, true, tbody);
      checkClick.office = !checkClick.office;
      break;
    case 'Age' :
      checkClick.age === false
        ? mainSort(arrayTr, 3, false, tbody)
        : mainSort(arrayTr, 3, true, tbody);
      checkClick.age = !checkClick.age;
      break;
    case 'Salary' :
      checkClick.salary === false
        ? mainSort(arrayTr, 4, false, tbody, 'salary')
        : mainSort(arrayTr, 4, true, tbody, 'salary');
      checkClick.salary = !checkClick.salary;
      break;
    default:
      break;
  }
}

function mainSort(arr, index, clicked, tbody, type) {
  if (type === 'salary') {
    arr.sort((a, b) =>
      clicked === false
        ? parseNumber(a.cells[index].innerText)
        - parseNumber(b.cells[index].innerText)
        : parseNumber(b.cells[index].innerText)
        - parseNumber(a.cells[index].innerText));
  } else {
    if (!isNaN(parseFloat(arr[0].cells[index].innerText))) {
      arr.sort((a, b) =>
        clicked === false
          ? parseFloat(a.cells[index].innerText)
          - parseFloat(b.cells[index].innerText)
          : parseFloat(b.cells[index].innerText)
          - parseFloat(a.cells[index].innerText));
    } else {
      arr.sort((a, b) =>
        clicked === false
          ? a.cells[index].innerText.localeCompare(b.cells[index].innerText)
          : b.cells[index].innerText.localeCompare(a.cells[index].innerText));
    }
  }

  for (let i = 0; i < arr.length; i++) {
    tbody.append(arr[i]);
  }
}

function parseNumber(element) {
  const item = element.slice(1).split(',').join('');

  return Number.parseInt(item);
}

module.exports = selectTypeToSort;
