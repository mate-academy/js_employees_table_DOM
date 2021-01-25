'use strict';

const table = document.querySelector('table');
const body = document.querySelector('body');
const thead = table.querySelector('thead');
const tbody = table.querySelector('tbody');
let sorted;

// ----------sorting table---------- \\

function toNum(value) {
  if (+value) {
    return +value;
  } else {
    return parseFloat(value.slice(1));
  }
}

function sortTable(e) {
  const index = e.target.cellIndex;
  const tr = [...tbody.children];

  if (e.target.textContent === sorted) {
    tr.reverse();
  } else {
    sorted = e.target.textContent;

    tr.sort((a, b) => {
      if (!toNum(a.cells[index].innerHTML)) {
        return a.cells[index].innerHTML.localeCompare(b.cells[index].innerHTML);
      }

      return toNum(a.cells[index].innerHTML) - toNum(b.cells[index].innerHTML);
    });
  }

  tbody.append(...tr);
}

thead.addEventListener('click', sortTable);

// ----------selected row---------- \\

tbody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  for (let i = 0; i < tbody.rows.length; i++) {
    if (target === tbody.rows[i]) {
      tbody.rows[i].classList.toggle('active');
    } else {
      tbody.rows[i].classList.remove('active');
    }
  }
});

// ----------create form---------- \\
const form = document.createElement('form');
const div = document.createElement('div');

div.style.alignSelf = 'flex-start';
form.setAttribute('action', '/');
form.setAttribute('method', 'GET');

form.classList.add('new-employee-form');
div.append(form);
body.append(div);

form.insertAdjacentHTML('beforeend', `
  <label>
    Name:
    <input name="name" type="text" data-qa="name" required>
  </label>
  <label>
    Position:
    <input name="position" type="text" data-qa="position" required>
  </label>
  <label>
    Office:
    <select data-qa="office">
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
    <input name = "age" type = "number" data-qa="age" required>
  </label>
  <label>
    Salary:
    <input name = "salary" type = "number" data-qa="salary" required>
  </label>
  <button type="submit">Save to table</button>`);

// ----------valid input && add worker---------- \\

const button = form.querySelector('button');

button.addEventListener('click', (e) => {
  e.preventDefault();

  const worker = {};
  const inputs = form.querySelectorAll('input[data-qa]');
  const select = form.querySelector('select');

  for (const input of inputs) {
    switch (input.dataset.qa) {
      case 'name':
        worker['nameWorker'] = input.value;
        break;
      case 'position':
        worker['position'] = input.value;
        break;
      case 'age':
        worker['age'] = input.value;
        break;
      case 'salary':
        worker['salary'] = input.value;
    }
  }

  worker['office'] = select.value;

  if (validateInput(worker)) {
    const salary = +worker['salary'];

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${worker['nameWorker']}</td>
        <td>${worker['position']}</td>
        <td>${worker['office']}</td>
        <td>${worker['age']}</td>
        <td>$${salary.toLocaleString('en-US')}</td>
      </tr>`);
  }

  const divQa = body.querySelectorAll('div[data-qa]');

  setTimeout(() => {
    for (let i = 0; i < divQa.length; i++) {
      divQa[i].remove();
    }
  }, 3000);
});

function validateInput(data) {
  const notification = document.createElement('div');

  notification.style.position = 'relative';
  notification.style.marginLeft = '24px';

  notification.setAttribute('data-qa', 'notification');

  const { nameWorker, age, position } = data;

  notification.classList.add('notification');

  if (nameWorker.length < 4) {
    notification.classList.add('error');

    notification.insertAdjacentHTML('beforeend', `
      <h2>Invalid NAME!!!</h2>
      <p>The name must contain at least 4 letters!</p>`);

    div.append(notification);

    return false;
  }

  if (position.length < 4) {
    notification.classList.add('error');

    notification.insertAdjacentHTML('beforeend', `
      <h2>Invalid POSITION!!!</h2>
      <p>The position must contain at least 4 letters!</p>`);

    div.append(notification);

    return false;
  }

  if ((age < 18 || age > 90)
    || typeof age !== 'number') {
    notification.classList.add('error');

    notification.insertAdjacentHTML('beforeend', `
      <h2>Invalid AGE!!!</h2>
      <p>Age must be at least 18 and not more than 90!</p>`);

    div.append(notification);

    return false;
  }

  if (nameWorker.length >= 4
    && position.length >= 4
    && (age >= 18 && age <= 90)) {
    notification.classList.add('success');

    notification.insertAdjacentHTML('beforeend', `
      <h2>Data ENTER!!!</h2>
      <p>You are included in the list!</p>`);

    form.reset();

    div.append(notification);

    return true;
  }
};

// ----------double click on cells---------- \\

tbody.addEventListener('dblclick', (e) => {
  const target = e.target;
  const input = document.createElement('input');
  const defaultValue = target.innerHTML;

  input.classList.add('cell-input');
  target.innerHTML = '';
  target.append(input);
  input.focus();

  function saveInput(elem) {
    if (elem.value.length > 0) {
      target.innerHTML = elem.value;
    } else {
      target.innerHTML = defaultValue;
    }
  }

  function forBlur() {
    saveInput(input);
  }

  function forKeydown(key) {
    if (key.code === 'Enter') {
      input.removeEventListener('blur', forBlur);
      saveInput(input);
    }
  }

  input.addEventListener('blur', forBlur);
  input.addEventListener('keydown', forKeydown);
});
