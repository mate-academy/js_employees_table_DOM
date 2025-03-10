'use strict';
import { sortClickHandler } from './sortTable';
import { createNewForm } from './addForm';

const table = document.getElementsByTagName('table')[0];
const headerTable = table.tHead;
const bodyTable = table.tBodies[0];
const tableRows = Array.from(bodyTable.rows);

document.addEventListener('DOMContentLoaded', createNewForm);

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

// handler for choosing row of table
bodyTable.addEventListener('click', (e) => {
  e.preventDefault();

  const chosenRow = e.target.closest('tr');

  if (chosenRow) {
    tableRows.forEach((row) => row.classList.remove('active'));
    chosenRow.classList.toggle('active');
  }
});

headerTable.addEventListener('click', sortClickHandler);
