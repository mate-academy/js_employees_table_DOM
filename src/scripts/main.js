'use strict';

const table = document.querySelector('table');
const headers = table.querySelectorAll('thead th');
const tbody = table.querySelector('tbody');

const sortState = {
  columnIndex: null,
  direction: 'asc',
};

headers.forEach((header, idx) => {
  const rows = Array.from(tbody.querySelectorAll('tr'));

  header.addEventListener('click', () => {
    if (sortState.columnIndex === idx) {
      sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortState.columnIndex = idx;
      sortState.direction = 'asc';
    }

    const direction = sortState.direction;
    const type = idx === 3 || idx === 4 ? 'number' : 'string'; // Age or Salary

    rows.sort((a, b) => {
      let aText = a.children[idx].textContent.trim();
      let bText = b.children[idx].textContent.trim();

      if (type === 'number') {
        aText = parseFloat(aText.replace(/[$,]/g, ''));
        bText = parseFloat(bText.replace(/[$,]/g, ''));
      }

      if (aText > bText) {
        return direction === 'asc' ? 1 : -1;
      }

      if (aText < bText) {
        return direction === 'asc' ? -1 : 1;
      }

      return 0;
    });

    tbody.innerHTML = '';
    tbody.append(...rows);
  });

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      rows.forEach((r) => r.classList.remove('active'));

      row.classList.add('active');
    });
  });
});

function createElement(element) {
  return document.createElement(element);
}

const form = createElement('form');

form.classList.add('new-employee-form');

// NAME
const nameLabel = createElement('label');

nameLabel.textContent = 'Name: ';

const nameInput = createElement('input');

nameInput.name = 'name';
nameInput.type = 'text';
nameInput.setAttribute('data-qa', 'name');
nameLabel.append(nameInput);

// POSITION
const positionLabel = createElement('label');

positionLabel.textContent = 'Position: ';

const positionInput = createElement('input');

positionInput.name = 'position';
positionInput.type = 'text';
positionInput.setAttribute('data-qa', 'position');
positionLabel.append(positionInput);

// AGE
const ageLabel = createElement('label');

ageLabel.textContent = 'Age: ';

const ageInput = createElement('input');

ageInput.name = 'age';
ageInput.type = 'number';
ageInput.setAttribute('data-qa', 'age');
ageLabel.append(ageInput);

// SALARY
const salaryLabel = createElement('label');

salaryLabel.textContent = 'Salary: ';

const salaryInput = createElement('input');

salaryInput.name = 'salary';
salaryInput.type = 'number';
salaryInput.setAttribute('data-qa', 'salary');
salaryLabel.append(salaryInput);

// SELECT
const select = createElement('select');

select.setAttribute('data-qa', 'office');

const cities = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];
const officeLabel = createElement('label');

officeLabel.textContent = 'Office: ';
officeLabel.append(select);

cities.forEach((city) => {
  const option = createElement('option');

  option.textContent = city;
  option.value = city;
  select.append(option);
});

// SUBMIT

const submitBtn = createElement('button');

submitBtn.type = 'submit';
submitBtn.textContent = 'Save to table';

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameValue = nameInput.value.trim();
  const positionValue = positionInput.value.trim();
  const officeValue = select.value;
  const ageValue = +ageInput.value;
  const salaryValue = +salaryInput.value;

  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');

  if (nameValue.length < 4 || !positionValue) {
    notification.classList.add('error');

    notification.textContent =
      'Error: Name must be at least 4 characters long.';
    form.after(notification);

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    notification.classList.add('error');
    notification.textContent = 'Error: Age must be between 18 and 90.';
    form.after(notification);

    return;
  }

  const formattedSalary = '$' + salaryValue.toLocaleString();

  const newRow = document.createElement('tr');
  const values = [
    nameValue,
    positionValue,
    officeValue,
    ageValue,
    formattedSalary,
  ];

  values.forEach((val) => {
    const td = document.createElement('td');

    td.textContent = val;
    newRow.appendChild(td);
  });

  tbody.appendChild(newRow);

  notification.classList.add('success');
  notification.textContent = 'Employee added successfully!';
  form.after(notification);

  form.reset();
});

form.append(nameLabel, positionLabel, ageLabel, salaryLabel, select, submitBtn);
document.body.append(form);
