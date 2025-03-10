'use strict';

const table = document.querySelector('table');
let isACS = true;
const tbody = table.querySelector('tbody');
const rows = [...tbody.rows];

table.querySelector('thead tr').addEventListener('click', (e) => {
  sort(e);
});

table.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', (e) => {
    if (!row) {
      return;
    }

    rows.forEach((el) => el.classList.remove('active'));

    row.classList.toggle('active');
  });
});

function sort(e) {
  const title = e.target.textContent;
  const tHead = table.querySelector('thead');
  const headers = [...tHead.querySelectorAll('tr th')];
  const titles = [];

  headers.forEach((header) => {
    titles.push(header.innerText);
  });

  const indexTitle = titles.indexOf(title);

  rows.sort((a, b) => {
    const aEl = a.children[indexTitle].textContent;
    const bEl = b.children[indexTitle].textContent;

    if (title === 'Salary') {
      const aSalary = parseFloat(
        a.children[indexTitle].textContent.split('$')[1],
      );
      const bSalary = parseFloat(
        b.children[indexTitle].textContent.split('$')[1],
      );

      return isACS ? aSalary - bSalary : bSalary - aSalary;
    }

    return isACS ? aEl.localeCompare(bEl) : bEl.localeCompare(aEl);
  });

  rows.forEach((row) => {
    tbody.append(row);
  });

  isACS = !isACS;
}
