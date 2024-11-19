'use strict';

// write code here
const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = table.querySelector('tbody');
const rows = [...table.querySelectorAll('tbody tr')];
const headerCells = thead.querySelectorAll('th');

// 1) SORTING BY CLICKING ON TABLE HEADER NAME
let isAscending = true;
let lastClicked = null;

// Name sorting
headerCells[0].addEventListener('click', () => {
  if (lastClicked !== 0) {
    isAscending = true;
    lastClicked = 0;
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const nameA = rowA.querySelector('td:nth-child(1)').textContent.trim();
    const nameB = rowB.querySelector('td:nth-child(1)').textContent.trim();

    return isAscending
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => tbody.appendChild(row));

  isAscending = !isAscending;
});

// position sorting
headerCells[1].addEventListener('click', () => {
  if (lastClicked !== 1) {
    isAscending = true;
    lastClicked = 1;
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const posA = rowA.querySelector('td:nth-child(2)').textContent.trim();
    const posB = rowB.querySelector('td:nth-child(2)').textContent.trim();

    return isAscending ? posA.localeCompare(posB) : posB.localeCompare(posA);
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => tbody.appendChild(row));

  isAscending = !isAscending;
});

// office sorting
headerCells[2].addEventListener('click', () => {
  if (lastClicked !== 2) {
    isAscending = true;
    lastClicked = 2;
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const offA = rowA.querySelector('td:nth-child(3)').textContent.trim();
    const offB = rowB.querySelector('td:nth-child(3)').textContent.trim();

    return isAscending ? offA.localeCompare(offB) : offB.localeCompare(offA);
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => tbody.appendChild(row));

  isAscending = !isAscending;
});

// age sorting
headerCells[3].addEventListener('click', () => {
  if (lastClicked !== 3) {
    isAscending = true;
    lastClicked = 3;
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const ageA = parseInt(
      rowA.querySelector('td:nth-child(4)').textContent.trim(),
      10,
    );
    const ageB = parseInt(
      rowB.querySelector('td:nth-child(4)').textContent.trim(),
      10,
    );

    return isAscending ? ageA - ageB : ageB - ageA;
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => tbody.appendChild(row));

  isAscending = !isAscending;
});

// salary sorting
headerCells[4].addEventListener('click', () => {
  if (lastClicked !== 4) {
    isAscending = true;
    lastClicked = 4;
  }

  const sortedRows = rows.sort((rowA, rowB) => {
    const salA = parseInt(
      rowA
        .querySelector('td:nth-child(5)')
        .textContent.trim()
        .replace(/[$,]/g, ''),
      10,
    );
    const salB = parseInt(
      rowB
        .querySelector('td:nth-child(5)')
        .textContent.trim()
        .replace(/[$,]/g, ''),
      10,
    );

    return isAscending ? salA - salB : salB - salA;
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => tbody.appendChild(row));

  isAscending = !isAscending;
});

// 2) ACTIVE SELECTED ROW
rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

// 3) CREATING FORM
const form = document.createElement('form');

form.classList.add('new-employee-form');

// creating inputs
const inputs = [
  {
    label: 'Name:',
    name: 'name',
    type: 'text',
    qa: 'name',
  },

  {
    label: 'Position:',
    name: 'position',
    type: 'text',
    qa: 'position',
  },

  {
    label: 'Age:',
    name: 'age',
    type: 'number',
    qa: 'age',
  },

  {
    label: 'Salary:',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

inputs.forEach((input) => {
  const label = document.createElement('label');

  label.textContent = input.label;

  const inputElement = document.createElement('input');

  inputElement.name = input.name;
  inputElement.type = input.type;
  inputElement.setAttribute('data-qa', input.qa);

  label.appendChild(inputElement);
  form.appendChild(label);
  form.appendChild(document.createElement('br'));
});

// creating select for office

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office:';

const select = document.createElement('select');

select.name = 'office';
select.setAttribute('data-qa', 'office');

[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  select.appendChild(option);
});

officeLabel.appendChild(select);
form.appendChild(officeLabel);
form.appendChild(document.createElement('br'));

document.body.appendChild(form);

// creating button

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.appendChild(submitButton);

form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form values
  const formName = form.querySelector('input[name="name"]').value.trim();
  const formPosition = form
    .querySelector('input[name="position"]')
    .value.trim();
  const formAge = parseInt(
    form.querySelector('input[name="age"]').value.trim(),
    10,
  );
  const formSalary = parseInt(
    form
      .querySelector('input[name="salary"]')
      .value.trim()
      .replace(/[$,]/g, ''),
    10,
  );
  const formOffice = form.querySelector('select[name="office"]').value;

  // Validate all fields are filled
  if (
    !formName ||
    !formPosition ||
    !formOffice ||
    isNaN(formAge) ||
    isNaN(formSalary)
  ) {
    createNotification('All fields are required.', 'error');

    return;
  }

  // Validate Name: must be at least 4 characters long
  if (formName.length < 4) {
    createNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  // Validate Age: must be between 18 and 90
  if (formAge < 18 || formAge > 90) {
    createNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  // Create new row in the table
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
  <td>${formName}</td>
  <td>${formPosition}</td>
  <td>${formOffice}</td>
  <td>${formAge}</td>
  <td>$${formSalary.toLocaleString()}</td>
  `;

  tbody.appendChild(newRow);
  rows.push(newRow);

  // Reset form
  form.reset();
  createNotification('Employee added successfully!', 'success');
});

// 4) CREATE NOTIFICATION
function createNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const title = document.createElement('h3');
  const description = document.createElement('p');

  title.textContent = type === 'error' ? 'Error!' : 'Success!';
  description.textContent = message;

  notification.appendChild(title);
  notification.appendChild(description);

  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
