'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

// --------------------------------------------------
// SORTING
// --------------------------------------------------

let currentSort = {
  column: null,
  direction: 'asc',
};

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const direction =
      currentSort.column === index && currentSort.direction === 'asc'
        ? 'desc'
        : 'asc';

    currentSort = {
      column: index,
      direction,
    };

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const valueA = rowA.cells[index].textContent.trim();
      const valueB = rowB.cells[index].textContent.trim();

      let comparison;

      if (index === 3 || index === 4) {
        const numberA = Number(valueA.replace(/[^\d.-]/g, ''));
        const numberB = Number(valueB.replace(/[^\d.-]/g, ''));

        comparison = numberA - numberB;
      } else {
        comparison = valueA.localeCompare(valueB);
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    tbody.append(...rows);
  });
});

// --------------------------------------------------
// ROW SELECTION
// --------------------------------------------------

tbody.addEventListener('click', (clickEvent) => {
  if (clickEvent.target.closest('.cell-input')) {
    return;
  }

  const row = clickEvent.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr.active').forEach((activeRow) => {
    activeRow.classList.remove('active');
  });

  row.classList.add('active');
});

// --------------------------------------------------
// CREATE FORM
// --------------------------------------------------

const form = document.createElement('form');

form.className = 'new-employee-form';
form.noValidate = true;

const fields = [
  {
    name: 'name',
    label: 'Name:',
    type: 'text',
  },
  {
    name: 'position',
    label: 'Position:',
    type: 'text',
  },
  {
    name: 'office',
    label: 'Office:',
    type: 'select',
  },
  {
    name: 'age',
    label: 'Age:',
    type: 'number',
  },
  {
    name: 'salary',
    label: 'Salary:',
    type: 'number',
  },
];

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.append(`${field.label} `);

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    offices.forEach((office) => {
      const option = document.createElement('option');

      option.value = office;
      option.textContent = office;

      input.append(option);
    });
  } else {
    input = document.createElement('input');

    input.type = field.type;
  }

  input.name = field.name;
  input.dataset.qa = field.name;
  input.required = true;

  if (field.name === 'age') {
    input.min = '18';
    input.max = '90';
    input.step = '1';
  }

  if (field.name === 'salary') {
    input.min = '0';
    input.step = 'any';
  }

  label.append(input);
  form.append(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';

form.append(submitButton);

table.after(form);

// --------------------------------------------------
// NOTIFICATION
// --------------------------------------------------

function showNotification(type, title, description) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.classList.add(type);

  const heading = document.createElement('h2');

  heading.textContent = title;

  const message = document.createElement('p');

  message.textContent = description;

  notification.append(heading, message);

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// --------------------------------------------------
// FORM VALIDATION + ADD EMPLOYEE
// --------------------------------------------------

form.addEventListener('submit', (submitEvent) => {
  submitEvent.preventDefault();

  const employeeName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const ageValue = form.elements.age.value;
  const salaryValue = form.elements.salary.value;

  const age = Number(ageValue);
  const salary = Number(salaryValue);

  // All fields are required
  if (!employeeName || !position || !office || !ageValue || !salaryValue) {
    showNotification('error', 'Invalid data', 'Please fill in all fields.');

    return;
  }

  // Name must contain at least 4 letters
  const letterCount = (employeeName.match(/\p{L}/gu) || []).length;

  if (letterCount < 4) {
    showNotification(
      'error',
      'Invalid name',
      'Name must contain at least 4 letters.',
    );

    return;
  }

  // Age must be between 18 and 90
  if (!Number.isInteger(age) || age < 18 || age > 90) {
    showNotification('error', 'Invalid age', 'Age must be between 18 and 90.');

    return;
  }

  // Salary must be a valid number
  if (!Number.isFinite(salary) || salary < 0) {
    showNotification('error', 'Invalid salary', 'Please enter a valid salary.');

    return;
  }

  // Create new row
  const row = document.createElement('tr');

  const formattedSalary = `$${salary.toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`;

  const employeeData = [employeeName, position, office, age, formattedSalary];

  employeeData.forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;

    row.append(cell);
  });

  tbody.append(row);

  form.reset();

  showNotification(
    'success',
    'Success',
    'Employee has been added to the table.',
  );
});

// --------------------------------------------------
// EDIT CELL
// --------------------------------------------------

let editingCell = null;

tbody.addEventListener('dblclick', (doubleClickEvent) => {
  const cell = doubleClickEvent.target.closest('td');

  if (!cell || cell.querySelector('.cell-input')) {
    return;
  }

  if (editingCell) {
    editingCell.blur();
  }

  const initialValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = initialValue;

  cell.textContent = '';
  cell.append(input);

  editingCell = input;

  input.focus();
  input.select();

  function saveCell() {
    if (editingCell !== input) {
      return;
    }

    const newValue = input.value.trim();

    cell.textContent = newValue || initialValue;

    editingCell = null;
  }

  input.addEventListener('blur', saveCell);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }

    if (keyEvent.key === 'Escape') {
      input.value = initialValue;
      input.blur();
    }
  });
});
