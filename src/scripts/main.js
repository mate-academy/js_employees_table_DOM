'use strict';

const headers = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const form = document.createElement('form');
const labelsName = ['name', 'position', 'office', 'age', 'salary'];
const optionLabels = [
  'Edinburgh',
  'London',
  'New York',
  'San Francisco',
  'Singapore',
  'Tokyo',
];
let selectedLine;

// Form
{
  form.classList.add('new-employee-form');

  labelsName.forEach((labelName, i) => {
    form.append(document.createElement('label'));

    form.children[i].append(
      `${labelName.charAt(0).toUpperCase() + labelName.slice(1)}: `,
    );

    if (labelName !== 'office') {
      form.children[i].append(document.createElement('input'));
    } else {
      form.children[i].append(document.createElement('select'));
    }
    form.children[i].firstElementChild.dataset.qa = labelName;
    form.children[i].firstElementChild.setAttribute('name', labelName);

    if (labelName === 'name' || labelName === 'position') {
      form.children[i].firstElementChild.type = 'text';
    }

    if (labelName === 'age' || labelName === 'salary') {
      form.children[i].firstElementChild.type = 'number';
    }
  });

  optionLabels.forEach((optionLabel, i) => {
    form.querySelector('select').append(document.createElement('option'));
    form.querySelector('select').children[i].value = optionLabel;
    form.querySelector('select').children[i].textContent = optionLabel;
  });

  const button = document.createElement('button');

  button.setAttribute('type', 'submit');
  button.textContent = 'Save to table';
  form.append(button);
}

document.body.append(form);
// Sort

headers.addEventListener('click', (e) => {
  const rows = [...tbody.querySelectorAll('tr')];
  const i = e.target.cellIndex;
  const order = e.target.dataset.order === 'asc' ? 'desc' : 'asc';

  e.target.dataset.order = order;

  rows.sort((tr1, tr2) => {
    let cell1, cell2;

    if (order === 'asc') {
      cell1 = tr1.cells[i].textContent;
      cell2 = tr2.cells[i].textContent;
    } else {
      cell1 = tr2.cells[i].textContent;
      cell2 = tr1.cells[i].textContent;
    }

    if (e.target.textContent === 'Age' || e.target.textContent === 'Salary') {
      return cell1.replace(/\D/g, '') - cell2.replace(/\D/g, '');
    } else {
      return cell1.localeCompare(cell2);
    }
  });
  document.querySelector('tbody').append(...rows);
});

// Select

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (selectedLine) {
    selectedLine.classList.remove('active');
  }

  row.classList.add('active');
  selectedLine = row;
});

// Add employee

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = form.name.value.trim();
  const positionValue = form.position.value.trim();
  const officeValue = form.office.value;
  const ageValue = form.age.value.trim();
  const salaryValue = form.salary.value.trim();

  if (
    !nameValue ||
    !positionValue ||
    !officeValue ||
    !ageValue ||
    !salaryValue
  ) {
    pushNotification('All fields are required.', 'error');

    return;
  }

  if (nameValue.length < 4) {
    pushNotification('Name is too short.', 'error');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    pushNotification('Age must be between 18 and 90.', 'error');

    return;
  }

  tbody.append(document.createElement('tr'));

  labelsName.forEach(() => {
    tbody.lastElementChild.append(document.createElement('td'));
  });
  tbody.lastElementChild.children[0].textContent = nameValue;
  tbody.lastElementChild.children[1].textContent = positionValue;
  tbody.lastElementChild.children[2].textContent = officeValue;
  tbody.lastElementChild.children[3].textContent = ageValue;

  tbody.lastElementChild.children[4].textContent = new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    },
  ).format(Number(salaryValue));

  pushNotification(
    'A new employee is successfully added to the table',
    'success',
  );

  form.reset();
});

// Notification

function pushNotification(description, type) {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', type);

  notificationTitle.classList.add('title');
  notificationTitle.textContent = type.charAt(0).toUpperCase() + type.slice(1);

  notificationText.textContent = description;

  notification.append(notificationTitle);
  notification.append(notificationText);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
}

tbody.addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const initialValue = e.target.textContent.trim();

  e.target.textContent = '';

  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.type = 'text';
  input.value = initialValue;

  e.target.appendChild(input);
  input.focus();

  input.addEventListener('keypress', (e2) => {
    if (e2.key === 'Enter') {
      e.target.textContent = input.value.trim() || initialValue;
    }
  });
});
