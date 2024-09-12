'use strict';

const body = document.querySelector('body');
const headers = document.querySelectorAll('th');
const users = document.querySelectorAll('td');
const form = document.createElement('form');
const tbody = document.querySelector('tbody');

form.classList.add('new-employee-form');

const fields = ['name', 'position', 'office', 'age', 'salary'];

fields.forEach(field => {
  const label = document.createElement('label');

  label.textContent = `${field.charAt(0).toUpperCase() + field.slice(1)}: `;

  if (field === 'office') {
    const select = document.createElement('select');

    select.name = field;
    select.dataset.qa = field;

    ['Tokyo', 'Singapore', 'London', 'New York', 'Edinburgh', 'San Francisco']
      .forEach(optionValue => {
        const option = document.createElement('option');

        option.value = optionValue;
        option.textContent = optionValue;
        select.appendChild(option);
      });
    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.name = field;
    input.type = field === 'age' || field === 'salary' ? 'number' : 'text';
    input.dataset.qa = field;
    label.appendChild(input);
  }

  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.appendChild(submitButton);

document.body.appendChild(form);

form.addEventListener('submit', e => {
  e.preventDefault();

  const personName = form.elements['name'].value;
  const position = form.elements['position'].value;
  const office = form.elements['office'].value;
  const age = form.elements['age'].value;
  const salary = form.elements['salary'].value;

  if (personName === ''
    || position === '' || office === '' || age === '' || salary === '') {
    pushNotification(
      10, 10, 'Error', 'All fields are required', 'error');

    return;
  }

  if (personName.length < 4) {
    pushNotification(
      10, 10, 'Error', 'Name must be at least 4 characters long', 'error');

    return;
  }

  if (!position) {
    pushNotification(
      10, 10, 'Error', 'Position must be declared', 'error');

    return;
  }

  if (!office) {
    pushNotification(
      10, 10, 'Error', 'Office must be chosen', 'error');

    return;
  }

  if (age <= 18 || age >= 90) {
    pushNotification(
      10, 10, 'Error', 'Age must be between 18 and 90', 'error');

    return;
  }

  if (salary <= 0) {
    pushNotification(
      10, 10, 'Error', 'Salary must be greater than 0', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  ['name', 'position', 'office', 'age', 'salary'].forEach(field => {
    const cell = document.createElement('td');
    let value = form.elements[field].value;

    if (field === 'salary') {
      value = `$${value}`;
    }

    cell.textContent = value;
    newRow.appendChild(cell);
  });

  tbody.appendChild(newRow);

  form.reset();

  pushNotification(
    10, 10, 'Success', 'New employee added to the table', 'success');
});

headers.forEach(header => {
  header.addEventListener('click', () => {
    const rows = tbody.querySelectorAll('tr');
    const index = header.cellIndex;
    const order = header.dataset.order;
    const sortedRows = Array.from(rows).sort((rowA, rowB) => {
      let cellA = rowA.querySelectorAll('td')[index].textContent;
      let cellB = rowB.querySelectorAll('td')[index].textContent;

      if (index === 4) {
        cellA = Number(cellA.replace(/[$,]/g, ''));
        cellB = Number(cellB.replace(/[$,]/g, ''));
      }

      if (order === 'asc') {
        return cellA > cellB ? 1 : -1;
      } else {
        return cellA < cellB ? 1 : -1;
      }
    });

    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));
    header.dataset.order = order === 'asc' ? 'desc' : 'asc';
  });
});

users.forEach(user => {
  user.addEventListener('click', (e) => {
    document.querySelectorAll('tr.active').forEach(element => {
      element.classList.remove('active');
    });

    const row = e.target.closest('tr');

    row.classList.add('active');
  });
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(type);

  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');
  notificationTitle.textContent = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;
  notificationDescription.innerHTML = description.replace('\n', '<br>');

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationDescription);

  body.append(notification);

  setTimeout(() => {
    notification.style.display = 'none';
  }, 2000);
};
