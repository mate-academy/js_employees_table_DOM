'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
let indicator;
let counter = 1;

// click on the table header to sort
thead.addEventListener('click', e => {
  const onClick = e.target.closest('th');
  const cellIndex = onClick.cellIndex;

  if (indicator === cellIndex) {
    counter++;
  } else {
    counter = 1;
  }

  indicator = cellIndex;

  getSortRows(cellIndex, onClick.innerHTML);
});

// sort table rows
function getSortRows(colNum, colName) {
  const rowsArray = [...tbody.rows].slice(0);
  let choice;

  switch (colName) {
    case 'Salary':
      const parseSalary = cell =>
        +cell
          .slice(1)
          .split(',')
          .join('');

      if (counter % 2 !== 0) {
        choice = (rowA, rowB) =>
          parseSalary(rowA.cells[colNum].innerHTML)
            - parseSalary(rowB.cells[colNum].innerHTML);
      } else {
        choice = (rowA, rowB) =>
          parseSalary(rowB.cells[colNum].innerHTML)
            - parseSalary(rowA.cells[colNum].innerHTML);
      }
      break;
    default:
      if (counter % 2 !== 0) {
        choice = (rowA, rowB) =>
          isNaN(rowA.cells[colNum].innerHTML)
            ? (rowA.cells[colNum].innerHTML)
              .localeCompare(rowB.cells[colNum].innerHTML)
            : +rowA.cells[colNum].innerHTML
              - +rowB.cells[colNum].innerHTML;
      } else {
        choice = (rowA, rowB) =>
          isNaN(rowA.cells[colNum].innerHTML)
            ? (rowB.cells[colNum].innerHTML)
              .localeCompare(rowA.cells[colNum].innerHTML)
            : +rowB.cells[colNum].innerHTML
              - +rowA.cells[colNum].innerHTML;
      }
      break;
  }

  rowsArray.sort(choice);

  tbody.append(...rowsArray);
}

// click on a table row to select
tbody.addEventListener('click', e => {
  const onClick = e.target.closest('tr');

  for (const row of tbody.rows) {
    row.classList.remove('active');
  }

  onClick.classList.add('active');
});

// add Form
table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form" method="post">
    <label>
      Name: 
        <input name="name" data-qa="name" type="text" required>
    </label>
    <label>
      Position:
        <input name="position" data-qa="position" type="text" required>
    </label>
    <label>
      Office:
        <select name="office" data-qa="office">
          <option selected value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
    </label>
    <label>
      Age:
        <input name="age" data-qa="age" type="number" required>
    </label>
    <label>
      Salary:
        <input name="salary" data-qa="salary" type="number" required>
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('form');

// add notifications
form.insertAdjacentHTML('afterend', `
  <div class="notification" data-qa="notification">
    <span class="title">
    </span>
  </div>
`);

const notification = document.querySelector('.notification');

notification.hidden = true;

// click on the "Save to table" button to add a new employee to the table
form.addEventListener('submit', e => {
  e.preventDefault();

  const employeeName = form.elements.name.value;
  const employeePosition = form.elements.position.value;
  const employeeOffice = form.elements.office.value;
  const employeeAge = form.elements.age.value;
  const employeeSalary = new Intl.NumberFormat('en-GB')
    .format(form.elements.salary.value);

  addErrorChecking(employeeName,
    employeePosition,
    employeeOffice,
    employeeAge,
    employeeSalary);
});

// check the entered data in the form
function addErrorChecking(employeeName,
  employeePosition,
  employeeOffice,
  employeeAge,
  employeeSalary) {
  const title = notification.querySelector('.title');

  notification.hidden = false;

  notification.classList.add('error');

  if (employeeName.length < 4) {
    title.innerHTML = 'Error! The "Name" field has less than 4 characters.';
  } else if (employeeAge < 18 || employeeAge > 90) {
    title.innerHTML = 'Error! Age does not meet the requirements.';
  } else {
    notification.classList.remove('error');
    notification.classList.add('success');
    title.innerHTML = 'Success! A new employee has been added to the table.';

    setTimeout(function() {
      notification.hidden = true;
    }, 4000);

    addNewEmployeeToTable(employeeName,
      employeePosition,
      employeeOffice,
      employeeAge,
      employeeSalary);
  }
}

// add a new employee to the table
function addNewEmployeeToTable(employeeName,
  employeePosition,
  employeeOffice,
  employeeAge,
  employeeSalary) {
  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${employeeName}</td>
      <td>${employeePosition}</td>
      <td>${employeeOffice}</td>
      <td>${employeeAge}</td>
      <td>$${employeeSalary}</td>
    </tr>
  `);
}

// change cell data
tbody.addEventListener('dblclick', e => {
  const activeCell = e.target.closest('td');
  const cellValue = activeCell.innerHTML;

  activeCell.innerHTML = '';

  activeCell.insertAdjacentHTML('beforeend', `
    <input class="cell-input" value="${cellValue}">
  `);

  const input = activeCell.querySelector('input');

  input.focus();

  const newCellValue = () => {
    if (input.value === '') {
      activeCell.innerHTML = cellValue;
    } else {
      activeCell.innerHTML = input.value;
    }
  };

  input.addEventListener('focusout', newCellValue);

  input.addEventListener('keydown', keystroke => {
    if (keystroke.key === 'Enter') {
      newCellValue();
    }
  });
});
