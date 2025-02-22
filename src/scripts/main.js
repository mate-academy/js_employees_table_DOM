'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

function formatData(data) {
  return parseFloat(data.replace(/[$,]/g, ''));
}

let currentColumnIndex = null;
let sortDirection = 1;

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const rows = [...tbody.rows];
  const columnIndex = th.cellIndex;

  if (currentColumnIndex === columnIndex) {
    sortDirection *= -1;
  } else {
    sortDirection = 1;
  }

  currentColumnIndex = columnIndex;

  const sortedRows = rows.sort((rowA, rowB) => {
    const a = rowA.children[columnIndex].textContent.trim();
    const b = rowB.children[columnIndex].textContent.trim();

    const type = th.dataset.type;

    if (type === 'number') {
      return (formatData(a) - formatData(b)) * sortDirection;
    }

    return a.localeCompare(b) * sortDirection;
  });

  tbody.innerHTML = '';
  sortedRows.forEach((row) => tbody.append(row));
});

let currentRow = null;

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  if (currentRow) {
    currentRow.classList.remove('active');
  }

  row.classList.add('active');

  currentRow = row;
});

const form = document.createElement('form');

form.classList.add('new-employee-form');

const fields = {
  name: 'text',
  position: 'text',
  age: 'number',
  salary: 'number',
};

for (const [key, type] of Object.entries(fields)) {
  const label = document.createElement('label');

  label.textContent = key[0].toUpperCase() + key.slice(1) + ':';

  const input = document.createElement('input');

  input.name = key;
  input.type = type;
  input.setAttribute('data-qa', key);
  input.required = true;

  label.append(input);
  form.append(label);
}

const selectLabel = document.createElement('label');

selectLabel.textContent = 'Office:';

const selectInput = document.createElement('select');

selectInput.name = 'office';
selectInput.setAttribute('data-qa', 'office');
selectInput.required = true;

const towns = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

for (const town of towns) {
  const option = document.createElement('option');

  option.value = town;
  option.textContent = town;

  selectInput.append(option);
}

selectLabel.append(selectInput);
form.children[1].after(selectLabel);

document.body.appendChild(form);

const button = document.createElement('button');

button.textContent = 'Save to table';
button.type = 'button';
form.append(button);

button.addEventListener('click', () => {
  const pushNotification = (title, description, type) => {
    const notification = document.createElement('div');

    notification.setAttribute('data-qa', 'notification');
    notification.classList.add('notification', type);

    const notificationTitle = document.createElement('h2');

    notificationTitle.className = 'title';
    notificationTitle.textContent = title;

    const notificationDescription = document.createElement('p');

    notificationDescription.className = 'description';
    notificationDescription.textContent = description;

    notification.append(notificationTitle, notificationDescription);

    document.body.append(notification);
    setTimeout(() => notification.remove(), 2000);
  };

  let isValid = true;
  const formData = {};

  for (const inp of form.elements) {
    if (inp.name === 'name' && inp.value.length < 4) {
      pushNotification(
        'Name must have more than 4 letters',
        'Please provide a valid name with at least 4 characters',
        'error',
      );

      isValid = false;
    }

    if (inp.name === 'age' && (+inp.value < 18 || +inp.value > 90)) {
      pushNotification(
        'Age must be from 18 to 90',
        'Please enter a valid age between 18 and 90',
        'error',
      );

      isValid = false;
    }
  }

  if (!isValid) {
    return;
  }

  for (const inp of form.elements) {
    if (inp.tagName === 'INPUT' || inp.tagName === 'SELECT') {
      formData[inp.name] = inp.value;
    }
  }

  if (isValid) {
    const newRow = tbody.insertRow();

    for (const key in formData) {
      const newCell = newRow.insertCell();

      if (key === 'salary') {
        const salaryValue = +formData[key] || 0;

        newCell.textContent = '$' + salaryValue.toLocaleString('en-US');
      } else {
        newCell.textContent = formData[key];
      }
    }

    pushNotification(
      'Employee added successfully!',
      'The employee has been added to the table.',
      'success',
    );

    form.reset();
  }
});
