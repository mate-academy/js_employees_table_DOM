'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

const form = document.createElement('form');
const notifications = document.createElement('div');

document.addEventListener('DOMContentLoaded', () => {
  createTable();
  setupNotifications();
});

function createTable() {
  form.classList.add('new-employee-form');

  form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="" disabled selected>Select an office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" step="0.01" data-qa="salary" required></label>
  <button type="submit">Save to table</button>
  `;

  document.body.appendChild(form);
}

function setupNotifications() {
  notifications.classList.add('notifications');
  document.body.appendChild(notifications);
}

const sortOrder = {
  name: 'asc',
  position: 'asc',
  office: 'asc',
  age: 'asc',
  salary: 'asc',
};

document.addEventListener('DOMContentLoaded', () => {
  const thead = table.querySelector('thead');

  thead.addEventListener('click', sorting);
  tbody.addEventListener('click', selectTd);
  form.addEventListener('submit', addEmployee);
});

function selectTd(e) {
  if (e.target.tagName === 'TD') {
    const rows = document.querySelectorAll('tr.active');

    rows.forEach((delRow) => delRow.classList.remove('active'));

    const row = e.target.closest('tr');

    if (row) {
      row.classList.add('active');
    }
  }
}

function getTable() {
  const newArr = Array.from(tbody.querySelectorAll('tr')).map((row) => {
    const cells = row.querySelectorAll('td');

    return {
      name: cells[0].textContent.trim(),
      position: cells[1].textContent.trim(),
      office: cells[2].textContent.trim(),
      age: parseInt(cells[3].textContent.trim(), 10),
      salary: parseFloat(cells[4].textContent.trim().replace(/[$,]/g, '')),
    };
  });

  return newArr;
}

function sorting(e) {
  const headName = getName(e);

  if (!headName) {
    return;
  }

  const workersArr = getTable();

  sortList(headName, workersArr);

  function getName() {
    e.preventDefault();

    if (e.target.tagName === 'TH') {
      return e.target.textContent.trim().toLowerCase();
    }

    return null;
  }

  function sortList(title, workers) {
    const titleTH = title.toLowerCase();
    const sortBy = {
      name: 'name',
      position: 'position',
      office: 'office',
      age: 'age',
      salary: 'salary',
    }[titleTH];

    if (sortBy) {
      const order = sortOrder[sortBy] === 'asc' ? 1 : -1;

      workers.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return -1 * order;
        }

        if (a[sortBy] > b[sortBy]) {
          return 1 * order;
        }

        return 0;
      });
      sortOrder[sortBy] = sortOrder[sortBy] === 'asc' ? 'desc' : 'asc';
      updateTable(workers);
    }
  }

  function updateTable(finalArr) {
    tbody.innerHTML = '';

    for (const worker of finalArr) {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${worker.name}</td>
        <td>${worker.position}</td>
        <td>${worker.office}</td>
        <td>${worker.age}</td>
        <td>$${worker.salary.toLocaleString('en-US')}</td>
      `;
      tbody.appendChild(row);
    }
  }
}

function addEmployee(e) {
  e.preventDefault();

  const nameWorker = form.querySelector('input[name="name"]').value.trim();
  const position = form.querySelector('input[name="position"]').value.trim();
  const office = form.querySelector('select[name="office"]').value.trim();
  const age = parseInt(
    form.querySelector('input[name="age"]').value.trim(),
    10,
  );
  const salary = parseFloat(
    form.querySelector('input[name="salary"]').value.trim(),
  );

  if (!nameWorker || !position || !office || isNaN(age) || isNaN(salary)) {
    showNotification(
      'error',
      'Validation Error',
      'All fields are required and must be valid.',
    );

    return;
  }

  if (nameWorker.length < 4) {
    showNotification(
      'error',
      'Validation Error',
      'Name must be at least 4 letters long.',
    );

    return;
  }

  if (position.length < 4) {
    showNotification('error', 'Validation Error', 'Position must be valid.');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification(
      'error',
      'Validation Error',
      'Age must be between 18 and 90.',
    );

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameWorker}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US', { minimumFractionDigits: 0 })}</td>
  `;
  tbody.appendChild(newRow);

  form.reset();
  showNotification('success', 'Success', 'Employee added to the table.');
}

function showNotification(type, title, description) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');

  notification.innerHTML = `
    <strong>${title}</strong>
    <p>${description}</p>
  `;

  notifications.appendChild(notification);

  setTimeout(() => {
    notifications.removeChild(notification);
  }, 3000);
}
