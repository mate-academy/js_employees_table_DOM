'use strict';
import('./sortTable.js');
import('./form.js');

const tbodyElement = document.querySelector('tbody');

tbodyElement.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  const rowsList = document.querySelectorAll('tr');

  if (!row) {
    return;
  }

  rowsList.forEach((element) => {
    if (element.classList.contains('active')) {
      element.classList.remove('active');
    }
  });

  row.classList.add('active');
});

tbodyElement.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const oldCellValue = cell.textContent;
  let inputType;

  if (oldCellValue[0] === '$' || !Number.isNaN(Number(oldCellValue))) {
    inputType = 'number';
  } else {
    inputType = 'text';
  }

  cell.innerHTML = `<input type=${inputType} class='cell-input'>`;

  const inputElement = cell.querySelector('input');

  function handleInputActions(inputEvent) {
    if (inputEvent.type === 'keydown' && inputEvent.key !== 'Enter') {
      return;
    }

    if (inputElement.value.trim() === '') {
      cell.innerHTML = oldCellValue;

      return;
    }

    if (oldCellValue[0] === '$') {
      cell.innerHTML = `$${Number(inputElement.value.trim()).toLocaleString('en-US')}`;

      return;
    }

    cell.innerHTML = inputElement.value.trim();
  }

  inputElement.focus();
  inputElement.addEventListener('blur', handleInputActions);
  inputElement.addEventListener('keydown', handleInputActions);
});
