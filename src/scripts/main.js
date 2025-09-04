'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('th');

let currentSortIndex = null;
let currentSortDirection = 'asc';

// --- SORTING ---
headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Determine direction
    if (currentSortIndex === index) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortIndex = index;
      currentSortDirection = 'asc';
    }

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      const numA = parseFloat(cellA.replace(',', '.'));
      const numB = parseFloat(cellB.replace(',', '.'));

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
});

// --- ROW SELECTION ---
tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  tbody.querySelectorAll('tr').forEach(r => r.classList.remove('active'));
  tr.classList.add('active');
});

// --- FORM CREATION ---
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;
document.body.appendChild(form);

// --- NOTIFICATIONS ---
function showNotification(type, message) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const div = document.createElement('div');

  div.className = type; // error | success
  div.setAttribute('data-qa', 'notification');
  div.textContent = message;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

// --- FORM HANDLER ---
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameN = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value.trim();
  const age = parseInt(form.elements.age.value.trim(), 10);
  const salary = parseFloat(form.elements.salary.value.trim());

  // Validation
  if (nameN.length < 4) {
    showNotification('error', 'Name must be at least 4 characters long');

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    showNotification('error', 'Age must be between 18 and 90');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    showNotification('error', 'Salary must be a positive number');

    return;
  }

  // Add row
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${nameN}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${salary.toFixed(2)}</td>
  `;
  tbody.appendChild(tr);

  form.reset();
  showNotification('success', 'Employee added successfully');
});

// --- CELL EDITING (optional) ---
let activeInput = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || activeInput) {
    return;
  }

  const oldValue = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();
  activeInput = input;

  function save() {
    const newValue = input.value.trim();

    cell.textContent = newValue || oldValue;
    activeInput = null;
  }

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });
});
