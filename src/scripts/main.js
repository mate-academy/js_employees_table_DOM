'use strict';

let currentEvent;

const toggleSortOrder = (currentOrder) =>
  (currentOrder === 'asc' ? 'desc' : 'asc');

const sortTable = (columnIndex, sortOrder) => {
  const rows = Array.from(document.querySelectorAll('tbody tr'));

  rows.sort((rowA, rowB) => {
    const valueA = rowA.children[columnIndex].textContent;
    const valueB = rowB.children[columnIndex].textContent;

    return sortOrder === 'asc'
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const tbody = document.querySelector('tbody');

  tbody.innerHTML = '';
  rows.forEach((row) => tbody.appendChild(row));
};

const handleHeaderClick = () => {
  const th = currentEvent.target;
  const columnIndex = th.cellIndex;
  const currentOrder = th.dataset.sortOrder || 'asc';
  const newOrder = toggleSortOrder(currentOrder);

  sortTable(columnIndex, newOrder);

  document.querySelectorAll('th')
    .forEach(header => header.classList.remove('asc', 'desc'));

  th.classList.add(newOrder);

  th.dataset.sortOrder = newOrder;
};

const handleRowClick = () => {
  const selectedRow = currentEvent.target.closest('tr');
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((row) => row.classList.remove('active'));
  selectedRow.classList.add('active');
};

const validateFormData = (formData) => {
  const name = formData.get('name');
  const age = parseInt(formData.get('age'), 10);
  const salary = parseInt(formData.get('salary').replace(/[^\d]/g, ''), 10);

  if (name.length < 4) {
    showNotification('Name should have at least 4 characters', 'error');

    return false;
  }

  if (age < 18 || age > 90) {
    showNotification('Age should be between 18 and 90', 'error');

    return false;
  }

  if (isNaN(salary) || salary <= 0) {
    showNotification('Invalid salary value', 'error');

    return false;
  }

  return true;
};

const showNotification = (message, type) => {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
};

const handleFormSubmit = () => {
  currentEvent.preventDefault();

  const form = currentEvent.target;
  const formData = new FormData(form);

  if (validateFormData(formData)) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${formData.get('name')}</td>
      <td>${formData.get('position')}</td>
      <td>${formData.get('office')}</td>
      <td>${formData.get('age')}</td>
      <td>${formData.get('salary')}</td>
    `;

    document.querySelector('tbody').appendChild(newRow);

    form.reset();
    showNotification('Employee added successfully', 'success');
  }
};

document.querySelectorAll('th')
  .forEach((th) => th.addEventListener('click', (event) => {
    currentEvent = event;
    handleHeaderClick();
  }));

document.querySelectorAll('tbody tr')
  .forEach((row) => row.addEventListener('click', handleRowClick));

const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`;

form.addEventListener('submit', handleFormSubmit);
document.body.appendChild(form);
