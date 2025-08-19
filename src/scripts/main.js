'use strict';

const th = document.querySelectorAll('th');
const tbody = document.querySelector('tbody');
let lastSortedIndex = null;
let direction = 1;

for (const item of th) {
  item.addEventListener('click', function () {
    const index = Array.from(th).indexOf(item);
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (lastSortedIndex === index) {
      direction = -direction;
    } else {
      lastSortedIndex = index;
      direction = 1;
    }

    rows.sort((a, b) => {
      const cellA = a.children[index].textContent.trim();
      const cellB = b.children[index].textContent.trim();

      const num1 = parseFloat(cellA.replace(/[$,\s]/g, ''));
      const num2 = parseFloat(cellB.replace(/[$,\s]/g, ''));

      if (!Number.isNaN(num1) && !Number.isNaN(num2)) {
        return (num1 - num2) * direction;
      }

      return cellA.localeCompare(cellB) * direction;
    });
    tbody.innerHTML = '';
    rows.forEach((row) => tbody.append(row));
  });
}

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((tr) => tr.classList.remove('active'));
  row.classList.add('active');
});

const fields = [
  { label: 'Name:', type: 'text', qa: 'name' },
  { label: 'Position:', type: 'text', qa: 'position' },
  {
    label: 'Office',
    type: 'select',
    qa: 'office',
    options: [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  { label: 'Age:', type: 'number', qa: 'age' },
  { label: 'Salary:', type: 'number', qa: 'salary' },
];
const form = document.createElement('form');

form.classList.add('new-employee-form');

const submitButton = document.createElement('button');

submitButton.textContent = 'Save to table';

for (const field of fields) {
  const label = document.createElement('label');

  label.append(field.label);

  if (field.type === 'select') {
    const select = document.createElement('select');

    select.setAttribute('name', field.qa);
    select.setAttribute('data-qa', field.qa);

    for (const optionText of field.options) {
      const options = document.createElement('option');

      options.textContent = optionText;
      select.append(options);
    }
    label.append(select);
  } else {
    const input = document.createElement('input');

    input.setAttribute('type', field.type);
    input.setAttribute('name', field.qa);
    input.setAttribute('data-qa', field.qa);
    label.append(input);
  }
  form.append(label);
}
form.append(submitButton);

const div = document.createElement('div');

div.setAttribute('data-qa', 'notification');
form.append(div);

document.body.append(form);

submitButton.addEventListener('click', function (even) {
  even.preventDefault();

  const data = new FormData(form);
  const namePerson = data.get('name');
  const age = Number(data.get('age'));
  const arrayForm = Array.from(data.values());
  const notification = document.querySelector('[data-qa="notification"]');

  notification.className = '';
  notification.classList.add('success');

  if (!arrayForm.every((value) => value.trim() !== '')) {
    notification.textContent = 'All fields must be filled';
    notification.className = '';
    notification.classList.add('error');

    return;
  }

  if (namePerson.length < 4) {
    notification.textContent = 'Name must be at least 4 characters';
    notification.className = '';
    notification.classList.add('error');

    return;
  }

  if (age < 18 || age > 90) {
    notification.textContent = 'Age must be between 18 and 90';
    notification.className = '';
    notification.classList.add('error');

    return;
  }

  const salary = Number(data.get('salary'));

  if (Number.isNaN(salary) || salary <= 0) {
    notification.textContent = 'Salary must be a positive number';
    notification.className = 'error';

    return;
  }

  const newTr = document.createElement('tr');
  const formattedSalary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(data.get('salary')));

  for (const [index, items] of arrayForm.entries()) {
    const newTd = document.createElement('td');

    if (fields[index].qa === 'salary') {
      newTd.textContent = formattedSalary;
    } else {
      newTd.textContent = items;
    }
    newTr.append(newTd);
  }

  tbody.append(newTr);
  form.reset();

  newTr.addEventListener('click', function () {
    for (const row of tbody.querySelectorAll('tr')) {
      row.classList.remove('active');
    }
    this.classList.add('active');
  });
});

tbody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  // якщо вже редагується якась клітинка — не даємо відкрити нову
  if (tbody.querySelector('.cell-input')) {
    return;
  }

  const oldValue = cell.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = oldValue;

  cell.textContent = '';
  cell.append(input);
  input.focus();

  function save(newValue) {
    cell.textContent = newValue.trim() === '' ? oldValue : newValue;
  }

  input.addEventListener('blur', () => {
    save(input.value);
  });

  input.addEventListener('keydown', () => {
    if (e.key === 'Enter') {
      save(input.value);
    }
  });
});
