'use strict';

const tableBody = document.querySelector('tbody');
const tableHead = document.querySelector('thead');
const rows = [...tableBody.rows];

// Sorting table

let typeOfSort = 'DESC';
let sortPrevTarget;

function sortTable(sortIndex, array, type) {
  const text = rows[0].cells[sortIndex].innerText;

  const getSortedRow = (a, b) => {
    if (!isNaN(Number(text))) {
      return a.cells[sortIndex].innerText - b.cells[sortIndex].innerText;
    };

    if (text[0] === '$') {
      return convertToNumber(a.cells[sortIndex].innerText)
        - convertToNumber(b.cells[sortIndex].innerText);
    };

    return a.cells[sortIndex].innerText
      .localeCompare(b.cells[sortIndex].innerText);
  };

  const sortedRow = type === 'ASC'
    ? array.sort((rowA, rowB) => getSortedRow(rowA, rowB))
    : array.sort((rowA, rowB) => getSortedRow(rowB, rowA));

  tableBody.append(...sortedRow);
};

tableHead.addEventListener('click', (e) => {
  const indexForSorting = [...tableHead.rows[0].cells].indexOf(e.target);

  if (typeOfSort === 'DESC' || sortPrevTarget !== e.target) {
    sortTable(indexForSorting, [...tableBody.rows], 'ASC');
    typeOfSort = 'ASC';
  } else {
    sortTable(indexForSorting, [...tableBody.rows], 'DESC');
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

function createInput(nameOfInput, type) {
  const formInputTitle = document.createElement('label');
  const formInput = document.createElement('input');

  formInputTitle.innerText = nameOfInput[0]
    .toUpperCase() + nameOfInput.slice(1) + ':';
  formInput.name = nameOfInput;
  formInput.type = type;
  formInput.required = true;

  formInput.setAttribute('data-qa', nameOfInput);

  formInputTitle.append(formInput);

  return formInputTitle;
}

function createSelect(nameOfSelect, options) {
  const formInputTitle = document.createElement('label');
  const formSelect = document.createElement('select');

  formSelect.name = nameOfSelect;

  formInputTitle.innerText = nameOfSelect[0]
    .toUpperCase() + nameOfSelect.slice(1) + ':';

  options.forEach(option => {
    const selectOption = document.createElement('option');

    selectOption.value = option;
    selectOption.innerText = option;

    formSelect.append(selectOption);
  });

  formSelect.required = true;
  formSelect.setAttribute('data-qa', nameOfSelect);

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

function constructForm(fieldsOfForm, className) {
  const newForm = document.createElement('form');

  newForm.className = className;

  fieldsOfForm.forEach(formField => {
    newForm.append(formField);
  });

  return newForm;
}

const form = constructForm(formFields, 'new-employee-form');

document.body.append(form);

// Notifications

const pushNotification = (
  title,
  description,
  type,
  posTop = 10,
  posRight = 10,
) => {
  const oldNotification = document.querySelector('.notification');

  if (oldNotification) {
    oldNotification.style.display = 'none';
  };

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

  const nameValue = inputName.firstElementChild.value;
  const ageValue = inputAge.firstElementChild.value;
  const positionValue = inputPosition.firstElementChild.value;
  const salaryValue = inputSalary.firstElementChild.value;

  if (nameValue.length < 4) {
    pushNotification(
      'Name input error',
      'The Name field contain more than three letters.',
      'error'
    );

    e.valid = false;

    return;
  };

  if (ageValue < 18 || ageValue > 90) {
    pushNotification('Age input error',
      'The age of the employee must be between 18 and 90.', 'error'
    );

    e.valid = false;

    return;
  };

  if (positionValue.length < 4) {
    pushNotification('Position input error',
      'The Position field contain more than three letters.',
      'error'
    );

    e.valid = false;

    return;
  };

  if (!salaryValue.length) {
    pushNotification(
      'Salary input error',
      'The Salary field must contain the employee actual salary.',
      'error'
    );

    e.valid = false;

    return;
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

    pushNotification(
      'Data saved successfully',
      'The entered data has been successfully entered into the table.',
      'success'
    );

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
};

//  Editing of table cells by double-clicking on it

let index = -1;
let cellOldText;

tableBody.addEventListener('dblclick', e => {
  const cell = e.target;
  const cellPadding = getComputedStyle(cell).padding;

  const row = e.target.closest('tr');

  index = [...row.children].indexOf(e.target);
  cellOldText = cell.innerText;

  let cellInput = document.createElement('input');

  if (index === 2) {
    cellInput = document.createElement('select');

    cityesOfOffice.forEach(option => {
      const selectOption = document.createElement('option');

      selectOption.value = option;
      selectOption.innerText = option;

      cellInput.append(selectOption);

      cellInput.value = cellOldText;
    });
  } else {
    cellInput.type = index === 3 || index === 4 ? 'number' : 'text';
  }

  cellInput.style.width = `
    ${cell.offsetWidth - (parseFloat(cellPadding) * 2)}px
  `;
  cellInput.className = 'cell-input';

  cellInput.name = 'cellEdit';
  cellOldText = cell.innerText;

  if (cell.innerText.includes('$')) {
    cell.innerText = '$';
    cellInput.value = convertToNumber(cellOldText);
  } else {
    cell.innerText = '';
    cellInput.value = cellOldText;
  }

  cell.append(cellInput);
  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    switch (index) {
      case 0:
        if (cellInput.value.trim().length < 4) {
          pushNotification(
            'Name input error',
            'The Name field contain more than three letters.',
            'error'
          );

          cell.innerText = cellOldText;

          return;
        };

        cell.innerText = cellInput.value;
        break;

      case 1:
        if (cellInput.value.trim().length < 4) {
          pushNotification(
            'Position input error',
            'The Position field contain more than three letters.',
            'error'
          );

          cell.innerText = cellOldText;

          return;
        };

        cell.innerText = cellInput.value;
        break;

      case 3:
        if (cellInput.value < 18 || cellInput.value > 90) {
          pushNotification(
            'Age input error',
            'The age of the employee must be between 18 and 90.',
            'error'
          );

          cell.innerText = cellOldText;

          return;
        };

        cell.innerText = cellInput.value;
        break;

      case 4:
        if (!cellInput.value.length) {
          pushNotification(
            'Salary input error',
            'The Salary field must contain the employee actual salary.',
            'error'
          );
          cell.innerText = cellOldText;

          return;
        };

        cell.innerText = `$${Number(cellInput.value).toLocaleString('En-en')}`;

        break;

      default:
        if (cell.innerText.includes('$')) {
          cell.innerText = `$${Number(cellInput.value)
            .toLocaleString('En-en')}`;
          break;
        }
        cell.innerText = cellInput.value;
        break;
    };

    cellInput.remove();
  });

  cellInput.addEventListener('keydown', (ek) => {
    if (ek.key !== 'Enter') {
      return;
    }

    cellInput.blur();
  });
});
