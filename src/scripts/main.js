document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table tbody');
  const headers = document.querySelectorAll('thead th');
  const sortOrder = {};

  headers.forEach((header, index) => {
    header.addEventListener('click', (headerEvent) => {
      const rows = Array.from(table.rows);
      const isNumber = index === 3 || index === 4;

      sortOrder[index] = !sortOrder[index];

      rows.sort((rowA, rowB) => {
        let cellA = rowA.cells[index].textContent.trim();
        let cellB = rowB.cells[index].textContent.trim();

        if (isNumber) {
          cellA = parseFloat(cellA.replace(/[^0-9.-]+/g, '')) || 0;
          cellB = parseFloat(cellB.replace(/[^0-9.-]+/g, '')) || 0;
        }

        if (sortOrder[index]) {
          if (cellA > cellB) {
            return 1;
          }

          if (cellA < cellB) {
            return -1;
          }
        } else {
          if (cellA < cellB) {
            return 1;
          }

          if (cellA > cellB) {
            return -1;
          }
        }

        return 0;
      });

      table.append(...rows);
    });
  });

  table.addEventListener('click', (clickEvent) => {
    if (clickEvent.target.tagName === 'TD') {
      document
        .querySelectorAll('tbody tr')
        .forEach((row) => row.classList.remove('active'));
      clickEvent.target.parentElement.classList.add('active');
    }
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name='name' type='text' data-qa='name' required></label>
    <label>Position: <input name='position' type='text' data-qa='position' required></label>
    <label>Office: <select name='office' data-qa='office' required>
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select></label>
    <label>Age: <input name='age' type='number' data-qa='age' required></label>
    <label>Salary: <input name='salary' type='number' data-qa='salary' required></label>
    <button type='submit'>Save to table</button>
  `;
  document.body.appendChild(form);

  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();

    const employeeName = form.name.value.trim();
    const position = form.position.value.trim();
    const office = form.office.value;
    const age = parseInt(form.age.value, 10);
    const salary = parseFloat(form.salary.value).toFixed(2);

    if (employeeName.length < 4) {
      return showNotification('Name must be at least 4 characters', 'error');
    }

    if (age < 18 || age > 90) {
      return showNotification('Age must be between 18 and 90', 'error');
    }

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary}</td>
    `;
    table.appendChild(row);
    form.reset();
    showNotification('Employee added successfully!', 'success');
  });

  function showNotification(message, type) {
    const notification = document.createElement('div');

    notification.className = `notification ${type}`;
    notification.setAttribute('data-qa', 'notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  table.addEventListener('dblclick', (dblclickEvent) => {
    if (dblclickEvent.target.tagName === 'TD') {
      const cell = dblclickEvent.target;
      const oldValue = cell.textContent;
      const input = document.createElement('input');

      input.className = 'cell-input';
      input.value = oldValue;
      cell.textContent = '';
      cell.appendChild(input);
      input.focus();

      input.addEventListener('blur', () => {
        cell.textContent = input.value.trim() || oldValue;
      });

      input.addEventListener('keypress', (keypressEvent) => {
        if (keypressEvent.key === 'Enter') {
          cell.textContent = input.value.trim() || oldValue;
        }
      });
    }
  });
});
