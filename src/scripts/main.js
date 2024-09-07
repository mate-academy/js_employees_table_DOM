'use strict';

// 1. Implement table sorting by clicking on the title (in two directions).

const tbody = document.querySelector('tbody');
const thead = document.querySelector('thead');
const rows = tbody.querySelectorAll('tr');
let tr = [...rows];
let lastClicked;
let isDESC = false;

thead.addEventListener('click', (e) => {
  const colNum = [...thead.firstElementChild.children].findIndex(
    (cell) => cell.textContent === e.target.textContent,
  );

  const sorted = [...tr].sort((row1, row2) => {
    if (e.target.textContent.toLowerCase() === 'age') {
      return (
        +row1.children[colNum].textContent - +row2.children[colNum].textContent
      );
    }

    if (e.target.textContent.toLowerCase() === 'salary') {
      const a = row1.children[colNum].textContent
        .replace('$', '')
        .replace(',', '');
      const b = row2.children[colNum].textContent
        .replace('$', '')
        .replace(',', '');

      return +a - +b;
    }

    return row1.children[colNum].textContent.localeCompare(
      row2.children[colNum].textContent,
    );
  });

  if (lastClicked === e.target.textContent && !isDESC) {
    sorted.reverse();
    isDESC = true;
  } else {
    isDESC = false;
  }

  sorted.forEach((row) => {
    tbody.append(row);
  });

  lastClicked = e.target.textContent;
});

// 2. When user clicks on a row, it should become selected.

tbody.addEventListener('click', (e) => {
  const { target } = e;
  const hasActive = tbody.querySelector('.active');

  if (hasActive) {
    hasActive.classList.remove('active');
  }
  target.closest('tr').classList.add('active');
});

// 3. Write a script to add a form to the document.
// Form allows users to add new employees to the spreadsheet.

// Create form html
const html = `<form method="get" action="#" class="new-employee-form" onsubmit="jsFunction();return false">
<label>Name: <input type="text" name="name" data-qa="name" required></label>
<label>Position: <input type="text" name="position" data-qa="position" required></label>
<label>Office: <select name="office" data-qa="office" required>
  <option value="tokyo">Tokyo</option>
  <option value="singapore">Singapore</option>
  <option value="london">London</option>
  <option value="new york">New York</option>
  <option value="edinburgh">Edinburgh</option>
  <option value="san francisco">San Francisco</option>
</select></label>
<label>Age: <input type="number" name="age" data-qa="age" required></label>
<label>Salary: <input type="number" name="salary" data-qa="salary" required></label>
<button type="submit">Save to table</button>
</form>`;

// Add form to HTML
document.body.insertAdjacentHTML('beforeend', html);

// Form btn event
const btn = document.querySelector('button');

btn.addEventListener('click', (e) => {
  // prevent btn from reloading the page after submit
  e.preventDefault();

  // getting and formatting values and for adding to the table
  const fullName = document.querySelector('[name = "name"]').value;
  const position = document.querySelector('[name = "position"]').value;
  let office = document.querySelector('[name = "office"]').value.split('');
  const age = document.querySelector('[name = "age"]').value;
  const salary = (+document.querySelector('[name = "salary"]')
    .value).toLocaleString('en-US');

  if (office.includes(' ')) {
    office =
      office[0].toUpperCase() +
      office.slice(1, office.indexOf(' ')).join('') +
      ' ' +
      office.slice(office.indexOf(' '))[1].toUpperCase() +
      office.slice(office.indexOf(' ') + 2).join('');
  } else {
    office = office[0].toUpperCase() + office.slice(1).join('');
  }

  // adding error message in case the name is too short
  if (fullName.length < 4) {
    pushNotification(
      'Invalid name',
      'The name is too short.\n ' + '\nPlease enter a valid name.',
      'error',
    );

    return;
  }

  if (!position) {
    pushNotification('Invalid position', 'Please fill position field', 'error');

    return;
  }

  // adding error message in case the age <18 and >90
  if (+age < 18 || +age > 90) {
    pushNotification(
      'Invalid age',
      'The age is inappropriate.\n ' +
        '\nAge should be more than 18 and not more than 90',
      'error',
    );

    return;
  }

  if (+salary <= 0) {
    pushNotification(
      'Invalid salary',
      'The salary should be more than 0\n',
      'error',
    );

    return;
  }

  const newRow = `<tr><td>${fullName}</td>
<td>${position}</td>
<td>${office}</td>
<td>${age}</td>
<td>$${salary}</td>
</tr>`;

  tbody.insertAdjacentHTML('beforeend', newRow);
  tr = [...tr, tbody.lastElementChild];

  // adding success message
  pushNotification('Success', 'The employee is successfully added', 'success');

  // reset form values
  document.querySelector('[name = "name"]').value = '';
  document.querySelector('[name = "position"]').value = '';
  document.querySelector('[name = "office"]').value = 'tokyo';
  document.querySelector('[name = "age"]').value = '';
  document.querySelector('[name = "salary"]').value = '';
});

// 4. Show notification if form data is invalid.
// Notification function
const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  message.classList.add('notification', `${type}`);
  message.dataset.qa = 'notification';
  h2.classList.add('title');

  h2.textContent = title;
  p.innerText = description;

  message.append(h2, p);

  document.body.append(message);
  setTimeout(() => (message.style.visibility = 'hidden'), 2000);
  setTimeout(() => message.remove(), 5000);
};

// 5. Implement editing of table cells by double-clicking on it. (optional)

tbody.addEventListener('dblclick', (e) => {
  const { target } = e;
  const inputExist = tbody.querySelector('.cell-input');

  const input = document.createElement('input');

  input.classList.add('cell-input');

  if (target.tagName.toLowerCase() === 'td') {
    const td = target;
    const initialText = td.textContent;

    if (inputExist) {
      return;
    }

    td.textContent += ' replaced by:';
    td.append(input);

    const updateCell = (ev) => {
      if (ev.key === 'Enter' || ev.type === 'blur') {
        if (!input.value) {
          td.textContent = initialText;
        } else {
          td.textContent = input.value;
        }
        input.remove();
      }
    };

    input.addEventListener('blur', updateCell);
    input.addEventListener('keypress', updateCell);
  }
});
