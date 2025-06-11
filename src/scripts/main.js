'use strict';

// write code here
const colNames = document.querySelectorAll('thead th');

const tableBody = document.querySelector('tbody');

colNames.forEach((column, index) => {
  column.setAttribute('data-column', column.textContent.toLowerCase());

  // true for asc, false for desc
  let sortDir = true;

  column.addEventListener('click', () => {
    const rowsArr = Array.from(tableBody.querySelectorAll('tr'));
    const col = column.getAttribute('data-column');

    rowsArr.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      if (sortDir) {
        switch (col) {
          case 'name':
          case 'position':
            return cellA.localeCompare(cellB);
          case 'age':
            return Number(cellA) - Number(cellB);
          case 'salary':
            const salaryA = Number(cellA.replace(/[$,]/g, ''));
            const salaryB = Number(cellB.replace(/[$,]/g, ''));

            return salaryA - salaryB;
        }
      } else {
        switch (col) {
          case 'name':
          case 'position':
            return cellB.localeCompare(cellA);
          case 'age':
            return Number(cellB) - Number(cellA);
          case 'salary':
            const salaryA = Number(cellA.replace(/[$,]/g, ''));
            const salaryB = Number(cellB.replace(/[$,]/g, ''));

            return salaryB - salaryA;
        }
      }
    });

    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    rowsArr.forEach((row) => tableBody.appendChild(row));

    sortDir = !sortDir;
  });
});

tableBody.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow || !tableBody.contains(clickedRow)) {
    return;
  }

  const currentlyActive = tableBody.querySelector('.active');

  if (currentlyActive) {
    currentlyActive.classList.remove('active');
  }

  clickedRow.classList.add('active');
});

const newForm = document.createElement('form');

newForm.classList.add('new-employee-form');

const fieldArr = ['Name', 'Position', 'Office', 'Age', 'Salary'];

for (let i = 0; i < fieldArr.length; i++) {
  const label = document.createElement('label');

  const labelText = document.createTextNode(`${fieldArr[i]}:`);

  label.appendChild(labelText);

  if (fieldArr[i] === 'Office') {
    const select = document.createElement('select');

    select.name = fieldArr[i].toLowerCase();

    const officeOptions = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    for (const off of officeOptions) {
      const opt = document.createElement('option');

      opt.value = off;
      opt.textContent = off;
      select.appendChild(opt);
    }

    select.setAttribute('data-qa', fieldArr[i].toLowerCase());
    select.required = true;

    label.appendChild(select);
  } else {
    const input = document.createElement('input');

    input.name = fieldArr[i].toLowerCase();

    if (fieldArr[i] === 'Age' || fieldArr[i] === 'Salary') {
      input.type = 'number';
      input.min = '0'; // optional: prevent negative numbers
    } else {
      input.type = 'text';
    }

    input.setAttribute('data-qa', fieldArr[i].toLowerCase());
    input.required = true;

    label.appendChild(input);
  }

  newForm.appendChild(label);
}

const submitForm = document.createElement('button');

submitForm.type = 'submit';
submitForm.textContent = 'Save to table';

newForm.appendChild(submitForm);

document.querySelector('table').after(newForm);

submitForm.addEventListener('click', (e) => {
  e.preventDefault();

  const form = e.target.form;

  if (!form.checkValidity()) {
    form.reportValidity();

    return;
  }

  const formData = new FormData(form);

  const data = {};

  formData.forEach((value, key) => {
    if (key === 'salary' || key === 'age') {
      data[key] = Number(value);
    } else {
      data[key] = value;
    }
  });

  const notification = document.createElement('div');
  const notTitle = document.createElement('h2');
  const notDesc = document.createElement('p');

  notification.classList.add('notification');
  notTitle.classList.add('title');

  notification.appendChild(notTitle);
  notification.appendChild(notDesc);

  if (data.name.length < 4) {
    notification.classList.add('notification', 'error');
    notTitle.textContent = 'Error';
    notDesc.textContent = 'The name should be at least 4 letters long';
    notification.setAttribute('data-qa', 'notification');

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);

    return;
  }

  if (data.age < 18) {
    notification.classList.add('notification', 'error');
    notTitle.textContent = 'Error';
    notDesc.textContent = 'The employee should be at least 18 years old';
    notification.setAttribute('data-qa', 'notification');

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);

    return;
  }

  if (data.age > 90) {
    notification.classList.add('notification', 'error');
    notTitle.textContent = 'Error';
    notDesc.textContent = 'The employee should be at most 90 years old';
    notification.setAttribute('data-qa', 'notification');

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);

    return;
  }

  const newRow = document.createElement('tr');

  data.salary = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data.salary);

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const td = document.createElement('td');

      td.textContent = data[key];
      newRow.appendChild(td);
    }
  }

  tableBody.appendChild(newRow);

  notification.classList.add('notification', 'success');
  notTitle.textContent = 'Success';
  notDesc.textContent = 'New employee added successfully';
  notification.setAttribute('data-qa', 'notification');

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
});
