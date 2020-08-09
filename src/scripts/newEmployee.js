'use strict';

function checkAllField(objectEmployee, formVelues) {
  if ((formVelues.name.value !== '') || (formVelues.name.value.length >= 4)) {
    objectEmployee.name = formVelues.name.value;
  }

  if (formVelues.position.value !== '') {
    objectEmployee.position = formVelues.position.value;
  }

  if (formVelues.office.value !== '') {
    objectEmployee.office = formVelues.office.value;
  }

  if ((formVelues.age.value !== '')
    && (!isNaN(parseFloat(formVelues.age.value)))) {
    objectEmployee.age = formVelues.age.value;
  }

  if ((formVelues.salary.value !== '')
    && (!isNaN(parseFloat(formVelues.salary.value)))) {
    let item = '';
    const salary = [];
    let count = 0;

    item += formVelues.salary.value;
    item = item.split('').reverse();

    for (let i = 0; i < item.length; i++) {
      count++;
      salary.push(item[i]);

      if ((count === 3) && (i !== item.length - 1)) {
        count = 0;
        salary.push(',');
      }
    }
    objectEmployee.salary = '$' + salary.reverse().join('');
  }
}

function removeFormField(formValues) {
  formValues.name.value = '';
  formValues.position.value = '';
  formValues.age.value = '';
  formValues.salary.value = '';
};

module.exports = {
  checkAllField,
  removeFormField,
};
