'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

// TABLE SORTING
const currentSort = { index: null, asc: true };

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = currentSort.index === index ? !currentSort.asc : true;

    rows.sort((a, b) => {
      const aText = a.children[index].textContent.trim();
      const bText = b.children[index].textContent.trim();

      const isNumeric = !isNaN(parseFloat(aText.replace(/[$,]/g, '')));
      const aValue = isNumeric
        ? parseFloat(aText.replace(/[$,]/g, ''))
        : aText.toLowerCase();
      const bValue = isNumeric
        ? parseFloat(bText.replace(/[$,]/g, ''))
        : bText.toLowerCase();

      if (aValue < bValue) {
        return isAsc ? -1 : 1;
      }

      if (aValue > bValue) {
        return isAsc ? 1 : -1;
      }

      return 0;
    });

    rows.forEach((row) => tbody.appendChild(row));

    currentSort.index = index;
    currentSort.asc = isAsc;
  });
});

// === 2. ВЫДЕЛЕНИЕ СТРОК ===
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
  row.classList.add('active');
});

// EMPLOYEE ADDING FORM
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;
document.body.appendChild(form);

// NOTIFICATIONS
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// PROCESSING FORM SUBMISSION
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const EmployeeName = form.name.value.trim();
  const EmployeePosition = form.position.value.trim();
  const EmployeeOffice = form.office.value;
  const EmployeeAge = parseInt(form.age.value, 10);
  const EmployeeSalary = parseFloat(form.salary.value);

  if (EmployeeName.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (EmployeeAge < 18 || EmployeeAge > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${EmployeeName}</td>
    <td>${EmployeePosition}</td>
    <td>${EmployeeOffice}</td>
    <td>${EmployeeAge}</td>
    <td>$${EmployeeSalary.toLocaleString()}</td>
  `;
  tbody.appendChild(row);
  showNotification('Employee added successfully.', 'success');
  form.reset();
});

// EDITING CELLS BY DOUBLE CLICK
let currentInput = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || currentInput) {
    return;
  }

  const initialValue = cell.textContent;
  const input = document.createElement('input');

  input.value = initialValue.replace(/[$,]/g, '');
  input.classList.add('cell-input');
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();
  currentInput = input;

  const finishEdit = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue
      ? cell.cellIndex === 4
        ? `$${parseFloat(newValue).toLocaleString()}`
        : newValue
      : initialValue;
    currentInput = null;
  };

  input.addEventListener('blur', finishEdit);

  // eslint-disable-next-line no-shadow
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finishEdit();
    }
  });
});
