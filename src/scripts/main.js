'use strict';

const tBody = document.querySelector('tbody');
// region SORTING
const employees = [...document.querySelectorAll('tbody > tr')];
const tHead = document.querySelector('thead');
let lastSortedColumn = '';
let isAscending = true;

tHead.addEventListener('click', (e) => {
  const columnName = e.target.closest('th').textContent.trim().toLowerCase();

  isAscending = lastSortedColumn === columnName ? !isAscending : true;
  lastSortedColumn = columnName;
  tBody.innerHTML = '';

  employees
    .sort(
      (r1, r2) =>
        compareFunctions.get(columnName)(r1, r2) * (isAscending ? 1 : -1),
    )
    .forEach((row) => tBody.appendChild(row));
});

const compareFunctions = new Map([
  ['name', (r1, r2) => compareStrings(r1, r2, 0)],
  ['position', (r1, r2) => compareStrings(r1, r2, 1)],
  ['office', (r1, r2) => compareStrings(r1, r2, 2)],
  ['age', (r1, r2) => +r1.cells[3].textContent - +r2.cells[3].textContent],
  [
    'salary',
    (r1, r2) =>
      +r1.cells[4].textContent.replace('$', '').replace(',', '') -
      +r2.cells[4].textContent.replace('$', '').replace(',', ''),
  ],
]);

function compareStrings(row1, row2, cellIndex) {
  return row1.cells[cellIndex].textContent.localeCompare(
    row2.cells[cellIndex].textContent,
  );
}

// endregion

// region SELECT ROW
let selectedRow = null;

tBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');

  row.classList.add('active');
  selectedRow?.classList.remove('active');
  selectedRow = row;
});
// endregion

// region FORM
const body = document.querySelector('body');
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML(
  'beforeend',
  '<label>Name: <input data-qa="name" name="name"type="text" required></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Position: ' +
    '<input data-qa="position" name="position" type="text" required></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Office: <select data-qa="office" name="office" required>' +
    '<option value="Tokyo">Tokyo</option>' +
    '<option value="Singapore">Singapore</option>' +
    '<option value="London">London</option>' +
    '<option value="New York">New York</option>' +
    '<option value="Edinburgh">Edinburgh</option>' +
    '<option value="San Francisco">San Francisco</option>' +
    '</select></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Age: <input data-qa="age" name="age" ' +
    'type="number" min="18" max="90" required></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  '<label>Salary: ' +
    '<input data-qa="salary" name="salary" type="number" required></label>',
);

form.insertAdjacentHTML(
  'beforeend',
  '<button class="button button--save">Save to table</button>',
);

body.appendChild(form);
// endregion

// region SAVE EMPLOYEE
const saveButton = document.querySelector('.button--save');

saveButton.addEventListener('click', (e) => {
  e.preventDefault();

  const nameValue = document.querySelector('input[name="name"]').value;

  if (nameValue.length < 4) {
    pushNotification(500, 100, 'Error!', 'Name too short', 'error');

    return;
  }

  const positionValue = document.querySelector('input[name="position"]').value;
  const officeValue = document.querySelector('select[name="office"]').value;
  const ageValue = +document.querySelector('input[name="age"]').value;

  if (ageValue < 18) {
    pushNotification(
      500,
      100,
      'Error!',
      'Age should be in range [18, 90]',
      'error',
    );

    return;
  }

  const salaryValue =
    '$' +
    +document
      .querySelector('input[name="salary"]')
      .value.toLocaleString('en-US');

  tBody.insertAdjacentHTML(
    'beforeend',
    `<tr><td>${nameValue}</td><td>${positionValue}</td><td>${officeValue}</td><td>${ageValue}</td><td>${salaryValue}</td></tr>`,
  );

  form.reset();

  pushNotification(
    500,
    100,
    'Saved!',
    `Employee ${nameValue} successfully saved.`,
    'success',
  );
});
// endregion

// region NOTIFICATIONS
function pushNotification(posTop, posRight, title, description, type) {
  const notificationEl = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  notificationEl.className = 'notification ' + type;
  notificationEl.style.top = posTop + 'px';
  notificationEl.style.right = posRight + 'px';
  titleEl.className = 'title';
  titleEl.textContent = title;
  descriptionEl.textContent = description;

  notificationEl.append(titleEl);
  notificationEl.append(descriptionEl);
  document.body.append(notificationEl);

  setTimeout(() => {
    notificationEl.style.display = 'none';
  }, 2000);
}

// endregion
