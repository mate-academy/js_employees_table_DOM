'use strict';

const table = document.querySelector('table');
const headers = [...table.querySelectorAll('th')];
const tableBody = document.querySelector('tbody');
const form = document.createElement('form');

form.className = 'new-employee-form';

form.innerHTML = `
      <label>
        Name:
        <input
          type="text"
          name="name"
          data-qa="name"
          required
          >
      </label>

      <label>
        Position:
        <input
          type="text"
          name="position"
          data-qa="position"
          required
          >
      </label>

      <label>
        Office:
        <select
          name="office"
          data-qa="office"
          required
        >
          <option value="Tokyo">Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
      </label>

      <label>
        Age:
        <input
          type="number"
          name="age"
          data-qa="age"
          required
          >
      </label>

      <label>
        Salary:
        <input
          type="number"
          name="salary"
          data-qa="salary"
          required
          min="0"
          >
      </label>
      <button type="submit">Save to table</button>`;

table.after(form);

const notification = document.createElement('div');

notification.className = 'notification';
notification.dataset.qa = 'notification';
notification.style.display = 'none';

notification.innerHTML = `
  <p class="title">Notification</p>
  <p class="description"></p>
`;

const description = notification.querySelector('.description');
let editing = null;

document.body.append(notification);

headers.forEach((th) => {
  th.addEventListener('click', (e) => {
    const target = e.currentTarget;
    const index = headers.indexOf(target);
    const rows = [...tableBody.rows];

    headers.forEach((h) => {
      if (h !== th) {
        h.classList.remove('asc', 'desc');
      }
    });

    const asc = th.classList.toggle('asc');

    th.classList.toggle('desc', !asc);

    const dir = asc ? 1 : -1;

    rows.sort((a, b) => {
      const td1 = a.cells[index].textContent.trim();
      const td2 = b.cells[index].textContent.trim();

      const n1 = parseFloat(td1.replace(/[^\d.-]/g, ''));
      const n2 = parseFloat(td2.replace(/[^\d.-]/g, ''));

      if (!isNaN(n1) && !isNaN(n2)) {
        return (n1 - n2) * dir;
      }

      return td1.localeCompare(td2, undefined, { numeric: true }) * dir;
    });

    tableBody.append(...rows);
  });
});

tableBody.addEventListener('click', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  const row = cell.closest('tr');

  if (!row) {
    return;
  }

  tableBody.querySelectorAll('tr.active').forEach((r) => {
    r.classList.remove('active');
  });

  row.classList.add('active');
});

tableBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  if (editing) {
    finishEdit(true);
  }

  const prev = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.type = 'text';
  input.className = 'cell-input';
  input.value = prev;

  cell.append(input);
  input.focus();

  editing = { cell, input, prev };

  input.addEventListener('blur', () => finishEdit(false), { once: true });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      finishEdit(false);
    }

    if (ev.key === 'Escape') {
      finishEdit(true);
    }
  });
});

function finishEdit(prevEl) {
  const { cell, input, prev } = editing;
  const next = input.value.trim();

  // eslint-disable-next-line prettier/prettier
  cell.textContent = prevEl ? prev : (next === '' ? prev : next);
  editing = null;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  if (!validate(formData)) {
    return;
  }

  const row = document.createElement('tr');

  for (const [key, value] of formData.entries()) {
    const cell = document.createElement('td');

    if (key === 'salary') {
      const formated = '$' + Number(value).toLocaleString('en-US');

      cell.textContent = formated;
    } else {
      cell.textContent = value;
    }

    row.append(cell);
  }

  tableBody.append(row);
  form.reset();
  showNotification('success', 'Employee added to the table');
});

function validate(formData) {
  const formName = (formData.get('name') ?? '').trim();
  const age = Number(formData.get('age'));

  if (formName.length < 4) {
    showNotification('error', 'Name must be at least 4 letters');

    return false;
  }

  if (!Number.isFinite(age) || age < 18 || age > 90) {
    showNotification('error', 'Age must be more than 18 and less than 90');

    return false;
  }

  return true;
}

function showNotification(type, text) {
  notification.classList.remove('success', 'error');
  notification.classList.add(type);
  notification.style.display = 'block';

  description.textContent = text;

  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}
