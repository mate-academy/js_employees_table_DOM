'use strict';

const table = document.querySelector('table');
const tableBody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

let currentColumn = null;
let sortAscending = true;

// Сортировка таблицы при клике на заголовок
headers.forEach((header, columnIndex) => {
  header.addEventListener('click', () => {
    if (currentColumn === columnIndex) {
      sortAscending = !sortAscending;
    } else {
      currentColumn = columnIndex;
      sortAscending = true;
    }

    const rows = Array.from(tableBody.rows);

    rows.sort((rowA, rowB) => {
      const valueA = rowA.cells[columnIndex].textContent.trim();
      const valueB = rowB.cells[columnIndex].textContent.trim();

      const numberA = Number(valueA.replace(/[$,]/g, ''));
      const numberB = Number(valueB.replace(/[$,]/g, ''));

      let comparison;

      if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
        comparison = numberA - numberB;
      } else {
        comparison = valueA.localeCompare(valueB);
      }

      return sortAscending ? comparison : -comparison;
    });

    rows.forEach((row) => tableBody.append(row));
  });
});

// Выбор строки при клике
tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tableBody.querySelectorAll('tr').forEach((item) => {
    item.classList.remove('active');
  });

  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

form.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name" required>
  </label>

  <label>
    Position:
    <input name="position" type="text" data-qa="position" required>
  </label>

  <label>
    Office:
    <select name="office" data-qa="office" required>
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
    <input name="age" type="number" data-qa="age" required>
  </label>

  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>

  <button type="submit">Save to table</button>
`;

table.after(form);

function showNotification(message, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add(type);
  notification.textContent = message;

  document.body.append(notification);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const age = Number(form.elements.age.value);
  const salary = Number(form.elements.salary.value);

  if (
    employeeName.length < 4 ||
    !position ||
    !office ||
    !form.elements.age.value ||
    !form.elements.salary.value ||
    age < 18 ||
    age > 90
  ) {
    showNotification('Please enter valid employee data', 'error');

    return;
  }

  const newRow = tableBody.insertRow();

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  form.reset();

  showNotification('Employee successfully added', 'success');
});
