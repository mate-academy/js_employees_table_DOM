'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');

let currentColumn = null;
let direction = 1;

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    if (currentColumn === index) {
      direction *= -1;
    } else {
      currentColumn = index;
      direction = 1;
    }

    sortTable(index, direction);
  });
});

function sortTable(colIndex, dir) {
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    let aText = a.cells[colIndex].textContent.trim();
    let bText = b.cells[colIndex].textContent.trim();

    if (colIndex === 3) {
      aText = Number(aText);
      bText = Number(bText);
    }

    if (colIndex === 4) {
      aText = Number(aText.replace(/[$,]/g, ''));
      bText = Number(bText.replace(/[$,]/g, ''));
    }

    if (aText > bText) {
      return dir;
    }

    if (aText < bText) {
      return -dir;
    }

    return 0;
  });

  tbody.append(...rows);
}

tbody.addEventListener('click', (evt) => {
  const row = evt.target.closest('tr');

  if (!row) {
    return;
  }

  const active = tbody.querySelector('.active');

  if (active) {
    active.classList.remove('active');
  }

  row.classList.add('active');
});

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

<button type="submit">Save to table</button>`;

document.body.prepend(form);

function showNotification(text, type) {
  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = type;
  notification.textContent = text;

  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
}

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const formData = new FormData(form);

  const nameEmp = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  const salary = Number(formData.get('salary'));

  if (!nameEmp || !position || !office || !age || !salary) {
    showNotification('All fields must be filled', 'error');

    return;
  }

  if (nameEmp.length < 4) {
    showNotification('Name must contain at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${nameEmp}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;

  tbody.append(tr);

  showNotification('Employee successfully added', 'success');

  form.reset();
});

let editingCell = null;

tbody.addEventListener('dblclick', (evt) => {
  const cell = evt.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  if (editingCell) {
    return;
  }

  editingCell = cell;

  const oldValue = cell.textContent;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.append(input);

  input.focus();

  function save() {
    const value = input.value.trim();

    cell.textContent = value || oldValue;

    editingCell = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      save();
    }
  });
});
