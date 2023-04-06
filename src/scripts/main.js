'use strict';

const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');
const rows = [...tableBody.rows];

// Sorting table

let typeOfSort = 'DESC';
let sortPrevTarget;

function sortTable(index, array, type) {
  const text = rows[0].cells[index].innerText;

  const sortedRow = type === 'ASC'
    ? array.sort((rowA, rowB) => {
      if (!isNaN(Number(text))) {
        return rowA.cells[index].innerText - rowB.cells[index].innerText;
      };

      if (text[0] === '$') {
        return convertToNumber(rowA.cells[index].innerText)
          - convertToNumber(rowB.cells[index].innerText);
      };

      return rowA.cells[index].innerText
        .localeCompare(rowB.cells[index].innerText);
    })
    : array.sort((rowB, rowA) => {
      if (!isNaN(Number(text))) {
        return rowA.cells[index].innerText - rowB.cells[index].innerText;
      };

      if (text[0] === '$') {
        return convertToNumber(rowA.cells[index].innerText)
        - convertToNumber(rowB.cells[index].innerText);
      };

      return rowA.cells[index].innerText
        .localeCompare(rowB.cells[index].innerText);
    });

  tableBody.append(...sortedRow);
}

tableHead.addEventListener('click', (e) => {
  const index = [...tableHead.rows[0].cells].indexOf(e.target);

  if (typeOfSort === 'DESC' || sortPrevTarget !== e.target) {
    sortTable(index, [...tableBody.rows], 'ASC');
    typeOfSort = 'ASC';
  } else {
    sortTable(index, [...tableBody.rows], 'DESC');
    typeOfSort = 'DESC';
  };

  sortPrevTarget = e.target;
});

function convertToNumber(string) {
  return +string.slice(1).split(',').join('');
};

// Selected Row

let selectedElement;

tableBody.addEventListener('click', (e) => {
  const row = e.target.parentElement;

  if (!selectedElement) {
    row.classList.add('active');
    selectedElement = row;
  } else if (selectedElement !== row) {
    selectedElement.classList.remove('active');

    row.classList.add('active');
    selectedElement = row;
  };
});

// AddForm Script

const cityesOfOffice = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

// eslint-disable-next-line no-shadow
function createInput(name, type) {
  const formInputTitle = document.createElement('label');
  const formInput = document.createElement('input');

  formInputTitle.innerText = name[0].toUpperCase() + name.slice(1) + ':';
  formInput.name = name;
  formInput.type = type;
  formInput.required = true;

  formInput.setAttribute('data-qa', name);

  formInputTitle.append(formInput);

  return formInputTitle;
}

// eslint-disable-next-line no-shadow
function createSelect(name, options) {
  const formInputTitle = document.createElement('label');
  const formSelect = document.createElement('select');

  formSelect.name = name;

  formInputTitle.innerText = name[0].toUpperCase() + name.slice(1) + ':';

  options.forEach(option => {
    const selectOption = document.createElement('option');

    selectOption.value = option;
    selectOption.innerText = option;

    formSelect.append(selectOption);
  });

  formSelect.required = true;
  formSelect.setAttribute('data-qa', name);

  formInputTitle.append(formSelect);

  return formInputTitle;
}

const inputName = createInput('name', 'text');
const inputPosition = createInput('position', 'text');
const inputAge = createInput('age', 'number');
const inputSalary = createInput('salary', 'number');
const selectOffice = createSelect('office', cityesOfOffice);
const buttonSumbit = document.createElement('button');

buttonSumbit.type = 'submit';
buttonSumbit.innerText = 'Save to table';

const formFields = [
  inputName,
  inputPosition,
  selectOffice,
  inputAge,
  inputSalary,
  buttonSumbit,
];

// eslint-disable-next-line no-shadow
function constructForm(formFields, className) {
  const newForm = document.createElement('form');

  newForm.className = className;

  formFields.forEach(formField => {
    newForm.append(formField);
  });

  return newForm;
}

const form = constructForm(formFields, 'new-employee-form');

document.body.append(form);

// Notifications

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', `${type}`);
  notification.style.boxSizing = 'unset';
  notification.style.right = `${posRight}px`;
  notification.style.top = `${posTop}px`;

  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notificationTitle.className = 'title';
  notificationTitle.innerText = `${title}`;
  notificationDescription.innerText = `${description}`;

  notification.append(notificationTitle, notificationDescription);

  document.body.append(notification);

  const removeNotification = () => {
    notification.remove();
  };

  setTimeout(removeNotification, 3000);
};

// Form validation

buttonSumbit.addEventListener('click', e => {
  e.preventDefault();
  e.valid = true;

  if (inputName.firstElementChild.value.length < 4) {
    pushNotification(10, 10, 'Name input error',
      'The Name field\n '
    + 'contain more than three letters.', 'error');
    e.valid = false;
  };

  if (inputAge.firstElementChild.value < 18
    || inputAge.firstElementChild.value > 90) {
    pushNotification(140, 10, 'Age input error',
      'The age of the employee\n '
    + 'must be between 18 and 90.', 'error');
    e.valid = false;
  };

  if (inputPosition.firstElementChild.value.length < 4) {
    pushNotification(270, 10, 'Position input error',
      'The Position field\n '
    + 'contain more than three letters.', 'error');
    e.valid = false;
  };

  if (!inputSalary.firstElementChild.value.length) {
    pushNotification(400, 10, 'Salary input error',
      'The Salary field\n '
    + 'must contain the employee actual salary.', 'error');
    e.valid = false;
  };

  if (e.valid === true) {
    const fieldsOfForm = [...document.querySelectorAll('label')];
    const employeeData = {};

    fieldsOfForm.forEach(field => {
      const input = field.firstElementChild;

      employeeData[input.name] = input.value;
    });

    employeeData.salary = '$' + Number(employeeData.salary)
      .toLocaleString('En-en');

    const newEmployee = createRow(employeeData);

    tableBody.append(newEmployee);

    pushNotification(10, 10, 'Data saved successfully',
      'The entered data\n '
      + 'has been successfully entered into the table.', 'success');

    form.reset();
  };
});

function createRow(employee) {
  const row = document.createElement('tr');

  for (const key in employee) {
    const cell = document.createElement('td');

    cell.innerText = employee[key];

    row.append(cell);
  }

  return row;
}

//  Editing of table cells by double-clicking on it

let editableCell = false;
let cellOldText;

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const cellPadding = getComputedStyle(cell).padding;

  if (!editableCell) {
    editableCell = true;

    const cellInput = document.createElement('input');

    cellInput.className = 'cell-input';

    cellInput.style.width = `
    ${cell.offsetWidth - (parseFloat(cellPadding) * 2)}px
    `;

    cellInput.type = 'text';
    cellInput.name = 'cellEdit';
    cellOldText = cell.innerText;

    if (cell.innerText.includes('$')) {
      cell.innerText = '$';
      cellInput.type = 'number';
    } else {
      cell.innerText = '';
    }

    cell.append(cellInput);
    cellInput.focus();
  }
});

document.addEventListener('click', (e) => {
  if (e.target === document.querySelector('.cell-input')) {
    return;
  }

  if (editableCell) {
    const cellInput = document.querySelector('.cell-input');
    const cell = cellInput.closest('td');

    const newText = (cellInput.value.length) ? cellInput.value : cellOldText;

    if (cellInput.type === 'number' && cell.innerText.includes('$')) {
      cell.innerText = (cellInput.value.length)
        ? `$${Number(newText).toLocaleString('En-en')}`
        : cellOldText;
    } else {
      cell.innerText = newText;
    }

    cellInput.remove();
    editableCell = false;
  }
});

document.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') {
    return;
  };

  if (editableCell) {
    const cellInput = document.querySelector('.cell-input');
    const cell = cellInput.closest('td');

    const newText = (cellInput.value.length) ? cellInput.value : cellOldText;

    if (cellInput.type === 'number' && cell.innerText.includes('$')) {
      cell.innerText = (cellInput.value.length)
        ? `$${Number(newText).toLocaleString('En-en')}`
        : cellOldText;
    } else {
      cell.innerText = newText;
    };

    cellInput.remove();
    editableCell = false;
  };
});
