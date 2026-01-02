'use strict';

const tbody = document.querySelector('tbody');
let nextId = 1;

tbody.querySelectorAll('tr').forEach((tr) => {
  if (!tr.dataset.id) {
    tr.dataset.id = String(nextId++);
  }
});

let activeRow = null;

// selecting logic
tbody.addEventListener('click', (e) => {
  if (e.target.closest('button, a')) {
    return;
  }

  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (row === activeRow) {
    activeRow.classList.remove('active');
    activeRow = null;

    return;
  }

  if (activeRow && activeRow !== row) {
    activeRow.classList.remove('active');
  }

  row.classList.add('active');
  activeRow = row;
});

// sorting logic
const thead = document.querySelector('thead');
const sortState = { key: null, dir: 'asc' };
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

thead.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const thKey = th.dataset.key;

  if (!thKey) {
    return;
  }

  if (thKey === sortState.key) {
    sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = thKey;
    sortState.dir = 'asc';
  }

  const rows = getDataFromDom();

  const sorted = rows
    .slice()
    .sort((a, b) => compare(a, b, sortState.key, sortState.dir));

  renderTableFromData(sorted);
});

function compare(a, b, key, dir = 'asc') {
  const va = a[key];
  const vb = b[key];
  const aNum = Number(va);
  const bNum = Number(vb);
  let result;

  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    result = aNum - bNum;
  } else {
    result = String(va).localeCompare(String(vb), undefined, { numeric: true });
  }

  return dir === 'asc' ? result : -result;
}

function getDataFromDom() {
  const rows = [];
  const trList = tbody.querySelectorAll('tr');

  trList.forEach((tr) => {
    const tds = tr.querySelectorAll('td');

    if (tds.length >= 5) {
      const fullName = tds[0].textContent.trim();
      const position = tds[1].textContent.trim();
      const office = tds[2].textContent.trim();
      const age = tds[3].textContent.trim();
      const cleanedAge = age.replace(/[^\d.-]/g, '');
      const salary = tds[4].textContent.trim();
      const cleanedSalary = salary.replace(/[^\d.-]/g, '');

      rows.push({
        id: tr.dataset.id,
        fullName,
        position,
        office,
        age: Number(cleanedAge),
        salary: Number(cleanedSalary),
      });
    }
  });

  return rows;
}

function renderTableFromData(data) {
  const activeRowId = activeRow?.dataset?.id;

  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  data.forEach((item) => {
    const tr = document.createElement('tr');

    const id = item.id != null ? String(item.id) : String(nextId++);

    tr.dataset.id = id;

    if (item.id == null) {
      item.id = id;
    }

    const tdName = document.createElement('td');

    tdName.textContent = item.fullName;

    tr.appendChild(tdName);

    const tdPosition = document.createElement('td');

    tdPosition.textContent = item.position;

    tr.appendChild(tdPosition);

    const tdOffice = document.createElement('td');

    tdOffice.textContent = item.office;

    tr.appendChild(tdOffice);

    const tdAge = document.createElement('td');

    tdAge.textContent = item.age ?? '';

    tr.appendChild(tdAge);

    const tdSalary = document.createElement('td');

    tdSalary.textContent = currencyFormatter.format(item.salary) ?? '';

    tr.appendChild(tdSalary);

    tbody.appendChild(tr);
  });

  if (!activeRowId) {
    return;
  }

  const restored = tbody.querySelector(`tr[data-id="${activeRowId}"]`);

  if (restored) {
    restored.classList.add('active');
    activeRow = restored;
  } else {
    activeRow = null;
  }
}

// form creation
const form = document.createElement('form');

form.className = 'new-employee-form';

// label for name
const nameLabel = document.createElement('label');
const nameInput = document.createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.setAttribute('data-qa', 'name');
nameInput.required = true;

nameLabel.textContent = 'Name: ';
nameLabel.appendChild(nameInput);

form.appendChild(nameLabel);

// label for position
const positionLabel = document.createElement('label');
const positionInput = document.createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.setAttribute('data-qa', 'position');

positionLabel.textContent = 'Position: ';
positionLabel.appendChild(positionInput);

form.appendChild(positionLabel);

// label for office
const officeLabel = document.createElement('label');
const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.setAttribute('data-qa', 'office');
officeSelect.required = true;

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const city of cities) {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;

  officeSelect.appendChild(option);
}

officeLabel.appendChild(document.createTextNode('Office: '));
officeLabel.appendChild(officeSelect);

form.appendChild(officeLabel);

// label for age
const ageLabel = document.createElement('label');
const ageInput = document.createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.setAttribute('data-qa', 'age');
ageInput.required = true;

ageLabel.textContent = 'Age: ';
ageLabel.appendChild(ageInput);

form.appendChild(ageLabel);

// label for salary
const salaryLabel = document.createElement('label');
const salaryInput = document.createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.setAttribute('data-qa', 'salary');
salaryInput.required = true;

salaryLabel.textContent = 'Salary: ';
salaryLabel.appendChild(salaryInput);

form.appendChild(salaryLabel);

// submit button
const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';

form.appendChild(button);

// form insertion
const body = document.querySelector('body');

body.appendChild(form);

// data validation and submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fd = new FormData(form);

  const workerName = fd.get('name').trim();
  const position = fd.get('position').trim();
  const office = fd.get('office');
  const age = Number(fd.get('age'));
  const salary = Number(fd.get('salary').trim());

  const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/g;

  if (
    workerName.length < 4 ||
    Number.isNaN(age) ||
    age < 18 ||
    age > 90 ||
    !Number.isFinite(salary) ||
    position.trim().length < 2 ||
    !regex.test(position.trim())
  ) {
    showNotification('error');

    return;
  }

  const tr = document.createElement('tr');

  const headers = [workerName, position, office, String(age), salary];

  tr.dataset.id = String(nextId++);

  headers.forEach((value, i) => {
    const td = document.createElement('td');

    if (i === headers.length - 1) {
      td.textContent = currencyFormatter.format(value);
    } else {
      td.textContent = value;
    }

    tr.appendChild(td);
  });

  tbody.appendChild(tr);

  form.reset();
  showNotification('success');
});

// notification creation and logic
let timeoutId = null;

function showNotification(type) {
  const notify =
    document.querySelector('[data-qa="notification"]') ||
    document.createElement('div');

  notify.className = 'notification';
  notify.setAttribute('data-qa', 'notification');
  notify.setAttribute('aria-live', 'polite');
  notify.classList.remove('error', 'success');
  notify.innerHTML = '';

  if (type === 'error') {
    notify.classList.add('error');

    const title = document.createElement('h4');

    title.textContent = 'Error';

    const message = document.createElement('p');

    message.textContent = 'Invalid data';

    notify.appendChild(title);
    notify.appendChild(message);
  } else if (type === 'success') {
    notify.classList.add('success');

    const title = document.createElement('h4');

    title.textContent = 'Success';

    const message = document.createElement('p');

    message.textContent = 'Data added successfully!';

    notify.appendChild(title);
    notify.appendChild(message);
  }

  if (!document.body.contains(notify)) {
    document.body.appendChild(notify);
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    if (document.body.contains(notify)) {
      notify.remove();
    }
    timeoutId = null;
  }, 4000);

  return notify;
}

// editing logic
tbody.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');

  if (!td || td.querySelector('.cell-input')) {
    return;
  }

  const initial = td.textContent.trim();

  const existing = document.querySelector('.cell-input');

  if (existing && existing !== td.querySelector('.cell-input')) {
    existing.blur();
  }

  let textNode;

  for (const node of td.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      textNode = node;

      break;
    }
  }

  const span = document.createElement('span');

  if (!textNode) {
    return;
  }

  td.replaceChild(span, textNode);

  span.textContent = textNode.textContent.trim();

  const width = span.offsetWidth;

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = span.textContent.trim();
  input.style.display = 'inline-block';
  input.style.boxSizing = 'border-box';
  input.style.width = width + 'px';

  span.replaceWith(input);

  input.focus();
  input.select();

  function save() {
    if (input.isConnected) {
      const val = input.value.trim();

      if (val === '') {
        input.remove();
        td.textContent = initial;
      } else {
        input.remove();
        td.textContent = val;
      }
    }
  }

  input.addEventListener('blur', () => save());

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      save();
    }
  });
});
