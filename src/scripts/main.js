'use strict';

const body = document.body;

const tableHeader = document.querySelector('thead');

const tableBody = document.querySelector('tbody');

const tableBodyElements = tableBody.getElementsByTagName('tr');

const tableHeaderElements = tableHeader.querySelectorAll('th');

let detector;

const handler = function(index) {
  if (detector !== index) {
    detector = index;

    const arr = [...tableBodyElements];

    const sortedArr = arr.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].innerText;
      const cellB = rowB.cells[index].innerText;

      if (cellA.includes('$')) {
        const newCellA = cellA.slice(1).replace(/,/g, '.');
        const newCellB = cellB.slice(1).replace(/,/g, '.');

        return newCellA - newCellB;
      }

      switch (true) {
        case cellA > cellB:
          return 1;

        case cellA < cellB:
          return -1;

        default:
          return 0;
      }
    });

    tableBody.innerHTML = '';

    for (const row of sortedArr) {
      tableBody.append(row);
    }
  } else {
    detector = null;

    const arr = [...tableBodyElements];

    const sortedArr = arr.sort((rowA, rowB) => {
      const cellA = rowA.cells[index].innerText;
      const cellB = rowB.cells[index].innerText;

      if (cellA.includes('$')) {
        const newCellA = cellA.slice(1).replace(/,/g, '.');
        const newCellB = cellB.slice(1).replace(/,/g, '.');

        return newCellB - newCellA;
      }

      switch (true) {
        case cellA < cellB:
          return 1;

        case cellA > cellB:
          return -1;

        default:
          return 0;
      }
    });

    tableBody.innerHTML = '';

    for (const row of sortedArr) {
      tableBody.append(row);
    }
  }
};

tableHeaderElements.forEach((element, index) => {
  element.addEventListener('click', () => {
    handler(index);
  });
});

tableBody.addEventListener('click', (e) => {
  for (const row of tableBodyElements) {
    row.classList.remove('active');
  }
  e.target.closest('tr').classList.add('active');
});

const form = document.createElement('form');

form.classList.add('new-employee-form');
body.append(form);

form.insertAdjacentHTML('beforeend', `
  <label>
    ${tableHeaderElements[0].innerText}: 
      <input name="name" type="text" data-qa="name">
  </label>
`);

form.insertAdjacentHTML('beforeend', `
  <label>
    ${tableHeaderElements[1].innerText}:
      <input name="position" type="text" data-qa="position">
  </label>
`);

form.insertAdjacentHTML('beforeend', `
  <label>
    ${tableHeaderElements[2].innerText}:
      <select data-qa="office" required></select>
  </label>
`);

form.insertAdjacentHTML('beforeend', `
  <label>
    ${tableHeaderElements[3].innerText}:
      <input name="age" type="number" data-qa="age">
  </label>
`);

form.insertAdjacentHTML('beforeend', `
  <label>
    ${tableHeaderElements[4].innerText}:
      <input name="salary" type="number" data-qa="salary">
  </label>
`);

const selector = document.querySelector('select');

selector.dataset.qa = 'office';

const cities = [
  `Tokyo`,
  `Singapore`,
  `London`,
  `New York`,
  `Edinburgh`,
  `San Francisco`,
];

for (const city of cities) {
  const element = document.createElement('option');

  element.innerText = city;
  selector.append(element);
}

const item = document.createElement('option');

item.innerText = 'Choose:';
item.disabled = true;
item.selected = true;
selector.prepend(item);

const button = document.createElement('button');

button.innerText = 'Save to table';
button.setAttribute('type', 'submit');
form.append(button);

const appropriateNotification = function(title, description, type) {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.innerText = title;
  h2.classList.add('title');
  p.innerText = description;

  notification.append(h2);
  notification.append(p);
  notification.classList.add('notification');
  notification.classList.add(type);
  notification.dataset['qa'] = 'notification';
  body.append(notification);
  setTimeout(() => notification.remove(), 3000);
};

form.addEventListener('submit', (evt) => {
  const newEmployee = document.createElement('tr');
  let count = 0;

  evt.preventDefault();

  for (const element of form.elements) {
    if (element.type === 'submit') {
      break;
    }

    if (element.dataset['qa'] === 'name' && element.value.length < 4) {
      appropriateNotification('Were not there enough letters in the alphabet?',
        'Change your name!!!', 'error');
      break;
    }

    if (element.dataset['qa'] === 'age' && +element.value < 18) {
      appropriateNotification('Your age is not appropriate',
        'get older and come back', 'error');
      break;
    }

    if (element.dataset['qa'] === 'age' && +element.value > 90) {
      appropriateNotification('Your age is not appropriate',
        'You are too old', 'error');
      break;
    }

    if (element.dataset['qa'] === 'salary') {
      newEmployee.insertAdjacentHTML('beforeend', `
        <td>${'$' + element.value}</td>
      `);
    }

    if (element.dataset['qa'] !== 'salary') {
      newEmployee.insertAdjacentHTML('beforeend', `
      <td>${element.value}</td>
    `);
    }

    if (!element.value) {
      appropriateNotification(`it seems like you have `
        + `forgotten something to fill`,
      'fill all gaps', 'error');
      break;
    }
    count++;
  }

  if (count === 5) {
    tableBody.append(newEmployee);
    appropriateNotification('Success', 'A new employee was added', 'success');
  }
});

const table = document.querySelector('table');

table.addEventListener('dblclick', (e) => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const cell = e.target;

  const InitialValue = cell.innerText;

  cell.innerText = '';

  cell.innerHTML = `
    <input class="cell-input">
  `;

  const input = document.querySelector('.cell-input');

  function editor() {
    if (cell.cellIndex === 3) {
      checkAge(input.value);
    }

    if (cell.cellIndex === 4) {
      checkSalary(input.value);
    }

    cell.innerText = input.value || InitialValue;
    input.remove();
  }

  function checkAge(value) {
    const converted = +value;

    if (isFinite(converted)) {
      cell.innerText = value;
    } else {
      cell.innerText = InitialValue;
    }
  }

  function checkSalary(value) {
    const converted = +value;

    if (isFinite(converted)) {
      cell.innerText = `$${(+value).toLocaleString('en')}`;
    } else {
      cell.innerText = InitialValue;
    }
  }

  input.addEventListener('blur', editor);

  input.addEventListener('keydown', (ev) => {
    if (ev.code === 'Enter') {
      editor();
    }
  });
});
