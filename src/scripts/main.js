'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

const addSortableTable = () => {
  const thead = table.querySelector('thead');
  let previousField = null;
  let isAscending = true;

  const clickHandler = (e) => {
    const th = e.target.closest('th');
    const rows = [...tbody.querySelectorAll('tr')];
    const cellIndex = th.cellIndex;
    const field = th.innerText;

    if (previousField === field) {
      isAscending = !isAscending;
    } else {
      isAscending = true;
      previousField = field;
    }

    rows.sort((a, b) => {
      const current = a.cells[cellIndex].innerHTML;
      const next = b.cells[cellIndex].innerHTML;

      if (field === 'Salary') {
        return isAscending
          ? getSalary(current) - getSalary(next)
          : getSalary(next) - getSalary(current);
      }

      if (field === 'Age') {
        return isAscending ? current - next : next - current;
      }

      return isAscending
        ? current.localeCompare(next)
        : next.localeCompare(current);
    });

    tbody.innerHTML = '';

    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  };

  thead.addEventListener('click', clickHandler);
};

document.querySelector('table');
addSortableTable(table);

function getSalary(salary) {
  return +salary.replace('$', '').replace(',', '');
}

// const isActive

// tbody.addEventListener('clisk', e => {
//   // const istarget = e.target.closest('th');

//   console.log(e);
// });