'use strict';

// ====== TABLE SORTING ======
const headers = document.querySelectorAll('thead th');
const tbody = document.querySelector('tbody');

let lastSortedIndex = -1; // останній відсортований стовпець
let asc = true; // напрямок сортування

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // якщо клікнули по новому стовпцю, завжди ASC
    if (lastSortedIndex !== index) {
      asc = true;
    }

    rows.sort((a, b) => {
      const cellA = a.querySelectorAll('td')[index].textContent.trim();
      const cellB = b.querySelectorAll('td')[index].textContent.trim();

      const numA = parseFloat(cellA.replace(/[^0-9.]/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return asc ? numA - numB : numB - numA;
      }

      return asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));

    asc = !asc;
    lastSortedIndex = index;
  });
});

// ====== ROW SELECTION ======
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const active = tbody.querySelector('.active');

  if (active) {
    active.classList.remove('active');
  }

  row.classList.add('active');
});

// ====== FORM CREATION ======
const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.appendChild(form);

const fields = [
  { name: 'name', type: 'text' },
  { name: 'position', type: 'text' },
  {
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
  { name: 'age', type: 'number' },
  { name: 'salary', type: 'number' },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = field.name[0].toUpperCase() + field.name.slice(1) + ': ';

  let input;

  if (field.type === 'select') {
    input = document.createElement('select');

    field.options.forEach((opt) => {
      const option = document.createElement('option');

      option.value = opt;
      option.textContent = opt;
      input.appendChild(option);
    });
  } else {
    input = document.createElement('input');
    input.type = field.type;
  }

  input.setAttribute('name', field.name);
  input.setAttribute('data-qa', field.name);
  input.required = true;

  label.appendChild(input);
  form.appendChild(label);
});

// Button
const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

// ====== NOTIFICATION ======
function showNotification(title, message, type) {
  const notif = document.createElement('div');

  notif.className = type; // "error" або "success"
  notif.setAttribute('data-qa', 'notification');
  notif.innerHTML = `<strong>${title}</strong><br><span>${message}</span>`;
  document.body.appendChild(notif);

  setTimeout(() => notif.remove(), 3000);
}

// ====== FORM SUBMISSION ======
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newName = form.elements['name'].value.trim();
  const newPosition = form.elements['position'].value.trim();
  const newOffice = form.elements['office'].value;
  const newAge = Number(form.elements['age'].value);
  const newSalary = Number(form.elements['salary'].value);

  // VALIDATION
  if (newName.length < 4) {
    showNotification(
      'Validation Error',
      'Name must have at least 4 letters.',
      'error',
    );

    return;
  }

  if (!newPosition) {
    showNotification(
      'Validation Error',
      'Position field cannot be empty.',
      'error',
    );

    return;
  }

  if (newAge < 18 || newAge > 90) {
    showNotification(
      'Validation Error',
      'Age must be between 18 and 90.',
      'error',
    );

    return;
  }

  // ADD ROW
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${newName}</td>
    <td>${newPosition}</td>
    <td>${newOffice}</td>
    <td>${newAge}</td>
    <td>$${newSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
  `;
  tbody.appendChild(newRow);

  showNotification(
    'Success',
    `${newName} was successfully added to the table.`,
    'success',
  );

  form.reset();
});
