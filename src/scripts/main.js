'use strict';

const employeesTable = document.querySelector('table');
let previousHeader;

employeesTable.addEventListener('click', (e) => {
  const header = e.target.closest('thead > tr > th');
  const tableRow = e.target.closest('tbody > tr');

  if (header) {
    const secondClick = previousHeader === header;

    const tableBody = document.querySelector('tbody');
    const index = header.cellIndex;

    const sortedTable = sortTable(tableBody.children, index, secondClick);

    tableBody.append(...sortedTable);

    previousHeader = header;

    if (secondClick) {
      previousHeader = null;
    }
  }

  if (tableRow) {
    for (const row of employeesTable.rows) {
      row.classList.remove('active');
    }

    tableRow.classList.add('active');
  }
});

function sortTable([...rows], index, wasClicked) {
  const bySalary = index === 4;

  rows.sort((a, b) => {
    const dataA = a.cells[index].innerText;
    const dataB = b.cells[index].innerText;

    if (bySalary) {
      const normalize = (data) => data.slice(1).replace(',', '');

      return wasClicked
        ? normalize(dataB) - normalize(dataA)
        : normalize(dataA) - normalize(dataB);
    }

    return wasClicked
      ? dataB.localeCompare(dataA)
      : dataA.localeCompare(dataB);
  });

  return rows;
}

const newEmployeeForm = createAndPopulateForm();

employeesTable.after(newEmployeeForm);

function createAndPopulateForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  addFormInputs(form);

  addFormSelect(form);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';

  submitButton.innerText = 'Save to table';

  form.append(submitButton);

  return form;
}

function addFormInputs(form) {
  const inputData = {
    Name: ['name', 'text'],
    Position: ['position', 'text'],
    Age: ['age', 'number'],
    Salary: ['salary', 'number'],
  };

  for (const key in inputData) {
    const nameAttr = 0;
    const typeAttr = 1;

    const label = document.createElement('label');
    const input = document.createElement('input');

    input.setAttribute('name', `${inputData[key][nameAttr]}`);

    input.setAttribute('type', `${inputData[key][typeAttr]}`);

    input.dataset.qa = `${inputData[key][nameAttr]}`;

    input.required = true;

    label.innerText = `${key}: `;

    label.append(input);

    form.append(label);
  }
}

function addFormSelect(form) {
  const selectLabel = document.createElement('label');

  selectLabel.insertAdjacentHTML('afterbegin',
    `
    <select name="office" data-qa="office" required>
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
    </select>
    `
  );

  selectLabel.prepend('Office: ');

  form.position.parentElement.after(selectLabel);
}

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(newEmployeeForm);

  const inputsData = Object.fromEntries(data.entries());

  const isValid = runFormValidation(inputsData);

  if (isValid) {
    const newEmployee = createNewEmployee(inputsData);

    const tBody = document.querySelector('table > tbody');

    tBody.append(newEmployee);
  }
});

function runFormValidation(formData) {
  const validName = formData['name'].length >= 4;
  const validAge = formData['age'] >= 18 && formData['age'] <= 90;

  if (!validName) {
    const description = 'Name should consist of minimum 4 characters';
    const title = 'Name is too short';

    appendPushNotification(description, title, 'error');
  }

  if (!validAge) {
    const description = 'Age must be not less than 18 and not greater than 90';
    const title = 'Age is out of range';

    appendPushNotification(description, title, 'error');
  }

  if (validName && validAge) {
    const description = 'Employee added to the table';
    const title = 'Success!';

    appendPushNotification(description, title, 'success');

    return true;
  }
}

function appendPushNotification(description, title, type) {
  const messageOnScreen = document.querySelector('.notification:last-of-type');

  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  messageTitle.classList.add('title');
  messageTitle.innerText = title;

  messageDescription.innerText = description;

  if (messageOnScreen) {
    const topOffset = messageOnScreen.offsetTop + messageOnScreen.offsetHeight;

    message.style.top = topOffset + 10 + 'px';
  }

  message.classList.add('notification');
  message.classList.add(type);

  message.dataset.qa = 'notification';

  message.append(messageTitle);
  message.append(messageDescription);

  document.body.append(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
}

function createNewEmployee(employeeData) {
  const tr = document.createElement('tr');

  for (const key in employeeData) {
    const td = document.createElement('td');

    td.innerText = employeeData[key];

    if (key === 'salary') {
      const formatted = getFormattedNumber(employeeData[key]);

      td.innerText = `$${formatted}`;
    }

    tr.append(td);
  }

  return tr;
}

function getFormattedNumber(number) {
  const thousands = number / 1000;

  if ((number % 10 === 0) && (number < 1000)) {
    const dotIndex = `${thousands}`.indexOf('.');
    const beforeDot = `${thousands}`.slice(0, dotIndex);
    const afterDot = `${thousands}`.slice(dotIndex + 1);

    return `${beforeDot},${afterDot.padEnd(3, 0)}`;
  }

  if ((number % 10 === 0) && (number >= 1000)) {
    return `${thousands},000`;
  }

  return `${thousands}`.replace('.', ',');
}

employeesTable.addEventListener('dblclick', (e) => {
  const tableCell = e.target.closest('tbody > tr > td');

  if (tableCell) {
    editTableCell(tableCell);
  }
});

function editTableCell(cell) {
  const initialText = cell.innerText || cell.firstElementChild.value;

  const cellWidth = getComputedStyle(cell).width;

  cell.innerText = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');

  input.value = initialText;

  input.style.width = parseFloat(cellWidth) + 'px';

  cell.append(input);

  input.focus();

  input.addEventListener('blur', (e) => {
    const textNode = document.createTextNode(e.target.value || initialText);

    input.replaceWith(textNode);
  });

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      input.blur();
    }
  });
}
