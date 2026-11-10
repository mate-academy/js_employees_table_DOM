'use strict';

let currentSortIndex = null;
let isAscending = true;

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  for (const row of tbody.rows) {
    row.classList.remove('active');
  }

  tr.classList.add('active');
});

const thead = document.querySelector('thead');

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = th.cellIndex;

  if (columnIndex === currentSortIndex) {
    isAscending = !isAscending;
  } else {
    currentSortIndex = columnIndex;
    isAscending = true;
  }

  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    const valA = rowA.cells[columnIndex].textContent.trim();
    const valB = rowB.cells[columnIndex].textContent.trim();

    const cleanA = valA.replace(/\D/g, '');
    const cleanB = valB.replace(/\D/g, '');

    const isNumber =
      cleanA !== '' && cleanB !== '' && !isNaN(cleanA) && !isNaN(cleanB);

    let comparison = 0;

    if (isNumber) {
      comparison = Number(cleanA) - Number(cleanB);
    } else {
      comparison = valA.localeCompare(valB);
    }

    return isAscending ? comparison : -comparison;
  });

  tbody.append(...rows);
});

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
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
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;

document.body.append(form);

function showNotification(message, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function formatSalary(amount) {
  return `$${Number(amount).toLocaleString('en-US')}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employeeName = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  const salary = formData.get('salary');

  if (!employeeName || !position || !office || !age || !salary) {
    showNotification('All fields are required', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 letters long', 'error');

    return;
  }

  if (position.length < 4) {
    showNotification('Position must be at least 4 letters long', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const newRow = tbody.insertRow();

  newRow.insertCell().textContent = employeeName;
  newRow.insertCell().textContent = position;
  newRow.insertCell().textContent = office;
  newRow.insertCell().textContent = age;
  newRow.insertCell().textContent = formatSalary(salary);

  showNotification('Employee successfully added!', 'success');
  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.querySelector('input')) {
    return;
  }

  const existingInput = tbody.querySelector('.cell-input');

  if (existingInput) {
    existingInput.blur();
  }

  const origValue = td.textContent.trim();

  td.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.type = 'text';
  input.value = origValue;
  td.append(input);
  input.focus();

  const saveAndClose = () => {
    const newValue = input.value.trim();

    td.textContent = newValue !== '' ? newValue : origValue;
  };

  input.addEventListener('blur', saveAndClose);

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      input.removeEventListener('blur', saveAndClose);
      saveAndClose();
    }
  });
});
