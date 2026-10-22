import { initTableSort } from './modules/table-sort';
import { initRowSelect } from './modules/row-select';
import { initNewEmployeeForm } from './modules/new-employee-form';
import { initCellEdit } from './modules/cell-edit';

document.addEventListener('DOMContentLoaded', () => {
  const tableEl = document.querySelector('table');
  const headerEl = tableEl.tHead;
  const bodyEl = tableEl.tBodies[0];
  const rows = bodyEl.rows;

  initTableSort(headerEl, bodyEl, rows);
  initRowSelect(bodyEl);
  initNewEmployeeForm(tableEl, bodyEl);
  initCellEdit(bodyEl);
});
