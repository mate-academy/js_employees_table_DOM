'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tableHead = document.querySelector('thead');
  const tableBody = document.querySelector('tbody');
  let sortAscending = true;
  const officeList = `
  <select data-qa="office" name="office">
    <option selected disabled></option>
    <option value="Tokyo">
      Tokyo
    </option>
    <option value="Singapore">
      Singapore
    </option>
    <option value="London">
      London
    </option>
    <option value="New York">
      New York
    </option>
    <option value="Edinburgh">
      Edinburgh
    </option>
    <option value="San Francisco">
      San Francisco
    </option>
  </select>
  `;
  const addNewEmployeeForm = createNewEmployeeForm();

  tableHead.addEventListener('click', (e) => {
    const selectedName = e.target.closest('th').textContent;

    if (selectedName) {
      sortTable(tableBody, selectedName);
    }
  });

  tableBody.addEventListener('click', (e) => {
    const currentSelectedRow = e.target.closest('tr');
    const previousSelectedRow = tableBody.querySelector('tr.active');

    if (previousSelectedRow && previousSelectedRow !== currentSelectedRow) {
      previousSelectedRow.classList.remove('active');
    }

    if (currentSelectedRow) {
      currentSelectedRow.classList.toggle('active');
    }
  });

  tableBody.addEventListener('dblclick', (e) => {
    const editableCell = e.target.closest('td');
    const editableRow = editableCell.closest('tr');
    const editableCellNumber = [...editableRow.children].indexOf(editableCell);

    const editableColumnName
      = findTableColumnName(tableHead)[editableCellNumber].toLowerCase();

    let editableCellInput;
    const previousVal = editableCell.textContent;

    switch (true) {
      case editableColumnName === 'salary':
        editableCellInput = '<input class="cell-input" type="number">';
        break;

      case editableColumnName === 'age':
        editableCellInput = '<input class="cell-input" type="number">';
        break;

      case editableColumnName === 'office':
        editableCellInput = officeList;
        break;

      default:
        editableCellInput = '<input class="cell-input" type="text">';
    }

    editableCell.innerHTML = editableCellInput;

    editableCell.firstElementChild.focus();
    addEditedCellInputEvents(editableCell, editableColumnName, previousVal);
  });

  addNewEmployeeForm.addEventListener('submit', e => {
    e.preventDefault();

    const addedEmployee = new FormData(e.target);
    const newEmployee = Object.fromEntries(addedEmployee.entries());

    const { result, inputName } = validateForm(newEmployee);

    if (!result) {
      showNotification('error', inputName);

      return;
    };

    addNewEmployee(newEmployee);
    e.target.reset();
    showNotification('success', '');
  });

  function addEditedCellInputEvents(cell, cellColumnName, previousValue) {
    cell.firstElementChild.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        updateEditedCell(cell, cellColumnName, previousValue);
      }
    });

    cell.firstElementChild.addEventListener('blur', e => {
      updateEditedCell(cell, cellColumnName, previousValue);
    });
  }

  function updateEditedCell(cell, cellColumnName, previousVal) {
    const currentVal = cell.firstElementChild.value;
    let input = '';

    if (!validateInput(cellColumnName, currentVal)) {
      showNotification('error', cellColumnName);
      input = previousVal;
    }

    if (cellColumnName === 'salary') {
      input = `$${+currentVal.toLocaleString('en')}`;
    }

    input = input || currentVal;

    cell.textContent = input;
  }

  function showNotification(type, title) {
    const notification = document.createElement('div');
    const messages = {
      name: 'Name should be equal or greater than 4 letters',
      age: 'Age should be equal or greater than 18 and lower than 90',
      length: 'Field should not be empty',
      valid: 'Everything is ok',
    };

    let messagesText;

    if (type === 'success') {
      messagesText = messages.valid;
    } else {
      messagesText = messages[title]
        ? messages[title]
        : messages.length;
    }

    notification.classList.add('notification');
    notification.classList.add(type);
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = `
      <h2 class="title">
        ${type === 'success' ? 'Success' : title + ' Error'}
      </h2>
      <p>${messagesText}</p>
    `;

    document.body.append(notification);

    setTimeout(() => {
      hideNotification(notification);
    }, 5000);
  }

  function hideNotification(availableNotification) {
    availableNotification.remove();
  }

  function createNewEmployeeForm() {
    const employeeForm = document.createElement('form');

    employeeForm.action = '#';
    employeeForm.method = 'POST';
    employeeForm.classList.add('new-employee-form');

    employeeForm.innerHTML = `
      <label>Name:
        <input
          data-qa="name"
          name="name"
          type="text"
        >
      </label>
      <label>Position:
        <input
          data-qa="position"
          name="position"
          type="text"
        >
      </label>
      <label>Office:
        ${officeList}
      </label>
      <label>Age:
        <input data-qa="age" name="age" type="number">
      </label>
      <label>Salary:
        <input data-qa="salary" name="salary" type="number">
      </label>
      <button type="submit">Save to table</button>
    `;

    document.body.append(employeeForm);

    return employeeForm;
  }

  function addNewEmployee(employee) {
    const tableColumnNames = findTableColumnName(tableHead);
    const row = document.createElement('tr');

    tableColumnNames.forEach(item => {
      const cell = document.createElement('td');

      let cellData;

      switch (true) {
        case item.toLowerCase() === 'salary':
          cellData = `
            $${(+employee[item.toLowerCase()]).toLocaleString('en')}
          `;
          break;
        default:
          cellData = `${employee[item.toLowerCase()]}`;
      }

      cell.innerHTML = cellData;
      row.append(cell);
    });

    tableBody.append(row);
  }

  function validateForm(form) {
    for (const [inputName, inputValue] of Object.entries(form)) {
      if (!validateInput(inputName, inputValue)) {
        return {
          result: false,
          inputName: inputName,
        };
      }
    }

    return { result: true };
  }

  function validateInput(inName, inVal) {
    if (inName === 'name' && inVal.trim().length < 4) {
      return false;
    }

    if (inName === 'age') {
      const age = +inVal.trim();

      return !(age < 18 || age > 90);
    }

    if (inVal.trim().length === 0) {
      return false;
    }

    return true;
  }

  function findTableColumnName(tableHeader) {
    const tableHeadElements = tableHeader.firstElementChild.children;

    const tableHeadArray = [...tableHeadElements].map(item => item.textContent);

    return tableHeadArray;
  }

  function findTableColumnNumberFromName(selectedColName) {
    const tableColumnNames = findTableColumnName(tableHead);

    return tableColumnNames.indexOf(selectedColName);
  }

  function sortTable(table, condition) {
    const sortIndex = findTableColumnNumberFromName(condition);
    const rowsData = table.children;

    const sortedData = [...rowsData].sort((row1, row2) => {
      const dataTypeOfSort
        = convertStrToInt(row1.children[sortIndex].textContent)
          ? 'number'
          : 'string';

      let row1DataToSort;
      let row2DataToSort;
      let sortResult;

      if (dataTypeOfSort === 'number') {
        row1DataToSort = convertStrToInt(row1.children[sortIndex].textContent);
        row2DataToSort = convertStrToInt(row2.children[sortIndex].textContent);

        sortResult = sortAscending
          ? row1DataToSort - row2DataToSort
          : row2DataToSort - row1DataToSort;
      } else {
        row1DataToSort = row1.children[sortIndex].textContent;
        row2DataToSort = row2.children[sortIndex].textContent;

        sortResult = sortAscending
          ? row1DataToSort.localeCompare(row2DataToSort)
          : row2DataToSort.localeCompare(row1DataToSort);
      }

      return sortResult;
    });

    sortAscending = !sortAscending;

    tableBody.innerHTML = '';

    sortedData.forEach(row => {
      tableBody.append(row);
    });
  }

  function convertStrToInt(str) {
    const reg = /\D/g;

    const out = parseInt(str.replace(reg, ''));

    return out;
  }
});
