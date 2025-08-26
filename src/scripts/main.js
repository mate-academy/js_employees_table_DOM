'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
let sortState = { column: null, asc: true };

// Сортування
table.querySelectorAll('th').forEach((th, index) => {
  th.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAsc = sortState.column === index ? !sortState.asc : true;

    sortState = { column: index, asc: isAsc };

    rows.sort((a, b) => {
      const aText = a.children[index].textContent.trim();
      const bText = b.children[index].textContent.trim();

      return isAsc
        ? aText.localeCompare(bText, undefined, { numeric: true })
        : bText.localeCompare(aText, undefined, { numeric: true });
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

// Вибір рядка
tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }
  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  tr.classList.add('active');
});

// Додавання форми
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
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
  <button type="submit">Save to table</button>
`;
document.body.appendChild(form);

// Сповіщення
function showNotification(message, isError = false) {
  const note = document.createElement('div');

  note.textContent = message;
  note.className = isError ? 'error' : 'success';
  note.setAttribute('data-qa', 'notification');
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 3000);
}

// Обробка форми
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const age = Number(data.age);

  if (
    !data.name ||
    !data.position ||
    !data.office ||
    !data.age ||
    !data.salary
  ) {
    return showNotification('Please fill all fields', true);
  }

  if (data.name.length < 4) {
    return showNotification('Name must be at least 4 characters', true);
  }

  if (age < 18 || age > 90) {
    return showNotification('Age must be between 18 and 90', true);
  }

  const formattedSalary = `$${Number(data.salary).toLocaleString('en-US')}`;
  const row = document.createElement('tr');

  row.innerHTML = `
  <td>${data.name}</td>
  <td>${data.position}</td>
  <td>${data.office}</td>
  <td>${age}</td>
  <td>${formattedSalary}</td>
  `;
  tbody.appendChild(row);
  showNotification('Employee added successfully');
  form.reset();
});

// Редагування клітинки
let editingCell = null;

table.addEventListener('dblclick', (keyEvent) => {
  const cell = keyEvent.target.closest('td');

  if (!cell || editingCell) {
    return;
  }

  const original = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = original;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();
  editingCell = cell;

  function save() {
    const value = input.value.trim();

    cell.textContent = value || original;
    editingCell = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
});
