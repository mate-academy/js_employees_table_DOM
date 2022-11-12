'use strict';

const notifications = {
  ruleForName: 'Name shouldn\'t be less than 4 letters and contain any number',
  ruleForPosition: (
    'Position shouldn\'t be less than 4 letters and contain any number'
  ),
  ruleForOffice: (
    'Office shouldn\'t be less than 3 letters and contain any number'
  ),
  ruleForAge: 'Age shouldn\'t be less than 18 and more than 90',
  ruleForSalary: 'Salary should only contain numbers',
  ruleForIncorrectField: 'It looks like you have given a wrong field value',

  createNotification(title, description, type) {
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
  },

  showNotification(field) {
    switch (field) {
      case 'form-success':
        this.createNotification(
          'Success',
          'The new employee has been added to the table',
          'success'
        );
        break;

      case 'input-success':
        this.createNotification(
          'Success',
          'The data has been updated',
          'success'
        );
        break;

      case 'name':
        this.createNotification(
          'Name is invalid',
          notifications.ruleForName,
          'error'
        );
        break;

      case 'position':
        this.createNotification(
          'Position is invalid',
          notifications.ruleForPosition,
          'error'
        );
        break;

      case 'office':
        this.createNotification(
          'Office is invalid',
          notifications.ruleForOffice,
          'error'
        );
        break;

      case 'age':
        this.createNotification(
          'Age is invalid',
          notifications.ruleForAge,
          'error'
        );
        break;

      case 'salary':
        this.createNotification(
          'Salary field has invalid symbol',
          notifications.ruleForSalary,
          'error'
        );
        break;

      default:
        this.createNotification(
          'Opps, something went wrong',
          notifications.ruleForIncorrectField,
          'error'
        );
        break;
    }
  },
};
const validation = {
  numbers: '0123456789',
  offices: [
    'Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco',
  ],
  incorrectField: '',

  checkFormCorrectness(form) {
    const isNameCorrect = this.checkNameCorrectness(form.name.value);
    const isAgeCorrect = this.checkAgeCorrectness(form.age.value);
    const isPositionCorrect = this
      .checkPositionCorrectness(form.position.value);

    if (
      !isNameCorrect
      || !isAgeCorrect
      || !isPositionCorrect
    ) {
      return false;
    }

    return true;
  },

  checkNameCorrectness(employeeName) {
    if (
      employeeName.split('').some(symbol => this.numbers.includes(symbol))
      || employeeName.length < 4
    ) {
      this.incorrectField = 'name';

      return false;
    }

    return true;
  },

  checkPositionCorrectness(position) {
    if (
      position.split('').some(symbol => this.numbers.includes(symbol))
      || position.length < 4
    ) {
      this.incorrectField = 'position';

      return false;
    }

    return true;
  },

  checkOfficeCorrectness(office) {
    if (
      office.split('').some(symbol => this.numbers.includes(symbol))
      || office.length < 4
    ) {
      this.incorrectField = 'office';

      return false;
    }

    return true;
  },

  checkAgeCorrectness(age) {
    const employeeAge = Number(age);

    if (
      isNaN(employeeAge)
      || employeeAge < 18
      || employeeAge > 90
    ) {
      this.incorrectField = 'age';

      return false;
    }

    return true;
  },

  checkSalaryCorrectness(salary) {
    const employeeSalary = Number(salary);

    if (
      isNaN(employeeSalary)
    ) {
      this.incorrectField = 'salary';

      return false;
    }

    return true;
  },

  checkInputCorrectness(fieldName, fieldValue) {
    switch (fieldName) {
      case 'name':
        return this.checkNameCorrectness(fieldValue);

      case 'position':
        return this.checkPositionCorrectness(fieldValue);

      case 'office':
        return this.checkOfficeCorrectness(fieldValue);

      case 'age':
        return this.checkAgeCorrectness(fieldValue);

      case 'salary':
        return this.checkSalaryCorrectness(fieldValue);

      default:
        return true;
    }
  },
};
const table = document.querySelector('table');

table.sortedRow = null;
table.selectedRow = null;

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
  ) {
    return;
  }

  const oldCellData = cell.innerText;

  cell.innerHTML = '<input class="cell-input">';

  const input = cell.firstElementChild;

  input.focus();

  input.addEventListener('blur', function() {
    changeCellData();
  });

  input.addEventListener('keydown', function(ev) {
    if (ev.code !== 'Enter') {
      return;
    }

    changeCellData();
  });

  function changeCellData() {
    const headerName = table
      .tHead
      .rows[0]
      .cells[cell.cellIndex]
      .innerText
      .trim()
      .toLowerCase();
    let inputData = input.value;

    if (
      inputData !== ''
      && !validation.checkInputCorrectness(headerName, inputData)
    ) {
      notifications.showNotification(headerName);
      input.focus();

      return;
    }

    if (headerName === 'salary') {
      inputData = '$' + Number(inputData).toLocaleString();
    }

    if (inputData === '') {
      cell.innerText = oldCellData;

      return;
    }

    cell.textContent = inputData;
    notifications.showNotification('input-success');
    validation.incorrectField = '';
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
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
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

  if (!validation.checkFormCorrectness(addingForm)) {
    addingForm[validation.incorrectField].focus();
    notifications.showNotification(validation.incorrectField);
    validation.incorrectField = '';

    return;
  }

  addEmployee();
  clearAddingForm();
  notifications.showNotification('form-success');

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

  function clearAddingForm() {
    for (const input of addingForm) {
      if (input.tagName === 'SELECT') {
        input.options[0].selected = true;

        continue;
      }

      input.value = '';
    }
  }
});
