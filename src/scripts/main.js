const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

const sortState = {
  column: null,
  ascending: true,
};

let currentlyEditing = null;
let selectedRow = null;
let employees = [];

const employeeTable =
  document.getElementById('employee-table') || document.querySelector('table');
const tableBody =
  employeeTable.querySelector('tbody') || document.createElement('tbody');
const tableHead =
  employeeTable.querySelector('thead') || document.createElement('thead');

function extractEmployeesFromDOM() {
  const rows = tableBody.querySelectorAll('tr');
  const extractedEmployees = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');

    if (cells.length >= 5) {
      const salaryText = cells[4].textContent;
      const salaryValue = parseInt(salaryText.replace(/[$,]/g, ''));

      extractedEmployees.push({
        name: cells[0].textContent,
        position: cells[1].textContent,
        office: cells[2].textContent,
        age: parseInt(cells[3].textContent),
        salary: salaryValue,
      });
    }
  });

  return extractedEmployees;
}

function initializeTable() {
  if (!tableHead.querySelector('tr')) {
    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Position', 'Office', 'Age', 'Salary'];

    headers.forEach((headerText) => {
      const headerCell = document.createElement('th');

      headerCell.textContent = headerText;

      headerCell.addEventListener('click', () => {
        sortTable(headerText.toLowerCase());
      });

      headerRow.appendChild(headerCell);
    });

    tableHead.appendChild(headerRow);
    employeeTable.appendChild(tableHead);
  }

  const extractedEmployees = extractEmployeesFromDOM();

  if (extractedEmployees.length > 0) {
    employees = extractedEmployees;
  }

  renderEmployees();
  employeeTable.appendChild(tableBody);

  if (!document.querySelector('.new-employee-form')) {
    createEmployeeForm();
  }
}

function renderEmployees() {
  tableBody.innerHTML = '';

  employees.forEach((employee) => {
    const row = document.createElement('tr');

    Object.keys(employee).forEach((key) => {
      const cell = document.createElement('td');

      if (key === 'salary') {
        cell.textContent = `$${employee[key].toLocaleString()}`;
      } else {
        cell.textContent = employee[key];
      }

      cell.addEventListener('dblclick', (e) => editCell(e, key, employee));

      row.appendChild(cell);
    });

    row.addEventListener('click', () => selectRow(row));

    tableBody.appendChild(row);
  });
}

function sortTable(column) {
  if (sortState.column === column) {
    sortState.ascending = !sortState.ascending;
  } else {
    sortState.column = column;
    sortState.ascending = true;
  }

  employees.sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortState.ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortState.ascending ? valueA - valueB : valueB - valueA;
  });

  renderEmployees();
}

function selectRow(row) {
  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  row.classList.add('active');
  selectedRow = row;
}

function editCell(evenT, key, employee) {
  if (currentlyEditing) {
    finishEditing(false);
  }

  const cell = evenT.target;
  const originalValue = key === 'salary' ? employee[key] : cell.textContent;

  currentlyEditing = {
    cell,
    key,
    employee,
    originalValue,
  };

  const input = document.createElement('input');

  input.className = 'cell-input';

  input.value = key === 'salary' ? employee[key] : cell.textContent;

  if (key === 'age' || key === 'salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => finishEditing(true));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishEditing(true);
    } else if (e.key === 'Escape') {
      finishEditing(false);
    }
  });
}

function finishEditing(saveChanges) {
  if (!currentlyEditing) {
    return;
  }

  const { cell, key, employee, originalValue } = currentlyEditing;
  const input = cell.querySelector('input');

  if (saveChanges && input.value.trim() !== '') {
    if (key === 'age') {
      employee[key] = parseInt(input.value);
    } else if (key === 'salary') {
      employee[key] = parseFloat(input.value);
    } else {
      employee[key] = input.value;
    }

    cell.textContent =
      key === 'salary' ? `$${employee[key].toLocaleString()}` : employee[key];
  } else {
    employee[key] = originalValue;

    cell.textContent =
      key === 'salary' ? `$${originalValue.toLocaleString()}` : originalValue;
  }

  currentlyEditing = null;
}

function createEmployeeForm() {
  const formContainer = document.createElement('div');

  formContainer.className = 'new-employee-form';

  const form = document.createElement('form');

  const nameLabel = document.createElement('label');

  nameLabel.innerHTML = 'Name: ';

  const nameInput = document.createElement('input');

  nameInput.name = 'name';
  nameInput.type = 'text';
  nameInput.setAttribute('data-qa', 'name');
  nameInput.required = true;
  nameLabel.appendChild(nameInput);
  form.appendChild(nameLabel);

  const positionLabel = document.createElement('label');

  positionLabel.innerHTML = 'Position: ';

  const positionInput = document.createElement('input');

  positionInput.name = 'position';
  positionInput.type = 'text';
  positionInput.setAttribute('data-qa', 'position');
  positionInput.required = true;
  positionLabel.appendChild(positionInput);
  form.appendChild(positionLabel);

  const officeLabel = document.createElement('label');

  officeLabel.innerHTML = 'Office: ';

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.setAttribute('data-qa', 'office');
  officeSelect.required = true;

  offices.forEach((office) => {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;
    officeSelect.appendChild(option);
  });

  officeLabel.appendChild(officeSelect);
  form.appendChild(officeLabel);

  const ageLabel = document.createElement('label');

  ageLabel.innerHTML = 'Age: ';

  const ageInput = document.createElement('input');

  ageInput.name = 'age';
  ageInput.type = 'number';
  ageInput.setAttribute('data-qa', 'age');
  ageInput.required = true;
  ageLabel.appendChild(ageInput);
  form.appendChild(ageLabel);

  const salaryLabel = document.createElement('label');

  salaryLabel.innerHTML = 'Salary: ';

  const salaryInput = document.createElement('input');

  salaryInput.name = 'salary';
  salaryInput.type = 'number';
  salaryInput.setAttribute('data-qa', 'salary');
  salaryInput.required = true;
  salaryLabel.appendChild(salaryInput);
  form.appendChild(salaryLabel);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  submitButton.style.width = '100%';
  form.appendChild(submitButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addNewEmployee(form);
  });

  formContainer.appendChild(form);
  document.body.appendChild(formContainer);
}

function addNewEmployee(form) {
  const namE = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value);
  const salary = parseFloat(form.elements.salary.value);

  if (namE.length < 4) {
    showNotification(
      'Name too short',
      'Name must be at least 4 characters long',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Invalid age', 'Age must be between 18 and 90', 'error');

    return;
  }

  employees.push({
    name: namE,
    position,
    office,
    age,
    salary,
  });

  renderEmployees();
  form.reset();

  showNotification('Success', 'New employee added successfully', 'success');
}

function showNotification(title, message, type) {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h3');

  notificationTitle.textContent = title;

  const notificationMessage = document.createElement('p');

  notificationMessage.textContent = message;

  const closeButton = document.createElement('button');

  closeButton.className = 'close-btn';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => notification.remove());

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationMessage);
  notification.appendChild(closeButton);

  document.body.appendChild(notification);

  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.remove();
    }
  }, 5000);
}

document.addEventListener('DOMContentLoaded', initializeTable);
