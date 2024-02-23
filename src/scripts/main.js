'use strict';

const tbody = document.querySelector('tbody');
const body = document.querySelector('body');
const header = document.querySelector('thead');
const rowsCollection = tbody.querySelectorAll('tr');

const sortState = {};

header.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const sortBy = e.target.textContent;

    const currentState = sortState[sortBy];

    sortState[sortBy] = currentState === 'asc' ? 'desc' : 'asc';

    const rows = [...rowsCollection];

    switch (sortBy) {
      case 'Name':
        sortRows(rows, compareTextValues(0, sortState[sortBy]));
        break;

      case 'Position':
        sortRows(rows, compareTextValues(1, sortState[sortBy]));
        break;

      case 'Office':
        sortRows(rows, compareTextValues(2, sortState[sortBy]));
        break;

      case 'Age':
        sortRows(rows, compareNumericValues(3, sortState[sortBy]));
        break;

      case 'Salary':
        sortRows(rows, compareSalaryValues(4, sortState[sortBy]));
        break;

      default:
        break;
    }

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.append(row));
  }
});

tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  rowsCollection.forEach(
    (row) => row !== clickedRow && row.classList.remove('active'),
  );
  
  clickedRow.classList.toggle('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.method = 'post';

form.innerHTML = `
<label>Name: <input data-qa="name" name="name" type="text" required></label>
<label>Position: <input
  data-qa="position" name="position" type="text" required></label>
<label>Office: <select data-qa="office" name="office">
  <option>Tokyo</option>
  <option>Singapore</option>
  <option>London</option>
  <option>New York</option>
  <option>Edinburgh</option>
  <option>San Francisco</option>
  </select>
</label>
<label>Age: <input
  data-qa="age" name="age" type="number" required></label>
<label>Salary:
  <input data-qa="salary" name="salary" type="number" required>
</label>
<button type="submit">Save to table</button>
`;

body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const formName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = parseInt(formData.get('age'));
  const salary = parseSalary(formData.get('salary'));

  if (formName.length < 4) {
    pushNotification(
      10,
      10,
      'Error',
      'Name must be at least 4 characters long.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      10,
      10,
      'Error',
      'Age must be between 18 and 90.',
      'error',
    );

    return;
  }

  if (!Number.isFinite(salary) || salary <= 0) {
    pushNotification(10, 10, 'Error', 'Invalid salary value.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${formName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(newRow);

  pushNotification(
    10,
    10,
    'Success',
    'New employee added successfully.',
    'success',
  );

  form.reset();
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.className = `notification ${type}`;
  notificationTitle.classList.add('title');

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';
  notificationTitle.textContent = title;
  notificationDescription.textContent = description;

  notification.append(notificationTitle, notificationDescription);
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 2000);
};

function sortRows(rows, comparator) {
  rows.sort(comparator);
}

function compareTextValues(columnIndex, sortOrder) {
  return (r1, r2) => {
    const value1 = r1.cells[columnIndex].textContent.trim();
    const value2 = r2.cells[columnIndex].textContent.trim();

    return sortOrder === 'asc'
      ? value1.localeCompare(value2)
      : value2.localeCompare(value1);
  };
}

function compareNumericValues(columnIndex, sortOrder) {
  return (r1, r2) => {
    const value1 = +r1.cells[columnIndex].textContent;
    const value2 = +r2.cells[columnIndex].textContent;

    return sortOrder === 'asc' ? value1 - value2 : value2 - value1;
  };
}

function compareSalaryValues(columnIndex, sortOrder) {
  return (r1, r2) => {
    const value1 = parseSalary(r1.cells[columnIndex].textContent);
    const value2 = parseSalary(r2.cells[columnIndex].textContent);

    return sortOrder === 'asc' ? value1 - value2 : value2 - value1;
  };
}

function parseSalary(salaryString) {
  return parseFloat(salaryString.replace(/[^0-9.-]+/g, ''));
}
