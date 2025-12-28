'use strict';

const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');

const employeeForm = document.createElement('form');

employeeForm.classList.add('new-employee-form');

const fields = [
  { label: 'Name', type: 'text', name: 'name' },
  { label: 'Position', type: 'text', name: 'position' },
  {
    label: 'Office',
    name: 'office',
    type: 'select',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  { label: 'Salary', type: 'number', name: 'salary' },
  { label: 'Age', type: 'number', name: 'age' },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}: `;

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((optionValue) => {
      const option = document.createElement('option');

      option.value = optionValue;
      option.textContent = optionValue;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.name = field.name;
  input.setAttribute('data-qa', field.name);
  input.required = true;
  label.appendChild(input);
  employeeForm.appendChild(label);
});

const btn = document.createElement('button');

btn.type = 'submit';
btn.textContent = 'Save to table';
employeeForm.appendChild(btn);
document.body.appendChild(employeeForm);

tBody.addEventListener('click', (e) => {
  const currentRow = e.target.closest('tr');

  if (currentRow) {
    const activeRow = tBody.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    currentRow.classList.add('active');
  }
});

function showNotification(type, message) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.textContent = message;
  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = employeeForm.elements.name.value;
  const age = Number(employeeForm.elements.age.value);
  const position = employeeForm.elements.position.value;
  const office = employeeForm.elements.office.value;
  const salary = employeeForm.elements.salary.value;

  if (employeeName.length < 4) {
    showNotification('error', 'Name must be at least 4 characters long.');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Age must be between 18 and 90.');

    return;
  }

  const newRow = tBody.insertRow();

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${Number(salary).toLocaleString()}</td>
  `;

  showNotification('success', 'Employee added successfully!');
  employeeForm.reset();
});

const headers = tHead.querySelectorAll('th');
let sortDirection = true;
let lastIndex = -1;

headers.forEach((header, index) => {
  header.style.cursor = 'pointer';

  header.addEventListener('click', () => {
    const rowsArray = Array.from(tBody.rows);

    if (lastIndex === index) {
      sortDirection = !sortDirection;
    } else {
      sortDirection = true;
    }

    rowsArray.sort((rowA, rowB) => {
      const clean = (str) => str.replace(/[$,]/g, '');
      const cellA = rowA.cells[index].textContent.trim();
      const cellB = rowB.cells[index].textContent.trim();

      const valA = clean(cellA);
      const valB = clean(cellB);

      if (valA !== '' && !isNaN(valA) && valB !== '' && !isNaN(valB)) {
        return sortDirection
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      return sortDirection
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    rowsArray.forEach((row) => tBody.appendChild(row));
    lastIndex = index;
  });
});

tBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || cell.querySelector('input')) {
    return;
  }

  const originalValue = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = originalValue;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const save = () => {
    const newValue = input.value.trim();

    cell.textContent = newValue !== '' ? newValue : originalValue;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      save();
    }
  });
});
