'use strict';

const body = document.body;
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const ths = table.querySelectorAll('thead > tr > th');

const arrHead = ['name', 'position', 'office', 'age', 'salary'];

function addDataTittle() {
  const tableRow = tbody.children;

  [...tableRow].map(tr => {
    [...tr.children].forEach((td, index) => {
      td.dataset.nameIs = arrHead[index];
    });
  });
}

let rows;
const form = document.createElement('form');

body.append(form);

form.classList.add('new-employee-form');
form.setAttribute('action', '');
form.setAttribute('method', 'post');

ths.forEach(th => {
  const label = document.createElement('label');

  label.innerText = th.textContent + ':';

  if (th.textContent === 'Office') {
    const select = document.createElement('select');
    const offices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    select.name = th.textContent.toLowerCase();
    select.dataset.qa = th.textContent.toLowerCase();

    offices.forEach(city => {
      const option = document.createElement('option');

      option.innerText = city;
      select.append(option);
    });

    label.append(select);
  } else {
    const input = document.createElement('input');

    input.name = th.textContent.toLowerCase();
    input.dataset.qa = th.textContent.toLowerCase();

    switch (th.textContent) {
      case 'Age':
      case 'Salary':
        input.type = 'number';
        break;

      default:
        input.type = 'text';
    }

    label.append(input);
  };

  form.append(label);
});

const button = document.createElement('button');

button.textContent = 'Save to table';
button.setAttribute('type', 'submit');
form.append(button);

function pushNotification(title, description, type) {
  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  message.innerHTML = `
    <h2 class='title'>
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  body.append(message);
  setTimeout(() => message.remove(), 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  if (data.get('name').length < 4) {
    pushNotification(
      'Wrong data',
      'The name must have at least 4 letters.',
      'error'
    );

    return;
  };

  if (data.get('position').length < 4) {
    pushNotification(
      'Wrong data',
      'The position must have at least 4 letters.',
      'error'
    );

    return;
  };

  if (data.get('age') < 18 || data.get('age') > 90) {
    pushNotification(
      'Wrong age',
      'The age must be at least 18 and not more than 90 years.',
      'error'
    );

    return;
  };

  if (data.get('salary') <= 0) {
    pushNotification(
      'Wrong salary',
      'Wrong entered salary data.The sum must be greater than 0.',
      'error'
    );

    return;
  };

  pushNotification(
    'Successfully',
    'A new employee has been added to the table.',
    'success'
  );

  const newRow = document.createElement('tr');

  for (const [key, value] of data) {
    const newCell = document.createElement('td');

    if (key === 'salary') {
      newCell.textContent = `$${(+value).toLocaleString('en-US')}`;

      newRow.append(newCell);
    } else {
      newCell.textContent = value;
      newRow.append(newCell);
    };
  };

  tbody.append(newRow);
  addDataTittle();

  form.reset();
});

function sortTable(columnIndex, ascending) {
  const trs = tbody.querySelectorAll('tr');

  rows = [...trs];

  const order = ascending ? 1 : -1;

  rows.sort((a, b) => {
    const aValue = a.children[columnIndex].textContent.trim();
    const bValue = b.children[columnIndex].textContent.trim();

    if (columnIndex === ths.length - 1) {
      const aSalary = parseInt(aValue.replace(/[$,]/g, ''));
      const bSalary = parseInt(bValue.replace(/[$,]/g, ''));

      return aSalary > bSalary ? order : -order;
    }

    if (aValue === bValue) {
      return 0;
    }

    return aValue > bValue ? order : -order;
  });

  rows.forEach(row => tbody.appendChild(row));
}

ths.forEach((th, index) => {
  th.addEventListener('click', () => {
    const isAscending = th.classList.contains('asc');

    ths.forEach(thr => thr.classList.remove('asc', 'desc'));

    if (isAscending) {
      sortTable(index, false);
      th.classList.add('desc');
    } else {
      sortTable(index, true);
      th.classList.add('asc');
    }
  });
});

tbody.addEventListener('dblclick', (e) => {
  addDataTittle();

  const cell = e.target.closest('td');
  const nameIs = cell.dataset.nameIs;
  const input = document.createElement('input');
  const initialCellValue = cell.innerText;

  input.classList.add('cell-input');

  cell.firstChild.remove();
  cell.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    cellDataReplacement(cell, input, initialCellValue, nameIs);
  });

  input.addEventListener('keydown', (eventKey) => {
    if (eventKey.key !== 'Enter') {
      return;
    }

    cellDataReplacement(cell, input, initialCellValue, cell.dataset.nameIs);
  });
});

function cellDataReplacement(cell, input, initialCellValue) {
  if (input.value === '' || input.value === '$') {
    cell.innerText = initialCellValue;
  } else if (input.value.slice(0, 1) === '$') {
    const sum = input.value.slice(1).split(',').join('');

    cell.innerText = `$${(+sum).toLocaleString('en-US')}`;
  } else {
    cell.innerText = input.value;
  }

  input.remove();
};

function checkFill(cell, input, initialCellValue, nameIs = false) {
  if (nameIs) {
    if (input.value.trim() === '') {
      cell.innerText = initialCellValue;
    } else {
      cell.innerText = `$${parseInt(input.value).toLocaleString('en-US')}`;
    }
  } else {
    if (input.value.trim() === '') {
      cell.innerText = initialCellValue;
    } else {
      cell.innerText = input.value;
    }
  }
}

tbody.addEventListener('click', (e) => {
  const trs = document.querySelectorAll('tr');

  [...trs].some(el => el.classList.remove('active'));
  e.target.closest('tr').classList.add('active');
});
