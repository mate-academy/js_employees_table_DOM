'use strict';

const table = document.querySelector('table');
const formInputs = [
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
  {
    label: 'Office',
    name: 'office',
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

const form = document.createElement('form');

form.noValidate = true;
form.setAttribute('novalidate', '');
form.classList.add('new-employee-form');

formInputs.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}:`;

  let element;

  if (field.type === 'select') {
    element = document.createElement('select');

    field.options.forEach((optionText) => {
      const option = document.createElement('option');

      option.textContent = optionText;
      option.value = optionText;
      element.append(option);
    });
  } else {
    element = document.createElement('input');
    element.type = field.type;
  }
  element.name = field.name;
  element.dataset.qa = field.qa;
  element.required = true;
  element.autocomplete = 'off';
  label.append(element);
  form.append(label);
});

const btn = document.createElement('button');

btn.textContent = 'Save to table';
btn.type = 'submit';
form.append(btn);
document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employee = Object.fromEntries(formData.entries());

  validateData(employee);
});

function validateData(obj) {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.dataset.qa = 'notification';

  const isAnyEmpty = Object.values(obj).some((value) => value.trim() === '');
  let errorMsg = '';

  if (isAnyEmpty) {
    errorMsg = 'All fields are required';
    notification.classList.add('error');
  }

  const trimmedName = obj.name.trim();

  if (trimmedName.length < 4) {
    notification.classList.add('error');
    errorMsg = 'Name must be at least 4 characters long';
    form.querySelector('[name="name"]').focus();
  } else if (+obj.age < 18 || +obj.age > 90) {
    notification.classList.add('error');
    errorMsg = 'Age must be between 18 and 90';
    form.querySelector('[name="age"]').focus();
  }

  if (notification.classList.contains('error')) {
    notification.innerHTML = `
     <h1 class="title">Error</h1>
     <p>${errorMsg}</p>
     `;
    document.body.append(notification);
  } else {
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td>${obj.name.slice(0, 1).toUpperCase()}${obj.name.slice(1)}</td>
    <td>${obj.position.slice(0, 1).toUpperCase()}${obj.position.slice(1)}</td>
    <td>${obj.office}</td>
    <td>${+obj.age}</td>
    <td>$${Number(obj.salary).toLocaleString('en-US')}</td>
    `;
    table.querySelector('tbody').append(newRow);
    notification.classList.add('success');

    notification.innerHTML = `
    <h1 class="title">Success</h1>
    <p>Employee added successfully!</p>
    `;
    document.body.append(notification);
    form.reset();
  }
  setTimeout(() => notification.remove(), 3000);
}

table.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row || !table.tBodies[0].contains(row)) {
    return;
  }

  const prev = table.querySelector('.active');

  if (prev) {
    prev.classList.remove('active');
  }

  row.classList.add('active');
});

const headers = [...table.querySelectorAll('thead th')];

headers.forEach((th, index) => {
  th.addEventListener('click', () => {
    const currentOrder = th.dataset.order;
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    headers.forEach((h) => {
      if (h !== th) {
        delete h.dataset.order;
      }
    });

    th.dataset.order = newOrder;

    const tbody = table.tBodies[0];
    const rows = [...tbody.rows];

    rows.sort((a, b) => {
      const aText = a.cells[index].textContent.trim();
      const bText = b.cells[index].textContent.trim();

      const aNum = Number(aText.replace(/[$,]/g, ''));
      const bNum = Number(bText.replace(/[$,]/g, ''));

      if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
        return newOrder === 'asc' ? aNum - bNum : bNum - aNum;
      }

      return newOrder === 'asc'
        ? aText.localeCompare(bText)
        : bText.localeCompare(aText);
    });

    rows.forEach((row) => tbody.appendChild(row));
  });
});
