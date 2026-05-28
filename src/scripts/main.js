'use strict';

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const sordDirections = {};

if (thead) {
  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th');

    if (!th) {
      return;
    }

    const columnIndex = th.cellIndex;
    const rowsArray = Array.from(tbody.querySelectorAll('tr'));

    const currentDirection = sordDirections[columnIndex] || 'desc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    sordDirections[columnIndex] = newDirection;

    rowsArray.sort((a, b) => {
      const valueA = a.cells[columnIndex].textContent.trim();
      const valueB = b.cells[columnIndex].textContent.trim();

      const cleanedA = valueA.replace('$', '').replaceAll(',', '');
      const cleanedB = valueB.replace('$', '').replaceAll(',', '');

      const numA = Number(cleanedA);
      const numB = Number(cleanedB);

      if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
        return newDirection === 'asc' ? numA - numB : numB - numA;
      }

      return newDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });

    rowsArray.forEach((row) => tbody.appendChild(row));
  });
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const active = tbody.querySelector('.active');

  if (active) {
    active.classList.remove('active');
  }

  row.classList.add('active');
});

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name"></label>
  <label>Position: <input name="position" type="text" data-qa="position"></label>
  <label>Age: <input name="age" type="number" data-qa="age"></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
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
  <button type="submit">Save to table</button>
`;

const container = document.querySelector('.container') || document.body;

container.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.elements.name.value;
  const position = form.elements.position.value;
  const ageString = form.elements.age.value;
  const salaryString = form.elements.salary.value;
  const office = form.elements.office.value;

  if (!employeeName || !position || !ageString || !salaryString || !office) {
    showNotification('error', 'Error', 'All fields are required');

    return;
  }

  const age = +ageString;
  const salary = +salaryString;

  if (employeeName.length < 4) {
    showNotification(
      'error',
      'Error',
      'Name must be at least 4 characters long',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('error', 'Invalid Age', 'Age must be between 18 and 90');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
  <td>${employeeName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${salary.toLocaleString('en-US')}</td>
`;

  tbody.append(tr);

  showNotification('success', 'Success', 'Employee added successfully');

  form.reset();
});

function showNotification(type, title, message) {
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);

  notification.innerHTML = `
  <strong>${title}</strong>
  <p>${message}</p>
  `;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
