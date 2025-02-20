'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  let currentSortColumn = null;
  let currentSortOrder = 'asc';

  function getCellValue(row, columnIndex) {
    return row.children[columnIndex].innerText.trim();
  }

  function sortTableByColumn(columnIndex) {
    const rows = Array.from(tbody.rows);
    const compareRows = (rowA, rowB) => {
      const cellA = getCellValue(rowA, columnIndex);
      const cellB = getCellValue(rowB, columnIndex);

      if (['3', '4'].includes(columnIndex.toString())) {
        return currentSortOrder === 'asc' ? cellA - cellB : cellB - cellA;
      } else {
        return currentSortOrder === 'asc'
          ? cellA.localeCompare(cellB)
          : cellB.localeCompare(cellA);
      }
    };

    rows.sort(compareRows);
    rows.forEach((row) => tbody.appendChild(row));

    updateHeaderClasses(columnIndex);
  }

  function updateHeaderClasses(columnIndex) {
    Array.from(table.querySelectorAll('th')).forEach((th, index) => {
      th.classList.remove('asc', 'desc');

      if (index === columnIndex) {
        th.classList.add(currentSortOrder);
      }
    });
  }

  table.querySelectorAll('th').forEach((header, index) => {
    header.addEventListener('click', () => {
      if (currentSortColumn === index) {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        currentSortOrder = 'asc';
      }
      currentSortColumn = index;
      sortTableByColumn(index);
    });
  });

  tbody.addEventListener('click', function(e) {
    if (e.target.tagName === 'TD') {
      const selectedRow = e.target.parentElement;

      Array.from(tbody.querySelectorAll('tr')).forEach((row) => {
        row.classList.remove('active');
      });
      selectedRow.classList.add('active');
    }
  });

  const formWrapper = document.createElement('div');

  formWrapper.innerHTML = `
    <form class="new-employee-form">
      <label>Name: <input name="name" type="text" data-qa="name" required></label>
      <label>Position: <input name="position" type="text" data-qa="position" required></label>
      <label>Office:
        <select name="office" data-qa="office" required>
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>
      <label>Age: <input name="age" type="number" data-qa="age" required></label>
      <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
      <button type="submit">Save to table</button>
    </form>
  `;
  document.body.appendChild(formWrapper);

  function showNotification(message, success = true) {
    const notification = document.createElement('div');

    notification.className = `notification ${success ? 'success' : 'error'}`;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
  }

  formWrapper.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = Number(form.age.value);
    const salary = Number(form.salary.value);
    const salaryFormatted = `$${salary.toLocaleString()}`;

    if (employeeName.length < 4) {
      showNotification('Name must have at least 4 characters', false);

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', false);

      return;
    }

    const newRow = tbody.insertRow();

    newRow.innerHTML = `<td>${employeeName}</td><td>${position}</td><td>${office}</td><td>${age}</td><td>${salaryFormatted}</td>`;

    showNotification('Employee added successfully', true);

    form.reset();
  });

  tbody.addEventListener('dblclick', function(e) {
    if (e.target.tagName === 'TD') {
      const cell = e.target;
      const originalValue = cell.textContent.trim();
      const input = document.createElement('input');

      input.type = 'text';
      input.className = 'cell-input';
      input.value = originalValue;
      cell.innerHTML = '';
      cell.appendChild(input);
      input.focus();

      const saveChanges = () => {
        // If input is empty, revert to original value
        cell.textContent = input.value.trim() || originalValue;
        input.remove();
      };

      input.addEventListener('blur', saveChanges);

      input.addEventListener('keypress', function(evt) {
        if (evt.key === 'Enter') {
          saveChanges();
        }
      });
    }
  });
});
