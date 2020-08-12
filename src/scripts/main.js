'use strict';

const createFormEmployee = require('./createEmploeeForm');
const handlers = require('./functionHandlers');
const {
  coverTextOfTheadInSpan,
  getFormFields,
} = require('./helpers');
const { FORM_FIELD } = require('./constants');

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');
const div = document.createElement('div');

// sort table
thead.addEventListener('click', (event) =>
  handlers.sortHandler(event, tbody));

coverTextOfTheadInSpan(thead.querySelectorAll('th'));

// selected row
tbody.addEventListener('click', (event) =>
  handlers.selectedHandler(event, tbody));

// create form
body.append(createFormEmployee(form));

// append new employee
const button = form.querySelector('button');

getFormFields(form, FORM_FIELD);

button.addEventListener('click', () =>
  handlers.saveEmployeeHandler(tbody, FORM_FIELD, div, body));

// edit select cell
tbody.addEventListener('dblclick', (event) => handlers.editHandler(event));
