'use strict';

const body = document.querySelector('body');
const tableHead = document.querySelector('thead');
const tableBody = document.querySelector('tbody');

let checkedStatusOfSorting;

function getNumber(checkedValue) {
  return +checkedValue.replace(/[^0-9]/g, '');
}

function sortTableHandler(e) {
  const { cellIndex } = e.target;

  checkedStatusOfSorting = checkedStatusOfSorting === undefined
    ? cellIndex
    : undefined;

  const sortedByCategory = [...tableBody.rows].sort(
    (currentElement, nextElement) => {
      const currentValue = currentElement.cells[cellIndex].innerText;
      const nextValue = nextElement.cells[cellIndex].innerText;

      switch (true) {
        case checkedStatusOfSorting !== undefined:

          return getNumber(currentValue)
            ? getNumber(currentValue) - getNumber(nextValue)
            : currentValue.localeCompare(nextValue);

        default:
          return getNumber(currentValue)
            ? getNumber(nextValue) - getNumber(currentValue)
            : nextValue.localeCompare(currentValue);
      }
    });

  tableBody.append(...sortedByCategory);
}

tableHead.addEventListener('click', sortTableHandler);

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
        required
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
      <select id="country" data-qa="office" required>
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="San Francisco">San Francisco</option>
      </select>
    </label>
    <label>
      Age:
      <input
        type="number"
        name="age"
        data-qa="age"
        required
      >
    </label>
    <label>
      Salary:
      <input
        type="number"
        name="salary"
        data-qa="salary"
        required
      >
    </label>
    <button type="submit">
      Save to table
    </button>
  </form>
`);

const form = body.querySelector('form');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const inputValues = document.querySelectorAll('form label');

  const newEmployee = [...inputValues].reduce((accumulator, item) => {
    accumulator[item.children[0].dataset.qa] = item.children[0].value;

    return accumulator;
  }, {});

  const minNameLength = 4;
  const minAge = 18;
  const maxAge = 90;

  if (newEmployee.name.length < minNameLength) {
    return throwNotification(
      'Warning message',
      'Sorry, but your name has to consist at least 4 letters',
      'error'
    );
  } else if (!newEmployee.position) {
    return throwNotification(
      'Error message',
      'Please choose your position',
      'error'
    );
  } else if (newEmployee.age < minAge
    || newEmployee.age > maxAge) {
    return throwNotification(
      'Error message',
      'You can not add your profile due to your age',
      'error'
    );
  }

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${newEmployee.name}</td>
      <td>${newEmployee.position}</td>
      <td>${newEmployee.office}</td>
      <td>${+newEmployee.age}</td>
      <td>$${(+newEmployee.salary).toLocaleString('en')}</td>
    </tr>
    `);

  [...form.elements].forEach(elem => {
    if (elem.name) {
      elem.value = '';
    }
  });

  return throwNotification(
    'Success message',
    'You have done it, you have added your profile',
    'success');
});

const throwNotification = (title, description, type) => {
  const notification = document.createElement('div');

  notification.className = 'notification';
  notification.setAttribute('data-qa', 'notification');
  notification.classList.add(type);

  const notificationTitle = document.createElement('h2');

  notificationTitle.innerText = title;
  notificationTitle.className = 'title';

  const notificationText = document.createElement('p');

  notificationText.innerText = description;

  body.append(notification);
  notification.append(notificationTitle, notificationText);

  setTimeout(function() {
    return notification.remove();
  }, 3000);
};

function toggleActiveField(e) {
  const { target } = e;

  [...tableBody.rows].forEach(row => row.classList.remove('active'));
  target.closest('tr').classList.add('active');
};
tableBody.addEventListener('click', toggleActiveField);

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
