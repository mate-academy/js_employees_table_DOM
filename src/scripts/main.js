'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const headers = table.querySelectorAll('thead th');

let currentColumnIndex = null;
let isAscending = true;

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    if (currentColumnIndex === index) {
      isAscending = !isAscending;
    } else {
      currentColumnIndex = index;
      isAscending = true;
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      if (index === 3) {
        const valA = Number(cellA);
        const valB = Number(cellB);

        return isAscending ? valA - valB : valB - valA;
      }

      if (index === 4) {
        const valA = Number(cellA.replace(/[^0-9.-]+/g, ''));
        const valB = Number(cellB.replace(/[^0-9.-]+/g, ''));

        return isAscending ? valA - valB : valB - valA;
      }

      const result = cellA.localeCompare(cellB);

      return isAscending ? result : -result;
    });

    tbody.append(...rows);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const allRows = tbody.querySelectorAll('tr');

  allRows.forEach((r) => r.classList.remove('active'));

  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <h3>New employee</h3>
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Office:
    <select name="office" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
  <button type="submit">Save to table</button>
`;

table.after(form);

const showNotification = (title, message, type) => {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${type}`;

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = message;

  notification.append(h2, p);
  document.body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employeeName = formData.get('name').trim();
  const employeePosition = formData.get('position').trim();
  const employeeOffice = formData.get('office');
  const employeeAge = Number(formData.get('age'));
  const rawSalary = formData.get('salary');

  if (
    !employeeName ||
    !employeePosition ||
    !employeeOffice ||
    !employeeAge ||
    !rawSalary
  ) {
    showNotification('Error', 'All fields are required!', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('Error', 'Name must contain at least 4 letters!', 'error');

    return;
  }

  if (employeeAge < 18 || employeeAge > 90) {
    showNotification('Error', 'Age must be between 18 and 90!', 'error');

    return;
  }

  const formattedSalary = `$${Number(rawSalary).toLocaleString('en-US')}`;

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${employeeName}</td>
    <td>${employeePosition}</td>
    <td>${employeeOffice}</td>
    <td>${employeeAge}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(newRow);
  form.reset();

  showNotification('Success', 'New employee successfully added!', 'success');
});
