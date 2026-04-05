import { KEYS } from '../constants';

export const initTheadAttributes = (theadElement, orderFields) => {
  const tr = document.createElement('tr');

  orderFields.forEach((column) => {
    const th = document.createElement('th');

    th.textContent = column[0].toUpperCase() + column.slice(1);
    th.dataset.field = column;
    th.tabIndex = 0;
    th.setAttribute('role', 'button');
    tr.appendChild(th);
  });

  theadElement.innerHTML = '';
  theadElement.appendChild(tr);
};

export const initCellAttributes = (tbody, rows, orderFields) => {
  const frag = document.createDocumentFragment();

  [...rows].forEach((row, index) => {
    const tr = document.createElement('tr');

    tr.dataset.id = index;

    [...row.children].forEach((td, idx) => {
      const elementTd = document.createElement('td');

      elementTd.textContent = td.textContent;
      elementTd.dataset.field = orderFields[idx];
      tr.appendChild(elementTd);
    });
    frag.appendChild(tr);
  });
  tbody.innerHTML = '';
  tbody.appendChild(frag);
};

export const renderRows = (tbody, employeesArr = [], orderFields) => {
  const frag = document.createDocumentFragment();

  employeesArr.forEach((employeeObj) => {
    const tr = addRow(employeeObj, orderFields);

    tr.dataset.id = employeeObj.id;
    frag.appendChild(tr);
  });

  tbody.innerHTML = '';
  tbody.appendChild(frag);
};

export const addRow = (payload, orderFields, tbody = null) => {
  const tr = document.createElement('tr');

  orderFields.forEach((field) => {
    const td = document.createElement('td');

    if (field === KEYS.SALARY) {
      td.textContent = '$' + payload[field].toLocaleString('en-US');
    } else {
      td.textContent = payload[field];
    }

    td.dataset.field = field;
    tr.appendChild(td);
  });

  if (tbody) {
    tbody.appendChild(tr);
  }

  return tr;
};

export const updateRow = (payload, tbody) => {
  const td = tbody
    .querySelector(`[data-id="${payload.id}"]`)
    ?.querySelector(`[data-field="${payload.field}"]`);

  if (td) {
    td.textContent =
      payload.field === KEYS.SALARY
        ? '$' + payload.value.toLocaleString('en-US')
        : payload.value;
  }
};
