'use strict';

const thead = document.querySelectorAll('thead tr th');
const tbody = document.querySelector('tbody');
const tbodyArray = Array.from(tbody.querySelectorAll('tr'));
const sortStates = [];

thead.forEach((item) => {
  sortStates[item] = 'asc';

  item.addEventListener('click', (e) => {
    const columnIndex = [...thead].indexOf(e.target);

    sortStates[columnIndex] =
      sortStates[columnIndex] === 'asc' ? 'desc' : 'asc';

    tbodyArray.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent.trim();
      const valueB = b.cells[columnIndex].textContent.trim();

      // Check if the value is a number
      const numA = parseFloat(valueA.replace(/[^0-9.-]+/g, '')) || valueA;
      const numB = parseFloat(valueB.replace(/[^0-9.-]+/g, '')) || valueB;

      // Sort the values
      if (sortStates[columnIndex] === 'asc') {
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }

        return numA.localeCompare(numB);
      } else {
        if (!isNaN(numB) && !isNaN(numA)) {
          return numB - numA;
        }

        return numB.localeCompare(numA);
      }
    });

    tbody.innerHTML = '';
    tbody.append(...tbodyArray);
  });
});
