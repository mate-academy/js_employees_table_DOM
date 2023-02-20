'use strict';

function convertSalary(salary) {
  return +salary.slice(1).split(',').join('');
};

function convertNumberToSalary(number) {
  const symbol = '$';
  const digit = new Intl.NumberFormat('en-US').format(number);

  return symbol + digit;
}

function sortTableString(columnNumber, inputOrder,
  inputLastSorted, columnName) {
  let ascOrder = inputOrder;

  if (inputLastSorted !== columnName) {
    ascOrder = true;
  };

  if (ascOrder) {
    rows.sort((a, b) => a.children[columnNumber].textContent
      .localeCompare(b.children[columnNumber].textContent));
  } else {
    rows.sort((a, b) => b.children[columnNumber].textContent
      .localeCompare(a.children[columnNumber].textContent));
  }

  ascOrder = !ascOrder;

  return ascOrder;
};

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
let rows = [...tableBody.querySelectorAll('tr')];
let order = true;
let lastSorted = '';

table.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  rows = [...tableBody.querySelectorAll('tr')];

  if (header) {
    switch (e.target.textContent) {
      case 'Name':
        order = sortTableString(0, order, lastSorted, 'Name');
        lastSorted = 'Name';
        break;

      case 'Position':
        order = sortTableString(1, order, lastSorted, 'Position');
        lastSorted = 'Position';
        break;

      case 'Office':
        order = sortTableString(2, order, lastSorted, 'Office');
        lastSorted = 'Office';
        break;

      case 'Age':
        if (lastSorted !== 'Age') {
          order = true;
        }

        if (order) {
          rows.sort((a, b) => +a.children[3].textContent
            - +b.children[3].textContent);
        } else {
          rows.sort((a, b) => +b.children[3].textContent
            - +a.children[3].textContent);
        }
        lastSorted = 'Age';
        order = !order;
        break;

      case 'Salary':
        if (lastSorted !== 'Salary') {
          order = true;
        }

        if (order) {
          rows.sort((a, b) => convertSalary(a.children[4].textContent)
            - convertSalary(b.children[4].textContent));
        } else {
          rows.sort((a, b) => convertSalary(b.children[4].textContent)
            - convertSalary(a.children[4].textContent));
        }
        lastSorted = 'Salary';
        order = !order;
    };

    for (const row of rows) {
      tableBody.append(row);
    }
  };

  if (e.target.closest('tbody')) {
    rows.forEach((row) => {
      row.classList.remove('active');
    });

    e.target.closest('tr').classList.add('active');
  }
});

const body = document.querySelector('body');
const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');

newEmployeeForm.insertAdjacentHTML('afterbegin', `
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
        type="text" 
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
        min="0" 
        data-qa="age" 
        required
      >
    </label>
    <label>
      Salary: 
      <input 
        name="salary"
        type="number" 
        min="0" 
        data-qa="salary" 
        required
      >
    </label>

    <button class="button"> Save to table </button>
`);

body.append(newEmployeeForm);

function showNotification(type, title, message) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);

  notification.insertAdjacentHTML('afterbegin', `
    <h2 class="title">${title}</h2>
    <p>${message}</p>
  `);

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, '3000');
}

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const basicRow = tableBody.querySelector('tr');
  const inputName = document.querySelector('input[name ="name"]');
  const inputPosition = newEmployeeForm.elements.position;
  const inputOffice = newEmployeeForm.elements.office;
  const inputAge = newEmployeeForm.elements.age;
  const inputSalary = newEmployeeForm.elements.salary;

  if (inputName.value.trim().length >= 4
    && inputAge.value >= 18 && inputAge.value < 90) {
    const newEmployee = basicRow.cloneNode(true);

    newEmployee.children[0].textContent = inputName.value;
    newEmployee.children[1].textContent = inputPosition.value;
    newEmployee.children[2].textContent = inputOffice.value;
    newEmployee.children[3].textContent = inputAge.value;

    newEmployee.children[4].textContent
    = convertNumberToSalary(inputSalary.value);

    tableBody.prepend(newEmployee);
    newEmployeeForm.reset();

    showNotification('success', 'Green light!',
      'New employee was successfully added.');
  } else if (inputName.value.trim().length < 4) {
    showNotification('error', 'Error!',
      'The "name" field must have at least 4 letters.');
  } else if (inputAge.value < 18 || inputAge.value > 90) {
    showNotification('warning', 'Warning!',
      'The age must be at least 18 years old and not older than 90 years old.');
  }
});

let valueTableCell;

tableBody.addEventListener('dblclick', (e) => {
  const tableCell = e.target.closest('td');
  const cellInput = document.querySelector('.cell-input');

  if (tableCell && !cellInput) {
    valueTableCell = tableCell.innerText;
    tableCell.innerText = '';

    const newTableCellInput = document.createElement('input');

    newTableCellInput.classList.add('cell-input');
    newTableCellInput.setAttribute('name', 'cell-input');
    newTableCellInput.setAttribute('type', 'text');
    tableCell.append(newTableCellInput);
    newTableCellInput.focus();
  }
});

function checkAndFillCell(cell, initValue) {
  const cellTd = cell.parentElement;
  const numberOfCol = Array.from(cellTd.parentNode.children).indexOf(cellTd);

  if (cell.value.length !== 0) {
    if (numberOfCol === 0 || numberOfCol === 1) {
      if (isNaN(cell.value)) {
        if (cell.value.length >= 4) {
          cell.parentElement.innerHTML = cell.value;

          showNotification('success', 'Green light!',
            'Data was successfully changed.');
        } else {
          showNotification('error', 'Error!',
            'The "name" field must have at least 4 letters.');
        }
      } else {
        showNotification('error', 'Error!',
          'You must add only letters.');
      }
    }

    if (numberOfCol === 2) {
      const offices = ['Tokyo', 'Singapore', 'London',
        'New York', 'Edinburgh', 'San Francisco'];

      if (offices.includes(cell.value)) {
        cell.parentElement.innerHTML = cell.value;

        showNotification('success', 'Green light!',
          'Data was successfully changed.');
      } else {
        showNotification('error', 'Error!',
          'We don\'t have office in this city');
      }
    }

    if (numberOfCol === 3) {
      if (!isNaN(cell.value)) {
        if (cell.value >= 18 && cell.value < 90) {
          cell.parentElement.innerHTML = cell.value;

          showNotification('success', 'Green light!',
            'Data was successfully changed.');
        } else {
          showNotification('error', 'Error!',
            'The age must be between 18 years old and 90 years old.');
        }
      } else {
        showNotification('error', 'Error!',
          'You must add only numbers.');
      }
    }

    if (numberOfCol === 4) {
      if (!isNaN(cell.value)) {
        cell.parentElement.innerHTML = convertNumberToSalary(cell.value);

        showNotification('success', 'Green light!',
          'Data was successfully changed.');
      } else {
        showNotification('error', 'Error!',
          'You must add only numbers.');
      }
    }
  } else {
    cell.parentElement.innerHTML = initValue;
  }
}

tableBody.addEventListener('keydown', (e) => {
  const cellInput = e.target.closest('input');

  if (e.key === 'Enter') {
    checkAndFillCell(cellInput, valueTableCell);
  }
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.cell-input')) {
    const cellInput = document.querySelector('.cell-input');

    if (cellInput) {
      checkAndFillCell(cellInput, valueTableCell);
    }
  }
});
