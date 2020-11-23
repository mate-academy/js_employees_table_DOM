'use strict';

const employeesTable = document.querySelector('table');

addTableSorting(employeesTable);
addRowSelect(employeesTable);
addTableEditing(employeesTable);

const employeeForm = createForm('new-employee-form');

document.body.append(employeeForm);

addRowAppending(employeeForm, employeesTable);

function addTableSorting(table) {
  table.tHead.addEventListener('click', (event) => {
    sortTable(table, event.target);
  });

  function sortTable(sortedTable, sortedColumn) {
    const columnIndex = sortedColumn.cellIndex;
    const tBody = sortedTable.tBodies[0];

    const sortedRows = [...tBody.rows].sort((firstRow, secondRow) => {
      const firstRowText = firstRow.cells[columnIndex].textContent;
      const secondRowText = secondRow.cells[columnIndex].textContent;

      if (getNumber(firstRowText)) {
        return sortedColumn.isSortOrderChanged
          ? getNumber(secondRowText) - getNumber(firstRowText)
          : getNumber(firstRowText) - getNumber(secondRowText);
      }

      return sortedColumn.isSortOrderChanged
        ? secondRowText.localeCompare(firstRowText)
        : firstRowText.localeCompare(secondRowText);
    });

    tBody.append(...sortedRows);

    sortedColumn.isSortOrderChanged = !sortedColumn.isSortOrderChanged;
  }

  function getNumber(string) {
    return +string.replace(/\D*/g, '');
  };
}

function addRowSelect(table) {
  table.tBodies[0].addEventListener('click', (event) => {
    const chosenRow = event.target.closest('TR');

    if (!chosenRow) {
      return;
    }

    const previousChosenRow = document.querySelector('tr.active');

    if (previousChosenRow) {
      previousChosenRow.classList.remove('active');
    }

    chosenRow.classList.add('active');
  });
}

function createForm(className) {
  const form = document.createElement('form');

  form.classList.add(className);

  form.innerHTML = `
    <label for="name">
      Name:
      <input
        name="name"
        id="name"
        type="text"
        required
      >
    </label>
    <label for="position">
      Position:
      <input
        name="position"
        id="position"
        type="text"
        required
      >
    </label>
    <label for="office">
      Office:
      <select
        name="office"
        id="office"
        required
      >
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label for="age">
      Age:
      <input
        name="age"
        id="age"
        type="number"
        required
      >
    </label>
    <label for="salary">
      Salary:
      <input
        name="salary"
        id="salary"
        type="number"
        required
      >
    </label>
    <button type="submit">Save to table</button>
  `;

  return form;
}

function addRowAppending(form, table) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = form.name.value;
    const age = +form.age.value;

    if (name.length < 4) {
      pushNotification(
        10,
        10,
        'Error', 'Name should have minimum 4 letters',
        'error'
      );

      return;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        10,
        10,
        'Error',
        'Age should be between 18 and 90',
        'error'
      );

      return;
    }

    const position = form.position.value;
    const office = form.office.value;
    const salary = +form.salary.value;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-GB')}</td>
    `;

    table.tBodies[0].append(newRow);

    pushNotification(
      10,
      10,
      'Done!',
      'New employee was added to the table',
      'success'
    );

    form.reset();
  });
}

function pushNotification(top, right, title, description, type) {
  const message = document.createElement('div');

  message.classList.add('notification', type);

  message.style.top = `${top}px`;
  message.style.right = `${right}px`;

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  setTimeout(() => message.remove(), 2000);

  document.body.append(message);
};

function addTableEditing(table) {
  table.tBodies[0].addEventListener('dblclick', (event) => {
    if (event.target.tagName !== 'TD') {
      return;
    }

    const modifiedCell = event.target;
    const cellText = modifiedCell.textContent;
    const cellInputWidth = window.getComputedStyle(modifiedCell).width;

    modifiedCell.innerHTML = `
      <input
        name="change"
        class="cell-input"
        value="${cellText}"
      >
    `;

    const cellInput = modifiedCell.querySelector('.cell-input');

    cellInput.style.maxWidth = cellInputWidth;

    cellInput.addEventListener('blur', (e) => {
      modifiedCell.innerHTML = cellInput.value
        ? cellInput.value
        : cellText;
    });

    cellInput.addEventListener('keypress', (e) => {
      if (e.key !== 'Enter') {
        return;
      }

      modifiedCell.innerHTML = cellInput.value
        ? cellInput.value
        : cellText;
    });
  });
}
