'use strict';

const tableHeader = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const form = document.createElement('form');
let clickColumn = null;
let editingTd = false;

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');

  message.className = `notification ${type}`;

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;
  message.dataset.qa = 'notification';

  document.body.append(message);

  message.style.top = (document.documentElement.clientHeight
    - message.clientHeight) / 2 + window.pageYOffset + 'px';

  message.style.right = (document.documentElement.clientWidth
    - message.clientWidth) / 2 + window.pageXOffset + 'px';
  setTimeout(() => message.remove(), 2000);
};

function sortTable(e) {
  const th = e.target.closest('th');

  if (!th) {
    return;
  }

  const rows = [...tableBody.rows];

  if (clickColumn === th.cellIndex) {
    rows.reverse();

    clickColumn = null;
  } else {
    if (th.textContent === 'Salary') {
      rows.sort((trA, trB) =>
        formatSalary(trA.cells[th.cellIndex].textContent)
        - (formatSalary(trB.cells[th.cellIndex].textContent)));
    } else {
      rows.sort((trA, trB) => trA.cells[th.cellIndex].textContent
        .localeCompare(trB.cells[th.cellIndex].textContent));
    }

    clickColumn = th.cellIndex;
  }

  rows.forEach(tr => tableBody.append(tr));
}

function formatSalary(salary) {
  return +salary.split('').filter(item =>
    '0123456789'.includes(item)).join('');
}

function selectRow(e) {
  const row = e.target.closest('tr');

  if (!row) {
    return;
  }

  [...tableBody.rows].forEach(tr =>
    (tr === row) ? tr.classList.add('active') : tr.classList.remove('active'));
}

function saveToTable(e) {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const nameValue = form.querySelector('[name="name"]').value.trim();
  const position = form.querySelector('[name="position"]').value.trim();
  const office = form.querySelector('[name="office"]').value;
  const age = form.querySelector('[name="age"]').value;
  const salary = form.querySelector('[name="salary"]').value;
  const inputs = form.querySelectorAll('input');

  if (!nameValue || !position || !office || !age || !salary) {
    pushNotification(
      'Input error',
      'All fields are required.',
      'error'
    );

    return;
  }

  if (nameValue.length < 4) {
    pushNotification(
      'Input error',
      'Name has less than 4 letters.',
      'error'
    );

    return;
  }

  if (age < 18 || age > 90) {
    pushNotification(
      'Input error',
      'Age is less than 18 or more than 90.',
      'error'
    );

    return;
  }

  newRow.innerHTML = `
    <td>${nameValue}</td>
    <td>${position}</td>
    <td>${office}</td>
    <td>${age}</td>
    <td>${'$' + (+salary).toLocaleString('en-US')}</td>
  `;

  tableBody.append(newRow);
  form.querySelector('[name="office"]').firstElementChild.selected = true;

  for (const input of inputs) {
    input.value = '';
  }

  pushNotification(
    'New employee added',
    'Data has been successfully added to the table.',
    'success'
  );
}

function editCell(e) {
  const td = e.target.closest('td');

  if (!td || editingTd) {
    return;
  }

  editingTd = true;

  const valueTd = td.textContent;

  td.innerHTML = `
    <input type="text" value="${valueTd}" class="cell-input">
  `;
  td.firstElementChild.focus();

  td.firstElementChild.onblur = () => {
    const inputValue = td.firstElementChild.value.trim();

    td.firstElementChild.remove();

    if (!inputValue.length) {
      td.textContent = valueTd;
    } else {
      td.textContent = inputValue;
    }

    editingTd = false;
  };

  td.firstElementChild.onkeydown = (eventKeydown) => {
    if (eventKeydown.key === 'Enter') {
      td.firstElementChild.blur();
    }
  };
}

form.className = 'new-employee-form';

form.innerHTML = `
  <label>
    Name:
    <input name="name" type="text" data-qa="name">
  </label>
  <label>
    Position:
    <input name="position" type="text" data-qa="position">
  </label>
  <label>
    Office:
    <select name="office" data-qa="office">
      <option value="" disabled selected>Сhoose an office</option>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input name="age" type="number" data-qa="age">
  </label>
  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary">
  </label>
  <button type="submit">Save to table</button>
`;
document.querySelector('table').after(form);

tableHeader.addEventListener('click', sortTable);
tableBody.addEventListener('click', selectRow);
form.addEventListener('submit', saveToTable);
tableBody.addEventListener('dblclick', editCell);
