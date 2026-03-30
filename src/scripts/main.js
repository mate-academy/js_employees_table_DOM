'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const th = document.querySelectorAll('thead th');

// ================= SORT =================
let currentColumn = null;
let currentDirection = 'asc';

th.forEach((thItem, thIndex) => {
  thItem.addEventListener('click', () => {
    // якщо нова колонка → завжди ASC
    if (currentColumn !== thIndex) {
      currentDirection = 'asc';
      currentColumn = thIndex;
    } else {
      // якщо та сама → toggle
      currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      const cellA = a.cells[thIndex].textContent.trim();
      const cellB = b.cells[thIndex].textContent.trim();

      const numA = Number(cellA.replace(/[$,]/g, ''));
      const numB = Number(cellB.replace(/[$,]/g, ''));

      const bothNumbers = !isNaN(numA) && !isNaN(numB);

      if (bothNumbers) {
        return currentDirection === 'asc' ? numA - numB : numB - numA;
      }

      return currentDirection === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});

// ================= ROW SELECT =================
tbody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');
  const selectedRow = tbody.querySelector('.active');

  if (!clickedRow) {
    return;
  }

  if (selectedRow) {
    selectedRow.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

// ================= NOTIFICATION =================
function showNotification(message, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.textContent = message;
  notification.classList.add(type);
  notification.setAttribute('data-qa', 'notification');

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ================= FORM =================
const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = [
  {
    label: 'Name:',
    type: 'text',
    name: 'name',
    qa: 'name',
  },
  {
    label: 'Position:',
    type: 'text',
    name: 'position',
    qa: 'position',
  },
  {
    label: 'Office:',
    type: 'select',
    name: 'office',
    qa: 'office',
  },
  {
    label: 'Age:',
    type: 'number',
    name: 'age',
    qa: 'age',
  },
  {
    label: 'Salary:',
    type: 'number',
    name: 'salary',
    qa: 'salary',
  },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.label + ' ';

  if (field.type === 'select') {
    const select = document.createElement('select');

    select.name = field.name;
    select.dataset.qa = field.qa;

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

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.type = field.type;
    input.name = field.name;
    input.dataset.qa = field.qa;

    label.appendChild(input);
  }

  form.appendChild(label);
});

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.appendChild(button);

document.body.append(form);

// ================= ADD TO TABLE =================
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const inputs = form.querySelectorAll('input, select');
  const formData = {};

  inputs.forEach((input) => {
    formData[input.name] = input.value.trim();
  });

  // ===== VALIDATION =====
  if (formData.name.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (!formData.position) {
    showNotification('Position is required', 'error');

    return;
  }

  if (formData.age < 18) {
    showNotification('Age must be at least 18', 'error');

    return;
  }

  if (formData.age > 90) {
    showNotification('Age must be less than 90', 'error');

    return;
  }

  if (!formData.salary) {
    showNotification('Salary is required', 'error');

    return;
  }

  // ===== ADD ROW =====
  const tr = document.createElement('tr');

  const values = [
    formData.name,
    formData.position,
    formData.office,
    formData.age,
    `$${Number(formData.salary).toLocaleString('en-US')}`,
  ];

  values.forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    tr.appendChild(td);
  });

  tbody.appendChild(tr);

  showNotification('Employee added successfully', 'success');

  form.reset();
});
