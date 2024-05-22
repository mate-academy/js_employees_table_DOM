'use strict';
import { tableBody } from './constants';

let currentRow = null;
let prevRow = null;

export function addSelectRowEvent() {
  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    currentRow = row;

    if (currentRow !== prevRow) {
      if (prevRow !== null) {
        prevRow.className = '';
      }
    } else {
      return;
    }

    currentRow.className = 'active';

    prevRow = currentRow;
  });
}
