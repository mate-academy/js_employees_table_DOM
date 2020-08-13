'use strict';

const { getFormFields } = require('./helpers');

const {
  sortEmployees,
  selectRow,
  editCell,
  submitEmployee,
} = require('./functionHandlers');

const {
  body,
  thead,
  tbody,
  div,
  createEmployeesForm,
} = require('./createEmploeeForm');

const { coverHeadingsToSpan } = require('./helpers');

const formElements = {};

// sort table
thead.addEventListener('click', (event) =>
  sortEmployees(event, tbody));

coverHeadingsToSpan(thead.querySelectorAll('th'));

// selected row
tbody.addEventListener('click', (event) =>
  selectRow(event, tbody));

// create form
const employeesForm = createEmployeesForm();

body.append(employeesForm);
getFormFields(employeesForm, formElements);

// append new employee
const button = employeesForm.querySelector('button');

button.addEventListener('click', () =>
  submitEmployee(tbody, formElements, div, body));

// edit select cell
tbody.addEventListener('dblclick', (event) => editCell(event));
