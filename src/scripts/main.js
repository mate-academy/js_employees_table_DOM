'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('th');

const rows = table.querySelectorAll('tr');

const tbody = table.tBodies[0];

rows.forEach((row) => {
  row.addEventListener('click', (e) => {
    if (e.target.tagName === 'TD') {
      rows.forEach((r) => {
        r.classList.remove('active');
      });
      row.classList.add('active');
    }
  });
});

headers.forEach((header, index) => {
  let order = 1;

  header.addEventListener('click', () => {
    sortTable(index, order);
    order = -order;
  });
});

const sortTable = (columIndex, order) => {
  const body = table.tBodies[0];
  const tableArray = Array.from(body.rows);

  const sortedRows = tableArray.sort((a, b) => {
    let Acell = a.cells[columIndex].innerText.toLowerCase();
    let Bcell = b.cells[columIndex].innerText.toLowerCase();

    if (Acell.includes('$')) {
      Acell = parseFloat(Acell.replace(/[\\$,]/g, ''));
      Bcell = parseFloat(Bcell.replace(/[\\$,]/g, ''));

      return order * (Acell - Bcell);
    }

    return order * Acell.localeCompare(Bcell);
  });

  sortedRows.forEach((row) => body.appendChild(row));
};

const formContainer = document.createElement('form');

formContainer.classList.add('new-employee-form');

const labels = ['Name', 'Position', 'Office', 'Age', 'Salary'];

const submitBtn = document.createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

labels.forEach((labelText) => {
  const label = document.createElement('label');

  label.textContent = `${labelText}: `;

  if (labelText === 'Office') {
    const select = document.createElement('select');

    select.name = `${labelText.toLowerCase()}`;

    const options = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    options.forEach((optionText) => {
      const option = document.createElement('option');

      option.textContent = optionText;
      option.value = optionText;

      select.appendChild(option);
    });

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.name = `${labelText.toLowerCase()}`;
    input.placeholder = `${labelText}`;
    input.setAttribute('data-qa', `${labelText.toLowerCase()}`);
    input.type = 'text';

    if (labelText === 'Age' || labelText === 'Salary') {
      input.type = 'number';
    }

    input.setAttribute('required', true);

    label.appendChild(input);
  }

  formContainer.appendChild(label);
});
formContainer.appendChild(submitBtn);

document.body.appendChild(formContainer);

const showNotification = (message, type) => {
  const notification = document.createElement('div');

  notification.textContent = message;
  notification.classList.add(type, 'notification');
  notification.setAttribute('data-qa', 'notification');

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

formContainer.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const formData = new FormData(formContainer);

  const fname = formData.get('name').trim();
  const age = parseInt(formData.get('age'));
  let salary = formData.get('salary').trim();
  const office = formData.get('office');
  const position = formData.get('position').trim();

  const numericSalary = parseFloat(salary.replace(/[\\$,]/g, ''));

  salary = `$${numericSalary.toLocaleString()}`;

  if (fname.length < 4) {
    showNotification(
      'Error: name should be at least 4 characters long',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    showNotification('Error: age must be betwen 18 and 90', 'error');

    return;
  }

  const newRow = tbody.insertRow();

  const formValues = [fname, position, office, age, salary];

  formValues.forEach((value) => {
    const newCell = newRow.insertCell();

    newCell.textContent = value;
  });

  showNotification('Success: Employee added to the table!', 'success');

  formContainer.reset();
});
