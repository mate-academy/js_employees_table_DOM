'use strict';

import { Form } from './form';
import { editCell, onTableSort, setActiveRow } from './utils';

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');

const { rows } = tBody;

tHead.addEventListener('click', (e) => {
  onTableSort(tHead, tBody, e.target);
});

[...rows].forEach((row) => {
  row.addEventListener('click', () => setActiveRow(rows, row));

  row.addEventListener('dblclick', editCell);
});

const { createForm } = new Form();

const form = createForm();

document.body.append(form);
