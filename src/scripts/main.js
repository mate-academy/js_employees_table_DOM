'use strict';

const body = document.querySelector('body');

const table = document.querySelector('table');
const thead = table.tHead;
const tBody = table.tBodies[0];
const tBodyRows = tBody.rows;

[...tBodyRows].forEach(row => row.classList.add('tableRow'));

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML('beforeend',
  `<label>
        Name:
        <input data-qa="name" name="name" type="text" minLength="4" required>
        </label>

        <label>
        Position:
        <input data-qa="position" name="position" type="text"
        minLength="4" required>
     </label>

     <label>
        Office:
        <select data-qa="office" name="office" type="select" required>
          <option value="Tokyo" selected>Tokyo</option>
          <option value="Singapore">Singapore</option>
          <option value="London">London</option>
          <option value="New York">New York</option>
          <option value="Edinburgh">Edinburgh</option>
          <option value="San Francisco">San Francisco</option>
        </select>
     </label>

     <label>
     Age:
        <input data-qa="age" name="age" type="number" min="18"
        max="90" required>
     </label>

     <label>
        Salary:
        <input data-qa="salary" name="salary" type="number"
        min="1" max="9999999" required>
     </label>

      <button class="saveButton" name="btn" type="submit"
        required>Save to table</button>`
);
body.append(form);

const nameField = document.querySelector('[data-qa="name"]');
const positionField = document.querySelector('[data-qa="position"]');
const officeField = document.querySelector('[data-qa="office"]');
const ageField = document.querySelector('[data-qa="age"]');
const salaryField = document.querySelector('[data-qa="salary"]');
const saveButton = document.querySelector('.saveButton');

saveButton.addEventListener('click', (e) => {
  e.preventDefault();

  if (form.checkValidity()) {
    showNotification('Success notification',
      'New employee is successfully added to the table', 'success');

    tBody.insertAdjacentHTML('beforeend',
      `<tr class='tableRow'>
          <td>${nameField.value}</td>
          <td>${positionField.value}</td>
          <td>${officeField.value}</td>
          <td>${ageField.value}</td>
          <td>$${(+salaryField.value).toLocaleString('en-US')}</td>
          </tr>`
    );

    form.reset();
  } else {
    if (nameField.value.length < 4) {
      showNotification('Error notification',
        'The length of the name must be greater than 4', 'error');
    } else if (positionField.value < 4) {
      showNotification('Error notification',
        'The length of the name must be greater than 4', 'error');
    } else if (ageField.value < 18 || ageField.value > 90) {
      showNotification('Error notification',
        'The age is incorrect', 'error');
    } else if (salaryField.value <= 0 || salaryField.value > 999999) {
      showNotification('Error notification',
        'Enter the correct salary value', 'error');
    } else {
      showNotification('Error notification',
        'All fields must be filled in correctly', 'error');
    }
  }
});

let activeRow = null;

document.addEventListener('click', (e) => {
  if (!tBody.contains(e.target)) {
    [...tBodyRows].forEach(row => row.classList.remove('active'));
  }

  for (const row of tBodyRows) {
    if (row.contains(e.target)) {
      active(row);
    }
  }
});

function active(row) {
  if (activeRow) {
    activeRow.classList.remove('active');
  }
  activeRow = row;
  activeRow.classList.add('active');
}

let isFirstClick = true;
let currentTH = null;
let targetIndex;

thead.addEventListener('click', function(e) {
  const bodyRowsArray = [...tBody.querySelectorAll('.tableRow')];

  targetIndex = e.target.cellIndex;

  if (!e.target.tagName === 'TH') {
    return;
  }

  if (currentTH && currentTH !== e.target) {
    isFirstClick = true;
  }
  currentTH = e.target;

  if (isFirstClick) {
    bodyRowsArray.sort((rowA, rowB) => rowA.cells[targetIndex].innerHTML
      .localeCompare(rowB.cells[targetIndex].innerHTML));

    if (e.target.textContent === 'Salary') {
      bodyRowsArray.sort((rowA, rowB) => normalizeNum(
        rowA.cells[targetIndex].innerHTML) - normalizeNum(
        rowB.cells[targetIndex].innerHTML));
    }
    isFirstClick = false;
  } else {
    bodyRowsArray.sort((rowA, rowB) => rowB.cells[targetIndex].innerHTML
      .localeCompare(rowA.cells[targetIndex].innerHTML));

    if (e.target.textContent === 'Salary') {
      bodyRowsArray.sort((rowA, rowB) => normalizeNum(
        rowB.cells[targetIndex].innerHTML) - normalizeNum(
        rowA.cells[targetIndex].innerHTML));
    }
    isFirstClick = true;
  }

  tBody.append(...bodyRowsArray);
});

let editing = false;

tBody.addEventListener('dblclick', (e) => {
  if (editing) {
    return;
  }

  const td = e.target.closest('td');
  const tdIndex = td.cellIndex;
  const header = table.querySelector('tr');
  const headerCell = header.cells[tdIndex].textContent;

  if (!td) {
    return;
  }

  const initialValue = td.textContent;

  td.textContent = '';

  let input;

  if (headerCell === 'Office') {
    if (editing) {
      return;
    }

    const select = document.createElement('select');

    select.insertAdjacentHTML('beforeend', `
      <option value="Tokyo" selected>Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);
    td.append(select);
    editing = true;

    select.addEventListener('blur', () => {
      editing = false;

      const savedValue = select.value;

      select.remove();

      td.textContent = savedValue;

      if (!savedValue) {
        td.textContent = initialValue;
      }
    });

    select.addEventListener('keypress', (evnt) => {
      if (evnt.key === 'Enter') {
        select.blur();
      }
    });
  } else {
    input = document.createElement('input');

    input.classList.add('cell-input');
    input.value = initialValue;
    input.type = 'text';
    td.append(input);
    editing = true;
  }

  if (!input) {
    return;
  }

  input.addEventListener('blur', () => {
    editing = false;

    if (headerCell === 'Name' && input.value.length < 4) {
      showNotification('Error notification',
        'The length of the name must be greater than 4', 'error');
      input.focus();
    } else if (headerCell === 'Position' && input.value.length < 4) {
      showNotification('Error notification',
        'The length of the position must be greater than 5', 'error');
      input.focus();
    } else if (headerCell === 'Age' && (input.value < 18 || input.value > 90)) {
      showNotification('Error notification',
        'The age is incorrect', 'error');
      input.focus();
    } else if (headerCell === 'Salary'
      && (input.value <= 0 || input.value > 999999)) {
      showNotification('Error notification',
        'Enter the correct salary value', 'error');
      input.focus();
    } else if (headerCell === 'Office' && input.value.length < 4) {
      showNotification('Error notification',
        'The length of the office must be greater than 4', 'error');
      input.focus();
    } else {
      if (headerCell === 'Salary') {
        const savedValue = `$${(+input.value).toLocaleString('en-US')}`;

        input.remove();

        td.textContent = savedValue;

        if (!savedValue) {
          td.textContent = initialValue;
        }
      } else {
        const savedValue = input.value;

        input.remove();

        td.textContent = savedValue;

        if (!savedValue) {
          td.textContent = initialValue;
        }
      }
    }
  });

  input.addEventListener('keypress', (evnt) => {
    if (evnt.key === 'Enter') {
      input.blur();
    }
  });
});

function normalizeNum(number) {
  return number.split(',').join('').slice(1);
}

const showNotification = (title, description, type) => {
  body.insertAdjacentHTML('beforeend', `
      <div class="notification ${type}" data-qa="notification">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
    `);

  const notification = document.querySelector('.notification');

  setTimeout(() => notification.remove(), 2000);
};
