'use strict';

const tableBody = document.getElementById('employee-table-body');
const headers = document.querySelectorAll('th');
const sortOrder = {};
let selectedRow = null;

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const key = header.textContent.toLowerCase();

    sortOrder[key] = !sortOrder[key];

    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let valA = a.children[index].textContent;
      let valB = b.children[index].textContent;

      if (!isNaN(valA) && !isNaN(valB)) {
        valA = parseFloat(valA.replace(/[^\d.-]/g, ''));
        valB = parseFloat(valB.replace(/[^\d.-]/g, ''));
      }

      return sortOrder[key]
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    rows.forEach((row) => tableBody.appendChild(row)); // Re-append sorted rows
  });
});

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (row && selectedRow !== row) {
    if (selectedRow) {
      selectedRow.classList.remove('active');
    }

    row.classList.add('active');
    selectedRow = row;
  }
});

const form = document.getElementById('employee-form');
const notification = document.getElementById('notification');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameVal = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = parseInt(form.elements.age.value);
  const salary = parseFloat(form.elements.salary.value).toFixed(3);

  if (nameVal.length < 4) {
    showNotification('error', 'Name must be at least 4 characters long.');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Age must be between 18 and 90.');

    return;
  }

  if (!salary || salary <= 0) {
    showNotification('error', 'Invalid salary value.');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${nameVal}</td><td>${position}</td><td>${office}</td><td>${age}</td><td>$${salary}</td>`;
  tableBody.appendChild(newRow);

  showNotification('success', 'Employee added successfully.');
  form.reset();
});

function showNotification(type, message) {
  notification.className = `notification ${type}`;
  notification.textContent = message;
  setTimeout(() => (notification.className = 'notification'), 3000);
}

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (cell) {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = cell.textContent;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      if (input.value.trim()) {
        cell.textContent = input.value;
      } else {
        cell.textContent = input.defaultValue;
      }
    });

    input.addEventListener('keydown', () => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }
});
