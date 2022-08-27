'use strict';

const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');
const tableHeads = [...document.querySelectorAll('th')];
let sorted;
let selected;

const convertToNumber = num => +num.slice(1).split(',').join('');

/*
================ asc/dsc sorting ==================
*/
tableHead.addEventListener('click', e => {
  const columnIndex = e.target.cellIndex;
  const employees = [...tableBody.children];

  if (e.target.textContent === sorted) {
    employees.reverse();
  } else {
    sorted = e.target.textContent;

    employees.sort((a, b) => {
      if (!convertToNumber(a.cells[columnIndex].innerText)) {
        return a.cells[columnIndex].innerText
          .localeCompare(b.cells[columnIndex].innerText);
      } else if (parseInt(a.cells[columnIndex].innerText) >= 0
        || parseInt(a.cells[columnIndex].innerText) <= 0) {
        return a.cells[columnIndex].innerText
        - b.cells[columnIndex].innerText;
      } else {
        return convertToNumber(a.cells[columnIndex].innerText)
        - convertToNumber(b.cells[columnIndex].innerText);
      }
    });
  }

  tableBody.append(...employees);
});

/*
================== row select ==================
*/
tableBody.addEventListener('click', e => {
  const item = e.target.closest('tr');

  if (!selected) {
    selected = item;
    selected.classList.add('active');
  } else if (selected !== item) {
    selected.classList.remove('active');
    selected = item;
    selected.classList.add('active');
  } else {
    selected.classList.remove('active');
  }
});

/*
================= create form  ==================
*/
const formOptions = `
  <option value="Tokyo">Tokyo</option>
  <option value="Singapore">Singapore</option>
  <option value="London">London</option>
  <option value="New York">New York</option>
  <option value="Edinburgh">Edinburgh</option>
  <option value="San Francisco">San Francisco</option>
`;

document.body.insertAdjacentHTML('beforeend', `
  <form
    class="new-employee-form"
    action="/"
    method="post"
  >
    <label>
      Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>
    <label>
      Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
      >
    </label>
    <label>
      Office:
      <select
        name="office"
        data-qa="office"
        required
      >
        ${formOptions}
      </select>
    </label>
    <label>
      Age:
      <input
        name="age"
        type="number"
        data-qa="age"
        required
      >
    </label>
    <label>
      Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
        required
      >
    </label>
    <button type="submit">
      Save to table
    </button>
  </form>
`);

/*
============= create notifications ===========
*/
const form = document.querySelector('form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const newEmployee = Object.fromEntries(data.entries());
  const tr = document.createElement('tr');

  if (newEmployee.name.length < 4) {
    pushNotification('Wrong Name!',
      'Name length should have more than 4 letters.', 'error');

    return;
  }

  const checkName = /^[A-Za-z\s]*$/.test(newEmployee.name);

  if (!checkName) {
    pushNotification('Wrong Name!',
      'Name should contain only letters.', 'error');

    return;
  }

  if (newEmployee.position.length < 4) {
    pushNotification('Wrong Position!',
      'Position length should have more than 4 letters.', 'error');

    return;
  }

  if (newEmployee.age < 18 || newEmployee.age > 90) {
    pushNotification('Wrong Age!',
      'Employee age should be between 18 and 90.', 'error');

    return;
  }

  if (newEmployee.salary <= 0) {
    pushNotification('Wrong Salary!',
      'Salary should be more than $0.', 'error');

    return;
  }

  for (const key in newEmployee) {
    const td = document.createElement('td');

    if (key === 'salary') {
      td.innerText = '$' + parseInt(newEmployee[key]).toLocaleString('en-US');
    } else {
      td.innerText = newEmployee[key];
    }

    tr.append(td);
  }

  tableBody.append(tr);
  pushNotification('Success!', 'New employee added to the table.', 'success');

  [...document.querySelectorAll('input')]
    .forEach(input => (input.value = null));
});

const pushNotification = (title, description, type) => {
  const message = document.createElement('div');
  const messageTitle = document.createElement('h2');
  const messageDescription = document.createElement('p');

  message.classList.add('notification', type);
  message.dataset.qa = 'notification';
  messageTitle.classList.add('title');

  messageTitle.innerText = title;
  messageDescription.innerText = description;

  message.append(messageTitle, messageDescription);
  document.body.firstElementChild.after(message);

  setTimeout(() => {
    message.remove();
  }, 2000);
};

/*
============ editing cells ===========
*/
tableBody.addEventListener('dblclick', (e) => {
  const text = e.target.innerText;
  let input = document.createElement('input');

  e.target.innerText = null;
  input.className = 'cell-input';
  input.value = text;
  input.type = 'text';

  if (e.target.tagName !== 'TD') {
    return;
  }

  if (e.target.cellIndex >= 3) {
    input.type = 'number';
  }

  if (e.target.cellIndex === 2) {
    const select = document.createElement('select');

    select.dataset.qa = 'office';

    select.insertAdjacentHTML('beforeend', `
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>`);

    input = select;
  }

  e.target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (input.value === '') {
      e.target.innerText = text;
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Name') {
      if (input.value.length < 4) {
        pushNotification('Wrong Name!',
          'Name length should have more than 4 letters.', 'error');
        e.target.innerText = text;

        return;
      }

      const checkName = /^[A-Za-z\s]*$/.test(input.value);

      if (!checkName) {
        pushNotification('Wrong Name!',
          'Name should contain only letters.', 'error');
        e.target.innerText = text;

        return;
      }
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Position') {
      if (input.value.length < 4) {
        pushNotification('Wrong Position!',
          'Position length should have more than 4 letters.', 'error');
        e.target.innerText = text;

        return;
      }
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Age') {
      if (input.value < 18 || input.value > 90) {
        pushNotification('Wrong Age!',
          'Employee age should be between 18 and 90.', 'error');
        e.target.innerText = text;

        return;
      }

      if (!parseInt(input.value)) {
        pushNotification('Wrong Age!',
          'Employee age should be between 18 and 90.', 'error');
        e.target.innerText = text;

        return;
      }
    }

    if (tableHeads[e.target.cellIndex].innerText === 'Salary') {
      if (parseInt(input.value)) {
        e.target.innerText = '$' + parseInt(input.value)
          .toLocaleString('en-US');

        return;
      } else {
        pushNotification('Wrong Salary!',
          'Salary should be more than $0.', 'error');
        e.target.innerText = text;

        return;
      }
    }

    e.target.innerText = input.value;
    input.remove();
  });

  input.addEventListener('keydown', eventKeyDown => {
    if (eventKeyDown.code === 'Enter') {
      input.blur();
    }
  });
});
