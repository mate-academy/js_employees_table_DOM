'use strict';

const table = document.querySelector('table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');

let currentColumn = -1;
let isAscending = true;

function sortTable(columnIndex) {
  if (currentColumn === columnIndex) {
    isAscending = !isAscending;
  } else {
    currentColumn = columnIndex;
    isAscending = true;
  }

  const rows = Array.from(tableBody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    const valueA = rowA.cells[columnIndex].textContent.trim();
    const valueB = rowB.cells[columnIndex].textContent.trim();

    const numberA = Number(valueA.replace(/[$,]/g, ''));
    const numberB = Number(valueB.replace(/[$,]/g, ''));

    let result;

    if (
      valueA !== '' &&
      valueB !== '' &&
      !Number.isNaN(numberA) &&
      !Number.isNaN(numberB)
    ) {
      result = numberA - numberB;
    } else {
      result = valueA.localeCompare(valueB);
    }

    return isAscending ? result : -result;
  });

  rows.forEach((row) => {
    tableBody.appendChild(row);
  });
}

tableHead.addEventListener('click', (e) => {
  const header = e.target.closest('th');

  if (!header) {
    return;
  }

  const columnIndex = Array.from(header.parentElement.children).indexOf(header);

  sortTable(columnIndex);
});

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tableBody.querySelectorAll('tr').forEach((item) => {
    item.classList.remove('active');
  });

  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

form.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>
    Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

table.after(form);

function showNotification(title, description, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  const titleElement = document.createElement('span');
  const descriptionElement = document.createElement('span');

  titleElement.className = 'title';
  titleElement.textContent = title;
  descriptionElement.textContent = description;

  notification.append(titleElement, descriptionElement);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const ageValue = form.elements.age.value;
  const salaryValue = form.elements.salary.value;
  const age = Number(ageValue);
  const salary = Number(salaryValue);

  if (!employeeName || !position || !office || !ageValue || !salaryValue) {
    showNotification('Error', 'Please fill in all fields.', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification(
      'Error',
      'Name must contain at least 4 characters.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90 || !Number.isFinite(age)) {
    showNotification('Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  if (salary <= 0 || !Number.isFinite(salary)) {
    showNotification('Error', 'Enter a valid salary.', 'error');

    return;
  }

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;
  const row = tableBody.insertRow();

  [employeeName, position, office, age, formattedSalary].forEach((value) => {
    const cell = row.insertCell();

    cell.textContent = value;
  });

  form.reset();

  showNotification('Success', 'Employee added to the table.', 'success');
});

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('.cell-input')) {
    return;
  }

  const oldValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.append(input);

  input.focus();

  function saveCell() {
    const newValue = input.value.trim();

    cell.textContent = newValue || oldValue;
  }

  input.addEventListener('blur', saveCell, { once: true });

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }

    if (keyEvent.key === 'Escape') {
      input.value = oldValue;
      input.blur();
    }
  });
});
