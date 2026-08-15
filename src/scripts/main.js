'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');

  function createForm() {
    const formContainer = document.createElement('div');

    formContainer.innerHTML = `
        <form class="new-employee-form">
          <h3>New employee</h3>
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
            <button type="submit">Save to table</button>
        </form>
    `;

    table.insertAdjacentElement('afterend', formContainer.firstElementChild);
  }

  createForm();

  const form = document.querySelector('.new-employee-form');

  function showNotification(message, type) {
    let notification = document.querySelector('[data-qa="notification"]');

    if (!notification) {
      notification = document.createElement('div');
      notification.setAttribute('data-qa', 'notification');
      document.body.appendChild(notification);
    }

    notification.className = `notification ${type}`;
    notification.textContent = message;

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const employeeName = formData.get('name').trim();
    const position = formData.get('position').trim();
    const office = formData.get('office').trim();
    const age = parseInt(formData.get('age'), 10);
    const salary = formData.get('salary').trim();

    if (!employeeName || !position || !office || isNaN(age) || !salary) {
      showNotification('Please fill in all fields correctly.', 'error');

      return;
    }

    if (employeeName.length < 4) {
      showNotification('Name must be at least 4 characters long.', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90.', 'error');

      return;
    }

    const formattedSalary = `$${Number(salary).toLocaleString('en-US')}`;

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${employeeName}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${formattedSalary}</td>
    `;

    tbody.appendChild(newRow);
    showNotification('Employee added successfully!', 'success');
    form.reset();
  });

  tbody.addEventListener('click', (e) => {
    const clickedRow = e.target.closest('tr');

    if (!clickedRow) {
      return;
    }

    const activeRow = tbody.querySelector('tr.active');

    if (activeRow && activeRow !== clickedRow) {
      activeRow.classList.remove('active');
    }

    clickedRow.classList.toggle('active');
  });

  let currentSortColumn = -1;
  let isAsc = true;

  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (currentSortColumn === index) {
        isAsc = !isAsc;
      } else {
        currentSortColumn = index;
        isAsc = true;
      }

      rows.sort((a, b) => {
        const cellA = a.children[index].textContent.trim();
        const cellB = b.children[index].textContent.trim();

        const parseContent = (val) => {
          const num = val.replace(/[^0-9.-]+/g, '');

          return isNaN(num) || num === '' ? val : parseFloat(num);
        };

        const valA = parseContent(cellA);
        const valB = parseContent(cellB);

        if (valA < valB) {
          return isAsc ? -1 : 1;
        }

        if (valA > valB) {
          return isAsc ? 1 : -1;
        }

        return 0;
      });

      tbody.append(...rows);
    });
  });

  tbody.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td || td.querySelector('.cell-input')) {
      return;
    }

    const originalText = td.textContent.trim();

    td.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = originalText;

    td.appendChild(input);

    input.focus();

    const saveChanges = () => {
      const newValue = input.value.trim();

      td.textContent = newValue === '' ? originalText : newValue;
    };

    input.addEventListener('blur', saveChanges);

    input.addEventListener('keydown', (keywordEvent) => {
      if (keywordEvent.key === 'Enter') {
        input.blur();
      }
    });
  });
});
