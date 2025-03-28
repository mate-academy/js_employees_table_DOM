'use strict';

// GETTING DATA

const table = document.querySelector('tbody');
const headers = document.querySelectorAll('th');

// SORTING TABLE

headers.forEach((header) => {
  header.dataset.order = 'desc';
});

function sortTable(colunmIndex, isNumeric = false) {
  const rows = Array.from(table.rows);
  const header = headers[colunmIndex];
  const order = header.dataset.order;

  rows.sort((a, b) => {
    let cellA = a.cells[colunmIndex].textContent;
    let cellB = b.cells[colunmIndex].textContent;

    if (isNumeric) {
      cellA = parseFloat(cellA.replace(/[$,]/g, ''));
      cellB = parseFloat(cellB.replace(/[$,]/g, ''));

      if (order === 'desc') {
        header.dataset.order = 'asc';

        return cellA - cellB;
      }

      if (order === 'asc') {
        header.dataset.order = 'desc';

        return cellB - cellA;
      }
    }

    if (order === 'desc') {
      header.dataset.order = 'asc';

      return cellA.localeCompare(cellB);
    }

    if (order === 'asc') {
      header.dataset.order = 'desc';

      return cellB.localeCompare(cellA);
    }
  });

  table.innerHTML = '';
  rows.forEach((row) => table.appendChild(row));
}

document.addEventListener('click', (e) => {
  const header = e.target.closest('th');
  const colunmIndex = [...headers].indexOf(header);

  if (colunmIndex !== -1) {
    sortTable(colunmIndex, colunmIndex > 2);
  }
});

// SELLECTION SCRIPT

document.addEventListener('click', (e) => {
  const row = e.target.closest('tbody tr');
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((r) => {
    r.classList.remove('active');
  });

  if (row) {
    row.classList.add('active');
  }
});

// CREATE FORM

const form = document.createElement('form');

const inputs = [];

for (let i = 0; i < 4; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  const labelNames = ['Name:', 'Position:', 'Age:', 'Salary:'];

  label.textContent = labelNames[i];

  inputs.push(input);

  label.appendChild(input);
  form.appendChild(label);
}

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office:';

const select = document.createElement('select');

const options = [];

for (let i = 0; i < 6; i++) {
  const option = document.createElement('option');

  options.push(option);
  select.appendChild(option);
}

selectLabel.appendChild(select);

const button = document.createElement('button');

form.classList.add('new-employee-form');

inputs[0].setAttribute('type', 'text');
inputs[0].setAttribute('name', 'name');
inputs[0].setAttribute('data-qa', 'name');
inputs[1].setAttribute('type', 'text');
inputs[1].setAttribute('name', 'position');
inputs[1].setAttribute('data-qa', 'position');
inputs[2].setAttribute('type', 'number');
inputs[2].setAttribute('name', 'age');
inputs[2].setAttribute('data-qa', 'age');
inputs[3].setAttribute('type', 'number');
inputs[3].setAttribute('name', 'salary');
inputs[3].setAttribute('data-qa', 'salary');
select.setAttribute('data-qa', 'office');

options[0].textContent = 'Tokyo';
options[1].textContent = 'Singapore';
options[2].textContent = 'London';
options[3].textContent = 'New York';
options[4].textContent = 'Edinburgh';
options[5].textContent = 'San Francisco';

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

form.insertBefore(selectLabel, inputs[2].parentNode);
form.appendChild(button);
document.body.appendChild(form);

// NOTIFICATIONS

function notificationAlert(type, title, discription) {
  const notification = document.createElement('div');
  const notTitle = document.createElement('h2');
  const notDiscription = document.createElement('p');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add('notification', type);

  notTitle.innerText = title;
  notDiscription.innerText = discription;

  notification.append(notTitle, notDiscription);
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// SUBMIT SCRIPT

document.addEventListener('click', (e) => {
  const submit = e.target.closest('button');
  const formContent = form.querySelectorAll('[data-qa]');
  const salary = form.querySelector('[data-qa="salary"]');
  const formName = form.querySelector('[data-qa="name"]');
  const formAge = form.querySelector('[data-qa="age"]');

  if (submit) {
    e.preventDefault();

    for (let i = 0; i < formContent.length; i++) {
      if (formContent[i].value === '') {
        notificationAlert('error', 'Error', 'Please, enter the data!');

        return;
      }
    }

    if (formName.value.length < 4) {
      notificationAlert(
        'error',
        'Error',
        'Name should have at least 4 symbols',
      );

      return;
    }

    if (parseFloat(formAge.value) < 18 || parseFloat(formAge.value) > 90) {
      notificationAlert('error', 'Error', 'Invalid age');

      return;
    }

    const tr = table.insertRow();

    formContent.forEach((input) => {
      const td = document.createElement('td');
      const cell = tr.appendChild(td);

      cell.textContent = input.value;

      if (input === salary) {
        cell.textContent = Number(input.value).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        });
      }
    });

    notificationAlert('success', 'Success', 'Employee added!');
  }
});

// CELL CHANGE

document.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('tbody td');
  const cells = document.querySelectorAll('td');

  cells.forEach((c) => {
    const delInput = c.querySelector('input');

    if (delInput) {
      c.innerText = delInput.value;
      delInput.remove();
    }
  });

  if (cell) {
    const input = document.createElement('input');
    const text = cell.innerText;

    input.value = text;

    input.classList.add('cell-input');

    cell.innerText = '';
    cell.appendChild(input);

    const saveInput = () => {
      cell.innerText = input.value || text;
      input.remove();
    };

    document.addEventListener('click', (eve) => {
      if (!cell.contains(eve.target)) {
        saveInput();
      }
    });

    document.addEventListener('keypress', (ev) => {
      if (ev.code === 'Enter') {
        saveInput();
      }
    });
  }
});
