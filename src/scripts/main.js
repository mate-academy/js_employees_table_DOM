'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

let currentColumn = null;
let currentDirection = 'asc';
let editingCell = null;

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentColumn === index) {
      currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentColumn = index;
      currentColumn = 'asc';
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      let valueA = rowA.children[index].textContent.trim();
      let valueB = rowB.children[index].textContent.trim();

      if (index === 3 || index === 4) {
        valueA = Number(valueA.replace(/[$,]/g, ''));
        valueB = Number(valueB.replace(/[$,]/g, ''));

        return currentDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const result = valueA.localeCompare(valueB);

      return currentColumn === 'asc' ? result : -result;
    });

    rows.forEach((row) => {
      tbody.append(row);
    });
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((item) => {
    item.classList.remove('active');
  });

  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <h3>New employee</h3>

  <label>
    Name:
    <input
      name="name"
      type="text"
      data-qa="name"
    >
  </label>

  <label>
    Position:
    <input
      name="position"
      type="text"
      data-qa="position"
    >
  </label>

  <label>
    Office:
    <select name="office" data-qa="office">
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
    <input
      name="age"
      type="number"
      data-qa="age"
    >
  </label>

  <label>
    Salary:
    <input
      name="salary"
      type="number"
      data-qa="salary"
    >
  </label>

  <button type="submit">Save to table</button>
`;

document.body.append('form');

function showNotification(title, description, type) {
  const OldNotification = document.querySelector('[data-qa="notification"]');

  if (OldNotification) {
    OldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = type;

  notification.innerHTML = `
    <strong>${title}</strong>
    <p>${description}</p>
  `;

  document.body.append('notification');

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.querySelector('[data-qa="name"]');
  const positionInput = form.querySelector('[data-qa="position"]');
  const officeInput = form.querySelector('[data-qa="office"]');
  const ageInput = form.querySelector('[data-qa="age"]');
  const salaryInput = form.querySelector('[data-qa="salary"]');

  const eName = nameInput.value.trim();
  const position = positionInput.value.trim();
  const office = officeInput.value;
  const age = Number(ageInput.value);
  const salary = Number(salaryInput.value);

  if (!eName || !position || !office || !ageInput.value || !salaryInput.value) {
    showNotification('Invalid data', 'All fields are required.', 'error');

    return;
  }

  if (eName.length < 4) {
    showNotification(
      'Invalid name',
      'Name must contain at least 4 letters.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Invalid age', 'Age must be between 18 and 90.', 'error');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${eName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.append(row);

  form.reset();

  showNotification('Success', 'Employee was successfully added.', 'success');
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (editingCell) {
    saveCell(editingCell);
  }

  editingCell = cell;

  const initialValue = cell.textContent.trim();

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;
  input.defaultValue = initialValue;

  cell.textContent = '';
  cell.append(input);

  input.focus();

  input.addEventListener('blur', () => {
    saveCell(cell);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      saveCell(cell);
    }
  });
});

function saveCell(cell) {
  const input = cell.querySelector('.cell-input');

  if (input) {
    return;
  }

  const value = input.value.trim();

  cell.textContent = value || input.defaultValue;

  if (editingCell === cell) {
    editingCell = null;
  }
}
