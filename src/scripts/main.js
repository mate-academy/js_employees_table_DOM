'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  let sortDirection = 'ASC';
  let currentSortingColumn = null;

  // Table sorting
  table.addEventListener('click', (evnt) => {
    if (evnt.target.tagName === 'TH') {
      const columnName = evnt.target.textContent;

      if (currentSortingColumn === columnName) {
        sortDirection = sortDirection === 'ASC' ? 'DESC' : 'ASC';
      } else {
        sortDirection = 'ASC';
      }
      currentSortingColumn = columnName;
      sortTable(columnName, sortDirection);
    }
  });

  function sortTable(columnName, direction) {
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const columnIndex = Array.from(table.querySelectorAll(
      'th')).findIndex(th => th.textContent === columnName);

    rows.sort((a, b) => {
      const cellA = a.cells[columnIndex].textContent;
      const cellB = b.cells[columnIndex].textContent;

      if (!isNaN(+cellA) && !isNaN(+cellB)) {
        return direction === 'ASC' ? (+cellA) - (+cellB) : (+cellB) - (+cellA);
      }

      return direction === 'ASC' ? cellA.localeCompare(
        cellB) : cellB.localeCompare(cellA);
    });

    rows.forEach(row => tbody.appendChild(row));
  }

  // Row selection
  tbody.addEventListener('click', (evnt) => {
    if (evnt.target.tagName === 'TD') {
      const row = evnt.target.parentNode;
      const previousActiveRow = tbody.querySelector('.active');

      if (previousActiveRow) {
        previousActiveRow.classList.remove('active');
      }
      row.classList.add('active');
    }
  });

  // Add form
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="employeeName" type="text" data-qa="name"></label>
    <label>Position: <input name="position"
     type="text" data-qa="position"></label>
    <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age"></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
    <button type="submit">Save to table</button>
  `;

  document.body.appendChild(form);

  // Form validation and submission
  form.addEventListener('submit', (evnt) => {
    evnt.preventDefault();

    const employeeName = form.elements.employeeName.value.trim();
    const position = form.elements.position.value.trim();
    const office = form.elements.office.value;
    const age = +form.elements.age.value;
    const salary = +form.elements.salary.value;

    if (employeeName.length < 4) {
      showErrorNotification('Name should be at least 4 characters');

      return;
    }

    if (age < 18 || age > 90) {
      showErrorNotification('Age should be between 18 and 90');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}</td>
    `;
    tbody.appendChild(newRow);
    showSuccessNotification('New employee added');
    form.reset();
  });

  function showErrorNotification(message) {
    const notification = createNotification('error', message);

    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  }

  function showSuccessNotification(message) {
    const notification = createNotification('success', message);

    document.body.appendChild(notification);
    setTimeout(() => document.body.removeChild(notification), 3000);
  }

  function createNotification(type, message) {
    const notification = document.createElement('div');

    notification.className = type;
    notification.dataset.qa = 'notification';
    notification.textContent = message;

    return notification;
  }

  // Editing table cells
  tbody.addEventListener('dblclick', (evnt) => {
    if (evnt.target.tagName === 'TD') {
      const cell = evnt.target;
      const input = document.createElement('input');

      input.className = 'edit-input';
      input.type = 'text';
      input.value = cell.textContent;

      cell.textContent = '';
      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        const newValue = input.value.trim();

        if (newValue !== '') {
          cell.textContent = newValue;
        }

        cell.removeChild(input);
      });

      input.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter') {
          input.blur();
        }
      });
    }
  });
});
