'use strict';

const table = document.querySelector('table');
const tBody = table.tBodies[0];
const body = document.querySelector('body');

table.addEventListener('click', (e) => {
  const target = e.target.closest('th');
  const tbody = table.tBodies[0] || table;
  let rows = [];

  if (!target) {
    return;
  }

  const columnIndex = target.cellIndex;

  const currentDir = target.dataset.order;
  const sortDirection = currentDir === 'asc' ? 'desc' : 'asc';

  table
    .querySelectorAll('th')
    .forEach((th) => th.removeAttribute('data-order'));

  target.dataset.order = sortDirection;

  rows = Array.from(tbody.rows);

  rows.sort((a, b) => {
    if (/\d/.test(a.cells[columnIndex].textContent)) {
      const aNum = parseFloat(
        a.cells[columnIndex].textContent.replace(/[^\d.-]/g, ''),
      );
      const bNum = parseFloat(
        b.cells[columnIndex].textContent.replace(/[^\d.-]/g, ''),
      );

      if (sortDirection === 'asc') {
        return aNum - bNum;
      } else {
        return bNum - aNum;
      }
    }

    const aText = a.cells[columnIndex].textContent.trim();
    const bText = b.cells[columnIndex].textContent.trim();

    if (sortDirection === 'asc') {
      return aText.localeCompare(bText);
    } else {
      return bText.localeCompare(aText);
    }
  });

  rows.forEach((row) => tbody.appendChild(row));
});

let activeRow = null;

table.tBodies[0].addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  if (target) {
    if (activeRow) {
      activeRow.classList.remove('active');
    }
    target.classList.add('active');
    activeRow = target;
  }
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.action = '#';
form.method = 'POST';

const fields = [
  { label: 'Name', name: 'name', type: 'text' },
  { label: 'Position', name: 'position', type: 'text' },
  {
    label: 'Office',
    name: 'office',
    type: 'select',
    options: [
      `Tokyo`,
      `Singapore`,
      `London`,
      `New York`,
      `Edinburgh`,
      `San Francisco`,
    ],
  },
  { label: 'Age', name: 'age', type: 'number' },
  { label: 'Salary', name: 'salary', type: 'number' },
];

fields.forEach((field) => {
  const label = document.createElement('label');

  label.textContent = `${field.label}: `;

  let element;

  if (field.type === 'select') {
    element = document.createElement('select');
    element.name = field.name;
    element.required = true;

    field.options.forEach((optText) => {
      const option = document.createElement('option');

      option.value = optText;
      option.textContent = optText;
      element.appendChild(option);
    });
  } else {
    element = document.createElement('input');
    element.name = field.name;
    element.type = field.type;
    element.required = true;
  }

  element.setAttribute('data-qa', field.name);
  label.appendChild(element);
  form.appendChild(label);
});

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';
form.appendChild(submitBtn);

body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const employee = Object.fromEntries(formData.entries());

  if (checkValidation(employee)) {
    addEmployeeToTable(employee);

    pushNotification(
      20,
      20,
      'Success',
      'Employee added successfully',
      'success',
    );
    form.reset();
  }
});

function addEmployeeToTable(employee) {
  const newRow = document.createElement('tr');
  const formattedSalary = Number(employee.salary).toLocaleString('en-US');

  newRow.innerHTML = `
    <td>${employee.name}</td>
    <td>${employee.position}</td>
    <td>${employee.office}</td>
    <td>${employee.age}</td>
    <td>$${formattedSalary}</td>
  `;
  tBody.appendChild(newRow);
}

function checkValidation(employee) {
  if (employee.name.length < 4) {
    pushNotification(
      20,
      20,
      'Validation Error',
      'Name must be at least 4 characters long',
      'error',
    );

    return false;
  }

const age = Number(employee.age);

  if (age < 18 || age > 90) {
    pushNotification(
      20,
      20,
      'Validation Error',
      'Age must be between 18 and 90',
      'error',
    );

    return false;
  }

  return true;
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');
  notificationTitle.textContent = title;
  notification.appendChild(notificationTitle);

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;
  notification.appendChild(notificationDescription);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

form.addEventListener(
  'invalid',
  (e) => {
    e.preventDefault();

    const input = e.target;
    const fieldName = input.name;
    const errorMessage = input.validationMessage;

    pushNotification(
      20,
      20,
      'Validation Error',
      fieldName + ': ' + errorMessage,
      'error',
    );
  },
  true,
);
