'use strict';

const tBody = document.querySelector('tbody');
const tHead = document.querySelector('thead');
const saveButton = document.querySelector('.save-to-table');
const formNameInpt = document.querySelector('#new-employer-name-input');
const formPositionInpt = document.querySelector('#new-employer-position-input');
const formOfficeInpt = document.querySelector('#new-employer-office-select');
const formAgeInpt = document.querySelector('#new-employer-age-input');
const formSalaryInpt = document.querySelector('#new-employer-salary-input');

// Event Listener to make row active onclick
tBody.addEventListener('click', (event) => {
  const item = event.target;
  const rows = tBody.querySelectorAll('tr');

  rows.forEach(row => row.classList.remove('active'));

  if (item.tagName !== 'TD') {
    return;
  }

  item.parentElement.classList.toggle('active');
});

// Event Listener to sort table
tHead.addEventListener('click', (event) => {
  const rows = [...tBody.querySelectorAll('tr')];
  const heading = event.target;
  const indexOfSortingCell = heading.cellIndex;

  rows.sort((a, b) => {
    let aText = a.cells[indexOfSortingCell].textContent;
    let bText = b.cells[indexOfSortingCell].textContent;

    if (aText.startsWith('$')) {
      aText = aText.slice(1).split(',').join('');
      bText = bText.slice(1).split(',').join('');
    }

    if (!heading.classList.contains('asc-sorted')) {
      if (isNaN(+aText)) {
        return aText.localeCompare(bText);
      }

      return +aText - +bText;
    }

    if (isNaN(+aText)) {
      return bText.localeCompare(aText);
    }

    return +bText - +aText;
  });

  heading.classList.toggle('asc-sorted');

  rows.forEach(row => {
    tBody.appendChild(row);
  });
});

// Function of adding new employee to table
function addNewEmployer(
  name,
  position,
  office,
  age,
  salary
) {
  const newRow = tBody.insertRow();

  const nameCol = newRow.insertCell(0);

  nameCol.textContent = name;

  const positionCol = newRow.insertCell(1);

  positionCol.textContent = position;

  const officeCol = newRow.insertCell(2);

  officeCol.textContent = office;

  const ageCol = newRow.insertCell(3);

  ageCol.textContent = age;

  const salaryCol = newRow.insertCell(4);

  salaryCol.textContent = salary;
};

// Event listener of form-button to add new employee to table
saveButton.addEventListener('click', (event) => {
  event.preventDefault();

  const name = formNameInpt.value;
  const position = formPositionInpt.value;
  const office = formOfficeInpt.value;
  const age = formAgeInpt.value;
  let salary = formSalaryInpt.value;

  salary = '$' + salary.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (name.length < 4) {
    pushNotification(
      'Too short name',
      'Your name should contain at least 4 letters',
      'error');
  } else if (!position.length) {
    pushNotification(
      'We would like to know your position',
      'Fill position field',
      'error');
  } else if (+age < 18 || +age > 90) {
    pushNotification(
      'We have age requirements',
      'Your age cannot be less then 18 and bigger then 90',
      'error');
  } else if (salary.length < 2) {
    pushNotification(
      'Note',
      'Fill salary field',
      'error');
  } else {
    addNewEmployer(name, position, office, age, salary);

    pushNotification(
      'Success',
      'New Employee added',
      'success');

    formNameInpt.value = '';
    formPositionInpt.value = '';
    formAgeInpt.value = '';
    formSalaryInpt.value = '';
  }
});

// Function of pushing notifications
function pushNotification(title, description, type) {
  const body = document.querySelector('body');
  const div = document.createElement('div');

  div.style.cssText = `
    top: 10px;
    right: 10px;
  `;

  div.innerHTML = `
  <h2>
    ${title}
  </h2>
  <p>
    ${description}
  </p>
  `;

  div.classList.add('notification');
  div.classList.add(`${type}`);

  body.append(div);

  setTimeout(() => div.remove(), 3000);
};

// Event listener to modify text of table cells on double click
tBody.addEventListener('dblclick', (event) => {
  const item = event.target;
  const initialText = item.textContent;

  if (item.tagName !== 'TD') {
    return;
  }

  item.innerHTML = `
    <input
      name="change"
      class="cell-input"
      autocomplete="off"
    >
  `;

  tBody.addEventListener('click', (ev) => {
    if (ev.target !== item.firstElementChild && ev.target !== item) {
      item.innerHTML = initialText;
    }
  });

  item.addEventListener('keypress', (e) => {
    const keyPressed = e.key;
    const inputText = item.firstElementChild.value;

    if (keyPressed === 'Enter') {
      inputText.length
        ? item.innerHTML = inputText
        : item.innerHTML = initialText;
    }
  });
});
