'use strict';

const table = document.querySelector('table');
const tbody = table.tBodies[0];

createForm();
addTableSorting();
addRowSelecting();
addDataAppending();
addTableEditing();

function createForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  table.after(form);

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
    <label for="office">Office:
      <select name="office" id="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
     <label>Age:
      <input
        name="age"
        type="number"
        required
        >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        required
        >
    </label>
    <button type="submit">Save to table</button>
`);
}

function addTableSorting() {
  let setAscending = false;
  let lastClicked = null;

  table.tHead.addEventListener('click', (event) => {
    const th = event.target;

    setAscending = !setAscending;

    if (lastClicked !== th) {
      setAscending = true;
    }

    lastClicked = th;

    sortTableByColumn(th.cellIndex, th.innerText, setAscending);
  });
}

function addRowSelecting() {
  let lastActive = null;

  table.tBodies[0].addEventListener('click', (event) => {
    const tr = event.target.closest('tr');

    if (lastActive !== tr && lastActive !== null) {
      lastActive.classList.remove('active');
    }

    lastActive = tr;

    tr.classList.add('active');
  });
}

function addDataAppending() {
  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    const activeForm = event.target;

    event.preventDefault();

    if (!validateForm(activeForm)) {
      return;
    }

    addNewEmployee(activeForm);
    activeForm.reset();
  });
}

function addTableEditing() {
  tbody.addEventListener('dblclick', (event) => {
    const td = event.target;
    const initialValue = td.textContent;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    input.style.width = window.getComputedStyle(td).width;

    td.textContent = '';
    td.append(input);

    input.addEventListener('blur', () => {
      editTableCell(td, input, initialValue);
    });

    input.addEventListener('keydown', (e) => {
      if (e.code === 'Enter') {
        editTableCell(td, input, initialValue);
      }
    });

    input.remove();
  });
}

// Helper functions
function sortTableByColumn(columnIndex, columnName, sortOrder) {
  const rows = [...tbody.rows];

  rows.sort((a, b) => {
    let rowA = a.cells[columnIndex].textContent;
    let rowB = b.cells[columnIndex].textContent;

    if (columnName === 'Salary') {
      rowA = +rowA.replace(/[$,]/g, '');
      rowB = +rowB.replace(/[$,]/g, '');
    }

    if (!sortOrder) {
      return isNaN(+rowA)
        ? rowB.localeCompare(rowA)
        : Number(rowB) - Number(rowA);
    }

    return isNaN(+rowA)
      ? rowA.localeCompare(rowB)
      : Number(rowA) - Number(rowB);
  });

  tbody.append(...rows);
}

function validateForm(form) {
  const age = form.age.value;
  const salary = form.salary.value;

  if (age < 18) {
    pushNotification(440, 230, 'Error!',
      'Employee\'s age must be over 18!', 'error');

    return false;
  }

  if (age > 90) {
    pushNotification(440, 230, 'Error!',
      'Employee\'s age must be less than 90!', 'error');

    return false;
  }

  if (salary < 50000) {
    pushNotification(440, 230, 'Error!',
      'Employee\'s salary must be greater than $50,000!', 'error');

    return false;
  }

  return true;
}

function addNewEmployee(form) {
  const salary = `$${(+form.salary.value).toLocaleString()}`;

  tbody.insertAdjacentHTML('beforeend', `
  <tr>
    <td>${form.name.value}</td>
    <td>${form.position.value}</td>
    <td>${form.office.value}</td>
    <td>${form.age.value}</td>
    <td>${salary}</td>
  </tr>
  `);

  pushNotification(440, 230, 'Success!',
    'New employee was added to the table!', 'success');
}

function pushNotification(top, right, title, description, type) {
  const message = document.createElement('div');

  message.classList.add('notification');
  message.classList.add(type);
  message.style.top = top + 'px';
  message.style.right = right + 'px';

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
    `;

  document.body.append(message);

  setTimeout(() => message.remove(), 2000);
}

function editTableCell(cell, input, cellValue) {
  if (!input.value) {
    cell.textContent = cellValue;

    return;
  }

  cell.textContent = input.value;
}
