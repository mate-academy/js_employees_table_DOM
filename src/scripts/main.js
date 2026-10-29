'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

let columnIndex = null;
let isAscending = true;

tableHeader.addEventListener('click', (e) => {
  const tableRows = Array.from(tableBody.rows);
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const cellIndex = th.cellIndex;

  isAscending = columnIndex === cellIndex ? !isAscending : true;
  columnIndex = cellIndex;

  if (isAscending) {
    tableRows.sort((a, b) => compareCells(a, b, cellIndex));
  } else {
    tableRows.sort((a, b) => compareCells(b, a, cellIndex));
  }

  tableBody.append(...tableRows);
});

function compareCells(rowA, rowB, cellIndex) {
  const a = rowA.cells[cellIndex].textContent.replace(/[$,]/g, '');
  const b = rowB.cells[cellIndex].textContent.replace(/[$,]/g, '');

  if (isNaN(a) || isNaN(b)) {
    return a.localeCompare(b);
  }

  return Number(a) - Number(b);
}

tableBody.addEventListener('click', (e) => {
  const tableRows = Array.from(tableBody.rows);
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  tableRows.forEach((row) => {
    row.classList.remove('active');
  });
  tr.classList.add('active');
});

const newEmployeeForm = document.createElement('form');

newEmployeeForm.classList.add('new-employee-form');
newEmployeeForm.noValidate = true;

newEmployeeForm.innerHTML = `
  <label>Name: <input type="text" name="name" data-qa="name" required></label>
  <label>Position: <input type="text" name="position" data-qa="position" required></label>
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
document.body.appendChild(newEmployeeForm);

newEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const employeeName = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = formData.get('age');
  const salary = formData.get('salary');

  if (!employeeName || !position || !office || !age || !salary) {
    showNotification('All fields are required', 'error');

    return;
  }

  if (employeeName.trim().length < 4) {
    showNotification('Name must be at least 4 letters', 'error');

    return;
  }

  if (+age < 18 || +age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName.trim()}</td>
    <td>${position.trim()}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${Number(salary).toLocaleString('en-US')}</td>
  `;

  tableBody.append(newRow);

  showNotification('Employee added successfully', 'success');
});

function showNotification(message, type) {
  Array.from(document.querySelectorAll('.notification')).forEach(
    (existingNotification) => existingNotification.remove(),
  );

  const newNotification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationMessage = document.createElement('p');

  notificationTitle.classList.add('title');
  notificationTitle.textContent = type;
  notificationMessage.textContent = message;

  newNotification.append(notificationTitle, notificationMessage);
  newNotification.classList.add('notification', type);
  newNotification.setAttribute('data-qa', 'notification');
  document.body.append(newNotification);

  setTimeout(() => {
    newNotification.remove();
  }, 2000);
}

let editingCell = null;

tableBody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || editingCell) {
    return;
  }

  editingCell = td;

  const currentCellValue = td.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  input.value = currentCellValue;

  td.textContent = '';
  td.append(input);
  input.focus();

  const saveCell = () => {
    if (editingCell !== td) {
      return;
    }

    editingCell = null;
    td.textContent = input.value.trim() || currentCellValue;
  };

  input.addEventListener('blur', saveCell);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveCell();
    }
  });
});
