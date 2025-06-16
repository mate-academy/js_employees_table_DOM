'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');
  const body = document.querySelector('body');

  let sortDirection = {};

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const isNumeric = ['Age', 'Salary'].includes(header.textContent.trim());
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (sortDirection[index] === 'asc') {
        sortDirection[index] = 'desc';
      } else {
        sortDirection = {};
        sortDirection[index] = 'asc';
      }

      rows.sort((rowA, rowB) => {
        let cellA = rowA.children[index].textContent.trim();
        let cellB = rowB.children[index].textContent.trim();

        if (header.textContent.trim() === 'Salary') {
          cellA = parseFloat(cellA.replace('$', '').replace(/,/g, ''));
          cellB = parseFloat(cellB.replace('$', '').replace(/,/g, ''));
        } else if (isNumeric) {
          cellA = parseFloat(cellA);
          cellB = parseFloat(cellB);
        }

        if (sortDirection[index] === 'asc') {
          return cellA > cellB ? 1 : -1;
        } else {
          return cellA < cellB ? 1 : -1;
        }
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  tbody.addEventListener('click', (e) => {
    const targetRow = e.target.closest('tr');

    if (targetRow && tbody.contains(targetRow)) {
      tbody.querySelectorAll('tr').forEach((row) => {
        row.classList.remove('active');
      });

      targetRow.classList.add('active');
    }
  });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input name="name" type="text" data-qa="name" required></label>
    <label>Position: <input name="position" type="text" data-qa="position" required></label>
    <label>Office:
      <select name="office" data-qa="office" required>
        <option value="">-- Choose the Office -- </option>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input name="age" type="number" data-qa="age" required></input></label>
    <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;

  table.parentNode.insertBefore(form, table.nextSibling);

  function showNotification(type, title, description) {
    let notification = document.querySelector('[data-qa="notification"]');

    if (notification) {
      notification.remove();
    }

    notification = document.createElement('div');
    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');
    notification.innerHTML = `<span class="title">${title}</span><p>${description}</p>`;
    body.appendChild(notification);

    setTimeout(() => {
      if (notification) {
        notification.remove();
      }
    }, 3000);
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(form);
    const empName = formData.get('name').trim();
    const positionRaw = formData.get('position');
    const position = positionRaw ? positionRaw.trim() : '';
    const office = formData.get('office').trim();
    const ageString = formData.get('age').trim();
    const salaryString = formData.get('salary').trim();

    if (empName === '') {
      showNotification('error', 'Validation', 'The "Name" field is mandatory');

      return;
    }

    if (position === '') {
      showNotification(
        'error',
        'Validation',
        'The "Position" field is mandatory',
      );

      return;
    }

    if (office === '') {
      showNotification('error', 'Validation', 'Please, choose the office');

      return;
    }

    if (ageString === '' || Number.isNaN(Number(ageString))) {
      showNotification('error', 'Validation', 'The "Age" field is mandatory');

      return;
    }

    if (salaryString === '' || Number.isNaN(Number(salaryString))) {
      showNotification(
        'error',
        'Validation',
        'The "Salary" field is mandatory',
      );

      return;
    }

    const age = parseInt(ageString, 10);
    const salary = parseFloat(salaryString);

    if (empName.length < 4) {
      showNotification(
        'error',
        'Validation',
        '"Name" should include minimun 4 letters',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification(
        'error',
        'Validation',
        '"Age" should be from 18 to 90 years',
      );

      return;
    }

    const newRow = tbody.insertRow();

    newRow.insertCell().textContent = empName;
    newRow.insertCell().textContent = position;
    newRow.insertCell().textContent = office;
    newRow.insertCell().textContent = age;

    newRow.insertCell().textContent = `$${salary.toLocaleString('en-US')}`;

    showNotification('success', 'Success!', 'New employee successfully added');
    form.reset();
  });

  let currentEditCell = null;

  tbody.addEventListener('dblclick', (ev) => {
    const targetCell = ev.target.closest('td');

    if (targetCell && !currentEditCell) {
      const originalText = targetCell.textContent;

      targetCell.textContent = '';

      const input = document.createElement('input');

      input.classList.add('cell-input');
      input.value = originalText;
      targetCell.appendChild(input);
      input.focus();
      currentEditCell = targetCell;

      const saveChanges = () => {
        const newValue = input.value.trim();

        targetCell.textContent = newValue === '' ? originalText : newValue;

        input.remove();
        currentEditCell = null;
      };

      input.addEventListener('blur', saveChanges);

      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveChanges();
        }
      });
    }
  });
});
