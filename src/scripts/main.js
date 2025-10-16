'use strict';

// write code here
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');
  let sortDirection = 1;
  let activeColumn = null;

  // ======= SORTING =======
  headers.forEach((th, index) => {
    th.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (activeColumn === index) {
        sortDirection *= -1;
      } else {
        sortDirection = 1;
        activeColumn = index;
      }

      rows.sort((a, b) => {
        const aText = a.children[index].innerText.trim();
        const bText = b.children[index].innerText.trim();

        const aNum = parseFloat(aText.replace(/[^0-9.]/g, ''));
        const bNum = parseFloat(bText.replace(/[^0-9.]/g, ''));

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return (aNum - bNum) * sortDirection;
        }

        return aText.localeCompare(bText) * sortDirection;
      });

      tbody.innerHTML = '';
      rows.forEach((r) => tbody.appendChild(r));
    });
  });

  // ======= ROW SELECTION =======
  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row) {
      return;
    }
    tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });

  // ======= FORM CREATION =======
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <label>Name: <input name='name' type='text' data-qa='name' required></label>
    <label>Position: <input name='position' type='text' data-qa='position' required></label>
    <label>Office:
      <select name='office' data-qa='office' required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input name='age' type='number' data-qa='age' required></label>
    <label>Salary: <input name='salary' type='number' data-qa='salary' required></label>
    <button type='submit'>Save to table</button>
  `;
  document.body.appendChild(form);

  // ======= NOTIFICATION =======
  function showNotification(type, title, message) {
    const existing = document.querySelector('[data-qa="notification"]');

    if (existing) {
      existing.remove();
    }

    const notif = document.createElement('div');

    notif.className = `notification ${type}`;
    notif.dataset.qa = 'notification';
    notif.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
    document.body.appendChild(notif);

    setTimeout(() => notif.remove(), 3000);
  }

  // ======= FORM SUBMIT =======
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const empName = data.name;
    const empPosition = data.position;
    const empOffice = data.office;
    const empAge = parseInt(data.age);
    const empSalary = parseInt(data.salary);

    // ✅ Count only alphabetic letters for name validation
    const letters = (empName.match(/[A-Za-z]/g) || []).length;

    if (letters < 4) {
      showNotification(
        'error',
        'Invalid Name',
        'Name must contain at least 4 letters.',
      );

      return;
    }

    if (empAge < 18 || empAge > 90) {
      showNotification(
        'error',
        'Invalid Age',
        'Age must be between 18 and 90.',
      );

      return;
    }

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${empName.trim()}</td>
      <td>${empPosition.trim()}</td>
      <td>${empOffice}</td>
      <td>${empAge}</td>
      <td>$${empSalary.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
    form.reset();

    showNotification(
      'success',
      'Employee added',
      'New employee was added successfully!',
    );
  });

  // ======= OPTIONAL: CELL EDITING =======
  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target.closest('td');

    if (!cell) {
      return;
    }

    // ✅ Allow only one editable cell at a time
    const existingInput = document.querySelector('.cell-input');

    if (existingInput) {
      const parentCell = existingInput.closest('td');

      parentCell.innerText =
        existingInput.value.trim() || existingInput.dataset.original;
      existingInput.remove();
    }

    if (cell.querySelector('input')) {
      return;
    }

    const original = cell.innerText;
    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.dataset.original = original;
    input.value = original;
    cell.innerText = '';
    cell.appendChild(input);
    input.focus();

    const save = () => {
      const newValue = input.value.trim();

      cell.innerText = newValue || original;
    };

    input.addEventListener('blur', save);

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        save();
      }
    });
  });
});
