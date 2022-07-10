'use strict';

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');
const tableHeader = document.querySelector('thead');

const numbers = '/^[0-9]+$/';
const letters = '[^a-zA-Z -]';

let clickCounter = 0;
let checkElement;

function salaryToNumber(salary) {
  return +(salary.split('$').join('').split(',').join(''));
}

function stringToSalary(string) {
  return '$' + string.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

tableHeader.addEventListener('click', (e) => {
  const element = e.target.closest('th');
  const cols = table.querySelectorAll('thead th');
  const index = [...cols].indexOf(element);
  const sortedRows = [...tableBody.querySelectorAll('tr')];

  clickCounter++;

  if (checkElement !== element) {
    clickCounter = 1;
  }

  checkElement = element;

  sortedRows.sort((a, b) => {
    const elementA = a.children[index].innerText;
    const elementB = b.children[index].innerText;

    if (element.innerText.toLowerCase() === 'salary') {
      return (clickCounter % 2 === 1)
        ? salaryToNumber(elementA) - salaryToNumber(elementB)
        : salaryToNumber(elementB) - salaryToNumber(elementA);
    }

    if (element) {
      return (clickCounter % 2 === 1)
        ? elementA.localeCompare(elementB)
        : elementB.localeCompare(elementA);
    }
  });

  tableBody.append(...sortedRows);
});

tableBody.addEventListener('click', (e) => {
  const element = e.target.closest('tr');
  const rowList = tableBody.querySelectorAll('tr');

  [...rowList].forEach(item => {
    item.classList.remove('active');
  });

  element.classList.add('active');
});

table.insertAdjacentHTML('afterend', `
  <form action="#" class="new-employee-form">
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
        type="text"
        data-qa="office"
      >
        <option value="Tokyo">Tokyo</option>
        <option value="Singapore">Singapore</option>
        <option value="London">London</option>
        <option value="NewYork">New York</option>
        <option value="Edinburgh">Edinburgh</option>
        <option value="SanFrancisco">San Francisco</option>
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

const pushNotification = (title, description, type) => {
  const notification = document.createElement('div');
  const notificationChild = document.body.querySelectorAll('.notification');

  document.body.append(notification);
  notification.classList.add('notification', `${type}`);
  notification.setAttribute('data-qa', 'notification');
  notification.style.boxSizing = 'border-box';

  notification.innerHTML = `
    <h2 class="title">
      ${title}
    </h2>
    <p>
      ${description}
    </p>
  `;

  [...notificationChild].forEach((item, index) => {
    item.attributes.style.value = `margin-right: ${(index + 1) * 25}vw`;
  });

  setTimeout(() => notification.remove(), 5000);
};

const form = document.querySelector('.new-employee-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const newEmployeeName = data.get('name');
  const newEmployeePosition = data.get('position');
  const newEmployeeOffice = data.get('office');
  const newEmployeeAge = data.get('age');
  const newEmployeeSalary = data.get('salary');

  if (newEmployeeName === null || newEmployeeName === '') {
    pushNotification(
      'Warning!',
      'Name cannot be blank &#128521',
      'warning');

    return;
  }

  if (newEmployeeName.match(letters)) {
    pushNotification(
      'Oh no!',
      'Invalid name given. Use only letters &#128556',
      'error');

    return;
  }

  if (newEmployeeName.length < 4) {
    pushNotification(
      'Oh no!',
      'Name must be at least 4 letters long &#128556;',
      'error');

    return;
  }

  if (newEmployeePosition === null || newEmployeePosition === '') {
    pushNotification(
      'Warning!',
      'Position cannot be blank &#128521',
      'warning');

    return;
  }

  if (newEmployeePosition.match(letters)) {
    pushNotification(
      'Oh no!',
      'Invalid position given. Use only letters &#128556',
      'error');

    return;
  }

  if (newEmployeeAge === null || newEmployeeAge === '') {
    pushNotification(
      'Warning!',
      'Age cannot be blank &#128521',
      'warning');

    return;
  }

  if (newEmployeeAge < 18 || newEmployeeAge > 90) {
    pushNotification(
      'Oh no!',
      'Age must be between 18 and 90 &#128556;',
      'error');

    return;
  }

  if (newEmployeeSalary === null || newEmployeeSalary === '') {
    pushNotification(
      'Warning!',
      'Salary cannot be blank &#128521',
      'warning');

    return;
  }

  tableBody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${newEmployeeName}</td>
      <td>${newEmployeePosition}</td>
      <td>${newEmployeeOffice}</td>
      <td>${newEmployeeAge}</td>
      <td>${stringToSalary(newEmployeeSalary)}</td>
    </tr>
  `);

  pushNotification(
    'Congratulations!',
    'New employee has been added successfully &#129321;',
    'success');

  form.reset();
});

tableBody.addEventListener('dblclick', (e) => {
  const element = e.target.closest('td');
  const cellValue = element.innerText;

  const headers = table.querySelectorAll('thead th');
  const headersList = [...headers].map(header => header.innerText);
  const currentHeader = headersList.findIndex(
    (header, headerIndex) => headerIndex === element.cellIndex);

  let editOption;

  if (headersList[currentHeader].toLowerCase() === 'office') {
    editOption = document.createElement('select');

    const selectOffice = document.querySelector('form select');
    const selectOptions = [...selectOffice.options].map(
      option => option.innerText);

    selectOptions.forEach(option =>
      editOption.insertAdjacentHTML('beforeend', `
        <option value="${option}">${option}</option>
    `));
  } else {
    editOption = document.createElement('input');
  }

  editOption.classList.add('cell-input');
  editOption.style.width = `${element.offsetWidth - 18}px`;

  element.innerText = '';
  element.appendChild(editOption);
  editOption.focus();

  const inputEditNotification = () => {
    if (headersList[currentHeader].toLowerCase() === 'name') {
      if (editOption.value.match(letters) || editOption.value.length < 4) {
        element.innerText = cellValue;

        pushNotification(
          'Oh no!',
          'Invalid name given. Use only letters and at least 4 long &#128556',
          'error');
      } else {
        element.innerText = editOption.value;

        pushNotification(
          'Success',
          'Successfully changed &#129321;',
          'success');
      }
    }

    if (headersList[currentHeader].toLowerCase() === 'position') {
      if (editOption.value.match(letters)
        || editOption.value.length < 1) {
        element.innerText = cellValue;

        pushNotification(
          'Oh no!',
          'Invalid position given. Use only letters &#128556',
          'error');
      } else {
        element.innerText = editOption.value;

        pushNotification(
          'Success',
          'Successfully changed &#129321;',
          'success');
      }
    }

    if (headersList[currentHeader].toLowerCase() === 'office') {
      if (!editOption.value) {
        element.value = editOption.value;
      } else {
        element.innerText = editOption.value;
      }

      pushNotification(
        'Success',
        'Successfully changed &#129321;',
        'success');
    }

    if (headersList[currentHeader].toLowerCase() === 'age') {
      if (editOption.value.match(numbers)
        || !editOption.value.match(letters)
        || editOption.value < 18
        || editOption.value > 90) {
        element.innerText = cellValue;

        pushNotification(
          'Oh no!',
          'Invalid age given. Use only numbers between 18 and 90 &#128556;',
          'error');
      } else {
        element.innerText = editOption.value;

        pushNotification(
          'Success',
          'Successfully changed &#129321;',
          'success');
      }
    }

    if (headersList[currentHeader].toLowerCase() === 'salary') {
      if (editOption.value.match(numbers)
        || !editOption.value.match(letters)) {
        element.innerText = cellValue;

        pushNotification(
          'Oh no!',
          'Invalid salary given. Use only numbers &#128556',
          'error');
      } else {
        element.innerText = stringToSalary(editOption.value);

        pushNotification(
          'Success',
          'Successfully changed &#129321;',
          'success');
      }
    }
  };

  editOption.addEventListener('keydown', (inputEditEvent) => {
    if (inputEditEvent.key !== 'Enter') {
      return;
    }

    inputEditNotification();
  });

  editOption.addEventListener('blur', () => {
    if (editOption.value.length === 0) {
      editOption.innerText = cellValue;

      pushNotification(
        'Warning!',
        'Input value cannot be blank &#128521',
        'warning');
    }

    inputEditNotification();
  });
});
