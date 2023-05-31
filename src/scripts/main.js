'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const form = document.createElement('form');
const thead = table.querySelector('thead tr');
const tbody = table.querySelector('tbody');
const tableRows = document.querySelectorAll('table tbody tr');

const sortState = {
  column: null,
  order: 'asc',
};
let selectedElement = null;

let employees = [];

tbody.addEventListener('dblclick', (even) => {
  const selectedElementDblClick = even.target;

  if (selectedElementDblClick.tagName === 'TD') {
    const currentValue = selectedElementDblClick.textContent;

    const input = document.createElement('input');

    input.type = 'text';
    input.value = currentValue;

    selectedElementDblClick.textContent = '';
    selectedElementDblClick.appendChild(input);

    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value;

      selectedElementDblClick.textContent = newValue;

      getEmployeeDataFromRow();
      updateTable();
    });
  }
});

thead.addEventListener('click', even => {
  const targetHeader = even.target;

  const headerIndex = Array.from(thead.children).indexOf(targetHeader);

  if (sortState.column !== headerIndex) {
    sortState.order = 'asc';
  } else {
    sortState.order = sortState.order === 'asc' ? 'desc' : 'asc';
  }

  sortState.column = headerIndex;

  const sortRows = Array.from(document.querySelectorAll('table tbody tr'));

  sortRows.sort((a, b) => {
    const aTextContent = a.children[headerIndex].textContent;
    const bTextContent = b.children[headerIndex].textContent;

    if (targetHeader.innerHTML === 'Salary') {
      return (+formatSalary(aTextContent) - +formatSalary(bTextContent))
        * (sortState.order === 'asc' ? 1 : -1);
    }

    return (aTextContent.localeCompare(bTextContent))
      * (sortState.order === 'asc' ? 1 : -1);
  });

  tbody.innerHTML = '';

  sortRows.forEach(row => {
    tbody.appendChild(row);
  });
});

tbody.addEventListener('click', (even) => {
  const target = even.target;

  if (selectedElement && selectedElement.classList.contains('active')) {
    selectedElement.classList.remove('active');
  }

  selectedElement = target.closest('tr');
  selectedElement.classList.add('active');
});

(function createForm() {
  form.classList.add('new-employee-form');
  form.setAttribute('action', '#');
  form.setAttribute('method', 'post');

  table.after(form);

  form.insertAdjacentHTML('beforeend',
    `<label>Name:
      <input
        name="name"
        type="text"
        required
        data-qa="name">
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
        required
        data-qa="position"
      >
    </label>
    <label>Office:
      <select
        name="office"
        required
        data-qa="office"
      >
        <option value="" disabled selected></option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input
        name="age"
        type="number"
        required
        data-qa="age"
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        type="number"
        required
        data-qa="salary"
      >
    </label>
  <button type="submit">Save to table</button>`);
})();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const officeSelect = form.querySelector('select[name="office"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  const nam = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value.trim();
  const age = parseInt(ageInput.value.trim());
  const salary = salaryInput.value.trim();

  let isValid = true;
  let errorMessage = '';

  if (!isValidName(nam)) {
    isValid = false;
    errorMessage += '- Name should have at least 4 letters.\n';
  }

  if (!isValidAge(age)) {
    isValid = false;
    errorMessage += '- Age should be between 18 and 90.\n';
  }

  if (!isValidSalary(salary)) {
    isValid = false;
    errorMessage += '- Salary should be a valid number.\n';
  }

  if (!isValid) {
    pushNotification('Error', errorMessage, 'error');

    return;
  }

  const employee = {
    nam,
    position,
    office,
    age,
    salary,
  };

  employees.push(employee);
  updateTable();

  form.reset();

  pushNotification('Success', 'New employee has been added.', 'success');
});

function getEmployeeDataFromRow() {
  if (employees.length > 0) {
    employees = [];
  }

  tableRows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    const nam = cells[0].textContent;
    const position = cells[1].textContent;
    const office = cells[2].textContent;
    const age = parseInt(cells[3].textContent);
    const salary = formatSalary(cells[4].textContent);

    const employee = {
      nam,
      position,
      office,
      age,
      salary,
    };

    employees.push(employee);
  });
}

getEmployeeDataFromRow();

function pushNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);

  notification.innerHTML = `
    <h2>${title}</h2>
    <p>${description}</p>
  `;

  body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};

function isValidName(nam) {
  return nam.length >= 4;
};

function isValidAge(age) {
  return age >= 18 && age <= 90;
};

function isValidSalary(salary) {
  return !isNaN(salary);
};

function addEmployeeToTable(employee) {
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employee.nam}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>${formatCurrency(employee.salary)}</td>
  `;
  tbody.appendChild(newRow);
};

function updateTable() {
  tbody.innerHTML = '';

  employees.forEach((employee) => {
    addEmployeeToTable(employee);
  });
};

function formatSalary(string) {
  return string.replace(/[$,]/g, '');
};

function formatCurrency(numberString) {
  const number = Number(numberString);

  if (isNaN(number)) {
    return 'Invalid number';
  }

  const formattedNumber = number.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formattedNumber;
};
