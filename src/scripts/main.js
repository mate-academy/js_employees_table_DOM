'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
let sortDirection = {}; // Store sort state per column

// sorting
table.querySelectorAll('th').forEach((th, index) => {
  th.addEventListener('click', () => {
    const dir = sortDirection[index] === 'asc' ? 'desc' : 'asc';

    sortDirection = { [index]: dir };

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      const valA = a.children[index].textContent.trim();
      const valB = b.children[index].textContent.trim();
      const isNumeric = !isNaN(parseFloat(valA.replace(/[^0-9.-]+/g, '')));
      const aVal = isNumeric
        ? parseFloat(valA.replace(/[^0-9.-]+/g, ''))
        : valA.toLowerCase();
      const bVal = isNumeric
        ? parseFloat(valB.replace(/[^0-9.-]+/g, ''))
        : valB.toLowerCase();

      return dir === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
    rows.forEach((row) => tbody.appendChild(row));
  });
});

// row selection
tbody.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
    e.target.parentElement.classList.add('active');
  }
});

// create form
const officeOptions = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
]
  .map((city) => `<option>${city}</option>`)
  .join('');

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" /></label>
  <label>Position: <input name="position" type="text" data-qa="position" /></label>
  <label>Office:
    <select name="office" data-qa="office">
      ${officeOptions}
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" /></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" /></label>
  <button type="submit">Save to table</button>
  `;
document.body.appendChild(form);

// notification
function showNotification(type, title, text) {
  document
    .querySelectorAll('[data-qa="notification"]')
    .forEach((n) => n.remove());

  const note = document.createElement('div');

  note.setAttribute('data-qa', 'notification');
  note.className = type;
  note.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

// form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const age = Number(data.age);
  const salary = Number(data.salary);
  const formattedSalary = `$${salary.toLocaleString('en-US')}`;
  const nameP = data.name.trim();

  if (!nameP || !data.position || !data.office || !data.age || !data.salary) {
    return showNotification(
      'error',
      'Incomplete form',
      'Please fill in all fields.',
    );
  }

  if (nameP.length < 4) {
    return showNotification(
      'error',
      'Name too short',
      'Name must be at least 4 characters.',
    );
  }

  if (age < 18 || age > 90) {
    return showNotification(
      'error',
      'Invalid age',
      'Age must be between 18 and 90.',
    );
  }

  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${nameP}</td>
  <td>${data.position}</td>
  <td>${data.office}</td>
  <td>${age}</td>
  <td>${formattedSalary}</td>
  `;
  tbody.appendChild(row);
  showNotification('success', 'Employee added', `${nameP} has been added.`);
  form.reset();
});

// cell editing
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName !== 'TD' || cell.querySelector('input')) {
    return;
  }

  const initial = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initial;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const save = () => {
    const val = input.value.trim() || initial;

    cell.textContent = val;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      save();
    }
  });
});
