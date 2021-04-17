'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');

table.tHead.addEventListener('click', ev => {
  const targetHeader = ev.target.closest('th');

  if (!targetHeader || !table.tHead.contains(targetHeader)) {
    return;
  }

  const header = table.tHead.firstElementChild;

  // the table can be sorted only by one column at a time
  // if it was sorted by 'Name' before and now the 'Age' is pressed
  // it will not be sorted by 'Name' anymore, hence remove the flag
  const previousHeader = [...header.cells].find(cell => {
    return cell.sorted && cell !== ev.target;
  });

  if (previousHeader) {
    previousHeader.sorted = false;
  }

  const rows = [...tableBody.rows];

  if (targetHeader.sorted) {
    rows.reverse();
  } else {
    targetHeader.sorted = true;

    const idx = ev.target.cellIndex;

    // .map(row => row.cells[idx].textContent);

    if (targetHeader.textContent === 'Age'
      || targetHeader.textContent === 'Salary') {
      rows.sort((rowA, rowB) => {
        return +rowA.cells[idx].textContent.replace(/\D/g, '')
          - +rowB.cells[idx].textContent.replace(/\D/g, '');
      });
    } else {
      rows.sort((rowA, rowB) => rowA.cells[idx].textContent.localeCompare(
        rowB.cells[idx].textContent
      ));
    }
  }

  rows.forEach(row => {
    table.tBodies[0].insertAdjacentElement('beforeend', row);
  });
});

tableBody.addEventListener('click', ev => {
  const targetRow = ev.target.closest('tr');

  if (!targetRow || !tableBody.contains(targetRow)) {
    return;
  }

  const rows = tableBody.querySelectorAll('tr');

  const selectedRow = [...rows].find(row => {
    return row.classList.contains('active') && row !== targetRow;
  });

  if (selectedRow) {
    selectedRow.classList.toggle('active');
  }

  targetRow.classList.toggle('active');
});

tableBody.addEventListener('dblclick', ev => {
  const cell = ev.target.closest('td');

  if (!cell || !tableBody.contains(cell)) {
    return;
  }

  const content = cell.textContent;

  cell.textContent = '';

  cell.insertAdjacentHTML('afterbegin', `
    <input
      type="${cell.cellIndex === 3 ? 'number' : 'text'}"
      class="cell-input"
      value="${content}"
    >
  `);
});

tableBody.addEventListener('focusout', ev => {
  const cell = ev.target.closest('td');

  if (!cell || !tableBody.contains(cell)) {
    return;
  }

  if (cell.firstElementChild
    && cell.firstElementChild.classList.contains('cell-input')) {
    const newValue = cell.firstElementChild.value
      || cell.firstElementChild.getAttribute('value');

    cell.firstElementChild.remove();
    cell.textContent = newValue;
  }
});

tableBody.addEventListener('keydown', ev => {
  if (ev.code !== 'Enter') {
    return;
  }

  const cell = ev.target.closest('td');

  if (!cell || !tableBody.contains(cell)) {
    return;
  }

  if (cell.firstElementChild
      && cell.firstElementChild.classList.contains('cell-input')) {
    const newValue = cell.firstElementChild.value
      || cell.firstElementChild.getAttribute('value');

    cell.textContent = newValue;
  }
});
