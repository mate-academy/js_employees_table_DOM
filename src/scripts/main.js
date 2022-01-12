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
    pushNotification(500,
      30,
      'Wrong',
      'Name has less then 4 digits or empty',
      'error'
    );
    newEmployeeName.value = '';
  } else if (newEmployeePosition.value.length < 4
    || newEmployeePosition.value.length === 0) {
    pushNotification(
      600,
      30,
      'Wrong',
      'Position has less then 4 digits or empty',
      'error'
    );
    newEmployeePosition.value = '';
  } else if (newEmployeeAge.value < 18 || newEmployeeAge.value > 90) {
    pushNotification(700, 30, 'Wrong', 'Please, check your age!', 'error');
    newEmployeeAge.value = '';
  } else if (newEmployeeSalary.value.length === 0) {
    pushNotification(800, 30, 'Wrong', 'Please, check your salary!', 'error');
    newEmployeeSalary.value = '';
  } else {
    pushNotification(900, 30, 'Success', 'We are ready to add form', 'success');
    newEmployeeName.value = '';
    newEmployeePosition.value = '';
    newEmployeeAge.value = '';
    newEmployeeSalary.value = '';

    tbody.insertAdjacentHTML('beforeend', newTr);
  }
};

formButton.addEventListener('click', addEmployee);

// Editing of table cells by double-clicking on it
const tds = tbody.querySelectorAll('td');

for (const td of tds) {
  const input = document.createElement('input');
  const oldText = td.textContent;

  td.addEventListener('dblclick', (e) => {
    const item = e.target;

    item.textContent = '';
    item.append(input);
    input.classList = 'cell-input';
    input.value = oldText;

    if (isNaN(stringToNumber(oldText))) {
      input.type = 'text';
    } else if (oldText.includes('$')) {
      input.type = 'number';
      input.value = stringToNumber(oldText);
    } else {
      input.type = 'number';
    }
  });

  td.addEventListener('blur', () => {
    // eslint-disable-next-line no-console
    console.log('hello');

    if (input.value.length === 0) {
      td.textContent = oldText;
    } else if (oldText.includes('$')) {
      td.textContent = formSalary(+input.value);
    } else {
      td.textContent = input.value;
    }

    notificationOnTd();

    input.remove();
  });

  // td.addEventListener('focusout', () => {
  //   if (oldText.includes('$')) {
  //     td.textContent = formSalary(+input.value);
  //   } else if (oldText.includes('$') && input.value.length === 0) {
  //     td.textContent = formSalary(oldText);
  //   }

  //   input.remove();
  // });

  td.addEventListener('keypress', (e) => {
    const key = e.key;

    if (key !== 'Enter') {
      return;
    }

    // console.log('hello');

    if (input.value.length === 0) {
      td.textContent = oldText;
    } else if (oldText.includes('$')) {
      td.textContent = formSalary(+input.value);
    } else {
      td.textContent = input.value;
    }

    notificationOnTd();

    input.remove();
  });

  const notificationOnTd = () => {
    if ((td.cellIndex === 0 || td.cellIndex === 1 || td.cellIndex === 2)
    && input.value.length < 4) {
      pushNotification(
        500, 30, 'Wrong', 'Field has less then 4 digits', 'error'
      );
    } else if
    ((input.value < 18 || input.value > 90) && !oldText.includes('$')) {
      pushNotification(600, 30, 'Wrong', 'Please, check your age!', 'error');
    } else {
      pushNotification(700, 30, 'Success', 'Everything looks fine', 'success');
    }
  };
}

function stringToNumber(string) {
  const resultNumber = string.split(',').join('').replace('$', '');

  return +resultNumber;
}

function formSalary(value) {
  return `$${value.toLocaleString('en-US')}`;
};
