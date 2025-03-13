'use strict';

document.querySelector('thead').addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const table = e.target.closest('table');
    const tBody = table.querySelector('tbody');
    const index = e.target.cellIndex;
    const rows = Array.from(tBody.rows);
    const isDesc = e.target.dataset.sortOrder !== 'asc';

    e.target.dataset.sortOrder = isDesc ? 'asc' : 'desc';

    rows.sort((a, b) => {
      return e.target.dataset.sortOrder === 'asc'
        ? compareRows(a, b, index)
        : compareRows(b, a, index);
    });

    rows.forEach((row) => tBody.appendChild(row));
  }
});

document.querySelector('tbody').addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    document
      .querySelectorAll('tbody tr')
      .forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  Array.from(document.querySelector('thead tr').children).forEach(
    (item, index) => {
      const fieldName = item.textContent;
      const label = document.createElement('label');

      label.textContent = `${fieldName}: `;

      const isOffice = fieldName === 'Office';
      const inputOrSelect = isOffice
        ? createSelectOptions(index)
        : document.createElement('input');

      inputOrSelect.name = fieldName.toLocaleLowerCase();
      inputOrSelect.dataset.dataQa = fieldName.toLocaleLowerCase();
      inputOrSelect.required = true;

      addFormFieldValidations(inputOrSelect);

      if (inputOrSelect.tagName === 'INPUT') {
        inputOrSelect.type = getDataType(item, index);
      }

      label.appendChild(inputOrSelect);
      form.appendChild(label);
    },
  );

  form.appendChild(createSubmitButton(form));

  addTableEditing();

  document.body.appendChild(form);
});

function compareRows(rowA, rowB, headerIndex) {
  const cellA = rowA.cells[headerIndex].textContent.trim().replace(/[$,]/g, '');
  const cellB = rowB.cells[headerIndex].textContent.trim().replace(/[$,]/g, '');

  const valueA = isNaN(cellA) ? cellA : Number(cellA);
  const valueB = isNaN(cellB) ? cellB : Number(cellB);

  return valueA >= valueB ? 1 : -1;
}

function getDataType(field, index) {
  const cell = document.querySelector('tbody').rows[0]?.cells[index];
  const value = cell ? cell.textContent.trim() : '';

  if (field.textContent.trim() === 'Office') {
    return 'option';
  }

  if (!isNaN(value) && value !== '') {
    return 'number';
  }

  return 'text';
}

function createSelectOptions() {
  const select = document.createElement('select');

  [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ].forEach((item) => {
    const option = document.createElement('option');

    option.value = item.toLocaleLowerCase();
    option.textContent = item;
    select.appendChild(option);
  });

  return select;
}

function addFormFieldValidations(inputOrSelect) {
  const fieldName = inputOrSelect.name;

  switch (fieldName) {
    case 'name':
      inputOrSelect.minLength = 4;
      break;
    case 'age':
      inputOrSelect.min = 18;
      inputOrSelect.max = 90;
      break;
  }
}

function addTableEditing() {
  let activeCell = null;

  document.querySelector('tbody').addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (cell && !cell.querySelector('input')) {
      if (activeCell && activeCell !== cell) {
        saveCellContent(activeCell);
      }

      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = cell.textContent.trim();

      cell.textContent = '';
      cell.appendChild(input);
      input.focus();

      activeCell = cell;

      input.addEventListener('keydown', (inputEvent) => {
        if (inputEvent.key === 'Enter') {
          saveCellContent(cell);
        }
      });

      input.addEventListener('blur', () => {
        saveCellContent(cell);
      });
    }
  });

  function saveCellContent(cell) {
    const input = cell.querySelector('input');
    const newText =
      input.value.trim() === ''
        ? cell.dataset.initialValue
        : input.value.trim();

    cell.textContent = newText;

    cell.dataset.initialValue = newText;

    activeCell = null;
  }
}

function createSubmitButton(form) {
  const button = document.createElement('button');

  button.textContent = 'Save to table';

  button.addEventListener('click', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      showNotification(
        'error',
        'Please fill in all required fields',
        'Form Incomplete',
      );

      return;
    }

    const newRow = document.createElement('tr');

    Array.from(form.elements).forEach((input) => {
      if (input.tagName === 'BUTTON') {
        return;
      }

      const cell = document.createElement('td');

      if (input.tagName === 'SELECT') {
        cell.textContent = input.options[input.selectedIndex].textContent;
      } else {
        cell.textContent = input.value;
      }

      newRow.appendChild(cell);
    });

    const tbody = document.querySelector('table tbody');

    tbody.appendChild(newRow);

    form.reset();

    showNotification('success', 'User was successfully added', 'Success');
  });

  return button;
}

function showNotification(type, message, title) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);

  const notificationTitle = document.createElement('strong');

  notificationTitle.textContent = title;

  const notificationMessage = document.createElement('p');

  notificationMessage.textContent = message;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationMessage);

  document.body.appendChild(notification);

  const form = document.querySelector('.new-employee-form');
  const formPosition = form.getBoundingClientRect();

  notification.style.top = `${formPosition.bottom + 10}px`;
  notification.style.left = `${formPosition.left + formPosition.width / 2 - notification.offsetWidth / 2}px`;

  setTimeout(() => {
    notification.remove();
  }, 2000);
}
