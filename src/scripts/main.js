'use strict';
import { compareValues, sortFunction} from './sortFunc.js'
import { editTable } from './tableEdit.js'
import { processForm } from './form.js'

const getEvent = function() {
  let clickCheck = false;

  return function(e) {
    const element = e.target;

    if (element.matches('th')) {
      const rows = table.rows;
      const cellIndex = element.cellIndex;

      sortFunction(cellIndex, compareValues, rows, clickCheck);
      clickCheck = !clickCheck;
    } else if (element.closest('tr')) {
      element.classList.toggle('active');
    }
  };
};

const clicked = getEvent();
const table = document.querySelector('table');

table.addEventListener('click', clicked);
mainForm.addEventListener('submit', processForm);
table.addEventListener('dblclick', editTable);
