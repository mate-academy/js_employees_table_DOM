'use strict';

const body = document.body;
const thead = document.querySelector('thead');
const titles = thead.querySelectorAll('th');
const tbody = document.querySelector('tbody');
const employes = tbody.rows;
const form = document.createElement('form');
const success = 'success';
const error = 'error';
let clickedTitle = null;
let prevEmployeeName = '';
let notificationMessage = '';
let cellIsClicked = false;

form.className = 'new-employee-form';

// Сортування списку
thead.addEventListener('click', e => {
  const title = e.target.closest('th');
  const sortedTbody = document.createElement('tbody');
  const titleIndex = getItemIndex(titles, title);

  const sortedEmployes = [...employes].sort((prev, current) => {
    const prevText = prev.children[titleIndex].textContent;
    const currentText = current.children[titleIndex].textContent;

    if (title.textContent === 'Age' || title.textContent === 'Salary') {
      return (clickedTitle === title)
        ? convertToNumber(currentText) - convertToNumber(prevText)
        : convertToNumber(prevText) - convertToNumber(currentText);
    }

    return (clickedTitle === title)
      ? currentText.localeCompare(prevText)
      : prevText.localeCompare(currentText);
  });

  sortedTbody.append(...sortedEmployes);
  tbody.innerHTML = sortedTbody.innerHTML;

  clickedTitle = (clickedTitle === title)
    ? null
    : title;
});

// Виділення працівника
tbody.addEventListener('click', e => {
  const tr = e.target.closest('tr');

  for (const employee of employes) {
    if (employee.children[0].textContent === prevEmployeeName) {
      employee.classList.toggle('active');
    }
  }

  tr.classList.toggle('active');
  prevEmployeeName = tr.children[0].textContent;
});

// Додавання форми
form.insertAdjacentHTML('afterbegin', `
  <label>
    Name:
    <input name="name" type="text" data-qa="name" required>
  </label>

  <label>
    Position:
    <input name="position" type="text" data-qa="name" required>
  </label>

  <label>
    Office:
    <select name="office" data-qa="office" required>
      <option value="tokyo">
        Tokyo
      </option>
      <option value="singapore">
        Singapore
      </option>
      <option value="london">
        London
      </option>
      <option value="new york">
        New York
      </option>
      <option value="edinburgh">
        Edinburgh
      </option>
      <option value="san francisco">
        San Francisco 
      </option>
    </select>
  </label>

  <label>
    Age:
    <input name="age" type="number" data-qa="age" required>
  </label>

  <label>
    Salary:
    <input name="salary" type="number" data-qa="salary" required>
  </label>

  <button>Save to table</button>
`);
body.append(form);

// Додавання нового працівника
form.addEventListener('submit', e => {
  e.preventDefault();

  const data = new FormData(form);
  const dataObject = Object.fromEntries(data.entries());
  const fullName = convertString(dataObject.name);
  const position = convertString(dataObject.position);
  const office = convertString(dataObject.office);
  const age = dataObject.age;
  const salary = convertSalary(dataObject.salary);

  if (checkNameValidity(fullName) || !checkAgeValidity(age)) {
    return;
  }

  tbody.insertAdjacentHTML('beforeend', `
    <tr>
      <td>${fullName}</td>
      <td>${position}</td>
      <td>${office}</td>
      <td>${age}</td>
      <td>${salary}</td>
    </tr>
  `);

  notificationMessage = 'New employee added!';
  showNotification(success, notificationMessage);
});

// Редагування списку
tbody.addEventListener('dblclick', e => {
  const tr = e.target.closest('tr');
  const td = e.target.closest('td');
  const labels = document.querySelectorAll('label');
  const itemIndex = getItemIndex(tr.children, td);

  const input = labels[itemIndex].children[0].cloneNode(true);

  input.className = 'cell-input';

  const oldText = (input.name === 'salary')
    ? td.textContent.replace(/\D/g, '')
    : td.textContent;

  if (cellIsClicked === false) {
    cellIsClicked = true;
    td.textContent = '';
    input.value = oldText;
    td.append(input);

    input.focus();

    input.onblur = function() {
      switch (true) {
        case input.value === '':
          td.textContent = oldText;
          break;

        case input.name === 'name':
          if (checkNameValidity(input.value)) {
            td.textContent = oldText;
            break;
          }
          td.textContent = convertString(input.value);
          break;

        case input.name === 'position':
        case input.name === 'office':
          td.textContent = convertString(input.value);
          break;

        case input.name === 'age':
          if (!checkAgeValidity(input.value)) {
            td.textContent = oldText;
            break;
          }
          td.textContent = input.value;
          break;

        case input.name === 'salary':
          td.textContent = convertSalary(input.value);
      };
      cellIsClicked = false;
      input.remove();
    };
  }

  input.addEventListener('keydown', anEvent => {
    if (anEvent.key === 'Enter') {
      input.onblur();
    }
  });
});

// Функції

function convertToNumber(string) {
  return +string.replace(/\D/g, '');
}

function convertString(string) {
  const arr = string.split(' ');
  let newString = '';

  for (const value of arr) {
    if (value !== '') {
      newString += value[0].toUpperCase() + value.slice(1).toLowerCase() + ' ';
    }
  }

  return newString.trim();
}

function convertSalary(string) {
  return `$${string.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function showNotification(condition, message) {
  const oldNotification = body.querySelector('#notification');

  if (oldNotification) {
    oldNotification.remove();
  }

  const notification = document.createElement('div');
  const notificationTitle = document.createElement('h2');
  const notificationDescription = document.createElement('p');

  notification.id = 'notification';
  notification.className = `notification ${condition}`;
  notification.setAttribute('data-qa', 'notification');
  notificationTitle.className = 'title';
  notificationTitle.textContent = convertString(condition);
  notificationDescription.textContent = message;
  notification.append(notificationTitle, notificationDescription);
  body.append(notification);
  setTimeout(() => notification.remove(), 3000);
}

function checkNameValidity(value) {
  if (value.length < 4) {
    notificationMessage = 'Name must contain more than three letters!';
    showNotification(error, notificationMessage);

    return true;
  }
}

function checkAgeValidity(age) {
  if (+age < 18) {
    notificationMessage = 'The employee must be over than 18 years old!';
    showNotification(error, notificationMessage);

    return false;
  }

  if (+age > 90) {
    notificationMessage = 'The employee must be under than 90 years of age!';
    showNotification(error, notificationMessage);

    return false;
  }

  return true;
}

function getItemIndex(collection, item) {
  return [...collection].indexOf(item);
}
