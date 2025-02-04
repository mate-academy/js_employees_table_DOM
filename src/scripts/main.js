'use strict';

// 1. Сортування таблиці
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
let sortDirection = 1; // 1 - ASC, -1 - DESC

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortTable(index);
    sortDirection *= -1; // Зміна напрямку сортування
  });
});

function sortTable(columnIndex) {
  const tbody = table.querySelector('tbody');
  const rowsTr = Array.from(tbody.querySelectorAll('tr'));

  rowsTr.sort((a, b) => {
    const cellA = a.children[columnIndex].textContent.trim();
    const cellB = b.children[columnIndex].textContent.trim();

    return isNaN(cellA) || isNaN(cellB)
      ? cellA.localeCompare(cellB) * sortDirection
      : (cellA - cellB) * sortDirection;
  });

  tbody.innerHTML = '';
  rowsTr.forEach((row) => tbody.appendChild(row));
}

// 2. Вибір рядка
const rows = table.querySelectorAll('tbody tr');

rows.forEach((row) => {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('tr.active')
      .forEach((tr) => tr.classList.remove('active'));
    row.classList.add('active');
  });
});

// 3. Додавання нового працівника
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input type="text" data-qa="name" required></label>
  <label>Position: <input type="text" data-qa="position" required></label>
  <label>Age: <input type="number" data-qa="age" min="18" max="90" required></label>
  <label>Salary: <input type="number" data-qa="salary" required></label>
  <label>Office:
    <select data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <button type="submit">Save to table</button>
`;
document.body.appendChild(form);

// 4. Валідація форми
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameData = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const age = +form.querySelector('[data-qa="age"]').value;
  const salary = +form.querySelector('[data-qa="salary"]').value;
  const office = form.querySelector('[data-qa="office"]').value;

  if (nameData.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  addEmployeeToTable(nameData, position, office, age, salary);
  showNotification('Employee added successfully!', 'success');
  form.reset();
});

function addEmployeeToTable(names, position, office, age, salary) {
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;
  table.querySelector('tbody').appendChild(newRow);
}

// 5. Відображення повідомлень
function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<span class="title">${type.toUpperCase()}</span><p>${message}</p>`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
