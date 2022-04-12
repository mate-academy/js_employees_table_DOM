'use strict';

const sortTableByProperty = require('./sortTableByProperty');
const markSelectedRow = require('./markSelectedRow');
const createAddEmployeeForm = require('./createAddEmployeeForm');
const tableRecords = require('./tableRecords');

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');
const headings = tableHead.querySelectorAll('th');
const contentRows = tableBody.querySelectorAll('tr');
const form = createAddEmployeeForm();
const buttonAddEmployee = form.querySelector('button');

table.style.userSelect = 'none';

headings.forEach(th => th
  .addEventListener('click', sortTableByProperty));

contentRows.forEach(tr => tr
  .addEventListener('click', markSelectedRow));

tableRecords.bindTo(tableBody);
buttonAddEmployee.addEventListener('click', tableRecords.add);
