'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  let currentSortColumn = null;
  let currentSortDirection = null;

  thead.addEventListener('click', (e) => {
    if (e.target.tagName !== 'TH') {
      return;
    }

    const th = e.target;
    const index = Array.from(th.parentNode.children).indexOf(th);
    const columnName = th.textContent.trim().toLowerCase();

    if (currentSortColumn === columnName) {
      currentSortDirection = currentSortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      currentSortColumn = columnName;
      currentSortDirection = 'ASC';
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      const result = cellA.localeCompare(cellB, undefined, { numeric: true });

      return currentSortDirection === 'ASC' ? result : -result;
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });

  tbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr');

    if (!tr) {
      return;
    }

    const activeRow = tbody.querySelector('tr.active');

    if (activeRow && activeRow !== tr) {
      activeRow.classList.remove('active');
    }
    tr.classList.add('active');
  });

  const formHtml = `
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
      <button type="submit">Save to table</button>
    </form>
  `;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  function showNotification(type, message) {
    const existing = document.querySelector('[data-qa="notification"]');

    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');

    notification.classList.add('notification', type);
    notification.setAttribute('data-qa', 'notification');

    const h2 = document.createElement('h2');

    h2.classList.add('title');
    h2.textContent = type === 'error' ? 'Error' : 'Success';

    const p = document.createElement('p');

    p.textContent = message;

    notification.append(h2, p);
    document.body.append(notification);

    setTimeout(() => {
      if (document.body.contains(notification)) {
        notification.remove();
      }
    }, 2000);
  }

  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const employeeName = form.elements['name'].value.trim();
    const position = form.elements['position'].value.trim();
    const office = form.elements['office'].value;
    const ageParams = form.elements['age'].value;
    const salaryParams = form.elements['salary'].value;

    if (employeeName.length < 4) {
      showNotification('error', 'Name length should be at least 4');

      return;
    }

    if (!position || !ageParams || !salaryParams) {
      showNotification('error', 'Fields are required');

      return;
    }

    const age = Number(ageParams);
    const salary = Number(salaryParams);

    if (age < 18 || age > 90) {
      showNotification('error', 'Age must be between 18 and 90');

      return;
    }

    const formattedSalary = '$' + salary.toLocaleString('en-US');

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${employeeName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${formattedSalary}</td>
    `;
    tbody.appendChild(tr);

    showNotification('success', 'Employee added successfully');
    form.reset();
  });

  let isEditing = false;

  tbody.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td || isEditing) {
      return;
    }

    if (td.querySelector('.cell-input')) {
      return;
    }

    isEditing = true;

    const originalText = td.textContent.trim();

    td.textContent = '';

    const input = document.createElement('input');

    input.type = 'text';
    input.className = 'cell-input';
    input.value = originalText;

    td.appendChild(input);
    input.focus();

    const handleSave = () => {
      const newValue = input.value.trim();

      td.textContent = newValue || originalText;
      isEditing = false;
    };

    input.addEventListener('blur', handleSave);

    input.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter') {
        input.removeEventListener('blur', handleSave);
        handleSave();
      }
    });
  });
});
