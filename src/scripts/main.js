const form = document.createElement('form');
const table = document.querySelector('table');
const headers = document.querySelectorAll('th');
let currentSortColumn = null;
let currentSortOrder = 'asc';
const tbody = table.querySelector('tbody');

headers.forEach((header, index) => {
  header.addEventListener('click', () => {
    const rows = [...tbody.querySelectorAll('tr')];

    if (currentSortColumn === index) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = index;
      currentSortOrder = 'asc';
    }

    rows.sort((a, b) => {
      const cellA = a.children[index].textContent.trim();
      const cellB = b.children[index].textContent.trim();

      if (!isNaN(cellA) && !isNaN(cellB)) {
        return currentSortOrder === 'asc' ? cellA - cellB : cellB - cellA;
      }

      return currentSortOrder === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    });

    tbody.append(...rows);
  });
});

tbody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }

  document.querySelectorAll('tbody tr').forEach((tr) => {
    tr.classList.remove('active');
  });

  row.classList.add('active');
});

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input data-qa="name" name="name" type="text">
  </label>

  <label>
    Position:
    <input data-qa="position" name="position" type="text">
  </label>

  <label>
    Office:
    <select data-qa="office" name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>

  <label>
    Age:
    <input data-qa="age" name="age" type="number">
  </label>

  <label>
    Salary:
    <input data-qa="salary" name="salary" type="number">
  </label>

  <button type="submit">Save to table</button>
`;

function showNotification(message, type) {
  const oldNotification = document.querySelector('[data-qa="notification"]');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');

  notification.dataset.qa = 'notification';
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const nameUser = form.querySelector('[data-qa="name"]').value.trim();
  const position = form.querySelector('[data-qa="position"]').value.trim();
  const office = form.querySelector('[data-qa="office"]').value;
  const age = form.querySelector('[data-qa="age"]').value.trim();
  const salary = form.querySelector('[data-qa="salary"]').value.trim();

  if (!nameUser || !position || !office || !age || !salary) {
    showNotification('Please fill in all fields', 'error');

    return;
  }

  if (nameUser.length < 4) {
    showNotification('Name must contain at least 4 letters', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${nameUser}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString()}</td>
  `;
  tbody.append(row);
  form.reset();
  showNotification('Employee added successfully', 'success');
});

document.body.append(form);
