'use strict';

const table = document.querySelector('table');
const form = document.createElement('form');

addTableSorting();
addRowSelecting();
createForm();
addNewEmployeeAppending();
addTableEditing();

function addTableSorting() {
  let clickedHeaderIndex = null;

  table.tHead.addEventListener('click', headClickHandler);

  function headClickHandler(event) {
    clickedHeaderIndex = (clickedHeaderIndex !== event.target.cellIndex)
      ? event.target.cellIndex
      : null;

    sortList(event.target.cellIndex);
  }

  function sortList(index) {
    const sortedRows = [...table.tBodies[0].rows].sort((a, b) => {
      let first = a.cells[index].textContent;
      let second = b.cells[index].textContent;

      if (first.includes('$')) {
        first = first.replace(/[$,]/g, '');
        second = second.replace(/[$,]/g, '');
      }

      if (clickedHeaderIndex === index) {
        return isNaN(+first)
          ? first.localeCompare(second)
          : (+first) - (+second);
      } else {
        return isNaN(+first)
          ? second.localeCompare(first)
          : (+second) - (+first);
      }
    });

    table.tBodies[0].append(...sortedRows);
  }
}

function addRowSelecting() {
  let selectedRow = null;

  document.addEventListener('click', makePassive);
  table.tBodies[0].addEventListener('click', makeActive);

  function makeActive(event) {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }

    selectedRow = event.target.parentElement;
    selectedRow.classList.add('active');
  }

  function makePassive(event) {
    if (event.target.tagName === 'TD'
      || event.target.tagName === 'TH'
      || !selectedRow) {
      return;
    }

    selectedRow.classList.remove('active');
    selectedRow = null;
  }
}

function createForm() {
  form.classList.add('new-employee-form');

  form.insertAdjacentHTML('afterbegin', `
    <label>Name:
      <input
        name="name"
        type="text"
        minlength="4"
        required
      >
    </label>

    <label>Position:
      <input
        name="position"
        type="text"
        minlength="4"
        required
      >
    </label>

    <label>Office:
      <select name="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input
        name="age"
        type="number"
        min="18"
        max="90"
        required
      >
    </label>

    <label>Salary:
      <input
        name="salary"
        type="number"
        min="40000"
        required
      >
    </label>

    <button>Save to table</button>
`);

  document.body.append(form);
}

function addNewEmployeeAppending() {
  let isWrongData = false;

  form.lastElementChild.addEventListener('click', addToTable);

  function addToTable(event) {
    event.preventDefault();

    validateInput();

    if (isWrongData) {
      return;
    }

    createNewEmployee();

    [...form.elements].forEach(i => (i.value = i.getAttribute('value')));
  }

  function validateInput() {
    if (form.name.value.length < 4 || !isNaN(+form.name.value)) {
      pushNotification(
        '450px',
        '170px',
        'Error!',
        `Name cannot be less than 4 letters!
         Do not forget to include your last name.`,
        'error'
      );
      isWrongData = true;

      return;
    }

    if (form.position.value.length < 4 || !isNaN(+form.position.value)) {
      pushNotification(
        '450px',
        '170px',
        'Error!',
        `Position cannot be less than 4 letters.
         We already have an excellent CEO!`,
        'error'
      );
      isWrongData = true;

      return;
    }

    if (!form.office.value) {
      pushNotification(
        '450px',
        '170px',
        'Warning',
        `Unfortunately we do not have a remote position.`,
        'warning'
      );
      isWrongData = true;

      return;
    }

    if (form.age.value < 18 || form.age.value > 90) {
      pushNotification(
        '450px',
        '170px',
        'Error!',
        'You are too young or too old, ageism is forever!',
        'error'
      );
      isWrongData = true;

      return;
    }

    if (form.salary.value < 40000) {
      pushNotification(
        '450px',
        '170px',
        'Error!',
        'Our employees have a good salary! (Not less than $40,000)',
        'error'
      );
      isWrongData = true;

      return;
    }

    isWrongData = false;
  }

  function createNewEmployee() {
    const newEmployee = document.createElement('tr');

    newEmployee.insertAdjacentHTML('afterbegin', `
      <td>${form.name.value}</td>
      <td>${form.position.value}</td>
      <td>${form.office.value}</td>
      <td>${form.age.value}</td>
      <td>$${Number(form.salary.value).toLocaleString('en-US')}</td>
  `);

    table.tBodies[0].append(newEmployee);

    pushNotification(
      '450px',
      '170px',
      'Success',
      'Welcome to the team!',
      'success'
    );
  }
}

function pushNotification(top, right, title, description, type) {
  const message = document.createElement('div');

  message.className = `notification ${type}`;
  message.style.top = top;
  message.style.right = right;

  message.insertAdjacentHTML('afterbegin', `
    <h2 class="title">${title}</h2>
    <p>
      ${description}
    </p>
  `);

  document.body.append(message);

  setTimeout(() => message.remove(), 3000);
}

function addTableEditing() {
  table.tBodies[0].addEventListener('dblclick', editCell);

  function editCell(event) {
    const cell = event.target;
    const initValue = cell.textContent;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initValue;
    input.style.width = window.getComputedStyle(cell).width;

    cell.innerHTML = '';
    cell.append(input);

    input.focus();
    input.addEventListener('blur', addEdit);
    input.addEventListener('keydown', checkKey);

    function addEdit() {
      switch (true) {
        case !input.value:
        case !isNaN(+initValue.replace(/[$,]/g, '')) && isNaN(+input.value):
        case isNaN(+initValue.replace(/[$,]/g, '')) && !isNaN(+input.value):
          cell.innerHTML = initValue;
          break;

        default:
          cell.innerHTML = input.value;
      }
    }

    function checkKey(keyboardEvent) {
      if (keyboardEvent.code === 'Enter') {
        addEdit();
      }
    }
  }
}
