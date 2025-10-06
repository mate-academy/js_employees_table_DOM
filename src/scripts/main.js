'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  const colTypes = {
    0: 'string',
    1: 'string',
    2: 'string',
    3: 'number',
    4: 'salary'
  };

  let currentSort = { index: null, dir: 'asc' };
  let editing = null;

  //Helpers
  const parseCellValue = (cell, colIndex) => {
    const text = cell.textContent.trim();
    const type = colTypes[colIndex];
    if (type === 'number') return Number(text);
    if (type === 'salary') return Number(text.replace(/[$,]/g, ''));
    return text.toLowerCase();
  };

  const formatSalary = (value) => {
    const num = Number(value);
    return isNaN(num) ? value : '$' + Math.round(num).toLocaleString('en-US');
  };

  //Notifications
  const showNotification = (title, text, type = 'success') => {
    document.querySelectorAll('[data-qa="notification"]').forEach((n) => n.remove());

    const note = document.createElement('div');
    note.classList.add('notification', type);
    note.setAttribute('data-qa', 'notification');

    const titleEl = document.createElement('span');
    titleEl.classList.add('title');
    titleEl.textContent = title;

    const desc = document.createElement('div');
    desc.textContent = text;

    note.append(titleEl, desc);
    document.body.appendChild(note);

    setTimeout(() => note.remove(), 3000);
  };

  //Sorting
  const sortByColumn = (index, dir) => {
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
      const aVal = parseCellValue(a.cells[index], index);
      const bVal = parseCellValue(b.cells[index], index);

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return aVal - bVal;
      }
      return aVal.localeCompare(bVal);
    });

    if (dir === 'desc') rows.reverse();

    tbody.innerHTML = '';
    rows.forEach((r) => tbody.appendChild(r));
    attachRowListeners();
  };

  thead.addEventListener('click', (e) => {
    const th = e.target.closest('th');
    if (!th) return;
    const index = Array.from(th.parentElement.children).indexOf(th);

    if (currentSort.index === index) {
      currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort = { index, dir: 'asc' };
    }

    sortByColumn(index, currentSort.dir);
  });

  //Inline Edit
  const startEdit = (cell) => {
    // if another edit exists, commit it before starting new one
    if (editing) {
      const existingInput = editing.cell.querySelector('.cell-input');
      if (existingInput) {
        commitEdit(existingInput);
      }
    }

    const old = cell.textContent.trim();
    const input = document.createElement('input');
    input.classList.add('cell-input');
    input.value = old;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    editing = { cell, old };
  };

  const commitEdit = (inputEl) => {
    if (!editing) return;

    const { cell, old } = editing;
    const newVal = inputEl.value.trim();
    const col = Array.from(cell.parentElement.children).indexOf(cell);

    let final = old;

    if (newVal !== '') {
      if (col === 4) {
        const n = Number(newVal.replace(/[$,]/g, ''));
        final = Number.isFinite(n) ? formatSalary(n) : old;
      } else {
        final = newVal;
      }
    }

    cell.textContent = final;
    editing = null;
  };

  const cancelEdit = () => {
    if (!editing) return;
    const { cell, old } = editing;
    cell.textContent = old;
    editing = null;
  };

  //Row Selection
  const attachRowListeners = () => {
    tbody.querySelectorAll('tr').forEach((row) => {
      row.onclick = () => {
        tbody.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
        row.classList.add('active');
      };

      row.querySelectorAll('td').forEach((cell) => {
        cell.ondblclick = () => startEdit(cell);
      });
    });
  };
  attachRowListeners();

  // handle blur / enter / escape globally for inline edits
  document.addEventListener('keydown', (e) => {
    if (editing) {
      const input = document.querySelector('.cell-input');
      if (!input) return;

      if (e.key === 'Enter') commitEdit(input);
      if (e.key === 'Escape') cancelEdit();
    }
  });

  document.addEventListener(
    'blur',
    (e) => {
      if (e.target.classList.contains('cell-input')) {
        commitEdit(e.target);
      }
    },
    true
  );

  //Form
  const form = document.createElement('form');
  form.classList.add('new-employee-form');
  form.innerHTML = `
    <label>Name: <input data-qa="name" name="name" type="text" /></label>
    <label>Position: <input data-qa="position" name="position" type="text" /></label>
    <label>Office:
      <select data-qa="office" name="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input data-qa="age" name="age" type="number" /></label>
    <label>Salary: <input data-qa="salary" name="salary" type="number" /></label>
    <button type="submit">Save to table</button>
  `;

  table.parentNode.insertBefore(form, table.nextSibling);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[data-qa="name"]');
    const positionInput = form.querySelector('[data-qa="position"]');
    const officeInput = form.querySelector('[data-qa="office"]');
    const ageInput = form.querySelector('[data-qa="age"]');
    const salaryInput = form.querySelector('[data-qa="salary"]');

    const nameStr = nameInput.value.trim();
    const positionStr = positionInput.value.trim();
    const officeStr = officeInput.value.trim();
    const ageStr = ageInput.value.trim();
    const salaryStr = salaryInput.value.trim();

    // Explicit empty check for text and numeric fields
    if (
      nameStr === '' ||
      positionStr === '' ||
      officeStr === '' ||
      ageStr === '' ||
      salaryStr === ''
    ) {
      showNotification('Error', 'All fields are required.', 'error');
      return;
    }

    const age = Number(ageStr);
    const salary = Number(salaryStr);

    if (!Number.isFinite(age) || !Number.isFinite(salary)) {
      showNotification('Error', 'Age and salary must be valid numbers.', 'error');
      return;
    }

    if (nameStr.length < 4) {
      showNotification('Error', 'Name must have at least 4 letters.', 'error');
      return;
    }

    if (age < 18 || age > 90) {
      showNotification('Error', 'Age must be between 18 and 90.', 'error');
      return;
    }

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nameStr}</td>
      <td>${positionStr}</td>
      <td>${officeStr}</td>
      <td>${age}</td>
      <td>${formatSalary(salary)}</td>
    `;

    tbody.appendChild(tr);
    attachRowListeners();

    showNotification('Success', `${nameStr} was added successfully.`, 'success');
    form.reset();
  });
});
