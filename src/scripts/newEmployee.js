'use strict';

const parseToText = require('./helpers');

function checkAllField(objectEmployee, formValues) {
  if ((formValues.name.value !== '') || (formValues.name.value.length >= 4)) {
    objectEmployee.name = formValues.name.value;
  }

  if (formValues.position.value !== '') {
    objectEmployee.position = formValues.position.value;
  }

  if (formValues.office.value !== '') {
    objectEmployee.office = formValues.office.value;
  }

  if ((formValues.age.value !== '')
    && (!isNaN(parseFloat(formValues.age.value)))) {
    objectEmployee.age = formValues.age.value;
  }

  if ((formValues.salary.value !== '')
    && (!isNaN(parseFloat(formValues.salary.value)))) {
    objectEmployee.salary
    = parseToText.formatSalary(formValues.salary.value);
  }
}

function resetForm(formValues) {
  for (const valueElement in formValues) {
    formValues[valueElement].value = '';
  }
};

module.exports = {
  checkAllField,
  resetForm,
};
