'use strict';

// write code here
const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let sortedBy = null;
const nameMap = {
  'Name': 'string',
  'Position': 'string',
  'Office': 'string',
  'Age': 'number',
  'Salary': 'currency',
};

// Table sorting by clicking on the title
thead.addEventListener('click', (e) => {
  if (e.target.innerText === sortedBy) {
    // reverse table
    const reversed = [...tbody.rows].reverse();

    tbody.append(...reversed);
  } else {
    // sort a-z by innerText column

    let index;

    for (let i = 0; i < thead.children[0].children.length; i++) {
      if (e.target.textContent === thead.children[0].children[i].textContent) {
        index = i;
      }
    }

    const type = nameMap[e.target.innerText];

    if (type === 'string') {
      const sort = [...tbody.rows].sort((a, b) => {
        return a.cells[index].innerText.localeCompare(b.cells[index].innerText);
      });

      tbody.append(...sort);
    } else if (type === 'number') {
      const sortNum = [...tbody.rows].sort((a, b) => {
        return +(a.cells[index].innerText) - +(b.cells[index].innerText);
      });

      tbody.append(...sortNum);
    } else {
      const sortSalary = [...tbody.rows].sort((a, b) => {
        return +a.cells[index].innerText.replace(/[^0-9]/g, '')
          - +b.cells[index].innerText.replace(/[^0-9]/g, '');
      });

      tbody.append(...sortSalary);
    }
  }

  sortedBy = e.target.innerText;
});

// When user clicks on a row, it should become selected.
tbody.addEventListener('click', (e) => {
  const item = e.target.parentNode;
  const activeRow = tbody.querySelector('.active');

  if (activeRow) {
    activeRow.classList.remove('active');
  }

  item.classList = 'active';
});

// Add a form to the document
const countryArray = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburg',
  'San Francisco',
];

const form = `
  <form action="/" method="post" class="new-employee-form">
    <label for="name">Name:
      <input
        name="name"
        type="text"
        id="name"
        data-qa="name"
        required
      >
    </label>
    <label for="position">Position:
      <input
        name="position"
        type="text"
        id="position"
        data-qa="position"
        required
      >
    </label>
    <label for="office">Office:
      <select name="office" id="office" data-qa="office" required>
        ${countryArray.map(country => `
          <option value="${country}">${country}</option>
        `)}
      </select>
    </label>
    <label for="age">Age:
      <input
        name="age"
        type="number"
        id="age"
        min="18"
        max="90"
        step="1"
        data-qa="age"
        required
      >
    </label>
    <label for="salary">Salary:
      <input
        name="salary"
        type="number"
        id="salary"
        data-qa="salary"
        required
      >
    </label>
    <button type="submit" class="form_button">Save to table</button>
  </form>
`;

body.insertAdjacentHTML('beforeend', form);

const pushNotification = (posTop, posRight, title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.classList.add('notification', `${type}`);
  div.style.top = posTop + 'px';
  div.style.right = posRight + 'px';
  div.setAttribute('data-qa', 'notification');

  h2.classList.add('title');
  h2.textContent = `${title}`;
  p.textContent = `${description}`;

  body.append(div);
  div.append(h2, p);

  setTimeout(() => {
    div.remove();
  }, 2000);
};

// Add new employees to the spreadsheet
const formButton = document.querySelector('.form_button');
const newEmployeeName = document.querySelector('#name');
const newEmployeePosition = document.querySelector('#position');
const newEmployeeOffice = document.querySelector('#office');
const newEmployeeAge = document.querySelector('#age');
const newEmployeeSalary = document.querySelector('#salary');

const addEmployee = () => {
  const newTr = `
  <td>${newEmployeeName.value.trim()}</td>
  <td>${newEmployeePosition.value.trim()}</td>
  <td>${newEmployeeOffice.value}</td>
  <td>${newEmployeeAge.value}</td>
  <td>${formSalary(+newEmployeeSalary.value)}</td>
  `;

  if (newEmployeeName.value.length < 4 || newEmployeeName.value.length === 0) {
    pushNotification(450,
      30,
      'Wrong',
      'Name has less then 4 digits or empty',
      'error'
    );
    newEmployeeName.value = '';
  } else if (newEmployeePosition.value.length < 4
    || newEmployeePosition.value.length === 0) {
    pushNotification(
      550,
      30,
      'Wrong',
      'Position has less then 4 digits or empty',
      'error'
    );
    newEmployeePosition.value = '';
  } else if (newEmployeeAge.value < 18 || newEmployeeAge.value > 90) {
    pushNotification(650, 30, 'Wrong', 'Please, check your age!', 'error');
    newEmployeeAge.value = '';
  } else if (newEmployeeSalary.value.length === 0) {
    pushNotification(750, 30, 'Wrong', 'Please, check your salary!', 'error');
    newEmployeeSalary.value = '';
  } else {
    pushNotification(800, 30, 'Success', 'We are ready to add form', 'success');
    newEmployeeName.value = '';
    newEmployeePosition.value = '';
    newEmployeeAge.value = '';
    newEmployeeSalary.value = '';

    tbody.insertAdjacentHTML('beforeend', newTr);
  }
};

formButton.addEventListener('click', addEmployee);

// Editing of table cells by double-clicking on it

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const oldValue = target.textContent;

  e.preventDefault();
  target.textContent = '';

  target.insertAdjacentHTML('afterbegin', `
    <input type="text" class="cell-input" value ="${oldValue}">
  `);

  document.querySelector('.cell-input').focus();

  document.querySelector('.cell-input').selectionStart
    = document.querySelector('.cell-input').value.length;

  document.querySelector('.cell-input').addEventListener('keydown',
    function() {
      if (event.keyCode === 13) {
        if (document.querySelector('.cell-input').value === '') {
          target.textContent = oldValue;

          pushNotification(
            500, 30, 'Wrong', 'Field is empty', 'error'
          );
        } else if (target.cellIndex === 3) {
          document.querySelector('.cell-input').type = 'number';

          target.textContent
          = stringToNumber(document.querySelector('.cell-input').value)
          || oldValue;
        } else if (target.cellIndex === 4) {
          document.querySelector('.cell-input').value
          = document.querySelector('.cell-input').value.replace(/[^0-9]/g, '');

          target.textContent
          = formSalary(stringToNumber(document
              .querySelector('.cell-input').value));
        } else {
          target.textContent = document.querySelector('.cell-input').value;

          pushNotification(
            700,
            30,
            'Success',
            'Everything looks fine',
            'success');
        }
        document.querySelector('.cell-input').remove();
      }
    });

  document.querySelector('.cell-input').addEventListener('blur', function() {
    if (document.querySelector('.cell-input').value === '') {
      document.querySelector('.cell-input').replaceWith(oldValue);

      pushNotification(
        500, 30, 'Wrong', 'Field is empty', 'error'
      );
    } else if (target.cellIndex === 3) {
      document.querySelector('.cell-input').type = 'number';

      target.textContent
      = stringToNumber(document.querySelector('.cell-input').value)
      || oldValue;
    } else if (target.cellIndex === 4) {
      document.querySelector('.cell-input').value
      = document.querySelector('.cell-input').value.replace(/[^0-9]/g, '');

      target.textContent
      = formSalary(stringToNumber(document.querySelector('.cell-input').value));
    } else {
      document.querySelector(
        '.cell-input').replaceWith(document.querySelector('.cell-input').value);

      pushNotification(700, 30, 'Success', 'Everything looks fine', 'success');
    }
  });
});

function stringToNumber(string) {
  const resultNumber = string.split(',').join('').replace('$', '');

  return +resultNumber;
}

function formSalary(value) {
  return `$${value.toLocaleString('en-US')}`;
};
