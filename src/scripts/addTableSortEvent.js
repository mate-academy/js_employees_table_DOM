'use strict';
import {
  HEADER_AGE,
  HEADER_NAME,
  HEADER_OFFICE,
  HEADER_POSITION,
  HEADER_SALARY,
  ORDER_ASC,
  ORDER_DESC,
} from './utils';

import { tableBody, tableHead } from './constants';

let currentHeader = null;
let order = null;

export function addTableSortEvent() {
  tableHead.addEventListener('click', (e) => {
    const header = e.target.closest('th');

    if (!header) {
      return;
    }

    if (currentHeader !== header) {
      currentHeader = header;
      order = ORDER_ASC;
    } else {
      order = order === ORDER_ASC ? ORDER_DESC : ORDER_ASC;
    }

    const currentHeaderName = header.textContent.toLowerCase();
    const headers = tableHead.querySelectorAll('th');
    const currentHeaderIndex = Array.from(headers).findIndex(
      (child) => child.textContent.toLowerCase() === currentHeaderName,
    );

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows
      .sort((rowA, rowB) => {
        const cellA = rowA.children[currentHeaderIndex].textContent;
        const cellB = rowB.children[currentHeaderIndex].textContent;

        let result = 0;

        switch (currentHeaderName) {
          case HEADER_NAME:
          case HEADER_POSITION:
          case HEADER_OFFICE:
            result = cellA.localeCompare(cellB);
            break;

          case HEADER_AGE:
            result = +cellA - +cellB;
            break;

          case HEADER_SALARY:
            result =
              +cellA.replaceAll('$', '').replaceAll(',', '') -
              +cellB.replaceAll('$', '').replaceAll(',', '');
            break;

          default:
            result = 0;
            break;
        }

        if (order === ORDER_DESC) {
          result = -result;
        }

        return result;
      })
      .forEach((row) => {
        tableBody.append(row);
      });
  });
}
