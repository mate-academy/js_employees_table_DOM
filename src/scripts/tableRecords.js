'use strict';

const notifications = require('./notifications');
const triplify = require('./triplify');

let table = null;

function bindToTable(tableReference) {
  table = tableReference;

  notifications.create();
}

function checkFormValid(form) {
  const fields = [...form.elements].slice(0, -1);

  if (fields.some(f => f.value.length <= 0)) {
    notifications.push('Empty field',
      'Fill all empty fields before adding',
      notifications.types.error);

    return false;
  }

  for (const field of fields) {
    switch (field.name) {
      case 'name': {
        if (field.value.length < 4) {
          notifications.push('Wrong name',
            '"Name" field should have at least 4 characters',
            notifications.types.error);

          return false;
        }

        break;
      }

      case 'age': {
        const age = parseInt(field.value);

        if (age < 18 || age > 90) {
          notifications.push('Age restriction',
            'You are out of permissed age bounds',
            notifications.types.error);

          return false;
        }

        break;
      }

      default: {
        break;
      }
    }
  }

  return true;
}

function addRecord(e) {
  e.preventDefault();

  const formParent = e.target.form;

  if (!checkFormValid(formParent)) {
    return;
  }

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

  notifications.push('Employee added',
    'New employee was added succesfully',
    notifications.types.success);
}

module.exports = {
  table: table,
  bindTo: bindToTable,
  add: addRecord,
};
