'use strict';

const table = document.querySelector('table');

/* #region  sort */
let sortExample = 1;
let currentSortParam = '';

table.addEventListener('click', (e) => {
  const employees = document.querySelectorAll('tr');
  const sortParam = e.target.closest('th').innerText;

  if (sortParam) {
    const employeesSorted = [...listSorting(employees, sortParam)]
      .map(row => [...row.children].map(cell => cell.innerText));

    for (let i = 1; i < employees.length - 1; i++) {
      [...employees[i].children].forEach((cell, index) => {
        cell.innerText = employeesSorted[i - 1][index];
      });
    }
  }
});

function listSorting(list, sortParam) {
  const listEmployees = [...list].slice(1, -1);

  if (currentSortParam === sortParam) {
    sortExample = (sortExample === 0) ? 1 : 0;
  } else {
    sortExample = 0;
    currentSortParam = sortParam;
  }

  return listEmployees.sort((a, b) => {
    return (sortExample === 0)
      ? switchForListSorting(sortParam, a, b)
      : switchForListSorting(sortParam, b, a);
  });
};

function salaryToNumber(string) {
  return +string.slice(1).split(',').join('');
};

function switchForListSorting(sortParam, a, b) {
  switch (sortParam) {
    case 'Age':
      return +a.children[3].innerText - +b.children[3].innerText;

    case 'Salary':
      return salaryToNumber(a.children[4].innerText)
        - salaryToNumber(b.children[4].innerText);

    case 'Name':
      return (a.children[0].innerText).localeCompare(b.children[0].innerText);

    case 'Position':
      return (a.children[1].innerText).localeCompare(b.children[1].innerText);

    case 'Office':
      return (a.children[2].innerText).localeCompare(b.children[2].innerText);

    default:
      break;
  }
}
/* #endregion */

/* #region  select */
table.children[1].addEventListener('click', (e) => {
  const tr = e.target.closest('tr');
  const active = document.querySelectorAll('.active');

  if (!tr.classList.contains('active')) {
    active.forEach(item => {
      item.classList.remove('active');
    });
  }

  tr.classList.toggle('active');
});
/* #endregion */

/* #region  adding form */
table.insertAdjacentHTML('afterend', `
  <form class="new-employee-form">
    <label>Name: 
      <input data-qa="name" name="name" type="text" required>
    </label>

    <label>Position: 
      <input data-qa="position" name="position" type="text" required>
    </label>

    <label>Office: 
      <select data-qa="office" name="office" type="text">
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>

    <label>Age: 
      <input data-qa="age" name="age" type="number" required>
    </label>

    <label>Salary: 
      <input data-qa="salary" name="salary" type="number" required>
    </label>

    <button>Save to table</button>
  </form>
`);
/* #endregion */

/* #region  adding a new employee */
const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  const formData = new FormData(form);

  e.preventDefault();
  addPersonToTable(formData);
  e.target.reset();
});

function addPersonToTable(employee) {
  let errorMessage = '';
  const succesMessage = 'All data entered successfully! Added a new employee.';
  let showError = false;

  if (employee.get('name').length < 4) {
    errorMessage += 'Name must have not less than 4 letters!<br><br>';
    showError = true;
  }

  if (+employee.get('age') < 18 || +employee.get('age') > 90) {
    errorMessage += ' Age must be not less than 18 years old'
      + ' or less than 90 years old!<br><br>';
    showError = true;
  }

  if (+employee.get('salary') < 0) {
    errorMessage += 'Salary cannot be negative!';
    showError = true;
  }

  if (showError) {
    pushNotification('Error!', errorMessage, 'error', 8000);

    return;
  }

  pushNotification('Success!', succesMessage, 'success', 4000);

  table.children[1].insertAdjacentHTML('beforeend', `
    <tr>
      <td>
        ${capitalize(employee.get('name'))}
      </td>

      <td>
        ${capitalize(employee.get('position'))}
      </td>

      <td>
        ${employee.get('office')}
      </td>

      <td>
        ${employee.get('age')}
      </td>

      <td>
        ${formatSalary(employee.get('salary'))}
      </td>
    </tr>
  `);
}

function formatSalary(salary) {
  return '$' + new Intl.NumberFormat('en-GB').format(salary);
}

function capitalize(string) {
  return string
    .split(' ')
    .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ');
}
/* #endregion */

/* #region  create message */
function calculateCoordsForMessage() {
  const notification = document.querySelector('.notification');
  const coordsMessage = {};
  let target = form;

  if (notification) {
    target = notification;
  }

  const coords = target.getBoundingClientRect();

  coordsMessage.x = coords.x + window.pageXOffset;
  coordsMessage.y = coords.bottom + 15 + window.pageYOffset;

  return coordsMessage;
}

const pushNotification = (title, description, type, latency) => {
  const body = document.body;
  const coords = calculateCoordsForMessage();

  body.insertAdjacentHTML('afterbegin', `
    <div data-qa="notification" class="notification ${type}">
      <h2 class="title">
        ${title}
      </h2>
      <p>
        ${description}
      </p>
    </div>
  `);

  const message = document.querySelector('.notification');

  message.style.top = coords.y + 'px';
  message.style.left = coords.x + 'px';
  message.style.zIndex = 1;

  setTimeout(removeElem, latency, message);
};

function moveMessage(heightPrevElem) {
  const messages = document.querySelectorAll('.notification');

  messages.forEach(message => {
    const coords = message.getBoundingClientRect();

    message.style.top = coords.y - heightPrevElem - 15 + 'px';
  });
}

function removeElem(elem) {
  const elemHeight = elem.offsetHeight;

  elem.remove();

  moveMessage(elemHeight);
}
/* #endregion */

/* #region  formating cell */
table.addEventListener('dblclick', (e) => {
  const td = e.target.closest('td');
  const row = e.target.closest('tr');
  let typeInput = '';
  const tdContent = td.innerText;
  let nameCell = '';
  const tdSizes = getComputedStyle(td);
  const tdWidth = td.clientWidth
    - parseInt(tdSizes.paddingLeft) - parseInt(tdSizes.paddingRight);

  td.innerText = '';

  switch (td) {
    case row.children[0]:
      nameCell = 'name';
      typeInput = 'text';
      break;

    case row.children[1]:
      nameCell = 'position';
      typeInput = 'text';
      break;

    case row.children[2]:
      nameCell = 'office';
      typeInput = 'text';
      break;

    case row.children[3]:
      nameCell = 'age';
      typeInput = 'number';
      break;

    case row.children[4]:
      nameCell = 'salary';
      typeInput = 'number';
      break;

    default:
      break;
  }

  function createFormInCell() {
    td.insertAdjacentHTML('afterbegin', `
      <form id="format-cell">
        <input class="cell-input" name="${nameCell}" type="${typeInput}">
      </form>
    `);
  }

  let errorMessage = '';

  switch (nameCell) {
    case 'name':
      errorMessage = 'Name must have not less than 4 letters!';

      pushNotification('Worning!', errorMessage, 'worning', 4000);
      createFormInCell();
      break;

    case 'position':
      createFormInCell();
      break;

    case 'age':
      errorMessage = 'Age must be not less than 18 years'
        + ' old or less than 90 years old!';

      pushNotification('Worning!', errorMessage, 'worning', 4000);
      createFormInCell();
      break;

    case 'salary':
      errorMessage = 'Salary cannot be negative!';

      pushNotification('Worning!', errorMessage, 'worning', 4000);
      createFormInCell();
      break;

    case 'office':
      td.insertAdjacentHTML('afterbegin', `
        <form id="format-cell">
          <select class="cell-input" name="office" type="text">
            <option value="Tokyo">Tokyo</option>
            <option value="Singapore">Singapore</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Edinburgh">Edinburgh</option>
            <option value="San Francisco">San Francisco</option>
          </select>
        </form>
      `);
      break;

    default:
      break;
  }

  const formCell = document.querySelector('#format-cell');
  const cellInput = document.querySelector('.cell-input');

  formCell.addEventListener('dblclick', (eFormCell) => {
    eFormCell.stopPropagation();
  });

  cellInput.style.width = tdWidth + 'px';
  cellInput.focus();

  cellInput.addEventListener('blur', () => {
    formatCell();
  });

  cellInput.addEventListener('keydown', (eKey) => {
    if (eKey.key === 'Enter') {
      formatCell();
    }
  });

  if (nameCell === 'office') {
    cellInput.addEventListener('change', () => {
      formatCell();
    });
  }

  function formatCell() {
    const formData = new FormData(formCell);

    function callErrorMessage(message) {
      formCell.remove();

      pushNotification('Error!', message, 'error', 4000);

      td.innerText = tdContent;
    }

    if (nameCell === 'salary' && formData.get(nameCell) < 0) {
      callErrorMessage(errorMessage);

      return;
    }

    if (nameCell === 'name' && formData.get(nameCell).length < 4) {
      callErrorMessage(errorMessage);

      return;
    }

    if (
      nameCell === 'age'
      && (+formData.get(nameCell) < 18 || +formData.get(nameCell) > 90)
    ) {
      callErrorMessage(errorMessage);

      return;
    }

    const data = (nameCell === 'salary')
      ? formatSalary(formData.get(nameCell))
      : formData.get(nameCell);

    if (formData.get(nameCell) === '') {
      td.innerText = tdContent;
    } else {
      td.innerText = data;
    }
  }
});
/* #endregion */
