'use strict';

import { pushNotification } from './notification.js';
import { validateInput, createNewRow, createChangeCells } from './functions.js';

const tab = document.querySelector('table');
const rowTh = tab.firstElementChild;
const tBodi1 = tab.tBodies[0];

function sortTable(rows, id, count) {
  return rows.sort((a, b) => {
    const va = a.cells[id].textContent.trim();
    const vb = b.cells[id].textContent.trim();

    const na = Number(va);
    const nb = Number(vb);

    const ra = va.replace(/[^\d]+/g, '');
    const rb = vb.replace(/[^\d]+/g, '');

    if (count % 2) {
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        return na - nb;
      }

      if (ra !== '' && rb !== '') {
        return ra - rb;
      } else {
        return va.localeCompare(vb);
      }
    } else {
      if (!Number.isNaN(na) && !Number.isNaN(nb)) {
        return nb - na;
      }

      if (ra !== '' && rb !== '') {
        return rb - ra;
      } else {
        return vb.localeCompare(va);
      }
    }
  });
}

// клик по колонке заголовка

let countClick = 0;
let targCol = 0;

rowTh.addEventListener('click', (e) => {
  const idCol = e.target.closest('th').cellIndex;

  if (targCol === idCol) {
    countClick++;
  } else {
    targCol = idCol;
    countClick = 1;
  }

  const rowArray = Array.from(tab.tBodies[0].rows);
  const sortArray = sortTable(rowArray, idCol, countClick);

  tBodi1.append(...sortArray);
});
// выделение активной страницы

tBodi1.addEventListener('click', (e) => {
  const trClick = e.target.closest('tr');

  tBodi1.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
  trClick.classList.add('active');
});
// Создание формы для нов.сотрудников.

const form = document.createElement('form');
const btnForm = document.createElement('button');

form.classList.add('new-employee-form');
btnForm.textContent = 'Save to table';
// Функция - создание поля для формы.

function createFields(nameEl, typeEl) {
  const label = document.createElement('label');

  label.textContent = nameEl + ': ';

  if (typeEl === 'select') {
    const select = document.createElement('select');

    select.dataset.qa = `${nameEl}`;
    select.required = true;

    const arrOffice = [
      '',
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];
    // Цикл - создание опции для select.

    for (const city of arrOffice) {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      select.append(option);
    }

    label.append(select);

    return label;
  }

  const input = document.createElement('input');

  input.type = typeEl;
  input.required = true;
  input.dataset.qa = `${nameEl}`;
  label.append(input);

  return label;
}

form.append(
  createFields('name', 'text'),
  createFields('position', 'text'),
  createFields('office', 'select'),
  createFields('age', 'number'),
  createFields('salary', 'number'),
  btnForm,
);

document.body.append(form);

// нажатие на кнопу Отправки Формы.

btnForm.addEventListener('click', (e) => {
  e.preventDefault();

  const arrayInput = Array.from(form.querySelectorAll('[data-qa]'));

  const firstEmpty = arrayInput.find((inp) => !inp.value);

  if (firstEmpty) {
    pushNotification(
      80,
      80,
      'Error message',
      `The field: ${firstEmpty.dataset.qa} is not filled`,
      'error',
    );

    return;
  }

  const firstInvalid = arrayInput.find((inp) => !validateInput(inp));

  if (firstInvalid) {
    pushNotification(
      180,
      180,
      'filling error',
      `Invalid field data: ${firstInvalid.dataset.qa}`,
      'error',
    );

    return;
  }

  pushNotification(
    380,
    380,
    'Success message',
    'The form data has been successfully submitted.',
    'success',
  );

  tBodi1.append(createNewRow(arrayInput));
  form.reset();
});

// Редактируемая строка.

tBodi1.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  createChangeCells(td);
});
