'use strict';

let sorted = null;

function createSortFunction(direction) {
  return function({ sortValue: value1 }, { sortValue: value2 }) {
    switch (true) {
      case value1[0] === '$': {
        const salary1 = parseFloat(value1.slice(1));
        const salary2 = parseFloat(value2.slice(1));

        return (salary1 - salary2) * direction;
      }

      case !isNaN(parseInt(value1)): {
        const age1 = parseInt(value1);
        const age2 = parseInt(value2);

        return (age1 - age2) * direction;
      }

      default: {
        return value1.localeCompare(value2) * direction;
      }
    }
  };
}

function sortTableByProperty(e) {
  const sortHeading = e.target;
  const table = sortHeading.closest('table');
  const tableBody = table.querySelector('tbody');
  const sortIndex = [...table.querySelectorAll('th')].indexOf(sortHeading);
  const rows = [...tableBody.children]
    .map(tr => ({
      sortValue: tr.children[sortIndex].innerText,
      element: tr,
    }));

  const direction = (sortHeading === sorted)
    ? -1
    : 1;

  const sortFunc = createSortFunction(direction);

  rows.sort(sortFunc);

  rows.forEach(({ element }) => tableBody
    .insertAdjacentElement('beforeend', element));

  sorted = (sortHeading === sorted)
    ? null
    : sortHeading;
}

module.exports = sortTableByProperty;
