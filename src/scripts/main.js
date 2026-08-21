'use strict';

const tableHeadElement = document.querySelector('thead');
const headRows = [...tableHeadElement.querySelectorAll('th')];

tableHeadElement.addEventListener('click', (e) => {
  const element = e.target.closest('th');

  if (!element) {
    return;
  }

  if (!element.getAttribute('class')) {
    removeSortOrderClass();
    element.setAttribute('class', 'asc');
    sortRows(getColumnIndex(element));
  } else {
    sortRows(getColumnIndex(element), 'descend');
    removeSortOrderClass();
  }
});

function getColumnIndex(receivedRow) {
  let index;

  headRows.filter((row, i) => {
    if (row.textContent === receivedRow.textContent) {
      index = i;

      return true;
    }
  });

  return index;
}

function sortRows(index, order = 'asc') {
  const tableBody = document.querySelector('tbody');
  const tableElements = [...tableBody.children];

  tableElements.sort((value1, value2) => {
    let value1ToCompare = [...value1.querySelectorAll('td')][index].textContent;
    let value2ToCompare = [...value2.querySelectorAll('td')][index].textContent;

    if (index < 3) {
      return order === 'asc'
        ? value1ToCompare.localeCompare(value2ToCompare)
        : value2ToCompare.localeCompare(value1ToCompare);
    }

    if (index === 4) {
      value1ToCompare = value1ToCompare
        .split('')
        .filter((char) => char !== '$' && char !== ',')
        .join('');

      value2ToCompare = value2ToCompare
        .split('')
        .filter((char) => char !== '$' && char !== ',')
        .join('');
    }

    return order === 'asc'
      ? value1ToCompare - value2ToCompare
      : value2ToCompare - value1ToCompare;
  });

  tableBody.append(...tableElements);
}

function removeSortOrderClass() {
  headRows.forEach((element) => {
    if (element.getAttribute('class')) {
      element.removeAttribute('class');
    }
  });
}
