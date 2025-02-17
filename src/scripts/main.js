'use strict';
// add sorting in both way

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const flags = [false, false, false, false, false];

tableHead.addEventListener('click', (e) => {
  const cell = e.target.closest('th');
  const cellContent = cell.innerText;
  const tableRows = [...document.querySelectorAll('tbody tr')];

  switch (cellContent) {
    case 'Name':
      tableBody.replaceChildren(...sortTable(tableRows, 0));
      break;
    case 'Position':
      tableBody.replaceChildren(...sortTable(tableRows, 1));
      break;
    case 'Office':
      tableBody.replaceChildren(...sortTable(tableRows, 2));
      break;
    case 'Age':
      tableBody.replaceChildren(...sortNumber(tableRows, 3));
      break;
    case 'Salary':
      tableBody.replaceChildren(...sortNumber(tableRows, 4));
      break;
  }
});

function sortTable(table, column) {
  const result = table.sort((row1, row2) => {
    if (flags[column]) {
      return row2.cells[column].innerText.localeCompare(
        row1.cells[column].innerText,
      );
    }

    return row1.cells[column].innerText.localeCompare(
      row2.cells[column].innerText,
    );
  });

  updateFlags(column);

  return result;
}

function sortNumber(table, column) {
  const result = table.sort((row1, row2) => {
    const num1 = salaryToNum(row1.cells[column].innerText);
    const num2 = salaryToNum(row2.cells[column].innerText);

    if (flags[column]) {
      return num2 - num1;
    }

    return num1 - num2;
  });

  updateFlags(column);

  return result;
}

function salaryToNum(str) {
  let num = '';

  for (const ch of str) {
    if (!isNaN(ch)) {
      num += ch;
    }
  }

  return +num;
}

function updateFlags(column) {
  for (let i = 0; i < flags.length; i++) {
    if (i !== column) {
      flags[i] = false;
    }
  }

  flags[column] = !flags[column];
}

// show active row

tableBody.addEventListener('click', (e) => {
  const activeRow = e.target.closest('tr');
  const apdateRow = [...document.querySelectorAll('tbody tr')];

  for (const row of apdateRow) {
    if (row.classList.contains('active')) {
      row.classList.remove('active');
    }
  }
  activeRow.classList.add('active');
});

// create form and add info in table

const form = document.createElement('form');

form.classList.add('new-employee-form');

form.insertAdjacentHTML(
  'beforeend',
  `
  <label>Name:
    <input name='name' type='text' data-qa='name'>
  </label>

  <label>Position:
    <input name='position' type='text' data-qa='position'>
  </label>

  <label>Office:
    <select name="office" data-qa='office'>
      <option value="tokyo">Tokyo</option>
      <option value="singapore">Singapore</option>
      <option value="london">London</option>
      <option value="new york">New York</option>
      <option value="edinburgh">Edinburgh</option>
      <option value="san francisco">San Francisco</option>
    </select>
  </label>

  <label>Age:
    <input name='age' type='number' data-qa='age'>
  </label>

  <label>Salary:
    <input name='salary' type='number' data-qa='salary'>
  </label>

  <button type='submit'>Save to table</button>
`,
);

const body = document.querySelector('body');

body.append(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newRow = document.createElement('tr');

  for (let i = 0; i < 5; i++) {
    const newCell = document.createElement('td');

    if (e.target[i].tagName === 'SELECT') {
      const str = e.target[i].value;

      newCell.innerText = str.charAt(0).toUpperCase() + str.slice(1);
      newRow.append(newCell);

      continue;
    }

    if (e.target[i].type === 'number') {
      const num = e.target[i].value;

      if (num.length === 2) {
        if (Number(num) < 18 || Number(num) > 90) {
          showNotification('error', 'Error', 'Wrong age. Please check.');
          deleteNotification();

          return;
        }

        newCell.innerText = num;
        newRow.append(newCell);

        continue;
      }

      if (num.length > 2) {
        newCell.innerText = '$' + (+num).toLocaleString('en');
        newRow.append(newCell);

        continue;
      }
    }

    if (e.target[i].name === 'name') {
      if (e.target[i].value.length < 4) {
        showNotification('error', 'Error', 'Wrong name length. Please check.');
        deleteNotification();

        return;
      }
    }
    newCell.innerText = e.target[i].value;
    newRow.append(newCell);
  }

  tableBody.append(newRow);

  showNotification(
    'success',
    'Success',
    'Everything ok! New employee was add.',
  );
  deleteNotification();
});

// notifications

function showNotification(type, title, description) {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  messageTitle.classList.add('title');
  messageTitle.textContent = title;
  messageDescription.textContent = description;
  message.setAttribute('data-qa', 'notification');

  message.append(messageTitle, messageDescription);
  body.append(message);
}

function deleteNotification() {
  setTimeout(() => {
    const message = document.querySelector('.notification');

    message.remove();
  }, 5000);
}
