import { startCellEditing } from './cellEditor';

const handleTheadClick = (e, tableState, getAllEmployeesSortedBy) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const field = th.dataset.field;

  if (!field) {
    return;
  }

  tableState.setSort(field);

  getAllEmployeesSortedBy(field, tableState.getSort().direction);
};

const handleTbodyClick = (e, tableState, elements) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  if (!tableState.getSelectedRowId()) {
    tableState.setSelectedRowId(tr.dataset.id);
    tr.classList.add('active');

    return;
  }

  const prev = elements.tbody.querySelector(
    `tr[data-id="${tableState.getSelectedRowId()}"]`,
  );

  if (prev) {
    prev.classList.remove('active');
  }

  tr.classList.add('active');
  tableState.setSelectedRowId(tr.dataset.id);
};

export const init = (ctx) => {
  const { elements, tableState, employeeStore } = ctx;
  const { update: updateEmployee, getAllSorted: getAllSortedEmployeesBy } =
    employeeStore;

  elements.thead.addEventListener('click', (e) => {
    return handleTheadClick(e, tableState, getAllSortedEmployeesBy);
  });

  elements.tbody.addEventListener('click', (e) => {
    return handleTbodyClick(e, tableState, elements);
  });

  elements.tbody.addEventListener('dblclick', (e) => {
    return startCellEditing(e, tableState, updateEmployee);
  });
};
