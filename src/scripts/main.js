'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');

// sort
tHead.addEventListener('click', (e) => {
  if (tBody.rows.length === 0) {
    return;
  }

  const currentTh = e.target.closest('th');
  const columnIndex = currentTh.cellIndex;

  if (!currentTh.dataset.order) {
    currentTh.dataset.order = 'asc';
  } else if (currentTh.dataset.order === 'asc') {
    currentTh.dataset.order = 'desc';
  } else {
    currentTh.dataset.order = 'asc';
  }

  for (const th of tHead.rows[0].cells) {
    if (th !== currentTh) {
      delete th.dataset.order;
    }
  }

  const multiplier = currentTh.dataset.order === 'asc' ? 1 : -1;

  const rows = [...tBody.rows];

  const content = rows[0].cells[columnIndex].textContent;

  const clean = (str) => {
    return parseFloat(str.replace(/,/g, '.').replace(/[^\d.]/g, ''));
  };

  const cleaned = clean(content);

  const isNumericColumn = !isNaN(cleaned);

  rows.sort((a, b) => {
    const aContent = a.cells[columnIndex].textContent;
    const bContent = b.cells[columnIndex].textContent;
    let result;

    if (isNumericColumn) {
      result = clean(aContent) - clean(bContent);
    } else {
      result = aContent.localeCompare(bContent);
    }

    return result * multiplier;
  });

  tBody.append(...rows);
});

// select
tBody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  for (const tr of tBody.rows) {
    if (tr !== target) {
      tr.classList.remove('active');
    }
  }

  target.classList.toggle('active');
});

// inline editing
tBody.addEventListener('dblclick', (e) => {
  const oldCellInputs = document.querySelectorAll('.cell-input');

  if (oldCellInputs) {
    for (const old of oldCellInputs) {
      old.blur();
    }
  }

  const cell = e.target.closest('td');
  const cellOriginalValue = cell.textContent;

  cell.innerHTML = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = cellOriginalValue;

  input.addEventListener('blur', () => {
    let currentValue = input.value;

    if (currentValue === '') {
      currentValue = cellOriginalValue;
    }

    input.remove();

    cell.textContent = currentValue;
  });

  // eslint-disable-next-line no-shadow
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });

  cell.append(input);

  input.focus();
});

// form
const form = document.createElement('form');

form.classList.add('new-employee-form');

const formFields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    tag: 'input',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    tag: 'input',
  },
  {
    label: 'Office',
    name: 'office',
    tag: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    tag: 'input',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    tag: 'input',
    step: 'any',
  },
];

for (const item of formFields) {
  const label = document.createElement('label');

  label.textContent = `${item.label}: `;

  const elem = document.createElement(item.tag);

  elem.required = true;
  elem.name = item.name;

  if (item.type) {
    elem.type = item.type;
  }

  if (item.step) {
    elem.step = item.step;
  }

  if (item.tag === 'select') {
    for (const opt of item.options) {
      const option = document.createElement('option');

      option.textContent = opt;

      elem.append(option);
    }
  }

  elem.dataset.qa = item.name;

  label.append(elem);
  form.append(label);
}

const button = document.createElement('button');

button.textContent = 'Save to table';
form.append(button);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value;
  const employeePosition = form.elements.position.value;
  const employeeOffice = form.elements.office.value;
  const employeeAge = form.elements.age.value;

  const rawSalary = form.elements.salary.value;
  const employeeSalary = `$${Number(rawSalary).toLocaleString('en-US')}`;

  function createNotification(message, type) {
    const notif = document.createElement('div');
    const notifMessage = document.createElement('p');

    notif.classList.add('notification', type);

    notifMessage.textContent = message;
    notifMessage.classList.add('title');

    notif.append(notifMessage);

    notif.dataset.qa = 'notification';

    document.body.append(notif);
  }

  const oldNotifs = document.querySelectorAll('.notification');

  for (const old of oldNotifs) {
    old.remove();
  }

  if (employeeName.length < 4) {
    createNotification('Name must be longer than 4 letters', 'error');

    return;
  }

  if (employeeAge < 18 || employeeAge > 90) {
    createNotification('Please, enter a correct age', 'error');

    return;
  }

  const employees = [
    employeeName,
    employeePosition,
    employeeOffice,
    employeeAge,
    employeeSalary,
  ];

  const row = document.createElement('tr');

  for (const employee of employees) {
    const cell = document.createElement('td');

    cell.append(employee);
    row.append(cell);
  }

  tBody.append(row);

  createNotification('Employee successfully added!', 'success');
});

document.body.append(form);
