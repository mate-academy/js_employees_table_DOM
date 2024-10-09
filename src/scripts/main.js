/* eslint-disable no-shadow */
'use strict';

import {
  cellsAgeHandler,
  cellSalaryHandler,
  cellsNameAndPositionHandler,
  cellsOfficeHandler,
  setActiveRow,
  sortTable,
  validateNewEmployee,
} from './helpers.js';

import { formMarkup } from './markups.js';

document.body.insertAdjacentHTML('beforeend', formMarkup);

const form = document.querySelector('form');
const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

const tableBodyRows = [...tableBody.rows];
const tableHeaderTitles = [...tableHeader.rows[0].cells];

tableHeaderTitles.forEach((title, columnIndex, currentArr) => {
  let activeTitle = '';

  title.dataset.direction = 'ASC';

  title.addEventListener('click', (e) => {
    e.preventDefault();
    activeTitle = columnIndex;

    const currentDirection = title.dataset.direction === 'ASC' ? 1 : -1;

    sortTable(tableBody, columnIndex, currentDirection);
    title.dataset.direction = currentDirection === 1 ? 'DESC' : 'ASC';

    if (activeTitle === columnIndex) {
      currentArr.forEach((otherTitle) => {
        if (otherTitle !== title) {
          otherTitle.dataset.direction = 'ASC';
        }
      });
    }
  });
});

tableBodyRows.forEach((row) => {
  row.addEventListener('click', (e) => {
    e.preventDefault();
    setActiveRow(row);
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newEmployee = validateNewEmployee(form);

  if (newEmployee) {
    const insertedRow = tableBody.insertRow();

    for (const key in newEmployee) {
      const cell = insertedRow.insertCell();

      cell.textContent = newEmployee[key];
    }

    insertedRow.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveRow(insertedRow);
    });

    form.reset();
  }
});

tableBodyRows.forEach((row) => {
  const cells = [...row.cells];

  cells.forEach((cell, i) => {
    cell.addEventListener('dblclick', (e) => {
      e.preventDefault();

      switch (i) {
        case 0:
          cellsNameAndPositionHandler(cell);
          break;
        case 1:
          cellsNameAndPositionHandler(cell);
          break;
        case 2:
          cellsOfficeHandler(cell);
          break;
        case 3:
          cellsAgeHandler(cell);
          break;
        case 4:
          cellSalaryHandler(cell);
      }
    });
  });
});
