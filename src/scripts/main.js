'use strict';

const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const thead = document.querySelectorAll('thead th');

const getNumber = (value) => {
  return Number(value.slice(1).split(',').join(''));
};
const convertSalary = (value) => {
  return `$${Number(value).toLocaleString('en-US')}`;
};

[...thead].forEach(element => {
  if (element.innerHTML === 'Name'
    || element.innerHTML === 'Position' || element.innerHTML === 'Office') {
    element.dataset.type = 'string';
  } else if (element.innerHTML === 'Age') {
    element.dataset.type = 'number';
  } else {
    element.dataset.type = 'amount';
  }

  element.dataset.sort = 'asc';
});

function sortTableAsc(colNum, type) {
  const sortedRows = Array.from(tbody.rows);

  switch (type) {
    case 'string':
      sortedRows.sort((rowA, rowB) => {
        return rowA.cells[colNum]
          .innerHTML.localeCompare(rowB.cells[colNum].innerHTML);
      });
      break;
    case 'number':
      sortedRows.sort((rowA, rowB) => {
        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
      });
      break;
    case 'amount':
      sortedRows.sort((rowA, rowB) => {
        return getNumber(rowA.cells[colNum].innerHTML)
          - getNumber(rowB.cells[colNum].innerHTML);
      });
      break;
  }

  tbody.append(...sortedRows);
}

function sortTableDesc(colNum, type) {
  const sortedRows = Array.from(tbody.rows);

  switch (type) {
    case 'string':
      sortedRows.sort((rowA, rowB) => {
        return rowB.cells[colNum]
          .innerHTML.localeCompare(rowA.cells[colNum].innerHTML);
      });
      break;

    case 'number':
      sortedRows.sort((rowA, rowB) => {
        return rowB.cells[colNum].innerHTML - rowA.cells[colNum].innerHTML;
      });
      break;

    case 'amount':
      sortedRows.sort((rowA, rowB) => {
        return getNumber(rowB.cells[colNum].innerHTML)
          - getNumber(rowA.cells[colNum].innerHTML);
      });
      break;
  }

  tbody.append(...sortedRows);
}

table.addEventListener('click', (e) => {
  const th = e.target.closest('thead th');

  if (th.dataset.sort === 'asc') {
    th.dataset.sort = 'desc';

    sortTableAsc(th.cellIndex, th.dataset.type);
  } else {
    th.dataset.sort = 'asc';

    sortTableDesc(th.cellIndex, th.dataset.type);
  }
});

document.addEventListener('click', (e) => {
  const clicked = e.target.closest('tbody tr');
  const lastClicked = tbody.querySelector('.active');

  if (!lastClicked) {
    clicked.classList.add('active');
  } else {
    lastClicked.classList.remove('active');
    clicked.classList.add('active');
  }
});

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

const formElement = document.forms.employee;

const pushNotification = (description, type) => {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.dataset.qa = 'notification';
  notification.classList.add(type);

  notification.style.top = '10px';
  notification.style.right = '10px';

  const heading = document.createElement('h2');
  const paragraph = document.createElement('p');

  paragraph.textContent = description;
  heading.textContent = type;

  notification.append(heading, paragraph);
  document.body.append(notification);

  setTimeout(() => notification.remove(), 3000);
};

formElement.addEventListener('submit', function(e) {
  const isValidName = this.elements.name.value.replace(/\s/g, '').length >= 4;
  const isValidPosition = this
    .elements.position.value.replace(/\s/g, '').length >= 4;
  const isValidAge = this.elements.age.value >= 18
    && this.elements.age.value <= 90;

  e.preventDefault();

  if (isValidName && isValidAge && isValidPosition) {
    const row = `
      <tr>
        <td>${this.elements.name.value}</td>
        <td>${this.elements.position.value}</td>
        <td>${this.elements.office.value}</td>
        <td>${this.elements.age.value}</td>
        <td>${convertSalary(this.elements.salary.value)}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', row);
    pushNotification('Your changes has been saved', 'Success');
    form.reset();
  } else {
    if (!isValidAge && !isValidName && !isValidPosition) {
      pushNotification(
        `Age must be between 18 and 90.
         Name and position must at least than 4 letters`,
        'Error');
    } else {
      if (!isValidAge) {
        pushNotification(
          'Age must be between 18 and 90',
          'Error');
      }

      if (!isValidName || !isValidPosition) {
        pushNotification(
          'Name and position must at least than 4 letters',
          'Error');
      }
    }
  }
});

document.addEventListener('dblclick', (ev) => {
  const cell = ev.target;

  if (cell.tagName !== 'TD') {
    return;
  }

  const cellIndex = cell.cellIndex;
  const cellValue = cell.innerText;
  let input = document.createElement('input');

  if (cellIndex === 2) {
    const selectOffice = document.createElement('select');
    const cityList = [
      'Tokyo',
      'Singapore',
      'London',
      'New York',
      'Edinburgh',
      'San Francisco',
    ];

    cityList.forEach((option) => {
      const city = document.createElement('option');

      city.textContent = option;
      selectOffice.append(city);
    });
    input = selectOffice;
  }

  input.className = 'cell-input';
  input.value = cellValue;

  cell.innerText = '';
  cell.appendChild(input);

  input.focus();

  input.addEventListener('keydown', (e) => {
    if (e.code === 'Enter') {
      cell.innerText = input.value || cellValue;
    }
  });

  input.addEventListener('blur', () => {
    cell.innerText = input.value || cellValue;
  });
});
