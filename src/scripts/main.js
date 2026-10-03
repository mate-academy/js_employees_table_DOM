'use strict';

const table = document.querySelector('table');

if (table) {
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  let currentColumn = -1;
  let isAsc = true;

  if (thead && tbody) {
    thead.addEventListener('click', (e) => {
      const th = e.target.closest('th');

      if (!th) {
        return;
      }

      const colIndex = th.cellIndex;

      if (currentColumn === colIndex) {
        isAsc = !isAsc;
      } else {
        currentColumn = colIndex;
        isAsc = true;
      }

      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((rowA, rowB) => {
        const valA = rowA.cells[colIndex].textContent.trim();
        const valB = rowB.cells[colIndex].textContent.trim();

        const numA = Number(valA.replace(/[$,]/g, ''));
        const numB = Number(valB.replace(/[$,]/g, ''));

        let diff = 0;

        if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
          diff = numA - numB;
        } else {
          diff = valA.localeCompare(valB);
        }

        return isAsc ? diff : -diff;
      });

      tbody.append(...rows);
    });

    tbody.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');

      if (!tr) {
        return;
      }

      const activeRow = tbody.querySelector('.active');

      if (activeRow && activeRow !== tr) {
        activeRow.classList.remove('active');
      }
      tr.classList.toggle('active');
    });
  }
}

let form = document.querySelector('form');

if (!form) {
  form = document.createElement('form');
  form.className = 'new-employee-form';

  form.innerHTML = `
    <input type="text" name="name" data-qa="name" placeholder="Name" required />
    <input type="text" name="position" data-qa="position" placeholder="Position" required />
    <select name="office" data-qa="office" required>
      <option value="" disabled selected>Select office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
    <input type="number" name="age" data-qa="age" placeholder="Age" required />
    <input type="number" name="salary" data-qa="salary" placeholder="Salary" required />
    <button type="submit" data-qa="submit">Save to table</button>
  `;
  table.before(form);
}

let notification = document.querySelector('[data-qa="notification"]');

if (!notification) {
  notification = document.createElement('div');
  notification.setAttribute('data-qa', 'notification');
  notification.style.display = 'none';
  form.before(notification);
}

const nameInput = form.querySelector('[data-qa="name"]');
const positionInput = form.querySelector('[data-qa="position"]');
const ageInput = form.querySelector('[data-qa="age"]');
const officeSelect = form.querySelector('[data-qa="office"]');
const salaryInput = form.querySelector('[data-qa="salary"]');

const showError = (message) => {
  notification.textContent = message;
  notification.className = 'error';
  notification.style.display = 'block';
};

const showSuccess = (message) => {
  notification.textContent = message;
  notification.className = 'success';
  notification.style.display = 'block';
};

const validate = () => {
  const nameVal = nameInput.value.trim();
  const positionVal = positionInput.value.trim();
  const officeVal = officeSelect.value;
  const ageVal = ageInput.value.trim();
  const salaryVal = salaryInput.value.trim();

  // Имя должно быть длинее 3 символов (минимум 4)
  if (!nameVal || nameVal.length < 4) {
    showError('Name must be at least 4 characters');

    return false;
  }

  // Должность обязательна
  if (!positionVal) {
    showError('Position is required');

    return false;
  }

  if (!officeVal) {
    showError('Office is required');

    return false;
  }

  const ageNum = Number(ageVal);

  if (!ageVal || Number.isNaN(ageNum) || ageNum < 18 || ageNum > 90) {
    showError('Age must be between 18 and 90');

    return false;
  }

  if (!salaryVal) {
    showError('Salary is required');

    return false;
  }

  return true;
};

// При любом вводе проверяем и обновляем статус
nameInput.addEventListener('input', validate);
positionInput.addEventListener('input', validate);
ageInput.addEventListener('input', validate);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  const nameVal = nameInput.value.trim();
  const positionVal = positionInput.value.trim();
  const officeVal = officeSelect.value.trim();
  const ageVal = ageInput.value.trim();
  const salaryVal = salaryInput.value.trim();

  const rawSalary = Number(salaryVal.replace(/[$,]/g, ''));
  const formattedSalary = `$${rawSalary.toLocaleString('en-US')}`;

  const tbody = table.querySelector('tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameVal}</td>
    <td>${positionVal}</td>
    <td>${officeVal}</td>
    <td>${ageVal}</td>
    <td>${formattedSalary}</td>
  `;
  tbody.appendChild(newRow);

  showSuccess('Employee added successfully');
  form.reset();
});
