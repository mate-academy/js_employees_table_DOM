'use strict';

const body = document.querySelector('body');
const head = document.querySelector('table').tHead;
const table = document.querySelector('table').tBodies[0];

const notification = document.createElement('div');

notification.classList.add('notification');
notification.dataset.qa = 'notification';

function showNotification(error) {
  if (!error) {
    notification.className = 'notification success';

    notification.innerHTML = `
      <h2 class="title">Success</h2>
      <p>The person was successfully added</p>
    `;
  } else {
    notification.className = 'notification error';

    notification.innerHTML = `
      <h2 class="title">Error</h2>
      <p>Please, enter correct ${error}!</p>
    `;
  }

  body.append(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

const people = [];

let indexCounter = 0;

for (const man of table.children) {
  people.push({
    name: man.children[0].textContent,
    position: man.children[1].textContent,
    office: man.children[2].textContent,
    age: man.children[3].textContent,
    salary: man.children[4].textContent.replace(/[$,]/g, ''),
    id: indexCounter,
  });

  indexCounter++;
}

refreshTable();

function refreshTable() {
  table.innerHTML = '';

  for (const man of people) {
    table.insertAdjacentHTML('beforeend', `
      <tr data-id="${man.id}">
        <td data-index="0">${man.name}</td>
        <td data-index="1">${man.position}</td>
        <td data-index="2">${man.office}</td>
        <td data-index="3">${man.age}</td>
        <td data-index="4">$${man.salary.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
      </tr>
    `);
  }
}

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
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
      <select name="select" required>
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label required>
      Age:
      <input name="age" type="number" min="0">
    </label>
    <label required>
      Salary:
      <input name="salary" type="number" step="100" min="0">
    </label>
    <button type="button" class="add-person-button">Save to table</button>
  </form>
`);

let titleClick = '';

head.addEventListener('click', (e) => {
  const item = e.target.closest('th');

  if (!item) {
    return;
  }

  switch (item.textContent) {
    case 'Name':
      if (item.textContent !== titleClick) {
        titleClick = item.textContent;
        people.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        titleClick = '';
        people.sort((a, b) => b.name.localeCompare(a.name));
      }
      break;
    case 'Position':
      if (item.textContent !== titleClick) {
        titleClick = item.textContent;
        people.sort((a, b) => a.position.localeCompare(b.position));
      } else {
        titleClick = '';
        people.sort((a, b) => b.position.localeCompare(a.position));
      }
      break;
    case 'Office':
      if (item.textContent !== titleClick) {
        titleClick = item.textContent;
        people.sort((a, b) => a.office.localeCompare(b.office));
      } else {
        titleClick = '';
        people.sort((a, b) => b.office.localeCompare(a.office));
      }
      break;
    case 'Age':
      if (item.textContent !== titleClick) {
        titleClick = item.textContent;
        people.sort((a, b) => a.age - b.age);
      } else {
        titleClick = '';
        people.sort((a, b) => b.age - a.age);
      }
      break;
    case 'Salary':
      if (item.textContent !== titleClick) {
        titleClick = item.textContent;
        people.sort((a, b) => a.salary - b.salary);
      } else {
        titleClick = '';
        people.sort((a, b) => b.salary - a.salary);
      }
      break;
  }

  refreshTable();
});

const form = document.querySelector('.new-employee-form');

form.addEventListener('click', (e) => {
  if (!e.target.classList.contains('add-person-button')) {
    return;
  }

  const nameValue = form.children[0].children[0].value;
  const positionValue = form.children[1].children[0].value;
  const officeValue = form.children[2].children[0].value;
  const ageValue = form.children[3].children[0].value;
  const salaryValue = form.children[4].children[0].value;

  if (nameValue.length < 4) {
    showNotification('name');

    return;
  }

  if (positionValue.match(/[0-9]/g) || positionValue.trim().length < 1) {
    showNotification('position');

    return;
  }

  if (ageValue < 18 || ageValue > 90) {
    showNotification('age');

    return;
  }

  if (!salaryValue) {
    showNotification('salary');

    return;
  }

  people.push({
    name: nameValue,
    position: positionValue,
    office: officeValue,
    age: ageValue,
    salary: salaryValue,
    id: people.length,
  });

  form.children[0].children[0].value = '';
  form.children[1].children[0].value = '';
  form.children[2].children[0].value = 'Tokyo';
  form.children[3].children[0].value = '';
  form.children[4].children[0].value = '';

  refreshTable();
});

let activeRow;

table.addEventListener('click', (e) => {
  const item = e.target.closest('tr');

  if (!activeRow) {
    activeRow = item;
  }

  if (activeRow === item) {
    item.classList.toggle('active');
  } else {
    item.classList.add('active');
    activeRow.classList.remove('active');
    activeRow = item;
  }
});

table.addEventListener('dblclick', (e) => {
  if (document.querySelector('.cell-input')) {
    return;
  }

  const item = e.target;
  const rowIndex = item.closest('tr').dataset.id;
  const columnIndex = item.dataset.index;

  const cellInput = document.createElement('input');

  cellInput.className = 'cell-input';

  if (columnIndex > 2) {
    cellInput.type = 'number';
  } else {
    cellInput.type = 'text';
  }

  if (columnIndex < 3) {
    cellInput.setAttribute('value', item.textContent);
  } else if (columnIndex === 3) {
    cellInput.setAttribute('value', +item.textContent);
  } else {
    cellInput.setAttribute('value', +item.textContent.replace(/[$,]/g, ''));
    cellInput.step = 100;
  }

  item.innerHTML = '';
  item.append(cellInput);
  cellInput.focus();

  cellInput.addEventListener('keydown', (key) => {
    if (key.key !== 'Enter') {
      return;
    }

    const man = people.find(x => x.id === +rowIndex);

    switch (columnIndex) {
      case '0':
        if (cellInput.value.length > 3) {
          man.name = cellInput.value.match(/[a-z]/gi).join('');
        }
        break;
      case '1':
        if (cellInput.value.length > 1) {
          man.position = cellInput.value.match(/[a-z]/gi).join('');
        }
        break;
      case '2':
        if (cellInput.value.length > 1) {
          man.office = cellInput.value.match(/[a-z]/gi).join('');
        }
        break;
      case '3':
        if (+cellInput.value > 0) {
          man.age = cellInput.value;
        }
        break;
      case '4':
        if (+cellInput.value > 0) {
          man.salary = cellInput.value;
        }
        break;
    }

    refreshTable();
  });
});
