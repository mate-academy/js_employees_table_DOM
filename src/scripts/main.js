'use strict';

let lastColumnIndex = null;
let sortDirection = 'asc';

const main = document.querySelector('tbody');
let activeInput = null;

// table sorting
document.querySelectorAll('thead tr th').forEach((th, index) => {
  th.addEventListener('click', () => {
    const tbody = document.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (lastColumnIndex !== index) {
      sortDirection = 'asc';
      lastColumnIndex = index;
    } else {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    rows.sort((a, b) => {
      const valA = a.cells[index].textContent.trim();
      const valB = b.cells[index].textContent.trim();

      const numA = parseFloat(valA.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(valB.replace(/[^0-9.-]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortDirection === 'asc' ? numA - numB : numB - numA;
      }

      return sortDirection === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));
  });
});

// selecting rows
main.addEventListener('click', (ev) => {
  const tr = ev.target.closest('tr');

  if (!tr) {
    return;
  }

  main.querySelectorAll('tr').forEach((r) => r.classList.remove('active'));
  tr.classList.add('active');
});

// adding form
const table = document.querySelector('table');
const form = document.createElement('form');

form.classList.add('new-employee-form');

table.after(form);

function addFieldForm(fields) {
  fields.forEach((field) => {
    const labelField = document.createElement('label');

    labelField.textContent = field.label + ': ';

    const input = document.createElement('input');

    input.name = field.name;
    input.type = field.type;
    input.dataset.qa = field.qa;

    labelField.appendChild(input);
    form.appendChild(labelField);
  });
}

const fieldsOne = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
];

const fieldsTwo = [
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

addFieldForm(fieldsOne);

const label = document.createElement('label');
const select = document.createElement('select');
const options = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

label.textContent = 'Office: ';
select.name = 'office';
select.dataset.qa = 'office';

options.forEach((option) => {
  const optionEl = document.createElement('option');

  optionEl.textContent = option;
  select.appendChild(optionEl);
});
label.appendChild(select);
form.appendChild(label);

addFieldForm(fieldsTwo);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'button';

const notification = document.createElement('div');

notification.classList.add('notification');
notification.dataset.qa = 'notification';

button.addEventListener('click', () => {
  const inputs = form.querySelectorAll('input');
  const selectButton = form.querySelector('select');

  notification.classList.remove('error', 'success');

  for (const input of inputs) {
    if (input.value === '') {
      notification.textContent = 'Заповніть всі поля!';
      notification.classList.add('error');

      return;
    }

    if (input.name === 'name' && input.value.length < 4) {
      notification.textContent = 'У імені має бути мінімум 4 символа!';
      notification.classList.add('error');

      return;
    }

    if (input.name === 'age' && (input.value < 18 || input.value > 90)) {
      notification.textContent = 'Вік може бути лише від 18 до 90!';
      notification.classList.add('error');

      return;
    }
  }

  if (selectButton.value === '') {
    notification.textContent = 'Виберіть офіс!';
    notification.classList.add('error');

    return;
  }

  const tr = document.createElement('tr');

  const nameInput = form.querySelector('input[name="name"]');
  const positionInput = form.querySelector('input[name="position"]');
  const ageInput = form.querySelector('input[name="age"]');
  const salaryInput = form.querySelector('input[name="salary"]');

  // Name
  let td = document.createElement('td');

  td.textContent = nameInput.value;
  tr.appendChild(td);

  // Position
  td = document.createElement('td');
  td.textContent = positionInput.value;
  tr.appendChild(td);

  // Office
  td = document.createElement('td');
  td.textContent = selectButton.value;
  tr.appendChild(td);

  // Age
  td = document.createElement('td');
  td.textContent = ageInput.value;
  tr.appendChild(td);

  // Salary
  td = document.createElement('td');

  td.textContent = '$' + Number(salaryInput.value).toLocaleString('en-US');
  tr.appendChild(td);

  const tbody = document.querySelector('tbody');

  tbody.appendChild(tr);

  notification.textContent = 'Успішно додано нового працівника!';
  notification.classList.add('success');

  form.reset();
});

form.appendChild(button);
form.after(notification);

// additional

main.addEventListener('dblclick', (ev) => {
  const td = ev.target.closest('td');

  if (!td) {
    return;
  }

  if (activeInput) {
    const parentTd = activeInput.parentElement;

    parentTd.textContent =
      activeInput.value || activeInput.dataset.initialValue;
    activeInput = null;
  }

  if (td.querySelector('input')) {
    return;
  }

  const initialValue = td.textContent;

  const input = document.createElement('input');

  input.type = 'text';
  input.classList.add('cell-input');
  input.value = initialValue;
  input.dataset.initialValue = initialValue;

  td.textContent = '';
  td.appendChild(input);
  input.focus();

  activeInput = input;

  input.addEventListener('blur', () => {
    td.textContent = input.value || input.dataset.initialValue;
    activeInput = null;
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      td.textContent = input.value || input.dataset.initialValue;
      activeInput = null;
    }
  });
});
