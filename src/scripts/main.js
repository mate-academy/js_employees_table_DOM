'use strict';

const sortByHead = [...document.querySelectorAll('thead th')];
const sortByFoot = [...document.querySelectorAll('tfoot th')];
const list = document.querySelector('tbody');

function sortBy(tableElement) {
  tableElement.forEach((elem) => {
    elem.addEventListener('click', () => {
      let callback;
      const index = tableElement.indexOf(elem);
      const employee = [...document.querySelectorAll('tbody tr')];

      if (
        elem.textContent === 'Name' ||
        elem.textContent === 'Position' ||
        elem.textContent === 'Office'
      ) {
        callback = (a, b) => a.localeCompare(b);
      } else if (elem.textContent === 'Age') {
        callback = (a, b) => parseInt(a) - parseInt(b);
      } else if (elem.textContent === 'Salary') {
        callback = (a, b) =>
          parseInt(a.replace(/[$,]/g, '')) - parseInt(b.replace(/[$,]/g, ''));
      }

      if (tableElement === sortByHead) {
        employee.sort((a, b) =>
          callback(
            a.cells[index].textContent.trim(),
            b.cells[index].textContent.trim(),
            // eslint-disable-next-line comma-dangle, prettier/prettier
          ),);
      } else {
        employee.sort((b, a) =>
          callback(
            a.cells[index].textContent.trim(),
            b.cells[index].textContent.trim(),
            // eslint-disable-next-line comma-dangle, prettier/prettier
          ),);
      }

      list.innerHTML = '';
      employee.forEach((item) => list.appendChild(item));
    });
  });
}

sortBy(sortByHead);
sortBy(sortByFoot);

list.addEventListener('click', (eve) => {
  const clickedRow = eve.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  document
    .querySelectorAll('tbody tr')
    .forEach((row) => row.classList.remove('active'));

  clickedRow.classList.add('active');
});

const form = document.createElement('form');
const labels = ['name', 'position', 'office', 'age', 'salary'];
const cityLabels = [
  'Edinburgh',
  'London',
  'New York',
  'San Francisco',
  'Singapore',
  'Tokyo',
];

form.classList.add('new-employee-form');

labels.forEach((lab) => {
  const label = document.createElement('label');
  let inputElem;

  label.textContent = `${lab.charAt(0).toUpperCase() + lab.slice(1)}: `;

  if (lab === 'office') {
    inputElem = document.createElement('select');

    cityLabels.forEach((city) => {
      const option = document.createElement('option');

      option.value = city;
      option.textContent = city;
      inputElem.appendChild(option);
    });
  } else {
    inputElem = document.createElement('input');

    inputElem.type = lab === 'age' || lab === 'salary' ? 'number' : 'text';
  }

  inputElem.dataset.qa = lab;
  inputElem.setAttribute('name', lab);
  inputElem.required = true;

  label.appendChild(inputElem);
  form.appendChild(label);
});

const button = document.createElement('button');

button.setAttribute('type', 'submit');
button.textContent = 'Save to table';

form.appendChild(button);
document.body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameFromInput = form.name.value.trim();
  const positionFromInput = form.position.value.trim();
  const officeFromInput = form.office.value.trim();
  const ageFromInput = parseInt(form.age.value.trim(), 10);
  const salaryFromInput = parseInt(form.salary.value.trim(), 10);

  if (nameFromInput.length < 4) {
    showNotification('Name must be at least 4 characters long.', 'error');

    return;
  }

  if (ageFromInput < 18 || ageFromInput > 90) {
    showNotification('Age must be between 18 and 90', 'error');

    return;
  }

  const newRow = document.createElement('tr');

  const cellValues = [
    nameFromInput,
    positionFromInput,
    officeFromInput,
    ageFromInput,
    `$${salaryFromInput.toLocaleString()}`,
  ];

  cellValues.forEach((value) => {
    const cell = document.createElement('td');

    cell.textContent = value;
    newRow.appendChild(cell);
  });

  list.appendChild(newRow);
  form.reset();

  showNotification('Employee added successfully!', 'success');
});

function showNotification(message, type) {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
