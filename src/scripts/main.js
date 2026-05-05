'use strict';

// HEAD

const thHeaders = document.querySelectorAll('th');

// BODY
const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const bodyRows = Array.from(tbody.children);
const bodyObject = bodyRows.map((row) => {
  const cells = row.children;

  return {
    name: cells[0].textContent,
    position: cells[1].textContent,
    office: cells[2].textContent,
    age: cells[3].textContent,
    salary: cells[4].textContent,
  };
});

// Зарплата в число

function numHelper(salary) {
  return Number(salary.replaceAll('$', '').replaceAll(',', ''));
}

// Функция которая сортирует нужную позицию

const sortMethods = {
  name: (a, b, dir) => a.name.localeCompare(b.name) * dir,
  position: (a, b, dir) => a.position.localeCompare(b.position) * dir,
  office: (a, b, dir) => a.office.localeCompare(b.office) * dir,
  age: (a, b, dir) => (numHelper(a.age) - numHelper(b.age)) * dir,
  salary: (a, b, dir) => (numHelper(a.salary) - numHelper(b.salary)) * dir,
};

const direction = {
  name: 1,
  position: 1,
  office: 1,
  age: 1,
  salary: 1,
};

let currentKey = null;

function sorted(list, key) {
  const method = sortMethods[key];

  if (currentKey !== key) {
    direction[key] = 1;
  }

  currentKey = key;

  const dir = direction[key];

  if (!method) {
    return;
  }

  list.sort((a, b) => method(a, b, dir));
  direction[key] *= -1;
}

// Рендрер

function render(list) {
  tbody.innerHTML = '';

  list.forEach((employee) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.office}</td>
      <td>${employee.age}</td>
      <td>${employee.salary}</td>
    `;

    tbody.append(row);
  });
}

tbody.addEventListener('click', (ev) => {
  const row = ev.target.closest('tr');

  if (!row) {
    return;
  }

  tbody.querySelectorAll('tr').forEach((tr) => {
    tr.classList.remove('active');
  });

  row.classList.add('active');
});

thHeaders.forEach((th, index) => {
  th.addEventListener('click', () => {
    const keys = ['name', 'position', 'office', 'age', 'salary'];
    const key = keys[index];

    sorted(bodyObject, key);
    render(bodyObject);
  });
});

// ФОРМА

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.noValidate = true;

body.append(form);

form.innerHTML = `
  <label>Name:<input name="name" data-qa="name" type="text" required></label>
  <label>Position:<input name="position" data-qa="position" type="text" required></label>
  <label>Office:<select name="office" data-qa="office" required>
    <option>Tokyo</option>
    <option>Singapore</option>
    <option>London</option>
    <option>New York</option>
    <option>Edinburgh</option>
    <option>San Francisco</option>
  </select></label>
  <label>Age:<input name="age" data-qa="age" type="number" required></label>
  <label>Salary:<input name="salary" data-qa="salary" type="number" required></label>
  <button type="submit">Save to table</button>
`;

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const Name = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = form.elements.age.value;
  const salary = form.elements.salary.value;

  if (!Name || !position || !office || !age || !salary) {
    showNotification('error', 'Error', 'All fields are required');

    return;
  }

  const newEmployee = {
    name: `${Name}`,
    position: `${position}`,
    office: `${office}`,
    age: `${age}`,
    salary: `$${Number(salary).toLocaleString('en-US')}`,
  };

  if (Number(age) < 18 || Number(age) > 90) {
    showNotification('error', 'Error', 'Age is wrong');

    return;
  }

  if (newEmployee.name.length < 4) {
    showNotification('error', 'Error', 'Name too short');

    return;
  }

  bodyObject.push(newEmployee);
  form.reset();
  render(bodyObject);
  showNotification('success', 'Success', 'Employee added');

  function showNotification(type, title, description) {
    const existing = document.querySelector('[data-qa="notification"]');

    if (existing) {
      existing.remove();
    }

    const notification = document.createElement('div');
    const notificationTitle = document.createElement('h1');
    const notificationDescription = document.createElement('p');

    notificationTitle.textContent = title;
    notificationDescription.textContent = description;

    notification.classList.add('notification');
    notification.classList.add(type);
    notification.dataset.qa = 'notification';

    notification.append(notificationTitle, notificationDescription);
    body.append(notification);
  }
});
