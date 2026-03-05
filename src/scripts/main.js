'use strict';

// write code here
const pushNotification = (posTop, posRight, title, description, type) => {
  // write code here
  const div = document.createElement('div');

  div.setAttribute('data-qa', 'notification');

  div.className = `notification ${type}`;
  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';

  const h2 = document.createElement('h2');

  h2.className = 'title';
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;

  div.append(h2, p);

  document.body.append(div);

  setTimeout(() => {
    div.style.display = 'none';
  }, 2000);
};

const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = table.querySelector('tbody');
let currentColumn = null;
let sortDirection = 'asc';

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const columnIndex = th.cellIndex;
  const rows = Array.from(tbody.rows);

  if (columnIndex === currentColumn) {
    sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    sortDirection = 'asc';
    currentColumn = columnIndex;
  }

  const direction = sortDirection === 'desc' ? -1 : 1;

  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].innerText.replace(/[$,]/g, '');
    const bText = b.cells[columnIndex].innerText.replace(/[$,]/g, '');

    if (isNaN(aText)) {
      return aText.localeCompare(bText) * direction;
    } else {
      return (Number(aText) - Number(bText)) * direction;
    }
  });

  tbody.append(...rows);
});

tbody.addEventListener('click', (e) => {
  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  const row = e.target.closest('tr');

  row.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.innerHTML = `
<label>Name: <input name="name" type="text" data-qa="name" required></label>
<label>Position: <input name="position" type="text" data-qa="position" required></label>
<label>Age: <input name="age" type="number" data-qa="age" required></label>
<label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
<label >Office:
<select name="office" data-qa="office" required>
<option>Tokyo</option>
<option>Singapore</option>
<option>London</option>
<option>New York</option>
<option>Edinburgh</option>
<option>San Francisco</option>
</select>
</label>
<button type="button">Save to table</button>
`;

document.body.append(form);

const button = form.querySelector('button');

button.addEventListener('click', (e) => {
  const employeeName = form.querySelector('[name="name"]').value;
  const position = form.querySelector('[name="position"]').value;
  const age = form.querySelector('[name="age"]').value;
  const salary = form.querySelector('[name="salary"]').value;
  const office = form.querySelector('[name="office"]').value;

  if (!employeeName || !position || !age || !salary || !office) {
    pushNotification(10, 10, 'Error!', 'All fields are required', 'error');

    return;
  }

  if (employeeName.length < 4) {
    pushNotification(10, 10, 'Error!', 'Name is too short', 'error');

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(10, 10, 'Error!', 'Age is incorrect', 'error');

    return;
  }

  const tr = document.createElement('tr');

  tr.innerHTML = `
  <td>${employeeName}</td>
  <td>${position}</td>
  <td>${office}</td>
  <td>${age}</td>
  <td>$${Number(salary).toLocaleString('en-US')}</td>
  `;

  tbody.append(tr);
  form.reset();

  pushNotification(
    10,
    10,
    'Success',
    'Worker was added into the table',
    'success',
  );
});

tbody.addEventListener('dblclick', (e) => {
  if (tbody.querySelector('.cell-input')) {
    return;
  }

  const td = e.target.closest('td');
  const originalText = td.innerText;

  td.innerText = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  input.value = originalText;

  td.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    td.innerText = input.value || originalText;
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      td.innerText = input.value || originalText;
    }
  });
});
