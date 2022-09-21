'use strict';

const table = document.getElementsByTagName('table')[0];
let countClick = 0;

createForm();

const form = document.querySelector('form');
const boxNotification = document.createElement('div');

createNotification(boxNotification);

table.addEventListener('click', (evt) => {
  const targetHeadline = evt.target.closest('th');
  const tBodyRow = evt.target.closest('tr');
  const targetCell = evt.target;
  const targetRow = table.tBodies[0].contains(tBodyRow);

  if (targetHeadline) {
    sortTable(targetHeadline);
  }

  if (targetRow) {
    if (table.querySelector('.active')) {
      document.querySelector('.active').classList.remove('active');
    }
    tBodyRow.classList.add('active');

    if (targetCell.dataset.canEditing === '0') {
      const cellInput = document.createElement('input');

      cellInput.dataset.oldValue = targetCell.textContent;
      cellInput.classList.add('cell-input');
      targetCell.textContent = '';
      targetCell.insertAdjacentElement('afterbegin', cellInput);
      cellInput.focus();
      targetCell.removeAttribute('data-can-editing');

      return;
    }
    targetCell.dataset.canEditing = '0';
  }
});

table.addEventListener('keydown', (evt) => {
  const targetfocusInput
    = document.activeElement === document
      .getElementsByClassName('cell-input')[0];

  if (targetfocusInput && evt.code === 'Enter') {
    saveInfoINCell(evt);
  }
});

table.addEventListener('blur', (evt) => {
  saveInfoINCell(evt);
}, true);

form.addEventListener('click', (evt) => {
  boxNotification.style.display = 'none';
  boxNotification.className = 'error';

  evt.preventDefault();

  if (evt.target.closest('button')) {
    validAddEmployee();
  }
});

function saveInfoINCell(evt) {
  const cell = evt.target.closest('td');
  const input = evt.target;

  if (table.tBodies[0].contains(cell)) {
    cell.textContent = evt.target.value;

    if (input.value === '') {
      cell.textContent = input.dataset.oldValue;
    }
    input.remove();
  }
};

function validAddEmployee() {
  const data = new FormData(form);
  const arrForm = Array.from(data.entries());

  for (let i = 0; i < arrForm.length; i++) {
    const emplyInput = arrForm[i][1] === '';
    const notValidName = arrForm[i][0] === 'name'
      && arrForm[i][1].length < 4;
    const notValidAge = (arrForm[i][0] === 'age'
      && (Number(arrForm[i][1]) < 18
      || Number(arrForm[i][1]) > 90));

    switch (true) {
      case emplyInput:
        boxNotification.style.display = 'block';

        boxNotification.textContent = `
          All fields are required!
        `;
        boxNotification.style.top = `${6 + 32 * i}` + 'px';
        boxNotification.style.width = 'max-content';
        boxNotification.style.lineHeight = '50px';
        boxNotification.className = 'error';

        return;
      case notValidName:
        boxNotification.style.display = 'block';
        boxNotification.style.lineHeight = '25px';
        boxNotification.style.top = '6px';
        boxNotification.style.width = '350px';
        boxNotification.className = 'error';

        boxNotification.textContent = `
          Name value has less than 4 letters!
          The first letter must be in upper case!
        `;

        return;
      case notValidAge:
        boxNotification.style.display = 'block';
        boxNotification.style.top = '106px';
        boxNotification.style.width = 'max-content';
        boxNotification.style.lineHeight = '50px';
        boxNotification.className = 'error';

        boxNotification.textContent = `
          Age value is less than 18 or more than 90!
        `;

        return;
      default:
        break;
    }
  }

  const rowEmployee = document.createElement('tr');

  rowEmployee.dataset.qa = arrForm[0][1];

  rowEmployee.insertAdjacentHTML('afterbegin', `
    <td>${arrForm[0][1]}</td>
    <td>${arrForm[1][1]}</td>
    <td>${arrForm[2][1]}</td>
    <td>${arrForm[3][1]}</td>
    <td>$${getStringTable(arrForm[4][1])}</td>
  `);

  table.tBodies[0]
    .insertAdjacentElement('afterbegin', rowEmployee);
  boxNotification.style.display = 'block';

  boxNotification.textContent = `
    Congratulations! Employee added!
  `;
  boxNotification.style.top = '188px';
  boxNotification.className = 'success';
};

function getStringTable(number) {
  const numberWithSeperator = (number / 1000).toFixed(3);

  return String(numberWithSeperator).split('.').join(',');
};

function getNumber(str) {
  return Number(str.split('$')[1].split(',').join(''));
};

function sortTable(targetHeadline) {
  const arrTBody = Array.from(table.rows).slice(1, -1);

  arrTBody.sort((prevRow, currentRow) => {
    const index = [].indexOf
      .call(targetHeadline.parentNode.children, targetHeadline);
    const prev = prevRow.cells[index].textContent;
    const current = currentRow.cells[index].textContent;

    switch (index) {
      case 3:
        return Number(prev) - Number(current);
      case 4:

        return getNumber(prev) - getNumber(current);

      default:
        if (prev === current) {
          return 0;
        }

        if (prev > current) {
          return 1;
        }

        return -1;
    }
  });

  if (countClick === 1) {
    arrTBody.reverse().forEach(row => {
      row.remove();
      table.children[1].append(row);
    });

    countClick = 0;

    return;
  }

  arrTBody.forEach(row => {
    row.remove();
    table.children[1].append(row);
  });
  countClick = 1;
};

function createNotification() {
  boxNotification.dataset.qa = 'notification';
  boxNotification.style.width = 'max-content';
  boxNotification.style.height = '50px';
  boxNotification.style.borderRadius = '25px';
  boxNotification.style.lineHeight = '50px';
  boxNotification.style.textAlign = 'center';
  boxNotification.style.padding = '10px';
  boxNotification.style.position = 'absolute';
  boxNotification.style.left = '100%';
  boxNotification.style.backgroundColor = '#fff';

  document.getElementsByTagName('form')[0]
    .insertAdjacentElement('afterbegin', boxNotification);

  boxNotification.style.display = 'none';
};

function createForm() {
  table.insertAdjacentHTML('afterend', `
  <form class = "new-employee-form" method="GET" action="/">
    <label>
      Name:
      <input name="name" 
        type="text" data-qa="name"
        required
      >
    </label>
    <label>
      Position:
      <input name="position" type="text" data-qa="position" required>
    </label>
    <label>
    Office:
      <select name="office" type="text" data-qa="office"></select required>
    </label>
    <label>
      Age: 
      <input name="age" type="number" data-qa="age" required>
    </label>
    <label>
      Salary: 
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit">
      Save to table
    </button>
  </form>`);

  const select = document.querySelector('select');
  const arrListSelect = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  for (const option of arrListSelect) {
    select.insertAdjacentHTML('afterbegin', `
      <option>
        ${option}
      </option>`);
  }
};
