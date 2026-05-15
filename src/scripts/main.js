'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  const n = th.cellIndex;

  if (th.dataset.order === undefined) {
    th.dataset.order = 'asc';
  }

  const order = th.dataset.order;

  th.dataset.order = order === 'asc' ? 'desc' : 'asc';

  const array = [...tbody.querySelectorAll('tr')];

  array.sort((a, b) => sortPredicate(a, b, n, order));

  tbody.append(...array);
});

function parseNumber(number) {
  return +number.replace(/\D/g, '');
}

function sortPredicate(a, b, n, order) {
  if (n > 1) {
    return order === 'asc'
      ? parseNumber(a.cells[n].textContent) -
          parseNumber(b.cells[n].textContent)
      : parseNumber(b.cells[n].textContent) -
          parseNumber(a.cells[n].textContent);
  }

  return order === 'asc'
    ? a.cells[n].textContent.localeCompare(b.cells[n].textContent)
    : b.cells[n].textContent.localeCompare(a.cells[n].textContent);
}

tbody.addEventListener('click', (e) => {
  tbody.querySelectorAll('tr').forEach((row) => row.classList.remove('active'));

  const tr = e.target.closest('tr');

  tr.classList.add('active');
});

tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');
  const previousText = td.textContent;
  const input = document.createElement('input');

  input.value = previousText;
  td.textContent = '';

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      td.textContent = input.value;
    }
  });

  td.append(input);
});

document.body.insertAdjacentHTML(
  'beforeend',
  `<form class="new-employee-form">
      New employee
      <label>
        Name:
        <input
          name="name"
          type="text"
          data-qa="name"
        />
      </label>
      <span data-qa="notification" id="name-error"></span>

      <label>
        Position:
        <input
          name="position"
          type="text"
          data-qa="position"
        />
      </label>
      <span data-qa="notification" id="position-error"></span>

      <label>
        <select
          name="office"
          data-qa="office"
        >
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>
      <span data-qa="notification" id="office-error"></span>

      <label>
        Age:
        <input
          name="age"
          type="number"
          data-qa="age"
        />
      </label>
      <span data-qa="notification" id="age-error"></span>

      <label>
        Salary:
        <input
          name="salary"
          type="number"
          data-qa="salary"
        />
      </label>
      <span data-qa="notification" id="salary-error"></span>
      <span data-qa="notification" id="success"></span>


      <button>Save to table</button>
    </form>`,
);

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const nameVar = data.get('name');
  const position = data.get('position');
  const office = data.get('office');
  const age = Number(data.get('age'));
  const salaryRaw = data.get('salary');

  if (nameVar.length < 4) {
    showNotify('Name is too short', 'error', 'name-error');

    return;
  }

  if (position.length < 4) {
    showNotify('Position is too short or required', 'error', 'position-error');

    return;
  }

  if (age < 18 || age > 90) {
    showNotify('Age must be between 18 and 90', 'error', 'age-error');

    return;
  }

  if (salaryRaw === '') {
    showNotify('Salary is required', 'error', 'salary-error');

    return;
  }

  const formattedSalary = '$' + Number(salaryRaw).toLocaleString('en-US');

  addEmployee(nameVar, position, office, age, formattedSalary);

  showNotify('Salary is required', 'success', 'success');
});

function addEmployee(nameVar, position, office, age, salary) {
  const array = [nameVar, position, office, age, salary];

  const row = document.createElement('tr');

  for (const value of array) {
    const td = document.createElement('td');

    td.textContent = value;

    row.append(td);
  }

  tbody.append(row);
}

function showNotify(text, type, spanId) {
  if (!spanId) {
    alert(`[${type.toUpperCase()}] ${text}`);

    return;
  }

  const span = document.getElementById(`${spanId}`);

  span.classList.add(`notification`, `${type}`);
  span.textContent = text;

  setTimeout(() => {
    span.textContent = '';
    span.classList.remove(`notification`, `${type}`);
  }, 3000);
}
