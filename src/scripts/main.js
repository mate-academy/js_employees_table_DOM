'use strict';

/* eslint-disable no-shadow */

const { handleTableEvents, editTableData } = require('./modules/table');
const { createNewEmployeeForm, addNewEmployee } = require('./modules/form');

const body = document.body;
const table = document.querySelector('table');
const form = createNewEmployeeForm(body);

table.addEventListener('click', handleTableEvents);
table.addEventListener('dblclick', editTableData);

form.addEventListener('submit', (event) => addNewEmployee(event, table));
