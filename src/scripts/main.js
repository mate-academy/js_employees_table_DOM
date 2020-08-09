'use strict';

// write code here
const thead = document.querySelector('thead');
const span = document.createElement('span');
const thOfThead = thead.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');

const selectedEmployee = require('./selected');
const sortEmployees = require('./sort');
const addEmployee = require('./newEmployee');
const message = require('./notification');

// sort table
const sortHandler = (event) => {
  const target = event.target;
  const arrayTr = [...tbody.querySelectorAll('tr')];

  sortEmployees(target.innerText, arrayTr, tbody);
  selectedEmployee(tbody.querySelectorAll('tr'));
};

for (const element of [...thOfThead]) {
  element.prepend(span.cloneNode(true));

  const wantedSpan = element.querySelector('span');

  wantedSpan.append(element.childNodes[1]);

  wantedSpan.addEventListener('click', sortHandler);
}

// selected row
const selectedHandler = (event) => {
  const target = event.target.closest('tr');

  selectedEmployee(tbody.querySelectorAll('tr'));
  target.classList.add('active');
};

for (const man of [...tbody.querySelectorAll('tr')]) {
  man.addEventListener('click', selectedHandler);
}

// create form
form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin',
  `
    <label>Name: <input name="name" type="text"></label>
    <label>Position: <input name="position" type="text"></label>
    <label>Office: 
      <select name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" min="18" max="90"></label>
    <label>Salary: <input name="salary" type="number"></label>
    <button type="button">Save to table</button>
`);

document.body.append(form);

// append new employee
const button = form.querySelector('button');

const formValue = {
  name: form.querySelector("input[name='name']"),
  position: form.querySelector("input[name='position']"),
  office: form.querySelector("select[name='office']"),
  age: form.querySelector("input[name='age']"),
  salary: form.querySelector("input[name='salary']"),
};

formValue.name.addEventListener('blur', message.name);
formValue.position.addEventListener('blur', message.position);
formValue.age.addEventListener('blur', message.age);
formValue.salary.addEventListener('blur', message.salary);

const messageError = 'Wrong Information. Please check info.!!!';
const messageSuccess = 'Congratulations. New Employee is append :)';

const saveEmployeeHandler = () => {
  const tr = document.createElement('tr');
  const objectEmployee = {};

  selectedEmployee(tbody.querySelectorAll('tr'));
  addEmployee.checkAllField(objectEmployee, formValue);

  if (Object.keys(objectEmployee).length < 5) {
    message.notificationWarning(messageError, 'Error', 'error');
  } else {
    for (const element in objectEmployee) {
      const td = document.createElement('td');

      td.insertAdjacentHTML('beforeend',
        `${objectEmployee[element]}`);

      td.addEventListener('dblclick', editValue.editHandler);
      td.addEventListener('keyup', editValue.saveEditTdHandler);
      tr.append(td);
    }
    tr.addEventListener('click', selectedHandler);
    tbody.append(tr);
    addEmployee.removeFormField(formValue);

    message.notificationWarning(messageSuccess, 'Success', 'success');
  }
};

button.addEventListener('click', saveEmployeeHandler);

// edit select cell
const editValue = require('./edit');

for (const td of [...tbody.querySelectorAll('td')]) {
  td.addEventListener('dblclick', editValue.editHandler);
  td.addEventListener('keyup', editValue.saveEditTdHandler);
}
