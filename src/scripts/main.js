'use strict';

// write code here
const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
let currentSort = { index: null, dir: 'asc' };

table.querySelectorAll('th').forEach((th, index) => {
  th.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isSameColumn = currentSort.index === index;
    const dir = isSameColumn && currentSort.dir === 'asc' ? 'dsc' : 'asc';

    currentSort = { index, dir };

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent
        .trim()
        .replace(/[$,]/g, '');
      const cellB = rowB.children[index].textContent
        .trim()
        .replace(/[$,]/g, '');
      const isNumeric = !isNaN(cellA) && !isNaN(cellB);

      return (
        (isNumeric ? cellA - cellB : cellA.localeCompare(cellB)) *
        (dir === 'asc' ? 1 : -1)
      );
    });
    rows.forEach((row) => tbody.appendChild(row));
  });
});

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }
  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));
  tr.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" required ></label>
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
<label>Age: <input type="number" name="age" data-qa="age" required></label>
<label>Salary: <input type="number" name="salary" data-qa="salary" required></label>
<button type="submit">Save to table</button>
`;
document.body.appendChild(form);

function showNotification(type, title, message) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const note = document.createElement('div');

  note.className = type === 'error' ? 'error' : 'success';
  note.setAttribute('data-qa', 'notification');
  note.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
  document.body.appendChild(note);

  setTimeout(() => note.remove(), 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const nameEmpl = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office').trim();
  const age = +formData.get('age');
  const salary = +formData.get('salary');

  if (nameEmpl.length < 4) {
    return showNotification(
      'error',
      'Validation error',
      'Name must be at least 4 characters.',
    );
  }

  if (age < 18 || age > 90) {
    return showNotification(
      'error',
      'Validation error',
      'Age must be between 18 and 90.',
    );
  }

  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${nameEmpl}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${salary.toString()}</td>
  `;

  tbody.appendChild(row);

  showNotification(
    'Success',
    'Employee added',
    `${nameEmpl} has been added to the table.`,
  );
  form.reset();
});

let editingCell = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (editingCell || cell.tagName !== 'td') {
    return;
  }

  const oldValue = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue.replace(/[$,]/g, '');

  editingCell = cell;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  function save() {
    const newValue = input.value.trim();

    cell.textContent = newValue || oldValue;
    editingCell = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      save();
    } else if (ev.key === 'Escape') {
      cell.textContent = oldValue;
      editingCell = null;
    }
  });
});
