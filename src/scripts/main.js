'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

let currentSortColumn = null;
let currentSortDirection = 'asc';

thead.addEventListener('click', function (e) {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = [...th.parentNode.children].indexOf(th);

  if (currentSortColumn === columnIndex) {
    currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortDirection = 'asc';
  }

  currentSortColumn = columnIndex;

  const rows = [...tbody.querySelectorAll('tr')];

  rows.sort((rowA, rowB) => {
    const cellA = rowA.children[columnIndex].textContent.trim();
    const cellB = rowB.children[columnIndex].textContent.trim();

    const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
    const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));

    let result;

    if (!isNaN(numA) && !isNaN(numB)) {
      result = numA - numB;
    } else {
      result = cellA.localeCompare(cellB);
    }

    return currentSortDirection === 'asc' ? result : -result;
  });

  rows.forEach((row) => tbody.appendChild(row));
});

tbody.addEventListener('click', function (e) {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const previousActive = tbody.querySelector('tr.active');

  if (previousActive) {
    previousActive.classList.remove('active');
  }

  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name"></label>
<label>Position: <input name="position" type="text" data-qa="position"></label>
<label>
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
<label>Age: <input name="age" type="number" data-qa="age"></label>
<label>Salary: <input name="salary" type="number" data-qa="salary"></label>
<button type="submit">Save to table</button>
`;

document.body.appendChild(form);

function pushNotification(title, description, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput = form.querySelector('[data-qa="name"]');
  const positionInput = form.querySelector('[data-qa="position"]');
  const officeInput = form.querySelector('[data-qa="office"]');
  const ageInput = form.querySelector('[data-qa="age"]');
  const salaryInput = form.querySelector('[data-qa="salary"]');

  const nameInputValue = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeInput.value;
  const age = parseFloat(ageInput.value);
  const salary = parseFloat(salaryInput.value);

  let isValid = true;

  if (nameInputValue.length < 4) {
    pushNotification(
      'Error',
      'Name must be at least 4 characters long.',
      'error',
    );
    isValid = false;
  }

  if (position.length < 4) {
    pushNotification(
      'Error',
      'Position must be at least 4 characters long.',
      'error',
    );
    isValid = false;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    pushNotification(
      'Error',
      'Age must be a number between 18 and 90',
      'error',
    );
    isValid = false;
  }

  if (isNaN(salary) || salary <= 0) {
    pushNotification('Error', 'Salary must be a positive number.', 'error');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  const newRow = document.createElement('tr');
  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  [nameInputValue, position, office, age, formattedSalary].forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;
    newRow.appendChild(cell);
  });

  tbody.appendChild(newRow);

  pushNotification('Success', 'New employee added successfully.', 'success');

  form.reset();
});
