'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');

  let sortColumn = -1;
  let sortDirection = 1;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (sortColumn !== index) {
        sortColumn = index;
        sortDirection = 1;
      } else {
        sortDirection *= -1;
      }

      rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[index].textContent.trim();
        const cellB = rowB.cells[index].textContent.trim();

        if (!isNaN(cellA) && !isNaN(cellB)) {
          return (Number(cellA) - Number(cellB)) * sortDirection;
        }

        return cellA.localeCompare(cellB) * sortDirection;
      });

      tbody.append(...rows);
    });
  });

  tbody.addEventListener('click', (e) => {
    const selectedRow = e.target.closest('tr');

    if (!selectedRow) {
      return;
    }

    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));
    selectedRow.classList.add('active');
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  const nameLabel = document.createElement('label');

  nameLabel.textContent = 'Name';

  const nameInput = document.createElement('input');

  nameInput.setAttribute('name', 'name');
  nameInput.setAttribute('type', 'text');
  nameInput.setAttribute('data-qa', 'name');
  nameInput.setAttribute('required', '');

  nameLabel.appendChild(nameInput);

  const positionLabel = document.createElement('label');

  positionLabel.textContent = 'Position:';

  const positionInput = document.createElement('input');

  positionInput.setAttribute('name', 'position');
  positionInput.setAttribute('type', 'text');
  positionInput.setAttribute('data-qa', 'position');
  positionInput.setAttribute('required', '');

  positionLabel.appendChild(positionInput);

  const officeLabel = document.createElement('label');

  officeLabel.textContent = 'Office:';

  const officeSelect = document.createElement('select');

  officeSelect.setAttribute('name', 'office');
  officeSelect.setAttribute('data-qa', 'office');
  officeSelect.setAttribute('required', '');

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  offices.forEach((office) => {
    const option = document.createElement('option');

    option.value = office;
    option.textContent = office;
    officeSelect.appendChild(option);
  });

  officeLabel.appendChild(officeSelect);

  const ageLabel = document.createElement('label');

  ageLabel.textContent = 'Age:';

  const ageInput = document.createElement('input');

  ageInput.setAttribute('name', 'age');
  ageInput.setAttribute('type', 'number');
  ageInput.setAttribute('data-qa', 'age');
  ageInput.setAttribute('required', '');

  ageLabel.appendChild(ageInput);

  const salaryLabel = document.createElement('label');

  salaryLabel.textContent = 'Salary:';

  const salaryInput = document.createElement('input');

  salaryInput.setAttribute('name', 'salary');
  salaryInput.setAttribute('type', 'number');
  salaryInput.setAttribute('data-qa', 'salary');
  salaryInput.setAttribute('required', '');

  salaryLabel.appendChild(salaryInput);

  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';
  submitButton.setAttribute('type', 'submit');

  form.appendChild(nameLabel);
  form.appendChild(positionLabel);
  form.appendChild(officeLabel);
  form.appendChild(ageLabel);
  form.appendChild(salaryLabel);
  form.appendChild(submitButton);

  document.body.appendChild(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = nameInput.value;
    const position = positionInput.value;
    const office = officeSelect.value;
    const age = ageInput.value;
    const salary = salaryInput.value;

    addEmployeeToTable(fullName, position, office, age, salary);
  });

  const addEmployeeToTable = (fullName, position, office, age, salary) => {
    const row = document.createElement('tr');

    const nameCell = document.createElement('td');

    nameCell.textContent = fullName;

    const positionCell = document.createElement('td');

    positionCell.textContent = position;

    const officeCell = document.createElement('td');

    officeCell.textContent = office;

    const ageCell = document.createElement('td');

    ageCell.textContent = age;

    const salaryCell = document.createElement('td');

    salaryCell.textContent = salary;

    row.appendChild(nameCell);
    row.appendChild(positionCell);
    row.appendChild(officeCell);
    row.appendChild(ageCell);
    row.appendChild(salaryCell);

    table.appendChild(row);
  };

  const validateForm = () => {
    const fullName = form.querySelector('input[name="name"]').value;
    const age = form.querySelector('input[name="age"]').value;

    if (fullName.length < 4) {
      pushNotification(
        10,
        10,
        'Error: Invalid Name',
        'Name must be at least 4 characters long.',
        'error',
      );

      return false;
    }

    if (age < 18 || age > 90) {
      pushNotification(
        10,
        10,
        'Error: Invalid Age',
        'Age must be between 18 and 90.',
        'error',
      );

      return false;
    }

    return true;
  };

  const pushNotification = (x, y, title, message, type) => {
    const notification = document.createElement('div');

    notification.setAttribute('data-qa', 'notification');
    notification.classList.add(type);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
      const fullName = form.querySelector('input[name="name"]').value;
      const position = form.querySelector('input[name="position"]').value;
      const office = form.querySelector('select[name="office"]').value;
      const age = form.querySelector('input[name="age"]').value;
      const salary = form.querySelector('input[name="salary"]').value;

      addEmployeeToTable(fullName, position, office, age, salary);

      pushNotification(
        10,
        10,
        'Success',
        'New employee has been successfully added to the table.',
        'success',
      );
    }
  });
});
