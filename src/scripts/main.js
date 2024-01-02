'use strict';

// write code here
const table = document.querySelector('table');
const tBody = table.tBodies[0];
// ADDING FORM
const form = document.createElement('form');
const body = document.querySelector('body');
const headerElements = document.querySelectorAll('thead tr th');
const listOfNames = [];

for (const headerElement of headerElements) {
  listOfNames.push(headerElement.textContent);
}

// CREATE FORM INPUTS
for (let i = 0; i < listOfNames.length; i++) {
  const input = document.createElement('input');
  const label = document.createElement('label');

  // CREATE SELECT WITH OPTIONS
  if (listOfNames[i] === 'Office') {
    const select = document.createElement('select');
    const selectLabel = document.createElement('label');
    const listOfOffices = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    for (let j = 0; j < listOfOffices.length; j++) {
      const option = document.createElement('option');

      option.innerText = option.value = listOfOffices[j];

      select.name = select.dataset.qa = listOfNames[i].toLowerCase();

      select.append(option);
    }

    selectLabel.innerText = listOfNames[i] + ':';

    selectLabel.append(select);
    form.append(selectLabel);
    continue;
  }
  // END SELECT

  input.name = input.dataset.qa = listOfNames[i].toLowerCase();

  if (input.name === 'age' || input.name === 'salary') {
    input.type = 'number';
  } else {
    input.type = 'text';
  }

  input.required = true;

  label.innerText = listOfNames[i] + ':';
  label.append(input);

  form.className = 'new-employee-form';
  form.append(label);
}
// END FORM INPUTS

// CREATE BUTTON
const button = document.createElement('button');

button.type = 'submit';
button.innerText = 'Save to table';

form.append(button);
// END BUTTON

body.firstElementChild.after(form);
// END FORM

table.addEventListener('click', e => {
  if (e.target.parentElement.parentElement.tagName === 'THEAD') {
    sortTable(e.target);
  }

  if (e.target.tagName === 'TD') {
    highlightRow(e.target.parentElement);
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();

  if (validateForm()) {
    const newRow = tBody.insertRow(-1);
    const listOfValues = [];

    for (let i = 0; i < form.length - 1; i++) {
      let value = form[i].value;

      if (form[i].name === 'salary') {
        value = prepareSalary(value);
      }

      listOfValues.push(value);
    }

    for (let i = 0; i < form.length - 1; i++) {
      const newCell = newRow.insertCell(i);

      newCell.textContent = listOfValues[i];
    }

    form.reset();
  }
});

tBody.addEventListener('dblclick', e => {
  handleDoubleClick(e.target);
});

function sortTable(head) {
  // GET CHOSEN COLUMN
  const header = head.innerText;
  const headers = document.querySelectorAll('thead tr th');
  let tableColumn;

  for (let i = 0; i < headers.length; i++) {
    if (headers[i].innerText === header) {
      tableColumn = i;
    }
  }

  // CREATE AND SORT ELEMENTS IN THE COLUMN
  const list = [];

  for (let i = 0; i < tBody.rows.length; i++) {
    list.push(tBody.rows[i].cells[tableColumn].innerText);
  }

  if (header === 'Salary' || header === 'Age') {
    list.sort((a, b) => {
      const x = +a.replace(/[$,]/ig, '');
      const y = +b.replace(/[$,]/ig, '');

      if (head.className === 'sorted') {
        return y - x;
      }

      return x - y;
    });
  } else {
    list.sort((a, b) => {
      if (head.className === 'sorted') {
        return b.localeCompare(a);
      }

      return a.localeCompare(b);
    });
  }

  // SORT ROWS IN TABLE
  for (const element of list) {
    for (let i = 0; i < tBody.children.length; i++) {
      if (element === tBody.rows[i].cells[tableColumn].innerHTML) {
        const tRow = tBody.rows[i];

        tBody.append(tRow);
      }
    }
  }

  // ADDING AND DELETING CLASS OF TH's
  if (head.className !== 'sorted') {
    head.className = 'sorted';
  } else {
    head.className = '';
  }

  const listOfHeaders = head.parentElement.children;

  for (const th of listOfHeaders) {
    if (th === head) {
      continue;
    }

    th.className = '';
  }
}

function highlightRow(row) {
  const rows = row.parentElement.children;

  for (const r of rows) {
    if (r.className === 'active') {
      r.className = '';
    }
  }

  row.className = 'active';
}

function prepareSalary(text) {
  const x = '$' + Number(text).toLocaleString('en-US');

  return x;
}

function validateForm() {
  if (body.lastElementChild.tagName === 'DIV') {
    body.removeChild(body.lastElementChild);
  }

  const notification = document.createElement('div');
  const title = document.createElement('p');

  setTimeout(() => body.removeChild(notification), 3000);

  notification.className = 'notification';
  title.className = 'title';

  if (form[0].value.length < 4) {
    notification.className += ' error';
    notification.textContent = 'Name should have minimum 4 characters';
    title.textContent = 'Wrong name value';

    notification.prepend(title);
    body.append(notification);

    return false;
  } else if (form[3].value < 18 || form[3].value > 90) {
    notification.className += ' error';
    notification.textContent = 'Age should be between 18 and 90 years old';
    title.textContent = 'Wrong age value';

    notification.prepend(title);
    body.append(notification);

    return false;
  }

  notification.className += ' success';
  notification.textContent = 'New employee has been created';
  title.textContent = 'Good job!';

  notification.prepend(title);
  body.append(notification);

  return true;
}

function handleDoubleClick(td) {
  const text = td.innerText;
  const input = document.createElement('input');
  const age = td.parentElement.children[3];
  const salary = td.parentElement.children[4];
  const handleInput = () => {
    if (input.name === 'salary') {
      td.innerText = prepareSalary(input.value);
    } else {
      td.innerText = input.value || text;
    }
  };

  td.innerText = '';

  input.value = text;
  input.className = 'cell-input';

  if (td === age) {
    input.type = 'number';
  }

  if (td === salary) {
    input.value = parseFloat(text.replace(/[$,]/g, ''));
    input.type = 'number';
    input.name = 'salary';
  }

  td.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    handleInput();
  });

  input.addEventListener('keypress', key => {
    if (key.key === 'Enter') {
      handleInput();
    }
  });
}
