import { tableHeader, tableRows, headerList, table } from './main';

export function sortRows(event) {
  const formatNumber = number => Number(number.slice(1).replace(',', ''));

  const compareString = (stringA, stringB) => stringA.localeCompare(stringB);
  const compareAge = (AgeA, AgeB) => +AgeA - +AgeB;
  const compareSalary = (salaryA, salaryB) => {
    return formatNumber(salaryA) - formatNumber(salaryB);
  };

  switch (event.target.textContent) {
    case 'Name':
    case 'Position':
    case 'Office':
      rowSort(event.target, compareString);
      break;

    case 'Age':
      rowSort(event.target, compareAge);
      break;

    case 'Salary':
      rowSort(event.target, compareSalary);
      break;
  }
}

function rowSort(columnHead, comparingFunction) {
  const columnIndex = headerList.indexOf(columnHead.textContent);

  const sortedRows = [...tableRows].sort((rowA, rowB) => {
    const columnA = rowA.querySelectorAll('td')[columnIndex].textContent;
    const columnB = rowB.querySelectorAll('td')[columnIndex].textContent;

    return comparingFunction(columnA, columnB);
  });

  if (columnHead.direction) {
    for (const row of sortedRows) {
      table.tBodies[0].prepend(row);
    }
  } else {
    for (const row of sortedRows) {
      table.tBodies[0].append(row);
    }
  }

  for (const header of tableHeader.cells) {
    if (header !== columnHead) {
      header.direction = false;
    }
  }

  columnHead.direction = !columnHead.direction;
}
