/* eslint-disable no-shadow */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');

  const sortState = {
    index: -1,
    direction: 1,
  };

  thead.addEventListener('click', (e) => {
    if (e.target.tagName !== 'TH') {
      return;
    }

    const ths = Array.from(thead.querySelectorAll('th'));
    const colIndex = ths.indexOf(e.target);

    if (colIndex === sortState.index) {
      sortState.direction *= -1;
    } else {
      sortState.index = colIndex;
      sortState.direction = 1;
    }

    sortTable(colIndex, sortState.direction);
  });

  function sortTable(colIndex, direction) {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    function parseValue(text) {
      const num = text.replace(/[$,]/g, '');

      if (!isNaN(parseFloat(num))) {
        return parseFloat(num);
      }

      if (/^\d+$/.test(text)) {
        return parseInt(text, 10);
      }

      return text.toLowerCase();
    }

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[colIndex].textContent.trim();
      const cellB = rowB.children[colIndex].textContent.trim();

      const valA = parseValue(cellA);
      const valB = parseValue(cellB);

      if (valA > valB) {
        return direction;
      }

      if (valA < valB) {
        return -direction;
      }

      return 0;
    });

    rows.forEach((row) => tbody.appendChild(row));
  }

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    tbody
      .querySelectorAll('tr')
      .forEach((row) => row.classList.remove('active'));
    tr.classList.add('active');
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required /></label>
    <label>Position: <input name="position" type="text" data-qa="position" required /></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="">Select office</option>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" min="18" max="90" data-qa="age" required /></label>
    <label>Salary: <input name="salary" type="number" min="0" step="any" data-qa="salary" required /></label>
    <button type="submit">Save to table</button>
  `;

  document.body.insertBefore(form, table.nextSibling);

  function showNotification(message, type = 'success') {
    const existing = document.querySelector('[data-qa="notification"]');

    if (existing) {
      existing.remove();
    }

    const div = document.createElement('div');

    div.setAttribute('data-qa', 'notification');
    div.className = type;
    div.textContent = message;
    document.body.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, 3000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salaryNum = parseFloat(form.salary.value);

    if (name.length < 4) {
      showNotification('Name must be at least 4 letters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    if (!position) {
      showNotification('Position is required', 'error');

      return;
    }

    if (!office) {
      showNotification('Please select an office', 'error');

      return;
    }

    if (isNaN(salaryNum) || salaryNum < 0) {
      showNotification('Salary must be a positive number', 'error');

      return;
    }

    const salaryFormatted = `$${salaryNum.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salaryFormatted}</td>
    `;
    tbody.appendChild(tr);

    showNotification('New employee successfully added!', 'success');

    form.reset();
  });
});
