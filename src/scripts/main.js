'use strict';

const headers = document.querySelectorAll('tr th');
const tbody = document.querySelector('tbody');
const body = document.querySelector('body');

const sortOrder = {};

headers.forEach((header, index) => {
  header.addEventListener('click', function sortList() {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    sortOrder[index] = !sortOrder[index];

    const order = sortOrder[index] ? 1 : -1;

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      const numA = parseFloat(cellA.replace(/[$,]/g, ''));
      const numB = parseFloat(cellB.replace(/[$,]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return (numA - numB) * order;
      }

      return cellA.localeCompare(cellB) * order;
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });
});

document.querySelectorAll('tbody tr').forEach((row) => {
  row.addEventListener('click', () => {
    document.querySelectorAll('tbody tr').forEach((r) => {
      r.classList.remove('active');
    });
    row.classList.add('active');
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

function createInput(labelText, fullName, type, qa) {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.setAttribute('name', fullName);
  input.setAttribute('type', type);
  input.setAttribute('data-qa', qa);
  input.required = true;

  label.appendChild(input);

  return label;
}

form.appendChild(createInput('Name: ', 'name', 'text', 'name'));
form.appendChild(createInput('Position: ', 'position', 'text', 'position'));

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.setAttribute('name', 'office');
officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;

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

officeLabel.appendChild(officeSelect);
form.appendChild(officeLabel);

form.appendChild(createInput('Age: ', 'age', 'number', 'age'));
form.appendChild(createInput('Salary: ', 'salary', 'number', 'salary'));

const submitButton = document.createElement('button');

submitButton.setAttribute('type', 'submit');
submitButton.textContent = 'Save to table';

form.appendChild(submitButton);
body.appendChild(form);

function showNotification(type, title, message) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.innerHTML = `<span class="title">${title}</span><p>${message}</p>`;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const fullName = form.elements['name'].value.trim();
  const position = form.elements['position'].value.trim();
  const office = form.elements['office'].value;
  const age = parseInt(form.elements['age'].value, 10);
  const salary = parseFloat(form.elements['salary'].value);

  if (fullName.length < 4) {
    showNotification(
      'error',
      'Invalid Name',
      'Name must be at least 4 characters long.',
    );

    return;
  }

  if (isNaN(age) || age < 18 || age > 90) {
    showNotification('error', 'Invalid Age', 'Age must be between 18 and 90.');

    return;
  }

  if (isNaN(salary) || salary < 0) {
    showNotification(
      'error',
      'Invalid Salary',
      'Salary must be a positive number.',
    );

    return;
  }

  const formattedSalary = salary.toLocaleString('en-US', {
    minimumFractionDigits: 2,
  });

  if (tbody) {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${fullName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${formattedSalary}</td>
    `;

    tbody.appendChild(row);
    form.reset();

    showNotification(
      'success',
      'Employee Added',
      'New employee has been successfully added to the table.',
    );
  }
});

tbody.addEventListener('dblclick', function (ev) {
  const cell = ev.target;

  if (cell.tagName !== 'TD' || cell.querySelector('input')) {
    return;
  }

  // Закрити попереднє редагування (якщо є)
  const existingInput = document.querySelector('.cell-input');

  if (existingInput) {
    existingInput.blur();
  }

  const initialValue = cell.textContent.trim();
  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = initialValue;
  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  function saveChanges() {
    let newValue = input.value.trim();

    if (newValue === '') {
      newValue = initialValue;
    }

    if (cell.cellIndex === 4) {
      const salary = parseFloat(newValue.replace(/[$,]/g, ''));

      newValue = isNaN(salary)
        ? initialValue
        : `$${salary.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    }

    if (cell.cellIndex === 3) {
      const age = parseInt(newValue, 10);

      newValue = isNaN(age) || age < 18 || age > 90 ? initialValue : age;
    }

    cell.textContent = newValue;
    input.remove();
  }

  input.addEventListener('blur', saveChanges);

  input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      saveChanges();
    }
  });
});
