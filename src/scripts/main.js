'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const tableHead = document.querySelector('thead');
  const tableBody = document.querySelector('tbody');
  let sortAscending = true; // true - low to high, false- high to low

  const addNewEmployeeForm = createNewEmployeeForm();

  tableHead.addEventListener('click', (e) => {
    const selectedName = e.target.closest('th').textContent;

    if (selectedName) {
      sortTable(tableBody, selectedName);
    }
  });

  tableBody.addEventListener('click', (e) => {
    const selectedRow = e.target.closest('tr');
    const isSelectedRow = tableBody.querySelector('tr.active');

    if (isSelectedRow && isSelectedRow !== selectedRow) {
      isSelectedRow.classList.remove('active');
    }

    if (selectedRow) {
      selectedRow.classList.toggle('active');
    }
  });

  tableBody.addEventListener('dblclick', (e) => {
    const editableCell = e.target.closest('td');

    editableCell.textContent = '';

    editableCell.innerHTML = `
      <input class="cell-input">
    `;
  });

  addNewEmployeeForm.addEventListener('submit', e => {
    e.preventDefault();

    if (!validateForm(e.target)) {
      showNotification('error', 'Message example');

      return;
    };

    const newEmployee = new FormData(e.target);

    addNewEmployee(newEmployee);
    e.target.reset();
    showNotification('success', 'Message example');
  });

  function showNotification(type, textMessage) {
    const notification = document.createElement('div');

    notification.classList.add('notification');
    notification.classList.add(type);
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = `
      <h2 class="title">${type}</h2>
      <p>${textMessage}</p>
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

  function addNewEmployee(employeeData) {
    const employee = Object.fromEntries(employeeData.entries());
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
    const formInputs = form.querySelectorAll('input');
    const nameField = form.name.value;
    const ageField = +form.age.value;
    const officeField = form.office.value;

    for (let i = 0; i < formInputs.length; i++) {
      if (formInputs[i].value.length === 0) {
        return false;
      }
    }

    if (nameField.length < 4) {
      return false;
    }

    if (ageField < 18 || ageField > 90) {
      return false;
    }

    if (!officeField) {
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

  function convertStrToInt(str) {
    const reg = /\D/g;

    const out = parseInt(str.replace(reg, ''));

    return out;
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
});
