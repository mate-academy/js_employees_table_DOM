'use strict';

const header = document.querySelectorAll('thead tr th');

[...header].map((element, index) => {
  element.addEventListener('click', (e) => {
    const rows = document.querySelectorAll('tbody tr');

    if (!element.hasAttribute('direction')
      || element.getAttribute('direction') === 'DESC') {
      element.setAttribute('direction', 'ASC');
    } else {
      element.setAttribute('direction', 'DESC');
    }

    const sortedRows = [...rows].sort((a, b) => {
      let compareA = a.querySelectorAll('td')[index].innerText;
      let compareB = b.querySelectorAll('td')[index].innerText;

      if (element.getAttribute('direction') === 'DESC') {
        compareA = b.querySelectorAll('td')[index].innerText;
        compareB = a.querySelectorAll('td')[index].innerText;
      }

      if (e.target.innerText === 'Salary') {
        return compareA.slice(1).split(',').join('.')
          - compareB.slice(1).split(',').join('.');
      }

      if (typeof (compareA) === 'string') {
        return compareA.localeCompare(compareB);
      }

      return compareA - compareB;
    });

    document.querySelector('tbody').replaceChildren(...rows, ...sortedRows);
  });
});
