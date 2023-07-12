'use strict';

const { sortAscending, sortDescending } = require('./sortHelpers.js');
const {
  buildForm,
  createNotification,
  validateFormInputs,
} = require('./form.js');

buildForm();

let lastTarget;
const tableThead = document.querySelector('thead');
const tableTbody = document.querySelector('tbody');
const form = document.querySelector('form');

const selectActiveRow = (rows, index) => {
  rows.forEach((row) => row.classList.remove('active'));

  if (rows[index]) {
    rows[index].classList.add('active');
  }
};

const sortTable = (index, order) => {
  const rows = tableTbody.getElementsByTagName('tr');

  const sortedRows = [...rows].sort((a, b) => {
    const columnAText = a.children[index].innerText;
    const columnBText = b.children[index].innerText;

    if (order === 'asc') {
      return sortAscending(columnAText, columnBText);
    } else {
      return sortDescending(columnAText, columnBText);
    }
  });

  sortedRows.forEach((row) => tableTbody.appendChild(row));
};

const insertIntoTable = (formData) => {
  const tableRow = tableTbody.insertRow(-1);

  formData.forEach((data, i) => {
    tableRow.insertCell(i).innerText = data;
  });

  createNotification('success', 'Data added to the table');
};

const saveCellInput = (targetedCell, value, initialValue) => {
  targetedCell.textContent = '';

  if (!value) {
    targetedCell.textContent = initialValue;
  } else {
    targetedCell.textContent = value;
  }
};

tableThead.addEventListener('click', ({ target }) => {
  const theadChildren = target.closest('tr').children;

  const columnIndex = [...theadChildren].findIndex(
    (th) => th.innerText === target.innerText
  );

  if (lastTarget === target) {
    sortTable(columnIndex, 'desc');
    lastTarget = null;
  } else {
    sortTable(columnIndex, 'asc');
    lastTarget = target;
  }
});

tableTbody.addEventListener('click', ({ target }) => {
  const tableBodyRows = tableTbody.querySelectorAll('tr');
  const rowIndex = [...tableBodyRows].findIndex(
    (row) => target.closest('tr') === row
  );

  if (
    tableBodyRows[rowIndex]
    && tableBodyRows[rowIndex].classList.contains('active')
  ) {
    return;
  }

  selectActiveRow(tableBodyRows, rowIndex);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = [];

  for (const [key, value] of formData.entries()) {
    if (validateFormInputs(key, value)) {
      return;
    }

    if (key === 'salary') {
      const numberFormat = Intl.NumberFormat('en-US');

      data.push(`$${numberFormat.format(value)}`);
    } else {
      data.push(value.slice(0, 1).toUpperCase() + value.slice(1));
    }
  }

  insertIntoTable(data);
  form.reset();
});

tableTbody.addEventListener('dblclick', ({ target: targetedCell }) => {
  const initialValue = targetedCell.textContent;

  targetedCell.innerHTML = `<input class="cell-input"/>`;

  const targetedCellChild = targetedCell.children[0];

  targetedCellChild.focus();
  targetedCellChild.value = initialValue;

  targetedCellChild.addEventListener('blur', ({ target }) => {
    saveCellInput(targetedCell, target.value, initialValue);
  });

  targetedCell.addEventListener('keypress', ({ key, target }) => {
    if (key === 'Enter') {
      saveCellInput(targetedCell, target.value, initialValue);
    }
  });
});
