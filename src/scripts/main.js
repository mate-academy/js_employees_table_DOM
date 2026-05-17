'use strict';

// --- Sorting ---
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let sortCol = -1;
let sortAsc = true;

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const col = Array.from(th.parentElement.children).indexOf(th);

  if (col === sortCol) {
    sortAsc = !sortAsc;
  } else {
    sortCol = col;
    sortAsc = true;
  }

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aText = a.children[col].textContent.trim();
    const bText = b.children[col].textContent.trim();
    const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
    const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
    const isNum = !isNaN(aNum) && !isNaN(bNum);

    if (isNum) {
      return sortAsc ? aNum - bNum : bNum - aNum;
    }

    return sortAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
  });

  rows.forEach((r) => tbody.appendChild(r));
});

// --- Row selection ---
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

// --- Form ---
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
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
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

// --- Notification ---
function showNotification(title, message, type) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const note = document.createElement('div');

  note.dataset.qa = 'notification';
  note.className = `notification ${type}`;
  note.innerHTML = `<h2 class="title">${title}</h2><p>${message}</p>`;
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}

// --- Form submit ---
function formatSalary(val) {
  return '$' + parseInt(val).toLocaleString('en-US');
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fullName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = parseInt(form.age.value);
  const salary = parseInt(form.salary.value);

  if (fullName.length < 4) {
    showNotification('Error', 'Name must have at least 4 letters.', 'error');

    return;
  }

  if (!position) {
    showNotification('Error', 'Position is required.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error', 'Age must be between 18 and 90.', 'error');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${fullName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formatSalary(salary)}</td>
  `;

  tbody.appendChild(row);
  form.reset();
  showNotification('Success', 'Employee added successfully.', 'success');
});

// --- Cell editing ---
let activeInput = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (activeInput) {
    return;
  }

  const original = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = original;
  cell.appendChild(input);
  input.focus();
  activeInput = input;

  function save() {
    const val = input.value.trim() || original;

    cell.textContent = val;
    activeInput = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});
