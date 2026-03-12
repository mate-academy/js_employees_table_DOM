'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

let sortColumn = null;
let sortDirection = true;

/** виділення, +active */
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const active = tbody.querySelector('.active');

  if (active) {
    active.classList.remove('active');
  }

  row.classList.add('active');
});

/** сортування табл */
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (sortColumn !== index) {
      sortDirection = true;
      sortColumn = index;
    } else {
      sortDirection = !sortDirection;
    }

    sortTable(index);
  });
});

function sortTable(columnIndex) {
  const rows = Array.from(tbody.rows);
  const headerText = headers[columnIndex].textContent.trim().toLowerCase();

  rows.sort((rowA, rowB) => {
    let a = rowA.cells[columnIndex].textContent.trim();
    let b = rowB.cells[columnIndex].textContent.trim();

    if (headerText === 'age' || headerText === 'salary') {
      a = parseFloat(a.replace(/[^0-9.-]+/g, '')) || 0;
      b = parseFloat(b.replace(/[^0-9.-]+/g, '')) || 0;

      if (sortDirection === true) {
        return a - b;
      } else {
        return b - a;
      }
    } else {
      const res = a.localeCompare(b);

      if (sortDirection === true) {
        return res;
      } else {
        return -res;
      }
    }
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

/** форма */
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
      <input name="name" type="text" data-qa="name">
  </label>

  <label>
    Position:
      <input name="position" type="text" data-qa="position">
  </label>

  <label>
    Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
  </label>

  <label>
    Age:
      <input name="age" type="number" data-qa="age">
  </label>

  <label>
    Salary:
      <input name="salary" type="number" data-qa="salary">
  </label>

  <button type="submit">Save to table</button>
`;

document.body.append(form);

/** notification */
function showNotification(type, text) {
  const notification = document.createElement('div');

  notification.className = type;
  notification.dataset.qa = 'notification';

  notification.textContent = text;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

/** value */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const ageValue = form.age.value;
  const salaryValue = form.salary.value;

  if (
    !employeeName ||
    !position ||
    !office ||
    ageValue === '' ||
    salaryValue === ''
  ) {
    showNotification('error', 'All fields are required');

    return;
  }

  const age = Number(ageValue);
  const salary = Number(salaryValue);

  if (employeeName.length < 4) {
    showNotification('error', 'Name must have at least 4 letters');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Age must be between 18 and 90');

    return;
  }

  addEmployee(employeeName, position, office, age, salary);

  showNotification('success', 'Employee successfully added');

  form.reset();
});

/** employee */
function addEmployee(employeeName, position, office, age, salary) {
  const row = document.createElement('tr');
  const formatSalary =
    '$' + String(salary).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  row.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formatSalary}</td>
  `;

  tbody.appendChild(row);
}

/** редагування комірок табл подвійним клацанням по них (необовʼязково) */
let editingCell = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (!cell || editingCell) {
    return;
  }

  editingCell = cell;

  const oldValue = cell.textContent;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  const save = () => {
    cell.textContent = input.value.trim() || oldValue;

    editingCell = null;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      save();
    }
  });
});
