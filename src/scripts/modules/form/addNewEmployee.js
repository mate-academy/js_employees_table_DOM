'use strict';

const { formatNumberToSalary } = require('../../utils');
const { pushNotification, getErrors } = require('../notification');

const createNewEmployee = (formData) => {
  const tableRow = document.createElement('tr');

  for (const [key, value] of Object.entries(formData)) {
    const tableData = document.createElement('td');

    let data = value;

    if (key === 'salary') {
      data = formatNumberToSalary(+data);
    }

    tableData.textContent = data;

    tableRow.appendChild(tableData);
  }

  return tableRow;
};

/* eslint-disable-next-line no-shadow */
const addNewEmployee = (event, table) => {
  event.preventDefault();

  const form = event.target;

  const tableBody = table.querySelector('tbody');
  const formData = Object.fromEntries(new FormData(form));

  const errors = getErrors(formData);

  if (errors.length === 0) {
    const newEmployee = createNewEmployee(formData);

    tableBody.appendChild(newEmployee);

    /* eslint-disable-next-line max-len */
    pushNotification(10, 10, 'Succes', 'New employee was successfuly created', 'success');

    form.reset();

    return;
  }

  for (const [index, { title, description }] of errors.entries()) {
    /* eslint-disable-next-line max-len */
    pushNotification(10 + (index * 150), 10, title, description, 'error');
  }
};

module.exports = { addNewEmployee };
