'use strict';

const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

let isSorted;

tableHead.addEventListener('click', (e) => {
  const { target } = e;
  const { cellIndex } = target;

  function getNumber(value) {
    return +value.replace(/[^0-9]/g, '');
  }

  if (isSorted !== cellIndex) {
    isSorted = cellIndex;

    const sorted = [...tableBody.rows].sort((currentElement, nextElement) => {
      const currentValue = currentElement.cells[cellIndex].innerText;
      const nextValue = nextElement.cells[cellIndex].innerText;

      return getNumber(currentValue)
        ? getNumber(currentValue) - getNumber(nextValue)
        : currentValue.localeCompare(nextValue);
    });

    tableBody.append(...sorted);
  } else {
    isSorted = undefined;

    const sorted = [...tableBody.rows].sort((currentElement, nextElement) => {
      const currentValue = currentElement.cells[cellIndex].innerText;
      const nextValue = nextElement.cells[cellIndex].innerText;

      return getNumber(currentValue)
        ? getNumber(nextValue) - getNumber(currentValue)
        : nextValue.localeCompare(currentValue);
    });

    tableBody.append(...sorted);
  }
});

tableBody.addEventListener('click', (e) => {
  const { target } = e;

  [...tableBody.rows].forEach(row => row.classList.remove('active'));
  target.closest('tr').classList.add('active');
});

body.insertAdjacentHTML('beforeend', `
<form
  class="new-employee-form"
  name="new-employee"
  method="POST"
>
  <label>
    Name:
    <input
      type="text"
      name="name"
      data-qa="name"
    >
  </label>
  <label>
    Position:
    <input
      type="text"
      name="position"
      data-qa="position"
    >
  </label>
  <label>
    Office:
    <select id="country" data-qa="office">
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value=San Francisco">San Francisco</option>
    </select>
  </label>
  <label>
    Age:
    <input
      type="number"
      name="age"
      data-qa="age"
    >
  </label>
  <label>
    Salary:
    <input
      type="number"
      name="salary"
      data-qa="salary"
    >
  </label>
  <button type="submit">
    Save to table
  </button>
</form>
`);

const form = document.querySelector('form');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const inputsValues = document.querySelectorAll('form label');

  const employee = [...inputsValues].reduce((accumulator, item) => {
    accumulator[item.children[0].dataset.qa] = item.children[0].value;

    return accumulator;
  }, {}
  );

  let notification;

  if (employee.name.length <= 4) {
    body.insertAdjacentHTML('beforeend', `
  <div class="notification warning" data-qa="notification">
    <h2 class="title">Warning</h2>
    <p>
      Your name is invalid, it has to be at least 5 letters long
    </p>
  </div>
      `);
    notification = document.querySelector('.notification');
    setTimeout(() => notification.remove(), 3000);

    return;
  } else if (employee.age < 18 || employee.age > 90) {
    body.insertAdjacentHTML('beforeend', `
  <div class="notification error" data-qa="notification">
    <h2 class="title">Error</h2>
    <p>
      Your age is invalid, age is valid only in the range from 18 to 90
    </p>
  </div>
    `);
    notification = document.querySelector('.notification');
    setTimeout(() => notification.remove(), 3000);

    return;
  } else {
    body.insertAdjacentHTML('beforeend', `
    <div class="notification success" data-qa="notification">
      <h2 class="title">Success</h2>
      <p>
        Well done, You have been added to the table;
      </p>
    </div>
      `);
    notification = document.querySelector('.notification');
    setTimeout(() => notification.remove(), 3000);
  }

  tableBody.insertAdjacentHTML('afterend', `
    <tr>
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.office}</td>
      <td>${+employee.age}</td>
      <td>$${(+employee.salary).toLocaleString()}</td>
    </tr>
    `);
});

tableBody.addEventListener('dblclick', (e) => {
  const { target } = e;

  const inputElement = document.createElement('input');
  const initialValue = target.innerText;

  target.innerText = '';
  inputElement.value = initialValue;
  inputElement.className = 'cell-input';
  target.appendChild(inputElement).focus();

  const focusedInput = document.querySelector('.cell-input');

  function modified() {
    if (focusedInput.value) {
      target.innerText = focusedInput.value;
    } else {
      target.innerText = initialValue;
    }
    focusedInput.remove();
  }

  ['keydown', 'blur'].forEach(typeEvent => {
    focusedInput.addEventListener(typeEvent, (evt) => {
      const { type, code } = evt;

      if (type === 'blur') {
        setTimeout(() => modified(), 0);
      };

      if (code === 'Enter') {
        modified();
      }
    });
  });
});
