'use strict';

const form = document.createElement('form');

form.classList.add('new-employee-form');
form.method = 'GET';
form.action = '#';

form.insertAdjacentHTML('afterbegin', `
<label>Name:
  <input
    class="cell-input"
    type="text"
    name="name"
    data-qa="name"
    required
  >
</label>
<label>Position:
  <input
    class="cell-input"
    type="text"
    name="position"
    data-qa="position"
    required
  >
</label>
<label>Office:
  <select
    class="cell-input"
    name="office"
    data-qa="office"
    required
  >
    <option value="Tokyo">Tokyo</option>
    <option value="Singapore">Singapore</option>
    <option value="London">London</option>
    <option value="New York">New York</option>
    <option value="Edinburgh">Edinburgh</option>
    <option value="San Francisco">San Francisco</option>
  </select>
</label>
<label>Age:
  <input
    class="cell-input"
    type="number"
    name="age"
    data-qa="age"
    required
  >
</label>
<label>Salary:
  <input
    class="cell-input"
    type="number"
    name="salary"
    data-qa="salary"
    required
  >
</label>
<button type="submit">Save to table</button>
  `);

document.body.append(form);

const buttonForSaving = document.querySelector('button');
const input = document.querySelectorAll('input');
const select = document.querySelector('select');

buttonForSaving.addEventListener('click', saveToTable);

function saveToTable(ev) {
  const tr = document.createElement('tr');

  ev.preventDefault();

  const inputName = input[0].value;
  const inputPostion = input[1].value;
  const selectOffice = select.value;
  const inputAge = input[2].value;
  const inputSalary = +input[3].value;

  if (inputName.length < 4) {
    pushNotification(
      150, 10,
      'Error invalid input',
      'The length of the name must be longer',
      'error'
    );
  }

  if (!inputPostion) {
    pushNotification(
      10, 10,
      'Error invalid input',
      'Position input required',
      'error'
    );
  }

  if (inputAge < 18 || inputAge > 90) {
    pushNotification(
      290, 10,
      'Error invalid input',
      'The age must be between 18 and 90',
      'error'
    );
  }

  if (inputName && inputPostion && selectOffice && inputAge && inputSalary
    && inputName.length >= 4
    && (inputAge >= 18 && inputAge <= 90)
  ) {
    tr.insertAdjacentHTML('afterbegin', `
  <td>${inputName}</td>
  <td>${inputPostion}</td>
  <td>${selectOffice}</td>
  <td>${inputAge}</td>
  <td>${'$' + inputSalary.toLocaleString('en')}</td>
  `);
    tbody.appendChild(tr);

    pushNotification(
      10, 10,
      'Success',
      'New employee successfuly added to the table',
      'success'
    );
  }
}

function pushNotification(posTop, posRight, title, description, type) {
  const body = document.querySelector('body');
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';
  message.style.top = posTop + 'px';
  message.style.right = posRight + 'px';

  messageTitle.innerText = title;
  messageTitle.classList.add('title');

  messageDescription.innerText = description;

  message.append(messageTitle, messageDescription);

  body.append(message);

  setTimeout(() => message.remove(), 6000);
}

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');

thead.addEventListener('click', sortCell);
thead.addEventListener('dblclick', sortCellReverse);
tbody.addEventListener('click', selectedRow);

function selectedRow(ev) {
  const elementRow = ev.target.closest('tr');

  if (!elementRow || !tbody.contains(elementRow)) {
    return;
  }

  elementRow.classList.toggle('active');
}

function converter(string) {
  return string.replace('$', '').replace(',', '');
}

function sortCell(ev) {
  const titleIndex = ev.target.closest('th').cellIndex;
  const title = ev.target.closest('th');
  const newRows = [...rows];

  if (!title || !thead.contains(title)) {
    return;
  }

  switch (title.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      newRows.sort((current, next) => {
        const currentCellString = current.cells[titleIndex].innerText;
        const nextCellString = next.cells[titleIndex].innerText;

        return currentCellString.localeCompare(nextCellString);
      });
      break;

    case 'Age':
    case 'Salary':
      newRows.sort((current, next) => {
        const currentCellNum = current.cells[titleIndex].innerText;
        const nextCellNum = next.cells[titleIndex].innerText;
        const convertedCurrentNum = converter(currentCellNum);
        const convertedNextNum = converter(nextCellNum);

        return convertedCurrentNum - convertedNextNum;
      });
      break;
  }

  rows.forEach(row => tbody.removeChild(row));

  newRows.forEach(newRow => tbody.appendChild(newRow));
}

function sortCellReverse(ev) {
  const titleIndex = ev.target.closest('th').cellIndex;
  const title = ev.target.closest('th');
  const newRows = [...rows];

  if (!title || !thead.contains(title)) {
    return;
  }

  switch (title.innerText) {
    case 'Name':
    case 'Position':
    case 'Office':
      newRows.sort((current, next) => {
        const currentCellString = current.cells[titleIndex].innerText;
        const nextCellString = next.cells[titleIndex].innerText;

        return nextCellString.localeCompare(currentCellString);
      });
      break;

    case 'Age':
    case 'Salary':
      newRows.sort((current, next) => {
        const currentCellNum = current.cells[titleIndex].innerText;
        const nextCellNum = next.cells[titleIndex].innerText;
        const convertedCurrentNum = converter(currentCellNum);
        const convertedNextNum = converter(nextCellNum);

        return convertedNextNum - convertedCurrentNum;
      });
      break;
  }

  rows.forEach(row => tbody.removeChild(row));

  newRows.forEach(newRow => tbody.appendChild(newRow));
}
