'use strict';

// write code here

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

let currentSortIndex = null;
let isAsc = true;

function getCellValue(row, index) {
  const text = row.cells[index].textContent.trim();

  if (index === 3) {
    return Number(text);
  }

  if (index === 4) {
    return Number(text.replace(/[$,]/g, ''));
  }

  return text.toLowerCase();
}

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentSortIndex === index) {
      isAsc = !isAsc;
    } else {
      currentSortIndex = index;
      isAsc = true;
    }

    headers.forEach((item) => {
      item.classList.remove('sort-asc', 'sort-desc');
    });

    header.classList.add(isAsc ? 'sort-asc' : 'sort-desc');

    const rows = [...tbody.rows];

    rows.sort((rowA, rowB) => {
      const valueA = getCellValue(rowA, index);
      const valueB = getCellValue(rowB, index);

      if (typeof valueA === 'number') {
        return isAsc ? valueA - valueB : valueB - valueA;
      }

      return isAsc
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    rows.forEach((row) => {
      tbody.appendChild(row);
    });
  });
});

tbody.addEventListener('click', (clickEvent) => {
  const tableRow = clickEvent.target.closest('tr');

  if (!tableRow) {
    return;
  }

  [...tbody.rows].forEach((row) => {
    row.classList.remove('active');
  });

  tableRow.classList.add('active');
});

function showNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name">
  </label>

  <label>
    Position:
    <input name="position" type="text" data-qa="position">
  </label>

  <label>
    Office:
    <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>

  <label>
    Age:
    <input name="age" type="number" data-qa="age">
  </label>

  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>

  <button type="submit">Save to table</button>
`;

document.body.appendChild(form);

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  const formData = new FormData(form);

  const employeeName = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = Number(formData.get('age'));
  const salary = Number(formData.get('salary'));

  if (employeeName.length < 4) {
    showNotification('error', 'Error', 'Name is too short');

    return;
  }

  if (!position) {
    showNotification('error', 'Error', 'Position is required');

    return;
  }

  if (!salary) {
    showNotification('error', 'Error', 'Salary is required');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Error', 'Age should be between 18 and 90');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(row);

  form.reset();

  showNotification('success', 'Success', 'Employee was added to the table');
});

tbody.addEventListener('dblclick', (dblClickEvent) => {
  const cell = dblClickEvent.target.closest('td');

  if (!cell || document.querySelector('.cell-input')) {
    return;
  }

  const oldValue = cell.textContent;
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldValue;

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  function saveCell() {
    const newValue = input.value.trim();

    cell.textContent = newValue || oldValue;
  }

  input.addEventListener('blur', saveCell);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      saveCell();
    }
  });
});
