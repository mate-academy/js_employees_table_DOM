'use strict';

// create and sort table
const table = document.querySelector('table');
const tBody = document.querySelector('tbody');
const headCells = table.rows[0].children;

// click on thead
table.tHead.addEventListener('click', action => {
  const index = [...headCells].indexOf(action.target);
  const newOrder = [...tBody.children];
  const targetCell = action.target.closest('th');
  const headCellCondition = targetCell.classList.contains('js-active-head');

  newOrder.sort((a, b) => {
    const contentA = a.children[index].textContent;
    const contentB = b.children[index].textContent;

    // sort by salary
    if (contentA[0] === '$') {
      const numA = contentA.replace(/\D/g, '');
      const numB = contentB.replace(/\D/g, '');

      return headCellCondition
        ? numB - numA
        : numA - numB;
    }

    // strings sort
    if (isNaN(contentA)) {
      return headCellCondition
        ? contentB.localeCompare(contentA)
        : contentA.localeCompare(contentB);
    }

    // nums sort
    return headCellCondition
      ? +contentB - +contentA
      : +contentA - +contentB;
  });

  [...headCells].forEach(cell => {
    if (cell === targetCell) {
      return;
    }

    cell.classList.remove('js-active-head');
  });

  targetCell.classList.toggle('js-active-head');

  tBody.append(...newOrder);
});

// row click
tBody.addEventListener('click', e => {
  const currentTarget = e.target.closest('tr');

  [...tBody.children].forEach(row => row.classList.remove('active'));
  currentTarget.classList.add('active');
});

// create form
table.insertAdjacentHTML(
  'afterend',
  `
  <form class="new-employee-form" method="post">
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
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco"></option>
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

    <button name="button">Save to table</button>
  </form>
  `
);

const form = document.querySelector('.new-employee-form').elements;

// notifications
const pushNotification = (posTop, posRight, title, description, type) => {
  const message = document.createElement('div');

  message.classList.add('notification', `${type}`);
  message.dataset.qa = 'notification';
  message.style.top = `${posTop}px`;
  message.style.right = `${posRight}px`;

  message.innerHTML
  = `
    <h2 class="title">${title}</h2>
    <p>${description}</p>
  `;

  document.body.append(message);

  setTimeout(() => message.remove(), 3000);
};

// form button click
form['button'].addEventListener('click', e => {
  e.preventDefault();

  if (validation() === false) {
    return;
  };

  const salary = +form['salary'].value.replace(/\D/g, '');
  const formatedSalary = '$' + salary.toLocaleString('en-US');

  tBody.insertAdjacentHTML(
    'beforeend',
    `
      <tr>
        <td>${form['name'].value}</td>
        <td>${form['position'].value}</td>
        <td>${form['office'].value}</td>
        <td>${form['age'].value}</td>
        <td>${formatedSalary}</td>
      </tr>
    `
  );

  form['name'].value = '';
  form['position'].value = '';
  form['age'].value = '';
  form['salary'].value = '';

  pushNotification(
    10, 10, 'Success',
    'Your data has been added.', 'success'
  );
});

// form validation
function validation() {
  if (form['name'].value.length < 4) {
    pushNotification(
      10, 10, 'Wrong name',
      'The entered name is too short.', 'error'
    );

    return false;
  }

  if (form['name'].value.match(/[^a-z ]/gi) !== null) {
    pushNotification(
      10, 10, 'Warning',
      'There are unexpected characters in "name".', 'warning'
    );

    return false;
  }

  if (form['position'].value.length < 6) {
    pushNotification(
      10, 10, 'Wrong position',
      'The entered position is too short.', 'error'
    );

    return false;
  }

  if (form['age'].value < 18 || form['age'].value > 90) {
    pushNotification(
      10, 10, 'Wrong age',
      'Age value is less than 18 or more than 90.', 'error'
    );

    return false;
  }

  if (form['salary'].value.replace(/\D/g, '') === null
  || form['salary'].value.length < 5 || form['salary'].value.length > 8) {
    pushNotification(
      10, 10, 'Wrong salary',
      'Wrong salary.', 'error'
    );

    return false;
  }
}

// cells editing
tBody.addEventListener('dblclick', e => {
  const targetData = e.target.closest('td');
  const input = document.createElement('input');
  const targetDataValue = targetData.innerHTML;

  input.classList.add('cell-input');
  input.style.width = window.getComputedStyle(targetData).width;

  targetData.innerHTML = '';
  targetData.append(input);

  input.focus();

  input.addEventListener('blur', blurEvent => {
    if (input.value === '') {
      targetData.innerHTML = targetDataValue;

      return;
    }

    targetData.innerHTML = input.value;
  });
});
