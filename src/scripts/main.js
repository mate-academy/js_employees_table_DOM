'use strict';

// write code here
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tableHeaders = table.querySelectorAll('thead th');
  const tableBody = table.querySelector('tbody');
  const form = document.createElement('form');

  form.classList.add('new-employee-form');
  table.after(form);

  let currentColumnIndex = -1;
  let isAscending = true;

  tableHeaders.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = [...tableBody.querySelectorAll('tr')];

      if (currentColumnIndex === index) {
        isAscending = !isAscending;
      } else {
        isAscending = true;
        currentColumnIndex = index;
      }

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[index].textContent.trim();
        const cellB = rowB.children[index].textContent.trim();

        const cleanA = cellA.replace(/[$,]/g, '');
        const cleanB = cellB.replace(/[$,]/g, '');

        const isNumber =
          !isNaN(cleanA) && !isNaN(cleanB) && cleanA !== '' && cleanB !== '';

        if (isNumber) {
          return isAscending ? cleanA - cleanB : cleanB - cleanA;
        } else {
          return isAscending
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });

      tableBody.append(...rows);
    });
  });

  tableBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    const activeRow = tableBody.querySelector('.active');

    if (activeRow) {
      activeRow.classList.remove('active');
    }

    if (activeRow !== row) {
      row.classList.add('active');
    }
  });

  form.insertAdjacentHTML(
    'beforeend',
    `
      <label>Name: <input type="text" data-qa="name" required></label>
      <label>Position: <input type="text" data-qa="position" required></label>
      <label>Office:
        <select name="name" id="selectForm" data-qa="office">
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age: <input type="number" data-qa="age" required></label>
      <label>Salary: <input type="number" data-qa="salary" required></label>
      <button type="submit">Save to table</button>
    `,
  );

  function showNotification(titleText, descriptionText, type) {
    const oldNotification = document.querySelector('[data-qa="notification"]');

    if (oldNotification) {
      oldNotification.remove();
    }

    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');

    const title = document.createElement('span');

    title.className = 'title';
    title.textContent = titleText;

    const desc = document.createElement('p');

    desc.textContent = descriptionText;

    notification.append(title, desc);
    document.body.append(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputName = document.querySelector("[data-qa='name']");
    const inputPosition = document.querySelector("[data-qa='position']");
    const inputOffice = document.querySelector("[data-qa='office']");
    const inputAge = document.querySelector("[data-qa='age']");
    const inputSalary = document.querySelector("[data-qa='salary']");

    const nameValue = inputName.value.trim();
    const positionValue = inputPosition.value.trim();
    const officeValue = inputOffice.value;
    const ageValue = parseInt(inputAge.value, 10);
    const salaryValue = parseInt(inputSalary.value, 10);
    const nameRegex = /^[\p{L}\s]+$/u;
    const positionRegex = /^[\p{L}\s\d\-.]+$/u;

    if (nameValue.length < 4 || !nameRegex.test(nameValue)) {
      return showNotification(
        'Error',
        'Name must be at least 4 characters long and contain only letters.',
        'error',
      );
    }

    if (!positionRegex.test(positionValue)) {
      return showNotification('Error', 'Invalid position input', 'warning');
    }

    if (isNaN(ageValue) || ageValue < 18 || ageValue > 90) {
      return showNotification(
        'Error',
        'Age must be between 18 and 90 years old.',
        'error',
      );
    }

    if (isNaN(salaryValue) || salaryValue <= 0) {
      return showNotification(
        'Error',
        'Salary must be greater than 0 and a number',
        'error',
      );
    }

    const capitalize = (str) =>
      str
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');

    const tr = document.createElement('tr');
    const rowData = [
      capitalize(nameValue),
      capitalize(positionValue),
      officeValue,
      ageValue,
      `$${salaryValue.toLocaleString('en-US')}`,
    ];

    rowData.forEach((text) => {
      const td = document.createElement('td');

      td.textContent = text;
      tr.append(td);
    });

    tableBody.insertAdjacentElement('beforeend', tr);

    showNotification(
      'Success',
      'New employee has been successfully added to the table.',
      'success',
    );
    form.reset();
  });
});
