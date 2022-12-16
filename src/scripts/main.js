'use strict';

document.body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name" required>
    </label>

    <label>Position:
      <input name="position" type="text" data-qa="position" required>
    </label>

    <label>Office:
      <select data-qa="office" name="office" required>
        <option>Tokyo</option>;
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>

    <label>Age:
      <input name="age" type="number" data-qa="age" required>
    </label>

    <label>Salary:
      <input name="salary" type="number" data-qa="salary" required>
    </label>

    <button class="saveButton" type="submit">Save to table</button>
    </form>
`);

const form = document.querySelector('.new-employee-form');
const inputs = form.querySelectorAll('input');
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');

const container = document.createElement('div');

container.classList.add('container');
container.style.display = 'flex';
container.style.flexShrink = '0';
container.style.gap = '20px';
container.style.position = 'relative';
form.style.margin = 0;

document.body.prepend(container);
container.append(table);
container.append(form);

let previousTitle;

function sorterByTitleName(columnNumber, columnTitle) {
  const rowsArray = [...tbody.rows];

  let compare;

  switch (columnTitle.toLowerCase()) {
    case 'age':
      compare = function(rowA, rowB) {
        return +rowA.cells[columnNumber].innerHTML
        - +rowB.cells[columnNumber].innerHTML;
      };
      break;

    case 'salary':
      compare = function(rowA, rowB) {
        return salaryConverter(rowA.cells[columnNumber].innerHTML)
        - salaryConverter(rowB.cells[columnNumber].innerHTML);
      };
      break;

    default:
      compare = function(rowA, rowB) {
        return rowA.cells[columnNumber].innerHTML
        > rowB.cells[columnNumber].innerHTML ? 1 : -1;
      };
      break;
  }

  rowsArray.sort(compare);

  if (!previousTitle || previousTitle !== columnTitle) {
    tbody.append(...rowsArray);
    previousTitle = columnTitle;
  } else {
    tbody.append(...rowsArray.reverse());
    previousTitle = null;
  }
};

function salaryConverter(salary) {
  if (!salary) {
    return '';
  }

  if (salary[0] === '$') {
    return salary.slice(1).replace(',', '.') * 1000;
  }

  const splittedArray = salary.split('');

  splittedArray.splice(salary.length - 3, 0, ',');

  return '$' + splittedArray.join('');
};

function pushNotification(title, description, type) {
  if (container.contains(document.querySelector('.notification'))) {
    document.querySelector('.notification').remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification', type);
  notification.setAttribute('data-qa', 'notification');

  notification.style.top
    = form.offsetHeight + parseInt(container.style.gap) + 'px';
  notification.style.right = 0;

  notification.insertAdjacentHTML('afterbegin', `
    <h1>${title[0].toUpperCase() + title.slice(1).toLowerCase()}</h1>
    <p>${description}</p>
  `);

  container.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
};

function ageChecker(age) {
  return age >= 18 && age <= 90;
}

table.addEventListener('click', (e) => {
  const tr = e.target.closest('tr');

  if (!tbody.contains(tr)) {
    return;
  }

  if (tr.classList.contains('active')) {
    tr.classList.remove('active');

    return;
  }

  for (let i = 0; i < tbody.rows.length; i++) {
    tbody.rows[i].classList.remove('active');
  }

  tr.classList.add('active');
});

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');

  if (e.target.tagName !== 'TH') {
    return;
  }

  sorterByTitleName(th.cellIndex, th.textContent);
});

document.querySelector('.saveButton').addEventListener('click', (e) => {
  e.preventDefault();

  const formElements = form.elements;

  for (const input of inputs) {
    input.addEventListener('blur', () => {
      input.style.outline = '';
    });

    if (!input.value) {
      pushNotification(input.name, 'Should not be empty', 'error');
      input.style.outline = '1px solid red';
      input.focus();

      return;
    }

    if (input.name === 'name' && input.value.length < 4) {
      pushNotification(input.name, 'Should have minimum 4 letters', 'error');
      input.focus();
      input.style.outline = '1px solid red';

      return;
    }

    if (input.name === 'age' && !ageChecker(input.value)) {
      pushNotification(input.name, 'Age should be between 18 and 90', 'error');
      input.style.outline = '1px solid red';
      input.focus();

      return;
    }
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${formElements.name.value}</td>
      <td>${formElements.position.value}</td>
      <td>${formElements.office.value}</td>
      <td>${formElements.age.value}</td>
      <td>${salaryConverter(formElements.salary.value)}</td>
    </tr>
  `);

  pushNotification('Success', 'Employee was added', 'success');

  form.reset();
});

tbody.addEventListener('dblclick', (e) => {
  table.style.userSelect = 'none';

  const td = e.target.closest('td');

  if (e.target.tagName !== 'TD') {
    return;
  }

  const cellContent = td.textContent;
  const input = document.createElement('input');

  input.classList.add('cell-input');
  input.setAttribute('type', 'text');
  input.value = cellContent;
  td.textContent = '';
  td.append(input);
  input.focus();

  input.addEventListener('blur', blurHandler);

  function blurHandler() {
    if (input.value === '') {
      input.replaceWith(cellContent);
    }

    input.replaceWith(input.value);
  }

  input.addEventListener('keypress', (ev) => {
    input.removeEventListener('blur', blurHandler);

    if (ev.key === 'Enter' && input.value === '') {
      input.replaceWith(cellContent);
    }

    if (ev.key === 'Enter') {
      input.replaceWith(input.value);
    }
  });
});
