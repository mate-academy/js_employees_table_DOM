'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th, tfoot th');
  let sortColumnindex = null;
  let sortAsc = true;
  let activeCellEditor = null;

  headers.forEach((th, index) => {
    th.addEventListener('click', () => {
      if (sortColumnindex === index) {
        sortAsc = !sortAsc;
      } else {
        sortColumnindex = index;
        sortAsc = true;
      }

      sortTable(index, sortAsc);
    });
  });

  function sortTable(index, asc) {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      let cellA = rowA.children[index].textContent.trim();
      let cellB = rowB.children[index].textContent.trim();
      const cleanA = cellA.replace(/[^0-9.-]+/g, '');
      const numA = parseFloat(cleanA);
      const cleanB = cellB.replace(/[^0-9.-]+/g, '');
      const numB = parseFloat(cleanB);

      const isNumeric =
        cleanA !== '' && !isNaN(numA) && cleanB !== '' && !isNaN(numB);

      if (isNumeric) {
        cellA = numA;
        cellB = numB;

        return asc ? cellA - cellB : cellB - cellA;
      } else {
        return asc
          ? cellA.toLowerCase().localeCompare(cellB.toLowerCase())
          : cellB.toLowerCase().localeCompare(cellA.toLowerCase());
      }
    });

    tbody.append(...rows);
  }

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((row) => {
      row.classList.remove('active');
    });

    tr.classList.add('active');
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input data-qa="name" name="name" type="text" required></label>
    <label>Position: <input data-qa="position" name="position" type="text" required></label>
    <label>Office:
     <select data-qa="office" name="office" required>
       <option value="Tokyo">Tokyo</option>
       <option value="Singapore">Singapore</option>
       <option value="London">London</option>
       <option value="New York">New York</option>
       <option value="Edinburgh">Edinburgh</option>
       <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input data-qa="age" name="age" type="number" required></label>
    <label>Salary: <input data-qa="salary" name="salary" type="number" required></label>
    <button type="submit">Save to table</button>
  `;

  table.insertAdjacentElement('afterend', form);

  const salaryInput = form.salary;

  salaryInput.addEventListener('input', () => {
    const value = salaryInput.value.replace(/[^\d]/g, '');

    if (value) {
      salaryInput.value = '$' + Number(value).toLocaleString('en-US');
    } else {
      salaryInput.value = '';
    }
  });

  function showNotification(message, type) {
    const notif = document.createElement('div');

    notif.className = `notification ${type}`;
    notif.dataset.qa = 'notification';

    const title = document.createElement('span');

    title.className = 'title';
    title.textContent = type.toUpperCase();
    notif.appendChild(title);

    const text = document.createElement('p');

    text.textContent = message;
    notif.appendChild(text);

    document.body.appendChild(notif);

    const timeout = window.Cypress ? 10000 : 3000;

    setTimeout(() => notif.remove(), timeout);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const n = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const rawSalary = form.salary.value.replace(/[$,]/g, '');
    const salary = parseFloat(rawSalary);

    if (n.length < 4) {
      return showNotification(
        'Name must be at least 4 characters long',
        'error',
      );
    }

    if (position.length < 2) {
      return showNotification(
        'Position must be at least 2 characters long',
        'error',
      );
    }

    if (isNaN(age) || age < 18) {
      return showNotification('Age must be more than 18', 'error');
    }

    if (age > 90) {
      return showNotification('Age must be less than 90', 'error');
    }

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${n}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString()}</td>
    `;

    tbody.appendChild(tr);
    form.reset();
    showNotification('Employee added successfully!', 'success');
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || activeCellEditor) {
      return;
    }

    const originalValue = cell.textContent.trim();
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = originalValue;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
    activeCellEditor = input;

    function save() {
      const newValue = input.value.trim() || originalValue;

      cell.textContent = newValue;
      activeCellEditor = null;
    }

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') {
        save();
      }
    });
  });
});
