'use strict';

const mainPage = document.querySelector('body');
const table = document.querySelector('table');
const header = table.querySelector('thead').firstElementChild;
const body = table.children[1];
const rows = table.querySelector('tbody').children;
let clickedOn = '';
let clickCount = 0;

function sortRows(input, i) {
  const columnName = header.children[i].innerHTML;

  switch (columnName) {
    case 'Name':
    case 'Position':
    case 'Office':

      const result = [...input].sort((a, b) => {
        const first = a.children[i].innerHTML;
        const second = b.children[i].innerHTML;

        if (clickCount % 2 === 0) {
          return second.localeCompare(first);
        } else {
          return first.localeCompare(second);
        }
      });

      appendSorted(result);
      break;

    case 'Age':

      const resultAge = [...input].sort((a, b) => {
        const first = a.children[i].innerHTML;
        const second = b.children[i].innerHTML;

        if (clickCount % 2 === 0) {
          return second - first;
        } else {
          return first - second;
        }
      });

      appendSorted(resultAge);
      break;

    case 'Salary':
      const resultSalary = [...input].sort((a, b) => {
        const first = a.children[i].innerHTML
          .replace('$', '')
          .replace(',', '');
        const second = b.children[i].innerHTML
          .replace('$', '')
          .replace(',', '');

        if (clickCount % 2 === 0) {
          return second - first;
        } else {
          return first - second;
        };
      });

      appendSorted(resultSalary);
      break;
  };
}

function appendSorted(sorted) {
  for (const row of sorted) {
    table.children[1].appendChild(row);
  }
};

function createEmployeeForm(container) {
  const form = document.createElement('form');

  form.className = 'new-employee-form';

  for (const column of header.children) {
    const input = document.createElement('input');

    input.name = `${column.innerHTML.toLowerCase()}`;

    if (input.name === 'age'
    || input.name === 'salary') {
      input.setAttribute('type', 'number');
      input.setAttribute('data-qa', `${column.innerHTML.toLowerCase()}`);
    } else {
      input.setAttribute('type', 'text');
      input.setAttribute('data-qa', `${column.innerHTML.toLowerCase()}`);
    }

    const label = document.createElement('label');

    label.innerHTML = `${column.innerHTML}: `;
    label.append(input);
    form.append(label);
  }

  const replaceIndex = [...form.children]
    .findIndex(item => item.lastElementChild.name === 'office');
  const replace = form.children[replaceIndex].lastElementChild;

  replace.remove();

  const select = document.createElement('select');

  select.name = 'office';

  const menuTitle = document.createElement('option');

  menuTitle.innerHTML = 'Choose an office...';
  menuTitle.disabled = true;
  menuTitle.selected = true;
  select.append(menuTitle);

  const offices = [
    'Tokyo',
    'Singapore',
    'London',
    'New York',
    'Edinburgh',
    'San Francisco',
  ];

  for (const office of offices) {
    const option = document.createElement('option');

    option.innerHTML = `${office}`;
    select.append(option);
  }

  const button = document.createElement('button');

  button.type = 'button';
  button.innerHTML = 'Save to table';

  container.appendChild(form);
  form.children[replaceIndex].append(select);
  form.append(button);

  button.addEventListener('click', (e) => {
    addEmployee(document.querySelector('form'));
  });
}

function addEmployee(form) {
  const newEmployee = document.createElement('tr');

  const inputData = form.querySelectorAll('label');

  for (const item of inputData) {
    const value = item.children[0].value;
    const itemName = item.children[0].name;
    const newCell = document.createElement('td');

    if (itemName === 'salary') {
      newCell.innerHTML = `$${Number(value).toLocaleString()}`;
    } else {
      newCell.innerHTML = value;
    }

    newEmployee.append(newCell);
  };

  if (validateInput(inputData)) {
    table.children[1].append(newEmployee);

    for (const field of [...inputData]) {
      if (field.lastElementChild.nodeName === 'SELECT') {
        field.lastElementChild.value = 'Choose an office...';
      } else {
        field.lastElementChild.value = '';
      }
    }
  }
}

function validateInput(input) {
  for (const item of input) {
    const itemName = item.firstElementChild.name;
    const value = item.firstElementChild.value;

    switch (true) {
      case itemName === 'name' && value === '':
      case itemName === 'position' && value === '':
      case itemName === 'age' && value === '':
      case itemName === 'office' && value === 'Choose an office...':
      case itemName === 'salary' && value === '':
        createNotification('error', 'all fields required');

        return false;

      case itemName === 'name'
          && value.length > 0
          && value.length <= 4:
        createNotification('error', 'name is too short');

        return false;

      case itemName === 'age' && value < 18:
        createNotification('error', 'age is too low');

        return false;

      case itemName === 'age' && value > 90:
        createNotification('error', 'age is too high');

        return false;
    }
  }

  createNotification('success', '');

  return true;
}

function createNotification(result, type) {
  if (document.querySelector('.notification')) {
    const element = document.querySelector('.notification');

    element.remove();
  }

  const notification = document.createElement('div');

  notification.classList.add('notification');
  notification.classList.add(result);
  notification.setAttribute('data-qa', 'notification');

  const notificationTitle = document.createElement('h2');

  const notificationText = document.createElement('p');

  if (result === 'error') {
    notificationTitle.innerHTML = 'Error';

    if (type === 'all fields required') {
      notificationText.innerHTML = 'All fields are required';
    } else if (type === 'name is too short') {
      notificationText.innerHTML = 'The name length is too short.\n'
      + 'Please enter employee\'s full name';
    } else if (type === 'age is too low') {
      notificationText.innerHTML = 'This age is not allowed.\n'
      + 'We cannot hire people younger than 18 years old, it is illegal';
    } else if (type === 'age is too high') {
      notificationText.innerHTML = 'This age is not allowed.\n'
      + 'Please enter employee\'s age between 18 and 90 years old.';
    }
  } else if (result === 'success') {
    notificationTitle.innerHTML = 'Success!';
    notificationText.innerHTML = 'New employee record was added successfully!';
  }

  notification.appendChild(notificationTitle);
  notification.appendChild(notificationText);
  mainPage.append(notification);
}

header.addEventListener('click', (e) => {
  const columnIndex = e.target.cellIndex;

  if (e.target.innerHTML === clickedOn) {
    clickCount++;
  } else {
    clickCount = 1;
  }
  clickedOn = e.target.innerHTML;

  sortRows(rows, columnIndex);
});

body.addEventListener('click', (e) => {
  if (e.target.parentNode.className === 'active') {
    e.target.parentNode.classList.toggle('active');
  } else {
    for (const row of rows) {
      row.className = '';
    }
    e.target.parentNode.className = 'active';
  }
});

body.addEventListener('dblclick', (e) => {
  const input = document.createElement('input');

  input.classList.add('cell-edit');
  input.value = e.target.innerHTML;

  const initialValue = e.target.innerHTML;

  const item = e.target;

  item.innerHTML = ' ';
  item.append(input);
  input.focus();

  input.addEventListener('keypress', (ev) => {
    if (ev.key === 'Enter') {
      if (input.value === '') {
        item.innerHTML = initialValue;
      } else {
        item.innerHTML = input.value;
      }
    }
  });

  input.addEventListener('blur', () => {
    if (input.value === '') {
      item.innerHTML = initialValue;
    } else {
      item.innerHTML = input.value;
    }
  });
});

createEmployeeForm(document.querySelector('body'));
