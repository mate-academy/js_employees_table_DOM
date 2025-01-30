'use strict';

const tableHeaders = document.querySelectorAll('thead th');
const tableBody = document.querySelector('tbody');
let sortDirection = true;

tableHeaders.forEach((header) => {
  header.addEventListener('click', () => {
    const columnIndex = Array.from(header.parentElement.children).indexOf(
      header,
    );

    sortTable(columnIndex);
    sortDirection = !sortDirection;
  });
});

const sortTable = (columnIndex) => {
  const rows = Array.from(tableBody.rows);

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    return (
      cellA.localeCompare(cellB, undefined, { numeric: true }) *
      (sortDirection ? 1 : -1)
    );
  });

  rows.forEach((row) => tableBody.appendChild(row));
};

document.querySelectorAll('table tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('table tbody tr')
      .forEach((item) => item.classList.remove('active'));

    row.classList.add('active');
  });
});

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

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.name.value;
  const position = form.position.value;
  const office = form.office.value;
  const age = +form.age.value;
  const salary = +form.salary.value;

  if (employeeName.length < 4) {
    showNotification('The name must be at least 4 characters long.', 'error');

    return;
  }

  if (position.length < 3) {
    showNotification(
      'The position must contain at least 3 characters.',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90 years old.', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tableBody.appendChild(newRow);

  showNotification('New employee added successfully!', 'success');

  form.reset();
});

tableBody.addEventListener('dblclick', (e) => {
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

function showNotification(message, type) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.classList.add('notification');
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');

  notificationTitle.textContent = `${type}`;

  notificationText.textContent = `${message}`;

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
