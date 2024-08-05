'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const tbody = document.querySelector('tbody');
  let activeRow = null;
  let editingCell = null;

  // eslint-disable-next-line no-shadow
  function addRow(name, position, office, age, salary) {
    const tr = document.createElement('tr');

    tr.insertCell().textContent = name;
    tr.insertCell().textContent = position;
    tr.insertCell().textContent = office;
    tr.insertCell().textContent = age;
    tr.insertCell().textContent = salary;

    tr.addEventListener('click', () => highlightRow(tr));
    Array.from(tr.children).forEach((cell) => editFunction(cell));

    return tr;
  }

  function highlightRow(row) {
    if (activeRow) {
      activeRow.classList.remove('active');
    }
    row.classList.add('active');
    activeRow = row;
  }

  function parseTable() {
    const rows = document.querySelectorAll('table tbody tr');

    return Array.from(rows).map((row) => {
      const cells = row.querySelectorAll('td');

      return {
        name: cells[0].textContent.trim(),
        position: cells[1].textContent.trim(),
        office: cells[2].textContent.trim(),
        age: cells[3].textContent.trim(),
        salary: cells[4].textContent.trim(),
      };
    });
  }

  function renderTable(items) {
    for (const row of items) {
      tbody.append(
        addRow(row.name, row.position, row.office, row.age, row.salary),
      );
    }
  }

  function sortRowsOnClick() {
    const parseCurrency = (value) => {
      return parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
    };

    const sortState = {};

    const sortTable = (columnIndex, isNumeric, ascending) => {
      const table = document.querySelector('table');
      const tableBody = table.querySelector('tbody');
      const rows = Array.from(tableBody.querySelectorAll('tr'));

      rows.sort((rowA, rowB) => {
        const cellA = rowA.children[columnIndex].textContent.trim();
        const cellB = rowB.children[columnIndex].textContent.trim();

        let comparison;

        if (isNumeric) {
          comparison = parseCurrency(cellA) - parseCurrency(cellB);
        } else {
          comparison = cellA.localeCompare(cellB);
        }

        return ascending ? -comparison : comparison;
      });

      rows.forEach((row) => tableBody.appendChild(row));
    };

    const ths = document.querySelectorAll('thead th');

    ths.forEach((th, index) => {
      sortState[index] = 'asc';

      th.addEventListener('click', () => {
        const headerText = th.textContent.trim();
        const isNumeric = headerText === 'Salary' || headerText === 'Age';
        const currentSortState = sortState[index];
        const newSortState = currentSortState === 'asc' ? 'desc' : 'asc';

        sortState[index] = newSortState;

        sortTable(index, isNumeric, newSortState === 'asc');

        th.classList.toggle('asc', newSortState === 'asc');
        th.classList.toggle('desc', newSortState === 'desc');
      });
    });
  }

  function createModal() {
    const modalOverlay = document.createElement('div');

    modalOverlay.className = 'modal-overlay';

    const modal = document.createElement('div');

    modal.className = 'modal';

    modal.innerHTML = `
      <form class="new-employee-form">
        <label>Name: <input name="name" type="text" data-qa="name"></label>
        <label>Position: <input name="position" type="text" data-qa="position"></label>
        <label>Office:
          <select name="office" data-qa="office">
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
          </select>
        </label>
        <label>Age: <input name="age" type="number" data-qa="age"></label>
        <label>Salary: <input name="salary" type="number" data-qa="salary"></label>
        <button type="button" id="save-button">Save to table</button>
      </form>
  `;

    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);

    document
      .getElementById('save-button')
      .addEventListener('click', saveButton);
  }

  function saveButton() {
    const form = document.querySelector('.new-employee-form');
    const formData = new FormData(form);

    // eslint-disable-next-line no-shadow
    const name = formData.get('name');
    const position = formData.get('position');
    const office = formData.get('office');
    const age = parseInt(formData.get('age'), 10);
    const salary = parseFloat(formData.get('salary')).toFixed(2);

    if (validForm(name, position, office, age, salary)) {
      tbody.appendChild(
        addRow(
          name,
          position,
          office,
          age,
          `$${parseInt(salary).toLocaleString('en-US')}`,
        ),
      );

      showNotification('Employee successfully added.', 'success');
    }
  }

  // eslint-disable-next-line no-shadow
  function validForm(name, position, office, age, salary) {
    let isValid = true;

    if (name.length >= 1 && name.length < 4) {
      showNotification('Name must be at least 4 characters long.', 'error');
      isValid = false;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90.', 'error');
      isValid = false;
    }

    if (!name || !position || !office || !age || !salary) {
      showNotification('All fields are required.', 'error');
      isValid = false;
    }

    return isValid;
  }

  function showNotification(message, type) {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');
    notification.innerHTML = `<span class="title">${type.toUpperCase()}</span> ${message}`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function editFunction(cell) {
    cell.addEventListener('dblclick', () => {
      if (editingCell) {
        saveEdit(editingCell);
      }

      if (editingCell !== cell) {
        startEdit(cell);
        editingCell = cell;
      }
    });
  }

  function startEdit(cell) {
    const originalText = cell.textContent.trim();

    cell.textContent = '';

    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = originalText;

    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => saveEdit(cell));

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        saveEdit(cell);
      } else if (e.key === 'Escape') {
        cancelEdit(cell, originalText);
      }
    });
  }

  function saveEdit(cell) {
    const input = cell.querySelector('input');

    if (input) {
      const newValue = input.value.trim();

      cell.textContent = newValue === '' ? input.defaultValue : newValue;
      editingCell = null;
    }
  }

  function cancelEdit(cell, originalText) {
    cell.textContent = originalText;
    editingCell = null;
  }

  function init() {
    createModal();
    sortRowsOnClick();

    const tableContent = parseTable();

    tbody.innerHTML = '';
    renderTable(tableContent);
  }

  init();
});
