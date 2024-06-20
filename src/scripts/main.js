'use strict';

document.addEventListener('DOMContentLoaded', app);

function app() {
  const headers = document.querySelectorAll('table thead th');
  const table = document.querySelector('table');
  const tbody = document.querySelector('table tbody');

  table.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName === 'TD') {
      cellEdit(cell);
    }
  });

  selectUser();
  sortLogic(headers, tbody);
  createForm();
}

function cellEdit(cell) {
  const prevValue = cell.innerHTML;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = prevValue;
  cell.innerHTML = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    saveChanges(input.value, cell, prevValue);
  });

  input.addEventListener('keypress', () => {
    saveChanges(input.value, cell, prevValue);
  });

  const saveChanges = (value, cellToChange, prev) => {
    if (value) {
      cellToChange.innerHTML = value;
      input.remove();
    } else {
      cellToChange.innerHTML = prev;
    }
  };
}

function createForm() {
  const datas = ['name', 'position', 'office', 'age', 'salary'];

  const form = document.createElement('form');
  const button = document.createElement('button');

  form.className = 'new-employee-form';
  form.method = 'post';
  form.action = '/';
  button.type = 'submit';
  button.textContent = 'Save to table';

  const createSelect = (data) => {
    const options = [
      `Choose office`,
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ];

    const select = document.createElement('select');

    options.forEach((item) => {
      const option = document.createElement('option');

      if (item === options[0]) {
        option.disabled = true;
        option.selected = true;
        option.value = '';
      }

      option.textContent = item;
      option.value = item;

      select.appendChild(option);
    });

    select.name = data;
    select.dataset.qa = data;
    select.required = true;

    return select;
  };

  datas.forEach((data) => {
    const label = document.createElement('label');

    label.textContent = `${data.charAt(0).toUpperCase() + data.slice(1)}:`;

    if (data !== 'office') {
      const input = document.createElement('input');

      input.dataset.qa = data;
      input.type = data === 'age' || data === 'salary' ? 'number' : 'text';
      input.required = 'true';
      input.name = data;

      label.appendChild(input);
    } else {
      const select = createSelect(data);

      label.appendChild(select);
    }

    form.appendChild(label);
  });

  form.appendChild(button);
  form.addEventListener('submit', addUser);
  document.querySelector('table').after(form);
}

function selectUser() {
  let selectedRow;

  document.addEventListener('click', (e) => {
    const currentRow = e.target.closest('tbody tr');

    if (currentRow && currentRow !== selectedRow) {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      currentRow.classList.add('active');
      selectedRow = currentRow;
    } else if (!currentRow) {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
    }
  });
}

function sortLogic(headers, tbody) {
  const sortOrder = {};

  headers.forEach((header, index) => {
    sortOrder[index] = true;

    header.addEventListener('click', () => {
      headers.forEach((_, i) => {
        if (i !== index) {
          sortOrder[i] = true;
        }
      });

      const isAscending = sortOrder[index];

      sortColumn(index, isAscending);
      sortOrder[index] = !isAscending;
    });
  });

  const sortColumn = (indexOfColumn, isAscending) => {
    const rows = [...document.querySelectorAll('table tbody tr')];

    rows.sort((a, b) => {
      const aCell = a.children[indexOfColumn].textContent.trim();
      const bCell = b.children[indexOfColumn].textContent.trim();

      const aValue = parseFloat(aCell.replace(/[$,]/g, '')) || aCell;
      const bValue = parseFloat(bCell.replace(/[$,]/g, '')) || bCell;

      let result;

      if (!isNaN(aValue) && !isNaN(bValue)) {
        result = aValue - bValue;
      } else {
        result = aValue.localeCompare(bValue);
      }

      return isAscending ? result : -result;
    });

    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  };
}

function getFormData(form) {
  const data = new FormData(form);
  const nameInput = data.get('name');
  const position = data.get('position');
  const office = data.get('office');
  const age = data.get('age');
  const salary = +data.get('salary');

  return {
    name: nameInput,
    position,
    office,
    age,
    salary: `$${salary.toLocaleString('en-US')}`,
  };
}

function addUser(e) {
  e.preventDefault();

  const form = document.querySelector('.new-employee-form');
  const tbody = document.querySelector('tbody');

  const user = getFormData(form);

  if (user.name.length < 4 || !user.name.trim().length) {
    createNotification(
      'error',
      'Fix your name',
      'The name must consist of at least 4 letters.',
    );

    return;
  }

  if (user.age < 18 || user.age > 90) {
    createNotification('error', 'Fix your age', 'Your age is not appropriate.');

    return;
  }

  if (!user.position.trim().length) {
    createNotification(
      'error',
      'Fix your position',
      'Position field can not be empty.',
    );

    return;
  }

  if (!user.position.trim().length) {
    createNotification(
      'error',
      'Fix your position',
      'Position field can not be empty.',
    );

    return;
  }

  if (!parseFloat(user.salary.replace(/[$,]/g, ''))) {
    createNotification(
      'error',
      'Fix your salary',
      'Salary field can not be empty',
    );

    return;
  }

  const newTr = document.createElement('tr');

  Object.values(user).forEach((value) => {
    const td = document.createElement('td');

    td.innerHTML = value;

    newTr.appendChild(td);
  });

  tbody.appendChild(newTr);
  form.reset();

  const select = form.querySelector('select[name="office"]');

  select.selectedIndex = 0;
  createNotification('success', 'Success!', 'User was successfully added.');
}

function createNotification(state, fix, message) {
  const div = document.createElement('div');
  const description = document.createElement('p');
  const title = document.createElement('p');

  div.dataset.qa = 'notification';
  div.classList.add(state, 'notification');
  title.innerHTML = fix;
  title.className = 'title';
  description.innerHTML = message;

  div.append(description, title);
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

const style = document.createElement('style');

style.textContent = `
      input[type='number']::-webkit-outer-spin-button,
      input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      input[type='number'] {
        -moz-appearance: textfield;
      }
    `;

document.head.appendChild(style);
