'use strict';

// const table = document.querySelector('table');
const theads = document.querySelectorAll('th');
const tbody = document.querySelector('table tbody');
const trArr = [...tbody.querySelectorAll('tr')];

let sortOrder = 1;
let lastColumnIndex = -1;

function sortColumns(index) {
  if (lastColumnIndex !== index) {
    sortOrder = 1;
  } else {
    sortOrder *= -1;
  }

  trArr.sort((a, b) => {
    const trA = a.cells[index].textContent;
    const trB = b.cells[index].textContent;

    if (!isNaN(trA) && !isNaN(trB)) {
      return sortOrder * (parseFloat(trA) - parseFloat(trB));
    } else {
      return sortOrder * trA.localeCompare(trB, 'en', { numeric: true });
    }
  });

  tbody.innerHTML = '';
  trArr.forEach((tr) => tbody.append(tr));

  lastColumnIndex = index;
}

theads.forEach((thead, index) => {
  thead.addEventListener('click', () => {
    sortColumns(index);
  });
});

tbody.addEventListener('click', (e) => {
  const trRows = document.querySelectorAll('tbody tr');

  trRows.forEach((trRow) => {
    trRow.classList.remove('active');
  });

  const clickRow = e.target.closest('tr');

  if (clickRow) {
    clickRow.classList.add('active');
  }
});

//* add a form to the document.
//* Form allows users to add new employees to the spreadsheet.
const form = document.createElement('form');

form.className = 'new-employee-form';
document.body.append(form);

const fealds = [
  {
    label: 'Name',
    name: 'name',
    type: 'text',
    qa: 'name',
  },
  {
    label: 'Position',
    name: 'position',
    type: 'text',
    qa: 'position',
  },
  {
    label: 'Office',
    name: ' office',
    type: 'select',
    qa: 'office',
    options: [
      'Select an office',
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ],
  },
  {
    label: 'Age',
    name: 'age',
    type: 'number',
    qa: 'age',
  },
  {
    label: 'Salary',
    name: 'salary',
    type: 'number',
    qa: 'salary',
  },
];

fealds.forEach((feald) => {
  const label = document.createElement('label');

  label.textContent = feald.label + ': ';

  let input = document.createElement('input');

  if (feald.type === 'select') {
    input = document.createElement('select');

    feald.options.forEach((option) => {
      const optionElement = document.createElement('option');

      optionElement.value = option;
      optionElement.textContent = option;
      input.appendChild(optionElement);
    });
  } else {
    input = document.createElement('input');
    input.type = feald.type;
  }

  input.name = feald.name;
  input.setAttribute('data-qa', feald.qa);
  input.required = true;
  label.appendChild(input);
  form.appendChild(label);
});

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.append(submitButton);

//* Show notification if form data is invalid.
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const newRow = document.createElement('tr');
  let valid = true;

  formData.forEach((value, key) => {
    const td = document.createElement('td');

    if (key === 'salary') {
      const normalisedSalary = parseFloat(value).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      td.textContent = normalisedSalary;
    } else {
      td.textContent = value;
    }

    newRow.append(td);

    if (!checkDataValidity(key, value)) {
      valid = false;
    }
  });

  if (valid) {
    tbody.append(newRow);
    trArr.push(newRow);
    showNotification('New employee added successfully', 'success');
    form.reset();
  } else {
    showNotification('Invalid data!', 'error');
  }
});

function checkDataValidity(id, value) {
  if (id === 'name') {
    return value.trim().length >= 4;
  }

  if (id === 'age') {
    return value >= 18 && value <= 90;
  }

  if (id === 'salary') {
    return value > 0;
  }

  return !!value.trim();
}

const notificationContainer = document.createElement('div');

notificationContainer.id = 'notification-container';
document.body.appendChild(notificationContainer);

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.className = `notification ${type}`;
  notification.setAttribute('data-qa', 'notification');
  notification.textContent = message;
  notificationContainer.innerHTML = '';
  notificationContainer.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

//* Implement editing of table cells by double-clicking on it (optional) */
tbody.addEventListener('dblclick', (e) => {
  const cell = e.target;
  const initialValue = cell.textContent;

  if (cell.tagName.toLowerCase() === 'td') {
    const input = document.createElement('input');

    input.className = 'cell-input';
    input.value = initialValue;
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();

    input.addEventListener('blur', () => {
      const newValue = input.value.trim();

      cell.textContent = newValue || initialValue;
    });

    input.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') {
        const newValue = input.value.trim();

        cell.textContent = newValue || initialValue;
      }
    });
  }
});
