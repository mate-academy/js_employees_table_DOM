'use strict';

const table = document.querySelector('table');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');

let sortDirection = true;
let currentColumn = null;
let rows = Array.from(tbody.querySelectorAll('tr'));
const form = document.createElement('form');
const dataAttributes = ['name', 'position', 'office', 'age', 'salary'];
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

form.classList.add('new-employee-form');

const sortTableByColumn = (index) => {
  const isNumberColumn = ['Age', 'Salary'].includes(
    thead.rows[0].cells[index].textContent,
  );

  const sortedRows = rows.slice(0);

  sortedRows.sort((rowA, rowB) => {
    let cellA = rowA.cells[index].textContent;
    let cellB = rowB.cells[index].textContent;

    if (isNumberColumn) {
      cellA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      cellB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));
    }

    return (sortDirection ? 1 : -1) * (cellA > cellB ? 1 : -1);
  });

  tbody.innerHTML = '';
  sortedRows.forEach((row) => tbody.appendChild(row));
  rows = sortedRows;
};

thead.addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName !== 'TH') {
    return;
  }

  const columnIndex = Array.from(target.parentNode.children).indexOf(target);

  if (currentColumn === columnIndex) {
    sortDirection = !sortDirection;
  } else {
    sortDirection = true;
  }

  currentColumn = columnIndex;
  sortTableByColumn(columnIndex);
});

tbody.addEventListener('click', (e) => {
  const target = e.target;

  if (target.tagName !== 'TD') {
    return;
  }

  const clickedRow = target.parentNode;

  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));
  clickedRow.classList.add('active');
});

const handleAddInputs = () => {
  dataAttributes.forEach((attribute) => {
    const label = document.createElement('label');
    const input = document.createElement('input');

    switch (attribute) {
      case 'name':
      case 'position':
        input.type = 'text';
        input.name = attribute;
        input.dataset.qa = attribute;

        input.addEventListener('input', () => {
          input.value = capitalizeFirstLetter(input.value);
        });

        label.textContent = capitalizeFirstLetter(attribute);
        label.appendChild(input);
        form.appendChild(label);
        break;

      case 'office':
        const select = document.createElement('select');
        const cities = [
          'Tokyo',
          'Singapore',
          'London',
          'New York',
          'Edinburgh',
          'San Francisco',
        ];

        select.name = attribute;
        select.required = true;
        select.dataset.qa = attribute;

        cities.forEach((city) => {
          const option = document.createElement('option');

          option.value = city;
          option.textContent = city;
          select.appendChild(option);
        });

        label.textContent = capitalizeFirstLetter(attribute);
        label.appendChild(select);
        form.appendChild(label);
        break;

      case 'age':
      case 'salary':
        input.type = 'number';
        input.name = attribute;
        input.dataset.qa = attribute;

        label.textContent = capitalizeFirstLetter(attribute);
        label.appendChild(input);
        form.appendChild(label);
        break;
    }
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

const handleAddEmployee = (action) => {
  action.preventDefault();

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
  const newName = document.createElement('td');
  const newPosition = document.createElement('td');
  const newOffice = document.createElement('td');
  const newAge = document.createElement('td');
  const newSalary = document.createElement('td');

  newName.textContent = employeeName;
  newPosition.textContent = position;
  newOffice.textContent = office;
  newAge.textContent = age;
  newSalary.textContent = `$${salary.toLocaleString('en-US')}`;

  newRow.append(newName, newPosition, newOffice, newAge, newSalary);
  tbody.appendChild(newRow);

  rows.push(newRow);

  form.reset();
  showNotification('Employee added successfully!', true);
};

tbody.addEventListener('dblclick', (dblClickEvent) => {
  const target = dblClickEvent.target;

  if (target.tagName !== 'TD') {
    return;
  }

  const originalText = target.textContent;
  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = originalText;
  target.textContent = '';
  target.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    target.textContent = input.value || originalText;
    input.remove();
  });

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      target.textContent = input.value || originalText;
      input.remove();
    }
  });
});

handleAddInputs();
form.appendChild(button);
document.body.appendChild(form);

button.addEventListener('click', handleAddEmployee);
