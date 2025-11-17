'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table');
  const tbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');

  let currentSortedColumn = null;
  let sortDirections = {};

  // ==========================
  // SORTING ASC / DESC
  // ==========================
  headers.forEach((th, index) => {
    sortDirections[index] = 'asc';

    th.addEventListener('click', () => {
      if (currentSortedColumn !== index) {
        sortDirections[index] = 'asc';
        currentSortedColumn = index;
      }

      const direction = sortDirections[index];
      const rows = Array.from(tbody.querySelectorAll('tr'));

      const sorted = rows.sort((a, b) => {
        const A = parseValue(a.children[index].textContent);
        const B = parseValue(b.children[index].textContent);

        if (A < B) return direction === 'asc' ? -1 : 1;
        if (A > B) return direction === 'asc' ? 1 : -1;
        return 0;
      });

      sortDirections[index] = direction === 'asc' ? 'desc' : 'asc';

      tbody.innerHTML = '';
      sorted.forEach(row => tbody.appendChild(row));
    });
  });

  function parseValue(v) {
    v = v.trim();
    if (v.startsWith('$')) return Number(v.replace(/[$,]/g, ''));
    if (!isNaN(v)) return Number(v);
    return v.toLowerCase();
  }

  // ==========================
  // ROW SELECTION
  // ==========================
  tbody.addEventListener('click', e => {
    const row = e.target.closest('tr');
    if (!row) return;

    tbody.querySelectorAll('tr').forEach(r => r.classList.remove('active'));
    row.classList.add('active');
  });

  // ==========================
  // FORM WITH FIXED ATTRIBUTES
  // ==========================
  buildForm();

  function buildForm() {
    const form = document.createElement('form');
    form.className = 'new-employee-form';

    form.innerHTML = `
      <label>
        Name:
        <input data-qa="name" name="name" placeholder="Name">
      </label>

      <label>
        Position:
        <input data-qa="position" name="position" placeholder="Position">
      </label>

      <label>
        Office:
        <select data-qa="office" name="office">
          <option value="">Select office</option>
          <option value="Tokyo">Tokyo</option>
          <option value="London">London</option>
          <option value="Singapore">Singapore</option>
          <option value="New York">New York</option>
          <option value="San Francisco">San Francisco</option>
          <option value="Edinburgh">Edinburgh</option>
        </select>
      </label>

      <label>
        Age:
        <input data-qa="age" type="number" name="age" placeholder="Age">
      </label>

      <label>
        Salary:
        <input data-qa="salary" name="salary" placeholder="$100,000">
      </label>

      <button data-qa="submit" type="submit">Save to table</button>
    `;

    document.body.insertBefore(form, table);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));

      const error = validate(data);
      if (error) {
        showNotification(error, 'error');
        return;
      }

      addEmployee(data);
      form.reset();
      showNotification('Employee added successfully!', 'success');
    });
  }

  // ==========================
  // VALIDATION WITH FIXES
  // ==========================
  function validate(d) {
    if (!d.name || d.name.trim().length < 4) {
      return 'Name must be at least 4 characters long';
    }

    if (!d.position || d.position.trim().length < 2) {
      return 'Position is required';
    }

    if (!d.office) {
      return 'Office must be selected';
    }

    const age = Number(d.age);
    if (isNaN(age) || age < 18 || age > 90) {
      return 'Age must be between 18 and 90';
    }

    if (!d.salary.startsWith('$')) {
      return 'Salary must start with $';
    }

    return null;
  }

  function addEmployee(d) {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${d.name}</td>
      <td>${d.position}</td>
      <td>${d.office}</td>
      <td>${d.age}</td>
      <td>${d.salary}</td>
    `;

    tbody.appendChild(tr);
  }

  // ==========================
  // NOTIFICATION SYSTEM
  // ==========================
  function showNotification(text, type) {
    let notif = document.querySelector('[data-qa="notification"]');

    if (!notif) {
      notif = document.createElement('div');
      notif.dataset.qa = 'notification';
      notif.className = 'notification';
      document.body.appendChild(notif);
    }

    notif.textContent = text;

    notif.classList.remove('success', 'error');
    notif.classList.add(type);

    notif.classList.add('visible');
    setTimeout(() => notif.classList.remove('visible'), 2000);
  }

  // ==========================
  // FIXED OPTIONAL CELL EDITING
  // ==========================
  let activeInput = null;

  tbody.addEventListener('dblclick', e => {
    const cell = e.target.closest('td');
    if (!cell) return;

    if (activeInput) {
      activeInput.blur();
    }

    const oldValue = cell.textContent.trim();
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = oldValue;

    activeInput = input;

    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      cell.textContent = input.value.trim() || oldValue;
      activeInput = null;
    });

    input.addEventListener('keydown', evt => {
      if (evt.key === 'Enter') input.blur();
    });
  });
});
