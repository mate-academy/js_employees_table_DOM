'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');

  let currentSortColumn = -1;
  let sortAscending = true;

  // SORTING
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      if (currentSortColumn === index) {
        sortAscending = !sortAscending;
      } else {
        currentSortColumn = index;
        sortAscending = true;
      }

      const rows = Array.from(tbody.querySelectorAll('tr'));

      rows.sort((a, b) => {
        const cellA = a.children[index].innerText.trim();
        const cellB = b.children[index].innerText.trim();

        const numA = parseFloat(cellA.replace(/[$,]/g, ''));
        const numB = parseFloat(cellB.replace(/[$,]/g, ''));

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortAscending ? numA - numB : numB - numA;
        } else {
          return sortAscending
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
        }
      });

      rows.forEach((row) => {
        tbody.appendChild(row);
      });
    });
  });

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }

    tbody.querySelectorAll('tr').forEach((r) => {
      r.classList.remove('active');
    });

    row.classList.add('active');
  });

  const formContainer = document.createElement('div');

  formContainer.innerHTML = `
    <form class='new-employee-form'>
      <label>Name: <input name='name' data-qa='name' type='text'></label>
      <label>Position: <input name='position' data-qa='position' type='text'></label>
      <label>Office:
        <select name='office' data-qa='office'>
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>
      <label>Age: <input name='age' data-qa='age' type='number'></label>
      <label>Salary: <input name='salary' data-qa='salary' type='number'></label>
      <button type='submit'>Save to table</button>
    </form>
  `;

  document.body.appendChild(formContainer);

  // NOTIFICATION FUNCTION
  const showNotification = (message, isError = false) => {
    const notification = document.createElement('div');

    notification.setAttribute('data-qa', 'notification');
    notification.className = isError ? 'error' : 'success';
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  formContainer.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const form = e.target;
    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = Number(form.age.value);
    const salary = Number(form.salary.value);

    if (employeeName.length < 4) {
      showNotification('Name must be at least 4 characters', true);

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', true);

      return;
    }

    if (!position || !office || isNaN(salary)) {
      showNotification('Please fill out all fields correctly', true);

      return;
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString()}</td>
    `;

    tbody.appendChild(row);

    showNotification('Employee added successfully!');
    form.reset();
  });

  let editingCell = null;

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell || editingCell) {
      return;
    }

    editingCell = cell;

    const initialText = cell.textContent;

    cell.innerHTML = `<input class='cell-input' type='text' value='${initialText}'>`;

    const input = cell.querySelector('input');

    input.focus();

    const save = () => {
      const newValue = input.value.trim() || initialText;

      cell.textContent = newValue;
      editingCell = null;
    };

    input.addEventListener('blur', () => {
      save();
    });

    input.addEventListener('keydown', (f) => {
      if (f.key === 'Enter') {
        save();
      }
    });
  });
});
