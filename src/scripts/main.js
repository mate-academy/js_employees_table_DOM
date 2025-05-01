'use strict';

const headers = [...document.querySelectorAll('table thead th')];
const tbody = document.querySelector('table tbody');
const rows = [...document.querySelectorAll('tbody tr')];
const clickCounts = new Array(headers.length).fill(0);

// визначення напрямку
headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    clickCounts[index]++;

    const direction = clickCounts[index] % 2 === 1 ? 'asc' : 'desc';

    sortRows(index, direction);
  });
});

// сортування
function sortRows(index, direction) {
  const sortedRows = rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].textContent.replace(/[$,]/g, '');
    const cellB = rowB.cells[index].textContent.replace(/[$,]/g, '');
    const isNumber = !isNaN(cellA) && !isNaN(cellB);

    if (isNumber) {
      return direction === 'asc'
        ? parseFloat(cellA) - parseFloat(cellB)
        : parseFloat(cellB) - parseFloat(cellA);
    }

    return direction === 'asc'
      ? cellA.localeCompare(cellB)
      : cellB.localeCompare(cellA);
  });

  tbody.innerHTML = '';

  sortedRows.forEach((row) => {
    tbody.appendChild(row);
  });
}

// виділення рядка
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  rows.forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

// додання форми
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label> Name: <input type="text" name="name" data-qa="name" required/></label>
  <label> Position: <input type="text" name="position" data-qa="position" /></label>
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
  <label> Age: <input type="number" name="age" data-qa="age" required/></label>
  <label> Salary: <input type="number" name="salary" data-qa="salary" required/></label>
  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

// показ повідомлення про успіх/помилку
function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// додання співробітника
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = +form.age.value;
  const salary = +form.salary.value;

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (position.length < 3) {
    showNotification('Position must be at least 3 characters long.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;
  tbody.appendChild(newRow);
  showNotification('Employee added successfully!', 'success');
  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');
  const cellValue = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = cellValue;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const saveChanges = () => {
    cell.textContent = input.value || cellValue;
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keypress', (digital) => {
    if (digital.key === 'Enter') {
      saveChanges();
    }
  });
});
