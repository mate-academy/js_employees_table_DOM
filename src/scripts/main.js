'use strict';

let lastIndex = -1;
let isAsc = true;

const tbody = document.querySelector('tbody');

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  const curActive = document.querySelector('.active');

  if (curActive) {
    curActive.classList.remove('active');
  }
  row.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.setAttribute('novalidate', '');

form.innerHTML = `<label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>

  <label>Office:
    <select name="office" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>

  <button type="submit">Save to table</button>`;
document.querySelector('table').after(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fullName = form.elements.name.value.trim();
  const position = form.elements.position.value.trim();
  const age = Number(form.elements.age.value);
  const salary = Number(form.elements.salary.value);
  const office = form.elements.office.value;

  if (
    fullName.length < 4 ||
    position.length < 2 ||
    age < 18 ||
    age > 90 ||
    salary <= 0
  ) {
    const notify = document.createElement('div');

    notify.setAttribute('data-qa', 'notification');
    notify.className = 'error';
    notify.textContent = 'Invalid data';
    form.before(notify);

    return;
  }

  const formattedSalary = `$${salary.toLocaleString('en-US')}`;

  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td>${fullName}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${formattedSalary}</td>
  `;

  tbody.append(tr);

  const success = document.createElement('div');

  success.setAttribute('data-qa', 'notification');
  success.className = 'success';
  success.textContent = 'Success!';
  form.before(success);

  form.reset();
});

const thead = document.querySelector('thead');

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th'); // це визначає по якій було клікнуто?

  if (!th) {
    return;
  }

  const index = th.cellIndex;

  if (index === lastIndex) {
    isAsc = !isAsc;
  } else {
    isAsc = true;
    lastIndex = index;
  }

  const rows = Array.from(tbody.rows);

  rows.sort((rowA, rowB) => {
    const a = rowA.cells[index].textContent;
    const b = rowB.cells[index].textContent;

    let result;

    if (index >= 3) {
      const cleanedA = a.replace(/[^0-9.-]+/g, '');
      const cleanedB = b.replace(/[^0-9.-]+/g, '');

      result = Number(cleanedA) - Number(cleanedB);
    } else {
      result = a.localeCompare(b);
    }

    return isAsc ? result : -result;
  });
  tbody.append(...rows);
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td) {
    return;
  }

  if (tbody.querySelector('.cell-input')) {
    return;
  }

  const originalValue = td.textContent;

  td.innerHTML = `<input class="cell-input" value="${originalValue}">`;

  const input = td.querySelector('.cell-input');

  input.focus();

  const save = () => {
    td.textContent = input.value.trim() || originalValue;
  };

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      save();
    }
  });

  input.addEventListener('blur', save);
});
