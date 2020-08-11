'use strict';

function deleteClassPrevSelectedRow(employees) {
  for (const man of employees) {
    man.classList.toggle('active', false);
  }
};

module.exports = deleteClassPrevSelectedRow;
