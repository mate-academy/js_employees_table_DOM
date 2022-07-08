'use strict';

const body = document.querySelector('body');
const headRow = document.querySelector('thead').firstElementChild;
const tbody = document.querySelector('tbody');
let sortDirection;
let sortKey = null;

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form" action="/" method="post">
    <label>
      Name:

      <input
        name="name"
        type="text"
        data-qa="name"
      >
    </label>

    <label>
      Position:

      <input
        name="position"
        type="text"
        data-qa="position"
      >
    </label>

    <label>
      Office:

      <select name="office" data-qa="office">
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
        name="age"
        type="number"
        data-qa="age"
      >
    </label>

    <label>
      Salary:

      <input
        name="salary"
        type="number"
        data-qa="salary"
      >
    </label>

    <button type="submit">
      Save to table
    </button>
  </form>
`);

document.addEventListener('click', e => {
  for (const row of tbody.children) {
    row.classList.remove('active');
  }

  const targetRow = e.target.closest('tr');

  if (targetRow && targetRow.closest('tbody')) {
    targetRow.classList.add('active');
  }
});

function getData() {
  const result = [];

  for (const row of tbody.children) {
    const employee = {};

    for (let i = 0; i < row.children.length; ++i) {
      const key = headRow.children[i].innerText;
      let value = row.children[i].innerText;

      if (key === 'Salary') {
        value = value.replace(/\$|,/g, '');
      }

      if (key === 'Age' || key === 'Salary') {
        value = +value;
      }

      employee[key] = value;
    }

    result.push(employee);
  }

  return result;
}

function setData(data) {
  for (let i = 0; i < tbody.children.length; ++i) {
    for (let j = 0; j < tbody.children[i].children.length; ++j) {
      const key = headRow.children[j].innerText;
      let value = data[i][key];

      if (key === 'Salary') {
        value = `$${value.toLocaleString('en-US')}`;
      }

      tbody.children[i].children[j].innerText = value;
    }
  }
}

function sort() {
  const data = getData();

  data.sort((a, b) => {
    if (typeof a[sortKey] === 'number') {
      return (a[sortKey] - b[sortKey]) * sortDirection;
    }

    if (a[sortKey].toLowerCase() > b[sortKey].toLowerCase()) {
      return sortDirection;
    }

    if (a[sortKey].toLowerCase() < b[sortKey].toLowerCase()) {
      return -sortDirection;
    }

    return 0;
  });

  setData(data);
}

headRow.addEventListener('click', e => {
  if (e.target.innerText === sortKey) {
    sortDirection *= -1;
  } else {
    sortDirection = 1;
  }

  sortKey = e.target.innerText;

  sort();
});

function pushNotification(type, description) {
  const notifications = document.querySelectorAll('.notification');
  let offset = 0;

  for (const ntf of notifications) {
    offset += 10 + ntf.offsetHeight;
  }

  const notification = document.createElement('div');
  const titleElement = document.createElement('h2');
  const descriptionElement = document.createElement('p');

  notification.classList.add('notification', type);
  notification.dataset.qa = 'notification';
  notification.style.top = `${offset + 10}px`;

  titleElement.classList.add('title');
  titleElement.innerText = type[0].toUpperCase() + type.slice(1);

  descriptionElement.innerText = description;

  notification.append(titleElement);
  notification.append(descriptionElement);
  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const newRow = document.createElement('tr');
  const formData = new FormData(form);

  for (const [key, value] of formData) {
    if (!value) {
      pushNotification('error', 'You must complete every field!');

      return;
    }

    if (key === 'name' && value.length < 4) {
      pushNotification('error',
        'Name field must be at least 5 characters long!');

      return;
    }

    if (key === 'age' && (+value < 18 || +value > 90)) {
      pushNotification('error', 'Age must be between 18 and 90!');

      return;
    }

    if (key === 'salary') {
      newRow.insertAdjacentHTML('beforeend',
        `<td>$${(+value).toLocaleString('en-US')}</td>`);
    } else {
      newRow.insertAdjacentHTML('beforeend', `<td>${value}</td>`);
    }
  }

  pushNotification('success', 'Employee has been added successfully!');
  tbody.append(newRow);
  form.reset();
});

tbody.addEventListener('dblclick', e => {
  for (const cellInput of document.querySelectorAll('.cell-input')) {
    cellInput.blur();
  }

  const cell = e.target;
  let input = document.createElement('input');
  const initialText = cell.innerText;
  let index;

  for (let i = 0; i < cell.closest('tr').children.length; ++i) {
    if (cell.closest('tr').children[i] === cell) {
      index = i;

      break;
    }
  }

  cell.innerText = '';
  input.type = 'text';
  input.classList.add('cell-input');
  input.value = initialText;

  if (index === 2) {
    input = document.createElement('select');
    input.classList.add('cell-input');

    input.insertAdjacentHTML('beforeend', `
      <option value="Tokyo" ${initialText === 'Tokyo' ? 'selected' : ''}>
        Tokyo
      </option>

      <option value="Singapore" ${initialText
        === 'Singapore' ? 'selected' : ''}>
        Singapore
      </option>

      <option value="London" ${initialText === 'London' ? 'selected' : ''}>
        London
      </option>

      <option value="New York" ${initialText === 'New York' ? 'selected' : ''}>
        New York
      </option>

      <option value="Edinburgh" ${initialText
        === 'Edinburgh' ? 'selected' : ''}>
        Edinburgh
      </option>

      <option value="San Francisco" ${initialText
        === 'San Francisco' ? 'selected' : ''}>
        San Francisco
      </option>
    `);
  } else if (index > 2) {
    input.type = 'number';

    if (index > 3) {
      input.value = initialText.replace(/\$|,/g, '');
    }
  }

  cell.append(input);

  input.addEventListener('keypress', keypress => {
    if (keypress.code === 'Enter') {
      input.blur();
    }
  });

  input.addEventListener('blur', () => {
    if (!input.value || (index === 0 && input.value.length < 4)
      || (index === 3 && (+input.value < 18 || +input.value > 90))) {
      cell.innerText = initialText;
    } else {
      if (index === 4) {
        cell.innerText = `$${(+input.value).toLocaleString('en-US')}`;
      } else {
        cell.innerText = input.value;
      }
    }

    input.remove();
  });
});
