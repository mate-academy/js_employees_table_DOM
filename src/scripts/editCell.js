'use strict';

let pastValue = null;

function applyCellChages(e) {
  const input = e.target;
  const cell = input.closest('td');
  const newValue = input.value.trim();

  cell.innerText = (newValue.length > 0)
    ? newValue
    : pastValue;

  input.remove();
}

function waitForEnter(e) {
  if (e.key === 'Enter') {
    applyCellChages(e);
  }
}

function editCell(e) {
  const cell = e.target;
  const input = document.createElement('input');

  pastValue = cell.innerText;

  cell.innerText = '';
  cell.insertAdjacentElement('beforeend', input);

  input.classList.add('cell-input');
  input.focus();
  input.addEventListener('keypress', waitForEnter);
  input.addEventListener('blur', applyCellChages);
}

module.exports = editCell;
