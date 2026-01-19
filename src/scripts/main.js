'use strict';

const tbody = document.querySelector('tbody');
const headers = document.querySelectorAll('th');

let currentColumn = null;
let currentDirection = 'asc';

function clearActiveClasses() {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });
}

clearActiveClasses();


headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    sortTable(index);
  });
});

function sortTable(cellIndex) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  if (currentColumn === cellIndex) {
    currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
  } else {
    currentColumn = cellIndex;
    currentDirection = 'asc';
  }

  rows.sort((a, b) => {
    const aText = a.children[cellIndex].textContent.trim().replace(/[$,]/g, '');
    const bText = b.children[cellIndex].textContent.trim().replace(/[$,]/g, '');

    const aNum = Number(aText);
    const bNum = Number(bText);

    let comparison;

    if (isNaN(aNum) || isNaN(bNum)) {
      comparison = aText.localeCompare(bText);
    } else {
      comparison = aNum - bNum;
    }

    if (currentDirection === 'asc') {
      return comparison;
    } else {
      return -comparison;
    }
  });
  rows.forEach((row) => tbody.appendChild(row));
}

function makeForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const labelName = document.createElement('label');

  labelName.textContent = 'Name:';

  const inputName = document.createElement('input');

  inputName.dataset.qa = 'name';
  inputName.type = 'text';
  inputName.name = 'name';
  labelName.appendChild(inputName);
  form.appendChild(labelName);

  const labelPosition = document.createElement('label');

  labelPosition.textContent = 'Position:';

  const inputPosition = document.createElement('input');

  inputPosition.dataset.qa = 'position';
  inputPosition.type = 'text';
  inputPosition.name = 'position';
  labelPosition.appendChild(inputPosition);
  form.appendChild(labelPosition);

  const labelOffice = document.createElement('label');

  labelOffice.textContent = 'Office:';

  const inputOffice = document.createElement('input');

  inputOffice.dataset.qa = 'office';
  inputOffice.type = 'text';
  inputOffice.name = 'office';

  const officeSelect = document.createElement('select');

  officeSelect.name = 'office';
  officeSelect.dataset.qa = 'office';

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  offices.forEach((city) => {
    const option = document.createElement('option');

    option.value = city;
    option.textContent = city;
    officeSelect.appendChild(option);
  });
  labelOffice.appendChild(officeSelect);
  form.appendChild(labelOffice);

  const labelAge = document.createElement('label');

  labelAge.textContent = 'Age:';

  const inputAge = document.createElement('input');

  inputAge.dataset.qa = 'age';
  inputAge.type = 'number';
  inputAge.name = 'age';
  labelAge.appendChild(inputAge);
  form.appendChild(labelAge);

  const labelSalary = document.createElement('label');

  labelSalary.textContent = 'Salary:';

  const inputSalary = document.createElement('input');

  inputSalary.dataset.qa = 'salary';
  inputSalary.type = 'number';
  inputSalary.name = 'salary';
  labelSalary.appendChild(inputSalary);
  form.appendChild(labelSalary);

  const submit = document.createElement('button');

  submit.type = 'submit';
  submit.textContent = 'Save to table';
  form.appendChild(submit);

  document.body.appendChild(form);

  function showNotification(message, type) {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.dataset.qa = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = inputName.value.trim();
    const position = inputPosition.value.trim();
    const office = officeSelect.value;
    const age = parseInt(inputAge.value.trim());
    const salary = parseFloat(inputSalary.value.trim());

    if (!nameInput || !position || !office || isNaN(age) || isNaN(salary)) {
      return showNotification('All fields are required.', 'error');
    }

    if (nameInput.length < 4) {
      return showNotification(
        'Name must be at least 4 characters long.',
        'error',
      );
    }

    if (age < 18 || age > 90) {
      return showNotification('Age must be between 18 and 90.', 'error');
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${nameInput}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>`;
    tbody.appendChild(newRow);

    form.reset();

    return showNotification('New employee added successfully!', 'success');
  });
}
makeForm();

tbody.addEventListener('click', (e) => {
  const cell = e.target;

  if (cell.tagName.toLowerCase() !== 'td') {
    return;
  }

  const initialValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.dataset.initialValue = initialValue;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();
  input.addEventListener('blur', () => saveChanges(cell, input));

  input.addEventListener('keydown', (b) => {
    if (b.key === 'Enter') {
      saveChanges(cell, input);
    }
  });
});

function saveChanges(cell, input, initialValue) {
  const newValue = input.value.trim();

  cell.textContent = newValue === '' ? initialValue : newValue;
  input.remove();
}
