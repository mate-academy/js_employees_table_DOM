'use strict';

document.addEventListener('DOMContentLoaded', init);

function init() {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');

  let currentSortColumn = null;
  let currentSortDirection = 'asc';
  let editingCell = null;

  createNotificationContainer();
  createForm();
  initSorting();
  initRowSelection();
  initCellEditing();

  function createNotificationContainer() {
    if (!document.querySelector('[data-qa="notification-container"]')) {
      const container = document.createElement('div');

      container.dataset.qa = 'notification-container';
      document.body.appendChild(container);
    }
  }

  function initSorting() {
    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        handleSort(index);
      });
    });
  }

  function handleSort(index) {
    if (currentSortColumn === index) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = index;
      currentSortDirection = 'asc';
    }

    sortTable(index);
  }

  function sortTable(index) {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const valueA = rowA.children[index].textContent.trim();
      const valueB = rowB.children[index].textContent.trim();

      if (index === 3) {
        return currentSortDirection === 'asc'
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      if (index === 4) {
        const salaryA = Number(valueA.replace(/[$,]/g, ''));
        const salaryB = Number(valueB.replace(/[$,]/g, ''));

        return currentSortDirection === 'asc'
          ? salaryA - salaryB
          : salaryB - salaryA;
      }

      return currentSortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    rows.forEach((row) => tbody.appendChild(row));
  }

  function initRowSelection() {
    tbody.addEventListener('click', (e) => {
      const row = e.target.closest('tr');

      if (!row) {
        return;
      }

      clearActiveRows();
      row.classList.add('active');
    });
  }

  function clearActiveRows() {
    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));
  }

  function createForm() {
    const form = document.createElement('form');

    form.className = 'new-employee-form';

    form.innerHTML = `
      <label>
        Name:
        <input type="text" name="name" data-qa="name">
      </label>

      <label>
        Position:
        <input type="text" name="position" data-qa="position">
      </label>

      <label>
        Office:
        <select name="office" data-qa="office">
          <option value="">Select office</option>
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
        <input type="number" name="age" data-qa="age">
      </label>

      <label>
        Salary:
        <input type="number" name="salary" data-qa="salary">
      </label>

      <button type="submit">Save to table</button>
    `;

    document.body.appendChild(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(form);
    });
  }

  function handleFormSubmit(form) {
    const data = getFormData(form);
    const error = validateData(data);

    if (error) {
      showNotification(error, 'error');

      return;
    }

    addEmployee(data);
    showNotification('Employee successfully added!', 'success');
    form.reset();
  }

  function getFormData(form) {
    return {
      name: form.name.value.trim(),
      position: form.position.value.trim(),
      office: form.office.value,
      age: form.age.value === '' ? null : Number(form.age.value),
      salary: form.salary.value === '' ? null : Number(form.salary.value),
    };
  }

  function validateData(data) {
    if (data.name.length < 4) {
      return 'Name must contain at least 4 characters.';
    }

    if (!data.position.trim()) {
      return 'Position is required';
    }

    if (!data.office) {
      return 'Office is required';
    }

    if (data.age === null) {
      return 'Age is required';
    }

    if (data.age < 18 || data.age > 90) {
      return 'Age must be between 18 and 90.';
    }

    if (data.salary === null) {
      return 'Salary is required';
    }

    return null;
  }

  function addEmployee(data) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.position}</td>
      <td>${data.office}</td>
      <td>${data.age}</td>
      <td>$${Number(data.salary).toLocaleString('en-US')}</td>
    `;

    tbody.appendChild(row);
  }

  function showNotification(message, type) {
    const container = document.querySelector(
      '[data-qa="notification-container"]',
    );

    if (!container) {
      return;
    }

    container.querySelector('[data-qa="notification"]')?.remove();

    const notification = document.createElement('div');

    notification.dataset.qa = 'notification';
    notification.className = type;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  function initCellEditing() {
    tbody.addEventListener('dblclick', (e) => {
      const cell = e.target.closest('td');

      if (!cell || editingCell) {
        return;
      }

      startEditing(cell);
    });
  }

  function startEditing(cell) {
    editingCell = cell;

    const initialValue = cell.textContent;

    cell.textContent = '';

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;

    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => finishEditing(input, initialValue));

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        finishEditing(input, initialValue);
      }
    });
  }

  function finishEditing(input, initialValue) {
    const newValue = input.value.trim();

    editingCell.textContent = newValue || initialValue;
    editingCell = null;
  }
}
