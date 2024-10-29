'use strict';

'use strict';

const table = document.querySelector('table');
let sortOrder = 'asc';

table.tHead.addEventListener('click', (evt) => {
  const target = evt.target.closest('th');

  if (target) {
    const index = Array.from(target.parentNode.children).indexOf(target);
    const rows = Array.from(table.tBodies[0].rows);

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].textContent.trim();
      const cellB = rowB.cells[index].textContent.trim();

      if (!isNaN(cellA) && !isNaN(cellB)) {
        return sortOrder === 'asc' ? cellA - cellB : cellB - cellA;
      } else {
        return sortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    });

    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    sortedRows.forEach((row) => table.tBodies[0].appendChild(row));
  }
});

table.tBodies[0].addEventListener('click', (evt) => {
  const targetRow = evt.target.closest('tr');

  if (targetRow) {
    const rows = table.tBodies[0].querySelectorAll('tr');

    rows.forEach((row) => row.classList.remove('active'));
    targetRow.classList.add('active');
  }
});

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const employeeName = form.elements['name'].value.trim();
  const position = form.elements['position'].value.trim();
  const office = form.elements['office'].value.trim();
  const age = +form.elements['age'].value.trim();
  const salary = +form.elements['salary'].value.trim();

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

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
  table.tBodies[0].appendChild(newRow);

  showNotification('New employee added successfully', 'success');
  form.reset();
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

table.addEventListener('dblclick', (evt) => {
  const targetCell = evt.target.closest('td');

  if (targetCell) {
    const initialValue = targetCell.textContent;
    const input = document.createElement('input');

    input.value = initialValue;
    input.classList.add('cell-input');

    targetCell.textContent = '';
    targetCell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      targetCell.textContent = input.value || initialValue;
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        input.blur();
      }
    });
  }
});
