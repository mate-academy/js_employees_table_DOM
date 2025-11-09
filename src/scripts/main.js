'use strict';

const currentSort = { column: null, direction: 'asc' };
let editingCell = null;
let originalValue = '';

function setupTableSorting() {
  const headers = document.querySelectorAll('thead th');

  headers.forEach((header, index) => {
    header.dataset.column = index;

    header.addEventListener('click', () => {
      const columnIndex = index;

      if (currentSort.column === columnIndex) {
        currentSort.direction =
          currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.direction = 'asc';
      }

      currentSort.column = columnIndex;

      sortTable(columnIndex, currentSort.direction);
    });
  });
}

function sortTable(columnIndex, direction) {
  const tbody = document.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    let aValue = a.cells[columnIndex].textContent.trim();
    let bValue = b.cells[columnIndex].textContent.trim();

    if (columnIndex === 3) {
      aValue = parseInt(aValue);
      bValue = parseInt(bValue);
    } else if (columnIndex === 4) {
      aValue = parseInt(aValue.replace(/[$,]/g, ''));
      bValue = parseInt(bValue.replace(/[$,]/g, ''));
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }

    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }

    return 0;
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
}

function setupRowSelection() {
  const tbody = document.querySelector('tbody');

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
}

function createForm() {
  const existingTable = document.querySelector('table');
  const wrapper = document.createElement('div');

  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'flex-start';

  existingTable.parentNode.insertBefore(wrapper, existingTable);
  wrapper.appendChild(existingTable);

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
      <input name="age" type="number" data-qa="age">
    </label>
    <label>
      Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>
    <button type="submit">Save to table</button>
  `;

  wrapper.appendChild(form);

  form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const nameF = formData.get('name').trim();
  const position = formData.get('position').trim();
  const office = formData.get('office');
  const age = parseInt(formData.get('age'));
  const salary = parseInt(formData.get('salary'));

  if (!nameF) {
    showNotification('Name required', 'Please enter employee name', 'error');

    return;
  }

  if (!position) {
    showNotification(
      'Position required',
      'Please enter employee position',
      'error',
    );

    return;
  }

  if (!office) {
    showNotification('Office required', 'Please select an office', 'error');

    return;
  }

  if (isNaN(age)) {
    showNotification('Age required', 'Please enter employee age', 'error');

    return;
  }

  if (isNaN(salary)) {
    showNotification(
      'Salary required',
      'Please enter employee salary',
      'error',
    );

    return;
  }

  if (nameF.length < 4) {
    showNotification(
      'Name too short',
      'Name must be at least 4 characters long',
      'error',
    );

    return;
  }

  if (age < 18) {
    showNotification(
      'Age too young',
      'Employee must be at least 18 years old',
      'error',
    );

    return;
  }

  if (age > 90) {
    showNotification(
      'Age too old',
      'Employee age cannot exceed 90 years',
      'error',
    );

    return;
  }

  addEmployee({
    name: nameF,
    position,
    office,
    age,
    salary,
  });

  showNotification('Success!', 'Employee added successfully', 'success');

  e.target.reset();
}

function addEmployee(employee) {
  const tbody = document.querySelector('tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>$${employee.salary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(row);
}

function showNotification(title, description, type) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  notification.innerHTML = `
    <span class="title">${title}</span>
    <p>${description}</p>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function setupCellEditing() {
  const tbody = document.querySelector('tbody');

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || editingCell) {
      return;
    }

    originalValue = cell.textContent.trim();
    editingCell = cell;

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = originalValue;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    input.select();

    const saveHandler = () => saveCellEdit(input);

    input.addEventListener('blur', saveHandler);

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        input.removeEventListener('blur', saveHandler);

        saveCellEdit(input);
      }
    });
  });
}

function saveCellEdit(input) {
  if (!editingCell) {
    return;
  }

  const newValue = input.value.trim();

  editingCell.textContent = newValue || originalValue;

  editingCell = null;
  originalValue = '';
}

function init() {
  setupTableSorting();
  setupRowSelection();
  createForm();
  setupCellEditing();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
