'use strict';

const body = document.body;
const tbody = document.querySelector('tbody');
const theadList = [...document.querySelector('thead tr').children];
const rows = [...tbody.rows];
const table = document.querySelector('table');

function salaryToNumber(sal) {
  return +sal.slice(1).split(',').join('');
};

let previousClick;

function ascSort(el) {
  const index = theadList.indexOf(el.target);

  if (el.target.tagName !== 'TH') {
    return;
  };

  rows.sort((a, b) => {
    const elementA = a.cells[index].textContent;
    const elementB = b.cells[index].textContent;

    if (el.target.textContent === 'Salary') {
      return salaryToNumber(elementA) - salaryToNumber(elementB);
    }

    return elementA.localeCompare(elementB);
  });

  tbody.append(...rows);
  previousClick = el.target;
};

function descSort(el) {
  const index = theadList.indexOf(el.target);

  if (el.target.tagName !== 'TH') {
    return;
  };

  rows.sort((a, b) => {
    const elementA = a.cells[index].textContent;
    const elementB = b.cells[index].textContent;

    if (el.target.textContent === 'Salary') {
      return salaryToNumber(elementB) - salaryToNumber(elementA);
    }

    return elementB.localeCompare(elementA);
  });

  tbody.append(...rows);
  previousClick = '';
}

table.addEventListener('click', e => {
  if (previousClick !== e.target) {
    ascSort(e);
  } else {
    descSort(e);
  }
});

let previousRow;

tbody.addEventListener('click', e => {
  const row = e.target.parentNode;

  if (row !== previousRow) {
    row.classList.add('active');

    if (previousRow) {
      previousRow.classList.remove('active');
    }
    previousRow = row;
  }
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
      <input name="name" type="text" data-qa="name">
    </label>
    <label>Position:
      <input name="position" type="text" data-qa="position">
    </label>
    <label>Office:
      <select name="office" data-qa="office">
        <option>Tokyo</option>
        <option>Singapore</option>
        <option>London</option>
        <option>New York</option>
        <option>Edinburgh</option>
        <option>San Francisco</option>
      </select>
    </label>
    <label>Age:
      <input name="age" type="number" data-qa="age">
    </label>
    <label>Salary:
      <input name="salary" type="number" data-qa="salary">
    </label>

    <button type"submit">
      Save to table
    </button>
  </form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', ev => {
  ev.preventDefault();

  if (form.elements.name.value.length < 4) {
    notification('Error', 'error',
      'Name must contain at least 4 letters');

    return;
  }

  if (form.elements.age.value < 18 || form.elements.age.value > 90) {
    notification('Error',
      'error', 'Age must be between 18 and 90');

    return;
  }

  if (form.elements.position.value === ''
      || form.elements.salary.value === '') {
    notification('Missing data',
      'error', 'Please, fill all fields');

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${form.elements.name.value}</td>
      <td>${form.elements.position.value}</td>
      <td>${form.elements.office.value}</td>
      <td>${form.elements.age.value}</td>
      <td>$${parseInt(+form.elements.salary.value).toLocaleString('en-US')}</td>
    </tr>
    `);

  notification('Success!', 'success',
    'New employee successfully added');
  form.reset();
});

function notification(title, type, description) {
  body.insertAdjacentHTML('beforeend', `
  <div class="notification ${type}" data-qa="notification">
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  </div>
  `);

  setTimeout(() => {
    body.removeChild(document.querySelector('.notification'));
  }, 3000);
};

tbody.addEventListener('dblclick', e => {
  const input = document.createElement('input');
  const previousValue = e.target.textContent;

  input.classList.add('cell-input');
  e.target.textContent = '';
  e.target.append(input);
  input.focus();

  input.addEventListener('focusout', () => {
    if (!input.value) {
      input.value = previousValue;
    }
    e.target.textContent = input.value;
    input.remove();

    if (e.target.cellIndex === 0
        && e.target.textContent.length < 4) {
      e.target.textContent = previousValue;

      notification('Error', 'error',
        'Name must contain at least 4 letters');
    }

    if (e.target.cellIndex === 3) {
      if (isNaN(input.value)) {
        e.target.textContent = previousValue;

        notification('Error', 'error',
          'Age must be a number');
      };

      if (input.value < 18
        || input.value > 90) {
        e.target.textContent = previousValue;

        notification('Error', 'error',
          'Age must be between 18 and 90');
      }
    }

    if (e.target.cellIndex === 4) {
      if (!isNaN(input.value)) {
        e.target.textContent = '$' + parseInt(input.value)
          .toLocaleString('en-US');
      } else {
        e.target.textContent = previousValue;

        notification('Error', 'error',
          'Please, enter only numbers without symbols');
      }
    }
  });

  input.addEventListener('keydown', enter => {
    if (enter.code === 'Enter') {
      input.blur();
    };
  });
});
