'use strict';

const body = document.querySelector('body');
const allPosts = document.querySelector('table');
const nameFilters = allPosts.rows[0];
const form = document.createElement('form');
const tContent = allPosts.querySelector('tbody');
const buttonElement = document.createElement('button');
const filterList = ['name', 'position', 'office', 'age', 'salary'];
const filterPositions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];
let sorted = false;
let lastElement;
let activeElement;

const sortedRows = [...nameFilters.cells];

const transformToName = (value) =>
  value.slice(0, 1).toUpperCase() + value.slice(1);

function sortASC(a, b) {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

function sortDESC(a, b) {
  if (a > b) {
    return -1;
  }

  if (a < b) {
    return 1;
  }

  return 0;
}

function showNotification(title, message, type) {
  const blockNotification = document.createElement('div');
  const titleNotification = document.createElement('h2');
  const messageNotification = document.createElement('p');

  blockNotification.classList.add('notification', type);
  titleNotification.classList.add('title');

  blockNotification.classList.add(type === 'success' ? 'success' : 'error');
  blockNotification.style.right = '10px';
  blockNotification.style.top = '10px';

  blockNotification.setAttribute('data-qa', 'notification');

  titleNotification.innerText = title;
  messageNotification.innerText = message.toString();

  blockNotification.appendChild(messageNotification);

  body.appendChild(blockNotification);

  window.setTimeout(() => {
    blockNotification.style.display = 'none';
  }, 3000);
}

buttonElement.textContent = 'Save to table';
buttonElement.type = 'submit';
form.appendChild(buttonElement);
form.classList.add('new-employee-form');

filterList.forEach((el) => {
  const label = document.createElement('label');
  const value = el.toString();
  let input = document.createElement('input');

  if (value === 'office') {
    input = document.createElement('select');

    filterPositions.forEach((position) => {
      const optionValue = new Option(
        transformToName(position.toString()),
        position,
      );

      input.appendChild(optionValue);
    });
  } else if (value === 'age' || value === 'salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.setAttribute('data-qa', value);
  input.setAttribute('name', value);

  label.textContent = transformToName(el) + ':';
  label.append(input);
  form.appendChild(label);
});

tContent.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  // Remove 'active' class from all rows
  tContent.querySelectorAll('tr').forEach((el) => {
    el.classList.remove('active');
  });

  // Add 'active' class to the clicked row
  row.classList.add('active');
});

sortedRows.forEach((el, index) => {
  el.addEventListener('click', () => {
    if (lastElement === el) {
      sorted = !sorted;
    } else {
      sorted = false;
      lastElement = el;
    }

    const rowsArray = Array.from(tContent.querySelectorAll('tr'));

    rowsArray.sort((a, b) => {
      let cellA = a.cells[index].textContent.trim();
      let cellB = b.cells[index].textContent.trim();

      cellA = cellA.includes('$')
        ? Number(cellA.replace('$', '').replace(',', ''))
        : cellA;

      cellB = cellB.includes('$')
        ? Number(cellB.replace('$', '').replace(',', ''))
        : cellB;

      return sorted ? sortDESC(cellA, cellB) : sortASC(cellA, cellB);
    });

    tContent.innerHTML = '';

    rowsArray.forEach((row) => tContent.appendChild(row));
  });
});

tContent.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const activeInput = tContent.querySelector('.cell-input');

  if (activeInput) {
    const prevCell = activeInput.parentElement;

    prevCell.textContent =
      activeElement.value === '' ? activeInput.defaultValue : activeInput.value;
  }

  const inputElement = document.createElement('input');

  const initialValue = cell.textContent;

  inputElement.classList.add('cell-input');

  inputElement.value = initialValue;

  inputElement.defaultValue = initialValue;

  cell.textContent = '';

  cell.appendChild(inputElement);

  inputElement.focus();

  const save = () => {
    cell.textContent =
      inputElement.value === '' ? initialValue : inputElement.value;
  };

  inputElement.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }

    if (ev.key === 'Escape') {
      cell.textContent = initialValue;
    }
  });

  inputElement.addEventListener('blur', save);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const nameValue = formData.get('name')?.trim();
  const positionValue = formData.get('position')?.trim();
  const officeValue = formData.get('office');
  const ageValue = Number(formData.get('age'));
  const salaryValue = formData.get('salary')?.trim();

  if (!nameValue || nameValue.length < 4) {
    showNotification(
      'Error: Name is too short',
      'Field "name" must be at least Minimum 4 characters',
      'error',
    );

    return;
  }

  if (!positionValue) {
    showNotification(
      'Error: Position is required',
      'Field "Position" cannot be empty',
      'error',
    );

    return;
  }

  if (!officeValue) {
    showNotification(
      'Error: Office is required',
      'Plese select office location',
      'error',
    );

    return;
  }

  if (Number.isNaN(ageValue) || ageValue < 18) {
    showNotification(
      'Error: Age is too low',
      'Field "age" must be a number and at least 18',
      'error',
    );

    return;
  }

  if (ageValue > 90) {
    showNotification(
      'Error: Age is too high',
      'Field "age" must be less than 90',
      'error',
    );

    return;
  }

  if (!salaryValue || isNaN(Number(salaryValue))) {
    showNotification(
      'Error: Salary is required',
      'Field "salary" must be a number',
      'error',
    );

    return;
  }

  const newRow = document.createElement('tr');

  filterList.forEach((el) => {
    const tableData = document.createElement('td');

    if (el === 'salary') {
      tableData.textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(formData.get(el));
    } else {
      tableData.textContent = formData.get(el);
    }

    newRow.appendChild(tableData);
  });

  tContent.appendChild(newRow);

  showNotification(
    'Employee added successfully',
    'All information was correct, data was added to the table',
    'success',
  );

  form.reset();
});

body.appendChild(form);
