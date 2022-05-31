'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const table = document.querySelector('table');

const rows = [...tbody.rows];

const count = {};
let direction = 'asc';
let text = '';

for (const i of [...thead.children[0].children]) {
  count[i.cellIndex] = 0;
}

function sortTable(n) {
  rows.sort((a, b) => {
    let x = a.children[n].innerHTML;
    let y = b.children[n].innerHTML;

    if (n === 4) {
      x = +x.split(',').join('').slice(1);
      y = +y.split(',').join('').slice(1);

      return direction === 'asc' ? x - y : y - x;
    }

    return direction === 'asc' ? x.localeCompare(y) : y.localeCompare(x);
  });

  tbody.append(...rows);
  count[n]++;
}

thead.addEventListener('click', (ev) => {
  const target = ev.target.cellIndex;

  if (count[target] % 2 !== 0) {
    direction = 'desc';
  } else {
    direction = 'asc';
  }

  sortTable(target);
});

table.addEventListener('click', (ev) => {
  const target = ev.target.closest('tr');
  const index = [...table.rows].findIndex(el =>
    el.classList.contains('active'));

  if (index !== -1) {
    [...table.rows][index].classList.remove('active');
  }

  target.classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

document.body.append(form);

form.insertAdjacentHTML('beforeend', `
  <label>
    Name:
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>
    Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>
    Office:
    <select name="office" data-qa="office" required>
      <option value ="Tokyo">Tokyo</option>
      <option value ="Singapore">Singapore</option>
      <option value ="London">London</option>
      <option value ="New York">New York</option>
      <option value ="Edinburgh">Edinburgh</option>
      <option value ="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input name="age" type="number" data-qa="age" required>
  </label>
  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
`);

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = new FormData(form);
  const entries = Object.fromEntries(data.entries());
  const values = Object.values(entries);
  const newRow = tbody.insertRow();
  const newFormat = new Intl.NumberFormat('en-US');

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  if (entries.name.length < 4 || entries.age < 18 || entries.age > 90) {
    notification.classList.add('error');
    notificationTitle.innerHTML = 'Error!';
    notificationText.innerHTML = 'Please, check your name and age';
    document.body.append(notification);
    notification.append(notificationTitle, notificationText);
    setTimeout(() => notification.remove(), 2000);

    return;
  }

  for (let i = 0; i < table.rows[0].children.length; i++) {
    if (i === 4) {
      newRow.insertCell().innerHTML = `$${newFormat.format(values[i])}`;
    } else {
      newRow.insertCell().innerHTML = values[i];
    }
  }

  notification.classList.add('success');
  notificationTitle.innerHTML = 'Success!';
  notificationText.innerHTML = 'An employee was added.';
  document.body.append(notification);
  notification.append(notificationTitle, notificationText);
  setTimeout(() => notification.remove(), 2000);

  form.reset();
});

table.addEventListener('dblclick', (browserEvent) => {
  browserEvent.preventDefault();

  const target = browserEvent.target.closest('td');

  text = target.innerText;

  target.innerText = '';

  const input = document.createElement('input');

  input.className = 'cell-input';
  target.append(input);

  if (target.cellIndex === 3 || target.cellIndex === 4) {
    input.type = 'number';
  }
});

table.addEventListener('keydown', (ev) => {
  const target = ev.target;
  const cell = ev.target.closest('td');

  if (ev.code !== 'Enter') {
    return;
  }

  if (target.value.length === 0) {
    cell.innerHTML = text;
  } else {
    cell.innerHTML = target.value;
  }

  cell.innerHTML = target.value;
});

table.addEventListener('blur', (browserEvent) => {
  const target = browserEvent.target;
  const cell = browserEvent.target.closest('td');

  if (target.value.length === 0) {
    cell.innerHTML = text;
  } else {
    cell.innerHTML = target.value;
  }
}, true);
