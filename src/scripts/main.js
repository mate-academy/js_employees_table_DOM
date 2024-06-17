'use strict';

const body = document.body;

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const th = [...thead.querySelectorAll('th')];

const tbody = table.querySelector('tbody');
const trTbody = [...tbody.querySelectorAll('tr')];

// #region sort
const sortDirections = {};

th.forEach((header, index) => {
  sortDirections[index] = 'asc'; // 0: asc

  header.addEventListener('click', () => {
    const currentDirection = sortDirections[index]; // asc
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc'; // desc

    sortDirections[index] = newDirection; // desc

    const isNumericColumn = ['Age', 'Salary'].includes(header.textContent);

    const sortedRows = trTbody.sort((a, b) => {
      const cellA = a.children[index].textContent.trim();
      const cellB = b.children[index].textContent.trim();

      if (isNumericColumn) {
        const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

        return newDirection === 'asc' ? numA - numB : numB - numA;
      } else {
        return newDirection === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    tbody.innerHTML = '';

    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});
// #endregion

// #region Row
trTbody.forEach((tr) => {
  tr.addEventListener('click', () => {
    if (tr.classList.contains('active')) {
      tr.classList.remove('active');
    } else {
      trTbody.forEach((row) => row.classList.remove('active'));
      tr.classList.add('active');
    }
  });
});
// #endregion

// #region Form
const form = document.querySelector('form[name="login"]');

const error = '<div class="error" data-qa="notification"></div>';
const success = '<div class="success" data-qa="notification"></div>';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (data.get('name') < 4) {
    body.appendChild(error);
  }

  if (data.get('age') < 18 || data.get('age') > 90) {
    body.appendChild(error);
  }

  body.appendChild(success);
});
// #endregion
