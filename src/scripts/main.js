'use strict';

// Create and append the form
const form = document.createElement('form');

form.classList.add('new-employee-form');

const body = document.querySelector('body');

body.append(form);

// Create and append the table if it doesn't exist
const table = document.querySelector('table');

const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

// Initialize sorting variables
let sortedColumn = null;
let sortOrder = 'asc';

// Add form elements
const formName = `
  <label>
    Name:
    <input name="name" data-qa="name" type="text" required>
  </label>
`;

const formPosition = `
  <label>
    Position:
    <input name="position" data-qa="position" type="text">
  </label>
`;
const formOffice = `<label>Office: <select name='office' data-qa='office'> <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option></select></label>`;
const formAge =
  '<label>Age: <input name="age" data-qa="age" type="number" required></label>';
const formSalary = `
  <label>
    Salary:
    <input name="salary" data-qa="salary" type="number" required>
  </label>
`;
const formButton = `<button type="submit">Save to table</button>`;

form.insertAdjacentHTML('afterbegin', formButton);
form.insertAdjacentHTML('afterbegin', formSalary);
form.insertAdjacentHTML('afterbegin', formAge);
form.insertAdjacentHTML('afterbegin', formOffice);
form.insertAdjacentHTML('afterbegin', formPosition);
form.insertAdjacentHTML('afterbegin', formName);

// Helper function to format numbers as currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.querySelector('input[name="name"]');
  const ageInput = form.querySelector('input[name="age"]');
  const positionInput = form.querySelector('input[name="position"]');
  const officeSelect = form.querySelector('select[name="office"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  document
    .querySelectorAll('.notification')
    .forEach((notification) => notification.remove());

  let hasNameError = false;
  let hasAgeError = false;

  if (nameInput.value.length < 4) {
    const nameError = document.createElement('div');

    nameError.classList.add('notification', 'error', 'title');
    nameError.setAttribute('data-qa', 'notification');
    nameError.textContent = 'Error, name must be minimum 4 letters';
    body.append(nameError);

    setTimeout(() => {
      nameError.remove();
    }, 2000);

    hasNameError = true;
  }

  if (!hasNameError && (ageInput.value < 18 || ageInput.value > 90)) {
    const ageError = document.createElement('div');

    ageError.classList.add('notification', 'error', 'title');
    ageError.setAttribute('data-qa', 'notification');
    ageError.textContent = 'Error, age must be 18-90 years';
    body.append(ageError);

    setTimeout(() => {
      ageError.remove();
    }, 2000);

    hasAgeError = true;
  }

  const positionError = !positionInput.value.trim();
  const officeError = !officeSelect.value;
  const salaryError = salaryInput.value <= 0 || isNaN(salaryInput.value);

  if (positionError && !hasNameError && !hasAgeError) {
    const positionErrorNotification = document.createElement('div');

    positionErrorNotification.classList.add('notification', 'error', 'title');
    positionErrorNotification.setAttribute('data-qa', 'notification');
    positionErrorNotification.textContent = 'Error, position is required';
    body.append(positionErrorNotification);

    setTimeout(() => {
      positionErrorNotification.remove();
    }, 2000);
  }

  if (
    positionError ||
    officeError ||
    salaryError ||
    hasNameError ||
    hasAgeError
  ) {
    return;
  }

  const successNotification = document.createElement('div');

  successNotification.classList.add('notification', 'success', 'title');
  successNotification.setAttribute('data-qa', 'notification');

  successNotification.textContent =
    'Success! All fields are correctly filled and submitted.';
  body.append(successNotification);

  setTimeout(() => {
    successNotification.remove();
  }, 2000);

  const newRow = tableBody.insertRow();

  newRow.insertCell().textContent = nameInput.value;
  newRow.insertCell().textContent = positionInput.value;
  newRow.insertCell().textContent = officeSelect.value;
  newRow.insertCell().textContent = ageInput.value;
  newRow.insertCell().textContent = formatCurrency(salaryInput.value);

  form.reset();
});

tableHead.addEventListener('click', (e) => {
  const th = e.target;
  const index = Array.from(th.parentElement.children).indexOf(th);

  if (index < 0) {
    return;
  }

  if (index === sortedColumn) {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    sortedColumn = index;
    sortOrder = 'asc';
  }

  const rowsTable = Array.from(tableBody.querySelectorAll('tr'));

  const sortedRows = rowsTable.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.trim();
    const cellB = rowB.cells[index].textContent.trim();

    switch (index) {
      case 0:
      case 1:
      case 2:
        return cellA.localeCompare(cellB);

      case 3:
        return +cellA - +cellB;

      case 4:
        return (
          parseFloat(cellA.replace(/[^0-9.-]+/g, '')) -
          parseFloat(cellB.replace(/[^0-9.-]+/g, ''))
        );

      default:
        return 0;
    }
  });

  if (sortOrder === 'desc') {
    sortedRows.reverse();
  }

  tableBody.innerHTML = '';
  tableBody.append(...sortedRows);

  tableHead.querySelectorAll('th').forEach((header, i) => {
    header.classList.toggle('active', i === sortedColumn);
  });
});

tableBody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  if (!target) {
    return;
  }

  tableBody
    .querySelectorAll('tr')
    .forEach((row) => row.classList.remove('active'));
  target.classList.add('active');
});
