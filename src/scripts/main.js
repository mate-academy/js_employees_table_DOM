'use strict';

function initTableSort() {
  const table = document.querySelector('table');

  if (!table) {
    return;
  }

  table.addEventListener('click', (e) => {
    const row = e.target.closest('tr');

    if (!row || row.parentElement.tagName !== 'TBODY') {
      return;
    }

    const selectedRow = table.querySelector('.active');

    if (selectedRow) {
      selectedRow.classList.remove('active');
    }

    row.classList.add('active');
  });

  const tHead = table.querySelectorAll('th');

  tHead.forEach((header) => {
    header.addEventListener('click', () => {
      tHead.forEach((h) => {
        if (h !== header) {
          h.classList.remove('asc');
        }
      });

      const isAsc = !header.classList.contains('asc');

      if (isAsc) {
        header.classList.add('asc');
      } else {
        header.classList.remove('asc');
      }

      sortTable(table, header.cellIndex, isAsc);
    });
  });
}

function sortTable(table, columnIndex, isAsc) {
  const tBody = table.tBodies[0];

  if (!tBody) {
    return;
  }

  const rows = Array.from(tBody.querySelectorAll('tr'));

  const sortedRows = rows.sort((a, b) => {
    const cellA = a.children[columnIndex].textContent.trim();
    const cellB = b.children[columnIndex].textContent.trim();

    const result = cellA.localeCompare(cellB, undefined, { numeric: true });

    return isAsc ? result : -result;
  });

  tBody.append(...sortedRows);
}

function showNotification(description, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  const p = document.createElement('p');

  p.textContent = description;

  notification.append(p);
  document.body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function initForm() {
  const table = document.querySelector('table');

  const formHtml = `<form class="new-employee-form">
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
    </form>`;

  document.body.insertAdjacentHTML('beforeend', formHtml);

  const form = document.querySelector('.new-employee-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const nameEmployee = formData.get('name').trim();
    const position = formData.get('position').trim();
    const office = formData.get('office');
    const ageStr = formData.get('age').trim();
    const salaryStr = formData.get('salary').trim();

    if (!nameEmployee || !position || !office || !ageStr || !salaryStr) {
      showNotification('All fields are required', 'error');

      return;
    }

    const age = Number(ageStr);
    const salary = Number(salaryStr);

    const formattedSalary = '$' + salary.toLocaleString('en-US');

    if (isNaN(age) || isNaN(salary)) {
      showNotification('Age and Salary must be numbers', 'error');

      return;
    }

    if (nameEmployee.length < 4) {
      showNotification('Name must be at least 4 characters', 'error');

      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Age must be beetwen 18 and 90', 'error');

      return;
    }

    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td>${nameEmployee}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>`;

    table.tBodies[0].appendChild(newRow);
    showNotification('Employee added successfully', 'success');

    form.reset();
  });
}

function initCellEditing() {
  const table = document.querySelector('table');

  let isEditing = null;

  table.addEventListener('dblclick', (e) => {
    const td = e.target.closest('td');

    if (!td || isEditing) {
      return;
    }

    isEditing = td;

    const initialValue = td.textContent;

    td.textContent = '';

    const input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = initialValue;

    td.append(input);

    input.focus();

    function save() {
      const newValue = input.value.trim() || initialValue;

      td.textContent = newValue;
      isEditing = null;
    }

    input.addEventListener('blur', save);

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === 'Escape') {
        save();
      }
    });
  });
}

initTableSort();
initForm();
initCellEditing();
