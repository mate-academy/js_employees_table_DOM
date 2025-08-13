'use strict';

// write code here
// sort
const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
let sortColumn = null;
let sortAsc = true;

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.rows);

    if (sortColumn !== index) {
      sortColumn = index;
      sortAsc = true;
    } else {
      sortAsc = !sortAsc;
    }

    const rowsSorted = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent.trim();
      const cellB = rowB.cells[index].textContent.trim();
      const numA = parseFloat(cellA.replace(/[$,\s]/g, ''));
      const numB = parseFloat(cellB.replace(/[$,\s]/g, ''));
      const checkNumber = !isNaN(numA) && !isNaN(numB);

      let comparison;

      if (checkNumber) {
        comparison = numA - numB;
      } else {
        comparison = cellA.localeCompare(cellB);
      }

      return sortAsc ? comparison : -comparison;
    });

    tbody.replaceChildren(...rowsSorted);
  });
});

// highlight lines

let activeRow = null;

table.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const tbody = table.querySelector('tbody');

  if (!tr || !tbody.contains(tr) || tr === activeRow) {
    return;
  }

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  tr.classList.add('active');
  activeRow = tr;
});

// add form

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="">Select office</option>
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
table.after(form);

// check form and add lines

form.classList.add('new-employee-form');
table.after(form);

const notification = document.createElement('div');

notification.setAttribute('data-qa', 'notification');
form.style.position = 'relative';
form.appendChild(notification);

function showNotification(message, type) {
  notification.style.position = 'absolute';
  notification.style.top = '270px';
  notification.style.right = '0';
  notification.style.width = '220px';
  notification.style.padding = '10px 14px';
  notification.style.background = '#fff';
  notification.style.border = '1px solid #ccc';

  notification.style.borderLeft =
    '4px solid ' + (type === 'error' ? '#e74c3c' : '#2ecc71');
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.fontSize = '14px';
  notification.style.zIndex = '999';
  notification.style.opacity = '1';
  notification.style.pointerEvents = 'auto';
  notification.style.transition = 'opacity 0.3s ease';

  notification.innerHTML = `<strong>${type === 'error' ? 'Error' : 'Success'}</strong>
    <div>${message}</div>`;
  notification.className = type;

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.pointerEvents = 'none';
    notification.innerHTML = '';
  }, 3000);
}

form.addEventListener('submit', (el) => {
  el.preventDefault();

  const firstName = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value.trim();
  const age = form.age.value.trim();
  const salary = form.salary.value.trim();

  if (!firstName || !position || !office || !age || !salary) {
    showNotification('fill out all required fields', 'error');

    return;
  }

  if (firstName.length < 4) {
    showNotification('Name must be at least 4 characters long', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('age must be from 18 to 90 years', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${firstName}</td><td>${position}</td>
  <td>${office}</td><td>${age}</td><td>$${Number(salary).toLocaleString('en-US')}</td>`;

  table.querySelector('tbody').appendChild(newRow);
  form.reset();
  showNotification('Employee added successfully!', 'success');
});

// change cells

let editingCell = null;

table.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (editingCell && editingCell !== cell) {
    finishEdit(editingCell);
  }

  if (editingCell === cell) {
    return;
  }
  startEdit(cell);
});

function startEdit(cell) {
  const oldText = cell.textContent;

  cell.dataset.oldText = oldText;

  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = oldText;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => finishEdit(cell));

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.blur();
    }

    if (ev.key === 'Escape') {
      cell.textContent = oldText;
      editingCell = null;
    }
  });

  editingCell = cell;
}

function finishEdit(cell) {
  const input = cell.querySelector('input');

  if (input) {
    const newValue = input.value.trim();

    const oldValue = cell.dataset.oldText;

    cell.textContent = newValue || oldValue;
  }
  editingCell = null;
}
