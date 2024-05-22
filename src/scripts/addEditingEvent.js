'use strict';
import { tableBody } from './constants';

export function addEditingEvent() {
  tableBody.addEventListener('dblclick', (e) => {
    const tableCell = e.target.closest('td');

    if (!tableCell) {
      return;
    }

    const oldValue = tableCell.textContent;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = oldValue;
    tableCell.textContent = '';
    tableCell.appendChild(input);
    input.focus();

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (innerEvent) => {
      if (innerEvent.key === 'Enter') {
        saveChanges();
      }
    });

    function saveChanges() {
      const newValue = input.value.trim();

      tableCell.textContent = newValue || oldValue;
      input.removeEventListener('blur', saveChanges);
    }
  });
}
