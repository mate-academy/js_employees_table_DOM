'use strict';

const headRow = document.querySelector('thead tr');
const tbody = document.querySelector('tbody');
let lastChoise;
let flag = 1;
let activeRow;

// ---- sorting ----

headRow.addEventListener('click', e => {
  if (e.target.tagName !== 'TH') {
    return;
  }

  const list = [...tbody.querySelectorAll('tr')];
  const i = [...headRow.children].indexOf(e.target);
  let callback;

  switch (i) {
    case 3:
      callback = (a, b) => a.children[i].innerText - b.children[i].innerText;
      break;

    case 4:
      callback = (a, b) => getSalary(a) - getSalary(b);
      break;

    default:
      callback = (a, b) => {
        return a.children[i].innerText.localeCompare(b.children[i].innerText);
      };
  }

  function getSalary(row) {
    return +row.children[i].innerText.slice(1).split(',').join('');
  }

  if (lastChoise === i) {
    flag *= -1;
  } else {
    lastChoise = i;
    flag = 1;
  }

  tbody.innerHTML = '';
  list.sort((a, b) => callback(a, b) * flag).forEach(tr => tbody.append(tr));
});

// ---- focus ----

tbody.addEventListener('click', e => {
  if (activeRow) {
    activeRow.classList.remove('active');
  }

  activeRow = e.target.closest('tr');
  activeRow.classList.add('active');
});

// ---- form ----

document.querySelector('table').insertAdjacentHTML('afterend', `
  <form class="new-employee-form">
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
      >
    </label>

    <label>Position:
      <input
        name="position"
        type="text"
        data-qa="position"
      >
    </label>

    <label>Office:
      <select name="office" data-qa="office">
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
        type="number"
        data-qa="age"
      >
    </label>

    <label>Salary:
      <input
        name="salary"
        type="number"
        data-qa="salary"
      >
    </label>
    
    <button type="submit">Save to table</button>
  </form>
`);

const form = document.querySelector('.new-employee-form');

// ---- showing notification ----

function showNot(type, not) {
  form.insertAdjacentHTML('afterend', `
    <div class="notification" data-qa="notification">
      <h1 class="title"></h1>
      <p></p>
    </div>
  `);

  const notification = document.querySelector('.notification');
  const notTitle = notification.querySelector('.title');
  const notDescript = notification.querySelector('p');

  switch (type) {
    case 'error':
      notification.classList.add('error');
      notTitle.innerHTML = 'ERROR';
      break;

    case 'success':
      notification.classList.add('success');
      notTitle.innerHTML = 'SUCCESS';
      break;

    default:
      return;
  }

  notDescript.innerHTML = not;

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// ---- validation ----

function validation(key, value) {
  if (!value) {
    showNot('error', 'All fields are required');

    return false;
  }

  if (key === 'name' && value.length < 4) {
    showNot('error', 'Name length should be at least 4 letters');

    return false;
  }

  if (key === 'age' && (+value < 18 || +value > 90)) {
    showNot('error', 'Age should be from 18 to 90');

    return false;
  }

  return true;
}

// ---- normalization for salary ----

function normalize(key, value) {
  return key === 'salary'
    ? `$${(+value).toLocaleString()}`
    : value;
}

// ---- adding new employee ----

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(form);
  const tr = document.createElement('tr');

  for (const [key, value] of formData) {
    if (!validation(key, value)) {
      return;
    }

    tr.insertAdjacentHTML('beforeend', `
      <td>${normalize(key, value)}</td>
    `);
  }

  tbody.append(tr);
  form.reset();
  showNot('success', 'New employee is successfully added to the table');
});

// ---- editing cell ----

tbody.addEventListener('dblclick', e => {
  const target = e.target;
  const targetI = target.cellIndex;
  const oldValue = target.innerText;
  const normValue = oldValue.replace(/[$,]/g, '');
  const targetInput = form.querySelectorAll('[name]')[targetI].cloneNode(true);

  targetInput.classList.add('cell-input');
  targetInput.value = normValue;
  target.firstChild.replaceWith(targetInput);
  targetInput.focus();

  targetInput.addEventListener('keypress', eventKey => {
    if (eventKey.key === 'Enter') {
      targetInput.blur();
    }
  });

  targetInput.addEventListener('blur', ev => {
    if (
      !validation(targetInput.name, targetInput.value) || !targetInput.value
    ) {
      target.innerText = oldValue;

      return;
    }

    target.innerText = normalize(targetInput.name, targetInput.value);
  });
});
