'use strict';

const header = document.querySelector('thead');
const body = document.querySelector('tbody');
const notifTimeout = 3000;
const lengthName = 4;
const ageMin = 18;
const ageMax = 90;
const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

employeeForm.insertAdjacentHTML('afterbegin', `
    <label>Name:
      <input type="text" name="name" data-qa="name">
    </label>
    <label>Position:
      <input type="text" name="position" data-qa="position">
    </label>
    <label>Office:
      <select name="office" data-qa="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input type="number" name="age" data-qa="age">
    </label>
    <label>Salary:
      <input type="number" name="salary" data-qa="salary">
    </label>
    <button type="submit">Save to table</button>
`);

document.body.append(employeeForm);

let cIndex = -1;

header.addEventListener('click', (e) => {
  const target = e.target;
  const index = target.cellIndex;

  sortingTable(index, target.innerHTML, cIndex === index);

  cIndex = (cIndex === index) ? -1 : index;
});

function sortingTable(index, nameColumn, directSorting) {
  const sortTable = [...body.children];

  sortTable.sort((first, second) => {
    const a = first.children[index].innerHTML;
    const b = second.children[index].innerHTML;

    switch (nameColumn) {
      case 'Name':
      case 'Position':
      case 'Office':
        return a.localeCompare(b);

      case 'Age':
      case 'Salary':
        return toNumber(a) - toNumber(b);
    }
  });

  if (directSorting) {
    sortTable.reverse();
  }

  body.append(...sortTable);
};

function toNumber(string) {
  const res = string.includes('$')
    ? string.slice(1).split(',').join('')
    : string;

  return Number(res);
};

body.addEventListener('click', (e) => {
  [...body.children].forEach(row => {
    row.classList.remove('active');
  });

  e.target.parentElement.classList.add('active');
});

let isValid = false;

const startNotification = (title, description, type,
  possTop = 450, possRight = 250) => {
  const mainBody = document.querySelector('body');
  const blockNot = document.createElement('div');
  const headerNot = document.createElement('h2');
  const textNot = document.createElement('p');

  textNot.innerHTML = description;
  headerNot.innerHTML = title;
  blockNot.classList.add('notification', type);
  blockNot.setAttribute('data-qa', 'notification');
  headerNot.classList.add('header');

  blockNot.append(headerNot, textNot);
  mainBody.append(blockNot);

  headerNot.style.fontSize = '18px';
  blockNot.style.top = `${possTop}px`;
  blockNot.style.right = `${possRight}px`;

  setTimeout(() => blockNot.remove(), notifTimeout);
};

const onFocusInvalidForm = (field) => {
  employeeForm.children[field].firstElementChild
    .addEventListener('focus', (e) => {
      e.target.style.outlineColor = '#F00';
    });

  employeeForm.children[field].focus();
};

const validateForm = (data) => {
  if (data.get('name').length < lengthName
    || /\d/.test(data.get('name'))) {
    onFocusInvalidForm(0);

    startNotification(
      'Name is not correct',
      'Your name must have at least 4 letters and must not include numbers',
      'error',
    );

    isValid = false;
  } else if (data.get('office') === null) {
    onFocusInvalidForm(2);

    startNotification(
      'Office is not correct',
      'Please, select an option',
      'error',
    );

    isValid = false;
  } else if (data.get('position') === '') {
    onFocusInvalidForm(1);

    startNotification(
      'Position is not correct',
      'Position must not be empty',
      'error',
    );

    isValid = false;
  } else if (data.get('age') < ageMin || data.get('age') > ageMax) {
    onFocusInvalidForm(3);

    startNotification(
      'Age is not correct',
      `Your age cannot be less than ${ageMin} and more than ${ageMax}`,
      'error',
    );

    isValid = false;
  } else if (data.get('salary') === '' || data.get('salary') <= 0) {
    onFocusInvalidForm(4);

    startNotification(
      'Salary is not correct',
      'Salary must be greater than 0',
      'error',
    );

    isValid = false;
  } else {
    isValid = true;
  }
};

employeeForm.addEventListener('submit', (e) => {
  const data = new FormData(employeeForm);
  const numberToSalary = `$${Number(data.get('salary'))
    .toLocaleString('en-US')}`;

  e.preventDefault();
  validateForm(data);

  if (!isValid) {
    return;
  }

  const newRow = body.insertRow();

  newRow.insertCell(0).innerText = data.get('name');
  newRow.insertCell(1).innerText = data.get('position');
  newRow.insertCell(2).innerText = data.get('office');
  newRow.insertCell(3).innerText = data.get('age');
  newRow.insertCell(4).innerText = numberToSalary;

  employeeForm.reset();

  startNotification(
    'Validation success',
    'Employee was successfully added',
    'success',
  );
});

const indexCompare = [];
let validCell;
let isThereInput = false;

const changeOnInput = (e, prev) => {
  let cellWidth = getComputedStyle(e.target).width;

  switch (e.target.cellIndex) {
    case 0:
    case 1:
      e.target.innerHTML = `
        <input type="text" class="cell-input" placeholder="${prev}">
      `;
      break;

    case 2:
      e.target.innerHTML = `
        <select class="cell-input">
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      `;
      document.querySelector('select.cell-input').value = prev;
      break;

    case 3:
    case 4:
      if (!isThereInput) {
        e.target.innerHTML = `
          <input type="number" class="cell-input" placeholder="${prev}">
        `;
        cellWidth = `${parseFloat(cellWidth) + 30}px`;
        isThereInput = true;
      }
      break;
  }

  document.querySelector('.cell-input').style.width = cellWidth;
  e.target.firstElementChild.focus();
};

const editCells = (el, prev) => {
  const newText = el.target.firstElementChild.value;

  if (newText === '' || newText === '0') {
    el.target.innerHTML = prev;
  } else {
    el.target.cellIndex !== 4
      ? el.target.innerHTML = newText
      : el.target.innerHTML = `
        $${Number(newText).toLocaleString('en-US')}
    `;

    if (el.target.cellIndex !== 2) {
      startNotification(
        'Validation success',
        'Employee was successfully added',
        'success',
      );
    }
  }
};

const validateCells = (e) => {
  const input = document.querySelector('.cell-input');

  const getValidCells = () => {
    e.target.firstElementChild.focus();
    e.target.style.border = `2px solid #F00`;
    validCell = true;
  };

  validCell = false;

  if (!input.value.length) {
    return validCell;
  }

  if (e.target.cellIndex === 0) {
    if (input.value.length < 4 || /\d/.test(input.value)) {
      getValidCells();

      return startNotification(
        'Name is not correct',
        'Your name must have at least 4 letters and must not include numbers',
        'error',
      );
    }
  } else if (e.target.cellIndex === 3) {
    if (input.value < ageMin || input.value > ageMax) {
      getValidCells();

      return startNotification(
        'Age is not correct',
        `Your age cannot be less than ${ageMin} and more than ${ageMax}`,
        'error',
      );
    }
  } else if (e.target.cellIndex === 4) {
    if (input.value < 0) {
      getValidCells();

      return startNotification(
        'Salary is not correct',
        'Salary must be greater than 0',
        'error',
      );
    }
  } else {
    return validCell;
  }
};

const saveChangesOnTable = (e, prev) => {
  validateCells(e);

  if (!validCell) {
    e.target.style.border = 'none';
    indexCompare.length = 0;
    isThereInput = false;

    return editCells(e, prev);
  }
};

body.addEventListener('dblclick', (e) => {
  const targetCell = e.target.closest('td');

  if (!targetCell) {
    return;
  }

  const cellIndex = targetCell.cellIndex;

  indexCompare.push(cellIndex);

  if (indexCompare[0] !== cellIndex) {
    return startNotification(
      'Unfinished changes',
      'You cannot change another cell until this one is not finished',
      'error',
      580,
    );
  }

  const prevText = e.target.innerText;

  changeOnInput(e, prevText);

  const field = e.target.firstElementChild;

  field.addEventListener('blur', () => {
    saveChangesOnTable(e, prevText);
  });

  field.addEventListener('keyup', (ev) => {
    if (ev.key === 'Enter') {
      field.blur();
    }
  });
});
