'use strict';

const tBody = document.querySelector('tbody');

// region SORTING
const tHead = document.querySelector('thead');
let lastSortedColumn = '';
let isAscending = true;

tHead.addEventListener('click', (e) => {
  const employees = [...document.querySelectorAll('tbody > tr')];
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

  row.classList.toggle('active');

  if (selectedRow !== row) {
    selectedRow?.classList.remove('active');
  }
  selectedRow = row;
});
// endregion

// region CREATE FORM
const body = document.querySelector('body');
const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML(
  'beforeend',
  `<label>Name: <input data-qa="name" name="name" type="text"></label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>Position: <input data-qa="position" name="position" type="text"></label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>Office: <select data-qa="office" name="office">
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
    </select></label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>Age: <input data-qa="age" name="age" type="number" min="18" max="90"></label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  `<label>Salary: <input data-qa="salary" name="salary" type="number"></label>`,
);

form.insertAdjacentHTML(
  'beforeend',
  `<button class="button button--save" type="button">Save to table</button>`,
);

body.appendChild(form);
// endregion

// region SAVE EMPLOYEE
const saveButton = document.querySelector('.button--save');

saveButton.addEventListener('click', (e) => {
  e.preventDefault();

  const nameVal = document.querySelector('input[name="name"]').value;
  const positionVal = document.querySelector('input[name="position"]').value;
  const officeVal = document.querySelector('select[name="office"]').value;
  const ageVal = document.querySelector('input[name="age"]').value;
  const salaryVal = document.querySelector('input[name="salary"]').value;

  if (!validateForm(nameVal, positionVal, ageVal, salaryVal)) {
    return;
  }

  tBody.insertAdjacentHTML(
    'beforeend',
    `<tr><td>${nameVal}</td><td>${positionVal}</td><td>${officeVal}</td><td>${ageVal}</td>
      <td>$${(+salaryVal).toLocaleString('ua-US')}</td></tr>`,
  );

  form.reset();

  pushNotification(
    500,
    100,
    'Saved!',
    `Employee ${nameVal} successfully saved.`,
    'success',
  );
});

function validateForm(nameVal, positionVal, ageVal, salaryVal) {
  if (!nameVal || !positionVal || !ageVal || !salaryVal) {
    pushNotification(500, 100, 'Error!', 'Fill in all fields.', 'error');

    return false;
  }

  if (nameVal.length < 4) {
    pushNotification(
      500,
      100,
      'Error!',
      'The name is too short. 4 letters minimum.',
      'error',
    );

    return false;
  }

  if (+ageVal < 18 || +ageVal > 90) {
    pushNotification(
      500,
      100,
      'Error!',
      'Age should be in range [18, 90].',
      'error',
    );

    return false;
  }

  return true;
}

function pushNotification(posTop, posRight, title, description, type) {
  const notificationEl = document.createElement('div');
  const titleEl = document.createElement('h2');
  const descriptionEl = document.createElement('p');

  notificationEl.className = 'notification ' + type;
  notificationEl.setAttribute('data-qa', 'notification');
  notificationEl.style.top = posTop + 'px';
  notificationEl.style.right = posRight + 'px';
  titleEl.className = 'title';
  titleEl.textContent = title;
  descriptionEl.textContent = description;

  notificationEl.append(titleEl);
  notificationEl.append(descriptionEl);
  document.body.append(notificationEl);

  setTimeout(() => {
    notificationEl.outerHTML = '';
  }, 5000);
}
// endregion

// region EDIT CELL
tBody.addEventListener('dblclick', (e) => {
  const cell = e.target.closest('td');

  const cellValue = cell.textContent;
  const input = document.createElement('input');

  cell.textContent = '';
  input.classList.add('cell-input');
  input.type = 'text';
  cell.appendChild(input);
  input.focus();

  input.addEventListener('blur', () => {
    let inputValue = input.value;

    if (!inputValue.trim()) {
      inputValue = cellValue;
    }

    cell.textContent = inputValue;
  });

  input.addEventListener('keypress', (innerE) => {
    if (['Enter', 'NumpadEnter'].includes(innerE.code)) {
      input.blur();
    }
  });
});
// endregion
