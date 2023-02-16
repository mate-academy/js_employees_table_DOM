'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
let index = -1;

thead.addEventListener('click', (e) => {
  const target = e.target.closest('th');
  const cellIndex = target.cellIndex;

  if (!target) {
    return;
  }

  const sorted = [...tbody.children].sort((a, b) => {
    let itemA = a.cells[cellIndex].innerHTML;
    let itemB = b.cells[cellIndex].innerHTML;

    if (itemA.charAt(0) === '$') {
      itemA = +itemA.slice(1).split(',').join('');
      itemB = +itemB.slice(1).split(',').join('');

      return itemA - itemB;
    }

    return itemA.localeCompare(itemB);
  });

  if (cellIndex === index) {
    sorted.reverse();
  }

  sorted.forEach(el => {
    tbody.append(el);
  });

  index = cellIndex === index ? -1 : cellIndex;
});

tbody.addEventListener('click', (e) => {
  const target = e.target.closest('tr');

  target.classList.contains('active')
    ? target.classList.remove('active')
    : select(target);
});

function select(target) {
  const rows = [...tbody.children];

  rows.forEach(el => el.classList.remove('active'));

  target.classList.toggle('active');
}

document.querySelector('table').insertAdjacentHTML('afterend', `
  <form class="new-employee-form">
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
      <select
        name="office"
        data-qa="office"
      >
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

const form = document.forms[0];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const elements = form.elements;
  const row = document.createElement('tr');
  const formWithoutBtn = [...elements].slice(0, elements.length - 1);

  for (const el of formWithoutBtn) {
    if (!validation(el)) {
      return;
    }
  }

  row.insertAdjacentHTML('beforeend', `
    <td>${elements.name.value}</td>
    <td>${elements.position.value}</td>
    <td>${elements.office.value}</td>
    <td>${elements.age.value}</td>
    <td>${normalizeSalary(elements.salary.value)}</td>
  `);

  tbody.append(row);

  createNotification('Success!', 'A new employee has been added', 'success');

  form.reset();
});

function validation(el) {
  const value = el.value;

  if (value === '') {
    createNotification(
      'Error!',
      'All fields are required',
      'error'
    );

    return false;
  }

  if (el.name === 'name' && (value.length < 4 || value.length > 16)) {
    createNotification(
      'Error!',
      'Name should be 4 - 16 characters',
      'error'
    );

    return false;
  }

  if (el.name === 'age' && (value < 18 || value > 90)) {
    createNotification(
      'Error!',
      'Age must be greater than 18 and less than 90',
      'error'
    );

    return false;
  }

  if (el.name === 'salary' && value < 0) {
    createNotification(
      'Error!',
      'Salary cannot be less than 0',
      'error'
    );

    return false;
  }

  return true;
}

function normalizeSalary(value) {
  const thousandsSeparator = new Intl.NumberFormat('en-us');

  return `$${thousandsSeparator.format(value)}`;
}

function createNotification(title, description, type) {
  const div = document.createElement('div');

  if (document.querySelector('.notification')) {
    return;
  }

  div.setAttribute('data-qa', 'notification');

  div.className = `notification ${type}`;

  div.insertAdjacentHTML('beforeend', `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `);

  document.body.append(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

tbody.addEventListener('dblclick', (e) => {
  const target = e.target.closest('td');

  if (!target) {
    return;
  }

  const cellIndex = target.cellIndex;
  const init = target.innerHTML;
  const input = form.querySelectorAll('[name]')[cellIndex].cloneNode(true);

  input.classList.add('cell-input');

  if (document.querySelector('.cell-input')) {
    return;
  }

  target.innerHTML = '';
  input.value = init;
  target.append(input);
  input.focus();

  input.addEventListener('blur', () => {
    if (!validation(input)) {
      target.innerHTML = init;
      input.remove();

      return;
    }

    target.innerHTML = input.name === 'salary'
      ? target.innerHTML = normalizeSalary(input.value)
      : input.value;

    input.remove();
  });

  input.addEventListener('keydown', (keyEvent) => {
    if (keyEvent.key === 'Enter') {
      input.blur();
    }
  });
});
