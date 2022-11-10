'use strict';

const table = document.querySelector('table');

table.sortedRow = null;
table.selectedRow = null;
table.editedCell = null;

table.addEventListener('click', function(e) {
  const columnHeader = e.target;

  if (!table.tHead.contains(columnHeader)) {
    return;
  }

  if (table.sortedRow && columnHeader !== table.sortedRow) {
    table.sortedRow.sortDirection = '';
  }

  if (!columnHeader.sortDirection) {
    columnHeader.sortDirection = 'asc';
    table.sortedRow = columnHeader;
  }

  const columnIndex = columnHeader.cellIndex;
  let sortedRows = null;

  if (columnHeader.sortDirection === 'asc') {
    sortedRows = [...table.tBodies[0].rows]
      .sort((rowA, rowB) => {
        return sortInDirection(
          rowA.cells[columnIndex].innerText,
          rowB.cells[columnIndex].innerText
        );
      });

    columnHeader.sortDirection = 'desc';
  } else {
    sortedRows = [...table.tBodies[0].rows]
      .sort((rowA, rowB) => {
        return sortInDirection(
          rowB.cells[columnIndex].innerText,
          rowA.cells[columnIndex].innerText
        );
      });

    columnHeader.sortDirection = 'asc';
  }

  table.tBodies[0].append(...sortedRows);

  function sortInDirection(rowAData, rowBData) {
    let dataA = rowAData;
    let dataB = rowBData;

    if (dataA.startsWith('$')) {
      dataA = dataA.slice(1).replaceAll(',', '');
      dataB = dataB.slice(1).replaceAll(',', '');
    } else if (isNaN(Number(dataA))) {
      return dataA.localeCompare(dataB);
    }

    return Number(dataA) - Number(dataB);
  }
});

table.addEventListener('click', function(e) {
  const row = e.target.closest('tr');

  if (![...table.tBodies].some(tBody => tBody.contains(row))) {
    return;
  }

  if (!table.selectedRow) {
    table.selectedRow = row;
  }

  if (row !== table.selectedRow) {
    table.selectedRow.classList.remove('active');
    table.selectedRow = row;
  }

  row.classList.toggle('active');
});

table.addEventListener('dblclick', function(e) {
  const cell = e.target;

  if (
    cell.tagName !== 'TD'
    || ![...table.tBodies].some(tBody => tBody.contains(cell))
    || table.editedCell
  ) {
    return;
  }

  const oldCellData = cell.innerText;

  cell.innerHTML = '<input class="cell-input">';
  cell.firstElementChild.focus();

  cell.firstElementChild.addEventListener('blur', function() {
    changeCellData();
  });

  cell.firstElementChild.addEventListener('keydown', function(ev) {
    if (ev.code !== 'Enter') {
      return;
    }

    changeCellData();
  });

  function changeCellData() {
    if (!cell.firstElementChild.value) {
      cell.innerText = oldCellData;
    }

    cell.innerText = cell.firstElementChild.value;
  }
});

table.insertAdjacentHTML('afterend', `
  <form name="adding-employee" class="new-employee-form">
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>

    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>

    <label>
      Office:
      <select
        name="office"
        data-qa="office"
        required
      >
        <option value="Tokyo" selected>Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New york">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San francisco">San Francisco</option>
      </select>
    </label>

    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
    </label>

    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>

    <button type="submit">Save to table</button>
  </form>
`);

const addingForm = document.forms['adding-employee'];

addingForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const isNameCorrect = checkNameCorrectness();
  const isAgeCorrect = checkAgeCorrectness();
  const ruleForName = (
    'Name shouldn\'t be less than 4 letters and contain any number'
  );
  const ruleForAge = 'Age shouldn\'t be less than 18 and more than 90';

  if (!isNameCorrect) {
    showNotification(
      'Name is invalid',
      ruleForName,
      'error'
    );

    return;
  } else if (!isAgeCorrect) {
    showNotification(
      'Age is invalid',
      ruleForAge,
      'error'
    );

    return;
  }

  addEmployee();

  showNotification(
    'Success',
    'The new employee has been added to the table',
    'success'
  );

  function checkNameCorrectness() {
    const employeeName = addingForm.name.value;
    const numbers = '0123456789';

    if (
      employeeName.split('').some(symbol => numbers.includes(symbol))
      || employeeName.length < 4
    ) {
      return false;
    }

    return true;
  }

  function checkAgeCorrectness() {
    const employeeAge = Number(addingForm.age.value);

    if (
      isNaN(employeeAge)
      || employeeAge < 18
      || employeeAge > 90
    ) {
      return false;
    }

    return true;
  }

  function addEmployee() {
    const { name: employeeName, position, office, age, salary } = addingForm;

    table.tBodies[0].insertAdjacentHTML('beforeend', `
      <tr>
        <td>${employeeName.value}</td>
        <td>${position.value}</td>
        <td>${office.value}</td>
        <td>${age.value}</td>
        <td>${'$' + Number(salary.value).toLocaleString()}</td>
      </tr>
    `);
  }

  function showNotification(title, description, type) {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.dataset.qa = 'notification';

    notification.insertAdjacentHTML('afterbegin', `
      <h2 class='title'>${title}</h2>
  
      <p>${description}</p>
    `);

    document.body.append(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  };
});
