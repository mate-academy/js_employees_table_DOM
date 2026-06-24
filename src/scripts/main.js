'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

const sortDirect = {};

let currentIndex = null;

thead.addEventListener('click', (e) => {
  if (e.target.tagName === 'TH') {
    const index = e.target.cellIndex;
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (index !== currentIndex) {
      sortDirect[index] = 'asc';
    } else {
      sortDirect[index] = sortDirect[index] === 'asc' ? 'desc' : 'asc';
    }

    currentIndex = index;

    const direction = sortDirect[index];

    rows.sort((rowA, rowB) => {
      const valueA = rowA.cells[index].textContent;
      const valueB = rowB.cells[index].textContent;

      if (index === 3) {
        return direction === 'asc'
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      if (index === 4) {
        return direction === 'asc'
          ? Number(valueA.replace(/\$|,/g, '')) -
              Number(valueB.replace(/\$|,/g, ''))
          : Number(valueB.replace(/\$|,/g, '')) -
              Number(valueA.replace(/\$|,/g, ''));
      }

      return direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    tbody.append(...rows);
  }
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (cell.querySelector('.cell-input')) {
    return;
  }

  const openInput = tbody.querySelector('.cell-input');

  if (openInput) {
    openInput.dispatchEvent(new Event('blur'));
  }

  const initialValue = cell.textContent;

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = initialValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  function saveValue() {
    const newValue = input.value.trim();

    cell.textContent = newValue === '' ? initialValue : newValue;
  }

  input.addEventListener('blur', saveValue);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const nameLabel = document.createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.dataset.qa = 'name';
nameLabel.append(nameInput);

const positionLabel = document.createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.dataset.qa = 'position';
positionLabel.append(positionInput);

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

[
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
].forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.append(option);
});

officeLabel.append(officeSelect);

const ageLabel = document.createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.dataset.qa = 'age';
ageLabel.append(ageInput);

const salaryLabel = document.createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.dataset.qa = 'salary';
salaryLabel.append(salaryInput);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.append(
  nameLabel,
  positionLabel,
  officeLabel,
  ageLabel,
  salaryLabel,
  button,
);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  document.querySelector('[data-qa="notification"]')?.remove();

  const names = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const office = form.elements.office.value;
  const age = Number(form.elements.age.value);
  const salary = Number(form.elements.salary.value);

  if (names.length < 4) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.classList.add('error');
    error.textContent = 'Invalid data';
    document.body.append(error);

    return;
  }

  if (position.length < 1) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.classList.add('error');
    error.textContent = 'Invalid data';
    document.body.append(error);

    return;
  }

  if (age < 18 || age > 90) {
    const error = document.createElement('div');

    error.dataset.qa = 'notification';
    error.classList.add('error');
    error.textContent = 'Invalid data';
    document.body.append(error);

    return;
  }

  const success = document.createElement('div');

  success.dataset.qa = 'notification';
  success.classList.add('success');
  success.textContent = 'Employee added successfully';
  document.body.append(success);

  const tr = document.createElement('tr');

  const formattedSalary = Number(salary).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  tr.innerHTML = `
    <td>${names}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(tr);

  form.reset();
});
