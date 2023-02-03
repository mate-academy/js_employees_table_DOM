'use strict';

const body = document.querySelector('body');
const table = document.querySelector('table');
const tBody = table.querySelector('tbody');
const tHead = table.querySelector('thead');

body.insertAdjacentHTML('beforeend', `
  <form
    action="#"
    method="GET"
    class="new-employee-form"
  >
    <label>Name:
      <input
        name="name"
        type="text"
        data-qa="name"
        required
      >
    </label>
    <label>Position:
      <input
        name="position"
        type="text"
        data-qa="position"
        required
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
        type="number"
        min=0
        data-qa="age"
        required
      >
    </label>
    <label>Salary:
      <span>$
        <input
          name="salary"
          type="number"
          min=0
          data-qa="salary"
          required
        >
      </span>
    </label>
    <button type="submit">Save to table</button>
  </form>
`);

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  div.setAttribute('class', `notification ${type}`);
  div.setAttribute('data-qa', 'notification');
  div.append(h2, p);

  h2.setAttribute('class', 'title');
  h2.textContent = title;

  p.textContent = description;

  document.body.append(div);

  setTimeout(() => div.remove(), 2000);
};

function firtLetterCapitalize(str) {
  const result = str.split(' ').map(word => {
    return word[0].toUpperCase() + word.slice(1);
  }).join(' ');

  return result;
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const newEmployee = Object.fromEntries(new FormData(form));

  if (newEmployee.name.length < 4) {
    pushNotification('Error',
      'Name is too short',
      'error');

    return;
  }

  if (Number(newEmployee.age) < 18) {
    pushNotification('Error',
      'You are too young!!!',
      'error');

    return;
  }

  if (Number(newEmployee.age) > 90) {
    pushNotification('Error',
      'You are too old!!!',
      'error');

    return;
  }

  if (newEmployee.salary.length === 0) {
    pushNotification('Error',
      'Invalid salary value',
      'error');

    return;
  }

  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>
      ${firtLetterCapitalize(newEmployee.name)}
    </td>
    <td>
      ${firtLetterCapitalize(newEmployee.position)}
    </td>
    <td>
      ${newEmployee.office}
    </td>
    <td>
      ${newEmployee.age}
    </td>
    <td>
      $${(+newEmployee.salary).toLocaleString('en')}
    </td>
  `;

  pushNotification('Success',
    'Employee has been successfully added',
    'success'
  );

  tBody.append(newRow);
  form.reset();
});

const rows = Array.from(tBody.querySelectorAll('tr'));

const normalizeNumber = value => {
  return +value.replace('$', '').replace(',', '');
};

let modificator;

tHead.addEventListener('click', e => {
  const sortParam = e.target.closest('th').cellIndex;

  const sort = rows.sort((a, b) => {
    const aItem = a.children[sortParam].textContent.trim();
    const bItem = b.children[sortParam].textContent.trim();

    return normalizeNumber(aItem) - normalizeNumber(bItem)
      || aItem.localeCompare(bItem);
  });

  if (modificator) {
    tBody.append(...sort.reverse());
    modificator = false;
  } else {
    tBody.append(...sort);
    modificator = true;
  }
});

tBody.addEventListener('click', e => {
  Array.from(tBody.rows).forEach(row => {
    row.classList.toggle('active',
      row === e.target.closest('tr'));
  });
});

tBody.addEventListener('dblclick', e => {
  const cell = e.target.closest('td');

  if (!cell) {
    return;
  }

  let cellValue = cell.textContent;

  cell.textContent = '';

  const input = document.createElement('input');

  input.setAttribute('class', 'cell-input');
  input.style = `width: ${cell.getBoundingClientRect().width / 2}px`;
  cell.innerHTML = '';
  cell.append(input);
  input.focus();

  const replaceInputValue = () => {
    const check = input.value.toUpperCase() === input.value.toLowerCase();

    if (cell.cellIndex === 0 && check === false) {
      cellValue = firtLetterCapitalize(input.value);
    }

    if (cell.cellIndex === 1 && check === false) {
      cellValue = firtLetterCapitalize(input.value);
    }

    if (cell.cellIndex === 2 && check === false) {
      cellValue = firtLetterCapitalize(input.value);
    }

    if (cell.cellIndex === 3 && check === true) {
      if (+input.value >= 18 && +input.value <= 90) {
        cellValue = input.value;
      }
    }

    if (cell.cellIndex === 4 && check === true) {
      if (+input.value > 0) {
        cellValue = `$${(+input.value).toLocaleString('en')}`;
      }
    }

    cell.textContent = cellValue;
  };

  input.addEventListener('blur', () => {
    replaceInputValue();
  });

  input.addEventListener('keydown', evnt => {
    if (evnt.key !== 'Enter') {
      return;
    }

    replaceInputValue();

    document.activeElement.blur();
  });
});
