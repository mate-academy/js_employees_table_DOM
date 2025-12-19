'use strict';

// ------------------- table sorting ------------------

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');

const sortDirections = {};
let lastSortedIndex = null;

headers.forEach((th, index) => {
  sortDirections[index] = true;

  th.addEventListener('click', () => {
    if (lastSortedIndex !== index) {
      sortDirections[index] = true;
    }

    const isAsc = sortDirections[index];
    const rows = [...tbody.querySelectorAll('tr')];

    rows.sort((a, b) => {
      const aText = a.children[index].innerText.trim();
      const bText = b.children[index].innerText.trim();

      const aNum = Number(aText.replace(/[$,]/g, ''));
      const bNum = Number(bText.replace(/[$,]/g, ''));

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return isAsc ? aNum - bNum : bNum - aNum;
      }

      return isAsc
        ? aText.localeCompare(bText, 'en', { sensitivity: 'base' })
        : bText.localeCompare(aText, 'en', { sensitivity: 'base' });
    });

    rows.forEach((row) => tbody.appendChild(row));

    sortDirections[index] = !isAsc;
    lastSortedIndex = index;
  });
});

// ------------------- selected row ------------------

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr.active').forEach((tr) => {
    tr.classList.remove('active');
  });

  row.classList.add('active');
});

// ------------------- create form ------------------

const form = document.createElement('form');

form.className = 'new-employee-form';

function createInput(labelText, nameInput, type = 'text') {
  const label = document.createElement('label');

  label.textContent = `${labelText}: `;

  const input = document.createElement('input');

  input.name = nameInput;
  input.type = type;
  input.dataset.qa = nameInput;

  label.append(input);

  return label;
}

function createOfficeSelect() {
  const label = document.createElement('label');

  label.textContent = 'Office: ';

  const select = document.createElement('select');

  select.name = 'office';
  select.dataset.qa = 'office';

  [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ].forEach((office) => {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;
    select.append(option);
  });

  label.append(select);

  return label;
}

form.append(
  createInput('Name', 'name'),
  createInput('Position', 'position'),
  createOfficeSelect(),
  createInput('Age', 'age', 'number'),
  createInput('Salary', 'salary', 'number'),
);

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.append(submitBtn);
table.before(form);

// ------------------- validation ------------------

function validateEmployee({ name: employeeName, position, age, salary }) {
  if (!employeeName || employeeName.trim().length < 4) {
    return {
      valid: false,
      title: 'Invalid name',
      message: 'Name must contain at least 4 letters',
    };
  }

  if (!position || position.trim() === '') {
    return {
      valid: false,
      title: 'Invalid position',
      message: 'Position cannot be empty',
    };
  }

  if (age === undefined || isNaN(age) || age < 18 || age > 90) {
    return {
      valid: false,
      title: 'Invalid age',
      message: 'Age must be between 18 and 90',
    };
  }

  if (
    salary === undefined ||
    salary === '' ||
    isNaN(salary) ||
    Number(salary) <= 0
  ) {
    return {
      valid: false,
      title: 'Invalid salary',
      message: 'Salary must be a positive number',
    };
  }

  return { valid: true };
}

// ------------------- notification ------------------

function showNotification(type, title, message) {
  const old = document.querySelector('[data-qa="notification"]');

  if (old) {
    old.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = type;
  notification.innerHTML = `<strong>${title}</strong><p>${message}</p>`;

  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
}

// ------------------- form submit ------------------

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);

  const employee = {
    name: data.get('name'),
    position: data.get('position'),
    office: data.get('office'),
    age: Number(data.get('age')),
    salary: Number(data.get('salary')),
  };

  const validation = validateEmployee(employee);

  if (!validation.valid) {
    showNotification('error', validation.title, validation.message);

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>$${employee.salary.toLocaleString('en-US')}</td>
  `;

  tbody.append(tr);
  form.reset();

  showNotification(
    'success',
    'Employee added',
    'New employee was successfully added to the table',
  );
});
