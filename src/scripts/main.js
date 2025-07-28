'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');
let sortState = {};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isNumeric = index === 3 || index === 4;

    const currentOrder = sortState[index] === 'asc' ? 'desc' : 'asc';

    sortState = { [index]: currentOrder };

    rows.sort((a, b) => {
      const aText = a.children[index].textContent.trim().replace(/[$,]/g, '');
      const bText = b.children[index].textContent.trim().replace(/[$,]/g, '');

      const aVal = isNumeric ? parseFloat(aText) : aText.toLowerCase();
      const bVal = isNumeric ? parseFloat(bText) : bText.toLowerCase();

      if (aVal < bVal) {
        return currentOrder === 'asc' ? -1 : 1;
      }

      if (aVal > bVal) {
        return currentOrder === 'asc' ? 1 : -1;
      }

      return 0;
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });
});

tbody.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const row = e.target.closest('tr');

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

const formHTML = `
<form class="new-employee-form">
  <label>Name: <input name="name" type="text" data-qa="name" /></label>
  <label>Position: <input name="position" type="text" data-qa="position" /></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" /></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" /></label>
  <button type="submit">Save to table</button>
</form>
<div class="notification" data-qa="notification"></div>
`;

const formContainer = document.createElement('div');

formContainer.innerHTML = formHTML;
document.body.appendChild(formContainer);

const form = formContainer.querySelector('form');
const notification = formContainer.querySelector('.notification');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = parseInt(form.age.value);
  const salary = parseFloat(form.salary.value);

  if (!employeeName || employeeName.length < 4) {
    return showNotification('Name must be at least 4 characters.', 'error');
  }

  if (!position || !office || !form.age.value || !form.salary.value) {
    return showNotification('All fields are required.', 'error');
  }

  if (age < 18 || age > 90) {
    return showNotification('Age must be between 18 and 90.', 'error');
  }

  const salaryFormatted = `${salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salaryFormatted}</td>
    `;

  tbody.appendChild(tr);
  form.reset();
  showNotification('Employee added successfully.', 'success');
});

function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type}`;
}

let editingCell = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  if (editingCell) {
    return;
  }

  const oldValue = cell.textContent;
  const input = document.createElement('input');

  input.value = oldValue;
  input.className = 'cell-input';
  cell.textContent = '';
  cell.appendChild(input);
  editingCell = cell;

  input.focus();

  function finishEdit(save) {
    const newValue = input.value.trim();

    cell.textContent = save && newValue !== '' ? newValue : oldValue;
    editingCell = null;
  }

  input.addEventListener('blur', () => finishEdit(true));

  input.addEventListener('keydown', (o) => {
    if (o.key === 'Enter') {
      finishEdit(true);
    }

    if (o.key === 'Escape') {
      finishEdit(false);
    }
  });
});
