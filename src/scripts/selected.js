'use strict';

function deleteClassPrevSelectedRow(employees) {
  for (const man of employees) {
    if (man.classList.contains('active')) {
      man.classList.remove('active');
    }
  }
};

module.exports = deleteClassPrevSelectedRow;
