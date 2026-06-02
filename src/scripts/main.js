'use strict';

const table = document.querySelector('table');
let ascending = true;
let lastSortedColumn = null;

table.onclick = function (e) {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const columnIndex = e.target.cellIndex;

  if (lastSortedColumn === columnIndex) {
    ascending = !ascending;
  } else {
    ascending = true;
    lastSortedColumn = columnIndex;
  }

  sortTable(columnIndex);
};

function compareTextValues(textA, textB, asc = true) {
  if (asc) {
    return textA.localeCompare(textB);
  }

  return textB.localeCompare(textA);
}

function compareNumericValues(numA, numB, asc = true) {
  if (asc) {
    return numA - numB;
  }

  return numB - numA;
}

function parseCurrency(price) {
  return parseFloat(price.replace('$', '').replace(',', ''));
}

function compareCurrencyValues(priceA, priceB, asc = true) {
  const amountA = parseCurrency(priceA);
  const amountB = parseCurrency(priceB);

  if (asc) {
    return amountA - amountB;
  }

  return amountB - amountA;
}

function sortTable(columnIndex) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();

    if (cellA.includes('$')) {
      return compareCurrencyValues(cellA, cellB, ascending);
    }

    if (!isNaN(cellA)) {
      return compareNumericValues(cellA, cellB, ascending);
    }

    return compareTextValues(cellA, cellB, ascending);
  });

  rows.forEach((row) => {
    tbody.appendChild(row);
  });
}

const rowsElements = Array.from(document.querySelectorAll('tbody tr'));

rowsElements.forEach((rowElement) => {
  rowElement.addEventListener('click', () => {
    rowsElements.forEach((r) => r.classList.remove('active'));
    rowElement.classList.add('active');
  });
});

document.body.append(addNewEmployeeForm());

function addNewEmployeeForm(
  newEmployeeName = '',
  newEmployeePosition = '',
  newEmployeeOffice = 'Tokyo',
  newEmployeeAge = '',
  newEmployeeSalary = '',
) {
  const newEmployeeForm = document.createElement('form');

  newEmployeeForm.classList.add('new-employee-form');

  newEmployeeForm.innerHTML = `
    <label>Name: <input data-qa="name" name="name" type="text" value="${newEmployeeName}" /></label>
    <label>Position: <input data-qa="position" name="position" type="text" value="${newEmployeePosition}" /></label>
    <label>Office: <select data-qa="office" name="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select></label>
    <label>Age: <input data-qa="age" name="age" type="number" value="${newEmployeeAge}" /></label>
    <label>Salary: <input data-qa="salary" name="salary" type="number" value="${newEmployeeSalary}" /></label>
    <button type="submit">Save to table</button>
  `;

  newEmployeeForm.elements.office.value = newEmployeeOffice;

  newEmployeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    validateForm(newEmployeeForm);
  });

  return newEmployeeForm;
}

function showNotification(type, description) {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  let title = 'Error';

  if (type === 'success') {
    title = 'Success';
  }

  notification.innerHTML = `<span class="title">${title}</span> ${description}`;

  document.body.append(notification);
}

function formatSalary(salary) {
  return `$${Number(salary).toLocaleString('en-US')}`;
}

function addEmployeeToTable(employeeName, position, office, age, salary) {
  const tbody = document.querySelector('tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formatSalary(salary)}</td>
  `;

  tbody.appendChild(row);
}

function validateForm(newEmployeeForm) {
  const employeeName = newEmployeeForm.elements.name.value;
  const position = newEmployeeForm.elements.position.value;
  const office = newEmployeeForm.elements.office.value;
  const age = newEmployeeForm.elements.age.value;
  const salary = newEmployeeForm.elements.salary.value;

  if (!employeeName || !position || !office || !age || !salary) {
    showNotification('error', 'All fields are required');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('error', 'Name must be at least 4 characters long');

    return;
  }

  if (Number(age) < 18 || Number(age) > 90) {
    showNotification('error', 'Age must be between 18 and 90');

    return;
  }

  const ageValue = Number(age);
  const salaryValue = Number(salary);

  addEmployeeToTable(employeeName, position, office, ageValue, salaryValue);
  showNotification('success', 'Employee added successfully');
  newEmployeeForm.reset();
}

let currentlyEditingCell = null;

document.querySelector('tbody').addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  if (currentlyEditingCell) {
    return;
  }

  currentlyEditingCell = cell;

  const oldValue = cell.textContent;

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = oldValue;

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  function save() {
    let newValue = input.value.trim();

    if (newValue === '') {
      newValue = oldValue;
    }

    cell.textContent = newValue;
    currentlyEditingCell = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      save();
    }
  });
});
