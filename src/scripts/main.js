'use strict';

const body = document.querySelector('body');
let flag = true;
let selected;
let prevCellText;

const pushNotification = (posTop, posRight, title, description, type) => {
  const element = document.querySelector('body');

  element.innerHTML += `
    <div data-qa="notification" class="notification ${type}">
      <h2 class="title">
        ${title}
      </h2>
      <p>
        ${description}
      </p>
    </div>
  `;

  const notification = document.querySelector(`.${type}`);

  notification.style.boxSizing = 'content-box';
  notification.style.top = `${posTop}px`;
  notification.style.right = `${posRight}px`;

  setTimeout(() => {
    document.querySelector(`.${type}`).remove();
  }, 3000, type);
};

body.innerHTML += `
<form class="new-employee-form" id="employee">
  <label>Name:
    <input name="name" type="text" data-qa="name" minlength="4" required>
  </label>
  <label>Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>Office:
    <select data-qa="office" name="office" required form="employee">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input name="age" type="number" data-qa="age" min="18" max="90" required>
  </label>
  <label>Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>
  <button>Save to table</button>
</form>
`;

document.addEventListener('click', function(e) {
  const targClick = e.target;
  const table = document.querySelector('table');
  const tableBody = document.querySelector('table').tBodies;
  const rowsList = Array.from(table.children[1].children);
  const columnIndex = e.srcElement.cellIndex;

  function sortStringCol(list) {
    const getString = (el) => {
      return el.children[columnIndex].innerText;
    };

    if (flag) {
      flag = false;

      return list.sort((a, b) => {
        return getString(a).localeCompare(getString(b));
      });
    }

    if (!flag) {
      flag = true;

      return list.sort((a, b) => {
        return getString(b).localeCompare(getString(a));
      });
    }
  };

  function sortNumberCol(list) {
    const getNumber = (el) => {
      const textElement = el.children[columnIndex].innerText;

      return textElement.replace('$', '').replace(',', '');
    };

    if (flag) {
      flag = false;

      return list.sort((a, b) => getNumber(a) - getNumber(b));
    }

    if (!flag) {
      flag = true;

      return list.sort((a, b) => getNumber(b) - getNumber(a));
    }
  };

  switch (targClick.textContent) {
    case 'Name':
      tableBody[0].append(...sortStringCol(rowsList));
      break;

    case 'Position':
      tableBody[0].append(...sortStringCol(rowsList));
      break;

    case 'Office':
      tableBody[0].append(...sortStringCol(rowsList));
      break;

    case 'Age':
      tableBody[0].append(...sortNumberCol(rowsList));
      break;

    case 'Salary':
      tableBody[0].append(...sortNumberCol(rowsList));
      break;
  };
});

document.addEventListener('click', function(e) {
  if (e.target.tagName === 'TD') {
    const row = e.target.parentElement;

    if (selected) {
      selected.classList.remove('active');
    }

    row.classList += 'active';
    selected = row;
  } else {
    selected.classList.remove('active');
  }
});

document.addEventListener('dblclick', function(e) {
  if (e.target.tagName === 'TD') {
    const input = document.createElement('input');

    prevCellText = e.target.innerText;
    input.value = prevCellText;
    input.classList = 'cell-input';
    e.target.innerText = '';
    input.setAttribute('type', 'text');
    e.target.append(input);
    e.target.children[0].focus();
  }
});

['focusout', 'keypress'].forEach(eventName => document.addEventListener(eventName, function(e) {
  if (e.key === 'Enter' || e.type === 'focusout') {
    const inputResult = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    const columnName = document.querySelector('table').tHead.firstElementChild.children[e.path[1].cellIndex].innerText;
    const setText = (text) => {
      e.target.parentElement.innerText = text;
    };

    if (!inputResult) {
      setText(prevCellText);

      return;
    }

    switch (columnName) {
      case 'Name' :
        if (inputResult.length > 4) {
          setText(inputResult);
          pushNotification(10, 10, 'Success', 'Information was added successfully', 'success');
        } else {
          setText(prevCellText);
          pushNotification(10, 10, 'Error', 'Short text!', 'error');
        };
        break;

      case 'Position' :
        if (inputResult.length > 1) {
          setText(inputResult);
          pushNotification(10, 10, 'Success', 'Information was added successfully', 'success');
        } else {
          setText(prevCellText);
          pushNotification(10, 10, 'Error', 'Short text!', 'error');
        };
        break;

      case 'Office' :
        const officeList = document.querySelector('[name="office"]').children;
        const officeArr = [];

        for (const key of officeList) {
          officeArr.push(key.innerText);
        }

        if (officeArr.includes(inputResult)) {
          setText(inputResult);
          pushNotification(10, 10, 'Success', 'Information was added successfully', 'success');
        } else {
          setText(prevCellText);
          pushNotification(10, 10, 'Error', 'Wrong office name!', 'error');
        };
        break;

      case 'Age' :
        if (inputResult >= 18 && inputResult <= 90) {
          setText(inputResult);
          pushNotification(10, 10, 'Success', 'Information was added successfully', 'success');
        } else {
          setText(prevCellText);
          pushNotification(10, 10, 'Error', 'Wrong age!', 'error');
        };
        break;

      case 'Salary' :
        if (inputResult >= 1) {
          const salary = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
          }).format(inputResult);

          setText(salary);
          pushNotification(10, 10, 'Success', 'Information was added successfully', 'success');
        } else {
          setText(prevCellText);
          pushNotification(10, 10, 'Error', 'Wrong sum!', 'error');
        };
    }

    const row = document.querySelector('.active');

    row.classList.remove('active');
    e.target.remove();
  }
}));

document.addEventListener('submit', function(e) {
  e.preventDefault();

  const currentTable = document.querySelector('table').children[1];
  const data = new FormData(document.querySelector('.new-employee-form'));
  const employeeData = Object.fromEntries(data.entries());
  const newTableRow = document.createElement('tr');

  for (const key in employeeData) {
    const cell = document.createElement('td');
    const inputValue = employeeData[key];

    cell.innerText = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);

    if (key === 'salary') {
      const salary = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(inputValue);

      cell.innerText = salary;
    }
    newTableRow.append(cell);
  }

  currentTable.append(newTableRow);
  document.querySelector('.new-employee-form').reset();
});
