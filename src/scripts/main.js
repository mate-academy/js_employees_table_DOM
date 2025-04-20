'use strict';

// #region Sorting

const table = document.querySelector('table');
const tableHeaders = document.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

for (const th of tableHeaders) {
  th.addEventListener('click', (e) => {
    const headers = Array.from(th.parentNode.children);
    const index = headers.indexOf(th);

    const rows = Array.from(tbody.rows);

    const isNumberColumn = index === 3 || index === 4;

    const currentOrder = th.dataset.order || 'asc';
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

    for (const header of tableHeaders) {
      header.removeAttribute('data-order');
    }
    th.dataset.order = newOrder;

    rows.sort((rowA, rowB) => {
      let cellA = rowA.cells[index].textContent.trim();
      let cellB = rowB.cells[index].textContent.trim();

      if (isNumberColumn) {
        cellA = parseFloat(cellA.replace(/[^0-9.]/g, ''));
        cellB = parseFloat(cellB.replace(/[^0-9.]/g, ''));
      }

      let comparison;

      if (isNumberColumn) {
        comparison = cellA - cellB;
      } else {
        comparison = cellA.localeCompare(cellB);
      }

      return newOrder === 'asc' ? -comparison : comparison;
    });

    for (const row of rows) {
      tbody.appendChild(row);
    }
  });
}

// #endregion

// #region Row Active

tbody.addEventListener('click', (e) => {
  const activeRow = e.target.closest('tr');

  if (tbody.contains(activeRow)) {
    const allRows = tbody.querySelectorAll('tr');

    for (const tr of allRows) {
      tr.classList.remove('active');
    }

    activeRow.classList.add('active');
  }
});

// #endregion

// #region Add a Form

const form = document.createElement('form');

form.classList.add('new-employee-form');

function createLabelAndInput(attribute, type) {
  const label = document.createElement('label');

  label.textContent = `${attribute[0].toUpperCase() + attribute.slice(1)}: `;

  const newInput = document.createElement('input');

  newInput.name = attribute;

  if (type === 'number') {
    newInput.min = 1;
  }
  newInput.type = type;
  newInput.dataset.qa = attribute;
  newInput.required = true;

  label.append(newInput);

  form.append(label);
}

function createSelect(attribute) {
  const label = document.createElement('label');

  label.textContent = `${attribute[0].toUpperCase() + attribute.slice(1)}: `;

  const select = document.createElement('select');

  select.name = attribute;
  select.dataset.qa = attribute;
  select.required = true;

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  for (const office of offices) {
    const option = document.createElement('option');

    option.textContent = office;

    select.append(option);
  }

  label.append(select);

  form.append(label);
}

function createButton() {
  const formButton = document.createElement('button');

  formButton.textContent = 'Save to table';

  form.append(formButton);
}

createLabelAndInput('name', 'text');
createLabelAndInput('position', 'text');
createSelect('office');
createLabelAndInput('age', 'number');
createLabelAndInput('salary', 'number');
createButton();

document.body.append(form);

// #endregion

// #region Notification and Validation

// Notification

const pushNotification = (posTop, posRight, title, description, type) => {
  const notificationContainer = document.createElement('div');

  notificationContainer.classList.add('notification');

  notificationContainer.dataset.qa = 'notification';

  const notificationTitle = document.createElement('h2');

  notificationTitle.classList.add('title');

  notificationTitle.textContent = title;

  const notificationDescription = document.createElement('p');

  notificationDescription.textContent = description;

  notificationContainer.append(notificationTitle, notificationDescription);

  function createNotification(container, topPos, rightPos, notifType) {
    container.classList.add(notifType);
    container.style.position = 'fixed';
    container.style.top = `${topPos}px`;
    container.style.right = `${rightPos}px`;

    document.body.appendChild(container);

    setTimeout(() => {
      container.remove();
    }, 3000);
  }

  createNotification(notificationContainer, posTop, posRight, type);
};

// Validation and add Form

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll('input');

  for (const input of inputs) {
    if (input.name === 'name' && input.value.trim().length < 4) {
      pushNotification(
        150,
        100,
        'Error',
        'Name must have at least 4 letters',
        'error',
      );

      return;
    }

    if (input.name === 'name' && /\d/.test(input.value.trim())) {
      pushNotification(
        150,
        100,
        'Error',
        'Name must not contain numbers',
        'error',
      );

      return;
    }

    if (input.name === 'age') {
      const age = Number(input.value);

      if (age < 18 || age > 90) {
        pushNotification(
          150,
          100,
          'Error',
          'Age must be between 18 and 90',
          'error',
        );

        return;
      }
    }
  }

  const newRow = document.createElement('tr');

  const formValues = {
    name: document.querySelector('input[name="name"]').value,
    position: document.querySelector('input[name="position"]').value,
    office: document.querySelector('select[name="office"]').value,
    age: document.querySelector('input[name="age"]').value,
    salary: `$${Number(document.querySelector('input[name="salary"]').value).toLocaleString()}`,
  };

  for (const key in formValues) {
    const td = document.createElement('td');

    td.textContent = formValues[key];
    newRow.append(td);
  }

  tbody.append(newRow);

  pushNotification(
    150,
    100,
    'Success',
    'Employee has been added to the table',
    'success',
  );
  form.reset();

  // const valueName = document.querySelector('input[name="name"]').value;
  // const valuePosition = document.querySelector(
  // 'input[name="position"]').value;
  // const valueOffice = document.querySelector('select[name="office"]').value;
  // const valueAge = document.querySelector('input[name="age"]').value;
  // const valueSalary = document.querySelector('input[name="salary"]').value;

  // const tdName = document.createElement('td');

  // tdName.textContent = valueName;

  // newRow.append(tdName);

  // const tdPosition = document.createElement('td');

  // tdPosition.textContent = valuePosition;

  // newRow.append(tdPosition);

  // const tdOffice = document.createElement('td');

  // tdOffice.textContent = valueOffice;

  // newRow.append(tdOffice);

  // const tdAge = document.createElement('td');

  // tdAge.textContent = valueAge;

  // newRow.append(tdAge);

  // const tdSalary = document.createElement('td');

  // const formattedSalary = Number(valueSalary);

  // tdSalary.textContent = `$${formattedSalary}`;

  // newRow.append(tdSalary);

  // tbody.append(newRow);
});

// #endregion
