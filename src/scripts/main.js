'use strict';

const tableHeaders = document.querySelectorAll('thead th');
const tableBody = document.querySelector('tbody');
const form = createForm();

function toNumber(value) {
  if (!value) {
    return NaN;
  }

  return +value.replace(/[$,]/g, '');
}

tableHeaders.forEach((th, headerIndex) => {
  let direction = 'asc';

  th.addEventListener('click', (e) => {
    const rows = [...tableBody.querySelectorAll('tr')];

    rows.sort((firstRow, secondRow) => {
      const valueFirst = firstRow.children[headerIndex].textContent.trim();
      const valueSecond = secondRow.children[headerIndex].textContent.trim();

      const firstNum = toNumber(valueFirst);
      const secondNum = toNumber(valueSecond);

      if (!isNaN(firstNum) && !isNaN(secondNum)) {
        if (direction === 'asc') {
          return firstNum - secondNum;
        } else {
          return secondNum - firstNum;
        }
      }

      if (direction === 'asc') {
        return valueFirst.localeCompare(valueSecond);
      } else {
        return valueSecond.localeCompare(valueFirst);
      }
    });

    if (direction === 'asc') {
      direction = 'desc';
    } else {
      direction = 'asc';
    }

    tableBody.innerHTML = '';
    rows.forEach((row) => tableBody.appendChild(row));
  });
});

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tableBody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  row.classList.add('active');
});

function createForm() {
  const formElement = document.createElement('form');

  formElement.className = 'new-employee-form';

  formElement.innerHTML = `
  <label for="name">
    Name: <input data-qa="name" type="text" id="name" name="name" required>
  </label>

  <label for="position">
    Position: <input data-qa="position" type="text" id="position" name="position" required>
  </label>

  <label for="office">
    Office: <select data-qa="office" id="office" name="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <label for="age">
    Age: <input  data-qa="age" type="number" id="age" name="age" required>
  </label>

  <label for="salary">
    Salary: <input data-qa="salary" type="number" id="salary" name="salary" required>
  </label>

  <button type="submit">Save to table</button>
`;

  document.body.appendChild(formElement);

  return formElement;
}

function showNotification(title, description, type) {
  const oldNotification = form.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const titleElement = document.createElement('h2');

  titleElement.classList.add('title');
  titleElement.textContent = title;

  const paragraph = document.createElement('p');

  paragraph.textContent = description;

  notification.append(titleElement, paragraph);

  form.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function validateForm() {
  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');
  const officeSelect = form.querySelector('select[name="office"]');

  const minNameLength = 4;
  const minAge = 18;
  const maxAge = 90;

  const namePerson = nameInput.value.trim();
  const position = positionInput.value.trim();
  const age = +ageInput.value;
  const salary = +salaryInput.value;
  const office = officeSelect.value;

  if (namePerson.length < minNameLength) {
    showNotification(
      'Error',
      `Name must be at least ${minNameLength} characters long.`,
      'error',
    );

    return false;
  }

  if (!position) {
    showNotification('Error', 'Position is required.', 'error');

    return false;
  }

  if (!office) {
    showNotification('Error', 'Office is required.', 'error');

    return false;
  }

  if (age < minAge || age > maxAge) {
    showNotification(
      'Error',
      `Age must be between ${minAge} and ${maxAge}.`,
      'error',
    );

    return false;
  }

  if (!salary || isNaN(Number(salary)) || Number(salary) <= 0) {
    showNotification('Error', 'Salary must be a positive number.', 'error');

    return false;
  }

  return true;
}

function addEmployeeToTable(employee) {
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>$${Number(employee.salary).toLocaleString('en-US')}</td>
  `;

  tableBody.appendChild(newRow);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  if (!validateForm()) {
    return;
  }

  const employee = {
    name: formData.get('name'),
    position: formData.get('position'),
    office: formData.get('office'),
    age: +formData.get('age'),
    salary: +formData.get('salary'),
  };

  addEmployeeToTable(employee);

  showNotification(
    'Title of Success message',
    'Employee added successfully!',
    'success',
  );

  form.reset();
});

let editingCell = null;

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell || editingCell) {
    return;
  }

  editingCell = cell;

  const row = cell.closest('tr');
  const columnIndex = [...row.children].indexOf(cell);

  const initialValue = cell.textContent.trim().replace(/[$,]/g, '');

  const input = document.createElement('input');

  if (columnIndex === 3 || columnIndex === 4) {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.value = initialValue;
  input.classList.add('cell-input');

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  function saveChange() {
    let inputValue = input.value.trim();

    if (!inputValue) {
      cell.textContent = initialValue;
    } else {
      if (columnIndex === 4) {
        inputValue = `$${Number(inputValue).toLocaleString('en-US')}`;
      }

      cell.textContent = inputValue;
    }

    editingCell = null;
  }

  input.addEventListener('blur', saveChange);

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});
