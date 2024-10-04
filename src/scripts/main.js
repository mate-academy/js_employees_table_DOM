'use strict';

const rows = document.querySelectorAll('tbody tr');
const headers = document.querySelectorAll('th');
let sortDirection = 1;
let activeHeader = null;
const notification = document.createElement('div');

headers.forEach((header) => {
  header.addEventListener('click', () => {
    const columnIndex = Array.from(headers).indexOf(header);

    if (activeHeader !== header) {
      sortDirection = 1;
      activeHeader = header;
    }

    const theRows = Array.from(document.querySelectorAll('tr')).slice(1, -1);

    const values = theRows.map((row) => {
      const cell = row.cells[columnIndex].textContent;

      return { row, cell };
    });

    const sortedValues = values.sort((a, b) => {
      if (a.cell[0] === '$' && b.cell[0] === '$') {
        const first = parseFloat(a.cell.replace(/[$,]/g, ''));
        const second = parseFloat(b.cell.replace(/[$,]/g, ''));

        return (first - second) * sortDirection;
      } else if (!isNaN(a.cell) && !isNaN(b.cell)) {
        return (parseFloat(a.cell) - parseFloat(b.cell)) * sortDirection;
      } else {
        return a.cell.localeCompare(b.cell) * sortDirection;
      }
    });

    const tableBody = document.querySelector('tbody');

    tableBody.innerHTML = '';

    sortedValues.forEach(({ row }) => {
      tableBody.appendChild(row);
    });

    sortDirection *= -1;
  });
});

rows.forEach((row) => {
  row.addEventListener('click', () => {
    rows.forEach((r) => r.classList.remove('active'));

    row.classList.add('active');
  });
});

const table = document.querySelector('table');
const form = document.createElement('form');
const saveButton = document.createElement('button');

table.insertAdjacentElement('afterend', form);
form.classList.add('new-employee-form');

for (let i = 0; i < headers.length - 5; i++) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  const select = document.createElement('select');

  if (i !== 2) {
    form.appendChild(label);
    input.name = `${headers[i].textContent}`;
    input.type = i === 3 && i === 4 ? 'number' : 'text';
    input.setAttribute('data-qa', `${headers[i].textContent.toLowerCase()}`);
    label.textContent = `${headers[i].textContent}: `;
    label.appendChild(input);
  } else {
    form.appendChild(label);
    select.name = `${headers[i].textContent}`;
    select.setAttribute('data-qa', `${headers[i].textContent.toLowerCase()}`);
    label.textContent = `${headers[i].textContent}: `;
    label.appendChild(select);

    const allOffices = Array.from(rows)
      .slice(1)
      .map((row) => row.cells[2].textContent);
    const offices = [...new Set(allOffices)].sort((a, b) => a.localeCompare(b));

    offices.forEach((off) => {
      const option = document.createElement('option');

      option.value = off;
      option.textContent = off;
      select.appendChild(option);
    });
  }
}

form.appendChild(saveButton);
saveButton.textContent = 'Save to table';

const title = document.createElement('p');
const description = document.createElement('p');

saveButton.addEventListener('click', (saving) => {
  saving.preventDefault();

  const inputName = document.querySelector('[data-qa="name"]').value;
  const inputPosition = document.querySelector('[data-qa="position"]').value;
  const inputOffice = document.querySelector('[data-qa="office"]').value;
  const inputAge = document.querySelector('[data-qa="age"]').value;
  const inputSal = document.querySelector('[data-qa="salary"]').value;
  const parsedSalary = parseFloat(inputSal);
  const trueSalary = `$${parseFloat(parsedSalary).toLocaleString('en-US')}`;
  const newRow = document.createElement('tr');
  const newData = [inputName, inputPosition, inputOffice, inputAge, trueSalary];

  let notificationType = '';
  let notificationMessage = '';

  if (inputName.length <= 3) {
    notificationType = 'error';
    notificationMessage = 'The name is too short';
  } else if (inputAge < 18 || inputAge > 90) {
    notificationType = 'error';
    notificationMessage = 'The age is invalid';
  } else if (newData.some((data) => data === '')) {
    notificationType = 'error';
    notificationMessage = 'Fill all inputs';
  } else if (isNaN(parsedSalary)) {
    notificationType = 'error';
    notificationMessage = 'Fill all inputs';
  } else {
    newData.forEach((data) => {
      const newCell = document.createElement('td');

      newCell.textContent = data;
      newRow.appendChild(newCell);
    });

    const tableBody = document.querySelector('tbody');

    tableBody.appendChild(newRow);
    form.reset();
    notificationType = 'success';
    notificationMessage = 'The employee is added to the table';
  }

  title.classList.add('title');
  title.textContent = `${notificationType}`;
  description.textContent = `${notificationMessage}`;
  notification.setAttribute('data-qa', 'notification');
  notification.className = `notification ${notificationType}`;
  document.body.appendChild(notification);
  notification.appendChild(title);
  notification.appendChild(description);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
});
