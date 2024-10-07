'use strict';

const table = document.querySelector('table');
const headers = document.querySelectorAll('th');
const rows = Array.from(table.querySelectorAll('tbody tr'));
const tbody = table.querySelector('tbody');

let isAscending = true;
let currentSortIndex = -1;

const sortTable = (index) => {
  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[index].innerText.trim();
    const cellB = rowB.cells[index].innerText.trim();

    switch (index) {
      case 3:
        return isAscending ? cellA - cellB : cellB - cellA;

      case 4:
        const sallaryA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
        const sallaryB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

        return isAscending ? sallaryA - sallaryB : sallaryB - sallaryA;

      default:
        return isAscending
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
    }
  });

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    isAscending = !header.classList.toggle('asc');

    headers.forEach((h, i) => {
      if (i !== index) {
        h.classList.remove('asc', 'desc');
      }
    });
    currentSortIndex = index;
    sortTable(index);
  });
});

table.addEventListener('click', (e) => {
  const selectedRow = e.target.closest('tbody tr');

  if (selectedRow) {
    document
      .querySelectorAll('tbody tr')
      .forEach((row) => row.classList.remove('active'));

    selectedRow.classList.add('active');
  }
});

const dataAttributes = ['name', 'position', 'office', 'age', 'salary'];
const form = document.createElement('form');
const button = document.createElement('button');

form.classList.add('new-employee-form');
button.type = 'submit';
button.textContent = 'Save to table';

const capitalizeFirstLetter = (text) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().trim();

const handleAddInput = () => {
  dataAttributes.forEach((attribute) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    label.textContent = capitalizeFirstLetter(`${attribute}:`);
    input.required = true;

    if (attribute === 'office') {
      const select = document.createElement('select');

      const cities = [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ];

      cities.forEach((city) => {
        const option = document.createElement('option');

        option.value = city;
        option.textContent = city;
        select.appendChild(option);
      });
      select.name = attribute;
      select.dataset.qa = attribute;
      label.textContent = capitalizeFirstLetter(`${attribute}:`);
      label.appendChild(select);
    } else {
      input.type = ['age', 'salary'].includes(attribute) ? 'number' : 'text';
      input.name = attribute;
      input.dataset.qa = attribute;

      input.addEventListener('input', () => {
        input.value = capitalizeFirstLetter(input.value);
      });
      label.appendChild(input);
    }

    form.appendChild(label);
  });
};

const showNotification = (message, isSuccess) => {
  const notification = document.createElement('div');

  notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
};

const handleAddEmployee = (e) => {
  e.preventDefault();

  const fullName = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const officeSelect = form.querySelector('select[name="office"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  const employeeName = fullName.value.trim();
  const position = positionInput.value.trim();
  const office = officeSelect.value;
  const age = parseInt(ageInput.value, 10);
  const salary = parseFloat(salaryInput.value);

  const warnings = [];

  if (employeeName.length < 4) {
    warnings.push('Name must be at least 4 characters long.');
  }

  if (positionInput.value.trim() !== positionInput.value) {
    warnings.push('Position field should not contain only spaces.');
  }

  if (positionInput.value.trim() === '') {
    warnings.push('Position field cannot be empty.');
  }

  if (age < 18 || age > 90) {
    warnings.push('Age must be between 18 and 90.');
  }

  if (isNaN(salary) || salary <= 0) {
    warnings.push('Salary must be a positive number.');
  }

  if (warnings.length > 0) {
    return showNotification(warnings.join('\n'), false);
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>`;

  rows.push(newRow);

  if (currentSortIndex !== -1) {
    sortTable(currentSortIndex);
  } else {
    tbody.appendChild(newRow);
  }

  showNotification('Employee added successfully!', true);
  form.reset();
};

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;

  if (target.tagName !== 'TD') {
    return;
  }

  const originalText = target.textContent;
  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = originalText;
  target.textContent += ' replaced by:';
  target.appendChild(input);
  input.focus();

  const saveEdit = () => {
    const newValue = input.value.trim();

    if (newValue) {
      target.textContent = newValue;
    } else {
      target.textContent = originalText;
    }

    input.remove();
  };

  input.addEventListener('blur', saveEdit);

  input.addEventListener('keydown', (action) => {
    if (action.key === 'Enter') {
      saveEdit();
    }
  });
});

handleAddInput();
form.appendChild(button);
document.body.appendChild(form);

form.addEventListener('submit', handleAddEmployee);
