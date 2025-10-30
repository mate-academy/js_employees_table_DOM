'use strict';

const thead = document.querySelector('thead');
let tbody = document.querySelector('tbody');

let sortState = { key: null, dir: 'asc' };

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const headers = Array.from(thead.querySelectorAll('th'));
  const key = th.textContent.trim().toLowerCase();
  const colIndex = headers.indexOf(th);

  const dir = sortState.key === key && sortState.dir === 'asc' ? 'desc' : 'asc';

  sortState = { key, dir };

  const rows = Array.from(tbody.querySelectorAll('tr'));

  rows.sort((a, b) => {
    const aText = a.children[colIndex].textContent.trim();
    const bText = b.children[colIndex].textContent.trim();

    if (key === 'age' || key === 'salary') {
      const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
      const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));

      return dir === 'asc' ? aNum - bNum : bNum - aNum;
    }

    return dir === 'asc'
      ? aText.localeCompare(bText)
      : bText.localeCompare(aText);
  });

  const newBody = document.createElement('tbody');

  rows.forEach((r) => newBody.appendChild(r));
  tbody.replaceWith(newBody);
  tbody = newBody;

  tbody.addEventListener('click', onRowClick);
  tbody.addEventListener('dblclick', onCellDblClick);
});

function onRowClick(e) {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((row) => {
    row.classList.remove('active');
  });

  tr.classList.add('active');
}
tbody.addEventListener('click', onRowClick);

function showNotification(type, message) {
  const existing = document.querySelector('[data-qa="notification"]');

  if (existing) {
    existing.remove();
  }

  const note = document.createElement('div');

  note.dataset.qa = 'notification';
  note.className = type === 'error' ? 'error' : 'success';
  note.textContent = message;

  document.body.append(note);

  if (type === 'success') {
    setTimeout(() => {
      if (note.parentNode) {
        note.remove();
      }
    }, 2000);
  }
}

function createForm() {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  form.innerHTML = `
    <h3>New employee</h3>
    <label>Name: <input type="text" data-qa="name" required></label>
    <label>Position: <input type="text" data-qa="position" required></label>
    <label>Office:
      <select data-qa="office" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age: <input type="number" data-qa="age" required></label>
    <label>Salary: <input type="number" data-qa="salary" required></label>
    <button type="submit">Save to table</button>
  `;
  document.body.append(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const empName = form.querySelector('[data-qa="name"]').value.trim();
    const empPosition = form.querySelector('[data-qa="position"]').value.trim();
    const empOffice = form.querySelector('[data-qa="office"]').value.trim();
    const empAge = Number(form.querySelector('[data-qa="age"]').value);
    const empSalary = Number(form.querySelector('[data-qa="salary"]').value);

    if (empPosition === '') {
      showNotification('error', 'Position field is required.');

      return;
    }

    if (!empName || !empOffice || !empAge || !empSalary) {
      showNotification('error', 'Please fill in all fields.');

      return;
    }

    if (empName.length < 4) {
      showNotification('error', 'Name must have at least 4 letters.');

      return;
    }

    if (empPosition.length < 2) {
      showNotification('error', 'Position must have at least 2 letters.');

      return;
    }

    if (empAge < 18 || empAge > 90) {
      showNotification('error', 'Age must be between 18 and 90.');

      return;
    }

    addEmployee({
      empName,
      position: empPosition,
      office: empOffice,
      age: empAge,
      salary: empSalary,
    });

    showNotification('success', 'Employee added successfully.');
    form.reset();
  });
}

function addEmployee({ empName, position, office, age, salary }) {
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${empName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>$${salary.toLocaleString('en-US')}</td>
  `;
  tbody.append(tr);
}

let editing = null;

function onCellDblClick(e) {
  const td = e.target.closest('td');

  if (!td || editing) {
    return;
  }

  const oldText = td.textContent.trim();

  td.textContent = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = oldText;
  td.append(input);
  input.focus();

  editing = { td, oldText };

  input.addEventListener('blur', () => finishEdit());

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      finishEdit(true);
    }

    if (ev.key === 'Escape') {
      finishEdit(false);
    }
  });
}

function finishEdit(commit = true) {
  if (!editing) {
    return;
  }

  const { td, oldText } = editing;
  const input = td.querySelector('input');
  const newText = commit && input.value.trim() ? input.value.trim() : oldText;

  td.textContent = newText;
  editing = null;
}

tbody.addEventListener('dblclick', onCellDblClick);

createForm();
