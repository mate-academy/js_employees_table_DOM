'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const headers = table.querySelectorAll('th');
  const tbody = table.querySelector('tbody');

  let currentSortColumnIndex = null;
  let isAscending = true;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      if (currentSortColumnIndex === index) {
        isAscending = !isAscending;
      } else {
        currentSortColumnIndex = index;
        isAscending = true;
      }

      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((rowA, rowB) => {
        let cellA = rowA.children[index].textContent.trim();
        let cellB = rowB.children[index].textContent.trim();

        if (index === 4) {
          cellA = parseFloat(cellA.replace(/[$,]/g, '')) || 0;
          cellB = parseFloat(cellB.replace(/[$,]/g, '')) || 0;
        }

        const isNumeric = !isNaN(cellA) && !isNaN(cellB);

        if (isNumeric) {
          return isAscending ? cellA - cellB : cellB - cellA;
        } else {
          return isAscending
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  tbody.addEventListener('click', (e) => {
    const clickedRow = e.target.closest('tr');

    if (clickedRow) {
      const activeRow = tbody.querySelector('.active');

      if (activeRow) {
        activeRow.classList.remove('active');
      }
      clickedRow.classList.add('active');
    }
  });

  const form = document.createElement('form');

  document.body.appendChild(form);
  form.className = 'new-employee-form';

  const fields = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      dataQa: 'name',
    },
    {
      label: 'Position',
      name: 'position',
      type: 'text',
      dataQa: 'position',
    },
    {
      label: 'Age',
      name: 'age',
      type: 'number',
      dataQa: 'age',
    },
    {
      label: 'Salary',
      name: 'salary',
      type: 'number',
      dataQa: 'salary',
    },
  ];

  fields.forEach(({ label, name: n, type, dataQa }) => {
    const fieldLabel = document.createElement('label');

    fieldLabel.innerHTML = `${label}: <input name="${n}" type="${type}" data-qa="${dataQa}" required>`;
    form.appendChild(fieldLabel);
  });

  const officeLabel = document.createElement('label');

  officeLabel.innerHTML = `Office: <select name="office" data-qa="office" required>
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>`;
  form.appendChild(officeLabel);

  const submitButton = document.createElement('button');

  submitButton.type = 'submit';
  submitButton.textContent = 'Save to table';
  form.appendChild(submitButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const personName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value);

    if (!personName || !position || !office || isNaN(age) || isNaN(salary)) {
      showNotification('Error', 'All fields are required.', 'error');

      return;
    }

    if (personName.length < 4) {
      showNotification(
        'Error',
        'Name must be at least 4 characters long.',
        'error',
      );

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Error', 'Age must be between 18 and 90.', 'error');

      return;
    }

    if (isNaN(salary) || salary <= 0) {
      showNotification('Error', 'Salary must be a positive number.', 'error');

      return;
    }

    const formattedSalary = `${salary.toLocaleString('en-US')}`;
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${personName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${formattedSalary}</td>
    `;
    table.querySelector('tbody').appendChild(row);

    form.reset();

    showNotification('Success', 'Employee added successfully.', 'success');
  });

  function showNotification(title, message, type) {
    document.querySelectorAll('.notification').forEach((el) => el.remove());

    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');

    notification.innerHTML = `
      <span class="title">${title}</span>
      <p>${message}</p>
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }
});
