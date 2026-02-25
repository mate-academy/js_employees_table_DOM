'use strict';

const table = document.querySelector('table');

table.addEventListener('click', (e) => {
  const target = e.target;

  if (target.closest('th')) {
    const header = target.closest('th');
    const index = header.cellIndex;
    const listOfEmployees = [...table.querySelector('tbody').rows];
    const isAsc = header.dataset.order === 'asc';
    const modifier = isAsc ? -1 : 1;
    const sortedList = listOfEmployees.sort((a, b) => {
      const valA = a.cells[index].textContent;
      const valB = b.cells[index].textContent;

      if (index === 3) {
        return (+valA - +valB) * modifier;
      }

      if (index === 4) {
        return (valA.replace(/\D/g, '') - valB.replace(/\D/g, '')) * modifier;
      }

      return valA.localeCompare(valB) * modifier;
    });

    table.querySelector('tbody').append(...sortedList);

    if (header.dataset.order !== 'asc') {
      header.dataset.order = 'asc';
    } else {
      header.dataset.order = '';
    }

    return;
  }

  if (target.closest('td')) {
    const data = target.closest('td');
    const rows = table.querySelector('tbody').querySelectorAll('tr');

    rows.forEach((tr) => {
      tr.classList.remove('active');
    });

    const row = data.closest('tr');

    if (row) {
      row.classList.add('active');
    }
  }
});
