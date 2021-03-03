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

  isSorted = cellIndex;

  const sorted = [...tableBody.rows].sort((currentElement, nextElement) => {
    const currentValue = currentElement.cells[cellIndex].innerText;
    const nextValue = nextElement.cells[cellIndex].innerText;

    if (isSorted) {
      isSorted = undefined;

      return getNumber(currentValue)
        ? getNumber(currentValue) - getNumber(nextValue)
        : currentValue.localeCompare(nextValue);
    } else {
      return getNumber(currentValue)
        ? getNumber(nextValue) - getNumber(currentValue)
        : nextValue.localeCompare(currentValue);
    }
  });

  tableBody.append(...sorted);
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
  <label> Name:
    <input type="text" name="name" data-qa="name" required>
  </label>
  <label> Position:
    <input type="text" name="position" data-qa="position" required>
  </label>
  <label> Office:
    <select id="country" data-qa="office" required>
      <option value="Tokyo">Tokyo</option>
      <option value="Singapore">Singapore</option>
      <option value="London">London</option>
      <option value="New York">New York</option>
      <option value="Edinburgh">Edinburgh</option>
      <option value=San Francisco">San Francisco</option>
    </select>
  </label>
  <label> Age:
    <input type="number" name="age" data-qa="age" required>
  </label>
  <label> Salary:
    <input type="number" name="salary" data-qa="salary" required>
  </label>
  <button type="submit"> Save to table </button>
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

  const minNameLength = 4;
  const minAge = 18;
  const maxAge = 90;

  if (employee.name.length <= minNameLength) {
    pushNotification('Warning message',
      'Sorry, but your name has to consist at least 4 letters', 'warning');

    return;
  } else if (employee.age < minAge || employee.age > maxAge) {
    pushNotification('Error message',
      'You can not add your profile due to your age', 'error');

    return;
  } else {
    pushNotification('Success message',
      'You have done it, you have added your profile', 'success');
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

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationText = document.createElement('p');

  notification.className = 'notification';
  notification.classList.add(type);

  notificationTitle.innerText = title;
  notificationTitle.className = 'title';

  notificationText.innerText = description;

  body.append(notification);
  notification.append(notificationTitle, notificationText);

  setTimeout(function() {
    return notification.remove();
  }, 3000);
};
