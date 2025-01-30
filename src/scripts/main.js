'use strict';

const sortDirection = {};
const table = document.querySelector('table');
const tHead = table.querySelector('thead');
const tBody = table.querySelector('tbody');
const body = document.querySelector('body');

tHead.addEventListener('click', (e) => {
  const tH = e.target.closest('th');

  if (tH) {
    tHead.querySelectorAll('th').forEach((th) => th.classList.remove('active'));
    tH.classList.add('active');

    sortTable(tH);
  }
});

function sortTable(tH) {
  const columnIndex = Array.from(tH.parentNode.children).indexOf(tH);
  const columnName = tH.dataset.column || columnIndex;

  if (!sortDirection[columnName]) {
    sortDirection[columnName] = 'desc';
  } else {
    sortDirection[columnName] =
      sortDirection[columnName] === 'asc' ? 'desc' : 'asc';
  }

  const direction = sortDirection[columnName];

  const rows = [...tBody.querySelectorAll('tr')];

  rows.sort((sortA, sortB) => {
    const cellA = sortA.children[columnIndex].innerText
      .trim()
      .replace(/[$,]/g, '');
    const cellB = sortB.children[columnIndex].innerText
      .trim()
      .replace(/[$,]/g, '');

    const isNumber = !isNaN(cellA) && !isNaN(cellB);

    if (isNumber) {
      return direction === 'asc'
        ? parseFloat(cellA) - parseFloat(cellB)
        : parseFloat(cellB) - parseFloat(cellA);
    } else {
      return direction === 'asc'
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });

  tBody.innerHTML = '';
  rows.forEach((row) => tBody.appendChild(row));
}

const form = document.createElement('form');
const inputName = document.createElement('input');
const inputPosition = document.createElement('input');
const inputAge = document.createElement('input');
const inputSalary = document.createElement('input');
const select = document.createElement('select');
const button = document.createElement('button');

const labelName = document.createElement('label');
const labelPosition = document.createElement('label');
const labelOffice = document.createElement('label');
const labelAge = document.createElement('label');
const lableSalary = document.createElement('label');

const option1 = document.createElement('option');
const option2 = document.createElement('option');
const option3 = document.createElement('option');
const option4 = document.createElement('option');
const option5 = document.createElement('option');
const option6 = document.createElement('option');

option1.textContent = 'Tokyo';
option2.textContent = 'Singapore';
option3.textContent = 'London';
option4.textContent = 'New York';
option5.textContent = 'Edinburgh';
option6.textContent = 'San Francisco';

button.textContent = 'Save to Table';

labelName.textContent = 'Name :';
labelName.appendChild(inputName);
form.appendChild(labelName);
inputName.id = 'name';
inputName.dataset.qa = 'name';
inputName.type = 'text';

labelPosition.textContent = 'Position';
labelPosition.appendChild(inputPosition);
form.appendChild(labelPosition);
inputPosition.id = 'position';
inputPosition.dataset.qa = 'position';

labelOffice.textContent = 'Office';
labelOffice.appendChild(select);
select.append(option1, option2, option3, option4, option5, option6);
form.appendChild(labelOffice);
select.id = 'office';
select.dataset.qa = 'office';

labelAge.textContent = 'Age';
labelAge.appendChild(inputAge);
form.appendChild(labelAge);
inputAge.id = 'age';
inputAge.dataset.qa = 'age';

lableSalary.textContent = 'Salary';
lableSalary.appendChild(inputSalary);
form.appendChild(lableSalary);
inputSalary.id = 'salary';
inputSalary.dataset.qa = 'salary';

form.appendChild(button);
form.classList.add('new-employee-form');

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.style.position = 'absolute';
  notification.style.right = `${posRight}px`;
  notification.style.top = `${posTop}px`;

  const titleText = document.createElement('h2');

  titleText.classList.add('title');
  titleText.textContent = title;

  const descriptions = document.createElement('p');

  descriptions.textContent = description;

  notification.appendChild(titleText);
  notification.appendChild(descriptions);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.behavior = 'smooth';
    notification.remove();
  }, 3000);
};

tBody.addEventListener('dblclick', (e) => {
  const cell = e.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  const originalText = cell.textContent.trim();

  const input = document.createElement('input');

  input.type = 'text';
  input.value = originalText;

  cell.textContent = '';
  cell.appendChild(input);

  input.focus();

  input.addEventListener('blur', () => {
    const newValue = input.value.trim();

    if (newValue !== originalText && newValue !== '') {
      cell.textContent = newValue;
    } else {
      cell.textContent = originalText;
    }
  });

  input.addEventListener('keydown', (y) => {
    if (y.key === 'Enter') {
      input.blur();
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameId = document.querySelector('#name').value;
  const positionId = document.querySelector('#position').value;
  const officeId = document.querySelector('#office').value;
  const ageId = document.querySelector('#age').value;
  let salaryId = document.querySelector('#salary').value;

  if (nameId === '' || !isNaN(nameId)) {
    pushNotification(
      300,
      10,
      'Помилка!',
      'Будь ласка, введіть правильне ім’я!',
      'error',
    );
  }

  // Перевірка для positionId
  if (positionId === '' || !isNaN(positionId)) {
    setTimeout(() => {
      pushNotification(
        400,
        10,
        'Помилка!',
        'Будь ласка, введіть правильну посаду',
        'error',
      );
    }, 300);
  }

  // Перевірка для officeId
  if (!officeId) {
    setTimeout(() => {
      pushNotification(
        500,
        10,
        'Помилка!',
        'Будь ласка, введіть ваш офіс',
        'error',
      );
    }, 600);
  }

  // Перевірка для ageId
  if (ageId < 18 || ageId > 90 || isNaN(ageId)) {
    setTimeout(() => {
      pushNotification(
        600,
        10,
        'Помилка!',
        'Будь ласка, введіть правильний вік від 18 до 90!',
        'error',
      );
    }, 800);
  }

  // Перевірка для salaryId
  if (!salaryId || isNaN(salaryId)) {
    setTimeout(() => {
      pushNotification(
        700,
        10,
        'Помилка!',
        'Будь ласка, введіть правильну зарплату ',
        'error',
      );
    }, 1000);
  } else {
    setTimeout(() => {
      pushNotification(
        500,
        10,
        'В таблицю доддано нове поле',
        'В таблиці зявився новий рядок з вказаними даними',
        'success',
      );
    }, 1000);
    salaryId = parseFloat(salaryId).toLocaleString();
    salaryId = `$${salaryId}`;

    // eslint-disable-next-line no-console
    console.log(nameId, positionId, officeId, ageId, salaryId);

    const newRow = tBody.insertRow();

    newRow.insertCell(0).textContent = nameId;
    newRow.insertCell(1).textContent = positionId;
    newRow.insertCell(2).textContent = officeId;
    newRow.insertCell(3).textContent = ageId;
    newRow.insertCell(4).textContent = salaryId;

    form.reset();
  }
});

body.appendChild(form);
