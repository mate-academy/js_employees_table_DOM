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

  const nameInput = document.querySelector('input[name="name"]');
  const positionInput = document.querySelector('input[name="position"]');

  nameInput.value = nameInput.value.trim();
  positionInput.value = positionInput.value.trim();

  const data = new FormData(newEmployeeForm);

  const inputsData = Object.fromEntries(data.entries());

  const isValid = runFormValidation(inputsData);

  if (isValid) {
    const newEmployee = createNewEmployee(inputsData);

    const tBody = document.querySelector('table > tbody');

    tBody.append(newEmployee);

    newEmployeeForm.reset();
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
  const parsedToDecimal = parseInt(Math.abs(number), 10);

  if (parsedToDecimal < 1000) {
    return parsedToDecimal;
  }

  const thousands = parsedToDecimal / 1000;

  const numberAsString = String(thousands);

  const decimalIndex = numberAsString.indexOf('.');

  if (decimalIndex === -1) {
    return `${thousands},000`;
  }

  const wholelPart = numberAsString.slice(0, decimalIndex);

  const fractionalPart = numberAsString.slice(decimalIndex + 1).padEnd(3, 0);

  return `${wholelPart},${fractionalPart}`;
}

employeesTable.addEventListener('dblclick', (e) => {
  const tableCell = e.target.closest('tbody > tr > td');

  if (tableCell) {
    editTableCell(tableCell);
  }
});

function editTableCell(cell) {
  const cellIndex = cell.cellIndex;

  const initialText = cell.innerText || cell.firstElementChild.value;

  const cellWidth = getComputedStyle(cell).width;

  cell.innerText = '';

  let input = document.createElement('input');

  if (cellIndex === 2) {
    input = document.createElement('select');

    input.insertAdjacentHTML('afterbegin', `
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
    `);
  }

  input.classList.add('cell-input');

  input.value = initialText;

  input.style.width = parseFloat(cellWidth) + 'px';

  cell.append(input);

  input.focus();

  input.addEventListener('input', (e) => {
    if (cellIndex !== 3) {
      input.style.width = input.scrollWidth + 'px';
    }

    if (cellIndex === 3 || cellIndex === 4) {
      input.value = input.value.replace(/[^0-9]/g, '');
    }

    if (cellIndex === 3) {
      input.value = Math.min(input.value, 100);
    }
  });

  input.addEventListener('blur', (e) => {
    let newValue = e.target.value.trim();

    if (cellIndex === 4) {
      newValue = newValue.replace(/[^0-9]/g, '');

      const newSalary = getFormattedNumber(newValue);

      newValue = `$${newSalary || initialText.slice(1)}`;
    }

    const textNode = document.createTextNode(newValue || initialText);

    input.replaceWith(textNode);
  });

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      input.blur();
    }
  });
}
