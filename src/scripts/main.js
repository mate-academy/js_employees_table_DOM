'use strict';

document.querySelectorAll('th').forEach((header) => {
  let ascending = true;

  header.addEventListener('click', () => {
    const table = header.closest('table');
    const columnIndex = Array.from(header.parentNode.children).indexOf(header);
    const rows = Array.from(table.querySelectorAll('tr')).slice(1);

    rows.sort((a, b) => {
      const cellA = a.children[columnIndex].textContent;
      const cellB = b.children[columnIndex].textContent;

      return ascending
        ? cellA.localeCompare(cellB, undefined, { numeric: true })
        : cellB.localeCompare(cellA, undefined, { numeric: true });
    });

    rows.forEach((row) => table.appendChild(row));

    ascending = !ascending;
  });
});

document.querySelectorAll('table tr').forEach((row) => {
  row.addEventListener('click', () => {
    document
      .querySelectorAll('table tr')
      .forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

function createEmployeeForm() {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="">Select office</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeData = {
      name: form.name.value.trim(),
      position: form.position.value.trim(),
      office: form.office.value,
      age: parseInt(form.age.value, 10),
      salary: parseFloat(form.salary.value),
    };

    if (!validateEmployeeData(employeeData)) {
      return;
    }
    addEmployeeToTable(employeeData);
    showNotification('Employee added successfully!', 'success');
    form.reset();
  });

  document.body.appendChild(form);
}

function validateEmployeeData(employee) {
  if (employee.name.length < 4) {
    showNotification('Name must contain at least 4 characters.', 'error');

    return false;
  }

  if (employee.age < 18 || employee.age > 90) {
    showNotification('Age must be between 18 and 90.', 'error');

    return false;
  }

  if (isNaN(employee.salary) || employee.salary <= 0) {
    showNotification('Salary must be a valid positive number.', 'error');

    return false;
  }

  return true;
}

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.className = type;
  notification.setAttribute('data-qa', 'notification');

  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}

function addEmployeeToTable(employee) {
  const targetTable = document.querySelector('table');

  if (!targetTable) {
    // eslint-disable-next-line no-console
    console.error('Table not found.');

    return;
  }

  const row = targetTable.insertRow();

  row.insertCell().textContent = employee.name;
  row.insertCell().textContent = employee.position;
  row.insertCell().textContent = employee.office;
  row.insertCell().textContent = employee.age;
  row.insertCell().textContent = `$${employee.salary.toFixed(2)}`;
}

createEmployeeForm();

const tableTarget = document.querySelector('table');

tableTarget.addEventListener('dblclick', (evt) => {
  if (evt.target.tagName === 'TD') {
    const cell = evt.target;

    if (tableTarget.querySelector('.cell-input')) {
      return;
    }

    const originalText = cell.textContent;
    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = originalText;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveValue(input, cell, originalText);
      }
    });

    input.addEventListener('blur', () => {
      saveValue(input, cell, originalText);
    });
  }
});

function saveValue(input, cell, originalText) {
  const newValue = input.value.trim() || originalText;

  cell.textContent = newValue;
}
