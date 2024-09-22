'use strict';

import { sortTable } from './sortTable';
import { createNotification } from './createNotification';
import { createNewEmploee } from './createNewEmploee';

const headers = document.querySelectorAll('th');

// sort table

headers.forEach((header, index) => {
  header.setAttribute('data-order', 'asc');

  header.addEventListener('click', () => {
    sortTable(index);
  });
});

// select row
const cells = document.querySelectorAll('td');

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const allRows = document.querySelectorAll('tr');

    allRows.forEach((row) => row.classList.remove('active'));

    const currentRow = cell.parentElement;

    currentRow.classList.add('active');
  });
});

// submit button

const submit = document.querySelector('#submit_button');

submit.addEventListener('click', (evnt) => {
  evnt.preventDefault();

  const inputName = document.getElementById('name').value;
  const age = Number(document.getElementById('age').value);
  const position = document.getElementById('position').value;

  if (inputName.trim().length < 4) {
    return createNotification('error', 'Name should be at least 4 characters');
  }

  if (position.trim().length < 1) {
    return createNotification(
      'error',
      'The name of the position should be provided',
    );
  }

  if (age < 18 || age > 90) {
    return createNotification(
      'error',
      'The age should be more than 18 and less than 90.',
    );
  } else {
    createNewEmploee();

    createNotification(
      'success',
      'The information has been gradually added to the list.',
    );
  }
});

// dblclick
