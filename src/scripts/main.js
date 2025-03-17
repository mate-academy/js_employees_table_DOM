'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');
  const tableBody = document.querySelector('table tbody');

  form.classList.add('new-employee-form');
  document.body.appendChild(form);

  const fields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      dataqa: 'name',
    },
    {
      name: 'position',
      label: 'Position',
      type: 'text',
      dataQa: 'position',
    },
    {
      name: 'office',
      label: 'Office',
      type: 'select',
      dataQa: 'office',
      options: [
        'Tokyo',
        'Singapore',
        'London',
        'New York',
        'Edinburgh',
        'San Francisco',
      ],
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      dataQa: 'age',
    },
    {
      name: 'salary',
      label: 'Salary',
      type: 'number',
      dataQa: 'salary',
    },
  ];

  fields.forEach((field) => {
    const label = document.createElement('label');

    label.textContent = `${field.label}: `;

    const input = document.createElement(
      field.type === 'select' ? 'select' : 'input',
    );

    input.setAttribute('name', field.name);
    input.setAttribute('data-qa', field.dataqa);

    if (field.type === 'select') {
      field.options.forEach((optionText) => {
        const option = document.createElement('option');

        option.textContent = optionText;
        input.appendChild(option);
      });
    }

    label.appendChild(input);
    form.appendChild(label);
  });

  const submitButton = document.createElement('button');

  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  const showNotification = (message, type) => {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.textContent = message;
    notification.setAttribute('data-qa', 'notification');
    form.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 2000);
  };

  const addEmployee = (employee) => {
    const newRow = document.createElement('tr');
    const nameCell = document.createElement('td');

    nameCell.textContent = employee.name;
    newRow.appendChild(nameCell);

    const positionCell = document.createElement('td');

    positionCell.textContent = employee.position;
    newRow.appendChild(positionCell);

    const officeCell = document.createElement('td');

    officeCell.textContent = employee.office;
    newRow.appendChild(officeCell);

    const ageCell = document.createElement('td');

    ageCell.textContent = employee.age;
    newRow.appendChild(ageCell);

    const salaryCell = document.createElement('td');

    salaryCell.textContent = `$${parseInt(employee.salary).toLocaleString()}`;
    newRow.appendChild(salaryCell);

    tableBody.appendChild(newRow);
    showNotification('New employee added successfully!', 'success');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputName = form.querySelector('input[name="name"]');
    const position = form.querySelector('input[name="position"]');
    const office = form.querySelector('select[name="office"]');
    const age = form.querySelector('input[name="age"]');
    const salary = form.querySelector('input[name="salary"]');

    if (inputName.value.length < 4) {
      showNotification('Name must be at least 4 characters long.', 'error');

      return;
    }

    if (age.value < 18 || age.value > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    if (isNaN(salary.value) || salary.value <= 0) {
      showNotification('Salary must be a positive number.', 'error');

      return;
    }

    const newEmployee = {
      name: inputName.value,
      position: position.value,
      office: office.value,
      age: age.value,
      salary: salary.value,
    };

    addEmployee(newEmployee);
    form.reset();
  });

  const sortDirection = {
    name: 'asc',
    position: 'asc',
    office: 'asc',
    age: 'asc',
    salary: 'asc',
  };

  const sortTable = (column, direction) => {
    const table = document.querySelector('table tbody');
    const rows = Array.from(table.rows);
    const compare = (a, b) => {
      const aText = a.cells[column].textContent.trim();
      const bText = b.cells[column].textContent.trim();

      if (column === 3 || column === 4) {
        return direction === 'asc'
          ? parseFloat(aText) - parseFloat(bText)
          : parseFloat(bText) - parseFloat(aText);
      }

      return direction === 'asc'
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    };

    rows.sort(compare);
    rows.forEach((row) => table.appendChild(row));
  };

  const headers = document.querySelectorAll('th');

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const column = index;
      const columnName = header.textContent.toLowerCase().trim();

      sortDirection[columnName] =
        sortDirection[columnName] === 'asc' ? 'desc' : 'asc';
      sortTable(column, sortDirection[columnName]);
    });
  });

  tableBody.addEventListener('click', (e) => {
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => row.classList.remove('active'));
    e.target.closest('tr').classList.add('active');
  });

  tableBody.addEventListener('dblclick', (evt) => {
    const target = evt.target;

    if (target.tagName !== 'TD') {
      return;
    }

    const originalValue = target.textContent;

    target.innerHTML = `<input type="text" value="${originalValue}" class="cell-input">`;

    const input = target.querySelector('input');

    input.focus();

    input.addEventListener('blur', () => {
      target.innerHTML = input.value.trim() || originalValue;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        target.innerHTML = input.value.trim() || originalValue;
      }
    });
  });
});
