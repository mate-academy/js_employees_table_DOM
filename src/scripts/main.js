'use strict';

const body = document.querySelector('body');
const tableBody = document.querySelector('tbody');
const rowsForActive = document.querySelectorAll('tbody > tr');
const nameSort = document.querySelector('thead > tr > th:nth-child(1)');
const positionSort = document.querySelector('thead > tr > th:nth-child(2)');
const officeSort = document.querySelector('thead > tr > th:nth-child(3)');
const ageSort = document.querySelector('thead > tr > th:nth-child(4)');
const salarySort = document.querySelector('thead > tr > th:nth-child(5)');
const notification = document.createElement('div');
const notificationTitle = document.createElement('h2');
const notificationMessage = document.createElement('p');

notification.classList.add('notification');
notificationTitle.classList.add('title');
notification.appendChild(notificationTitle);
notification.appendChild(notificationMessage);
notification.setAttribute('data-qa', 'notification');

let isAscendName = true;
let isAscendPosition = true;
let isAscendOffice = true;
let isAscendAge = true;
let isAscendSalary = true;

nameSort.addEventListener('click', (e) => {
  e.stopPropagation();

  const rows = Array.from(document.querySelectorAll('tbody > tr'));

  rows.sort((a, b) => {
    const textA = a.querySelector('td:nth-child(1)').textContent;
    const textB = b.querySelector('td:nth-child(1)').textContent;

    return isAscendName
      ? textA.localeCompare(textB)
      : textB.localeCompare(textA);
  });
  isAscendName = !isAscendName;
  tableBody.innerHTML = '';
  rows.forEach((row) => tableBody.appendChild(row));
});

positionSort.addEventListener('click', (e) => {
  e.stopPropagation();

  const rows = Array.from(document.querySelectorAll('tbody > tr'));

  rows.sort((a, b) => {
    const textA = a.querySelector('td:nth-child(2)').textContent;
    const textB = b.querySelector('td:nth-child(2)').textContent;

    return isAscendPosition
      ? textA.localeCompare(textB)
      : textB.localeCompare(textA);
  });
  isAscendPosition = !isAscendPosition;
  tableBody.innerHTML = '';
  rows.forEach((row) => tableBody.appendChild(row));
});

officeSort.addEventListener('click', (e) => {
  e.stopPropagation();

  const rows = Array.from(document.querySelectorAll('tbody > tr'));

  rows.sort((a, b) => {
    const textA = a.querySelector('td:nth-child(3)').textContent;
    const textB = b.querySelector('td:nth-child(3)').textContent;

    return isAscendOffice
      ? textA.localeCompare(textB)
      : textB.localeCompare(textA);
  });
  isAscendOffice = !isAscendOffice;
  tableBody.innerHTML = '';
  rows.forEach((row) => tableBody.appendChild(row));
});

ageSort.addEventListener('click', (e) => {
  e.stopPropagation();

  const rows = Array.from(document.querySelectorAll('tbody > tr'));

  rows.sort((a, b) => {
    const ageA = +a.querySelector('td:nth-child(4)').textContent;
    const ageB = +b.querySelector('td:nth-child(4)').textContent;

    return isAscendAge ? ageA - ageB : ageB - ageA;
  });
  isAscendAge = !isAscendAge;
  tableBody.innerHTML = '';
  rows.forEach((row) => tableBody.appendChild(row));
});

salarySort.addEventListener('click', (e) => {
  e.stopPropagation();

  const rows = Array.from(document.querySelectorAll('tbody > tr'));

  rows.sort((a, b) => {
    const salaryA = +a
      .querySelector('td:nth-child(5)')
      .textContent.slice(1)
      .split(',')
      .join('');
    const salaryB = +b
      .querySelector('td:nth-child(5)')
      .textContent.slice(1)
      .split(',')
      .join('');

    return isAscendSalary ? salaryA - salaryB : salaryB - salaryA;
  });
  isAscendSalary = !isAscendSalary;
  tableBody.innerHTML = '';
  rows.forEach((row) => tableBody.appendChild(row));
});

rowsForActive.forEach((row) => {
  row.addEventListener('click', (e) => {
    e.stopPropagation();

    rowsForActive.forEach((r) => {
      r.classList.remove('active');
    });
    row.classList.add('active');
  });
});

body.insertAdjacentHTML(
  'beforeend',
  `<form class="new-employee-form">
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" type="text" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age: <input name="age" type="number" data-qa="age" required></label>
  <label>Salary: <input name="salary" type="number" data-qa="salary" required></label>
  <button>Save to table</button>
  </form>
  `,
);

const button = document.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const userName = document.querySelector('[data-qa="name"]').value;
  const userPosition = document.querySelector('[data-qa="position"]').value;
  const userOffice = document.querySelector('[data-qa="office"]').value;
  const userAge = document.querySelector('[data-qa="age"]').value;
  const salaryInputValue = document.querySelector('[data-qa="salary"]').value;
  const userSalary = `$${Number(salaryInputValue).toLocaleString('en-US')}`;

  if (isValidInputs(userName, userAge)) {
    tableBody.insertAdjacentHTML(
      'beforeend',
      `<tr>
        <td>${userName}</td>
        <td>${userPosition}</td>
        <td>${userOffice}</td>
        <td>${userAge}</td>
        <td>${userSalary}</td>
      </tr>`,
    );

    notification.classList.add('success');
    notificationTitle.textContent = 'Congrats!!!';
    notificationMessage.textContent = 'Succesfully added new employee!!!';
    body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
      notification.classList.remove('success');
      notification.classList.remove('error');
    }, 2000);
  } else if (!isValidInputs(userName, userAge)) {
    notification.classList.add('error');
    notificationTitle.textContent = 'Sorry :(';
    notificationMessage.textContent = 'U need to change some input fields';
    body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
      notification.classList.remove('error');
      notification.classList.remove('success');
    }, 2000);
  }
});

function isValidInputs(username, userage) {
  if (username.length >= 4 && userage >= 18 && userage < 90) {
    return true;
  }

  return false;
}
