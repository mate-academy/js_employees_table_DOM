'use strict';

// write code here
const table = document.querySelector('table');
const thead = document.querySelector('thead');
const tbody = table.querySelector('tbody');
const headlines = [...thead.querySelectorAll('th')];
const directions = new Array(headlines.length).fill('asc');
let currentColumn = null;
let currentActiveRow = null;

thead.addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const index = headlines.findIndex((headline) => headline === e.target);
  const rows = [...tbody.querySelectorAll('tr')];

  if (currentColumn !== index) {
    for (let i = 0; i < directions.length; i++) {
      directions[i] = 'asc';
    }
  }

  currentColumn = index;

  rows.sort((row1, row2) => {
    const type = getType(index);

    if (directions[index] === 'asc') {
      if (type === 'number') {
        return (
          getNumber(row1.children[index]) - getNumber(row2.children[index])
        );
      }

      return row1.children[index].textContent.localeCompare(
        row2.children[index].textContent,
      );
    } else {
      if (type === 'number') {
        return (
          getNumber(row2.children[index]) - getNumber(row1.children[index])
        );
      }

      return row2.children[index].textContent.localeCompare(
        row1.children[index].textContent,
      );
    }
  });

  for (const row of rows) {
    tbody.append(row);
  }

  changeDirection(directions, index);
});

tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  if (currentActiveRow) {
    currentActiveRow.classList.remove('active');
  }

  row.classList.add('active');
  currentActiveRow = row;
});

function getType(i) {
  if (i === 0 || i === 1 || i === 2) {
    return 'string';
  }

  return 'number';
}

table.insertAdjacentHTML(
  'afterend',
  `
    <form class="new-employee-form">
      <label>
        Name:
        <input name="name" type="text" data-qa="name" required/>
      </label>

      <label>
        Position:
        <input name="position" type="text" data-qa="position"/>
      </label>

      <label>
        Office:
        <select name="office" data-qa="office" required>
          <option>Tokyo</option>
          <option>Singapore</option>
          <option>London</option>
          <option>New York</option>
          <option>Edinburgh</option>
          <option>San Francisco</option>
        </select>
      </label>

      <label>
        Age:
        <input name="age" data-qa="age" type="number" required/>
      </label>

      <label>
        Salary:
        <input name="salary" data-qa="salary" type="number" required/>
      </label>
      <button type="submit">Save to table</button>
    </form>
  `,
);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const employeeName = form.name.value;
  const position = form.position.value;
  const age = Number(form.age.value);
  const salary = Number(form.salary.value);
  const office = form.office.value;

  if (employeeName.length < 4) {
    pushNotification(
      'Attention',
      'Name should contain at least 4 characters',
      'error',
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification('Attention', 'Age should be between 18 and 90', 'error');

    return;
  }

  if (!position.trim()) {
    pushNotification('Attention', 'Position is required', 'error');

    return;
  }

  const row = document.createElement('tr');
  const nameCell = document.createElement('td');
  const positionCell = document.createElement('td');
  const officeCell = document.createElement('td');
  const ageCell = document.createElement('td');
  const salaryCell = document.createElement('td');

  nameCell.textContent = employeeName;
  positionCell.textContent = position;
  officeCell.textContent = office;
  ageCell.textContent = age;
  salaryCell.textContent = `$${salary.toLocaleString('en-US')}`;

  row.append(nameCell, positionCell, officeCell, ageCell, salaryCell);
  tbody.append(row);

  pushNotification('Success', 'Employee added successfully', 'success');
  form.reset();
});

const pushNotification = (title, description, type) => {
  const body = document.querySelector('body');
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notificationTitle.textContent = title;
  notificationText.textContent = description;

  notification.classList.add('notification', type);
  notification.classList.add('title');

  notification.setAttribute('data-qa', 'notification');

  notification.append(notificationTitle, notificationText);
  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
};

function getNumber(value) {
  return Number(value.textContent.replaceAll('$', '').replaceAll(',', ''));
}

function changeDirection(arr, i) {
  if (arr[i] === 'asc') {
    arr[i] = 'desc';
  } else {
    arr[i] = 'asc';
  }
}
