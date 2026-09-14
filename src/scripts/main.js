'use strict';

const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const parseCurrency = (str) => +str.slice(1).split(',').join('');
const parseNumber = (str) => +str.trim();

const columnConfigs = {
  Name: {
    index: 0,
    comparatorAsc: (a, b) => a.localeCompare(b),
    comparatorDsc: (a, b) => b.localeCompare(a),
  },
  Position: {
    index: 1,
    comparatorAsc: (a, b) => a.localeCompare(b),
    comparatorDsc: (a, b) => b.localeCompare(a),
  },
  Office: {
    index: 2,
    comparatorAsc: (a, b) => a.localeCompare(b),
    comparatorDsc: (a, b) => b.localeCompare(a),
  },
  Age: {
    index: 3,
    comparatorAsc: (a, b) => parseNumber(a) - parseNumber(b),
    comparatorDsc: (a, b) => parseNumber(b) - parseNumber(a),
  },
  Salary: {
    index: 4,
    comparatorAsc: (a, b) => parseCurrency(a) - parseCurrency(b),
    comparatorDsc: (a, b) => parseCurrency(b) - parseCurrency(a),
  },
};

function sortByColumnAsc(headerKey) {
  const config = columnConfigs[headerKey];

  if (!config) {
    return;
  }

  const { index, comparatorAsc } = config;
  const rows = [...tbody.querySelectorAll('tr')];

  rows.sort((rowA, rowB) => {
    const valA = rowA.cells[index].textContent;
    const valB = rowB.cells[index].textContent;

    return comparatorAsc(valA, valB);
  });

  tbody.append(...rows);
}

function sortByColumnDsc(headerKey) {
  const config = columnConfigs[headerKey];

  if (!config) {
    return;
  }

  const index = config.index;
  const comparatorDsc = config.comparatorDsc;
  const rows = [...tbody.querySelectorAll('tr')];

  rows.sort((rowA, rowB) => {
    const valA = rowA.cells[index].textContent;
    const valB = rowB.cells[index].textContent;

    return comparatorDsc(valA, valB);
  });

  tbody.append(...rows);
}

let lastClickedTh = null;

thead.addEventListener('click', (clickEvent) => {
  const th = clickEvent.target.closest('th');

  if (!th) {
    return;
  }

  const headerKey = th.textContent.trim();

  if (lastClickedTh === th) {
    sortByColumnDsc(headerKey);

    lastClickedTh = null;
  } else {
    sortByColumnAsc(headerKey);

    lastClickedTh = th;
  }
});

let lastClickedTr = null;

tbody.addEventListener('click', (clickEvent) => {
  if (clickEvent.target.closest('.cell-input')) {
    return;
  }

  const tr = clickEvent.target.closest('tr');

  if (!tr) {
    return;
  }

  if (lastClickedTr !== tr && lastClickedTr) {
    lastClickedTr.classList.remove('active');
  }

  tr.classList.add('active');
  lastClickedTr = tr;
});

tbody.addEventListener('dblclick', (eventClick) => {
  const cell = eventClick.target.closest('td');

  if (!cell || eventClick.target.classList.contains('cell-input')) {
    return;
  }

  const activeInput = tbody.querySelector('.cell-input');

  if (activeInput) {
    activeInput.blur();
  }

  const cellText = cell.textContent.trim();

  const cellInput = document.createElement('input');

  cellInput.value = cellText;
  cellInput.className = 'cell-input';

  cell.textContent = '';
  cell.append(cellInput);
  cellInput.focus();

  const saveAndClose = () => {
    const newValue = cellInput.value.trim();

    cell.textContent = newValue === '' ? cellText : newValue;
  };

  cellInput.addEventListener('blur', saveAndClose, { once: true });

  cellInput.addEventListener('keydown', (kdownEvent) => {
    if (kdownEvent.key === 'Enter') {
      kdownEvent.preventDefault();
      cellInput.blur();
    }
  });
});

const addNewEmployeeForm = document.createElement('form');

addNewEmployeeForm.classList.add('new-employee-form');

addNewEmployeeForm.innerHTML = `<label>Name: <input name="name" type="text" required></label>
<label>Position: <input name="position" type="text" required></label>
<label>Office: <select name="office" required></select></label>
<label>Age: <input name="age" type="number" required></label>
<label>Salary: <input name="salary" type="number" required></label>
<button type='submit'>Save to table</button>`;

body.append(addNewEmployeeForm);

const inputList = addNewEmployeeForm.querySelectorAll('input');
const labelWSelect = addNewEmployeeForm.querySelector('select');

inputList[0].setAttribute('data-qa', 'name');
inputList[1].setAttribute('data-qa', 'position');
inputList[2].setAttribute('data-qa', 'age');
inputList[3].setAttribute('data-qa', 'salary');
labelWSelect.setAttribute('data-qa', 'office');

const items = [
  { text: 'Tokyo', value: 'Tokyo' },
  { text: 'Singapore', value: 'Singapore' },
  { text: 'London', value: 'London' },
  { text: 'New York', value: 'New York' },
  { text: 'Edinburgh', value: 'Edinburgh' },
  { text: 'San Francisco', value: 'San Francisco' },
];

items.forEach((option) => {
  labelWSelect.add(new Option(option.text, option.value));
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;
  message.setAttribute('data-qa', 'notification');

  message.innerHTML = `<h2 class="title">${title}</h2>
  <p>${description}</p>`;

  document.body.append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

const submitBtn = addNewEmployeeForm.querySelector('button');

submitBtn.addEventListener('click', (eventClick) => {
  eventClick.preventDefault();

  const formData = [...inputList].map((item) => item.value);
  const nameValue = formData[0];
  const ageValue = formData[2];

  const isFormValid =
    formData.every((item) => item.trim() !== '') &&
    labelWSelect.value.trim() !== '' &&
    nameValue.length >= 4 &&
    +ageValue >= 18 &&
    +ageValue <= 90;

  if (!isFormValid) {
    pushNotification(
      150,
      10,
      'Error, please fill the form correctly',
      'Message example.\n ' +
        'Notification should contain title and description.',
      'error',
    );

    return;
  }

  const strnToNum = +formData[3];

  formData[3] = `$${strnToNum.toLocaleString('en-US')}`;
  formData.splice(2, 0, labelWSelect.value);

  const newEmployee = document.createElement('tr');

  formData.forEach((data) => {
    const newTd = document.createElement('td');

    newTd.textContent = data;
    newEmployee.append(newTd);
  });

  tbody.append(newEmployee);

  pushNotification(
    10,
    10,
    'Success',
    'Message example.\n ' +
      'Notification should contain title and description.',
    'success',
  );
});
