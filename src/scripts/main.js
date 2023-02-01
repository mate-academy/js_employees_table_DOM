'use strict';

const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');
const tr = tbody.rows;
const ErrorString = 'Error';
const errorString = 'error';

thead.addEventListener('click', e => {
  const sortNames = (arr, column) => {
    if (e.target.getAttribute('data-sorted') === 'ASC') {
      e.target.setAttribute('data-sorted', 'DESC');

      return [...arr].sort((a, b) =>
        b.children[column].textContent < a.children[column].textContent
          ? -1
          : 1
      );
    } else {
      e.target.setAttribute('data-sorted', 'ASC');

      return [...arr].sort((a, b) =>
        a.children[column].textContent < b.children[column].textContent
          ? -1
          : 1
      );
    }
  };

  switch (e.target.textContent) {
    case 'Name':
      let column = 0;

      tbody.append(...sortNames(tr, column));
      break;
    case 'Position':
      column = 1;
      tbody.append(...sortNames(tr, column));
      break;
    case 'Office':
      column = 2;
      tbody.append(...sortNames(tr, column));
      break;
    case 'Age':
      column = 3;
      tbody.append(...sortNames(tr, column));
      break;
    case 'Salary':
      const sortSalary = function(arr) {
        if (e.target.getAttribute('data-sorted') === 'ASC') {
          e.target.setAttribute('data-sorted', 'DESC');

          return [...arr].sort((a, b) =>
            +b.children[4].textContent.slice(1).split(',').join('')
          - +a.children[4].textContent.slice(1).split(',').join(''));
        } else {
          e.target.setAttribute('data-sorted', 'ASC');

          return [...arr].sort((a, b) =>
            +a.children[4].textContent.slice(1).split(',').join('')
            - +b.children[4].textContent.slice(1).split(',').join(''));
        }
      };

      tbody.append(...sortSalary(tr));
      break;
  }
});

tbody.addEventListener('click', e => {
  const patentTarget = e.target.parentElement;

  for (let i = 0; i < tr.length; i++) {
    tr[i].classList.remove('active');
  };

  patentTarget.classList.add('active');
});

const form = document.createElement('form');

document.body.append(form);
form.classList.add('new-employee-form');

form.insertAdjacentHTML('afterbegin', `
  <label>Name:
    <input
      id="name"
      data-qa="name"
      name="name"
      type="text"
      required
    >
  </label>
  <label>Position:
    <input
      id="position"
      data-qa="position"
      name="position"
      type="text"
      required
    >
  </label>
  <label>Office:
    <select
      id="office"
      data-qa="office"
      name="office"
      required
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
      id="age"
      data-qa="age"
      name="age"
      type="number"
      required
    >
  </label>
  <label>Salary:
    <input
      id="salary"
      data-qa="salary"
      name="salary"
      type="number"
      required
    >
  </label>
  <button>Save to table</button>
`);

const nameInput = form.querySelector('#name');
const positionInput = form.querySelector('#position');
const officeInput = form.querySelector('#office');
const ageInput = form.querySelector('#age');
const salaryInput = form.querySelector('#salary');
const button = form.querySelector('button');

const pushNotification = (title, description, type) => {
  const div = document.createElement('div');
  const h2 = document.createElement('h2');
  const p = document.createElement('p');

  document.body.append(div);
  div.append(h2);
  div.append(p);

  div.className = 'notification';
  div.setAttribute('data-qa', 'notification');
  div.classList.add(type);
  h2.className = 'title';
  h2.textContent = title;
  p.textContent = description;

  setTimeout(() => {
    div.remove();
  }, 2000);
};

button.addEventListener('click', e => {
  e.preventDefault();

  if (nameInput.value.length < 4) {
    pushNotification(
      ErrorString,
      'Name should be longer than 4 letters',
      errorString
    );

    return;
  }

  if (positionInput.value.length < 4) {
    pushNotification(
      ErrorString,
      'Position name should be longer than 4 letters',
      errorString
    );

    return;
  }

  if (ageInput.value < 18 || ageInput.value > 90) {
    pushNotification(
      ErrorString,
      'Age should be between 18-90',
      errorString
    );

    return;
  }

  if (salaryInput.value < 100) {
    pushNotification(
      Error,
      'Salary should be more 100',
      errorString
    );

    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${nameInput.value}</td>
      <td>${positionInput.value}</td>
      <td>${officeInput.value}</td>
      <td>${ageInput.value}</td>
      <td>$${Intl.NumberFormat('en-US').format(salaryInput.value)}</td>
    </tr>
  `);

  nameInput.value = null;
  positionInput.value = null;
  officeInput.value = 'Tokyo';
  ageInput.value = null;
  salaryInput.value = null;

  pushNotification(
    'Success',
    'Employee has been added',
    'success'
  );
});

tbody.addEventListener('click', e => {
  if (e.target.tagName !== 'TD') {
    return;
  }

  const inputs = tbody.querySelectorAll('.cell-input');

  if (inputs.length >= 1) {
    return;
  }

  const previousText = e.target.textContent;
  const newInput = e.target.cellIndex === 2
    ? document.createElement('select')
    : document.createElement('input');

  if (newInput.tagName === 'SELECT') {
    newInput.insertAdjacentHTML('afterbegin', `  
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value="San Francisco">San Francisco</option>
    `);
  }

  newInput.value = previousText;
  newInput.classList.add('cell-input');

  e.target.firstChild.replaceWith(newInput);

  const checkInput = function() {
    if (e.target.cellIndex === 0 || e.target.cellIndex === 1) {
      if (newInput.value.length < 4) {
        newInput.replaceWith(previousText);

        pushNotification(
          ErrorString,
          'Should be longer than 4 letters',
          errorString
        );

        return;
      }

      if (!isNaN(newInput.value)) {
        newInput.replaceWith(previousText);

        pushNotification(
          ErrorString,
          `Shouldn't be number`,
          errorString
        );

        return;
      }
    }

    if (e.target.cellIndex === 3) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(previousText);

        pushNotification(
          ErrorString,
          'Should be number',
          errorString
        );

        return;
      }

      if (newInput.value < 18 || newInput.value > 90) {
        newInput.replaceWith(previousText);

        pushNotification(
          ErrorString,
          'Age should be more than 18 and less than 90',
          errorString
        );

        return;
      }
    }

    if (e.target.cellIndex === 4) {
      if (isNaN(newInput.value)) {
        newInput.replaceWith(previousText);

        pushNotification(
          ErrorString,
          'Should be number',
          errorString
        );

        return;
      }

      newInput.replaceWith(
        `$${Intl.NumberFormat('en-US').format(newInput.value)}`
      );
    }

    newInput.replaceWith(newInput.value);
  };

  newInput.addEventListener('blur', ev => {
    checkInput();
  }, true);

  newInput.addEventListener('keydown', ev => {
    if (ev.code === 'Enter') {
      checkInput();
    }
  });
});
