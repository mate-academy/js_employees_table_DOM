'use strict';

const table = document.querySelector('table');
const headers = document.querySelector('thead');
const body = document.querySelector('tbody');
// #region table sorting

headers.addEventListener('click', (e) => {
  const index = e.target.cellIndex;
  const sorted = [...table.tBodies[0].rows];

  if (e.target.hasAttribute('id')) {
    sorted.sort((a, b) => {
      if (index === table.rows[0].cells.length - 1) {
        const salaryA = a.cells[index].innerText.slice(1).replace(',', '');
        const salaryB = b.cells[index].innerText.slice(1).replace(',', '');

        return Number(salaryB) - Number(salaryA);
      } else {
        return b.cells[index].innerText
          .toLowerCase()
          .localeCompare(a.cells[index].innerText.toLowerCase());
      }
    });

    e.target.removeAttribute('id');
  } else {
    if (document.getElementById('#clicked')) {
      document.getElementById('#clicked').removeAttribute('id');
    }

    sorted.sort((a, b) => {
      if (index === table.rows[0].cells.length - 1) {
        const salaryA = a.cells[index].innerText.slice(1).replace(',', '');
        const salaryB = b.cells[index].innerText.slice(1).replace(',', '');

        return Number(salaryA) - Number(salaryB);
      } else {
        return a.cells[index].innerText
          .toLowerCase()
          .localeCompare(b.cells[index].innerText.toLowerCase());
      }
    });

    e.target.setAttribute('id', 'clicked');
  }
  sorted.forEach((x) => table.tBodies[0].append(x));
});
// #endregion table sorting

// #region selected row
body.addEventListener('click', (e) => {
  const activeRow = document.querySelector('.active');

  if (activeRow) {
    document.querySelector('.active').classList.remove('active');
  }

  e.target.parentNode.classList.add('active');
});
// #endregion selected row

// #region adding form
const form = document.createElement('form');
const formFill = ['name', 'position', 'office', 'age', 'salary'];

form.setAttribute('action', 'http://localhost:8080/');
form.setAttribute('method', 'get');
form.classList.add('new-employee-form');

for (let i = 0; i < formFill.length; i++) {
  const input = document.createElement('input');
  const label = document.createElement('label');

  label.innerText = formFill[i][0].toUpperCase() + formFill[i].slice(1) + ':';
  label.setAttribute('for', formFill[i]);
  form.append(label);

  if (i === 2) {
    const select = document.createElement('select');

    select.setAttribute('id', formFill[i]);
    select.setAttribute('name', formFill[i]);
    select.setAttribute('data-qa', formFill[i]);

    const officeLocations = [];

    for (let o = 0; o < table.tBodies[0].rows.length; o++) {
      if (
        !officeLocations.includes(table.tBodies[0].rows[o].cells[2].innerText)
      ) {
        officeLocations.push(table.tBodies[0].rows[o].cells[2].innerText);
      }
    }

    officeLocations.forEach((x) => {
      const option = document.createElement('option');

      option.setAttribute('value', x);
      option.innerText = x;
      select.append(option);
    });

    label.append(select);
  } else {
    input.setAttribute('type', i > 2 ? 'number' : 'text');
    input.setAttribute('id', formFill[i]);
    input.setAttribute('name', formFill[i]);
    input.setAttribute('data-qa', formFill[i]);
    label.append(input);
  }
}

const button = document.createElement('button');

button.innerText = 'Save to table';
form.append(button);
table.insertAdjacentElement('afterend', form);

button.addEventListener('click', (e) => {
  const notification = document.createElement('div');
  const alertTitle = document.createElement('h2');
  const message = document.createElement('p');

  e.preventDefault();

  if (
    document.getElementById('name').value.length >= 4 &&
    document.getElementById('age').value >= 18 &&
    document.getElementById('age').value < 90 &&
    document.getElementById('position').value !== '' &&
    document.getElementById('office').value !== '' &&
    document.getElementById('salary').value !== ''
  ) {
    const newTR = document.createElement('tr');

    for (const cell of formFill) {
      const newTD = document.createElement('td');

      if (cell === 'salary') {
        const salary = '$' + document.getElementById(cell).value;

        newTD.innerText =
          salary.length > 4
            ? salary.slice(0, -3) + ',' + salary.slice(-3)
            : salary;
      } else {
        newTD.innerText = document.getElementById(cell).value;
      }

      newTR.append(newTD);
    }

    table.tBodies[0].append(newTR);
    form.reset();
    notification.classList.add('success');
    alertTitle.innerText = 'Success';
    message.innerText = 'Data is added to the table!';
    notification.append(alertTitle, message);
  } else {
    alertTitle.innerText = 'ERROR';
    message.innerText = 'Data is not good enough';
    notification.classList.add('error');
    notification.append(alertTitle, message);
  }
  notification.setAttribute('data-qa', 'notification');
  document.body.append(notification);
});
// #endregion adding form

// #region double-click editing

// #endregion double-click editing
