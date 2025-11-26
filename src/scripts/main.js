'use strict';

const trHead = document.querySelector('tr');
const th = [...trHead.querySelectorAll('th')];
const tbody = document.querySelector('tbody');
const trBody = [...tbody.querySelectorAll('tr')];
const sortDirections = {};
let currentSortedIndex = null;

th.forEach((item, index) => {
  item.addEventListener('click', () => {
    if (currentSortedIndex !== index) {
      sortDirections[index] = true;
      currentSortedIndex = index;
    } else {
      if (sortDirections[index] === true) {
        sortDirections[index] = false;
      } else {
        sortDirections[index] = true;
      }
    }

    const rows = [...tbody.querySelectorAll('tr')];

    rows.sort((rowA, rowB) => {
      const cellA = rowA.children[index].textContent.trim();
      const cellB = rowB.children[index].textContent.trim();

      if (!isNaN(cellA) && !isNaN(cellB)) {
        if (sortDirections[index] === true) {
          return Number(cellA) - Number(cellB);
        } else {
          return Number(cellB) - Number(cellA);
        }
      }

      const numA = Number(
        cellA.split('').slice(1).join('').split(',').join(''),
      );
      const numB = Number(
        cellB.split('').slice(1).join('').split(',').join(''),
      );

      if (!isNaN(numA) && !isNaN(numB)) {
        if (sortDirections[index] === true) {
          return numA - numB;
        } else {
          return numB - numA;
        }
      }

      if (sortDirections[index] === true) {
        return cellA.localeCompare(cellB);
      } else {
        return cellB.localeCompare(cellA);
      }
    });
    rows.forEach((row) => tbody.append(row));
  });
});

trBody.forEach((row) => {
  row.addEventListener('click', () => {
    const allRows = tbody.querySelectorAll('tr');

    allRows.forEach((r) => r.classList.remove('active'));
    row.classList.add('active');
  });
});

const body = document.querySelector('body');
const form = document.createElement('form');

form.classList.add('new-employee-form');

function CreateLabelAndInput(labelText, inputName, inputType = 'text') {
  const label = document.createElement('label');

  label.textContent = labelText;

  const input = document.createElement('input');

  input.name = inputName;
  input.type = inputType;
  input.dataset.qa = inputName;
  label.append(input);

  return label;
}

const nameField = CreateLabelAndInput('Name: ', 'name');
const positionField = CreateLabelAndInput('Position: ', 'position');
const ageField = CreateLabelAndInput('Age: ', 'age', 'number');
const salaryField = CreateLabelAndInput('Salary: ', 'salary', 'number');

const officeLabel = document.createElement('label');

officeLabel.textContent = 'Office: ';

const officeSelect = document.createElement('select');

officeSelect.name = 'office';
officeSelect.dataset.qa = 'office';

const offices = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

offices.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  officeSelect.append(option);
});

officeLabel.append(officeSelect);
form.append(nameField, positionField, officeLabel, ageField, salaryField);

const submitButton = document.createElement('button');

submitButton.type = 'submit';
submitButton.textContent = 'Save to table';
form.append(submitButton);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = form.children[0].querySelector('input').value.trim();
  const positionValue = form.children[1].querySelector('input').value.trim();
  const officeValue = form.children[2].querySelector('select').value.trim();
  const ageValue = Number(form.children[3].querySelector('input').value.trim());
  const salaryValue = Number(
    form.children[4].querySelector('input').value.trim(),
  );

  if (nameValue.length < 4) {
    pushNotifications(
      10,
      10,
      'Name is too short',
      'Name must be at least 4 chracters long',
      'error',
    );

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    pushNotifications(
      10,
      10,
      'Invalid Age',
      'You have to be older than 18 and younger than 90',
      'error',
    );

    return;
  }

  if (!positionValue) {
    pushNotifications(
      10,
      10,
      'Position is empty',
      'Position field cannot be empty',
      'error',
    );

    return;
  }

  if (!salaryValue) {
    pushNotifications(
      10,
      10,
      'Position is empty',
      'Are you gonna work for free?',
      'warning',
    );

    return;
  }

  const formattedSalary = `$${salaryValue.toLocaleString('en-US')}`;
  const newRow = document.createElement('tr');
  const newRowValues = [
    nameValue,
    positionValue,
    officeValue,
    ageValue,
    formattedSalary,
  ];

  newRowValues.forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;

    newRow.append(td);
  });
  tbody.append(newRow);

  newRow.addEventListener('click', () => {
    const allRows = tbody.querySelectorAll('tr');

    allRows.forEach((r) => r.classList.remove('active'));
    newRow.classList.add('active');
  });

  pushNotifications(
    10,
    10,
    'Congratulations!',
    'new employee is successfully added to the table',
    'success',
  );

  form.reset();
});

const pushNotifications = (posTop, posRight, title, description, type) => {
  const notifications = document.createElement('div');

  notifications.classList.add('notification', type);
  notifications.style.top = `${posTop}px`;
  notifications.style.right = `${posRight}px`;
  notifications.dataset.qa = 'notification';

  const h2 = document.createElement('h2');

  h2.classList.add('title');
  h2.textContent = title;

  const p = document.createElement('p');

  p.textContent = description;
  notifications.append(h2, p);

  document.body.append(notifications);

  setTimeout(() => {
    notifications.style.display = 'none';
  }, 5000);
};

body.append(form);
