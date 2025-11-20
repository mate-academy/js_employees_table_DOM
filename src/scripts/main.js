'use strict';

const tbody = document.querySelector('tbody');
const headers = document.querySelectorAll('th');

const currentSort = {
  index: null,
  order: 'asc',
};

function sortTable(index) {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((rowA, rowB) => {
    let cellA = rowA.children[index].textContent.trim();
    let cellB = rowB.children[index].textContent.trim();

    if (index === 3) {
      cellA = Number(cellA);
      cellB = Number(cellB);
    } else if (index === 4) {
      cellA = Number(cellA.split('$').join('').split(',').join(''));
      cellB = Number(cellB.split('$').join('').split(',').join(''));
    } else {
      return currentSort.order === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }

    return currentSort.order === 'asc' ? cellA - cellB : cellB - cellA;
  });

  rows.forEach((row) => tbody.appendChild(row));
}

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentSort.index === index) {
      currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.index = index;
      currentSort.order = 'asc';
    }

    sortTable(index);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));

  row.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="" disabled selected>Select office</option>
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
  <button type="submit" data-qa="save">Save to table</button>
  `;

document.body.appendChild(form);

function showNotification(message, type = 'success') {
  const div = document.createElement('div');

  div.textContent = message;
  div.classList.add('notification');
  div.setAttribute('data-qa', 'notification');

  div.classList.add(type === 'success' ? 'success' : 'error');

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = form.querySelector('[name="name"]');
  const positionInput = form.querySelector('[name="position"]');
  const officeSelect = form.querySelector('[name="office"]');
  const ageInput = form.querySelector('[name="age"]');
  const salaryInput = form.querySelector('[name="salary"]');

  const employeeName = nameInput.value.trim();
  const employeePosition = positionInput.value.trim();
  const employeeOffice = officeSelect.value;
  const employeeAge = Number(ageInput.value);
  const employeeSalary = Number(salaryInput.value);

  if (employeeName.length < 4) {
    showNotification('Name must be at least 4 characters', 'error');

    return;
  }

  if (employeePosition.length < 2) {
    showNotification('Position must be at least 2 characters', 'error');

    return;
  }

  if (employeeAge < 18 || employeeAge > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  if (employeeSalary < 0 || isNaN(employeeSalary)) {
    showNotification('Salary must be positive number', 'error');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${employeeName}</td>
    <td>${employeePosition}</td>
    <td>${employeeOffice}</td>
    <td>${employeeAge}</td>
    <td>$${employeeSalary.toLocaleString('en-US')}</td>
  `;

  tbody.appendChild(tr);

  showNotification('Employee added successfully!', 'success');
  form.reset();
});
