'use strict';

const table = document.querySelector('table');
const tbody = document.querySelector('tbody');
const sorting = {
  name: false,
  position: false,
  office: false,
  age: false,
  salary: false,
};

document.body.addEventListener('click', anEvent => {
  const list = [...tbody.querySelectorAll('tr')];
  const target = anEvent.target;
  const isItHead = table.children[0].contains(target);
  const isItBody = table.children[1].contains(target);

  if (isItHead) {
    switch (target.innerText) {
      case 'Name':
        sorting.name = !sorting.name;
        sortList(list, 0);
        break;

      case 'Position':
        sorting.position = !sorting.position;
        sortList(list, 1);
        break;

      case 'Office':
        sorting.office = !sorting.office;
        sortList(list, 2);
        break;

      case 'Age':
        sorting.age = !sorting.age;
        sortList(list, 3);
        break;

      case 'Salary':
        sorting.salary = !sorting.salary;
        sortList(list, 4);
        break;
    };
  };

  if (isItBody) {
    const addActive = target.parentElement;

    list.map(elem => elem.classList.remove('active'));
    addActive.className = 'active';

    if (addActive.parentElement.tagName !== 'TBODY') {
      addActive.parentElement.className = 'active';
    };
  } else if (!isItBody && !isItHead) {
    list.map(elem => elem.classList.remove('active'));
  };
});

function sortList(rows, column) {
  rows.sort((a, b) => {
    const innerA = a.children[column].innerText;
    const innerB = b.children[column].innerText;

    if (parseNum(innerA)) {
      return parseNum(innerB) - parseNum(innerA);
    } else {
      return innerB.localeCompare(innerA);
    };
  });

  const sortColumns = table.children[0].children[0]
    .children[column].innerText.toLowerCase();

  if (sorting[sortColumns]) {
    rows.reverse();
  };

  rows.forEach(elem => table.children[1].append(elem));
};

function parseNum(par) {
  let result = '';

  for (const char of par) {
    if ('1234567890'.includes(char)) {
      result += char;
    };
  };

  return +result;
};

table.insertAdjacentHTML('afterend', `
<form class="new-employee-form" action="#" method="get">
  <label>
    Name:
    <input name="name" type="text" required>
  </label>

  <label>
    Position:
    <input name="position" type="text" required>
  </label>

  <label>
    Office: 
    <select name="office">
      <option>Tokyo</option>
      <option>Singapore</option>
      <option>London</option>
      <option>New York</option>
      <option>Edinburgh</option>
      <option>San Francisco</option>
    </select>
  </label>

  <label>
    Age:
    <input name="age" type="number" required>
  </label>

  <label>
    Salary:
    <input name="salary" type="number" required>
  </label>

  <button type="submit">Save to table</button>
  <button type="reset">Reset</button>
</form>`);

const form = document.querySelector('form');
let notif = true;

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let newEmployee = new FormData(form);

  newEmployee = Object.fromEntries(newEmployee.entries());

  if (newEmployee.name.length < 4) {
    if (notif) {
      pushNotification('ERROR',
        'Name must be longer than 4 letters', 'error');
    };

    return;
  };

  if (+newEmployee.age < 18 || +newEmployee.age > 90) {
    if (notif) {
      pushNotification('ERROR',
        'Age must be between 18 and 90', 'error');
    };

    return;
  };

  const newTr = document.createElement('tr');

  for (const option in newEmployee) {
    const newTd = document.createElement('td');

    newTd.append(newEmployee[option]);
    newTr.append(newTd);
  };

  let salary = +newTr.lastChild.innerText;

  salary = salary.toLocaleString('en-US');

  newTr.lastChild.innerText = '$' + salary;

  tbody.insertAdjacentHTML('beforeend', `${newTr.innerHTML}`);

  if (notif) {
    pushNotification('SUCCESS',
      'New employee is successfully added to the table', 'success');
  };
});

function pushNotification(title, description, type) {
  const newNotif = document.createElement('div');

  newNotif.innerHTML = `
    <h2 class='title'>${title}</h2>
    <p>${description}</p>
  `;

  newNotif.className = (`notification ${type}`);
  document.body.append(newNotif);
  notif = false;

  setTimeout(() => {
    notif = true;

    return newNotif.remove();
  }, 3000);
};

let oldDate;
let savedTarget;

tbody.addEventListener('dblclick', (anEvent) => {
  const isInput = document.getElementById('newData');
  const target = anEvent.target;
  const savedData = target.textContent;

  if (isInput) {
    isInput.remove();
    savedTarget.textContent = oldDate;
  };

  oldDate = savedData;
  savedTarget = target;

  const input = document.createElement('input');

  input.id = 'newData';
  target.textContent = '';

  input.type = (savedData.includes('$') || +savedData)
    ? 'number'
    : 'text';

  if (input.type === 'number') {
    input.min = '18';
    input.max = '90';
  };

  input.className = 'cell-input';
  input.style.width = '100%';

  let newData = '';

  input.oninput = () => {
    newData = input.value;
  };

  input.addEventListener('keydown', (asEvent) => {
    if (asEvent.key === 'Enter') {
      if ((newData.length < 4 && input.type === 'text')) {
        if (notif) {
          pushNotification('ERROR',
            'Name must be longer than 4 letters', 'error');
        };

        target.textContent = savedData;
      } else if ((newData < 18 || newData > 90)
        && !savedData.includes('$')) {
        if (notif) {
          pushNotification('ERROR',
            'Age must be between 18 and 90', 'error');
        };

        target.textContent = savedData;
      } else if (oldDate.includes('$')) {
        if (!newData) {
          target.textContent = savedData;
        } else {
          newData = +newData;
          newData = '$' + newData.toLocaleString('en-US');
          target.textContent = newData;
        };
      } else {
        target.textContent = newData;
      };
    };
  });

  target.append(input);
  input.focus();
});
