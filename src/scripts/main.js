'use strict';
import formData from '../data/formData.json';
import { cleareActive } from './utils/clearActiveClass';
import { createForm } from './utils/createForm';
import { fieldsData } from './utils/fieldsData';
import { toggleSort } from './utils/toggleSort';
import { validationForm } from './utils/validationForm';

const title = document.querySelectorAll('thead > tr > th');
const tbody = document.getElementsByTagName('tbody')[0];
let rowsArray = Array.from(tbody.rows);
const sortedFunctions = Array.from(title).map((_, i) => toggleSort(i));

function updateRowsArray() {
  rowsArray = Array.from(tbody.rows);
}

createForm(formData);

const button = document.querySelector('button');

button.addEventListener('click', () => {
  const dataObject = fieldsData();
  const validatedForm = validationForm(dataObject);

  if (validatedForm) {
    const tr = document.createElement('tr');

    Object.values(dataObject).forEach((value) => {
      const td = document.createElement('td');

      td.textContent = value;
      tr.append(td);
    });

    tbody.append(tr);
    updateRowsArray();
  }
});

title.forEach((column, i) => {
  column.addEventListener('click', function () {
    tbody.append(...sortedFunctions[i](rowsArray));
  });
});

Array.from(tbody.rows).forEach((tr) => {
  tr.addEventListener('click', () => {
    cleareActive(tbody.rows);
    tr.classList.toggle('active');
  });
});

Array.from(tbody.rows).forEach((row) => {
  Array.from(row.cells).forEach((cell) => {
    const input = document.createElement('input');

    input.classList.add('cell-input');

    cell.addEventListener('dblclick', (e) => {
      const tr = e.target;

      input.style.maxWidth = getComputedStyle(tr).width;

      const text = tr.textContent;

      tr.textContent = '';
      tr.append(input);
      input.focus();

      saverInputCell(input, tr, text);
    });

    input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        cell.textContent = input.value;
      }
    });
  });
});

function saverInputCell(input, tr, text) {
  const currentInput = document.getElementsByTagName('input');

  input.onblur = function () {
    if (!input.value) {
      tr.textContent = text;
    } else if (currentInput) {
      currentInput.remove();
    }
  };
}
