'use strict';
import { sort } from './sort';
import { createForm } from './createForm';
import { selectRow } from './selectRow';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const tableHead = table.querySelector('thead');
const body = document.querySelector('body');

sort(tableHead, tableBody);
selectRow(tableBody);
body.append(createForm(body, tableBody));
