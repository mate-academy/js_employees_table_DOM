'use strict';

const table = document.querySelector('table');
let tbodyRows = [...table.tBodies[0].rows];
const form = document.querySelector('.new-employee-form');
const notification = document.querySelector('.notification');
let order = 'asc';

form.addEventListener('submit', e => {
  if (!form.checkValidity()) {
    e.preventDefault();
  }

  if (form.checkValidity()) {
    e.preventDefault();
    onSuccessSubmit();
    addEmployee();
    clearForm();
  }
});

table.addEventListener('click', function(e) {
  if (e.target.matches('thead tr th')) {
    const thIndex = e.target.cellIndex;

    if (order === 'asc') {
      order = 'desc';
    } else {
      order = 'asc';
    }

    tbodyRows.sort((a, b) => sortRows(a, b, thIndex, order));

    for (const tr of tbodyRows) {
      table.tBodies[0].append(tr);
    }
  }
});

table.addEventListener('dblclick', function(e) {
  if (!e.target.matches('tbody tr td')) {
    return;
  }

  const cellIndex = e.target.cellIndex;
  const rowIndex = e.target.parentElement.sectionRowIndex;

  for (const row of tbodyRows) {
    if (row.sectionRowIndex === rowIndex) {
      const cell = row.cells[cellIndex];

      editCell(cell);
    }
  }
});

table.tBodies[0].addEventListener('click', e => {
  if (e.target.matches('tbody tr td')) {
    const rowIndex = e.target.parentElement.sectionRowIndex;

    for (const row of tbodyRows) {
      if (row.sectionRowIndex !== rowIndex) {
        row.className = '';
      } else {
        row.className = 'active';
      }
    }
  }
});

function sortRows(a, b, index, typeOrder) {
  const aText = a.children[index].textContent;
  const bText = b.children[index].textContent;

  if (aText[0] !== '$') {
    return typeOrder === 'asc'
      ? aText.localeCompare(bText) : bText.localeCompare(aText);
  }

  return typeOrder === 'asc'
    ? formatToNum(aText) - formatToNum(bText)
    : formatToNum(bText) - formatToNum(aText);
}

function formatToNum(num) {
  return Number(num.slice(1).split(',').join(''));
}

function formatToSting(str) {
  return '$' + str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function onSuccessSubmit() {
  notification.hidden = false;

  setInterval(() => {
    notification.hidden = true;
  }, 1500);
}

function addEmployee() {
  const data = new FormData(form);

  table.children[1].insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${data.get('age')}</td>
      <td>${formatToSting(data.get('salary'))}</td>
    </tr>
  `);
  tbodyRows = [...table.tBodies[0].rows];
}

function clearForm() {
  for (const elem of [...form.elements]) {
    elem.value = '';
  }
}

function editCell(cell) {
  const cellText = cell.innerText;

  cell.innerText = '';

  const fieldEdit = document.createElement('input');

  fieldEdit.className = 'cell-input';

  if (Number.parseFloat(cellText)) {
    fieldEdit.type = 'number';
    fieldEdit.min = 18;
    fieldEdit.max = 90;
  }

  if (cellText.startsWith('$')) {
    fieldEdit.type = 'number';
    fieldEdit.min = 1;
  }

  cell.append(fieldEdit);
  fieldEdit.focus();

  fieldEdit.addEventListener('keyup', (ev) => {
    if (ev.code === 'Enter' && fieldEdit.value.length > 0) {
      cell.textContent = cellText.startsWith('$')
        ? formatToSting(fieldEdit.value) : fieldEdit.value;
    }

    if (ev.code === 'Enter' && fieldEdit.value.length === 0) {
      cell.textContent = cellText;
    }
  });

  fieldEdit.addEventListener('blur', (ev) => {
    if (fieldEdit.value.length > 0) {
      cell.innerHTML = cellText.startsWith('$')
        ? formatToSting(fieldEdit.value) : fieldEdit.value;
    }

    if (fieldEdit.value.length === 0) {
      cell.innerHTML = cellText;
    }
  });
}
