/* eslint-disable no-use-before-define */
/* eslint-disable prettier/prettier */
'use strict';

const body = document.querySelector('tbody');

body.addEventListener('click', (e) => {
  const clickedRow = e.target.closest('tr');

  if (!clickedRow) {
    return;
  }

  const activeRow = body.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }
  clickedRow.classList.add('active');
});

const thead = document.querySelector('thead');

let currentColumnIndex = null;
let isAsc = true;

thead.addEventListener('click', (e) => {
  const clickedTh = e.target.closest('th');

  if (!clickedTh) {
    return;
  }

  const clickedIndex = clickedTh.cellIndex;

  if (currentColumnIndex === clickedIndex) {
    isAsc = !isAsc;
  } else {
    currentColumnIndex = clickedIndex;
    isAsc = true;
  }

  const rows = [...body.querySelectorAll('tr')];

  rows.sort((a, b) => {
    const valueA = a.cells[clickedIndex].textContent.trim();
    const valueB = b.cells[clickedIndex].textContent.trim();
    const cleanA = valueA.replace('$', '').replaceAll(',', '');
    const cleanB = valueB.replace('$', '').replaceAll(',', '');

    if (!isNaN(cleanA)) {
      return isAsc
        ? Number(cleanA) - Number(cleanB)
        : Number(cleanB) - Number(cleanA);
    }

    return isAsc ? cleanA.localeCompare(cleanB) : cleanB.localeCompare(cleanA);
  });

  body.append(...rows);
});

const form = document.createElement('form');

form.className = 'new-employee-form';
form.setAttribute('novalidate', '');

form.innerHTML = `
  <h2>New employee</h2>
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position: <input name="position" type="text" data-qa="position" required></label>
  <label>Office:
    <select name="office" data-qa="office" required>
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

  <button type="submit">Save to table</button>
`;

document.body.append(form);

function showNotification(type, title, description) {
  const currentNotification = document.querySelector('.notification');

  if (currentNotification) {
    currentNotification.remove();
  }

  const block = document.createElement('div');

  block.className = `notification ${type}`;
  block.setAttribute('data-qa', 'notification');

  block.innerHTML = `
    <h2 class="title">${title}</h2>
    ${description ? `<p>${description}</p>` : ''}
  `;

  document.body.append(block);

  setTimeout(() => {
    block.remove();
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();


  const employeeName = form.elements.name;
  const { position, office, age, salary } = form.elements;
  const nameValue = employeeName.value.trim();
  const positionValue = position.value.trim();
  const officeValue = office.value.trim();
  const ageValue = Number(age.value);
  const salaryValue = Number(salary.value);
  const formattedSalary = `$${salaryValue.toLocaleString('en-US')}`;


  if (
    !nameValue ||
  !positionValue ||
  !officeValue ||
  !age.value ||
  !salary.value ||
  nameValue.length < 4 ||
  ageValue < 18 ||
  ageValue > 90
  ) {
    return showNotification("error", "Error", "Invalid data");
  }

  if (nameValue.length < 4 || ageValue < 18 || ageValue > 90) {
    return showNotification('error', 'Error');
  }

  showNotification('success', 'Success');

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${nameValue}</td>
    <td>${positionValue}</td>
    <td>${officeValue}</td>
    <td>${ageValue}</td>
    <td>${formattedSalary}</td>
  `;

  body.append(newRow);
  form.reset();
});
