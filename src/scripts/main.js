'use strict';

const { sort } = require('./sortHelpers.js');
const {
  buildForm,
  createNotification,
  validateFormInputs,
} = require('./form.js');

buildForm();

let lastTarget;
const tableThead = document.querySelector('thead');
const tableTbody = document.querySelector('tbody');
const rows = tableTbody.getElementsByTagName('tr');
const form = document.querySelector('form');

const selectActiveRow = (target) => {
  if (target.classList.contains('active')) {
    return;
  }

  const currentlyActive = tableTbody.querySelector('.active');

  if (currentlyActive) {
    currentlyActive.classList.remove('active');
  }

  target.classList.add('active');
};

const sortTable = (index, order) => {
  const sortedRows = [...rows].sort((a, b) => {
    let columnAText = a.children[index].innerText;
    let columnBText = b.children[index].innerText;

    if (order === 'desc') {
      [columnAText, columnBText] = [columnBText, columnAText];
    }

    return sort(columnAText, columnBText);
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
  const theadCellIndex = target.cellIndex;

  if (lastTarget === target.textContent) {
    sortTable(theadCellIndex, 'desc');
    lastTarget = null;
  } else {
    sortTable(theadCellIndex, 'asc');
    lastTarget = target.textContent;
  }
});

tableTbody.addEventListener('click', ({ target }) => {
  selectActiveRow(target.closest('tr'));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = [];

  for (const [key, value] of formData.entries()) {
    if (!validateFormInputs(key, value)) {
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
