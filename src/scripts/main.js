'use strict';

const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const thList = thead.querySelectorAll('th');
const form = document.createElement('form');
const formHtml = `
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

  <button>Save to table</button>
`;

form.insertAdjacentHTML('afterbegin', formHtml);
form.classList.add('new-employee-form');
table.after(form);

const submit = form.querySelector('button');

function formatSalary(employee, index) {
  const data = employee.cells[index].innerHTML;

  if (data[0] === '$') {
    return +data.split(',').join('').slice(1);
  }

  return data;
}

function formatVal(val) {
  if (val) {
    return val
      .trim()
      .split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
}

function setOrderTrue(arr) {
  arr.forEach(th => {
    th.dataset.ascOrder = true;
  });
}

function sortColumn(e) {
  const employeeList = tbody.querySelectorAll('tr');
  const columnIndex = e.target.cellIndex;
  const currCol = e.target;
  const falseList = thead.querySelectorAll('[data-asc-order="false"]');
  let sortedArr;

  if (currCol.dataset.ascOrder === 'true') {
    setOrderTrue([...falseList]);

    currCol.dataset.ascOrder = false;

    sortedArr = [...employeeList].sort((currEmployee, nextEmployee) => {
      const currData = formatSalary(currEmployee, columnIndex);
      const nextData = formatSalary(nextEmployee, columnIndex);

      if (Number(currData)) {
        return currData - nextData;
      }

      return currData.localeCompare(nextData);
    });
  } else {
    setOrderTrue([...falseList]);

    sortedArr = [...employeeList].sort((currEmployee, nextEmployee) => {
      const currData = formatSalary(currEmployee, columnIndex);
      const nextData = formatSalary(nextEmployee, columnIndex);

      if (Number(currData)) {
        return nextData - currData;
      }

      return nextData.localeCompare(currData);
    });
  }

  tbody.append(...sortedArr);
}

function selectRow(e) {
  const activeRow = tbody.querySelector('.active');
  const targetRow = e.target.closest('tr');

  if (![...targetRow.classList].includes('active')) {
    targetRow.classList.add('active');
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  targetRow.classList.add('active');
}

function pushNotification(title, description, type) {
  const lastOfBody = document.body.lastElementChild;
  const notification = document.createElement('div');

  lastOfBody.before(notification);
  notification.className = `notification ${type}`;
  notification.dataset.dataQa = 'notification';

  notification.innerHTML = `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  setTimeout(() => notification.remove(), 2000);
};

function addEmployee(e) {
  e.preventDefault();

  const formData = new FormData(form);
  const dataObj = Object.fromEntries(formData.entries());
  const newRowHtml = `
    <tr>
      <td>${formatVal(dataObj.name)}</td>
      <td>${formatVal(dataObj.position)}</td>
      <td>${dataObj.office}</td>
      <td>${dataObj.age}</td>
      <td>${'$' + Number(dataObj.salary).toLocaleString('en-us')}</td>
    </tr>
  `;

  for (const val in dataObj) {
    if (!dataObj[val]) {
      pushNotification('Ooops!', 'Fill in the form', 'error');

      return;
    }
  }

  if (dataObj.name.length < 4) {
    pushNotification('Ooops!', 'Entered name is short', 'error');

    return;
  }

  if (dataObj.age < 18 || dataObj.age > 90) {
    pushNotification('Ooops!', 'Entered age is incorrect', 'error');

    return;
  }

  pushNotification('Congratulation!',
    'New employee is created', 'success');

  tbody.insertAdjacentHTML('beforeend', newRowHtml);
}

function inputText(e) {
  const cell = e.target;
  const cellData = cell.innerHTML;
  const cellStyle = getComputedStyle(cell);
  const cellPaddingL = parseFloat(cellStyle.paddingLeft);
  const cellPaddingR = parseFloat(cellStyle.paddingRight);
  const cellContentWidth = cell.clientWidth - cellPaddingL - cellPaddingR;

  const cellHtml = `
    <input name="name" type="text" class="cell-input">
  `;

  cell.innerHTML = cellHtml;

  const cellInput = cell.querySelector('input');

  cellInput.style.width = cellContentWidth + 'px';
  cellInput.focus();

  cellInput.addEventListener('keypress', function(evt) {
    if (evt.key === 'Enter') {
      cellInput.onblur();
    }
  });

  cellInput.onblur = function() {
    if (cellInput.value.length === 0) {
      cell.innerHTML = cellData;

      return;
    }

    if (cellData[0] === '$') {
      if (isNaN(+cellInput.value) === false) {
        cell.innerHTML = '$' + Number(cellInput.value).toLocaleString('en-us');
      } else {
        cell.innerHTML = cellData;
        pushNotification('Ooops!', 'Data format is incorrected', 'error');
      }

      return;
    }

    if (isNaN(+cellData) !== isNaN(+cellInput.value)) {
      cell.innerHTML = cellData;
      pushNotification('Ooops!', 'Data format is incorrected', 'error');

      return;
    }

    const inputValue = formatVal(cellInput.value);

    cell.innerHTML = inputValue;
  };
}

setOrderTrue([...thList]);
thead.addEventListener('click', sortColumn);
tbody.addEventListener('click', selectRow);
submit.addEventListener('click', addEmployee);
tbody.addEventListener('dblclick', inputText);
