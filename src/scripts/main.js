'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const table = document.querySelector('table tbody');
  const formContainer = document.createElement('div');

  formContainer.className = 'form-container';

  formContainer.innerHTML = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name"></label>
      <label>Position: <input name="position" type="text" data-qa="position"></label>
      <label>Office:
        <select name="office" data-qa="office">
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>
      <label>Age: <input name="age" type="number" data-qa="age"></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
      <button type="button">Save to table</button>
    </form>
  `;

  document.body.appendChild(formContainer);

  const form = formContainer.querySelector('.new-employee-form');
  const saveButton = form.querySelector('button');

  saveButton.addEventListener('click', function () {
    const n = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (validateForm(n, position, age)) {
      addRow(n, position, office, age, salary);
      showNotification('Employee added successfully', 'success');
      form.reset();
    }
  });

  function addRow(n, position, office, age, salary) {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${n}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toFixed(2)}</td>
    `;
    table.appendChild(newRow);
  }

  function validateForm(n, position, age) {
    if (n.length < 4) {
      showNotification('Name should be at least 4 characters long', 'error');

      return false;
    }

    if (!position) {
      showNotification('Position is required', 'error');

      return false;
    }

    if (age < 18 || age > 90) {
      showNotification('Age should be between 18 and 90', 'error');

      return false;
    }

    return true;
  }

  function showNotification(message, type) {
    const notification = document.createElement('div');

    notification.className = type === 'error' ? 'error' : 'success';
    notification.setAttribute('data-qa', 'notification');
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
});

document.querySelectorAll('th').forEach((header, index) => {
  let asc = true;

  header.addEventListener('click', () => {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    const sortedRows = rows.sort((a, b) => {
      let cellA = a.cells[index].innerText;
      let cellB = b.cells[index].innerText;

      const isNumber =
        !isNaN(parseFloat(cellA.replace('$', ''))) &&
        !isNaN(parseFloat(cellB.replace('$', '')));

      if (isNumber) {
        cellA = parseFloat(cellA.replace('$', ''));
        cellB = parseFloat(cellB.replace('$', ''));

        return asc ? cellA - cellB : cellB - cellA;
      } else {
        return asc ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
      }
    });

    asc = !asc;

    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';
    sortedRows.forEach((row) => tbody.appendChild(row));
  });
});
