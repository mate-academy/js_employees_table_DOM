'use strict';

// write code here
const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');
const titles = tHead.querySelectorAll('th');
const form = document.createElement('form');

function getRows() {
  return Array.from(document.querySelectorAll('tbody tr'));
}

const getNumber = (value) => {
  return +value.replaceAll(/[$,]/g, '');
};

const sortAsc = (content, index) => {
  return content.sort((a, b) => {
    const valA = a.children[index].textContent;
    const valB = b.children[index].textContent;

    if (!isNaN(getNumber(valA)) && !isNaN(getNumber(valB))) {
      return getNumber(valA) - getNumber(valB);
    } else {
      return valA.localeCompare(valB);
    }
  });
};

const sortDesc = (content, index) => {
  return content.sort((a, b) => {
    const valA = a.children[index].textContent;
    const valB = b.children[index].textContent;

    if (!isNaN(getNumber(valA)) && !isNaN(getNumber(valB))) {
      return getNumber(valB) - getNumber(valA);
    } else {
      return valB.localeCompare(valA);
    }
  });
};

let lastSortedIndex = null;
let counter = 1;

titles.forEach((title, index) => {
  title.addEventListener('click', () => {
    const rows = getRows();
    let sortedRows;

    if (lastSortedIndex === index && counter % 2 === 0) {
      sortedRows = sortDesc([...rows], index);
    } else {
      sortedRows = sortAsc([...rows], index);
    }

    counter++;

    sortedRows.forEach((row) => tBody.appendChild(row));

    lastSortedIndex = index;
  });
});

let previouslyActiveRow = null;

document.querySelector('tbody').addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row) {
    previouslyActiveRow?.classList.remove('active');
    row.classList.add('active');
    previouslyActiveRow = row;
  }
});

const addForm = () => {
  const fields = ['name', 'position', 'age', 'salary'];
  const selectOptions = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  form.classList.add('new-employee-form');
  form.setAttribute('novalidate', '');

  fields.forEach((nameField) => {
    const label = document.createElement('label');

    form.appendChild(label);
    label.textContent = nameField.charAt(0).toUpperCase() + nameField.slice(1);

    const input = document.createElement('input');

    if (nameField === 'age' || nameField === 'salary') {
      input.setAttribute('type', 'number');
    } else {
      input.setAttribute('type', 'text');
    }

    input.setAttribute('name', nameField);
    input.setAttribute('data-qa', nameField);

    label.append(input);
    input.required = true;
  });

  const createSelect = (nameField, options) => {
    const label = document.createElement('label');

    form.appendChild(label);
    label.textContent = nameField.charAt(0).toUpperCase() + nameField.slice(1);

    const select = document.createElement('select');

    select.setAttribute('name', nameField);
    select.setAttribute('data-qa', nameField);
    label.append(select);
    select.required = true;

    options.forEach((option, index) => {
      const optionEl = document.createElement('option');

      optionEl.setAttribute('value', option);
      optionEl.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      select.appendChild(optionEl);
    });
  };

  createSelect('office', selectOptions);

  const fieldsAll = form.querySelectorAll('input, textarea, select');

  fieldsAll.forEach((el) => (el.required = true));

  const createButton = (type, title) => {
    const button = document.createElement('button');

    button.setAttribute('type', type);
    button.textContent = title;
    form.appendChild(button);
  };

  createButton('submit', 'Save to table');

  table.after(form);
};

addForm();

const createNotification = (type, description) => {
  const existNtf = document.querySelector('[data-qa="notification"]');

  if (existNtf) {
    existNtf.remove();
  }

  if (type !== 'success' && type !== 'error') {
    throw new Error(`Invalid notification type: ${type}`);
  }

  const ntf = document.createElement('div');

  ntf.setAttribute('data-qa', 'notification');

  ntf.classList.add('notification');
  ntf.classList.add(type === 'success' ? 'success' : 'error');
  ntf.setAttribute('data-qa', 'notification');

  const ntfTitle = document.createElement('h2');

  ntfTitle.classList.add('title');
  ntfTitle.textContent = type === 'success' ? 'Success' : 'Error';
  ntf.appendChild(ntfTitle);

  const ntfDesc = document.createElement('div');

  ntfDesc.classList.add('description');
  ntfDesc.textContent = description;
  ntf.appendChild(ntfDesc);
  document.body.appendChild(ntf);
};

const checkValidation = (formEl) => {
  const nameInput = formEl.elements.name;
  const ageInput = formEl.elements.age;
  const positionInput = formEl.elements.position;

  if (nameInput.value.length < 4) {
    createNotification('error', 'The field "Name" has fewer than 4 letters');

    return false;
  }

  if (positionInput.value.length === 0) {
    createNotification('error', 'The field "Position" cannot be empty');

    return false;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    createNotification('error', 'Age must be between 18 and 90');

    return false;
  }

  createNotification('success', 'A new employee is added to the table');

  return true;
};

// actions by clicking form submit btn
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isCustomValid = checkValidation(form);

  if (isCustomValid === false) {
    return;
  }

  const formData = new FormData(form);
  const newRow = document.createElement('tr');

  tBody.appendChild(newRow);

  const titlesContent = [...titles].map((el) => el.textContent.toLowerCase());

  for (let i = 0; i < titlesContent.length; i++) {
    const newCell = document.createElement('td');

    newRow.appendChild(newCell);
  }

  for (const [nameField, value] of formData.entries()) {
    const newCells = newRow.querySelectorAll('td');

    titlesContent.forEach((el, index) => {
      if (el === nameField.toLocaleLowerCase()) {
        if (el === 'salary') {
          newCells[index].textContent =
            `$${Number(value).toLocaleString('en-US')}`;
          // newCells[index].textContent = `$${+value}`;
        } else {
          newCells[index].textContent = !isNaN(+value) ? +value : value;
        }
      }
    });
  }

  form.reset();
});

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');
  const columnIndex = cell.cellIndex;
  const columnName = titles[columnIndex].textContent.toLowerCase();

  if (!cell || cell.querySelector('input')) {
    return;
  }

  const existInput = document.querySelector('.cell-input');

  if (existInput) {
    existInput.blur();
  }

  const cellOriginalValue = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = cellOriginalValue;
  cell.appendChild(input);
  input.focus();

  const saveState = () => {
    const value = input.value;

    if (value === '') {
      cell.textContent = cellOriginalValue;
    } else {
      cell.textContent = value;
    }

    if (columnName === 'salary') {
      cell.textContent = `$${Number(value).toLocaleString('en-US')}`;
    }
  };

  input.addEventListener('blur', saveState);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      saveState();
    }
  });
});
