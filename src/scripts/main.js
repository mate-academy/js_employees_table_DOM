'use strict';
/* => */
/* ============== GLOBAL VARIABLES ============== */
/* <= */

const page = document.querySelector('body');
const employeesTable = document.querySelector('table');
const employeesTableList = employeesTable.querySelector('tbody');
const tableContainer = document.createElement('div');

tableContainer.style.display = 'flex';

page.append(tableContainer);
tableContainer.append(employeesTable);

/* => */
/* ============== EMPLOYEE FORM CREATION ============== */
/* <= */

tableContainer.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
  <label>Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position">
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
    <input name="age" type="number" data-qa="age">
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
  </form>
`);

const employeeForm = document.querySelector('.new-employee-form');
const employeeFormFields = [...employeeForm.querySelectorAll('input, select')];

/* => */
/* ============== NOTIFICATION CONTAINER CREATION ============== */
/* <= */

const { bottom, right, width } = employeeForm.getBoundingClientRect();

tableContainer.insertAdjacentHTML('afterbegin', `
  <div class="notifications" style="
    position: absolute;
    top: ${bottom + 24}px;
    left: ${right - width}px;
    display: grid;
    justify-items: end;
    gap: 24px;
  "></div>
`);

/* => */
/* ============== PUSH NOTIFICATION CLASS ============== */
/* <= */

class ValidationError extends Error {
  constructor(title, description, type) {
    super(...arguments);
    this.title = title;
    this.description = description;
    this.type = type;
  }
}

class Notifications {
  constructor(title, description, type) {
    this.title = title;
    this.description = description;
    this.type = type;
  }

  show() {
    const notificationsContainer = document.querySelector('.notifications');

    notificationsContainer.insertAdjacentHTML('afterbegin', `
      <div class="notification ${this.type}" data-qa="notification">
          <h2 class="title">${this.title}</h2>
          <p>${this.description}</p>
      </div>
    `);

    const message = document.querySelector('.notification');

    message.style.top = '0px';
    message.style.left = '0px';
    message.style.position = 'static';

    setTimeout(() => message.remove(), 3000);
  }
}

/* => */
/* ============== INPUTS ENTRIES VALIDATION ============== */
/* <= */

function checkUserEntries(entries) {
  const specification = {
    'name': {
      rules: (value) => value.length < 4,
      description: 'Name must contain at least 4 letters',
    },
    'age': {
      rules: (value) => value < 18 || value > 90,
      description: 'Age must be at least 18 and not more than 90 years old',
    },
  };

  for (const entry of entries) {
    const { name: title, value } = entry;

    if (value === '' || !value.trim()) {
      throw new ValidationError(
        `Incorrect ${title}!`,
        `The ${title} cannot be empty.`,
        'error'
      );
    }

    if (value.trim() !== value) {
      throw new ValidationError(
        `Incorrect ${title}!`,
        `The ${title} cannot contain spaces at the beginning or at the end.`,
        'error'
      );
    }

    if (specification[title] && specification[title].rules(value)) {
      throw new ValidationError(
        `Incorrect ${title}!`,
        `${specification[title].description}.`,
        'error'
      );
    }
  }
}

/* => */
/* ============== SENDING NEW EMPLOYEE ============== */
/* <= */

function sendingNewEmployee() {
  employeeForm.addEventListener('submit', e => {
    e.preventDefault();

    try {
      checkUserEntries(employeeFormFields);
      addingNewEmployee(employeeFormFields);
      e.target.reset();

      new Notifications(
        'Successful!',
        'New employee has been added.',
        'success'
      ).show();
    } catch (error) {
      new Notifications(error.title, error.description, error.type).show();
    }
  });
}

sendingNewEmployee();

/* => */
/* ============== ADDING NEW EMPLOYEE ============== */
/* <= */

function addingNewEmployee(inputs) {
  const row = employeesTableList.insertRow();

  inputs.forEach(({ name: type, value }) => {
    const cell = row.insertCell();

    cell.addEventListener('dblclick', editingTableCells);
    cell.append(normalize(type, value));
  });
}

/* => */
/* ============== EDITING EMPLOYEE ============== */
/* <= */

[...document.querySelectorAll('td')].forEach(cell => {
  cell.addEventListener('dblclick', editingTableCells);
});

function editingTableCells() {
  if (document.activeElement instanceof HTMLInputElement) {
    return;
  }

  const input = employeeFormFields[this.cellIndex].cloneNode(true);
  const previousCellValue = this.innerHTML;
  const cell = this;

  this.parentNode.classList.add('editing');
  this.parentNode.classList.remove('active');
  input.style.width = `${parseInt(getComputedStyle(this).width)}px`;
  input.classList.add('cell-input');

  input.value = normalize(input.name, previousCellValue);

  this.innerHTML = '';
  this.append(input);
  input.focus();

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      this.blur();
    }
  });

  input.addEventListener('blur', function() {
    if (!this.value) {
      this.value = normalize(this.name, previousCellValue);
    }

    try {
      checkUserEntries([this]);
      cell.parentNode.classList.remove('editing');
      cell.innerHTML = normalize(this.name, this.value);
      cell.addEventListener('dblclick', editingTableCells);

      new Notifications(
        'Successful!',
        `Employee ${this.name} has been successfully changed.`,
        'success'
      ).show();
    } catch (error) {
      new Notifications(error.title, error.description, error.type).show();
      this.focus();
    }
  });

  this.removeEventListener('dblclick', editingTableCells);
}

/* => */
/* ============== SORTING EMPLOYEES ============== */
/* <= */

let currentTarget;
let direction;

function sortingEmployees({ tHead: cellsTitles }) {
  cellsTitles.addEventListener('click', (e) => {
    const target = e.target.closest('th');

    if (target !== currentTarget) {
      currentTarget = target;
      direction = 0;
    }

    employeesTableList.append(...[...employeesTableList.rows]
      .sort(sortByTarget(target.innerText.toLowerCase(), 'cells', target)));
  });
}

function sortByTarget(type, key, { cellIndex }) {
  direction = direction ? 0 : 1;

  return (a, b) => {
    const x = normalize(type, a[key][cellIndex].textContent);
    const y = normalize(type, b[key][cellIndex].textContent);

    if (typeof x !== 'number') {
      return (direction)
        ? x.localeCompare(y)
        : y.localeCompare(x);
    }

    return (direction)
      ? x - y
      : y - x;
  };
}

sortingEmployees(employeesTable);

/* => */
/* ============== SELECT TABLE ROWS ============== */
/* <= */

function selectTableRow(list) {
  let previousRowIndex;

  list.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (row.classList.contains('editing')) {
      row.classList.remove('active');

      return;
    }

    if (row.rowIndex !== previousRowIndex) {
      [...list.rows].forEach(element => {
        element.classList.remove('active');
      });
      previousRowIndex = row.rowIndex;
    }

    row.classList.toggle('active');
  });
}

selectTableRow(employeesTableList);

/* => */
/* ============== NORMALIZE SALARY ============== */
/* <= */

function normalize(type, value) {
  if (type !== 'salary') {
    return value;
  }

  return isNaN(parseInt(value))
    ? parseInt(value.replace(/[$,]/g, ''))
    : '$' + Number(value).toLocaleString('en-US');
}
