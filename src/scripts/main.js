/* eslint-disable */
'use strict';

const table = document.querySelector('table');
const thList = document.querySelectorAll('th');
const tbody = table.querySelector('tbody');

const convertSalary = (value) => {
  return `$${Number(value).toLocaleString('en-US')}`;
};

thList.forEach((th) => {
  th.dataset.name = th.innerHTML.toLowerCase();
});

let sortColum = '';

table.querySelector('thead').addEventListener('click', (e) => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const th = e.target;
  const thIndex = th.cellIndex;
  const thName = th.dataset.name;

  if (sortColum === thName) {
    sortColum = '';
    sortTable(thIndex, thName, 'desc');
  } else {
    sortColum = thName;
    sortTable(thIndex, thName, 'asc');
  }
});

tbody.addEventListener('click', (e) => {
  const selected = e.target.closest('tr');
  const prevSelected = tbody.querySelector('.active');

  if (!prevSelected) {
    selected.classList.add('active');
  } else {
    prevSelected.classList.remove('active');
    selected.classList.add('active');
  }
});

function sortTable(colNum, type, sort = 'asc') {
  const rowsArray = Array.from(tbody.rows);

  switch (type) {
    case 'name':
    case 'position':
    case 'office':
      sort === 'asc'
        ? rowsArray.sort((a, b) => {
          return a.cells[colNum].innerHTML.localeCompare(
            b.cells[colNum].innerHTML,
          );
        })
        : rowsArray.sort((a, b) => {
          return b.cells[colNum].innerHTML.localeCompare(
            a.cells[colNum].innerHTML,
          );
        });
      break;

    case 'age':
      sort === 'asc'
        ? rowsArray.sort(
          (a, b) =>
            Number(a.cells[colNum].innerHTML) -
              Number(b.cells[colNum].innerHTML),
        )
        : rowsArray.sort(
          (a, b) =>
            Number(b.cells[colNum].innerHTML) -
              Number(a.cells[colNum].innerHTML),
        );
      break;

    case 'salary':
      sort === 'asc'
        ? rowsArray.sort(
          (a, b) =>
            getNumber(a.cells[colNum].innerHTML) -
              getNumber(b.cells[colNum].innerHTML),
        )
        : rowsArray.sort(
          (a, b) =>
            getNumber(b.cells[colNum].innerHTML) -
              getNumber(a.cells[colNum].innerHTML),
        );
      break;
  }

  tbody.append(...rowsArray);
}

function getNumber(value) {
  return Number(value.slice(1).split(',').join(''));
}

const form = document.createElement('form');

const inputForm = `
  <label>
    Name:
    <input
      data-qa="name"
      name="name"
      type="text"
      required
    >
  </label>

  <label>
    Position:
    <input
      data-qa="position"
      name="position"
      type="text"
      required
    >
  </label>

  <label>
    Office:
    <select data-qa="office" name="office">
      <option value="Tokyo">
        Tokyo
      </option>

      <option value="Singapore">
        Singapore
      </option>

      <option value="London">
        London
      </option>

      <option value="New York">
        New York
      </option>

      <option value="Edinburgh">
        Edinburgh
      </option>

      <option value="San Francisco">
        San Francisco
      </option>
    </select>
  </label>

  <label>
    Age:
    <input
      data-qa="age"
      name="age"
      type="number"
      min="18"
      max="90"
      required
    >
  </label>

  <label>
    Salary:
    <input
      data-qa="salary"
      name="salary"
      type="number"
      min="0"
      required
    >
  </label>

  <button type="submit">Save to table</button>
`;

form.className = 'new-employee-form';
form.name = 'employee';
form.action = '/';
form.method = 'post';

form.insertAdjacentHTML('afterbegin', inputForm);
table.after(form);

const pushNotification = (description, type) => {
  const notification = document.createElement('div');
  const heading = document.createElement('h2');
  const text = document.createElement('p');

  notification.className = `notification ${type}`;
  notification.dataset.qa = 'notification';

  notification.style.cssText = `
    top: 10px;
    right: 10px;
  `;

  heading.textContent = type;
  heading.className = 'title';

  text.textContent = description;

  notification.append(heading, text);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 2000);
};

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameEmployee = form.elements.name.value;
  const position = form.elements.position.value;
  const office = form.elements.office.value;
  const age = form.elements.age.value;
  const salary = form.elements.salary.value;

  const isValidName = nameEmployee.replace(/\s/g, '').length >= 4;
  const isValidPosition = position.replace(/\s/g, '').length >= 4;
  const isValidAge = age >= 18 && age <= 90;

  if (isValidName && isValidPosition && isValidAge && salary && age) {
    const newEmployee = `
      <tr>
        <td>${nameEmployee}</td>
        <td>${position}</td>
        <td>${office}</td>
        <td>${age}</td>
        <td>${convertSalary(salary)}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', newEmployee);
    pushNotification('Your changes has been saved', 'success');
    form.reset();
  } else {
    if (!isValidAge && !isValidName && !isValidPosition) {
      pushNotification(
        `Age must be between 18 and 90.
         Name and position must at least than 4 letters`,
        'error',
      );
    } else {
      if (!isValidAge) {
        pushNotification('Age must be between 18 and 90', 'error');
      }

      if (!isValidName || !isValidPosition) {
        pushNotification(
          'Name and position must at least than 4 letters',
          'error',
        );
      }
    }
  }
});
