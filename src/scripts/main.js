'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  let currentSortColumn = null;
  let currentSortDirection = 'asc';

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const columnIndex = th.cellIndex;

    if (currentSortColumn === columnIndex) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = columnIndex;
      currentSortDirection = 'asc';
    }

    sortTable(columnIndex, currentSortDirection);
  });

  function sortTable(columnIndex, direction) {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const cellA = rowA.cells[columnIndex].textContent.trim();
      const cellB = rowB.cells[columnIndex].textContent.trim();

      const isSalary = cellA.startsWith('$') || cellB.startsWith('$');

      if (isSalary) {
        const salaryA = Number(cellA.replace(/[^0-9.-]+/g, '')) || 0;
        const salaryB = Number(cellB.replace(/[^0-9.-]+/g, '')) || 0;

        return direction === 'asc' ? salaryA - salaryB : salaryB - salaryA;
      }

      const ageA = Number(cellA);
      const ageB = Number(cellB);

      if (
        !Number.isNaN(ageA) &&
        !Number.isNaN(ageB) &&
        cellA !== '' &&
        cellB !== ''
      ) {
        return direction === 'asc' ? ageA - ageB : ageB - ageA;
      }

      return direction === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    rows.forEach((row) => tbody.appendChild(row));
  }

  tbody.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT') {
      return;
    }

    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    const activeRow = tbody.querySelector('tr.active');

    if (activeRow && activeRow !== row) {
      activeRow.classList.remove('active');
    }

    row.classList.add('active');
  });

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" /></label>
    <label>Position: <input name="position" type="text" data-qa="position" /></label>
    <label>Office:
      <select name="office" data-qa="office">
        ${offices.map((office) => `<option value="${office}">${office}</option>`).join('')}
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" /></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" /></label>
    <button type="submit">Save to table</button>
  `;

  document.body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.elements.name;
    const positionInput = form.elements.position;
    const officeInput = form.elements.office;
    const ageInput = form.elements.age;
    const salaryInput = form.elements.salary;

    const employeeName = nameInput.value.trim();
    const employeePosition = positionInput.value.trim();
    const employeeOffice = officeInput.value.trim();
    const employeeAge = Number(ageInput.value);
    const employeeSalary = Number(salaryInput.value);

    if (
      !employeeName ||
      !employeePosition ||
      !employeeOffice ||
      ageInput.value === '' ||
      salaryInput.value === ''
    ) {
      showNotification('error', 'All fields are required');

      return;
    }

    if (employeeName.length < 4) {
      showNotification('error', 'Name must contain at least 4 letters');

      return;
    }

    if (employeeAge < 18 || employeeAge > 90) {
      showNotification('error', 'Age must be between 18 and 90');

      return;
    }

    const formattedSalary = `$${employeeSalary.toLocaleString('en-US')}`;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${employeeName}</td>
      <td>${employeePosition}</td>
      <td>${employeeOffice}</td>
      <td>${employeeAge}</td>
      <td>${formattedSalary}</td>
    `;
    tbody.appendChild(newRow);

    form.reset();
    showNotification('success', 'Employee added successfully');
  });

  function showNotification(type, message) {
    const existingNotification = document.querySelector(
      '[data-qa="notification"]',
    );

    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  }

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || cell.querySelector('input')) {
      return;
    }

    const activeInput = tbody.querySelector('.cell-input');

    if (activeInput) {
      activeInput.blur();
    }

    const initialText = cell.textContent.trim();

    cell.textContent = '';

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialText;

    cell.appendChild(input);
    input.focus();

    let isSaved = false;

    const finishEdit = () => {
      if (isSaved) {
        return;
      }
      isSaved = true;

      const newText = input.value.trim();

      cell.textContent = newText !== '' ? newText : initialText;
    };

    input.addEventListener('blur', finishEdit);

    input.addEventListener('keydown', (keyEvent) => {
      if (keyEvent.key === 'Enter') {
        finishEdit();
      } else if (keyEvent.key === 'Escape') {
        isSaved = true;
        cell.textContent = initialText;
      }
    });
  });
});
