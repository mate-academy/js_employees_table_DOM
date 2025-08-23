'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');
let sortDirections = {};
let selectedRow = null;
let editingCell = null;

const sortTable = (headerIndex) => {
  const tableRows = Array.from(tbody.children);
  const currentDirection =
    sortDirections[headerIndex] === 'asc' ? 'desc' : 'asc';

  sortDirections = {};
  sortDirections[headerIndex] = currentDirection;

  tableRows.sort((rowA, rowB) => {
    let cellA = rowA.children[headerIndex].textContent;
    let cellB = rowB.children[headerIndex].textContent;

    if (headerIndex === 3 || headerIndex === 4) {
      cellA = parseInt(cellA.replace(/[^0-9]/g, ''), 10);
      cellB = parseInt(cellB.replace(/[^0-9]/g, ''), 10);
    }

    if (cellA < cellB) {
      return currentDirection === 'asc' ? -1 : 1;
    }

    if (cellA > cellB) {
      return currentDirection === 'asc' ? 1 : -1;
    }

    return 0;
  });

  tbody.innerHTML = '';
  tableRows.forEach((row) => tbody.appendChild(row));
};

const createForm = () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];
  const types = ['text', 'text', 'number', 'number'];
  const dataQAs = ['name', 'position', 'office', 'age', 'salary'];
  const options = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  labels.forEach((labelText, index) => {
    const label = document.createElement('label');

    label.textContent = `${labelText}: `;

    if (index === 2) {
      const selectOffice = document.createElement('select');

      selectOffice.name = dataQAs[index];
      selectOffice.setAttribute('data-qa', dataQAs[index]);

      options.forEach((optionText) => {
        const option = document.createElement('option');

        option.textContent = optionText;
        option.value = optionText;

        selectOffice.appendChild(option);
      });

      label.appendChild(selectOffice);
      form.appendChild(label);

      return;
    }

    const input = document.createElement('input');

    input.name = dataQAs[index];
    input.type = types[index];
    input.setAttribute('data-qa', dataQAs[index]);

    label.appendChild(input);
    form.appendChild(label);
  });

  const btn = document.createElement('button');

  btn.textContent = 'Save to table';
  btn.type = 'submit';

  form.appendChild(btn);

  document.body.appendChild(form);
};

const showNotification = (message, type) => {
  const notification = document.createElement('div');
  const title = document.createElement('h2');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;
  title.className = `title`;
  title.textContent = `${message}`;
  notification.appendChild(title);
  notification.style.display = 'block';

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
};

const validateForm = (formData) => {
  const nameValue = formData.get('name');
  const position = formData.get('position');
  const office = formData.get('office');
  const age = parseInt(formData.get('age'));
  const salary = formData.get('salary');

  if (!nameValue || !position || !office || !age || !salary) {
    showNotification('All fields are required.', 'error');

    return false;
  }

  if (nameValue.length < 4) {
    showNotification('Name must be at least 4 letters.', 'error');

    return false;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return false;
  }

  return true;
};

const addEmployee = (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  if (validateForm(formData)) {
    const newRow = document.createElement('tr');

    const nameInput = formData.get('name').toLowerCase().split(' ');
    const formattedName = nameInput
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    const nameCell = document.createElement('td');

    nameCell.textContent = formattedName;
    newRow.appendChild(nameCell);

    const positionInput = formData.get('position');
    const formattedPosition =
      positionInput.charAt(0).toUpperCase() + positionInput.slice(1);
    const positionCell = document.createElement('td');

    positionCell.textContent = formattedPosition;
    newRow.appendChild(positionCell);

    const officeCell = document.createElement('td');

    officeCell.textContent = formData.get('office');
    newRow.appendChild(officeCell);

    const ageCell = document.createElement('td');

    ageCell.textContent = formData.get('age');
    newRow.appendChild(ageCell);

    const salaryCell = document.createElement('td');
    const salaryValue = parseInt(formData.get('salary'), 10);

    salaryCell.textContent = `$${salaryValue.toLocaleString('en-US')}`;
    newRow.appendChild(salaryCell);

    tbody.appendChild(newRow);
    showNotification('Employee successfully added.', 'success');
    form.reset();
  }
};

const handleCellEdit = (cell) => {
  if (editingCell) {
    return;
  }

  editingCell = cell;

  const originalText = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalText;
  cell.appendChild(input);
  input.focus();

  const saveChanges = () => {
    let newText = input.value.trim();

    if (newText === '') {
      cell.textContent = originalText;
    } else {
      if (cell.cellIndex === 4) {
        const salaryValue = parseInt(newText.replace(/[^0-9]/g, ''), 10);

        newText = `$${salaryValue.toLocaleString('en-US')}`;
      }
      cell.textContent = newText;
    }
    editingCell = null;
  };

  const cancelChanges = () => {
    cell.textContent = originalText;
    editingCell = null;
  };

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveChanges();
    } else if (e.key === 'Escape') {
      cancelChanges();
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  createForm();

  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', addEmployee);

  table.addEventListener('click', (e) => {
    const el = e.target;
    const row = el.closest('tr');
    const header = el.closest('th');

    if (row && row.parentNode === tbody) {
      if (selectedRow) {
        selectedRow.classList.remove('active');
      }
      row.classList.add('active');
      selectedRow = row;
    } else if (header) {
      const headerIndex = Array.from(headers).indexOf(header);

      sortTable(headerIndex);
    }
  });

  table.addEventListener('dblclick', (e) => {
    const target = e.target;

    if (target.tagName === 'TD') {
      handleCellEdit(target);
    }
  });
});
