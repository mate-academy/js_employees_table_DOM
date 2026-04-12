'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('thead th');
  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);

  let sortState = {};

  headers.forEach((th, index) => {
    th.addEventListener('click', () => {
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const asc = sortState[index] !== 'asc';

      rows.sort((a, b) => {
        let valA = a.children[index].innerText.replace(/[$,]/g, '');
        let valB = b.children[index].innerText.replace(/[$,]/g, '');

        if (!isNaN(valA) && !isNaN(valB)) {
          valA = Number(valA);
          valB = Number(valB);
        }

        return asc ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
      });
      tbody.innerHTML = '';
      rows.forEach((r) => tbody.appendChild(r));
      sortState = { [index]: asc ? 'asc' : 'desc' };
    });
  });

  tbody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (row) {
      tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    }
  });

  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
  <label>Name: <input name='name'
 type='text' data-qa='name'></label>
 <label>Position: <input name='position' type='text' data-qa='position'></label>
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
 <label>Age: <input name='age' type='number' data-qa='age'></label>

 <label>Salary: <input name='salary' type='number' data-qa='salary'></label>
 <button type='submit'>Save to table</button>
  `;
  document.body.appendChild(form);

  const showNotification = (msg, type) => {
    notification.textContent = msg;
    notification.className = type;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form));
    const employeeName = data.name.trim();
    const position = data.position.trim();
    const office = data.office;
    const age = Number(data.age);
    const salary = Number(data.salary);

    if (employeeName.length < 4) {
      showNotification('Name must be at least 4 characters long', 'error');

      return;
    }

    if (!position.trim()) {
      showNotification('Position is required', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be between 18 and 90', 'error');

      return;
    }

    if (!office.trim()) {
      showNotification('Office is required', 'error');

      return;
    }

    if (!salary) {
      showNotification('Salary is required', 'error');

      return;
    }

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>$${salary.toLocaleString('en-US')}</td>
    `;
    tbody.appendChild(tr);

    showNotification('Employee added successfully', 'success');
    form.reset();
  });

  tbody.addEventListener('dblclick', (e) => {
    const cell = e.target;

    if (cell.tagName === 'TD' && !cell.querySelector('input')) {
      const oldValue = cell.innerText;
      const input = document.createElement('input');

      input.value = oldValue;
      input.className = 'cell-input';
      cell.innerHTML = '';
      cell.appendChild(input);
      input.focus();

      const save = () => {
        cell.innerText = input.value.trim() || oldValue;
      };

      input.addEventListener('blur', save);

      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          save();
        }
      });
    }
  });
});
