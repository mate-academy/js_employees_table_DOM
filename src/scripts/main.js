'use strict';

const headers = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const index = header.cellIndex;
    const columnName = header.textContent.trim();
    const rows = Array.from(tbody.rows);

    const currentOrder = header.getAttribute('data-order');
    const isAsc = currentOrder !== 'ASC';

    headers.forEach((h) => h.removeAttribute('data-order'));

    rows.sort((rowA, rowB) => {
      const valA = rowA.cells[index].textContent.trim();
      const valB = rowB.cells[index].textContent.trim();

      if (columnName === 'Salary' || columnName === 'Age') {
        const numA = Number(valA.replace(/[$,]/g, '')) || 0;
        const numB = Number(valB.replace(/[$,]/g, '')) || 0;

        return isAsc ? numA - numB : numB - numA;
      }

      return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    header.setAttribute('data-order', isAsc ? 'ASC' : 'DESC');

    tbody.append(...rows);
  });
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name"></label>
<label>Position: <input name="position" type="text" data-qa="position"></label>
<label>Office:
<select name="office" data-qa="office">
<option value='Tokyo'>Tokyo</option>
<option value='Singapore'>Singapore</option>
<option value='London'>London</option>
<option value='New York'>New York</option>
<option value='Edinburgh'>Edinburgh</option>
<option value='San Francisco'>San Francisco</option>
</select>
</label>
<label>Age: <input name="age" type="number" data-qa="age"></label>
<label>Salary: <input name="salary" type="number" data-qa="salary"></label>


<button type='submit'>Save to table</button>
`;

document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employeeName = formData.get('name');
  const position = formData.get('position');
  const age = Number(formData.get('age'));
  const salary = Number(formData.get('salary'));
  const office = formData.get('office');

  if (!employeeName || !position || !age || !salary || !office) {
    showNotification('Error', 'All fields are required', 'error');

    return;
  }

  if (employeeName.length < 4) {
    showNotification('Error', 'Name is too short', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error', 'Invalid age', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `<td>${employeeName}</td><td>${position}</td><td>${office}</td><td>${age}</td><td>$${salary.toLocaleString('en-US')}</td>`;

  tbody.append(newRow);

  form.reset();

  showNotification('Success', 'Employee added successfully', 'success');
});

function showNotification(title, message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.dataset.qa = `notification`;

  notification.innerHTML = `
    <strong>${title}</strong>
    <p>${message}</p>
  `;

  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
