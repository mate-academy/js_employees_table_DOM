'use strict';

const tbody = document.querySelector('tbody');
const headers = document.querySelectorAll('thead th');

tbody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tr) {
    return;
  }

  const activeRow = document.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  tr.classList.add('active');
});

const currentSort = {
  index: null,
  order: 'asc',
};

headers.forEach((header) => {
  header.addEventListener('click', (e) => {
    const index = e.target.cellIndex;
    const rows = Array.from(tbody.querySelectorAll('tr'));

    if (index === currentSort.index) {
      currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort.index = index;
      currentSort.order = 'asc';
    }

    rows.sort((a, b) => {
      let valueA = a.cells[index].textContent;
      let valueB = b.cells[index].textContent;

      if (index === 3) {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (index === 4) {
        valueA = Number(valueA.replace('$', '').replace(/,/g, ''));
        valueB = Number(valueB.replace('$', '').replace(/,/g, ''));
      }

      let result = 0;

      if (valueA > valueB) {
        result = 1;
      }

      if (valueA < valueB) {
        result = -1;
      }

      if (currentSort.order === 'desc') {
        result *= -1;
      }

      return result;
    });

    rows.forEach((row) => {
      tbody.append(row);
    });
  });
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
document.body.append(form);

const labelName = document.createElement('label');
const inputName = document.createElement('input');

labelName.textContent = 'Name: ';
inputName.name = 'name';
inputName.type = 'text';
inputName.setAttribute('data-qa', 'name');
labelName.append(inputName);
form.append(labelName);

const labelPosition = document.createElement('label');
const inputPosition = document.createElement('input');

labelPosition.textContent = 'Position: ';
inputPosition.name = 'position';
inputPosition.type = 'text';
inputPosition.setAttribute('data-qa', 'position');
labelPosition.append(inputPosition);
form.append(labelPosition);

const labelOffice = document.createElement('label');
const selectOffice = document.createElement('select');

labelOffice.textContent = 'Office: ';
selectOffice.name = 'office';
selectOffice.setAttribute('data-qa', 'office');

const cities = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

cities.forEach((city) => {
  const option = document.createElement('option');

  option.value = city;
  option.textContent = city;
  selectOffice.append(option);
});

labelOffice.append(selectOffice);
form.append(labelOffice);

const labelAge = document.createElement('label');
const inputAge = document.createElement('input');

labelAge.textContent = 'Age: ';
inputAge.name = 'age';
inputAge.type = 'number';
inputAge.setAttribute('data-qa', 'age');
labelAge.append(inputAge);
form.append(labelAge);

const labelSalary = document.createElement('label');
const inputSalary = document.createElement('input');

labelSalary.textContent = 'Salary: ';
inputSalary.name = 'salary';
inputSalary.type = 'number';
inputSalary.setAttribute('data-qa', 'salary');
labelSalary.append(inputSalary);
form.append(labelSalary);

const button = document.createElement('button');

button.type = 'submit';
button.textContent = 'Save to table';
form.append(button);

function showNotification(type, message) {
  const existingNotification = document.querySelector(
    '[data-qa="notification"]',
  );

  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');

  notification.setAttribute('data-qa', 'notification');
  notification.classList.add(type);
  notification.textContent = message;

  document.body.append(notification);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const userName = inputName.value;
  const position = inputPosition.value;
  const office = selectOffice.value;
  const age = inputAge.value;
  const ageNumber = Number(age);
  const salary = inputSalary.value;
  const fields = [userName, position, office, age, salary];

  if (fields.some((field) => field === '')) {
    showNotification('error', 'All fields must be filled in');

    return;
  }

  if (userName.length < 4) {
    showNotification('error', 'Name is too short');

    return;
  }

  if (ageNumber < 18 || ageNumber > 90) {
    showNotification('error', 'Age must be between 18 and 90');

    return;
  }

  const formattedSalary = `$${Number(salary).toLocaleString('en-US')}`;
  const values = [userName, position, office, age, formattedSalary];
  const newRow = document.createElement('tr');

  values.forEach((value) => {
    const td = document.createElement('td');

    td.textContent = value;
    newRow.append(td);
  });

  tbody.append(newRow);

  showNotification('success', 'Employee added successfully');
  form.reset();
});
