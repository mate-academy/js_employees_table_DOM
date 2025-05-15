'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  let sortColumn = null;
  let sortDirection = 'asc';
  let activeRow = null;
  let activeCell = null;

  const sortTable = (columnIndex) => {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (columnIndex === sortColumn) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = columnIndex;
      sortDirection = 'asc';
    }

    const sortedRows = rows.sort((rowA, rowB) => {
      const cellA = rowA.querySelectorAll('td')[columnIndex].textContent.trim();
      const cellB = rowB.querySelectorAll('td')[columnIndex].textContent.trim();

      const valueA = isNaN(cellA)
        ? cellA.toLowerCase()
        : parseFloat(cellA.replace('$', '').replace(',', ''));
      const valueB = isNaN(cellB)
        ? cellB.toLowerCase()
        : parseFloat(cellB.replace('$', '').replace(',', ''));

      if (typeof valueA === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });

    tbody.innerHTML = '';
    tbody.append(...sortedRows);
  };

  thead.querySelectorAll('th').forEach((th, index) => {
    th.addEventListener('click', () => sortTable(index));
  });

  const selectRow = (row) => {
    if (activeRow) {
      activeRow.classList.remove('active');
    }
    row.classList.add('active');
    activeRow = row;
  };

  tbody.querySelectorAll('tr').forEach((row) => {
    row.addEventListener('click', () => selectRow(row));
  });

  const observeTableBody = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR') {
            node.addEventListener('click', () => selectRow(node));
          }
        });
      }
    }
  });

  observeTableBody.observe(tbody, { childList: true });

  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  form.innerHTML = `
    <label>Name: <input type="text" name="name" data-qa="name"></label>
    <label>Position: <input type="text" name="position" data-qa="position"></label>
    <label>Office: <select name="office" data-qa="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select></label>
    <label>Age: <input type="number" name="age" data-qa="age"></label>
    <label>Salary: <input type="number" name="salary" data-qa="salary"></label>
    <button type="button">Save to table</button>
  `;

  table.parentNode.insertBefore(form, table.nextSibling);

  const nameInput = form.querySelector('[name="name"]');
  const positionInput = form.querySelector('[name="position"]');
  const officeSelect = form.querySelector('[name="office"]');
  const ageInput = form.querySelector('[name="age"]');
  const salaryInput = form.querySelector('[name="salary"]');
  const saveButton = form.querySelector('button');

  const showNotification = (message, type) => {
    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.dataset.qa = 'notification';
    notification.innerHTML = `<span class="title">${type.toUpperCase()}</span><p>${message}</p>`;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  saveButton.addEventListener('click', () => {
    const nameValue = nameInput.value.trim();
    const positionValue = positionInput.value.trim();
    const officeValue = officeSelect.value;
    const ageValue = ageInput.value.trim();
    const salaryValue = salaryInput.value.trim();

    if (
      !nameValue ||
      !positionValue ||
      !officeValue ||
      !ageValue ||
      !salaryValue
    ) {
      showNotification('All fields are required.', 'error');

      return;
    }

    if (nameValue.length < 4) {
      showNotification('Name must be at least 4 letters long.', 'error');

      return;
    }

    const age = parseInt(ageValue, 10);

    if (isNaN(age) || age < 18 || age > 90) {
      showNotification('Age must be a number between 18 and 90.', 'error');

      return;
    }

    const salary = parseFloat(salaryValue);

    if (isNaN(salary)) {
      showNotification('Salary must be a valid number.', 'error');

      return;
    }

    const newRow = tbody.insertRow();
    const nameCell = newRow.insertCell();
    const positionCell = newRow.insertCell();
    const officeCell = newRow.insertCell();
    const ageCell = newRow.insertCell();
    const salaryCell = newRow.insertCell();

    nameCell.textContent = nameValue;
    positionCell.textContent = positionValue;
    officeCell.textContent = officeValue;
    ageCell.textContent = age;
    salaryCell.textContent = `$${salary.toLocaleString()}`;

    showNotification('New employee added successfully!', 'success');

    nameInput.value = '';
    positionInput.value = '';
    ageInput.value = '';
    salaryInput.value = '';
  });

  tbody.addEventListener('dblclick', (evt) => {
    const target = evt.target;

    if (target.tagName === 'TD' && activeCell === null) {
      activeCell = target;

      const originalValue = target.textContent;
      const input = document.createElement('input');

      input.type = 'text';
      input.classList.add('cell-input');
      input.value = originalValue;
      target.textContent = '';
      target.appendChild(input);
      input.focus();

      const saveEdit = () => {
        const newValue = input.value.trim();

        target.textContent = newValue || originalValue;
        activeCell = null;
      };

      input.addEventListener('blur', saveEdit);

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
        }
      });
    } else if (
      target.tagName === 'TD' &&
      activeCell !== null &&
      activeCell !== target
    ) {
      const activeInput = activeCell.querySelector('input');

      if (activeInput) {
        activeInput.blur();
      }
    }
  });
});
