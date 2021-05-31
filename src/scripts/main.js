'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const array = [...tbody.rows].map(row =>
  [
    row.cells[0].innerText,
    row.cells[1].innerText,
    row.cells[2].innerText,
    row.cells[3].innerText,
    row.cells[4].innerText,
  ]
);

const checkout = {
  name: true,
  position: true,
  office: true,
  age: true,
  salary: true,
};

tbody.addEventListener('click', e => {
  const rows = tbody.querySelectorAll('tr');

  if (e.target.tagName === 'TD') {
    for (const row of rows) {
      row.closest('tr').classList.toggle(
        'active', e.target.closest('tr') === row
      );
    }
  }
});

function sortABCTable(word, index) {
  if (checkout[word]) {
    array.sort((a, b) => a[index].localeCompare(b[index]));
    checkout[word] = !checkout[word];
  } else {
    array.reverse();
    checkout[word] = !checkout[word];
  }
}

table.addEventListener('click', e => {
  if (e.target.tagName === 'TH') {
    switch (e.target.innerText) {
      case 'Name':
        sortABCTable('name', 0);
        break;
      case 'Position':
        sortABCTable('position', 1);
        break;
      case 'Office':
        sortABCTable('office', 2);
        break;
      case 'Age':
        if (checkout.age) {
          array.sort((a, b) => a[3] - b[3]);
          checkout.age = !checkout.age;
        } else {
          array.reverse();
          checkout.age = !checkout.age;
        }
        break;
      case 'Salary':
        if (checkout.salary) {
          array.sort((a, b) => {
            return a[4].replace(/[^0-9]/g, '') - b[4].replace(/[^0-9]/g, '');
          });
          checkout.salary = !checkout.salary;
        } else {
          array.reverse();
          checkout.salary = !checkout.salary;
        }
        break;
    }
    changeTheTable(array);
  }
});

function changeTheTable(arr) {
  tbody.innerHTML = '';

  for (const row of arr) {
    const newRow = tbody.insertRow();

    for (let j = 0; j < row.length; j++) {
      const newCell = newRow.insertCell();

      newCell.appendChild(document.createTextNode(row[j]));
    }
  }
}

const list = [
  'Tokyo',
  'Singapore',
  'London',
  'New York',
  'Edinburgh',
  'San Francisco',
];

body.insertAdjacentHTML('beforeend',
  `
    <form class="new-employee-form" onsubmit="return false;">
        <label>
          Name: 
          <input data-qa="name" name="name" type="text">
        </label>

        <label>

          Position: 
          <input data-qa="position" name="position" type="text">
        </label>

        <label>
          Office: 
            <select data-qa="office" name="office">
                ${list.map(office => `<option>${office}</option>`)}
            </select>
        </label>

        <label>
          Age: 
          <input data-qa="age" name="age" type="number">
        </label>

        <label>
          Salary: 
            <input data-qa="salary" name="salary" type="number">
        </label>

        <button type="submit">Save to table</button>
    </form>
  `
);

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  const check = document.querySelector('.notification');

  if (check) {
    check.remove();
  }

  if (e.target.name.value.length < 4) {
    pushNotification(10, 10, 'Упс...',
      `Имя раба слишком короткое!\n
      Хоть он его и не достоин...`, 'error');

    return;
  }

  if (+e.target.age.value < 18) {
    pushNotification(10, 10, 'Упс...',
      `Этот раб слишком юн!\n
      Пусть подрастет хотя бы до 18,`
      + `тогда мы сможем использовать его на полную.`, 'error');

    return;
  }

  if (+e.target.age.value > 90) {
    pushNotification(10, 10, 'Упс...',
      `А этот раб слишком стар!\n
      Толку от него? Ищи тех кто младше 90,`
      + `чем младше найдешь тем больше получишь, хе-хе.`, 'error');

    return;
  }

  if (!e.target.position.value || !e.target.salary.value) {
    pushNotification(10, 10, 'Упс...',
      `Мне кажется или ты забыл что-то запонлить?`, 'error');

    return;
  }

  const addToTable = [];

  addToTable.push(e.target.name.value);
  addToTable.push(e.target.position.value);
  addToTable.push(e.target.office.value);
  addToTable.push(+e.target.age.value);

  const value = +e.target.salary.value;

  addToTable.push('$' + value.toLocaleString('en'));

  array.push(addToTable);

  changeTheTable(array);

  pushNotification(10, 10, 'Успех!',
    'Добален новый раб!', 'success');

  e.target.name.value = '';
  e.target.position.value = '';
  e.target.age.value = '';
  e.target.salary.value = '';
});

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  h2.innerText = title;
  h2.className = 'title';
  p.innerText = description;
  notification.appendChild(h2);
  notification.appendChild(p);
  notification.className = `notification ${type}`;
  notification.style.right = posRight + 'px';
  notification.style.top = posTop + 'px';
  notification.setAttribute('data-qa', 'notification');
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
};

table.addEventListener('dblclick', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const input = document.createElement('input');

  input.setAttribute('type', 'text');
  input.setAttribute('class', 'cell-input');

  const selectedRow = document.querySelector('.active');
  const indexCell = [...selectedRow.children].findIndex(x => x === e.target);
  const indexRow = [...tbody.rows].findIndex(x => x === selectedRow);

  tbody.rows[indexRow].replaceChild(
    input, tbody.rows[indexRow].cells[indexCell]);

  input.select();

  input.addEventListener('keydown', act => {
    if (act.key === 'Enter') {
      array[indexRow][indexCell] = input.value;

      changeTheTable(array);
    }
  });

  input.addEventListener('blur', act => {
    array[indexRow][indexCell] = input.value;

    changeTheTable(array);
  });
});
