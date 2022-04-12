'use strict';

const triplify = require('./triplify');

let table = null;

function bindToTable(tableReference) {
  table = tableReference;
}

function checkFormValid(form) {
  const fields = [...form.elements].slice(0, -1);

  return fields.every(f => f.value !== '');
}

function addRecord(e) {
  const formParent = e.target.form;

  if (!checkFormValid(formParent)) {
    return;
  }

  e.preventDefault();

  const elements = [...formParent.elements].slice(0, -1);
  const newRecord = document.createElement('tr');

  for (const element of elements) {
    const recordColumn = document.createElement('td');

    recordColumn.innerText = (element.name === 'salary')
      ? `$${triplify(element.value)}`
      : element.value;

    element.value = (element.name === 'office')
      ? element.value
      : '';

    newRecord.append(recordColumn);
  }

  table.prepend(newRecord);
}

module.exports = {
  table: table,
  bindTo: bindToTable,
  add: addRecord,
};
