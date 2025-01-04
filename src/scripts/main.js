'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

function sortTable(index, asc) {
  const rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    const cellA = a.cells[index].textContent.trim();
    const cellB = b.cells[index].textContent.trim();

    if (!isNaN(parseFloat(cellA)) && !isNaN(parseFloat(cellB))) {
      return asc
        ? parseFloat(cellA) - parseFloat(cellB)
        : parseFloat(cellB) - parseFloat(cellA);
    }

    return asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
  });

  tbody.append(...rows);
}

let currentSort = { index: -1, asc: true };
const headers = table.querySelectorAll('thead th');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const asc = currentSort.index === index ? !currentSort.asc : true;

    currentSort = { index, asc };
    sortTable(index, asc);
  });
});

tbody.addEventListener('click', (e) => {
  if (e.target.tagName === 'TD') {
    const row = e.target.closest('tr');

    tbody
      .querySelectorAll('.active')
      .forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="employeeName" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office: 
    <select name="office" data-qa="office" required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" min="18" max="90" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
`;
document.body.appendChild(form);

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<span class="title">${type.toUpperCase()}</span><p>${message}</p>`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.employeeName.value.trim();
  const position = form.position.value.trim();
  const office = form.office.value;
  const age = Math.floor(+form.age.value.trim());
  const salary = +form.salary.value;

  if (employeeName.length < 4) {
    showNotification('error', 'Name must have at least 4 characters.');

    return;
  }

  if (position.length < 2) {
    showNotification('error', 'Position must have at least 2 characters.');

    return;
  }

  if (isNaN(age)) {
    showNotification('error', 'Age must be a valid number.');

    return;
  }

  if (age < 18) {
    showNotification('error', 'Age must be at least 18.');

    return;
  }

  if (age > 90) {
    showNotification('error', 'Age must not exceed 90.');

    return;
  }

  if (isNaN(salary) || salary <= 0) {
    showNotification('error', 'Salary must be a positive number.');

    return;
  }

  const newRow = tbody.insertRow();

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;
  form.reset();
  showNotification('success', 'New employee added successfully.');
});

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName === 'TD') {
    const cell = e.target;
    const initialValue = cell.textContent;
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue.replace(/[$,]/g, '');

    input.addEventListener('blur', () => {
      const newValue = input.value.trim();

      if (cell.cellIndex === 3) {
        // Validate age
        if (!isNaN(newValue) && newValue >= 18 && newValue <= 90) {
          cell.textContent = parseInt(newValue, 10);
        } else {
          showNotification('error', 'Age must be a number between 18 and 90.');
          cell.textContent = initialValue;
        }
      } else if (cell.cellIndex === 4) {
        if (!isNaN(newValue) && newValue > 0) {
          cell.textContent = `$${parseFloat(newValue).toLocaleString('en-US')}`;
        } else {
          showNotification('error', 'Salary must be a positive number.');
          cell.textContent = initialValue;
        }
      } else {
        cell.textContent = newValue || initialValue;
      }
      input.remove();
    });

    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        const newValue = input.value.trim();

        if (cell.cellIndex === 3) {
          if (!isNaN(newValue) && newValue >= 18 && newValue <= 90) {
            cell.textContent = parseInt(newValue, 10);
          } else {
            showNotification(
              'error',
              'Age must be a number between 18 and 90.',
            );
            cell.textContent = initialValue;
          }
        } else if (cell.cellIndex === 4) {
          if (!isNaN(newValue) && newValue > 0) {
            cell.textContent = `$${parseFloat(newValue).toLocaleString('en-US')}`;
          } else {
            showNotification('error', 'Salary must be a positive number.');
            cell.textContent = initialValue;
          }
        } else {
          cell.textContent = newValue || initialValue;
        }
        input.remove();
      }
    });

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
  }
});
