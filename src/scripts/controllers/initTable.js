import * as render from '../view/renderTable.js';
import * as handlers from './eventsTable.js';
import { tableState } from '../models/TableStore.js';
import { extractTableData } from '../utils/extractTableData.js';
import { createEmployeeStore } from '../models/employeesStore.js';
import { createEmployeeForm } from '../components/form/form.js';
import { ACTION_TYPES } from '../constants.js';

export const init = () => {
  const thead = document.querySelector('thead');
  const tbody = document.querySelector('tbody');

  const orderFields = Array.from(thead.querySelectorAll('th')).map(
    (th) => th.textContent[0].toLowerCase() + th.textContent.slice(1),
  );

  render.initTheadAttributes(thead, orderFields);

  const employeeStore = createEmployeeStore(
    extractTableData(tbody.rows, orderFields),
  );
  const { add, update, getAllSorted } = employeeStore;
  const employeeForm = createEmployeeForm(add);

  employeeStore.subscribe(({ type, payload }) => {
    switch (type) {
      case ACTION_TYPES.UPDATE:
        render.updateRow(payload, tbody);
        break;
      case ACTION_TYPES.ADD:
        render.addRow(payload, orderFields, tbody);
        break;
      case ACTION_TYPES.SORT:
        render.renderRows(tbody, payload, orderFields);
        break;
    }
  });

  const ctx = {
    tableState,
    elements: { thead, tbody },
    employeeStore: { update, getAllSorted },
    render,
  };

  render.initCellAttributes(tbody, tbody.rows, orderFields);

  document.body.appendChild(employeeForm);
  handlers.init(ctx);
};
