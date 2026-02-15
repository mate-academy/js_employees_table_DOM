'use strict';

document.addEventListener('DOMContentLoaded', sort);
document.addEventListener('DOMContentLoaded', selectRow);
document.addEventListener('DOMContentLoaded', addForm);
document.addEventListener('DOMContentLoaded', enableTableEditing);

const sortingWay = {
  currentColumn: null,
  currentDirection: 'asc',
};
const formFields = [
  {
    fieldName: 'name',
    element: 'input',
    type: 'text',
  },
  {
    fieldName: 'position',
    element: 'input',
    type: 'text',
  },
  {
    fieldName: 'office',
    element: 'select',
    type: 'select',
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
    fieldName: 'age',
    element: 'input',
    type: 'number',
  },
  {
    fieldName: 'salary',
    element: 'input',
    type: 'number',
  },
];

function addForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  formFields.forEach((field) => {
    const label = document.createElement('label');

    label.textContent =
      field.fieldName[0].toUpperCase() + field.fieldName.substring(1) + ': ';

    const element = document.createElement(field.element);

    element.dataset.qa = field.fieldName;
    element.name = field.fieldName;

    if (field.element === 'select') {
      for (const option of field.options) {
        const optionElement = document.createElement('option');

        optionElement.value = option;
        optionElement.textContent = option;

        element.appendChild(optionElement);
      }
    } else {
      element.type = field.type;
    }

    element.required = true;
    label.appendChild(element);
    form.appendChild(label);
  });

  const button = document.createElement('button');

  button.textContent = 'Save to table';
  button.type = 'submit';

  form.appendChild(button);
  form.addEventListener('submit', handleFormEvent);

  document.body.appendChild(form);
}

function selectRow() {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const tBody = table.tBodies[0];

  if (!tBody) {
    return;
  }

  tBody.addEventListener('click', (e) => {
    const chosenRow = e.target.closest('tr');

    if (!chosenRow) {
      return;
    }

    chosenRow.classList.add('active');

    [...tBody.rows]
      .filter((value) => value !== chosenRow)
      .forEach((row) => {
        row.classList.remove('active');
      });
  });
}

function sort() {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const tHeader = table.tHead;
  const tBody = table.tBodies[0];

  if (!tHeader || !tBody) {
    return;
  }

  tHeader.addEventListener('click', (e) => {
    const chosenHeader = e.target.closest('th');

    if (!chosenHeader) {
      return;
    }

    const allHeaders = tHeader.querySelectorAll('th');

    const index = [...allHeaders].indexOf(chosenHeader);
    const allRows = tBody.rows;

    toogleSorting(index);

    const rows = [...allRows].sort((a, b) => {
      return sortingWay.currentDirection === 'asc'
        ? sortAsc(a, b, index)
        : sortDesc(a, b, index);
    });

    rows.forEach((row) => tBody.append(row));
  });
}

function sortAsc(a, b, index) {
  const cellA = a.cells[index].textContent.trim();
  const cellB = b.cells[index].textContent.trim();

  const numA = cellA.replace(/[^0-9.-]/g, '');
  const numB = cellB.replace(/[^0-9.-]/g, '');

  if (numA !== '' && numB !== '') {
    return Number(numA) - Number(numB);
  }

  return cellA.localeCompare(cellB);
}

function sortDesc(a, b, index) {
  const cellA = a.cells[index].textContent.trim();
  const cellB = b.cells[index].textContent.trim();

  const numA = cellA.replace(/[^0-9.-]/g, '');
  const numB = cellB.replace(/[^0-9.-]/g, '');

  if (numA !== '' && numB !== '') {
    return Number(numB) - Number(numA);
  }

  return cellB.localeCompare(cellA);
}

function toogleSorting(index) {
  if (sortingWay.currentColumn === index) {
    const sortWay = sortingWay.currentDirection === 'asc' ? 'desc' : 'asc';

    sortingWay.currentDirection = sortWay;
  } else {
    sortingWay.currentColumn = index;
    sortingWay.currentDirection = 'asc';
  }
}

function handleFormEvent(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const tBody = table.tBodies[0];

  if (!tBody) {
    return;
  }

  const entries = Object.fromEntries(formData.entries());
  const isValid = validateData(entries);

  if (!isValid) {
    return;
  }

  const row = tBody.insertRow(-1);

  for (let i = 0; i < 5; i++) {
    const cell = row.insertCell(i);
    const key = Object.keys(entries)[i];

    if (key === 'salary') {
      cell.textContent = '$' + Number(entries[key]).toLocaleString('en-US');
    } else {
      cell.textContent = entries[key];
    }
  }

  e.target.reset();

  pushNotification(
    10,
    10,
    'User created',
    'User created successfully',
    'success',
  );
}

function validateData(obj) {
  for (const field in obj) {
    if (!obj[field]) {
      pushNotification(
        10,
        10,
        `${field} is empty`,
        'Please fill all fields',
        'error',
      );

      return false;
    }
  }

  if (obj.name.length < 4) {
    pushNotification(
      10,
      10,
      'Name length is Incorrect',
      'Please use name which has more than 4 digits',
      'error',
    );

    return false;
  }

  const ageRaw = obj.age.trim();
  const isValidAge = /^\d+$/.test(ageRaw);
  const age = Number(obj.age.replace(/\D+/g, ''));

  if (!isValidAge || age < 18 || age > 90) {
    pushNotification(
      10,
      10,
      'Age is Incorrect',
      'Please enter age between: 18 and 90 years',
      'error',
    );

    return false;
  }

  const salaryRaw = obj.salary.trim();
  const isValidSalary = /^\d+$/.test(salaryRaw);

  if (!isValidSalary) {
    pushNotification(
      10,
      10,
      'Salary is Incorrect',
      'Please enter correct number',
      'error',
    );

    return false;
  }

  return true;
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';

  const h2 = document.createElement('h2');

  h2.textContent = title;
  h2.classList.add('title');

  const descriptionBlock = document.createElement('p');

  descriptionBlock.textContent = description;

  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  message.append(h2, descriptionBlock);

  document.querySelector('body').append(message);

  setTimeout(() => {
    message.style.display = 'none';
  }, 2000);
};

function enableTableEditing() {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  const tBody = table.tBodies[0];

  if (!tBody) {
    return;
  }

  let activeCell = null;
  let activeInput = null;

  function closeEditor(save = true, oldValue) {
    if (!activeCell || !activeInput) {
      return;
    }

    const newValue = activeInput.value.trim();
    activeInput.classList.remove('cell-input');

    if (save && newValue) {
      activeCell.textContent = newValue;
    } else {
      activeCell.textContent = oldValue;
    }
    
    activeCell = null;
    activeInput = null;
  }

  function openEditor(cell) {
    if (activeCell === cell) {
      return;
    }

    closeEditor(true);

    activeCell = cell;

    const value = cell.textContent;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = value;
    input.classList.add('cell-input')

    activeInput = input;

    cell.textContent = '';
    cell.appendChild(input);

    input.focus();
    input.select();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        closeEditor(true, value);
      }
    });

    input.addEventListener('blur', () => closeEditor(true, value));
  }

  tBody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    openEditor(cell);
  });
}
