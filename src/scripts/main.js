'use strict';

import { initTableInteractions } from './table/initTable.js';
import { initFormInteractions } from './form/initFormInteractions.js';
import { createForm } from './form/createForm.js';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  let form = document.querySelector('form');

  if (!table) {
    return;
  }
  initTableInteractions(table);

  if (!form) {
    createForm(table);
    form = document.querySelector('form');
  }
  initFormInteractions(form, table);
});
