'use strict';

// === Table and sorting setup ===
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.tBodies[0];

const sortState = {
  index: null,
  direction: 'asc',
};

// Function to get sortable value for each column
const getValue = (cell, index) => {
  const text = cell.textContent.trim();

  if (index === 3) {
    return Number(text);
  } // Age

  if (index === 4) {
    return parseFloat(text.replace(/[^0-9.]+/g, ''));
  } // Salary

  return text.toLowerCase(); // Name, Position, Office
};

// Sorting logic
headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    const rows = [...tbody.rows];

    // Toggle sort direction
    if (sortState.index === index) {
      sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortState.index = index;
      sortState.direction = 'asc';
    }

    rows.sort((a, b) => {
      const valA = getValue(a.cells[index], index);
      const valB = getValue(b.cells[index], index);

      if (index === 3 || index === 4) {
        return sortState.direction === 'asc' ? valA - valB : valB - valA;
      } else {
        return sortState.direction === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

// === Row click highlighting ===
tbody.addEventListener('click', (e) => {
  const target = e.target;
  const tr = target.closest('tr');

  if (!tr) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));
  tr.classList.add('active');
});

// === Form setup ===
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <h3>Add New Employee</h3>
  <label>
    Name:
    <input type="text" name="name" data-qa="name" required />
  </label>
  <label>
    Position:
    <input type="text" name="position" data-qa="position" required />
  </label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
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
    <input type="number" name="age" data-qa="age" required />
  </label>
  <label>
    Salary:
    <input type="number" name="salary" data-qa="salary" required />
  </label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

// === Notification function ===
function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);

  return notification;
}

// === Form submit logic ===
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const empName = form.querySelector('input[name="name"]').value.trim();
  const position = form.querySelector('input[name="position"]').value.trim();
  const office = form.querySelector('select[name="office"]').value;
  const age = Number(form.querySelector('input[name="age"]').value.trim());
  const salaryInput = form.querySelector('input[name="salary"]').value.trim();
  const salary = parseFloat(salaryInput);

  // Validation
  if (empName.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (!position) {
    showNotification('Position is required.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  if (isNaN(salary)) {
    showNotification('Salary must be a valid number.', 'error');

    return;
  }

  // Format salary
  const formattedSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  // Add new row
  const newRow = tbody.insertRow();

  newRow.insertCell(0).textContent = empName;
  newRow.insertCell(1).textContent = position;
  newRow.insertCell(2).textContent = office;
  newRow.insertCell(3).textContent = age;
  newRow.insertCell(4).textContent = formattedSalary;

  form.reset();
  showNotification('New employee added successfully!', 'success');
});

// === Editable table cells ===
let editingCell = null;

table.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const index = cell.cellIndex;

  if (editingCell || index === 3 || index === 4) {
    return;
  } // cannot edit Age/Salary
  editingCell = cell;

  const originalValue = cell.textContent;
  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const save = () => {
    cell.textContent = input.value.trim() || originalValue;
    editingCell = null;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }

    if (ev.key === 'Escape') {
      cell.textContent = originalValue;
      editingCell = null;
    }
  });
});
