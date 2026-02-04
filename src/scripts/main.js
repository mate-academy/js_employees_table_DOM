'use strict';

const table = document.querySelector('table');
const tbody = table.tBodies[0];
const thead = table.tHead;

document.body.style.display = 'flex';
document.body.style.alignItems = 'flex-start';
document.body.style.justifyContent = 'center';
document.body.style.gap = '40px';
document.body.style.padding = '40px';

let lastColumnIndex = -1;
let isAsc = true;

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = th.cellIndex;

  if (lastColumnIndex === columnIndex) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
    lastColumnIndex = columnIndex;
  }

  sortTable(columnIndex, isAsc);
});

function sortTable(index, asc) {
  const rows = Array.from(tbody.rows);
  const clean = (val) => val.replace(/[$,]/g, '').trim();

  rows.sort((a, b) => {
    const cellA = a.cells[index].textContent;
    const cellB = b.cells[index].textContent;

    const numA = parseFloat(clean(cellA));
    const numB = parseFloat(clean(cellB));

    if (!isNaN(numA) && !isNaN(numB)) {
      return asc ? numA - numB : numB - numA;
    }

    return asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  tbody.append(...rows);
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row || e.target.tagName === 'INPUT') {
    return;
  }

  Array.from(tbody.rows).forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

function showNotification(text, type) {
  const note = document.createElement('div');

  note.className = `notification ${type}`;
  note.setAttribute('data-qa', 'notification');
  note.textContent = text;
  document.body.append(note);
  setTimeout(() => note.remove(), 3000);
}

form.onsubmit = (e) => {
  e.preventDefault();

  const { name: employeeName, position, office, age, salary } = form.elements;

  if (employeeName.value.trim().length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (!position.value.trim()) {
    showNotification('Position must be at least 4 characters', 'error');

    return;
  }

  if (!age.value || age.value < 18 || age.value > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  if (!salary.value || salary.value <= 0) {
    showNotification('Salary must be a positive number', 'error');

    return;
  }

  const newRow = tbody.insertRow();
  const formattedSalary = '$' + Number(salary.value).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${employeeName.value}</td>
    <td>${position.value}</td>
    <td>${office.value}</td>
    <td>${age.value}</td>
    <td>${formattedSalary}</td>
  `;

  showNotification('Employee added successfully!', 'success');
  form.reset();
};

let editingCell = null;

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || editingCell) {
    return;
  }

  editingCell = cell;

  const originalValue = cell.textContent;

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  const saveChanges = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue || originalValue;
    editingCell = null;
  };

  input.onblur = saveChanges;

  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') {
      saveChanges();
    }

    if (ev.key === 'Escape') {
      input.value = originalValue;
      saveChanges();
    }
  };
});
