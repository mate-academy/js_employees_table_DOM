'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const rows = tbody.querySelectorAll('tr');
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

document.addEventListener('click', e => {
  if (e.target.tagName === 'TD') {
    for (const row of rows) {
      row.closest('tr').classList.toggle(
        'active', e.target.closest('tr') === row
      );
    }
  }

  if (e.target.tagName === 'TH') {
    switch (e.target.innerText) {
      case 'Name':
        if (checkout.name) {
          array.sort((a, b) => a[0].localeCompare(b[0]));
          checkout.name = !checkout.name;
        } else {
          array.sort((a, b) => b[0].localeCompare(a[0]));
          checkout.name = !checkout.name;
        }
        break;
      case 'Position':
        if (checkout.position) {
          array.sort((a, b) => a[1].localeCompare(b[1]));
          checkout.position = !checkout.position;
        } else {
          array.sort((a, b) => b[1].localeCompare(a[1]));
          checkout.position = !checkout.position;
        }
        break;
      case 'Office':
        if (checkout.office) {
          array.sort((a, b) => a[2].localeCompare(b[2]));
          checkout.office = !checkout.office;
        } else {
          array.sort((a, b) => b[2].localeCompare(a[2]));
          checkout.office = !checkout.office;
        }
        break;
      case 'Age':
        if (checkout.age) {
          array.sort((a, b) => a[3] - b[3]);
          checkout.age = !checkout.age;
        } else {
          array.sort((a, b) => b[3] - a[3]);
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
          array.sort((a, b) => {
            return b[4].replace(/[^0-9]/g, '') - a[4].replace(/[^0-9]/g, '');
          });
          checkout.salary = !checkout.salary;
        }
        break;
    }
  }

  for (let i = 0; i < tbody.rows.length; i++) {
    for (let j = 0; j < tbody.rows[i].cells.length; j++) {
      tbody.rows[i].cells[j].innerText = array[i][j];
    }
  }
});

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

  const newRow = tbody.insertRow();

  addToTable.forEach((item) => {
    return newRow.insertCell().appendChild(document.createTextNode(item));
  });

  pushNotification(10, 10, 'Успех!',
    'Добален новый раб!', 'success');
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

tbody.addEventListener('dblclick', e => {
  const input = document.createElement('input');

  input.setAttribute('type', 'text');
  input.setAttribute('class', 'cell-input');

  const selectedRow = document.querySelector('.active');
  const indexCell = [...selectedRow.children].findIndex(x => x === e.target);
  const indexRow = [...tbody.rows].findIndex(x => x === selectedRow);

  tbody.rows[indexRow].deleteCell(indexCell);
  tbody.rows[indexRow].cells[indexCell - 1].after(input);
  input.select();

  input.addEventListener('blur', act => {
    const td = document.createElement('td');

    td.textContent = input.value;

    tbody.rows[indexRow].cells[indexCell - 1].after(td);
    input.remove();
  });
});
