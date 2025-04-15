'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const headers = table.querySelectorAll('th');
const tbody = table.querySelector('tbody');
const tableRows = tbody.querySelectorAll('tr');

const thead = table.querySelector('thead');
const tr = thead.querySelector('tr');

headers.forEach((e, i) => {
  let way = true;

  e.addEventListener('click', () => {
    const trBody = Array.from(tbody.querySelectorAll('tr'));

    trBody.sort((trOne, trTwo) => {
      const rowOne = trOne.children[i].textContent.trim();
      const rowTwo = trTwo.children[i].textContent.trim();

      const convertedA = parseFloat(rowOne);
      const convertedB = parseFloat(rowTwo);

      const isNumber = !isNaN(convertedA) && !isNaN(convertedB);
      const comparison = isNumber
        ? convertedA - convertedB
        : rowOne.localeCompare(rowTwo);

      return way ? comparison : -comparison;
    });

    tbody.innerHTML = '';

    trBody.forEach((row) => tbody.appendChild(row));

    way = !way;
  });
});

tableRows.forEach((row, i) => {
  row.addEventListener('click', () => {
    if (document.querySelectorAll('.active')) {
      const activeRow = document.querySelectorAll('.active');

      activeRow.forEach((trr) => trr.classList.remove('active'));
    }

    row.classList.add('active');
  });
});

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

document.addEventListener('DOMContentLoaded', () => {
  const form = document.createElement('form');

  form.classList.add('new-employee-form');

  body.appendChild(form);

  const nameInputs = tr.querySelectorAll('th');

  nameInputs.forEach((th) => {
    const label = document.createElement('label');

    label.textContent = `${th.textContent}: `;

    if (th.textContent === 'Office') {
      const select = document.createElement('select');

      select.name = `${th.textContent.toLocaleLowerCase()}`;
      select.dataset.qa = `${th.textContent.toLocaleLowerCase()}`;

      offices.forEach((office) => {
        const option = document.createElement('option');

        option.value = `${office}`;

        option.textContent = `${office}`;

        select.appendChild(option);

        label.appendChild(select);

        form.appendChild(label);
      });
    } else {
      const input = document.createElement('input');

      input.name = `${th.textContent.toLocaleLowerCase()}`;

      if (th.textContent === 'Age' || th.textContent === 'Salary') {
        input.type = 'number';
      } else {
        input.type = 'text';
      }

      input.dataset.qa = `${th.textContent.toLocaleLowerCase()}`;

      input.setAttribute('required', 'true');

      label.appendChild(input);

      form.appendChild(label);
    }
  });

  const button = document.createElement('button');

  button.textContent = 'Save to table';

  button.type = 'submit';

  form.appendChild(button);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const namee = document.querySelector('[name="name"]').value;
    const position = document.querySelector('[name = "position"]').value;
    const office = document.querySelector('[name = "office"]').value;
    const age = document.querySelector('[name = "age"]').value;
    const salary = document.querySelector('[name = "salary"]').value;

    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');

    if (namee.length < 4) {
      const notification = document.createElement('div');
      const notTitle = document.createElement('h2');

      notTitle.textContent = 'Name should have more then 3 letters';

      notification.appendChild(notTitle);
      notification.classList = 'notification error';
      notification.dataset.qa = 'notofication';

      body.appendChild(notification);

      setTimeout(() => {
        const appearedNotification = document.querySelector(
          '.notification.error',
        );

        if (appearedNotification) {
          appearedNotification.remove();
        }
      }, 3000);
    }

    if (age < 18 || age > 90) {
      const notification = document.createElement('div');
      const notTitle = document.createElement('h2');

      notTitle.textContent =
        'Age number should be bigger than 18 and less than 90';

      notification.appendChild(notTitle);
      notification.classList = 'notification error';
      notification.dataset.qa = 'notification';

      body.appendChild(notification);

      setTimeout(() => {
        const appearedNotification = document.querySelector(
          '.notification.error',
        );

        if (appearedNotification) {
          appearedNotification.remove();
        }
      }, 3000);
    }

    if (namee.length >= 4 && age >= 18 && age <= 90) {
      nameCell.textContent = namee;

      newRow.appendChild(nameCell);

      const positionCell = document.createElement('td');

      positionCell.textContent = position;

      newRow.appendChild(positionCell);

      const officeCell = document.createElement('td');

      officeCell.textContent = office;

      newRow.appendChild(officeCell);

      const ageCell = document.createElement('td');

      ageCell.textContent = String(age);

      newRow.appendChild(ageCell);

      const salaryCell = document.createElement('td');

      salaryCell.textContent = `$${Number(salary).toLocaleString()}`;

      newRow.appendChild(salaryCell);

      tbody.appendChild(newRow);

      const notification = document.createElement('div');
      const notTitle = document.createElement('h2');

      notTitle.textContent = 'Information successfully added';

      notification.appendChild(notTitle);
      notification.dataset.qa = 'notification';
      notification.classList = 'notification success';

      body.appendChild(notification);

      setTimeout(() => {
        const appearedNotification = document.querySelector(
          '.notification.success',
        );

        if (appearedNotification) {
          appearedNotification.remove();
        }
      }, 3000);
    }
  });

  const cells = document.querySelectorAll('td');

  cells.forEach((cell) => {
    cell.addEventListener('dblclick', (e) => {
      const precedingTarget = document.querySelector('.cell-input');
      const cellInput = document.createElement('input');
      const targetCell = e.target;
      const originalText = targetCell.textContent.trim();

      if (precedingTarget) {
        precedingTarget.parentNode.textContent = precedingTarget.value;

        precedingTarget.remove();
      }

      cellInput.classList.add('cell-input');
      cellInput.type = 'text';
      cellInput.value = originalText;

      targetCell.textContent = '';

      targetCell.appendChild(cellInput);

      cellInput.addEventListener('blur', () => {
        if (cellInput.value.length === 0) {
          targetCell.textContent = originalText;
          cellInput.remove();
        } else {
          targetCell.textContent = cellInput.value;

          cellInput.remove();
        }
      });

      if (cellInput) {
        cellInput.addEventListener('keydown', (ev) => {
          if (cellInput.value.length === 0) {
            targetCell.textContent = originalText;
            cellInput.remove();
          } else {
            if (ev.key === 'Enter') {
              targetCell.textContent = cellInput.value;

              cellInput.remove();
            }
          }
        });
      }
    });
  });
});
