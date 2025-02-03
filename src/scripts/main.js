'use strict';

// write code here
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');
  const form = document.createElement('form');
  const notificationContainer = document.createElement('div');
  let selectedRow = null;
  let currentSortColumn = null;
  let sortAscending = true;

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input data-qa="name" name="name" type="text" /></label>
    <label>Position: <input data-qa="position" name="position" type="text" /></label>
    <label>Office:
      <select data-qa="office" name="office">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>Age: <input data-qa="age" name="age" type="number" /></label>
    <label>Salary: <input data-qa="salary" name="salary" type="number" /></label>
    <button type="submit">Save to table</button>
  `;
  document.body.appendChild(form);

  // Add notification container
  notificationContainer.setAttribute('data-qa', 'notification');
  document.body.appendChild(notificationContainer);

  // **Sorting Table Columns**
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      sortAscending = currentSortColumn === index ? !sortAscending : true;
      currentSortColumn = index;

      rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[index].innerText.trim();
        let cellB = rowB.cells[index].innerText.trim();

        // Якщо це число (вік)
        if (!isNaN(cellA) && !isNaN(cellB)) {
          return sortAscending
            ? Number(cellA) - Number(cellB)
            : Number(cellB) - Number(cellA);
        }

        // Якщо це зарплата (сума з $)
        if (cellA.includes('$') && cellB.includes('$')) {
          cellA = Number(cellA.replace(/[^0-9.]/g, ''));
          cellB = Number(cellB.replace(/[^0-9.]/g, ''));

          return sortAscending ? cellA - cellB : cellB - cellA;
        }

        // Otherwise, treat it as a string for alphabetical sorting
        return sortAscending
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      });

      tbody.innerHTML = '';
      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  // eslint-disable-next-line no-shadow
  tbody.addEventListener('click', (event) => {
    const row = event.target.closest('tr');

    if (!row) {
      return;
    }

    if (selectedRow) {
      selectedRow.classList.remove('active');
    }
    row.classList.add('active');
    selectedRow = row;
  });

  // **Form Submission**
  // eslint-disable-next-line no-shadow
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // eslint-disable-next-line no-shadow
    const name = form.querySelector("[data-qa='name']").value.trim();
    const position = form.querySelector("[data-qa='position']").value.trim();
    const office = form.querySelector("[data-qa='office']").value;
    const age = form.querySelector("[data-qa='age']").value.trim();
    const salary = form.querySelector("[data-qa='salary']").value.trim();

    if (!name || !position || !office || !age || !salary) {
      showNotification('All fields are required.', 'error');

      return;
    }

    if (name.length < 4) {
      showNotification('Name must be at least 4 characters.', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
      <td>${name}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${parseFloat(salary).toLocaleString()}</td>
    `;
    tbody.appendChild(newRow);

    showNotification('Employee added successfully!', 'success');
    form.reset();
  });

  // **Notifications**
  function showNotification(message, type) {
    notificationContainer.innerText = message;
    notificationContainer.className = type;
    setTimeout(() => (notificationContainer.innerText = ''), 3000);
  }

  // **Редагування комірок таблиці**
  // eslint-disable-next-line no-shadow
  tbody.addEventListener('dblclick', (event) => {
    const cell = event.target;

    if (cell.tagName !== 'TD' || cell.querySelector('input')) {
      return;
    }

    const initialValue = cell.innerText.trim();
    const input = document.createElement('input');

    input.type = 'text';
    input.classList.add('cell-input');
    input.value = initialValue;

    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    // Збереження змін при втраті фокусу
    input.addEventListener('blur', () =>
      // eslint-disable-next-line prettier/prettier
      saveCellEdit(cell, input, initialValue));

    // Збереження змін при натисканні Enter
    // eslint-disable-next-line no-shadow
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        saveCellEdit(cell, input, initialValue);
      }
    });
  });

  // **Функція збереження змін у комірці**
  function saveCellEdit(cell, input, initialValue) {
    const newValue = input.value.trim();

    cell.innerText = newValue !== '' ? newValue : initialValue;
  }
});
