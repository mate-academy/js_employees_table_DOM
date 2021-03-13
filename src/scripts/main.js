'use strict';

// write code here
const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

[...thead.firstElementChild.children].forEach(title => {
  title.classList.toggle('check');
});

thead.addEventListener('click', sortedEmployee);

function sortedEmployee(clickEvent) {
  const arrOfEmployees = [...document.querySelectorAll('tbody > tr')];
  const indexOfElement = clickEvent.target.cellIndex;
  const title = clickEvent.target.closest('th');

  title.classList.toggle('check');

  arrOfEmployees.sort((prew, next) => {
    let firstElement = prew.children[indexOfElement].textContent;
    let secondElement = next.children[indexOfElement].textContent;

    if (firstElement.includes('$')) {
      const regexp = new RegExp(/[^0-9]/g);

      firstElement = firstElement.replace(regexp, '');
      secondElement = secondElement.replace(regexp, '');
    }

    if (title.classList.value === '') {
      return isNaN(firstElement)
        ? firstElement.localeCompare(secondElement)
        : firstElement - secondElement;
    } else {
      return isNaN(firstElement)
        ? secondElement.localeCompare(firstElement)
        : secondElement - firstElement;
    }
  });

  tbody.append(...arrOfEmployees);
}

let activeRow = false;
let previousActiveRow;

tbody.addEventListener('click', (clickEvent) => {
  const currentRow = clickEvent.target.closest('tr');

  if (activeRow) {
    previousActiveRow.classList.remove('active');
  }

  previousActiveRow = currentRow;
  currentRow.classList.add('active');
  activeRow = true;
});

body.insertAdjacentHTML('beforeend', `
  <form class="new-employee-form">
    <label>Name:
    <input
      name="name"
      data-qa="name"
      type="text"
      required
    >
    </label>
    <label>Position:
      <input
        name="position"
        data-qa="position"
        type="text"
      >
    </label>
    <label>Office:
      <select
        name="position"
        data-qa="office"
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
        name="age"
        data-qa="age"
        type="number"
        required
      >
    </label>
    <label>Salary:
      <input
        name="salary"
        data-qa="salary"
        type="number"
        required
      >
    </label>
    <button>
      Save to table
    </button>
  </form>
`);

const form = document.querySelector('.new-employee-form');
const inputs = form.querySelectorAll('input');
const select = form.querySelector('select');

form.addEventListener('submit', addNewEmployee);

function addNewEmployee(clickEvent) {
  clickEvent.preventDefault();

  const formNameValue = inputs[0].value;
  const formPositionValue = inputs[1].value;
  const formSelectValue = select.value;
  const formAgeValue = inputs[2].value;
  const formSalaryValue = inputs[3].value;
  const minAge = 18;
  const maxAge = 90;
  const minNameLength = 4;

  if (formNameValue.length >= minNameLength
    && formAgeValue >= minAge
    && formAgeValue <= maxAge
    && formPositionValue.length) {
    tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${formNameValue}</td>
      <td>${formPositionValue}</td>
      <td>${formSelectValue}</td>
      <td>${formAgeValue}</td>
      <td>$${Number(formSalaryValue).toLocaleString('en')}</td>
    </tr>
  `);

    pushNotification(30, 10, 'Succsess',
      'Add new employee', 'success');

    [...inputs].forEach(input => {
      input.value = '';
    });
  }

  if (formNameValue.length < minNameLength) {
    return pushNotification(30, 10, 'Error',
      `Name length must be more than ${minNameLength} charecters`, 'error');
  }

  if (!formPositionValue.length) {
    return pushNotification(370, 10, 'Error',
      'Should contain correct position', 'error');
  }

  if (formAgeValue < minAge || formAgeValue > maxAge) {
    return pushNotification(200, 10, 'Error',
      `Age must be more than ${minAge} and less than ${maxAge}`, 'error');
  }
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const titleText = document.createElement('h2');
  const messageText = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification');
  notification.classList.add(type);
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  titleText.classList.add('title');
  titleText.textContent = `${title}`;

  messageText.textContent = `${description}`;

  body.append(notification);
  notification.append(titleText);
  notification.append(messageText);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};
