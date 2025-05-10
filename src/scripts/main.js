/* eslint-disable no-shadow */
'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');
const form = document.createElement('form');
let selectedRow = null;

form.classList.add('new-employee-form');

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name"></label>
<label>Position: <input name="position" type="text" data-qa="position"></label>
<label>Office:
  <select name="office"  data-qa="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age: <input name="age" type="number" data-qa="age"></label>
<label>Salary: <input name="salary" type="number"  data-qa="salary"></label>
<button type="submit">Save to table</button>
`;

document.body.appendChild(form);

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const isAscending = header.dataset.order === 'asc';
    const order = isAscending ? 'desc' : 'asc';

    header.dataset.order = order;

    const rows = [...tbody.querySelectorAll('tr')];

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent;
      const cellB = rowB.cells[index].textContent;

      if (cellA.startsWith('$')) {
        const numA = Number(cellA.replace(/[$,]/g, ''));
        const numB = Number(cellB.replace(/[$,]/g, ''));

        return isAscending ? numB - numA : numA - numB;
      }

      return isAscending
        ? cellB.localeCompare(cellA)
        : cellA.localeCompare(cellB);
    });

    tbody.append(...sortedRows);
  });
});

tbody.addEventListener('click', (event) => {
  const row = event.target.closest('tr');

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  row.classList.add('active');
  selectedRow = row;
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = form.age.value.trim();
  const salary = form.salary.value.trim();

  if (!name || !position || !office || !age || !salary) {
    showNotification('All fields are required', 'error');

    return;
  }

  if (name.length < 4) {
    showNotification('Name must be at least 4 characters.', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  const row = document.createElement('tr');

  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(Number(salary));

  row.innerHTML = `
    <td>${name}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.appendChild(row);

  showNotification('Employee added successfully!', 'success');
  form.reset();
});

function showNotification(message, type) {
  const notification = document.createElement('div');
  const title = document.createElement('p');

  notification.classList.add('notification', type);
  title.classList.add('title');
  notification.setAttribute('data-qa', 'notification');
  title.innerHTML = `${message}`;

  notification.appendChild(title);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

table.addEventListener('dblclick', (event) => {
  const cell = event.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  const initialValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.type = 'text';
  input.value = initialValue;
  input.classList.add('cell-input');

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const saveValue = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue || initialValue;
  };

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveValue();
    }
  });
});
