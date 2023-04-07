'use strict';

const body = document.querySelector('body');
const tableHeader = document.querySelector('thead');
const employeeDataTable = document.querySelector('tbody');

tableHeader.addEventListener('click', e => {
  [...tableHeader.firstElementChild.children].forEach((button) => {
    if (button !== e.target) {
      button.removeAttribute('data-dir');
    }
  });

  if (e.target.getAttribute('data-dir') === 'desc') {
    sortEmployeeTableByColumn(e.target.cellIndex,
      e.target.innerText, 'desc');

    e.target.setAttribute('data-dir', 'asc');
  } else {
    sortEmployeeTableByColumn(e.target.cellIndex,
      e.target.innerText, 'asc');

    e.target.setAttribute('data-dir', 'desc');
  }
});

function sortEmployeeTableByColumn(columnNumber, columnTitle, direction) {
  const employeeInfo = Array.from(employeeDataTable.rows);

  const compareEmployees = function(firstPerson, secondPerson) {
    const firstPersonData = firstPerson.cells[columnNumber].innerHTML;
    const secondPersonData = secondPerson.cells[columnNumber].innerHTML;

    switch (columnTitle) {
      case 'Name':
      case 'Position':
      case 'Office':
        if (direction === 'asc') {
          return firstPersonData.localeCompare(secondPersonData);
        }

        return secondPersonData.localeCompare(firstPersonData);

      case 'Age':
        if (direction === 'asc') {
          return firstPersonData - secondPersonData;
        }

        return secondPersonData - firstPersonData;

      case 'Salary':
        if (direction === 'asc') {
          return parseSalaryStringToNumber(firstPersonData)
            - parseSalaryStringToNumber(secondPersonData);
        }

        return parseSalaryStringToNumber(secondPersonData)
          - parseSalaryStringToNumber(firstPersonData);
    }
  };

  employeeInfo.sort(compareEmployees);

  employeeDataTable.append(...employeeInfo);
}

function parseSalaryStringToNumber(salaryString) {
  return salaryString.slice(1).split(',').join('');
}

let activeRow;

employeeDataTable.addEventListener('click', e => {
  const clickedRow = e.target.parentNode;

  highlightSelectedRow(clickedRow);
});

function highlightSelectedRow(selectedRow) {
  if (activeRow) {
    activeRow.removeAttribute('class');
  }
  activeRow = selectedRow;
  activeRow.classList.add('active');
}

const newEmployeeForm = document.createElement('form');

newEmployeeForm.className = 'new-employee-form';
body.append(newEmployeeForm);

const selectBoxOptions = `
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
  </option>`;

newEmployeeForm.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name">
  </label>

  <label>
    Position:
    <input name="position" type="text" data-qa="position">
  </label>

  <label>
    Office:
    <select name="office" data-qa="office">
      ${selectBoxOptions}
    </select>
  </label>

  <label>
    Age:
    <input name="age" type="number" data-qa="age">
  </label>

  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>

  <button type="submit">
    Save to table
  </button>
`;

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = newEmployeeForm.name.value;
  const positionInput = newEmployeeForm.position.value;
  const officeInput = newEmployeeForm.office.value;
  const ageInput = newEmployeeForm.age.value;
  const salaryInput = newEmployeeForm.salary.value;

  if (nameInput.length < 4
      || +ageInput < 18
      || +ageInput > 90
      || positionInput === '') {
    showNotification('error', 'Check your information.');
  } else {
    const newEmployeeInfo = [nameInput, positionInput, officeInput,
      ageInput, `$${(+salaryInput).toLocaleString('en-US')}`];

    submitForm(newEmployeeInfo);
  }
});

function submitForm(newEmployeeInfo) {
  const rowForNewEmployee = document.createElement('tr');

  employeeDataTable.append(rowForNewEmployee);

  newEmployeeInfo.forEach((personData) => {
    const cellForPersonData = document.createElement('td');
    const personDataText = document.createTextNode(personData);

    cellForPersonData.appendChild(personDataText);
    rowForNewEmployee.appendChild(cellForPersonData);
  });

  showNotification('success', 'New employee was added!');
}

function showNotification(notificationTitle, notificationMessage) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', notificationTitle);

  notification.insertAdjacentHTML('beforeend', `
    <h2 class="title title">
    ${notificationTitle.charAt(0).toUpperCase()
      + notificationTitle.slice(1)}
    </h2>

    <p>
    ${notificationMessage}
    </p>
  `);

  body.append(notification);

  if (notificationTitle === 'success') {
    newEmployeeForm.reset();
  }

  setTimeout(() =>
    notification.remove(), 3000);
}

let editableArea = null;

employeeDataTable.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  editCell(e.target);
});

function editCell(selectedCell) {
  const temp = selectedCell.innerHTML;

  switch (selectedCell.cellIndex) {
    case 0:
    case 1:
      editableArea = document.createElement('input');
      break;
    case 2:
      editableArea = document.createElement('select');

      editableArea.innerHTML = selectBoxOptions;
      break;
    case 3:
    case 4:
      editableArea = document.createElement('input');
      editableArea.setAttribute('type', 'number');
      break;
  }
  editableArea.className = 'cell-input';
  selectedCell.innerHTML = '';

  selectedCell.appendChild(editableArea);
  editableArea.focus();

  editableArea.onkeydown = function(e) {
    if (e.key === 'Enter') {
      this.blur();
    }
  };

  editableArea.onblur = function() {
    if (editableArea.value.trim() === '') {
      editableArea.replaceWith(temp);
    } else if (selectedCell.cellIndex === 4) {
      selectedCell.innerHTML
        = `$${(+editableArea.value).toLocaleString('en-US')}`;
    } else {
      selectedCell.innerHTML = editableArea.value;
    }
    editableArea.replaceWith(selectedCell);
  };
}
