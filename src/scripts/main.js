'use strict';

const tbody = document.querySelector('tbody');
const titles = document.querySelectorAll('thead th');

// СОРТУВАННЯ

titles.forEach((title, index) => {
  title.addEventListener('click', () => {
    const currentDirection = title.dataset.direction;
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    titles.forEach((t) => delete t.dataset.direction);
    title.dataset.direction = newDirection;

    const tbodyRows = Array.from(tbody.querySelectorAll('tr'));

    tbodyRows.sort((a, b) => {
      const textA = a.children[index].textContent.trim();
      const textB = b.children[index].textContent.trim();

      const valueA = parseFloat(textA.replace(/[$,]/g, ''));
      const valueB = parseFloat(textB.replace(/[$,]/g, ''));

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return valueA - valueB;
      }

      return textA.localeCompare(textB);
    });

    if (newDirection === 'desc') {
      tbodyRows.reverse();
    }
    tbodyRows.forEach((row) => tbody.appendChild(row));
  });
});

// ВИБІР РЯДКА
function setActiveRow(row) {
  const previousActiveRow = row.parentElement.querySelector('tr.active');

  if (previousActiveRow === row) {
    return;
  }

  if (previousActiveRow) {
    previousActiveRow.classList.remove('active');
  }
  row.classList.add('active');
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row || !tbody.contains(row)) {
    return;
  }
  setActiveRow(row);
});

// СТВОРЕННЯ ФОРМИ
function createForm() {
  const newForm = document.createElement('form');

  newForm.className = 'new-employee-form';

  newForm.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;
  document.body.appendChild(newForm);

  return newForm;
}

const employeeForm = createForm();

// NOTIFICATIONS
function showNotification(type, title, message) {
  document.querySelector('[data-qa="notification"]')?.remove();

  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${message}</p>
  `;

  document.body.appendChild(notification);
}

// ВАЛІДАЦІЯ
function validateEmployee(employeeName, employeePosition, employeeAge) {
  if (employeeName.length < 4) {
    showNotification('error', 'Error!', 'Name must have at least 4 letters');

    return false;
  }

  if (employeePosition.length < 4) {
    showNotification(
      'error',
      'Error!',
      'Position must have at least 4 letters',
    );

    return false;
  }

  const ageNum = Number(employeeAge);

  if (ageNum < 18 || ageNum > 90) {
    showNotification('error', 'Error!', 'Age must be between 18 and 90');

    return false;
  }

  return true;
}

// ДОДАВАННЯ СПІВРОБІТНИКА

function addEmployeeToTable(
  employeeName,
  position,
  office,
  employeeAge,
  salary,
) {
  const formattedSalary = '$' + Number(salary).toLocaleString('en-US');

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${employeeAge}</td>
    <td>${formattedSalary}</td>
  `;
  tbody.appendChild(newRow);
  showNotification('success', 'Success!', 'Employee added successfully');
}

// ОБРОБКА ФОРМИ
employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = employeeForm.querySelector('[name="name"]').value.trim();
  const position = employeeForm.querySelector('[name="position"]').value.trim();
  const office = employeeForm.querySelector('[name="office"]').value.trim();
  const employeeAge = employeeForm.querySelector('[name="age"]').value.trim();
  const salary = employeeForm.querySelector('[name="salary"]').value.trim();

  if (!validateEmployee(employeeName, position, employeeAge)) {
    return;
  }

  addEmployeeToTable(employeeName, position, office, employeeAge, salary);
  employeeForm.reset();
});

// РЕДАГУВАННЯ КОМІРОК
function editCell(cell) {
  if (!cell || tbody.querySelector('.cell-input')) {
    return;
  }

  const originalText = cell.textContent.trim();
  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalText;

  cell.textContent = '';
  cell.appendChild(input);
  input.focus();

  const save = () => {
    cell.textContent = input.value.trim() || originalText;
  };

  const cancel = () => {
    cell.textContent = originalText;
  };

  input.addEventListener('blur', save);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }

    if (e.key === 'Escape') {
      input.removeEventListener('blur', save);
      cancel();
    }
  });
}

tbody.addEventListener('dblclick', (e) => {
  editCell(e.target.closest('td'));
});
