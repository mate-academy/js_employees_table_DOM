'use strict';

// write code here
const body = document.querySelector('body');
const thead = document.querySelector('thead');
const tbody = document.querySelector('tbody');

[...thead.firstElementChild.children].forEach(title => {
  title.dataset.clickedTitle = false;
});

function sortedEmployee(targetTitle) {
  const position = targetTitle.cellIndex;
  const tableRows = [...tbody.children];

  switch (targetTitle.innerText.toLowerCase()) {
    case 'name':
    case 'position':
    case 'office':
      tableRows.sort((prev, next) => {
        const firstElement = prev.children[position].innerText;
        const secondElement = next.children[position].innerText;

        return firstElement.localeCompare(secondElement);
      });
      break;

    case 'salary':
    case 'age':
      tableRows.sort((prev, next) => {
        let firstElement = prev.children[position].innerText;
        let secondElement = next.children[position].innerText;
        const regexp = new RegExp(/[^0-9]/g);

        firstElement = firstElement.replace(regexp, '');
        secondElement = secondElement.replace(regexp, '');

        return firstElement - secondElement;
      });
      break;
  }

  return tableRows;
}

const appendSortedEmployee = clickEvent => {
  const title = clickEvent.target.closest('th');

  if (title.dataset.clickedTitle === 'false') {
    tbody.append(...sortedEmployee(title));
    title.dataset.clickedTitle = true;
  } else {
    tbody.append(...sortedEmployee(title).reverse());
    title.dataset.clickedTitle = false;
  }
};

thead.addEventListener('click', appendSortedEmployee);

let previousActiveRow;

tbody.addEventListener('click', (clickEvent) => {
  const currentRow = clickEvent.target.closest('tr');

  if (previousActiveRow) {
    previousActiveRow.classList.remove('active');
  }

  previousActiveRow = currentRow;
  currentRow.classList.add('active');
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
        name="office"
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

form.addEventListener('submit', addNewEmployee);

function addNewEmployee(clickEvent) {
  clickEvent.preventDefault();

  const formData = new FormData(form);
  const newEmployeeData = Object.fromEntries(formData.entries());

  const minAge = 18;
  const maxAge = 90;
  const minNameLength = 4;

  if (newEmployeeData.name.length >= minNameLength
    && newEmployeeData.age >= minAge
    && newEmployeeData.age <= maxAge
    && newEmployeeData.position.length) {
    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${newEmployeeData.name}</td>
        <td>${newEmployeeData.position}</td>
        <td>${newEmployeeData.office}</td>
        <td>${newEmployeeData.age}</td>
        <td>$${Number(newEmployeeData.salary).toLocaleString('en')}</td>
      </tr>
  `);

    pushNotification(30, 10, 'Succsess',
      'Add new employee', 'success');

    [...inputs].forEach(input => {
      input.value = '';
    });
  }

  if (newEmployeeData.name.length < minNameLength) {
    return pushNotification(30, 10, 'Error',
      `Name length must be more than ${minNameLength} charecters`, 'error');
  }

  if (!newEmployeeData.position.length) {
    return pushNotification(370, 10, 'Error',
      'Should contain correct position', 'error');
  }

  if (newEmployeeData.age < minAge || newEmployeeData.age > maxAge) {
    return pushNotification(200, 10, 'Error',
      `Age must be more than ${minAge} and less than ${maxAge}`, 'error');
  }
}

const pushNotification = (posTop, posRight, title, description, type) => {
  const notification = document.createElement('div');
  const titleText = document.createElement('h2');
  const messageText = document.createElement('p');

  notification.dataset.qa = 'notification';
  notification.classList.add('notification', type);
  notification.style.top = posTop + 'px';
  notification.style.right = posRight + 'px';

  titleText.classList.add('title');
  titleText.textContent = `${title}`;

  messageText.textContent = `${description}`;

  body.append(notification);
  notification.append(titleText, messageText);

  setTimeout(() => {
    notification.remove();
  }, 4000);
};
