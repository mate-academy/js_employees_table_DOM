'use strict';

let sortColumnIndex = null;
let isAscending = true;

const table = document.querySelector('.table') || document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

const parseCellValue = (text) => {
  if (text.includes('$')) {
    return Number(text.replace(/[$,]/g, ''));
  }

  if (!isNaN(text) && text !== '') {
    return Number(text);
  }

  return text;
};

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = th.cellIndex;

  if (sortColumnIndex === columnIndex) {
    isAscending = !isAscending;
  } else {
    sortColumnIndex = columnIndex;
    isAscending = true;
  }

  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[sortColumnIndex].textContent.trim();
    const cellB = rowB.cells[sortColumnIndex].textContent.trim();

    const valA = parseCellValue(cellA);
    const valB = parseCellValue(cellB);

    let comparisonResult = 0;

    if (typeof valA === 'number' && typeof valB === 'number') {
      comparisonResult = valA - valB;
    } else {
      comparisonResult = String(valA).localeCompare(String(valB));
    }

    return isAscending ? comparisonResult : -comparisonResult;
  });

  tbody.append(...rows);
});

tbody.addEventListener('click', (e) => {
  const targetTr = e.target.closest('tr');

  if (!targetTr) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  targetTr.classList.add('active');
});

const formatSalary = (salary) => {
  const numericSalary = Number(salary);

  return `$${numericSalary.toLocaleString('en-US')}`;
};

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>
    Name:
    <input type="text" name="name" data-qa="name">
  </label>

  <label>
    Position:
    <input type="text" name="position" data-qa="position">
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
    <input type="number" name="age" data-qa="age">
  </label>

  <label>
    Salary:
    <input type="number" name="salary" data-qa="salary">
  </label>

  <button type="submit">Save to table</button>
`;

table.after(form);

const showNotification = (type, title, description) => {
  const existingNotification = document.querySelector('[data-qa="notification"]');

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <span>${title}: ${description}</span>
  `;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = formData.get('age').trim();
  const salary = formData.get('salary').trim();

  if (!name || !position || !office || !age || !salary) {
    showNotification('error', 'Error', 'All fields are required');
    return;
  }

  if (name.length < 4) {
    showNotification('error', 'Error', 'Name must be at least 4 characters long');
    return;
  }

  const ageNum = Number(age);

  if (ageNum < 18 || ageNum > 90) {
    showNotification('error', 'Error', 'Age must be between 18 and 90');
    return;
  }

  const formattedSalary = formatSalary(salary);

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${ageNum}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(newRow);
  form.reset();

  showNotification('success', 'Success', 'Employee added successfully');
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('.cell-input')) {
    return;
  }

  const activeInput = tbody.querySelector('.cell-input');

  if (activeInput) {
    activeInput.blur();
  }

  const initialValue = cell.textContent.trim();

  cell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = initialValue;

  cell.append(input);
  input.focus();

  const saveChanges = () => {
    const newValue = input.value.trim();

    if (newValue === '') {
      cell.textContent = initialValue;
    } else {
      cell.textContent = newValue;
    }
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      input.blur();
    }
  });
});