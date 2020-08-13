'use strict';

const { formatSalary } = require('./helpers');
const { MIN_LENGTH } = require('./constants');

function validateForm(objectEmployee, formValues) {
  if ((formValues.name.value !== '')
    || (formValues.name.value.length >= MIN_LENGTH)) {
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
    = formatSalary(formValues.salary.value);
  }
}

function resetForm(formValues) {
  for (const valueElement in formValues) {
    formValues[valueElement].value = '';
  }
};

module.exports = {
  validateForm,
  resetForm,
};
