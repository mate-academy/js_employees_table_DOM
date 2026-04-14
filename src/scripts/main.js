'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = [...table.querySelectorAll('thead th')];

  const notification = createNotification();
  const form = createEmployeeForm();

  const sortState = {};

  headers.forEach((header, index) => {
    header.addEventListener('click', () => sortTableByColumn(index));
  });

  tbody.addEventListener('click', handleRowSelection);
  tbody.addEventListener('dblclick', handleCellEditing);
  form.addEventListener('submit', handleFormSubmit);

  function createNotification() {
    const element = document.createElement('div');

    element.setAttribute('data-qa', 'notification');
    document.body.appendChild(element);

    return element;
  }

  function createEmployeeForm() {
    const formElement = document.createElement('form');

    formElement.className = 'new-employee-form';

    formElement.innerHTML = `
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

    document.body.appendChild(formElement);

    return formElement;
  }

  function showNotification(message, type) {
    notification.textContent = message;
    notification.classList.remove('error', 'success');
    notification.classList.add(type);
  }

  function sortTableByColumn(columnIndex) {
    const rows = [...tbody.querySelectorAll('tr')];
    const isAscending = sortState[columnIndex] !== 'asc';

    rows.sort((rowA, rowB) => {
      const valueA = getCellValue(rowA, columnIndex);
      const valueB = getCellValue(rowB, columnIndex);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return isAscending ? valueA - valueB : valueB - valueA;
      }

      return isAscending
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });

    rows.forEach((row) => tbody.appendChild(row));
    sortState[columnIndex] = isAscending ? 'asc' : 'desc';
  }

  function getCellValue(row, columnIndex) {
    const rawValue = row.children[columnIndex].innerText.replace(/[$,]/g, '');
    const numericValue = Number(rawValue);

    return Number.isNaN(numericValue) ? rawValue : numericValue;
  }

  function handleRowSelection(ev) {
    const row = ev.target.closest('tr');

    if (!row) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((tableRow) => {
      tableRow.classList.remove('active');
    });

    row.classList.add('active');
  }

  function handleFormSubmit(evnt) {
    evnt.preventDefault();

    const formData = Object.fromEntries(new FormData(form));
    const employee = {
      name: formData.name.trim(),
      position: formData.position.trim(),
      office: formData.office,
      age: Number(formData.age),
      salary: Number(formData.salary),
    };

    const errorMessage = validateEmployee(employee);

    if (errorMessage) {
      showNotification(errorMessage, 'error');

      return;
    }

    const row = buildEmployeeRow(employee);

    tbody.appendChild(row);
    showNotification('Employee added successfully', 'success');
    form.reset();
  }

  function validateEmployee(employee) {
    if (employee.name.length < 4) {
      return 'Name must be at least 4 characters long';
    }

    if (!employee.position) {
      return 'Position is required';
    }

    if (employee.age < 18 || employee.age > 90) {
      return 'Age must be between 18 and 90';
    }

    if (!Number.isFinite(employee.salary) || employee.salary <= 0) {
      return 'Salary is required';
    }

    return '';
  }

  function buildEmployeeRow(employee) {
    const row = document.createElement('tr');
    const cells = [
      employee.name,
      employee.position,
      employee.office,
      String(employee.age),
      formatSalary(employee.salary),
    ];

    cells.forEach((value) => {
      const cell = document.createElement('td');

      cell.textContent = value;
      row.appendChild(cell);
    });

    return row;
  }

  function formatSalary(salary) {
    return `$${salary.toLocaleString('en-US')}`;
  }

  function handleCellEditing(e) {
    const cell = e.target.closest('td');

    if (!cell || document.querySelector('.cell-input')) {
      return;
    }

    const oldValue = cell.innerText;
    const input = document.createElement('input');

    input.value = oldValue;
    input.className = 'cell-input';

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    const save = () => {
      cell.innerText = input.value.trim() || oldValue;
    };

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (keyboardEvent) => {
      if (keyboardEvent.key === 'Enter') {
        save();
      }
    });
  }
});
