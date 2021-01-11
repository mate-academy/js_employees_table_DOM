'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const itemsThead = { ...thead.children };
const itemsTbody = { ...tbody.children };
let selectedElement = null;
let prevElement = '';

addTableEdite();

for (const item in itemsThead) {
  itemsThead[item].className = 'head';
}

const listHead = document.querySelector('.head');
const thHead = listHead.querySelectorAll('th');
const tempArr = [];
let indexHead = 0;
let prevItem = '';

for (let i = 0; i < [...thHead].length; i++) {
  tempArr.push([...thHead][i].innerHTML);
}

listHead.addEventListener('click', (e) => {
  const item = e.target;

  indexHead = tempArr.lastIndexOf(item.innerHTML);

  for (const unit in itemsTbody) {
    itemsTbody[unit].className = (itemsTbody[unit]
      .children[+indexHead].innerHTML);
  }

  const column = tbody.querySelectorAll('tr');
  const columnArr = [...column];

  function sortColumn(list) {
    if (item.innerHTML.localeCompare(prevItem) === 0) {
      if (toNumber(list[0].className) === 0) {
        list.sort((a, b) => b.className.localeCompare(a.className));
      } else {
        list.sort((a, b) => toNumber(b.className) - toNumber(a.className));
      }
      prevItem = '';
    } else {
      if (toNumber(list[0].className) === 0) {
        list.sort((a, b) => a.className.localeCompare(b.className));
      } else {
        list.sort((a, b) => toNumber(a.className) - toNumber(b.className));
      }
      prevItem = item.innerHTML;
    }

    tbody.append(...list);
  }
  sortColumn(columnArr);
});

function toNumber(string) {
  return Number(string.replace(/\D/g, ''));
};

tbody.addEventListener('click', (e) => {
  e.preventDefault();

  if (selectedElement) {
    selectedElement.className = prevElement;
  }
  selectedElement = e.target.closest('tr');
  prevElement = selectedElement.className;
  selectedElement.className = 'active';
});

const form = document.createElement('form');

document.body.append(form);

form.className = `new-employee-form`;

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input
      name="name"
      data-qa="name"
      type="text"
      required
      minlength="4"
    >
  </label>

  <label>Position:
    <input
      name="position"
      data-qa="position"
      type="text
      required"
    >
  </label>

  <label>Office:
    <select
      name="office"
      data-qa="office"
    >
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    </select>
  </label>
  <label>Age:
    <input
      name="age"
      data-qa="age"
      type="text"
      required
    >
  </label>

  <label>Salary:
    <input
      name="salary"
      data-qa="salary"
      type="text"
      required
    >
  </label>

  <button
    class="button"
    type="submit"
  >
    Save to table
  </button>
`);

form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  const data = new FormData(form);

  const salary = `$${(+data.get('salary')).toLocaleString()}`;
  const age = +`${toNumber(data.get('age'))}`;
  const formCheckResult = formCheck(
    `${age}`,
    `${data.get('name')}`,
    `${data.get('position')}`
  );

  if (!formCheckResult) {
    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${data.get('name')}</td>
      <td>${data.get('position')}</td>
      <td>${data.get('office')}</td>
      <td>${age}</td>
      <td>${salary}</td>
    </tr>
  `);

  function formCheck(ageWorker, nameWorker, positionWorler) {
    if (nameWorker.length < 4) {
      pushNotification(420, 350, 'Error',
        'the name should be atlist 4 characters', 'error');

      return false;
    }

    if (positionWorler.length < 4) {
      pushNotification(420, 350, 'Error',
        'the position should be atlist 4 characters', 'error');

      return false;
    }

    if (+ageWorker < 18) {
      pushNotification(420, 350, 'Error',
        'the age should not be less than 18', 'error');

      return false;
    }

    if (+ageWorker > 90) {
      pushNotification(420, 350, 'Error',
        'the age should not be more than 90', 'error');

      return false;
    }

    if (+data.get('salary') < 50000) {
      pushNotification(420, 350, 'Error!',
        'Employee\'s salary must be greater than $50,000!', 'error');

      return false;
    }

    pushNotification(420, 350, 'Succes',
      'new employee added to the table', 'success');

    return true;
  }

  form.reset();
});

function pushNotification(tops, right, title, description, type) {
  const message = document.createElement('div');

  message.setAttribute('data-qa', 'notification');
  message.classList.add('notification');
  message.classList.add(type);
  message.style.top = tops + 'px';
  message.style.right = right + 'px';

  message.innerHTML = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
    `;

  document.body.append(message);

  setTimeout(() => message.remove(), 2000);
}

function addTableEdite() {
  tbody.addEventListener('dblclick', (e) => {
    const td = e.target;
    const itemValue = td.textContent;
    const input = document.createElement('input');

    input.className = `cell-input`;
    input.value = itemValue;
    input.style.width = window.getComputedStyle(td).width;

    td.textContent = '';
    td.append(input);

    input.addEventListener('blur', () => {
      editTableCell(td, input, itemValue);
      input.remove();
    });

    input.addEventListener('keydown', (ev) => {
      if (ev.code === 'Enter') {
        editTableCell(td, input, itemValue);
        input.remove();
      }
    });
  });
};

function editTableCell(cell, input, cellValue) {
  if (!input.value) {
    cell.textContent = cellValue;

    return;
  }

  cell.textContent = input.value;
}
