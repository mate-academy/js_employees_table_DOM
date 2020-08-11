'use strict';

const createFormEmployee = require('./createEmploeeForm');
const handlers = require('./functionHandle');
const helperFunction = require('./helpers');

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');
const div = document.createElement('div');

// sort table
thead.addEventListener('click', (event) =>
  handlers.sortHandler(event, tbody));

helperFunction.coverTextOfTheadInSpan(thead.querySelectorAll('th'));

// selected row
tbody.addEventListener('click', (event) =>
  handlers.selectedHandler(event, tbody));

// create form
createFormEmployee(form);
body.append(form);

// append new employee
const button = form.querySelector('button');

const formValue = {
  name: form.querySelector("input[name='name']"),
  position: form.querySelector("input[name='position']"),
  office: form.querySelector("select[name='office']"),
  age: form.querySelector("input[name='age']"),
  salary: form.querySelector("input[name='salary']"),
};

helperFunction.addEventToForm(formValue, div, body);

button.addEventListener('click', () =>
  handlers.saveEmployeeHandler(tbody, formValue, div, body));

// edit select cell
tbody.addEventListener('dblclick', (event) => handlers.editHandler(event));
