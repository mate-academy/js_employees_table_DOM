'use strict';

newEmployeeForm();

const tHead = document.querySelector('thead');
const tBody = document.querySelector('tbody');
const form = document.querySelector('.new-employee-form');

let order = true;

tHead.addEventListener('click', e => {
  const rows = [...tBody.rows];

  sortRows(rows, e.target.innerText);
  order = !order;
});

tBody.addEventListener('click', e => {
  selectedRow(e.target.closest('tr'));
});

tBody.addEventListener('dblclick', e => {
  const target = e.target.closest('td');
  const prevText = target.innerText;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.value = target.innerText;
  target.innerText = '';
  target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (/^\s*$/.test(input.value)) {
      target.innerText = prevText;
      input.remove();

      return;
    }
    target.innerText = input.value;
    input.remove();
  });

  input.addEventListener('keydown', (enter) => {
    if (enter.key === 'Enter') {
      input.blur();
    }
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  formValidation(form);
});

// Notification implementation
const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  message.className = `notification ${type}`;
  message.setAttribute('data-qa', 'notification');
  h2.className = 'title';
  h2.textContent = title;
  p.textContent = description;

  message.append(h2, p);

  document.body.append(message);

  message.style.boxSizing = 'content-box';

  setTimeout(() => {
    message.remove();
  }, 2000);
};

// Function to sort in two directions
function sortRows(arr, columnName) {
  let sortedRows = [];

  switch (columnName) {
    case 'Name':
      sortedRows = arr.sort((a, b) =>
        a.cells[0].innerText.localeCompare(b.cells[0].innerText)
      );
      break;
    case 'Position':
      sortedRows = arr.sort((a, b) =>
        a.cells[1].innerText.localeCompare(b.cells[1].innerText)
      );
      break;
    case 'Office':
      sortedRows = arr.sort((a, b) =>
        a.cells[2].innerText.localeCompare(b.cells[2].innerText)
      );
      break;
    case 'Age':
      sortedRows = arr.sort((a, b) =>
        parseInt(a.cells[3].innerText)
        - parseInt(b.cells[3].innerText)
      );

      break;
    case 'Salary':
      sortedRows = arr.sort((a, b) =>
        convertToNumber(a.cells[4].innerText)
        - convertToNumber(b.cells[4].innerText)
      );
      break;
  }

  order ? tBody.append(...sortedRows) : tBody.append(...sortedRows.reverse());
}

// Function converts salary string to number
function convertToNumber(str) {
  const number = parseInt(str.slice(1).split(',').join(''));

  return number;
}

// Function converts salary to custom String
function convertToCustomString(str) {
  const number = +str;
  const salaryStr = number.toLocaleString();

  return `$${salaryStr}`;
}

// When user clicks on a row, it should become selected.
function selectedRow(clickedRow) {
  const rows = [...tBody.rows];

  rows.forEach(tr => tr.classList.remove('active'));
  clickedRow.classList.add('active');
}

// Add form
function newEmployeeForm() {
  const newForm = document.createElement('form');

  newForm.classList.add('new-employee-form');

  newForm.innerHTML = `
  <label>Name: <input name="name" type="text" data-qa="name" required></label>
  <label>Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
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
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>
  `;

  document.body.append(newForm);
}

// Form validation check
function formValidation(formName) {
  const data = new FormData(formName);

  const dataName = data.get('name');
  const dataPosition = data.get('position');
  const dataOffice = data.get('office');
  const dataAge = data.get('age');
  const dataSalary = data.get('salary');
  const format = /^[`!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?~\d]*$/g;

  if (dataName.length < 4) {
    pushNotification('Invalid data', 'Name has less than 4 letters', 'error');

    return;
  }

  if (+dataAge < 18 || +dataAge > 90) {
    pushNotification('Invalid data',
      'Age must be between 18 to 90 years old', 'error');

    return;
  }

  if (format.test(dataName)) {
    pushNotification('Invalid data',
      'Name must contain just letters', 'error');

    return;
  }

  if (format.test(dataPosition)) {
    pushNotification('Invalid data',
      'Position must contain just letters', 'error');

    return;
  }

  tBody.insertAdjacentHTML('beforeend',
    `<tr>
    <td>${dataName}</td>
    <td>${dataPosition}</td>
    <td>${dataOffice}</td>
    <td>${dataAge}</td>
    <td>${convertToCustomString(dataSalary)}</td>
    </tr>
  `);

  pushNotification('Success', 'Employee has been added to the list');

  formName.reset();
}
